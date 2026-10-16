const PRIORITY = { hit: 0, attack: 1, strike: 2, complete: 3 };
const POSES = ['locomotion', 'attack', 'hit'];

function record(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function checkTime(at, label) {
  if (typeof at !== 'number' || !Number.isFinite(at) || at < 0) {
    throw new TypeError(`${label} must be a finite nonnegative number`);
  }
}

function validate(input) {
  if (!record(input)) throw new TypeError('input must be an object');
  if (!Array.isArray(input.events)) throw new TypeError('events must be an array');
  if (!Array.isArray(input.sampleTimes)) throw new TypeError('sampleTimes must be an array');
  const idTypes = new Map();
  const requests = { attack: new Map(), hit: new Map() };
  const events = Array.from(input.events, (event, index) => {
    const label = `events[${index}]`;
    if (!record(event)) throw new TypeError(`${label} must be an object`);
    const { at, type, id } = event;
    checkTime(at, `${label}.at`);
    if (typeof type !== 'string' || !Object.hasOwn(PRIORITY, type)) {
      throw new TypeError(`${label}.type is unknown`);
    }
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new TypeError(`${label}.id must be a nonempty string`);
    }
    if (type === 'attack' || type === 'hit') {
      if (idTypes.has(id) && idTypes.get(id) !== type) {
        throw new TypeError(`${label}.id is reused for another action type`);
      }
      idTypes.set(id, type);
      if (requests[type].has(at) && requests[type].get(at) !== id) {
        throw new TypeError(`${label}: ambiguous ${type} requests at ${at}`);
      }
      requests[type].set(at, id);
    }
    return { at, type, id };
  });
  const seenTimes = new Set();
  const times = Array.from(input.sampleTimes, (at, index) => {
    checkTime(at, `sampleTimes[${index}]`);
    if (seenTimes.has(at)) throw new TypeError(`duplicate sampleTimes value: ${at}`);
    seenTimes.add(at);
    return { at, index };
  });
  return { events, times };
}

/** Evaluate fictional events in milliseconds; this is not an engine adapter. */
export function simulate(input) {
  const { events, times } = validate(input);
  events.sort((a, b) => a.at - b.at || PRIORITY[a.type] - PRIORITY[b.type]);
  times.sort((a, b) => a.at - b.at);
  const hitTimes = new Set(events.filter(({ type }) => type === 'hit').map(({ at }) => at));
  const seen = new Set();
  const acceptedStrikes = [];
  const samples = new Array(times.length);
  let active = null;
  let blend = { at: 0, duration: 0, from: { locomotion: 1, attack: 0, hit: 0 }, target: 'locomotion' };

  function weightsAt(at) {
    const u = blend.duration === 0 ? 1 : Math.min(1, (at - blend.at) / blend.duration);
    return Object.fromEntries(POSES.map((key) => [
      key, (1 - u) * blend.from[key] + (key === blend.target ? u : 0),
    ]));
  }

  function transition(at, target, duration) {
    blend = { at, duration, from: weightsAt(at), target };
  }

  function apply(event) {
    const { at, type, id } = event;
    if (type === 'attack' || type === 'hit') {
      // Even a suppressed request consumes its ID; replay must not revive it.
      if (seen.has(id)) return;
      seen.add(id);
      if (type === 'attack' && hitTimes.has(at)) return;
      active = { id, type, startedAt: at, struck: false };
      transition(at, type, type === 'attack' ? 250 : 100);
    } else if (type === 'strike') {
      if (!active || active.id !== id || active.type !== 'attack' || active.struck) return;
      const elapsed = at - active.startedAt;
      if (elapsed >= 140 && elapsed <= 200) {
        acceptedStrikes.push({ at, id });
        active.struck = true;
      }
    } else if (type === 'complete' && active?.id === id) {
      active = null;
      transition(at, 'locomotion', 100);
    }
  }

  let nextEvent = 0;
  for (const { at, index } of times) {
    while (nextEvent < events.length && events[nextEvent].at <= at) apply(events[nextEvent++]);
    samples[index] = {
      at, activeId: active?.id ?? null, state: active?.type ?? 'locomotion',
      weights: weightsAt(at), movementOwner: 'controller',
    };
  }
  // Strikes belong to the event timeline, including events after the last sample.
  while (nextEvent < events.length) apply(events[nextEvent++]);
  return { samples, acceptedStrikes };
}

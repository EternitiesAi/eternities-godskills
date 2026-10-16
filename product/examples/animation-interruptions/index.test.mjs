import test from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from './index.mjs';

function pose(sample, state, activeId, expected) {
  assert.equal(sample.state, state);
  assert.equal(sample.activeId, activeId);
  assert.equal(sample.movementOwner, 'controller');
  assert.deepEqual(Object.keys(sample.weights).sort(), ['attack', 'hit', 'locomotion']);
  for (const [key, value] of Object.entries(expected)) {
    assert.ok(Math.abs(sample.weights[key] - value) < 1e-12,
      `${key} at ${sample.at}: expected ${value}, got ${sample.weights[key]}`);
  }
}

test('starts in locomotion and keeps the caller sample order', () => {
  const result = simulate({ events: [], sampleTimes: [20, 0, 10] });
  assert.deepEqual(result.acceptedStrikes, []);
  assert.deepEqual(result.samples.map(({ at }) => at), [20, 0, 10]);
  for (const sample of result.samples) {
    pose(sample, 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
  }
  assert.deepEqual(simulate({ events: [], sampleTimes: [] }), {
    samples: [], acceptedStrikes: [],
  });
});

test('hit cancels authorization while the old attack pose continues fading', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 100, type: 'hit', id: 'h' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 250, type: 'complete', id: 'a' },
    ],
    sampleTimes: [0, 100, 150, 250],
  });
  pose(result.samples[0], 'attack', 'a', { locomotion: 1, attack: 0, hit: 0 });
  pose(result.samples[1], 'hit', 'h', { locomotion: 0.6, attack: 0.4, hit: 0 });
  pose(result.samples[2], 'hit', 'h', { locomotion: 0.3, attack: 0.2, hit: 0.5 });
  pose(result.samples[3], 'hit', 'h', { locomotion: 0, attack: 0, hit: 1 });
  assert.deepEqual(result.acceptedStrikes, []);
});

test('accepts only one strike inside the inclusive elapsed window', () => {
  for (const [elapsed, accepted] of [
    [139.999, false], [140, true], [200, true], [200.001, false],
  ]) {
    const result = simulate({
      events: [
        { at: 500, type: 'attack', id: 'a' },
        { at: 500 + elapsed, type: 'strike', id: 'a' },
        { at: 500 + elapsed, type: 'strike', id: 'a' },
      ],
      sampleTimes: [],
    });
    assert.deepEqual(result.acceptedStrikes,
      accepted ? [{ at: 500 + elapsed, id: 'a' }] : []);
  }
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 139, type: 'strike', id: 'a' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 180, type: 'strike', id: 'a' },
      { at: 200, type: 'strike', id: 'a' },
    ],
    sampleTimes: [],
  });
  assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: 'a' }]);
});

test('coalesces repeats without restarting or reviving retired attacks', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 100, type: 'attack', id: 'a' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 150, type: 'complete', id: 'a' },
      { at: 160, type: 'attack', id: 'a' },
      { at: 190, type: 'strike', id: 'a' },
    ],
    sampleTimes: [125, 150, 200, 250],
  });
  pose(result.samples[0], 'attack', 'a', { locomotion: 0.5, attack: 0.5, hit: 0 });
  pose(result.samples[1], 'locomotion', null, { locomotion: 0.4, attack: 0.6, hit: 0 });
  pose(result.samples[2], 'locomotion', null, { locomotion: 0.7, attack: 0.3, hit: 0 });
  pose(result.samples[3], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
  assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: 'a' }]);
});

test('a new action retargets an interrupted return blend from evaluated weights', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 100, type: 'complete', id: 'a' },
      { at: 150, type: 'hit', id: 'h' },
      { at: 160, type: 'hit', id: 'h' },
      { at: 170, type: 'complete', id: 'a' },
      { at: 260, type: 'complete', id: 'h' },
    ],
    sampleTimes: [150, 200, 250, 260, 310, 360],
  });
  pose(result.samples[0], 'hit', 'h', { locomotion: 0.8, attack: 0.2, hit: 0 });
  pose(result.samples[1], 'hit', 'h', { locomotion: 0.4, attack: 0.1, hit: 0.5 });
  pose(result.samples[2], 'hit', 'h', { locomotion: 0, attack: 0, hit: 1 });
  pose(result.samples[3], 'locomotion', null, { locomotion: 0, attack: 0, hit: 1 });
  pose(result.samples[4], 'locomotion', null, { locomotion: 0.5, attack: 0, hit: 0.5 });
  pose(result.samples[5], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
});

test('hit wins same-time arbitration independently of input order', () => {
  const events = [
    { at: 0, type: 'attack', id: 'old' },
    { at: 140, type: 'complete', id: 'old' },
    { at: 140, type: 'strike', id: 'old' },
    { at: 140, type: 'attack', id: 'suppressed' },
    { at: 140, type: 'hit', id: 'h' },
    { at: 160, type: 'attack', id: 'suppressed' },
    { at: 300, type: 'strike', id: 'suppressed' },
  ];
  for (const ordered of [events, events.toReversed(), [...events.slice(3), ...events.slice(0, 3)]]) {
    const result = simulate({ events: ordered, sampleTimes: [140, 190, 300] });
    pose(result.samples[0], 'hit', 'h', { locomotion: 0.44, attack: 0.56, hit: 0 });
    pose(result.samples[1], 'hit', 'h', { locomotion: 0.22, attack: 0.28, hit: 0.5 });
    pose(result.samples[2], 'hit', 'h', { locomotion: 0, attack: 0, hit: 1 });
    assert.deepEqual(result.acceptedStrikes, []);
  }
});

test('strike precedes matching completion at the same timestamp', () => {
  const result = simulate({
    events: [
      { at: 140, type: 'complete', id: 'a' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 0, type: 'attack', id: 'a' },
    ],
    sampleTimes: [140, 240],
  });
  assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: 'a' }]);
  pose(result.samples[0], 'locomotion', null, { locomotion: 0.44, attack: 0.56, hit: 0 });
  pose(result.samples[1], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
});

test('new attacks invalidate older callbacks even when reusing the attack pose', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 100, type: 'attack', id: 'b' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 150, type: 'complete', id: 'a' },
      { at: 240, type: 'strike', id: 'b' },
      { at: 250, type: 'complete', id: 'unknown' },
      { at: 250, type: 'strike', id: 'unknown' },
    ],
    sampleTimes: [225, 350],
  });
  pose(result.samples[0], 'attack', 'b', { locomotion: 0.3, attack: 0.7, hit: 0 });
  pose(result.samples[1], 'attack', 'b', { locomotion: 0, attack: 1, hit: 0 });
  assert.deepEqual(result.acceptedStrikes, [{ at: 240, id: 'b' }]);
});

test('sampling at different rates or across a hitch does not create strikes', () => {
  const events = [
    { at: 0, type: 'attack', id: 'a' },
    { at: 140, type: 'strike', id: 'a' },
    { at: 180, type: 'hit', id: 'h' },
  ];
  for (const sampleTimes of [[0, 150, 230], [0, 50, 100, 150, 180, 200, 230], [230]]) {
    const result = simulate({ events, sampleTimes });
    const last = result.samples.at(-1);
    pose(last, 'hit', 'h', { locomotion: 0.14, attack: 0.36, hit: 0.5 });
    assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: 'a' }]);
  }
  assert.deepEqual(simulate({
    events: [{ at: 0, type: 'attack', id: 'a' }], sampleTimes: [0, 1000],
  }).acceptedStrikes, []);
});

test('coalesces hit duplicates and applies hit priority even to repeated requests', () => {
  const result = simulate({
    events: [
      { at: 100, type: 'hit', id: 'h' },
      { at: 100, type: 'hit', id: 'h' },
      { at: 150, type: 'hit', id: 'h' },
      { at: 150, type: 'attack', id: 'a' },
      { at: 210, type: 'complete', id: 'h' },
      { at: 220, type: 'complete', id: 'h' },
    ],
    sampleTimes: [150, 200, 260, 310],
  });
  pose(result.samples[0], 'hit', 'h', { locomotion: 0.5, attack: 0, hit: 0.5 });
  pose(result.samples[1], 'hit', 'h', { locomotion: 0, attack: 0, hit: 1 });
  pose(result.samples[2], 'locomotion', null, { locomotion: 0.5, attack: 0, hit: 0.5 });
  pose(result.samples[3], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
});

test('unknown callbacks do not reserve future IDs or authorize hits as strikes', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'complete', id: 'future' },
      { at: 0, type: 'strike', id: 'future' },
      { at: 10, type: 'hit', id: 'future' },
      { at: 150, type: 'strike', id: 'future' },
    ],
    sampleTimes: [0, 150],
  });
  pose(result.samples[0], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
  pose(result.samples[1], 'hit', 'future', { locomotion: 0, attack: 0, hit: 1 });
  assert.deepEqual(result.acceptedStrikes, []);
});

test('same-time new attack revokes the previous attack before its strike', () => {
  const result = simulate({
    events: [
      { at: 0, type: 'attack', id: 'a' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 140, type: 'attack', id: 'b' },
      { at: 140, type: 'complete', id: 'a' },
      { at: 280, type: 'strike', id: 'b' },
    ],
    sampleTimes: [140],
  });
  pose(result.samples[0], 'attack', 'b', { locomotion: 0.44, attack: 0.56, hit: 0 });
  assert.deepEqual(result.acceptedStrikes, [{ at: 280, id: 'b' }]);
});

test('sorts copied input and leaves frozen input and output samples independent', () => {
  const input = Object.freeze({
    events: Object.freeze([
      Object.freeze({ at: 140, type: 'strike', id: '__proto__', cosmetic: true }),
      Object.freeze({ at: 0, type: 'attack', id: '__proto__' }),
      Object.freeze({ at: 0, type: 'attack', id: '__proto__' }),
    ]),
    sampleTimes: Object.freeze([250, 0, 125]),
  });
  const before = JSON.stringify(input);
  const result = simulate(input);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(result.samples.map(({ at }) => at), [250, 0, 125]);
  assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: '__proto__' }]);
  pose(result.samples[0], 'attack', '__proto__', { locomotion: 0, attack: 1, hit: 0 });
  pose(result.samples[1], 'attack', '__proto__', { locomotion: 1, attack: 0, hit: 0 });
  pose(result.samples[2], 'attack', '__proto__', { locomotion: 0.5, attack: 0.5, hit: 0 });
  result.samples[0].weights.attack = -100;
  pose(result.samples[2], 'attack', '__proto__', { locomotion: 0.5, attack: 0.5, hit: 0 });
});

test('returns accepted strikes chronologically even without chronological input', () => {
  const result = simulate({
    events: [
      { at: 500, type: 'strike', id: 'b' },
      { at: 360, type: 'attack', id: 'b' },
      { at: 140, type: 'strike', id: 'a' },
      { at: 0, type: 'attack', id: 'a' },
    ],
    sampleTimes: [10],
  });
  assert.deepEqual(result.acceptedStrikes, [{ at: 140, id: 'a' }, { at: 500, id: 'b' }]);
});

test('keeps finite weights for extreme finite times and fractional times', () => {
  const result = simulate({
    events: [{ at: 0.5, type: 'attack', id: 'a' }],
    sampleTimes: [0, 125.5, Number.MAX_VALUE],
  });
  pose(result.samples[0], 'locomotion', null, { locomotion: 1, attack: 0, hit: 0 });
  pose(result.samples[1], 'attack', 'a', { locomotion: 0.5, attack: 0.5, hit: 0 });
  pose(result.samples[2], 'attack', 'a', { locomotion: 0, attack: 1, hit: 0 });
});

// Each case catches accepting malformed data or silently choosing an ambiguous winner.
const invalidInputs = [
  ['missing input', undefined, /input/i],
  ['null input', null, /input/i],
  ['array input', [], /input/i],
  ['missing events', { sampleTimes: [] }, /events/i],
  ['non-array events', { events: {}, sampleTimes: [] }, /events/i],
  ['missing samples', { events: [] }, /sampleTimes/i],
  ['non-array samples', { events: [], sampleTimes: 0 }, /sampleTimes/i],
  ['null event', { events: [null], sampleTimes: [] }, /events/i],
  ['array event', { events: [[]], sampleTimes: [] }, /events/i],
  ['sparse events', { events: new Array(1), sampleTimes: [] }, /events/i],
  ['unknown event', { events: [{ at: 0, type: 'dance', id: 'a' }], sampleTimes: [] }, /type/i],
  ['prototype event type', { events: [{ at: 0, type: 'toString', id: 'a' }], sampleTimes: [] }, /type/i],
  ['missing ID', { events: [{ at: 0, type: 'attack' }], sampleTimes: [] }, /id/i],
  ['empty ID', { events: [{ at: 0, type: 'attack', id: '' }], sampleTimes: [] }, /id/i],
  ['blank ID', { events: [{ at: 0, type: 'attack', id: '  ' }], sampleTimes: [] }, /id/i],
  ['numeric ID', { events: [{ at: 0, type: 'attack', id: 1 }], sampleTimes: [] }, /id/i],
  ['missing time', { events: [{ type: 'attack', id: 'a' }], sampleTimes: [] }, /at/i],
  ['negative event time', { events: [{ at: -1, type: 'attack', id: 'a' }], sampleTimes: [] }, /at/i],
  ['string event time', { events: [{ at: '0', type: 'attack', id: 'a' }], sampleTimes: [] }, /at/i],
  ['NaN event time', { events: [{ at: NaN, type: 'attack', id: 'a' }], sampleTimes: [] }, /at/i],
  ['infinite event time', { events: [{ at: Infinity, type: 'attack', id: 'a' }], sampleTimes: [] }, /at/i],
  ['negative sample', { events: [], sampleTimes: [-1] }, /sampleTimes/i],
  ['NaN sample', { events: [], sampleTimes: [NaN] }, /sampleTimes/i],
  ['infinite sample', { events: [], sampleTimes: [Infinity] }, /sampleTimes/i],
  ['string sample', { events: [], sampleTimes: ['0'] }, /sampleTimes/i],
  ['null sample', { events: [], sampleTimes: [null] }, /sampleTimes/i],
  ['sparse samples', { events: [], sampleTimes: new Array(1) }, /sampleTimes/i],
  ['duplicate samples', { events: [], sampleTimes: [10, 0, 10] }, /duplicate/i],
  ['duplicate signed-zero samples', { events: [], sampleTimes: [0, -0] }, /duplicate/i],
  ['same ID across action types', {
    events: [{ at: 0, type: 'attack', id: 'a' }, { at: 300, type: 'hit', id: 'a' }],
    sampleTimes: [],
  }, /id/i],
  ['ambiguous attacks', {
    events: [{ at: 0, type: 'attack', id: 'a' }, { at: 0, type: 'attack', id: 'b' }],
    sampleTimes: [],
  }, /ambiguous/i],
  ['ambiguous hits', {
    events: [{ at: 0, type: 'hit', id: 'h' }, { at: 0, type: 'hit', id: 'j' }],
    sampleTimes: [],
  }, /ambiguous/i],
  ['ambiguous suppressed attacks', {
    events: [
      { at: 0, type: 'attack', id: 'a' }, { at: 0, type: 'attack', id: 'b' },
      { at: 0, type: 'hit', id: 'h' },
    ],
    sampleTimes: [],
  }, /ambiguous/i],
];

for (const [label, input, error] of invalidInputs) {
  test(`rejects ${label} explicitly`, () => {
    assert.throws(() => simulate(input), error);
  });
}

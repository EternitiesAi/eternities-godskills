// Frozen from the fixed spec before reading author implementations or tests.
// GODSKILLS_EXAMPLE_ROOT names the directory containing the three example folders.
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const exampleRoot = process.env.GODSKILLS_EXAMPLE_ROOT
  ? resolve(process.env.GODSKILLS_EXAMPLE_ROOT)
  : fileURLToPath(new URL('../../../../product/examples/', import.meta.url));
const { analyzeFlow } = await import(pathToFileURL(resolve(exampleRoot, 'constraint-diagnosis/index.mjs')));
const { summarizeOnboarding } = await import(pathToFileURL(resolve(exampleRoot, 'onboarding-cohorts/index.mjs')));
const { simulate } = await import(pathToFileURL(resolve(exampleRoot, 'animation-interruptions/index.mjs')));

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

// Check both ordinary mutable caller data and recursively frozen caller data.
// No mocks, implementation helpers, or calculated reference implementation.
function callUnchanged(fn, input) {
  const before = structuredClone(input);
  try { fn(input); }
  finally { assert.deepStrictEqual(input, before, 'ordinary input mutated'); }
  const frozen = freeze(structuredClone(before));
  let result;
  try { result = fn(frozen); }
  finally { assert.deepStrictEqual(frozen, before, 'frozen input mutated'); }
  return result;
}

function rejectsUnchanged(fn, input) {
  const before = structuredClone(input);
  assert.throws(() => {
    try { fn(input); }
    finally { assert.deepStrictEqual(input, before, 'invalid input mutated'); }
  });
  // Outside assert.throws so a mutation assertion cannot masquerade as validation.
  assert.deepStrictEqual(input, before, 'invalid input mutated');
}

const select = (value, keys) => Object.fromEntries(keys.map(key => [key, value[key]]));
const flowKeys = ['id', 'readyHours', 'blockedHours', 'reworkHours', 'requiredReadyHours', 'shortfallHours', 'spareHours'];
function checkFlow(input, expected) {
  const actual = callUnchanged(analyzeFlow, input).resources;
  assert.ok(Array.isArray(actual));
  assert.equal(actual.length, expected.length);
  for (const want of expected) {
    const matches = actual.filter(row => row.id === want.id);
    assert.equal(matches.length, 1, `one output for resource ${want.id}`);
    assert.deepStrictEqual(select(matches[0], flowKeys), want);
  }
}
function basicFlow() {
  return {
    resources: [{ id: 'review', availableHours: 12, reworkHours: 4 }],
    classes: [
      { id: 'standard', readyCount: 4, blockedCount: 0, effortHours: { review: 1 } },
      { id: 'complex', readyCount: 2, blockedCount: 0, effortHours: { review: 3 } },
    ],
  };
}

test('A01 shared capacity and rework counted once across classes', () => {
  checkFlow(basicFlow(), [{ id: 'review', readyHours: 10, blockedHours: 0, reworkHours: 4, requiredReadyHours: 14, shortfallHours: 2, spareHours: 0 }]);
});
test('A02 blocked work is future demand; separate resources retain fractional spare', () => {
  checkFlow({
    resources: [{ id: 'r', availableHours: 5, reworkHours: 0.5 }, { id: 's', availableHours: 2, reworkHours: 0 }],
    classes: [
      { id: 'x', readyCount: 2, blockedCount: 3, effortHours: { r: 1.25, s: 0.5 } },
      { id: 'y', readyCount: 0, blockedCount: 4, effortHours: { r: 2, s: 1 } },
    ],
  }, [
    { id: 'r', readyHours: 2.5, blockedHours: 11.75, reworkHours: 0.5, requiredReadyHours: 3, shortfallHours: 0, spareHours: 2 },
    { id: 's', readyHours: 1, blockedHours: 5.5, reworkHours: 0, requiredReadyHours: 1, shortfallHours: 0, spareHours: 1 },
  ]);
});
test('A03 empty lists are valid when no references exist', () => {
  checkFlow({ resources: [], classes: [] }, []);
});
test('A04 rework remains demand with no classes and zero available capacity', () => {
  checkFlow({ resources: [{ id: 'r', availableHours: 0, reworkHours: 2 }], classes: [] },
    [{ id: 'r', readyHours: 0, blockedHours: 0, reworkHours: 2, requiredReadyHours: 2, shortfallHours: 2, spareHours: 0 }]);
});
test('A05 duplicate resource IDs are rejected', () => {
  const input = basicFlow(); input.resources.push({ ...input.resources[0] });
  rejectsUnchanged(analyzeFlow, input);
});
test('A06 duplicate class IDs are rejected', () => {
  const input = basicFlow(); input.classes[1].id = 'standard';
  rejectsUnchanged(analyzeFlow, input);
});
test('A07 unknown resource references cannot disappear with zero counts', () => {
  rejectsUnchanged(analyzeFlow, { resources: [], classes: [{ id: 'x', readyCount: 0, blockedCount: 0, effortHours: { ghost: 1 } }] });
});
test('A08 a missing required rework field is not silently defaulted', () => {
  const input = basicFlow(); delete input.resources[0].reworkHours;
  rejectsUnchanged(analyzeFlow, input);
});
test('A09 fractional ready counts are rejected', () => {
  const input = basicFlow(); input.classes[0].readyCount = 1.5;
  rejectsUnchanged(analyzeFlow, input);
});
test('A10 unsafe blocked counts are rejected', () => {
  const input = basicFlow(); input.classes[0].blockedCount = 9007199254740992;
  rejectsUnchanged(analyzeFlow, input);
});
test('A11 negative effort hours are rejected', () => {
  const input = basicFlow(); input.classes[0].effortHours.review = -1;
  rejectsUnchanged(analyzeFlow, input);
});
test('A12 nonfinite capacity is rejected', () => {
  const input = basicFlow(); input.resources[0].availableHours = Infinity;
  rejectsUnchanged(analyzeFlow, input);
});
test('A13 finite operands whose total demand overflows are rejected', () => {
  rejectsUnchanged(analyzeFlow, {
    resources: [{ id: 'r', availableHours: 0, reworkHours: Number.MAX_VALUE }],
    classes: [{ id: 'x', readyCount: 1, blockedCount: 0, effortHours: { r: Number.MAX_VALUE } }],
  });
});

const cohortKeys = ['matureCount', 'pendingCount', 'ineligibleCount', 'acceptedInWindowCount', 'acceptedAfterWindowCount', 'matureNonSuccessCount', 'matureRate', 'pendingAcceptedCount', 'completedMedianDays'];
const cohort = accounts => ({ cutoff: '2026-10-15T00:00:00.000Z', windowDays: 7, accounts });
const account = (id, overrides = {}) => ({ id, enteredAt: '2026-10-01T00:00:00.000Z', eligible: true, ...overrides });
function checkCohort(input, expected) {
  assert.deepStrictEqual(select(callUnchanged(summarizeOnboarding, input), cohortKeys), expected);
}

test('B01 missing and blocked mature outcomes stay in denominator; pending and ineligible stay out', () => {
  checkCohort(cohort([
    account('one', { acceptedAt: '2026-10-02T00:00:00.000Z' }),
    account('three', { acceptedAt: '2026-10-04T00:00:00.000Z' }),
    account('late', { acceptedAt: '2026-10-09T00:00:00.000Z' }),
    account('blocked', { acceptedAt: null, blocker: 'waiting for fictional input' }),
    account('pending-accepted', { enteredAt: '2026-10-10T00:00:00.000Z', acceptedAt: '2026-10-11T00:00:00.000Z' }),
    account('pending-unknown', { enteredAt: '2026-10-10T00:00:00.000Z' }),
    account('excluded', { eligible: false, acceptedAt: '2026-10-02T00:00:00.000Z' }),
  ]), { matureCount: 4, pendingCount: 2, ineligibleCount: 1, acceptedInWindowCount: 2, acceptedAfterWindowCount: 1, matureNonSuccessCount: 2, matureRate: 0.5, pendingAcceptedCount: 1, completedMedianDays: 2 });
});
test('B02 exact deadline is success and exact maturity is mature; one millisecond changes classification', () => {
  checkCohort(cohort([
    account('exact', { enteredAt: '2026-10-08T00:00:00.000Z', acceptedAt: '2026-10-15T00:00:00.000Z' }),
    account('late', { acceptedAt: '2026-10-08T00:00:00.001Z' }),
    account('young', { enteredAt: '2026-10-08T00:00:00.001Z', acceptedAt: '2026-10-08T00:00:00.001Z' }),
  ]), { matureCount: 2, pendingCount: 1, ineligibleCount: 0, acceptedInWindowCount: 1, acceptedAfterWindowCount: 1, matureNonSuccessCount: 1, matureRate: 0.5, pendingAcceptedCount: 1, completedMedianDays: 7 });
});
test('B03 zero mature denominator returns null rate and median despite pending acceptance', () => {
  checkCohort(cohort([
    account('young', { enteredAt: '2026-10-14T00:00:00.000Z', acceptedAt: '2026-10-14T12:00:00.000Z' }),
    account('excluded', { eligible: false }),
  ]), { matureCount: 0, pendingCount: 1, ineligibleCount: 1, acceptedInWindowCount: 0, acceptedAfterWindowCount: 0, matureNonSuccessCount: 0, matureRate: null, pendingAcceptedCount: 1, completedMedianDays: null });
});
test('B04 even median uses elapsed 24-hour days and only mature in-window successes', () => {
  checkCohort(cohort([
    account('six', { acceptedAt: '2026-10-07T00:00:00.000Z' }),
    account('half', { acceptedAt: '2026-10-01T12:00:00.000Z' }),
    account('three', { acceptedAt: '2026-10-04T00:00:00.000Z' }),
    account('one-half', { acceptedAt: '2026-10-02T12:00:00.000Z' }),
  ]), { matureCount: 4, pendingCount: 0, ineligibleCount: 0, acceptedInWindowCount: 4, acceptedAfterWindowCount: 0, matureNonSuccessCount: 0, matureRate: 1, pendingAcceptedCount: 0, completedMedianDays: 2.25 });
});
test('B05 duplicate IDs are invalid even when one row is ineligible', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a'), account('a', { eligible: false })]));
});
test('B06 empty account ID is rejected', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('')]));
});
test('B07 eligibility is boolean rather than truthy coercion', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { eligible: 'false' })]));
});
test('B08 a zero observation window is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, { ...cohort([account('a')]), windowDays: 0 });
});
test('B09 timestamps must represent real calendar dates, including on ineligible rows', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { eligible: false, enteredAt: '2026-02-30T00:00:00.000Z' })]));
});
test('B10 equivalent offset timestamps still fail the explicit-Z contract', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { enteredAt: '2026-10-01T00:00:00.000+00:00' })]));
});
test('B11 entry after cutoff is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { enteredAt: '2026-10-15T00:00:00.001Z' })]));
});
test('B12 acceptance before entry is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { acceptedAt: '2026-09-30T23:59:59.999Z' })]));
});
test('B13 acceptance after cutoff is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { acceptedAt: '2026-10-15T00:00:00.001Z' })]));
});
test('B14 an empty blocker string is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, cohort([account('a', { blocker: '' })]));
});
test('B15 a finite window that overflows elapsed milliseconds is invalid', () => {
  rejectsUnchanged(summarizeOnboarding, { ...cohort([account('a')]), windowDays: Number.MAX_VALUE });
});
test('B16 setup metadata must be rejected or ignored, never treated as acceptance', () => {
  const input = cohort([account('a', { setupAt: '2026-10-02T00:00:00.000Z' })]);
  const before = structuredClone(input);
  let output;
  let rejected = false;
  try { output = summarizeOnboarding(input); }
  catch { rejected = true; }
  assert.deepStrictEqual(input, before);
  if (!rejected) {
    assert.deepStrictEqual(select(output, cohortKeys), { matureCount: 1, pendingCount: 0, ineligibleCount: 0, acceptedInWindowCount: 0, acceptedAfterWindowCount: 0, matureNonSuccessCount: 1, matureRate: 0, pendingAcceptedCount: 0, completedMedianDays: null });
    assert.deepStrictEqual(select(callUnchanged(summarizeOnboarding, input), cohortKeys), select(output, cohortKeys));
  }
  // Later README review must check documentation if the field is ignored.
});

const event = (at, type, id) => ({ at, type, id });
function checkSimulation(input, expectedSamples, expectedStrikes = []) {
  const output = callUnchanged(simulate, input);
  assert.ok(Array.isArray(output.samples));
  assert.equal(output.samples.length, expectedSamples.length);
  expectedSamples.forEach((want, index) => {
    const actual = output.samples[index];
    assert.equal(actual.at, want.at, 'input sample order must survive');
    assert.equal(actual.state, want.state);
    if (Object.hasOwn(want, 'activeId')) assert.equal(actual.activeId, want.activeId);
    assert.equal(actual.movementOwner, 'controller');
    for (const key of ['locomotion', 'attack', 'hit']) {
      assert.equal(typeof actual.weights[key], 'number');
      assert.ok(Number.isFinite(actual.weights[key]));
      assert.ok(Math.abs(actual.weights[key] - want.weights[key]) <= 1e-12, `${want.at}: ${key} weight`);
    }
  });
  assert.ok(Array.isArray(output.acceptedStrikes));
  assert.deepStrictEqual(output.acceptedStrikes.map(strike => select(strike, ['at', 'id'])).sort((a, b) => a.at - b.at), expectedStrikes);
}
const sample = (at, state, activeId, locomotion, attack, hit) => ({ at, state, activeId, weights: { locomotion, attack, hit } });

test('C01 initial pose is locomotion with controller ownership', () => {
  checkSimulation({ events: [], sampleTimes: [0, 50] }, [sample(0, 'locomotion', null, 1, 0, 0), sample(50, 'locomotion', null, 1, 0, 0)]);
});
test('C02 attack blends linearly for 250ms and does not auto-complete', () => {
  checkSimulation({ events: [event(0, 'attack', 'a')], sampleTimes: [0, 125, 250, 500] }, [sample(0, 'attack', 'a', 1, 0, 0), sample(125, 'attack', 'a', 0.5, 0.5, 0), sample(250, 'attack', 'a', 0, 1, 0), sample(500, 'attack', 'a', 0, 1, 0)]);
});
test('C03 hit cancels strike permission immediately while the previous attack pose remains', () => {
  checkSimulation({ events: [event(0, 'attack', 'a'), event(100, 'hit', 'h'), event(140, 'strike', 'a'), event(250, 'complete', 'a')], sampleTimes: [100, 150, 250] }, [sample(100, 'hit', 'h', 0.6, 0.4, 0), sample(150, 'hit', 'h', 0.3, 0.2, 0.5), sample(250, 'hit', 'h', 0, 0, 1)]);
});
test('C04 another transition starts from evaluated mixed weights, not a named pose', () => {
  checkSimulation({ events: [event(0, 'attack', 'a'), event(100, 'hit', 'h'), event(150, 'attack', 'b')], sampleTimes: [150, 275, 400] }, [sample(150, 'attack', 'b', 0.3, 0.2, 0.5), sample(275, 'attack', 'b', 0.15, 0.6, 0.25), sample(400, 'attack', 'b', 0, 1, 0)]);
});
test('C05 repeated attack requests neither restart the clock nor revive a retired ID', () => {
  checkSimulation({ events: [event(0, 'attack', 'a'), event(50, 'attack', 'a'), event(140, 'strike', 'a'), event(150, 'hit', 'h'), event(200, 'attack', 'a'), event(340, 'strike', 'a')], sampleTimes: [125, 300] }, [sample(125, 'attack', 'a', 0.5, 0.5, 0), sample(300, 'hit', 'h', 0, 0, 1)], [{ at: 140, id: 'a' }]);
});
test('C06 strikes accept 140ms and 200ms inclusively, reject 139ms and 201ms, and accept once', () => {
  checkSimulation({ events: [event(0, 'attack', 'a'), event(139, 'strike', 'a'), event(140, 'strike', 'a'), event(200, 'strike', 'a'), event(1000, 'attack', 'b'), event(1200, 'strike', 'b'), event(2000, 'attack', 'c'), event(2201, 'strike', 'c')], sampleTimes: [] }, [], [{ at: 140, id: 'a' }, { at: 1200, id: 'b' }]);
});
test('C07 matching completion blends to locomotion for 100ms; stale and unknown events cannot take ownership', () => {
  checkSimulation({ events: [event(250, 'complete', 'a'), event(0, 'attack', 'a'), event(300, 'strike', 'ghost'), event(290, 'complete', 'ghost')], sampleTimes: [350, 300] }, [
    { at: 350, state: 'locomotion', weights: { locomotion: 1, attack: 0, hit: 0 } },
    { at: 300, state: 'locomotion', weights: { locomotion: 0.5, attack: 0.5, hit: 0 } },
  ]);
});
test('C08 same-time hit beats attack and strike in either input order; samples follow all events', () => {
  const events = [event(0, 'attack', 'old'), event(140, 'attack', 'new'), event(140, 'strike', 'old'), event(140, 'hit', 'h'), event(140, 'complete', 'old')];
  const want = [sample(190, 'hit', 'h', 0.22, 0.28, 0.5), sample(140, 'hit', 'h', 0.44, 0.56, 0)];
  checkSimulation({ events, sampleTimes: [190, 140] }, want);
  checkSimulation({ events: [...events].reverse(), sampleTimes: [190, 140] }, want);
});
test('C09 a same-time strike precedes matching completion regardless of input order', () => {
  checkSimulation({ events: [event(140, 'complete', 'a'), event(140, 'strike', 'a'), event(0, 'attack', 'a')], sampleTimes: [190] }, [{ at: 190, state: 'locomotion', weights: { locomotion: 0.72, attack: 0.28, hit: 0 } }], [{ at: 140, id: 'a' }]);
});
test('C10 repeated hit requests coalesce without resetting the 100ms blend', () => {
  checkSimulation({ events: [event(0, 'hit', 'h'), event(50, 'hit', 'h')], sampleTimes: [75, 100] }, [sample(75, 'hit', 'h', 0.25, 0, 0.75), sample(100, 'hit', 'h', 0, 0, 1)]);
});
test('C11 an action ID cannot be reused for another type', () => {
  rejectsUnchanged(simulate, { events: [event(0, 'attack', 'a'), event(100, 'hit', 'a')], sampleTimes: [] });
});
test('C12 distinct same-type same-time actions are ambiguous', () => {
  rejectsUnchanged(simulate, { events: [event(0, 'attack', 'a'), event(0, 'attack', 'b')], sampleTimes: [] });
});
test('C13 duplicate sample times fail rather than silently deduplicate', () => {
  rejectsUnchanged(simulate, { events: [], sampleTimes: [0, 0] });
});
test('C14 unknown event types fail explicitly', () => {
  rejectsUnchanged(simulate, { events: [event(0, 'dance', 'a')], sampleTimes: [] });
});
test('C15 missing event IDs fail even on an otherwise stale completion', () => {
  rejectsUnchanged(simulate, { events: [{ at: 0, type: 'complete' }], sampleTimes: [] });
});
test('C16 malformed event and sample times are rejected, not coerced or dropped', () => {
  for (const input of [
    { events: [event('0', 'attack', 'a')], sampleTimes: [] },
    { events: [event(-1, 'attack', 'a')], sampleTimes: [] },
    { events: [], sampleTimes: [NaN] },
  ]) rejectsUnchanged(simulate, input);
});

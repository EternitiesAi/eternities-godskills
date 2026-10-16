import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeFlow } from './index.mjs';

function weeklyReview() {
  return {
    resources: [{ id: 'review', availableHours: 12, reworkHours: 4 }],
    classes: [
      { id: 'standard', readyCount: 4, blockedCount: 0, effortHours: { review: 1 } },
      { id: 'complex', readyCount: 2, blockedCount: 0, effortHours: { review: 3 } },
    ],
  };
}

// Catches cloned class capacity, omitted correction effort, and double-counted rework.
test('combines mixed classes against one shared resource and adds rework once', () => {
  assert.deepEqual(analyzeFlow(weeklyReview()), {
    resources: [{
      id: 'review', readyHours: 10, blockedHours: 0, reworkHours: 4,
      requiredReadyHours: 14, shortfallHours: 2, spareHours: 0,
    }],
  });
});

// Catches charging blocked work as currently ready and sharing hours between resources.
test('keeps blocked effort separate and preserves resource order with sparse effort maps', () => {
  assert.deepEqual(analyzeFlow({
    resources: [
      { id: 'review', availableHours: 10, reworkHours: 1 },
      { id: 'prepare', availableHours: 8, reworkHours: 0 },
    ],
    classes: [
      { id: 'standard', readyCount: 2, blockedCount: 3, effortHours: { review: 2, prepare: 1 } },
      { id: 'complex', readyCount: 1, blockedCount: 2, effortHours: { review: 3 } },
    ],
  }), {
    resources: [
      { id: 'review', readyHours: 7, blockedHours: 12, reworkHours: 1,
        requiredReadyHours: 8, shortfallHours: 0, spareHours: 2 },
      { id: 'prepare', readyHours: 2, blockedHours: 3, reworkHours: 0,
        requiredReadyHours: 2, shortfallHours: 0, spareHours: 6 },
    ],
  });
});

test('a large blocked backlog does not become a ready-work overload', () => {
  assert.deepEqual(analyzeFlow({
    resources: [{ id: 'review', availableHours: 3, reworkHours: 0 }],
    classes: [{ id: 'waiting', readyCount: 0, blockedCount: 20, effortHours: { review: 2 } }],
  }).resources, [{
    id: 'review', readyHours: 0, blockedHours: 40, reworkHours: 0,
    requiredReadyHours: 0, shortfallHours: 0, spareHours: 3,
  }]);
});

test('preventing two rework hours resolves only the modeled shortfall', () => {
  const scenario = weeklyReview();
  scenario.resources[0].reworkHours = 2;
  assert.deepEqual(analyzeFlow(scenario).resources, [{
    id: 'review', readyHours: 10, blockedHours: 0, reworkHours: 2,
    requiredReadyHours: 12, shortfallHours: 0, spareHours: 0,
  }]);
});

test('accepts fractional hours, zero effort and safe-integer counts', () => {
  assert.deepEqual(analyzeFlow({
    resources: [{ id: 'review', availableHours: 1.5, reworkHours: 0.25 }],
    classes: [
      { id: 'small', readyCount: 3, blockedCount: 1, effortHours: { review: 0.25 } },
      { id: 'zero', readyCount: Number.MAX_SAFE_INTEGER, blockedCount: 0, effortHours: { review: 0 } },
    ],
  }).resources, [{
    id: 'review', readyHours: 0.75, blockedHours: 0.25, reworkHours: 0.25,
    requiredReadyHours: 1, shortfallHours: 0, spareHours: 0.5,
  }]);
});

test('allows empty resources only when classes have no resource references', () => {
  assert.deepEqual(analyzeFlow({ resources: [], classes: [] }), { resources: [] });
  assert.deepEqual(analyzeFlow({
    resources: [],
    classes: [{ id: 'no-resource-work', readyCount: 1, blockedCount: 2, effortHours: {} }],
  }), { resources: [] });
  assert.throws(() => analyzeFlow({
    resources: [],
    classes: [{ id: 'orphan', readyCount: 0, blockedCount: 0, effortHours: { unknown: 0 } }],
  }), TypeError);
});

test('counts resource rework once even with no classes and handles zero capacity', () => {
  assert.deepEqual(analyzeFlow({
    resources: [{ id: 'review', availableHours: 0, reworkHours: 2 }], classes: [],
  }).resources, [{
    id: 'review', readyHours: 0, blockedHours: 0, reworkHours: 2,
    requiredReadyHours: 2, shortfallHours: 2, spareHours: 0,
  }]);
});

test('treats object-prototype names as resource IDs and keeps class IDs in their own namespace', () => {
  assert.deepEqual(analyzeFlow({
    resources: [{ id: '__proto__', availableHours: 4, reworkHours: 0 }],
    classes: [{ id: '__proto__', readyCount: 1, blockedCount: 0,
      effortHours: { ['__proto__']: 2 } }],
  }).resources, [{
    id: '__proto__', readyHours: 2, blockedHours: 0, reworkHours: 0,
    requiredReadyHours: 2, shortfallHours: 0, spareHours: 2,
  }]);
});

test('does not mutate frozen inputs or alias output records to input records', () => {
  const input = weeklyReview();
  const before = structuredClone(input);
  for (const row of input.resources) Object.freeze(row);
  for (const row of input.classes) {
    Object.freeze(row.effortHours);
    Object.freeze(row);
  }
  Object.freeze(input.resources);
  Object.freeze(input.classes);
  Object.freeze(input);
  const result = analyzeFlow(input);
  assert.equal(result.resources[0].requiredReadyHours, 14);
  result.resources[0].reworkHours = 99;
  assert.deepEqual(input, before);
});

// Each case catches accepting a malformed observation instead of reporting it.
const invalidShapes = [
  ['null input', null],
  ['array input', []],
  ['missing resources', { classes: [] }],
  ['missing classes', { resources: [] }],
  ['non-array resources', { resources: {}, classes: [] }],
  ['non-array classes', { resources: [], classes: {} }],
  ['unknown top-level field', { resources: [], classes: [], backlog: 20 }],
  ['null resource', { resources: [null], classes: [] }],
  ['array resource', { resources: [[]], classes: [] }],
  ...[
    ['missing resource id', { availableHours: 1, reworkHours: 0 }],
    ['empty resource id', { id: ' ', availableHours: 1, reworkHours: 0 }],
    ['numeric resource id', { id: 1, availableHours: 1, reworkHours: 0 }],
    ['missing available hours', { id: 'r', reworkHours: 0 }],
    ['missing rework hours', { id: 'r', availableHours: 1 }],
    ['unknown resource field', { id: 'r', availableHours: 1, reworkHours: 0, capacity: 5 }],
  ].map(([name, resource]) => [name, { resources: [resource], classes: [] }]),
  ...[
    ['null class', null],
    ['array class', []],
    ['missing class id', { readyCount: 1, blockedCount: 0, effortHours: {} }],
    ['empty class id', { id: '', readyCount: 1, blockedCount: 0, effortHours: {} }],
    ['missing ready count', { id: 'c', blockedCount: 0, effortHours: {} }],
    ['missing blocked count', { id: 'c', readyCount: 1, effortHours: {} }],
    ['missing effort map', { id: 'c', readyCount: 1, blockedCount: 0 }],
    ['null effort map', { id: 'c', readyCount: 1, blockedCount: 0, effortHours: null }],
    ['array effort map', { id: 'c', readyCount: 1, blockedCount: 0, effortHours: [] }],
    ['unknown class field', { id: 'c', readyCount: 1, blockedCount: 0, effortHours: {}, count: 7 }],
    ['unknown resource with zero work', { id: 'c', readyCount: 0, blockedCount: 0, effortHours: { absent: 0 } }],
  ].map(([name, row]) => [name, { resources: [], classes: [row] }]),
];

for (const [name, input] of invalidShapes) {
  test(`rejects ${name}`, () => assert.throws(() => analyzeFlow(input), TypeError));
}

test('rejects duplicate resource and duplicate class IDs', () => {
  const resources = weeklyReview();
  resources.resources.push({ ...resources.resources[0] });
  assert.throws(() => analyzeFlow(resources), TypeError);
  const classes = weeklyReview();
  classes.classes.push({ ...classes.classes[0] });
  assert.throws(() => analyzeFlow(classes), TypeError);
});

for (const value of [-1, NaN, Infinity, -Infinity, '2', null, undefined]) {
  test(`rejects invalid hours (${String(value)}) for capacity, rework and effort`, () => {
    for (const key of ['availableHours', 'reworkHours']) {
      const input = weeklyReview();
      input.resources[0][key] = value;
      assert.throws(() => analyzeFlow(input), RangeError);
    }
    const input = weeklyReview();
    input.classes[0].effortHours.review = value;
    assert.throws(() => analyzeFlow(input), RangeError);
  });
}

for (const value of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, NaN, Infinity, '2', null, undefined]) {
  test(`rejects invalid counts (${String(value)}) for ready and blocked work`, () => {
    for (const key of ['readyCount', 'blockedCount']) {
      const input = weeklyReview();
      input.classes[0][key] = value;
      assert.throws(() => analyzeFlow(input), RangeError);
    }
  });
}

test('validates efforts even when both counts are zero', () => {
  assert.throws(() => analyzeFlow({
    resources: [{ id: 'r', availableHours: 0, reworkHours: 0 }],
    classes: [{ id: 'c', readyCount: 0, blockedCount: 0, effortHours: { r: -1 } }],
  }), RangeError);
});

test('rejects overflow in ready and blocked effort multiplication or aggregation', () => {
  for (const key of ['readyCount', 'blockedCount']) {
    const row = { id: 'a', readyCount: 0, blockedCount: 0, effortHours: { r: Number.MAX_VALUE } };
    assert.throws(() => analyzeFlow({
      resources: [{ id: 'r', availableHours: 0, reworkHours: 0 }],
      classes: [{ ...row, [key]: 2 }],
    }), RangeError);
    assert.throws(() => analyzeFlow({
      resources: [{ id: 'r', availableHours: 0, reworkHours: 0 }],
      classes: [{ ...row, [key]: 1 }, { ...row, id: 'b', [key]: 1 }],
    }), RangeError);
  }
});

test('rejects overflow when rework is added to ready effort', () => {
  assert.throws(() => analyzeFlow({
    resources: [{ id: 'r', availableHours: 0, reworkHours: Number.MAX_VALUE }],
    classes: [{ id: 'c', readyCount: 1, blockedCount: 0, effortHours: { r: Number.MAX_VALUE } }],
  }), RangeError);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeOnboarding } from './index.mjs';

function inputFor(accounts, overrides = {}) {
  return { cutoff: '2026-10-15T00:00:00Z', windowDays: 7, accounts, ...overrides };
}

function account(overrides = {}) {
  return { id: 'a', enteredAt: '2026-10-01T00:00:00Z', eligible: true, ...overrides };
}

test('keeps blocked and unknown mature accounts in the denominator and pending successes out', () => {
  const result = summarizeOnboarding({
    cutoff: '2026-10-15T00:00:00.000Z',
    windowDays: 7,
    accounts: [
      { id: 'three-days', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-04T00:00:00Z' },
      { id: 'deadline', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-08T00:00:00Z' },
      { id: 'immediate', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-01T00:00:00Z' },
      { id: 'late', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: '2026-10-09T00:00:00Z' },
      { id: 'blocked', enteredAt: '2026-10-01T00:00:00Z', eligible: true, acceptedAt: null, blocker: 'Awaiting administrator permission' },
      { id: 'unknown', enteredAt: '2026-10-01T00:00:00Z', eligible: true },
      { id: 'pending-accepted', enteredAt: '2026-10-10T00:00:00Z', eligible: true, acceptedAt: '2026-10-12T00:00:00Z' },
      { id: 'pending-waiting', enteredAt: '2026-10-14T00:00:00Z', eligible: true },
      { id: 'ineligible', enteredAt: '2026-10-01T00:00:00Z', eligible: false, acceptedAt: '2026-10-03T00:00:00Z' },
    ],
  });
  assert.deepEqual(result, {
    matureCount: 6,
    pendingCount: 2,
    ineligibleCount: 1,
    acceptedInWindowCount: 3,
    acceptedAfterWindowCount: 1,
    matureNonSuccessCount: 3,
    matureRate: 0.5,
    pendingAcceptedCount: 1,
    completedMedianDays: 3,
  });
});

test('reproduces the method cohort without dropping its five unresolved mature outcomes', () => {
  const accounts = Array.from({ length: 9 }, (_, i) => account({
    id: `accepted-${i}`, acceptedAt: '2026-10-04T00:00:00Z',
  }));
  accounts.push(
    account({ id: 'permission-1', blocker: 'Administrator permission' }),
    account({ id: 'permission-2', blocker: 'Administrator permission' }),
    account({ id: 'error-1', blocker: 'Unresolved import error' }),
    account({ id: 'error-2', blocker: 'Unresolved import error' }),
    account({ id: 'missing-outcome' }),
    ...Array.from({ length: 6 }, (_, i) => account({ id: `pending-${i}`, enteredAt: '2026-10-12T00:00:00Z' })),
  );
  assert.deepEqual(summarizeOnboarding(inputFor(accounts)), {
    matureCount: 14, pendingCount: 6, ineligibleCount: 0,
    acceptedInWindowCount: 9, acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 5, matureRate: 9 / 14,
    pendingAcceptedCount: 0, completedMedianDays: 3,
  });
});

test('uses an inclusive millisecond deadline and excludes a success one millisecond late from the median', () => {
  assert.deepEqual(summarizeOnboarding(inputFor([
    account({ id: 'deadline', acceptedAt: '2026-10-08T00:00:00.000Z' }),
    account({ id: 'late', acceptedAt: '2026-10-08T00:00:00.001Z' }),
  ], { cutoff: '2026-10-08T00:00:00.001Z' })), {
    matureCount: 2, pendingCount: 0, ineligibleCount: 0,
    acceptedInWindowCount: 1, acceptedAfterWindowCount: 1,
    matureNonSuccessCount: 1, matureRate: 0.5,
    pendingAcceptedCount: 0, completedMedianDays: 7,
  });
});

test('changes a pending acceptance to a mature success only once its full window has elapsed', () => {
  const accounts = [account({ acceptedAt: '2026-10-02T00:00:00Z' })];
  assert.deepEqual(summarizeOnboarding(inputFor(accounts, { cutoff: '2026-10-07T23:59:59.999Z' })), {
    matureCount: 0, pendingCount: 1, ineligibleCount: 0,
    acceptedInWindowCount: 0, acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 0, matureRate: null,
    pendingAcceptedCount: 1, completedMedianDays: null,
  });
  assert.deepEqual(summarizeOnboarding(inputFor(accounts, { cutoff: '2026-10-08T00:00:00Z' })), {
    matureCount: 1, pendingCount: 0, ineligibleCount: 0,
    acceptedInWindowCount: 1, acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 0, matureRate: 1,
    pendingAcceptedCount: 0, completedMedianDays: 1,
  });
});

test('averages the two middle successful elapsed times and leaves frozen unsorted input unchanged', () => {
  const input = inputFor([
    account({ id: 'six', acceptedAt: '2026-10-07T00:00:00Z' }),
    account({ id: 'zero', acceptedAt: '2026-10-01T00:00:00Z' }),
    account({ id: 'four', acceptedAt: '2026-10-05T00:00:00Z' }),
    account({ id: 'two', acceptedAt: '2026-10-03T00:00:00Z', blocker: 'Historical blocker; acceptance is observed' }),
  ]);
  const before = structuredClone(input);
  input.accounts.forEach(Object.freeze);
  Object.freeze(input.accounts);
  Object.freeze(input);
  assert.equal(summarizeOnboarding(input).completedMedianDays, 3);
  assert.deepEqual(input, before);
});

test('counts fixed 24-hour days across a daylight-saving change and supports fractional windows', () => {
  assert.deepEqual(summarizeOnboarding(inputFor([
    account({ enteredAt: '2026-11-01T05:00:00Z', acceptedAt: '2026-11-01T17:00:00Z' }),
  ], { cutoff: '2026-11-01T17:00:00Z', windowDays: 0.5 })), {
    matureCount: 1, pendingCount: 0, ineligibleCount: 0,
    acceptedInWindowCount: 1, acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 0, matureRate: 1,
    pendingAcceptedCount: 0, completedMedianDays: 0.5,
  });
});

test('accepts real leap dates and one- or two-digit fractional seconds', () => {
  const result = summarizeOnboarding(inputFor([
    account({ enteredAt: '2024-02-29T00:00:00.1Z', acceptedAt: '2024-03-01T00:00:00.10Z' }),
  ], { cutoff: '2024-03-01T00:00:00.100Z', windowDays: 1 }));
  assert.equal(result.acceptedInWindowCount, 1);
  assert.equal(result.completedMedianDays, 1);
});

test('returns null rate and median for an empty eligible population', () => {
  const empty = {
    matureCount: 0, pendingCount: 0, ineligibleCount: 0,
    acceptedInWindowCount: 0, acceptedAfterWindowCount: 0,
    matureNonSuccessCount: 0, matureRate: null,
    pendingAcceptedCount: 0, completedMedianDays: null,
  };
  assert.deepEqual(summarizeOnboarding(inputFor([])), empty);
  assert.deepEqual(summarizeOnboarding(inputFor([
    account({ eligible: false, acceptedAt: '2026-10-02T00:00:00Z' }),
  ])), { ...empty, ineligibleCount: 1 });
});

test('reports zero success with null median when mature acceptance is missing or late', () => {
  assert.deepEqual(summarizeOnboarding(inputFor([
    account({ id: 'unknown' }),
    account({ id: 'null', acceptedAt: null, blocker: null }),
    account({ id: 'late', acceptedAt: '2026-10-15T00:00:00Z' }),
  ])), {
    matureCount: 3, pendingCount: 0, ineligibleCount: 0,
    acceptedInWindowCount: 0, acceptedAfterWindowCount: 1,
    matureNonSuccessCount: 3, matureRate: 0,
    pendingAcceptedCount: 0, completedMedianDays: null,
  });
});

const invalidInputs = [
  ['null input', null, /input/],
  ['array input', [], /input/],
  ['missing cutoff', { windowDays: 7, accounts: [] }, /cutoff/],
  ['missing window', { cutoff: '2026-10-15T00:00:00Z', accounts: [] }, /windowDays/],
  ['missing accounts', { cutoff: '2026-10-15T00:00:00Z', windowDays: 7 }, /accounts/],
  ['non-array accounts', inputFor({}), /accounts/],
  ['sparse accounts', inputFor(new Array(1)), /accounts\[0\]/],
  ['unknown top-level field', inputFor([], { timezone: 'UTC' }), /timezone/],
  ['zero window', inputFor([], { windowDays: 0 }), /windowDays/],
  ['negative window', inputFor([], { windowDays: -1 }), /windowDays/],
  ['string window', inputFor([], { windowDays: '7' }), /windowDays/],
  ['NaN window', inputFor([], { windowDays: NaN }), /windowDays/],
  ['infinite window', inputFor([], { windowDays: Infinity }), /windowDays/],
  ['overflowing window duration', inputFor([], { windowDays: Number.MAX_VALUE }), /windowDays/],
  ['overflowing deadline', inputFor([account()], { windowDays: 100_000_000 }), /deadline/],
  ['duplicate ID', inputFor([account(), account()]), /duplicate.*id/i],
];
for (const [name, input, error] of invalidInputs) {
  test(`rejects ${name}`, () => assert.throws(() => summarizeOnboarding(input), error));
}

const invalidAccounts = [
  ['null account', null, /accounts\[0\]/],
  ['missing ID', { enteredAt: '2026-10-01T00:00:00Z', eligible: true }, /id/],
  ['empty ID', account({ id: '' }), /id/],
  ['blank ID', account({ id: ' \t' }), /id/],
  ['numeric ID', account({ id: 42 }), /id/],
  ['missing entry', { id: 'a', eligible: true }, /enteredAt/],
  ['missing eligibility', { id: 'a', enteredAt: '2026-10-01T00:00:00Z' }, /eligible/],
  ['coerced eligibility', account({ eligible: 'true' }), /eligible/],
  ['numeric eligibility', account({ eligible: 1 }), /eligible/],
  ['unknown setup event', account({ setupAt: '2026-10-02T00:00:00Z' }), /setupAt/],
  ['empty blocker', account({ blocker: '' }), /blocker/],
  ['blank blocker', account({ blocker: '  ' }), /blocker/],
  ['non-string blocker', account({ blocker: false }), /blocker/],
  ['explicit undefined blocker', account({ blocker: undefined }), /blocker/],
  ['explicit undefined acceptance', account({ acceptedAt: undefined }), /acceptedAt/],
  ['entry after cutoff', account({ enteredAt: '2026-10-16T00:00:00Z' }), /enteredAt/],
  ['acceptance before entry', account({ acceptedAt: '2026-09-30T23:59:59.999Z' }), /acceptedAt/],
  ['acceptance after cutoff', account({ acceptedAt: '2026-10-15T00:00:00.001Z' }), /acceptedAt/],
  ['invalid ineligible observation', account({ eligible: false, acceptedAt: '2026-09-01T00:00:00Z' }), /acceptedAt/],
];
for (const [name, row, error] of invalidAccounts) {
  test(`rejects ${name}`, () => assert.throws(() => summarizeOnboarding(inputFor([row])), error));
}

const invalidTimestamps = [
  '', null, 123, new Date('2026-10-01T00:00:00Z'),
  '2026-10-01', '2026-10-01T00:00:00', '2026-10-01T00:00:00+00:00',
  '2026-10-01T00:00:00z', '2026-02-29T00:00:00Z', '2026-02-30T00:00:00Z',
  '2026-04-31T00:00:00Z', '2026-13-01T00:00:00Z', '2026-00-01T00:00:00Z',
  '2026-10-00T00:00:00Z', '2026-10-01T24:00:00Z', '2026-10-01T00:60:00Z',
  '2026-10-01T00:00:60Z', '2026-10-01T00:00:00.0001Z', '+999999-01-01T00:00:00Z',
];
for (const [i, timestamp] of invalidTimestamps.entries()) {
  test(`rejects invalid UTC timestamp case ${i + 1} in every timestamp field`, () => {
    assert.throws(() => summarizeOnboarding(inputFor([], { cutoff: timestamp })), /cutoff/);
    assert.throws(() => summarizeOnboarding(inputFor([account({ enteredAt: timestamp })])), /enteredAt/);
    if (timestamp !== null) {
      assert.throws(() => summarizeOnboarding(inputFor([account({ acceptedAt: timestamp })])), /acceptedAt/);
    }
  });
}

test('rejects an elapsed span exceeding safe millisecond arithmetic', () => {
  assert.throws(() => summarizeOnboarding(inputFor([
    account({ enteredAt: '-271821-04-20T00:00:00Z' }),
  ], { cutoff: '+275760-09-13T00:00:00Z' })), /elapsed|range|overflow/i);
});

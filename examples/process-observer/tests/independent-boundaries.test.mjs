import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { observeFixture } from '../observer.mjs';

const observations = [];
const summarize = r => ({
  invocationId: r.invocationId,
  fixture: r.contract.fixture,
  deadlineMs: r.contract.deadlineMs,
  lifecycle: r.process.lifecycle,
  exitCode: r.process.exitCode,
  signal: r.process.signal,
  settled: r.process.settled,
  shell: r.process.shell,
  termination: r.process.termination,
  settlementScope: r.process.settlementScope,
  observerStatus: r.observerStatus,
  progress: r.progress,
  applicationValidation: r.applicationValidation,
  stdoutHex: r.stdoutBytes.toString('hex')
});
after(() => { process.stdout.write('BOUNDARY_OBSERVATIONS:' + JSON.stringify(observations) + '\n'); });

test('independent: concurrent fixed invocations keep IDs and progress separate', async () => {
  const [a, b] = await Promise.all([observeFixture('success'), observeFixture('adversarial-progress')]);
  observations.push({ case: 'C1-concurrent-isolation', actual: [summarize(a), summarize(b)] });
  assert.notEqual(a.invocationId, b.invocationId);
  assert.equal(a.process.settled, true);
  assert.equal(b.process.settled, true);
  assert.equal(a.progress.status, 'valid');
  assert.equal(b.progress.status, 'partially-valid');
  assert.equal(b.progress.rejectedEvents, 4);
  assert.ok(a.progress.events.every(e => e.invocationId === a.invocationId));
  assert.ok(b.progress.events.every(e => e.invocationId === b.invocationId));
  assert.deepEqual(a.progress.events.map(e => e.sequence), [1, 2]);
  assert.deepEqual(b.progress.events.map(e => e.sequence), [1, 2]);
  assert.equal(a.stdoutBytes.toString('hex'), '464958545552452d415254494641435400ff0a');
  assert.equal(b.stdoutBytes.toString('hex'), '464958545552452d415254494641435400ff0a');
});

test('independent: caller mutation cannot enlarge an already bound owned-child deadline', async () => {
  const options = { deadlineMs: 75 };
  const pending = observeFixture('slow', options);
  options.deadlineMs = 5000;
  const result = await pending;
  observations.push({ case: 'C2-deadline-snapshot', suppliedInitial: 75, callerLater: 5000, actual: summarize(result) });
  assert.equal(result.contract.deadlineMs, 75);
  assert.equal(result.process.lifecycle, 'timed-out');
  assert.equal(result.process.termination.requested, true);
  assert.equal(result.process.termination.settled, true);
  assert.equal(result.process.settled, true);
  assert.equal(result.process.settlementScope, 'direct-child-only');
  assert.equal(result.applicationValidation.status, 'unknown');
  assert.equal(result.progress.status, 'unconfirmed');
});

test('independent: below-minimum deadline refuses before a fixed fixture launch', async () => {
  let error;
  try { await observeFixture('success', { deadlineMs: 49 }); }
  catch (e) { error = { code: e.code, message: e.message }; }
  observations.push({ case: 'C3-lower-bound-refusal', options: { deadlineMs: 49 }, actualError: error ?? null });
  assert.equal(error?.code, 'ERR_INVALID_OPTIONS');
});

test('independent: a forbidden non-enumerable own shell option is refused before launch', async () => {
  const options = {};
  Object.defineProperty(options, 'shell', { value: true, enumerable: false });
  let result, error;
  try { result = await observeFixture('success', options); }
  catch (e) { error = { code: e.code, message: e.message }; }
  observations.push({
    case: 'C4-forbidden-own-option-refusal',
    ownPropertyNames: Object.getOwnPropertyNames(options),
    enumerableKeys: Object.keys(options),
    forbiddenValue: options.shell,
    expectedErrorCode: 'ERR_INVALID_OPTIONS',
    actualError: error ?? null,
    actualResult: result ? summarize(result) : null
  });
  assert.equal(error?.code, 'ERR_INVALID_OPTIONS', 'all supplied own controls must refuse, not just enumerable keys');
  assert.equal(result, undefined);
});

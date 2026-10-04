import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  createInitialBinState,
  enumerateSpinnerOutcomes,
  evaluateSpinnerTrial,
  spinnerDistribution,
  transferBins,
  validateBinState,
} from "../simulation.mjs";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const learnerPath = fileURLToPath(new URL("../learner.mjs", import.meta.url));
const cliLimits = Object.freeze({ timeout: 3000, maxBuffer: 8 * 1024 });

function runLearner(mode, input) {
  return spawnSync(process.execPath, [learnerPath, mode], {
    cwd: packageRoot,
    input,
    encoding: "utf8",
    ...cliLimits,
  });
}

function assertCleanTermination(run) {
  assert.equal(run.error, undefined, run.error?.message);
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.signal, null);
  assert.equal(run.stderr, "");
  assert.ok(Buffer.byteLength(run.stdout, "utf8") <= cliLimits.maxBuffer);
  assert.doesNotMatch(run.stdout, /UnhandledPromiseRejection|ERR_USE_AFTER_CLOSE|Error:/);
}

test("accepted transfer returns a new state and preserves the caller state", () => {
  const before = createInitialBinState();
  const result = transferBins(before, 1);

  assert.equal(result.accepted, true);
  assert.deepEqual(result.state, { A: 2, B: 3 });
  assert.notStrictEqual(result.state, before);
  assert.deepEqual(before, { A: 3, B: 2 });
  assert.equal(validateBinState(result.state).valid, true);
});

test("k=2 from the initial state is accepted at B's exact capacity", () => {
  const before = createInitialBinState();
  const result = transferBins(before, 2);

  assert.equal(result.accepted, true);
  assert.deepEqual(result.checks, {
    validState: true,
    enoughInA: true,
    capacityAvailableInB: true,
  });
  assert.deepEqual(result.state, { A: 1, B: 4 });
  assert.deepEqual(before, { A: 3, B: 2 });
});

test("a destination-capacity rejection is atomic", () => {
  const before = createInitialBinState();
  const result = transferBins(before, 3);

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "destination-capacity");
  assert.deepEqual(result.checks, {
    validState: true,
    enoughInA: true,
    capacityAvailableInB: false,
  });
  assert.deepEqual(result.state, { A: 3, B: 2 });
  assert.notStrictEqual(result.state, before);
  assert.deepEqual(before, { A: 3, B: 2 });
});

test("zero transfer is accepted as a no-op", () => {
  const result = transferBins(createInitialBinState(), 0);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.state, { A: 3, B: 2 });
});

test("invalid transfer values reject without changing state", () => {
  for (const k of [-1, 1.5, 4, Number.NaN, undefined, null]) {
    const before = createInitialBinState();
    const result = transferBins(before, k);
    assert.equal(result.accepted, false, `k=${String(k)}`);
    assert.equal(result.reason, "invalid-transfer", `k=${String(k)}`);
    assert.deepEqual(result.state, { A: 3, B: 2 }, `k=${String(k)}`);
    assert.deepEqual(before, { A: 3, B: 2 }, `k=${String(k)}`);
  }
});

test("invalid bin state rejects before any transition", () => {
  const before = { A: 1.5, B: 3.5 };
  const result = transferBins(before, 1);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "invalid-state");
  assert.deepEqual(result.state, before);
  assert.deepEqual(before, { A: 1.5, B: 3.5 });
});

test("reset creates a fresh documented initial state", () => {
  const first = createInitialBinState();
  first.A = 0;
  const reset = createInitialBinState();
  assert.deepEqual(reset, { A: 3, B: 2 });
  assert.notStrictEqual(reset, first);
});

test("the independent hand-counted spinner oracle matches all 16 enumerated pairs", () => {
  const outcomes = enumerateSpinnerOutcomes();
  const distribution = spinnerDistribution();
  const independentlyExpectedCounts = [1, 4, 6, 4, 1];

  assert.equal(outcomes.length, 16);
  assert.deepEqual(
    distribution.byTotal.map((row) => row.count),
    independentlyExpectedCounts,
  );
  assert.equal(distribution.byTotal.reduce((sum, row) => sum + row.proportion, 0), 1);
  assert.equal(distribution.successCount, 5);
  assert.equal(distribution.failureCount, 11);
  assert.equal(distribution.successNumerator / distribution.successDenominator, 5 / 16);
});

test("one selected spinner pair is deterministic and invalid identities are rejected", () => {
  const firstRun = evaluateSpinnerTrial("S1", "S3");
  const replay = evaluateSpinnerTrial("S1", "S3");
  assert.deepEqual(firstRun, {
    valid: true,
    first: { id: "S1", value: 1 },
    second: { id: "S3", value: 2 },
    total: 3,
    success: true,
  });
  assert.deepEqual(replay, firstRun);
  assert.deepEqual(evaluateSpinnerTrial("S4", "S0"), {
    valid: false,
    reason: "sector-id-must-be-S0-through-S3",
  });
});

test("the bins learner flow includes prediction, rejection feedback, reset, and transfer", () => {
  const run = runLearner(
    "bins",
    "3\nI predict rejection\nB would exceed capacity, so neither changes\nr\nt\nno\nCapacity fails although A has enough\nq\n",
  );

  assertCleanTermination(run);
  assert.match(run.stdout, /Before committing k=3, predict/);
  assert.match(run.stdout, /rejected as a whole \(destination-capacity\); neither bin changed/);
  assert.match(run.stdout, /Reset restores A=3, B=2/);
  assert.match(run.stdout, /Transfer check \(separate hypothetical state\)/);
  assert.match(run.stdout, /Answer key: A>=k is true; B\+k<=4 is false/);
});

test("the spinner learner flow distinguishes a replay from its exact distribution and transfers", () => {
  const run = runLearner(
    "spinner",
    "5\nS1\nS3\nI expect total 3 and success\nThe pair gives one result, not the other pairs\nyes\nIt will not change\nIt repeats the same identities\nIt differs from counting all 16 pairs\n3\nThree pairs reach at least 3\n",
  );

  assertCleanTermination(run);
  assert.match(run.stdout, /Before reveal, predict the total/);
  assert.match(run.stdout, /Replay: S1\(1\) \+ S3\(2\) = 3; SUCCESS/);
  assert.match(run.stdout, /A replay is still one selected pair/);
  assert.match(run.stdout, /Total \| ordered pairs \| exact proportion/);
  assert.match(run.stdout, /Success \(total>=3\): 5\/16; not success: 11\/16/);
  assert.match(run.stdout, /Your count matches the exact transfer answer: 3\/9 = 1\/3/);
});

const spinnerSectorEofCases = [
  ["first sector prompt", "5\n", 0],
  ["second sector prompt", "5\nS1\n", 0],
  ["invalid pair followed by EOF", "5\nBAD\nS1\n", 1],
];

for (const [name, input, expectedRejections] of spinnerSectorEofCases) {
  test(`spinner exits cleanly at ${name}`, () => {
    const run = runLearner("spinner", input);
    assertCleanTermination(run);
    const rejections = run.stdout.match(/Rejected input:/g) ?? [];
    assert.equal(rejections.length, expectedRejections);
    assert.ok(Buffer.byteLength(run.stdout, "utf8") < 4096);
  });
}

const otherPromptEofCases = [
  ["bins action", "bins", ""],
  ["bins action prediction", "bins", "1\n"],
  ["bins action explanation", "bins", "1\npredicted accepted\n"],
  ["bins transfer prediction", "bins", "t\n"],
  ["bins transfer explanation", "bins", "t\nno\n"],
  ["spinner whole-space prediction", "spinner", ""],
  ["spinner selected-trial prediction", "spinner", "5\nS1\nS3\n"],
  ["spinner selected-trial explanation", "spinner", "5\nS1\nS3\n3\n"],
  ["spinner replay decision", "spinner", "5\nS1\nS3\n3\none pair\n"],
  ["spinner replay prediction", "spinner", "5\nS1\nS3\n3\none pair\nyes\n"],
  ["spinner replay explanation", "spinner", "5\nS1\nS3\n3\none pair\nyes\nno\n"],
  ["spinner whole-space explanation", "spinner", "5\nS1\nS3\n3\none pair\nno\n"],
  ["spinner transfer count", "spinner", "5\nS1\nS3\n3\none pair\nno\nall pairs differ\n"],
  ["spinner transfer explanation", "spinner", "5\nS1\nS3\n3\none pair\nno\nall pairs differ\n3\n"],
];

for (const [name, mode, input] of otherPromptEofCases) {
  test(`EOF at ${name} exits cleanly within bounds`, () => {
    const run = runLearner(mode, input);
    assertCleanTermination(run);
    assert.ok(Buffer.byteLength(run.stdout, "utf8") < 4096);
  });
}

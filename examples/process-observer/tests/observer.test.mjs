import test from "node:test";
import assert from "node:assert/strict";

const observer = () => import("../observer.mjs");
const artifactBytes = Buffer.from([
  0x46, 0x49, 0x58, 0x54, 0x55, 0x52, 0x45, 0x2d,
  0x41, 0x52, 0x54, 0x49, 0x46, 0x41, 0x43, 0x54,
  0x00, 0xff, 0x0a,
]);
const progressLine = (invocationId, sequence, phase, completed, total) =>
  `FIXTURE_PROGRESS:${JSON.stringify({
    schema: "local-fixture-progress-v1",
    invocationId,
    sequence,
    phase,
    completed,
    total,
  })}\n`;

test("successful observation keeps process exit, explicit progress, and application validation separate", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("success");

  assert.deepEqual(result.contract, {
    schema: "local-fixture-observation-v1",
    invocationId: result.invocationId,
    fixture: "success",
    executable: process.execPath,
    shell: false,
    outputMode: "separate-piped-stdout-and-stderr",
    progressSchema: "local-fixture-progress-v1",
    deadlineMs: 1500,
    settlementGraceMs: 1000,
    terminationPolicy: "SIGTERM-at-deadline-to-owned-child-only",
    applicationValidator: "fixed-fixture-artifact-bytes-v1",
    settlementScope: "direct-child-only",
  });
  assert.equal(result.process.lifecycle, "exited");
  assert.equal(result.process.executable, process.execPath);
  assert.equal(result.process.shell, false);
  assert.equal(result.process.fixture, "success");
  assert.equal(result.process.exitCode, 0);
  assert.equal(result.process.settled, true);
  assert.equal(result.applicationValidation.status, "passed");
  assert.equal(result.progress.status, "valid");
  assert.ok(result.progress.events.every((event) => event.invocationId === result.invocationId));
  assert.deepEqual(result.progress.events.map(({ sequence, phase, completed, total }) => ({ sequence, phase, completed, total })), [
    { sequence: 1, phase: "write", completed: 1, total: 2 },
    { sequence: 2, phase: "close", completed: 2, total: 2 },
  ]);
  assert.equal(Object.hasOwn(result.progress, "percent"), false);
  assert.equal(Object.hasOwn(result.progress, "eta"), false);
});

test("child stdout and stderr are returned as unchanged raw bytes", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("success");
  const expectedStderr = Buffer.concat([
    Buffer.from([0x44, 0x49, 0x41, 0x47, 0x00, 0xfe, 0x0a]),
    Buffer.from(progressLine(result.invocationId, 1, "write", 1, 2)),
    Buffer.from(progressLine(result.invocationId, 2, "close", 2, 2)),
  ]);

  assert.ok(Buffer.isBuffer(result.stdoutBytes));
  assert.ok(Buffer.isBuffer(result.stderrBytes));
  assert.deepEqual(result.stdoutBytes, artifactBytes);
  assert.deepEqual(result.stderrBytes, expectedStderr);
  assert.deepEqual(result.outputCapture, {
    complete: true,
    stdoutBytes: artifactBytes.length,
    stderrBytes: expectedStderr.length,
  });
  assert.equal(result.stderrBytes.includes(Buffer.from("observer-status:")), false);
});

test("zero process exit does not hide a failed artifact validator", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("zero-exit-invalid-artifact");

  assert.equal(result.process.lifecycle, "exited");
  assert.equal(result.process.exitCode, 0);
  assert.equal(result.applicationValidation.status, "failed");
  assert.equal(result.applicationValidation.reason, "artifact-signature-mismatch");
});

test("nonzero process exit remains visible even when the artifact validator passes", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("nonzero");

  assert.equal(result.process.lifecycle, "exited");
  assert.equal(result.process.exitCode, 7);
  assert.equal(result.applicationValidation.status, "passed");
});

test("absence of a progress protocol reports no progress, not an inferred phase", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("missing-progress");

  assert.equal(result.progress.status, "no-progress-reported");
  assert.deepEqual(result.progress.events, []);
  assert.equal(Object.hasOwn(result.progress, "percent"), false);
  assert.equal(Object.hasOwn(result.progress, "eta"), false);
});

test("malformed progress is rejected without changing preserved stderr or inventing progress", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("malformed-progress");

  assert.equal(result.progress.status, "invalid");
  assert.deepEqual(result.progress.events, []);
  assert.equal(result.progress.rejectedEvents, 1);
  assert.ok(result.stderrBytes.includes(Buffer.from("FIXTURE_PROGRESS:{not-json}\n")));
});

test("wrong invocation, duplicate, sequence gap, and regressing count events are rejected", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("adversarial-progress");

  assert.equal(result.progress.status, "partially-valid");
  assert.equal(result.progress.rejectedEvents, 4);
  assert.deepEqual(result.progress.events.map((event) => event.sequence), [1, 2]);
  assert.deepEqual(result.progress.events.map((event) => event.completed), [1, 2]);
});

test("deadline termination applies only to the owned local child and distinguishes request from settlement", async () => {
  const { observeFixture } = await observer();
  const result = await observeFixture("slow", { deadlineMs: 250 });

  assert.equal(result.contract.deadlineMs, 250);
  assert.equal(result.contract.settlementScope, "direct-child-only");
  assert.equal(result.process.lifecycle, "timed-out");
  assert.equal(result.process.termination.requested, true);
  assert.equal(result.process.termination.scope, "owned-local-child");
  assert.equal(result.process.termination.settled, true);
  assert.equal(result.process.settlementScope, "direct-child-only");
  assert.equal(result.process.settled, true);
  assert.equal(result.applicationValidation.status, "unknown");
});

test("observer refuses unlisted fixture and caller-supplied process controls", async () => {
  const { observeFixture } = await observer();

  await assert.rejects(observeFixture("arbitrary-shell-command"), { code: "ERR_UNKNOWN_FIXTURE" });
  await assert.rejects(observeFixture("success", { executable: "not-allowed" }), { code: "ERR_INVALID_OPTIONS" });
  await assert.rejects(observeFixture("success", { deadlineMs: 6000 }), { code: "ERR_INVALID_OPTIONS" });
});

test("all own option keys refuse before launch, including hidden strings and symbols", async () => {
  const { observeFixture } = await observer();
  const hiddenString = {};
  Object.defineProperty(hiddenString, "shell", { value: true, enumerable: false });
  const hiddenSymbol = {};
  Object.defineProperty(hiddenSymbol, Symbol("unsupported-control"), { value: true, enumerable: false });

  await assert.rejects(observeFixture("success", hiddenString), { code: "ERR_INVALID_OPTIONS" });
  await assert.rejects(observeFixture("success", hiddenSymbol), { code: "ERR_INVALID_OPTIONS" });
});

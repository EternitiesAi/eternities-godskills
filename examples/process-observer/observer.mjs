import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const FIXTURE_MODES = Object.freeze([
  "success",
  "zero-exit-invalid-artifact",
  "nonzero",
  "missing-progress",
  "malformed-progress",
  "adversarial-progress",
  "slow",
]);

const allowedModes = new Set(FIXTURE_MODES);
const fixturePath = fileURLToPath(new URL("./fixtures/controlled-child.mjs", import.meta.url));
const fixtureDirectory = dirname(fixturePath);
const defaultDeadlineMs = 1500;
const maximumDeadlineMs = 5000;
const settlementGraceMs = 1000;
const maxProgressLineBytes = 4096;
const maxProgressEvents = 128;
const marker = "FIXTURE_PROGRESS:";
const progressSchema = "local-fixture-progress-v1";
const artifactValidator = "fixed-fixture-artifact-bytes-v1";
const expectedArtifact = Buffer.from([
  0x46, 0x49, 0x58, 0x54, 0x55, 0x52, 0x45, 0x2d,
  0x41, 0x52, 0x54, 0x49, 0x46, 0x41, 0x43, 0x54,
  0x00, 0xff, 0x0a,
]);

function errorWithCode(code, message) {
  return Object.assign(new Error(message), { code });
}

function validateInputs(mode, options) {
  if (!allowedModes.has(mode)) {
    throw errorWithCode("ERR_UNKNOWN_FIXTURE", "fixture mode is not allowlisted");
  }
  if (!options || typeof options !== "object" || Array.isArray(options)
    || Reflect.ownKeys(options).some((key) => key !== "deadlineMs")) {
    throw errorWithCode("ERR_INVALID_OPTIONS", "only a local fixture deadline may be supplied");
  }
  const deadlineMs = options.deadlineMs ?? defaultDeadlineMs;
  if (!Number.isSafeInteger(deadlineMs) || deadlineMs < 50 || deadlineMs > maximumDeadlineMs) {
    throw errorWithCode("ERR_INVALID_OPTIONS", "deadlineMs must be an integer from 50 through 5000");
  }
  return deadlineMs;
}

function parseProgress(stderrBytes, invocationId) {
  const lines = stderrBytes.toString("utf8").split("\n");
  const candidates = lines.filter((line) => line.includes(marker));
  if (candidates.length === 0) {
    return { status: "no-progress-reported", events: [], rejectedEvents: 0 };
  }

  const events = [];
  let rejectedEvents = 0;
  let expectedSequence = 1;
  let previousCompleted = -1;
  let stableTotal;
  for (const line of candidates.slice(0, maxProgressEvents)) {
    const bytes = Buffer.byteLength(line, "utf8");
    if (candidates.length > maxProgressEvents || bytes > maxProgressLineBytes || !line.startsWith(marker)) {
      rejectedEvents += 1;
      continue;
    }
    let event;
    try {
      event = JSON.parse(line.slice(marker.length));
    } catch {
      rejectedEvents += 1;
      continue;
    }
    const requiredKeys = ["completed", "invocationId", "phase", "schema", "sequence", "total"];
    if (!event || typeof event !== "object" || Array.isArray(event)
      || Object.keys(event).sort().join("|") !== requiredKeys.join("|")
      || event.schema !== progressSchema
      || event.invocationId !== invocationId
      || !Number.isSafeInteger(event.sequence) || event.sequence !== expectedSequence
      || typeof event.phase !== "string" || event.phase.length === 0 || event.phase.length > 64
      || !Number.isSafeInteger(event.completed) || event.completed < 0
      || !Number.isSafeInteger(event.total) || event.total <= 0
      || event.completed > event.total
      || event.completed < previousCompleted
      || (stableTotal !== undefined && event.total !== stableTotal)) {
      rejectedEvents += 1;
      continue;
    }
    events.push({
      invocationId: event.invocationId,
      sequence: event.sequence,
      phase: event.phase,
      completed: event.completed,
      total: event.total,
    });
    expectedSequence += 1;
    previousCompleted = event.completed;
    stableTotal = event.total;
  }
  if (candidates.length > maxProgressEvents) rejectedEvents += candidates.length - maxProgressEvents;
  const status = rejectedEvents === 0 ? "valid" : events.length > 0 ? "partially-valid" : "invalid";
  return { status, events, rejectedEvents };
}

function validateArtifact(stdoutBytes) {
  return stdoutBytes.equals(expectedArtifact)
    ? { status: "passed", validator: artifactValidator }
    : { status: "failed", reason: "artifact-signature-mismatch" };
}

function observationContract(invocationId, mode, deadlineMs) {
  return {
    schema: "local-fixture-observation-v1",
    invocationId,
    fixture: mode,
    executable: process.execPath,
    shell: false,
    outputMode: "separate-piped-stdout-and-stderr",
    progressSchema,
    deadlineMs,
    settlementGraceMs,
    terminationPolicy: "SIGTERM-at-deadline-to-owned-child-only",
    applicationValidator: artifactValidator,
    settlementScope: "direct-child-only",
  };
}

function childEnvironment() {
  const env = {};
  const systemRoot = process.env.SystemRoot ?? process.env.SYSTEMROOT;
  if (systemRoot) env.SystemRoot = systemRoot;
  for (const key of ["TEMP", "TMP"]) if (process.env[key]) env[key] = process.env[key];
  return env;
}

export async function observeFixture(mode, options = {}) {
  const deadlineMs = validateInputs(mode, options);
  const invocationId = randomUUID();
  const contract = observationContract(invocationId, mode, deadlineMs);
  let child;
  try {
    child = spawn(process.execPath, [fixturePath, mode, invocationId], {
      cwd: fixtureDirectory,
      env: childEnvironment(),
      shell: false,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    return {
      contract,
      invocationId,
      observerStatus: "complete",
      process: {
        executable: process.execPath,
        fixture: mode,
        shell: false,
        lifecycle: "spawn-error",
        settlementScope: "direct-child-only",
        errorCode: error.code ?? "ERR_SPAWN",
        exitCode: null,
        signal: null,
        settled: false,
        termination: { attempted: false, requested: false, signal: null, scope: "owned-local-child", settled: null },
      },
      stdoutBytes: Buffer.alloc(0),
      stderrBytes: Buffer.alloc(0),
      outputCapture: { complete: false },
      progress: { status: "unconfirmed", events: [], rejectedEvents: 0 },
      applicationValidation: { status: "not-performed", reason: "child-did-not-start" },
    };
  }

  return new Promise((resolve) => {
    const stdoutChunks = [];
    const stderrChunks = [];
    let stdoutLength = 0;
    let stderrLength = 0;
    let finalized = false;
    let closeSeen = false;
    let deadlineReached = false;
    let terminationAttempted = false;
    let terminationRequested = false;
    let spawnErrorCode = null;
    let streamError = false;
    let deadlineTimer;
    let settlementTimer;

    const capture = (chunks, chunk, channel) => {
      if (finalized) return;
      const bytes = Buffer.from(chunk);
      chunks.push(bytes);
      if (channel === "stdout") stdoutLength += bytes.length;
      else stderrLength += bytes.length;
    };
    child.stdout.on("data", (chunk) => capture(stdoutChunks, chunk, "stdout"));
    child.stderr.on("data", (chunk) => capture(stderrChunks, chunk, "stderr"));
    child.stdout.on("error", () => { streamError = true; });
    child.stderr.on("error", () => { streamError = true; });
    child.once("error", (error) => { spawnErrorCode = error.code ?? "ERR_SPAWN"; });

    const finish = (exitCode, signal, settled) => {
      if (finalized) return;
      finalized = true;
      clearTimeout(deadlineTimer);
      clearTimeout(settlementTimer);
      const stdoutBytes = Buffer.concat(stdoutChunks, stdoutLength);
      const stderrBytes = Buffer.concat(stderrChunks, stderrLength);
      const lifecycle = spawnErrorCode
        ? "spawn-error"
        : deadlineReached
          ? settled ? "timed-out" : "unconfirmed"
          : "exited";
      let progress;
      try {
        progress = settled && !deadlineReached && !spawnErrorCode
          ? parseProgress(stderrBytes, invocationId)
          : { status: "unconfirmed", events: [], rejectedEvents: 0 };
      } catch {
        streamError = true;
        progress = { status: "invalid", events: [], rejectedEvents: 0 };
      }
      let applicationValidation;
      if (spawnErrorCode) applicationValidation = { status: "not-performed", reason: "child-did-not-start" };
      else if (!settled || deadlineReached || streamError) applicationValidation = { status: "unknown", reason: "complete-output-not-available-for-validation" };
      else applicationValidation = validateArtifact(stdoutBytes);
      resolve({
        contract,
        invocationId,
        observerStatus: settled && !streamError ? "complete" : "degraded",
        process: {
          executable: process.execPath,
          fixture: mode,
          shell: false,
          lifecycle,
          settlementScope: "direct-child-only",
          errorCode: spawnErrorCode,
          exitCode: exitCode ?? null,
          signal: signal ?? null,
          settled,
          termination: {
            attempted: terminationAttempted,
            requested: terminationRequested,
            signal: terminationAttempted ? "SIGTERM" : null,
            scope: "owned-local-child",
            settled: terminationRequested ? settled : null,
          },
        },
        stdoutBytes,
        stderrBytes,
        outputCapture: { complete: settled && !spawnErrorCode && !streamError, stdoutBytes: stdoutLength, stderrBytes: stderrLength },
        progress,
        applicationValidation,
      });
    };

    child.once("close", (exitCode, signal) => {
      closeSeen = true;
      finish(exitCode, signal, true);
    });
    deadlineTimer = setTimeout(() => {
      deadlineReached = true;
      terminationAttempted = true;
      try {
        terminationRequested = child.kill("SIGTERM");
      } catch {
        terminationRequested = false;
      }
      settlementTimer = setTimeout(() => finish(null, null, closeSeen), settlementGraceMs);
    }, deadlineMs);
  });
}

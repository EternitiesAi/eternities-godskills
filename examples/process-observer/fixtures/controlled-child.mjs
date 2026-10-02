const modes = new Set([
  "success",
  "zero-exit-invalid-artifact",
  "nonzero",
  "missing-progress",
  "malformed-progress",
  "adversarial-progress",
  "slow",
]);
const [mode, invocationId, ...extra] = process.argv.slice(2);

if (!modes.has(mode) || !/^[0-9a-f-]{36}$/i.test(invocationId ?? "") || extra.length > 0) {
  process.stderr.write("fixture: invalid observer-supplied arguments\n");
  process.exitCode = 64;
} else {
  const validArtifact = Buffer.from([
    0x46, 0x49, 0x58, 0x54, 0x55, 0x52, 0x45, 0x2d,
    0x41, 0x52, 0x54, 0x49, 0x46, 0x41, 0x43, 0x54,
    0x00, 0xff, 0x0a,
  ]);
  const emitEvent = (id, sequence, phase, completed, total) => {
    const event = {
      schema: "local-fixture-progress-v1",
      invocationId: id,
      sequence,
      phase,
      completed,
      total,
    };
    process.stderr.write(`FIXTURE_PROGRESS:${JSON.stringify(event)}\n`);
  };

  switch (mode) {
    case "success":
      process.stdout.write(validArtifact);
      process.stderr.write(Buffer.from([0x44, 0x49, 0x41, 0x47, 0x00, 0xfe, 0x0a]));
      emitEvent(invocationId, 1, "write", 1, 2);
      emitEvent(invocationId, 2, "close", 2, 2);
      break;
    case "zero-exit-invalid-artifact":
      process.stdout.write(Buffer.from([0x42, 0x52, 0x4f, 0x4b, 0x45, 0x4e, 0x00, 0xfe, 0x0a]));
      break;
    case "nonzero":
      process.stdout.write(validArtifact);
      process.stderr.write("fixture: deliberate exit code 7\n");
      process.exitCode = 7;
      break;
    case "missing-progress":
      process.stdout.write(validArtifact);
      process.stderr.write("fixture: no progress protocol\n");
      break;
    case "malformed-progress":
      process.stdout.write(validArtifact);
      process.stderr.write("FIXTURE_PROGRESS:{not-json}\n");
      break;
    case "adversarial-progress":
      process.stdout.write(validArtifact);
      emitEvent(invocationId, 1, "write", 1, 2);
      emitEvent(`${invocationId}-foreign`, 2, "foreign", 2, 2);
      emitEvent(invocationId, 1, "duplicate", 1, 2);
      emitEvent(invocationId, 3, "gap", 2, 2);
      emitEvent(invocationId, 2, "regression", 0, 2);
      emitEvent(invocationId, 2, "close", 2, 2);
      break;
    case "slow":
      process.stdout.write(Buffer.from([0x46, 0x49, 0x58, 0x54]));
      process.stderr.write("fixture: waiting for observer-owned deadline\n");
      setTimeout(() => process.stdout.write("late"), 5000);
      break;
  }
}

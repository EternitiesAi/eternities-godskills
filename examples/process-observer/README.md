# Fixed local process observer: executable example

This applies the Godskills [truthful local-command observation method](../../product/skills/eternities-hermes/references/truthful-cli-progress.md) to a deliberately small, first-party Node fixture. It is **not a general command runner or process supervisor**.

The observer can launch only the included fixture using the running Node executable, fixed arguments/cwd/environment allowlist, `shell: false`, and a hidden Windows window. The caller can choose an allowlisted fixture mode and a bounded local deadline; unsupported own string or Symbol option keys are rejected. It accepts no arbitrary command, executable, shell, PID, credential or network target.

From the repository root, with Node 24:

```text
node --test examples/process-observer/tests/observer.test.mjs examples/process-observer/tests/independent-boundaries.test.mjs
```

The 14 local test executions cover raw stdout/stderr preservation, explicit progress validity, invocation isolation, process-exit versus fixed artifact-validator disagreement, missing/malformed progress, deadline snapshots and hidden option-key refusal. The observer separates child lifecycle, parsed progress, output capture, application validation and direct-child settlement. It does not invent percent/ETA or treat exit zero as application success. Timeout termination is limited to the child it launched; no descendant, remote or unowned cancellation is claimed.

The [independent v2 review](../../artifacts/sprint-20261002/process-observer-application-independent-review-v2/review.md) accepted the exact fixed synthetic-local scope. Parent checked 33 bound files, replayed the 14 tests, copied the four executable/fixture/test files unchanged, and passed all 14 again from this relocated folder. The earlier own-key refusal failure and sealed REPAIR remain preserved. The fix did not introduce a shell override or broaden the launcher.

This example is separate from the portable product ZIP and installed skill pack. It does not qualify arbitrary workloads, spawn/pipe failure handling, output-memory bounds, process-tree cleanup, external-effect cleanup, other operating systems, or production readiness. Keep the bounded fixture contract attached if using this code as an instructional starting point.

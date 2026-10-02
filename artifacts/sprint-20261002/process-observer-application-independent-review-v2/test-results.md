# Independent v2 focused test record

Environment: Windows PowerShell 7.6.5; Node `v24.18.0`; cwd `C:\dev\eternities-godskills\.worktrees\product-sprint-20261002\artifacts\sprint-20261002\process-observer-application-v2`.

## Candidate tests

```powershell
node --test tests\observer.test.mjs tests\independent-boundaries.test.mjs
```

Exit `0`: 14 tests, 14 passed, 0 failed, skipped, cancelled, or todo. This reran the exact v2 copies: ten observer tests (the nine v1 cases plus the hidden-own-key regression) and four sealed Sol boundary cases adapted only to import the v2 observer.

Fresh boundary observations from this run:

- C1 concurrent success/adversarial calls had distinct invocation IDs; both fixed children settled. Adversarial progress rejected four records while retaining valid sequence 1/2; both expected artifact byte sequences matched.
- C2 caller changed the supplied deadline from 75 ms to 5000 ms after invocation; the snapshot remained 75 ms. The owned child timed out, SIGTERM was requested, direct-child settlement was observed, and artifact validation/progress remained unknown/unconfirmed.
- C3 `deadlineMs: 49` returned `ERR_INVALID_OPTIONS`.
- C4 non-enumerable own `shell: true` returned `ERR_INVALID_OPTIONS`; no receipt was returned.

## Hidden-key refusal before launch

A separate one-off in-memory check wrapped `child_process.spawn`, called `syncBuiltinESMExports()`, and dynamically imported the exact v2 observer. It tried (1) a non-enumerable own string key `shell: true`, then (2) a non-enumerable own Symbol key. Both calls rejected with `ERR_INVALID_OPTIONS`; the wrapped spawn count was zero after each. The original spawn function was restored in `finally`. No test file, candidate file, or harness was added for this probe.

## Syntax and comparison checks

These four commands each exited `0`:

```powershell
node --check observer.mjs
node --check fixtures\controlled-child.mjs
node --check tests\observer.test.mjs
node --check tests\independent-boundaries.test.mjs
```

Source comparisons confirmed that the sole v1/v2 observer change is the intended `Object.keys` → `Reflect.ownKeys` validator expression. The fixed child file is byte-identical across versions. The original observer tests have exactly one appended regression; the independent-boundary test differs from Sol's sealed source only by the v2 import path.

## Review setup notes

Two read-only audit attempts were corrected before sealing. One initially formed a duplicated `artifacts\sprint-20261002` path while resolving Sol's worktree-relative bindings; the corrected audit used the worktree root. Another comparison initially asked the intentionally changed v1/v2 observer files to have equal hashes; the normalized-source check instead replaced the one expected expression and confirmed byte equality. Neither issue affected the test run or any candidate/historical file. No candidate test failed in this fresh review.

No v1 test suite was rerun; v1 served as the exact source/diff baseline. No full repository suite, live service, arbitrary process, product integration, or cross-platform runtime was tested.

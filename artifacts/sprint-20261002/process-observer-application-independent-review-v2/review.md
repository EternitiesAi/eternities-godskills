# Fixed local process observer v2 — independent review

Verdict: **READY for the exact synthetic local fixture scope reviewed here.** This is not approval of a general process supervisor, product integration, production runtime, process-tree cleanup, or any broader method/body.

## Bound candidate and prior finding

Candidate root: `C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/process-observer-application-v2`.

- Candidate receipt SHA-256: `9bf8ca0446dc09beba4bea723ce706956f94b9d993bdc4c964b8f830f848daba`.
- Candidate `observer.mjs` SHA-256: `6a9857249134508fccbe64c42b9862dc20dae237b68aae107b2f60b886add1f7`.
- V1 observer SHA-256: `df219eec8efd25d1eb37f71b49f5190d115ebc4a1b02471a72d253561ccb9cd9`.
- Exact prior Sol REPAIR receipt SHA-256: `9339ce7e1aaa0d3063671a17457293a5d19a3fb2301fc3a08e54e4f4001ef369`.
- Prior review SHA-256: `74e05ce5ad0ca51e911cf589f616463e0856b5f6969a3a72b5adb10c3e740636`.

The v1 failure was real but narrow: `Object.keys(options)` ignored a non-enumerable own `shell` property, so the input was accepted and the fixed success fixture launched. The actual launch remained `process.execPath`, the fixed first-party child, and `shell: false`; Sol did not observe a shell override or arbitrary process execution.

V2 changes that validator expression to `Reflect.ownKeys(options).some((key) => key !== "deadlineMs")`. That includes own non-enumerable string keys and Symbols, while continuing to allow only the caller's documented deadline control. The existing assertion for the hidden `shell` key is retained; a second hidden Symbol-key assertion is added. The independent-boundary copy retains Sol's four cases, changing only its observer import path.

## Semantic comparison

| Boundary | V1 / sealed finding | V2 observed result |
| --- | --- | --- |
| Own option keys | Enumerable own string keys only; hidden `shell` slipped through. | All own string and Symbol keys are examined; only `deadlineMs` is allowed. Hidden string and Symbol controls both reject. |
| Refusal timing | Sol's C4 launched the fixed child before returning a successful receipt. | An independent launch-counter probe observed zero `spawn` calls for each hidden-key rejection. |
| Child launch | Fixed executable, child, args, cwd, environment allowlist, `shell:false`, pipes and hidden window. | No launch-setting diff. V1 and v2 fixture SHA-256 are both `dde615da2bc99c9bed197637fb1c963d40f6455b925225684d5c74b68bcbb1e7`. |
| Deadline/concurrency | Existing local semantics bound a validated deadline and cancel only the owned direct child. | The existing 75 ms mutation and concurrent isolation cases pass; 49 ms and 6000 ms bounds reject. Timeout remains distinct from observed direct-child settlement. |
| Capture/progress/validation | Raw channels, parsed progress, process exit and artifact validation remain separate. | Existing tests pass for unchanged raw bytes, malformed/adversarial progress, exit/validator disagreement, and no invented percent/ETA. |

The full observer source, normalized comparison, and both test diffs were checked: replacing the one `Reflect.ownKeys` expression in v2 with the v1 `Object.keys` expression makes the source byte-for-byte equal to v1. V1's nine observer tests are unchanged; the added test covers both hidden key forms. Sol's four-boundary test differs only by the import path. No fixture, mode, deadline constant, progress parser, output capture, or settlement logic changed.

## Fresh bounded execution

From the exact v2 directory, Node v24.18.0 on Windows PowerShell 7.6.5:

```powershell
node --test tests\observer.test.mjs tests\independent-boundaries.test.mjs
```

Result: exit 0; **14 passed, 0 failed, skipped, or cancelled**. Four syntax checks also pass for the observer, fixed child, and both test files. The two new own-key assertions were additionally tested in a separate process with `child_process.spawn` wrapped and counted; both rejected with `ERR_INVALID_OPTIONS` and the count remained zero after each. The wrapper was restored before that process ended.

The passing cases support only this exact bounded example: isolated concurrent fixture observations, explicit deadline snapshot and bounds, fixed local-child timeout/settlement reporting, raw stdout/stderr capture, the supplied progress examples, and the fixed artifact-byte validator. The fixture itself is benign and local; no arbitrary command, PID, shell, provider, network request, acquired code, or product process was run.

## Limits

This review does not qualify proxies/accessor side effects, inherited option behavior, spawn/pipe failures, failed termination requests, grace expiry without close, excessive/overlong progress output, arbitrary workloads, output-memory bounds, descendants, external-effect cleanup, other operating systems, production readiness, or product/method-body quality. The explicit fixed-child and direct-child-only boundaries must remain attached to any reuse of this result.

The candidate and sealed history were not edited. This review writes only its separate v2 review root. Parent integration/acceptance remains a distinct decision; no release, general capability, or product-level claim is transferred.

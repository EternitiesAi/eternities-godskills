# Independent quality harness repair review, October 3, 2026

Disposition: **READY narrowly for the bounded, offline six-pair supplied-text comparison.** The final repair closes the five immutable v1 findings under the inspected implementation and synthetic controls. No blocking defect was confirmed in this scope. This is not acceptance of the older `af89fbb` alone, certification of an adversarial runner, approval of live execution, or evidence of quality improvement.

## Identity and independence

Reviewed author commit `bf88b295fdee956aa6db72b7a45d1a3ec92d4eb6`, whose direct parent is `af89fbb29146ad967d171f8a7e0791c523d6c02d`. The former adds full-ID compatibility to the latter's harness repair. All four final files were read and matched the committed bytes before and after testing in `C:/dev/eternities-godskills/.worktrees/discovery-quality-20261003`:

| Source | SHA-256 |
| --- | --- |
| `scripts/quality-evaluation-harness.mjs` | `3bbc6c29bc4b4367ffbb766ec062ba0f56a7ed22088f650db3fc64bd07e85ccb` |
| `tests/quality-evaluation-harness.test.mjs` | `201410673412b5bcae2000d02ecf9ee30b14d5e5f44b0fd1243ffc30be4f6dd3` |
| `tests/helpers/quality-harness-lab.mjs` | `84195803dbdd33f2f50ef12f154e7770b3e1fcd6a5aa3d06a39ad8175e95a638` |
| `docs/quality-harness-repair-v2-20261003.md` | `69ac01b8cdd080022823a249d756f6ae8621341db1398556af4ce66650535023` |

The immutable v1 review was read at `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003/docs/quality-harness-review-v1-20261003.md`; SHA-256 `052be048954b7f5fa8236066ae238ed74d5af8b5310f067d35c6e01b657853c7`. Its historical pilot observations remain historical; no underlying pilot or future execution outputs were opened. Parent's `afc5f94` cherry-pick and pending incorporation/repeat are supplied context, not independently verified integration.

The reviewer authored neither repaired harness nor discovery implementation. Counterbalanced-agent-evaluation and semantic-implementation-diff guidance informed matching, evidence boundaries and behavioral checks. Only this report and four independent synthetic regression controls are new; product, fixtures, rubric/key and prior review bytes are preserved.

## Five-finding assessment

| Immutable v1 finding | Confirmed repair and control |
| --- | --- |
| 1. Replay not identity-bound | Every planned job is validated before any dispatch. Manifest/job identities bind fixture bytes and declared commit, full task/arm, schedule/wave/concurrency, treatment and pack hashes, prompt/evidence, approved reference, binary/config/harness hashes, absolute paths, requested configuration and argument arrays. Completed reuse also revalidates retained receipts and receipt-derived state. Mutation tests reject treatment, receipts, binary/config/evidence and contradictory state with zero new dispatch. Independent control confirms a later corrupt receipt blocks an earlier missing job. Unchanged completed replay dispatches nothing. |
| 2. No exclusive ownership / duplicate IDs | Unique IDs and unique q01–q06 ordinals are checked before preparation. Atomic exclusive operation-directory `mkdir` claims all job paths; the competing-caller test permits exactly one caller's 12 executions. Uncertain/orphan/historical work is held, not overwritten or retried. Independent crash-left-claim control confirms rejection and preservation. Claim removal occurs only for the acquired empty claim, not receipts. |
| 3. Local failure did not halt peers | Shared halt prevents queue draining and is rechecked synchronously immediately before exec spawn, after asynchronous state persistence. Failure and paused-state controls show no launches after the shared invalid state and preserve already in-flight settlement. `Promise.allSettled` provides a complete worker/receipt barrier between waves. No automatic cancellation/retry is inferred. |
| 4. Malformed/error/empty streams accepted | One coherent thread/turn, settled valid-domain usage, a singleton completed answer and nonblank trim-matching result are required. Tests reject malformed/null/error, started/completed tools, explicit nonfinal phase, mismatch, missing final, extra turn and post-terminal events. Legacy phase-absent singleton completion remains supported; explicit `final_answer` also settles. Independent duplicate-final control fails closed. Clean blank/timeout outcomes are retained and held; protocol/tool contamination remains invalid, even on timeout. Poor delivered answers are not filtered or retried. |
| 5. Isolation overclaim | Seven required provenance kinds, roles, text structure and exactly four factory descriptors are checked against a separately approved full captured reference. Description, wrapper, unknown/missing kind, role/content and environment drift fail closed. Only specified ephemeral metadata and environment cwd/slash spelling are normalized. Receipts truthfully say `factory-codex-baseline`, `captured-preflight-only`, and served model `unknown`; they record the request `{model:gpt-6-luna, provider:openai, reasoning:max}`, not a served-model attestation. |

## Full IDs, waves and matched arms

The shuffled synthetic full-ID test accepts all six supplied ID strings and verifies original request/evidence-to-ID binding. Ordinals determine order/parity only; full IDs remain in body lookup, schedules, paths and replay identity. Duplicate, missing, unknown and malformed ordinals reject before operation creation or CLI preparation. An independent same-ordinal ID rename rejects replay rather than relabeling completed work.

The manifest binds declared fixture commit `02a43b423553ede5da8c72427c24b5eb1bfe9dba`. Its string's SHA-256 low bit is 1: wave 1 uses skill/baseline on alternating odd/even ordinals, wave 2 reverses only after settlement. Six is the effective maximum simultaneous jobs per wave even if requested concurrency is greater; concurrency itself is identity-bound. The harness does not independently authenticate that declared commit against the supplied fixture bytes; parent owns that immutable-source gate.

Both arms receive the same base instruction, task and supplied evidence. Only treatment adds selected released bodies/resources, checked against release hashes. The fake private-key sentinel never enters prompts. Both request the same model/provider/reasoning and sandbox flags. Twelve distinct job-local SQLite paths are present in both preflight/exec argument arrays. These are requested arguments, not demonstrated live SQLite separation. This is preselected-guidance evaluation, not discovery/activation evaluation.

## Reproducible verification

Node `v24.18.0`, Windows. In the final author worktree:

```powershell
node --test --test-reporter=spec tests/quality-evaluation-harness.test.mjs
node --check scripts/quality-evaluation-harness.mjs
node --check tests/quality-evaluation-harness.test.mjs
node --check tests/helpers/quality-harness-lab.mjs
```

Result: **61/61 passed**, zero failed/skipped/cancelled, exit 0; duration 12,684.4953 ms. All three syntax checks exited 0.

In the independent qualification worktree:

```powershell
node --test --test-reporter=spec tests/quality-harness-independent-review-v2.test.mjs
```

Result: **4/4 passed**, zero failed/skipped/cancelled, exit 0; duration 1,597.2277 ms. Independent test SHA-256: `80cf3c57483b832ee61b22f7283b96d8c63dd664840fb8fbda2147083e8f9e6d`. Its absolute import is intentionally source-pinned to the supplied author worktree, with harness/helper hash guards; it is not an installed or portable test launcher. The helper runs actual `runEvaluation` through Node VM modules with substituted fake child processes and real filesystem operations restricted to generated synthetic temporary directories. No real CLI/provider/auth files are used.

## Remaining boundaries

Reference approval remains an operator trust boundary, not automatic proof of uncontaminated execution. Captured preflight is not the actual exec prefix; real CLI acceptance of flags/provenance, live isolation, per-job SQLite behavior, served model and parent-integrated bytes remain unverified here. Requested and preflight argument arrays are not identical command modes, and the report does not imply otherwise.

Execution timeout is 600 seconds, with a separate 60-second preflight timeout. The 1800-word prompt is soft; there is no hard generated-token ceiling or cost/budget enforcement. Raw settled usage is retained without double-counting reasoning or inventing absent cache counters/prices. The rejecting tool/unknown-item counter is not an exact billing count. Spawn/filesystem failures may leave uncertain partial records held for reconciliation; this is not general crash recovery or adversarial tamper resistance.

Parent still owns immutable input/reference approval, integration repeat, formal dispatch, blinded scoring and invalid-run adjudication. No formal run, model outcome, universal superiority, deployment or general isolation conclusion follows from this acceptance. Prior REPAIR reports remain unchanged and valid for their respective source versions.

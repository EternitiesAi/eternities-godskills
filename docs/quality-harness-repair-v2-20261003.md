# Quality harness repair v2, October 3, 2026

Discovery is frozen at `d24bc3ec5a74f6e421b4c23ca07d5defb8d42825`.
The immutable v1 review is preserved. This repair owns only the copied harness,
its tests, one test helper, and this record. No historical pilot, credential,
held-out fixture, provider, or other worktree is in scope.

## Incremental progress

1. Replay identity and duplicate dispatch: the bounded red batch ran against
   actual `runEvaluation` with synthetic local files and substituted spawn.
   After correcting a test syntax error, 12 tests ran: 4 passed and 8 failed by
   assertion. Six receipt/treatment/binary mutations were reused, duplicate IDs
   were accepted, and concurrent callers dispatched four jobs instead of two.
   Implemented a pre-dispatch identity/receipt check and exclusive operation
   claim. After fixing the VM's import-meta initialization, 12/12 passed.
2. Stop dispatch: 13 tests ran, 12 passed and the new failure test dispatched all
   six jobs. Added a shared stop flag and catch boundary; in-flight executions
   still settle and contribute their actual receipts. 13/13 passed.
3. Stream/usage batch: 29 tests ran, 13 passed and 16 assertions failed. Added
   strict terminal/event/result checks and valid-domain raw usage preservation.
   The additional preregistration gate clarified that blank/time-out work is a
   retained outcome, never a selective retry; tests now distinguish this from
   an invalid comparison while still rejecting it as successful delivery.
   After correcting a stale logging variable, 29/29 passed.
4. Additional authoritative execution gates: captured instruction provenance,
   honest model/configuration labels, and the two six-task waves under commit
   `02a43b423553ede5da8c72427c24b5eb1bfe9dba`. No rubric/key was opened.
5. Wave batch: four red assertions reproduced missing manifest, ignored fixture
   commit, replay into historical v1 operation, and silently replaced schedule.
   The commit's SHA-256 ends in `d` (low bit 1): wave 1 treats odd task IDs,
   baseline on even IDs; wave 2 reverses only after full wave-1 settlement.
   Implemented this fixed schedule, manifest binding, and historical-operation
   hold. 33/33 tests passed, zero skipped.
6. Captured-reference/provenance red batch is now written, including the exact
   marker-free, unclosed-wrapper, and names-only review reproductions. It tests
   actual execution refusal plus captured-only scope, unknown served model, and
   distinct local SQLite argument paths. 42 tests ran: 32 passed, 10 failed by
   assertion. All seven modified preflights were accepted before the repair;
   the reference was ignored and served-model/scope fields were absent.
   Implemented exact captured-reference matching, fixed seven-kind provenance,
   environment-workspace/ID normalization, reference/pack digests, separate job
   SQLite arguments, and requested-versus-unknown-served model labels.
   42/42 passed, zero skipped.
7. Final bounded edge batch: contradictory replay state, rejected-preflight
   receipts, the asynchronous stop-before-spawn boundary, malformed JSON null,
   and timeout retention. These remain the same five repair categories, not a
   new evaluation framework. 49 tests ran: 43 passed, 6 failed by assertion.
   Replay accepted three contradictory state edits, rejected preflights/JSON
   null had no settled records, and one exec launched after the shared halt.
   Added receipt-derived replay validation, retained invalid preflight state,
   malformed-event shape checks, and the final synchronous halt/spawn boundary.
   49/49 passed, zero skipped. Added four retained-artifact/config controls and
   two final classification checks required by preregistration: blank output
   with no response item, and tool-contaminated timeout. 55 tests ran: 53
   passed, 2 failed by assertion. The former was wrongly labeled invalid;
   the latter was wrongly treated as an ordinary retained timeout. Separated
   protocol/contamination failures from incomplete outcomes: both halt and
   remain held, but only the former is an invalid comparison. Fixture bytes
   are now parsed and hashed from the same captured read.
   55/55 passed, zero skipped.
8. Final identity audit: a focused actual-run test confirmed that changing the
   requested concurrency silently reused completed work (1/1 assertion failed).
   Bound requested slots and the effective six-job worker cap into the manifest
   and each job identity. Resolved invocation paths before passing them to spawn
   so recorded binary/home/workspace paths refer to the actual arguments.

## Delivered repair

1. Resolve and compare every current job identity before any new dispatch.
   Bind fixture bytes/declared commit/schedule/wave, task/arm, selected treatment
   release and file hashes, pack catalog/release hashes, prompt/evidence hashes,
   approved reference bytes, binary/home config/harness hashes, absolute paths,
   requested model/provider/reasoning, exact exec/preflight argument arrays,
   job-local SQLite path, and concurrency. Reuse only completed v2 jobs whose
   retained receipts and receipt-derived isolation/usage/state still agree.
2. Reject duplicate IDs before preparation. An exclusive operation-directory
   claim owns all twelve job paths and rejects competing callers. A crash-left
   claim, orphan job, uncertain state, or historical v1 operation is held for
   reconciliation, not automatically overwritten/retried. Normal completion
   removes only its own empty claim directory, never a job/receipt.
3. Shared halt checks surround preparation and are synchronous immediately
   before external spawn. First invalid work prevents remaining launches;
   already dispatched work settles and is retained. Wave two waits for the
   whole first wave's worker/receipt settlement, not just enumeration order.
4. Validate one terminal stream, safe-domain usage, singleton completed response
   and matching nonempty result. Malformed/error/nonfinal/unknown/tool streams
   cannot certify successful delivery/no tools. Blank or timed-out work without
   protocol contamination is `retained-outcome`; contamination is `invalid`
   with `invalid-comparison`, including a tool-contaminated timeout. Both halt
   and block replay. A poor but delivered response is retained as completed work
   for later blinded assessment; there is no answer-quality filter/retry.
5. Require a separately approved captured reference input. Check all seven
   expected instruction kinds, roles and text-only structure; require exactly
   the four factory skill descriptors and compare the full captured content to
   the reference. Missing/malformed/unknown provenance fails closed. Ignore only
   ephemeral `id`, `message_id`, `timestamp`, `created_at`, `updated_at` fields
   and the declared environment cwd/slash spellings. Other environment text,
   factory descriptions and skill-root text remain bound. Reference approval is
   an operator responsibility, not inferred from a worker claim.

The fixed commit string has SHA-256
`e5071f409fdcff2e8bb3de465edbae6024b3d6ab9aa3b452dd94c459976e213d`.
Its low bit is 1. Wave 1 is q01 skill, q02 baseline, q03 skill, q04 baseline,
q05 skill, q06 baseline. Wave 2 uses the opposite arms. Each manifest and job
binds this schedule and `fixtureCommit`. The fixture commit is the supplied
preregistration identity, not an independently inspected Git/held-out receipt.

`baselineLabel: factory-codex-baseline` explicitly retains the same factory4
descriptions in both arms. `isolation.scope: captured-preflight-only` does not
claim capture of the actual exec prefix. `servedModel: unknown` distinguishes
the request from an observed served model. Exec and preflight argument arrays
record what is passed to spawn; binary/config/harness digests bind local inputs.
Each job requests its own `sqlite_home` through local `-c` overrides, with no
global config edit. No actual migration success is asserted by these tests.

`usage.raw` retains all reported settled fields, including reasoning-output and
cache-write counters. Normalized counters remain unknown when absent; values
must be nonnegative safe integers, cached-input cannot exceed input and reported
reasoning-output cannot exceed output. Reasoning is not added to output and no
token-to-price accounting is inferred. The rejecting `toolCalls` safety counter
counts suspicious tool/unknown-item events; it is not a billing/call-count claim.

## Verification and reproducibility

The curated test-driven-development skill and writing-good-tests guidance were
used for incremental failing behavior tests before each fix. The immutable
review's concrete reproductions were reused. Tests run the actual exported
`runEvaluation` through a small VM helper, with external spawn replaced and real
filesystem operations restricted to generated synthetic temporary directories.
The helper launches only Node with `--experimental-vm-modules`; the normal test
command itself needs no VM flag. No provider/CLI execution occurs.

```powershell
node --test --test-reporter=spec tests/quality-evaluation-harness.test.mjs
node --check scripts/quality-evaluation-harness.mjs
node --check tests/quality-evaluation-harness.test.mjs
node --check tests/helpers/quality-harness-lab.mjs
```

Final full-suite result: **56/56 passed, zero skipped/cancelled**, exit 0.
All three syntax checks returned without errors, exit 0. The final full run
followed the concurrency identity fix; the frozen discovery tests were not
rerun because their tracked implementation/test bytes remained unchanged.
Scope verification compares the staged change set against the frozen discovery
commit and stages exactly these four files:

- `scripts/quality-evaluation-harness.mjs`
- `tests/quality-evaluation-harness.test.mjs`
- `tests/helpers/quality-harness-lab.mjs`
- `docs/quality-harness-repair-v2-20261003.md`

The preserved untracked v1 review file has SHA-256
`052be048954b7f5fa8236066ae238ed74d5af8b5310f067d35c6e01b657853c7`;
it is deliberately not included in the repair commit.

## Limits and handoff

This is a bounded implementation record, not independent acceptance or a new
certification framework. Parent/Gibbs owns independent review before adoption.
It compares supplied text under preselected guidance, not installed-skill
activation, discovery quality, performed external actions, or proven quality
improvement. No held-out task, answer, rubric/key, credential/auth file, provider,
historical pilot receipt, other agent, or other worktree was inspected or changed
during the repair. Historical pilot-v2 remains historical v1; it was not replayed.

Real CLI support/behavior for the recorded flags, prefix metadata and local
SQLite override remains unverified here under the no-CLI constraint. An approved
reference capture is mandatory for a fresh formal operation; do not silently
seed it from historical pilot work or a newly contaminated worker prefix. A
spawn/filesystem failure that cannot settle leaves partial/uncertain work held;
the harness does not automatically reconcile crash recovery or retry paid work.

No hard generated-token limit is configured or invented. CLI support was not
probed. The existing 1800-word prompt instruction is a soft request, not a token
ceiling. Parent must document unsupported maximum-token control if the CLI
cannot enforce it. Formal runs and blinded outcome assessment remain separate.

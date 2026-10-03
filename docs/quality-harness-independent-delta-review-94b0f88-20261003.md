# Independent provenance-path repair review, October 3, 2026

Disposition: **READY narrowly for the metadata-path correction at `94b0f88fd3a7238c796244eef143a8ca23d958ed`.** The demonstrated `6260462` nested-content regression is repaired, without changing the bounded six-pair harness's other gates. This is source/behavior acceptance, not authorization or evidence of a live invocation, model quality, actual exec-prefix isolation or server-model attestation.

## Exact source and preservation

Reviewed the committed repair in `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`, against `626046258ae9cb1e4011c564d52d9c4446600b00`. The executable/archive files matched committed bytes before and after checks.

| Source at 94b0f88 | SHA-256 |
| --- | --- |
| `scripts/quality-evaluation-harness.mjs` | `24736713cab1205891d8f466c82076f36c93536ca19c2e8af2bea9576359365e` |
| `tests/quality-evaluation-harness.test.mjs` | `8bb484e77d682e49f2701db2934e306944182e05f545f0decfc5b0f44ee55ebf` |
| `tests/helpers/quality-harness-lab.mjs` | `84195803dbdd33f2f50ef12f154e7770b3e1fcd6a5aa3d06a39ad8175e95a638` |
| `tests/quality-harness-independent-review-v2.test.mjs` | `48a15ee9687fce804bb0b96f8d2703d3eb15339725c0cac533167fc266b28d4b` |
| `evaluation/quality-20261003/review-controls/quality-harness-independent-review-v2.mjs` | `80cf3c57483b832ee61b22f7283b96d8c63dd664840fb8fbda2147083e8f9e6d` |
| `docs/quality-harness-provenance-path-repair-v3-20261003.md` | `a4686d68ed4741f61a591fb6df45dc24bd7f6e8ac96e06c228b13c9b1f7fbf1c` |

The `canonical(value)` function block is byte-for-byte equal to the original block at `108c7f566bd44a167d9175c852784a18f7e09866`; the previous recursive container-name exception is gone. After existing message/provenance validation, `capturedInput` shallow-copies the actual message's `internal_chat_message_metadata_passthrough`, removes only its `create_time`, and installs that copy in the normalized message. It neither deletes a content property nor mutates the supplied capture/reference. All pre-existing canonicalization rules remain unchanged.

The helper and archived original reviewer controls are unchanged. The archive is byte-identical to my original committed control file. The executable portable test changes only its harness hash pin in this repair; all four test/assertion bodies remain byte-identical to the archive. Its local helper import and checkout-relative root remain intact.

## Matched synthetic boundary results

Semantic-implementation-diff guidance informed matched before/after checks. Both exact committed implementations were loaded through Node VM modules under Windows / Node `v24.18.0`, with empty process arguments/environment and real spawn forbidden. The same inert seven-kind factory-four reference was supplied to both implementations; only the named field differed between capture and reference.

| Case | 6260462 valid | 94b0f88 valid | Result |
| --- | --- | --- | --- |
| Identical valid captures | true | true | Preserved |
| Actual message-provenance `create_time`: 100 vs 101 | true | true | Intended exemption preserved |
| Direct `content[0].create_time`: 100 vs 101 | false | false | Content remains significant |
| `content[0].internal_chat_message_metadata_passthrough.create_time`: 100 vs 101 | true | false | Prior regression repaired |
| Root-message `create_time`: 100 vs 101 | false | false | Non-provenance field remains significant |

**5/5 expected comparisons passed.** Serialized capture/reference inputs were unchanged after both validators in all five cases. The only observed before/after behavioral divergence is the required nested-content rejection.

The committed fake-CLI regression also verifies that direct/nested content drift rejects before any synthetic exec dispatch, while genuine metadata timestamp drift completes the twelve synthetic jobs. The laboratory substitutes child processes and uses generated temporary synthetic files, not a real CLI/configuration home or provider.

## Commands and gates

Executed in the source-hash-verified parent worktree:

```powershell
node --test --test-reporter=spec --test-name-pattern='fresh CLI create_time|create_time outside provenance|same-named metadata object nested' tests/quality-evaluation-harness.test.mjs
node --test --test-reporter=spec tests/quality-harness-independent-review-v2.test.mjs
node --check scripts/quality-evaluation-harness.mjs
```

Results: focused metadata tests **3/3 passed**, zero failed/skipped/cancelled, exit 0 (1,071.0695 ms); portable reviewer controls **4/4 passed**, zero failed/skipped/cancelled, exit 0 (1,739.4413 ms); syntax check exit 0. The five matched VM cases were a separate successful inline check, not additional full-suite tests. Parent's running **64+4=68** suite was not awaited, independently repeated or assumed passed here; parent owns reconciliation.

The production delta is confined to restoring the original canonicalizer and normalizing actual copied provenance. Identity-bound replay/no duplicate dispatch, exclusive claims, global halt and preservation, terminal/result validation, full-ID ordinal/order binding, two-wave settlement, CLI arguments and usage accounting are unchanged by source comparison. The four preserved reviewer controls reconfirm claim holding, full-ID replay binding, all-job pre-dispatch receipt checks, and explicit-final/duplicate-final behavior. Prior full-suite evidence applies to the unchanged regions; this narrow review does not claim exhaustive new validation of them.

No product/hookup, frozen fixture, rubric, preregistration or archived-control change appears between 6260462 and 94b0f88. This confirms product preservation across the delta; it is not a new reconstruction or certification of the supplied `cc43` portable release identity. All thirteen prior artifacts in my independent worktree remain byte-for-byte unchanged, including the immutable 6260462 REPAIR report. Only this new report is committed.

## Limits and disposition

Factory-four baseline, captured-preflight-only evidence and requested Luna/max/provider versus unknown served model remain the correct labels. Live CLI/SQLite behavior, actual execution-prefix isolation, hard generated-token control and formal outcomes remain outside this review. No real CLI/provider/auth access, task/answer inspection, source tuning, accepted-call retry, formal dispatch or acquisition occurred.

The parent's stopped-attempt preservation and new-operation procedure remain parent-recorded, not independently inspected receipts. This acceptance does not retroactively relabel the original attempt or the immutable REPAIR report. Parent retains integration/full-suite reconciliation, immutable input/reference approval and any fresh formal invocation/scoring. No further design expansion is required for the demonstrated timestamp-path contract.

# Synthetic task-feed reader v3: independent repair re-review

Verdict: **READY for this exact synthetic local caller only.** R1 from the immutable v2 REPAIR is closed. This is not product adoption, live-service/storage qualification, general adapter safety or runtime/method-performance approval.

## Exact packet

Candidate: C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/task-feed-application-v3

- reader.mjs SHA-256: 8c5b5a5d17ff02e42019e1ee75cb66ab962253563424800751c1b794f9ee1597.
- Author receipt SHA-256: 1674a17dd9f5513685f11dfc163fd79a69087ac2f2f52a32373622f66c5d9f4d.
- Original independent REPAIR receipt SHA-256: f219c94c070b031e6ea0fc1025a3814a606b355a346b62bf3dd0d02874770f7e.

The actual directory, checksum file, DRAFT_FOR_INDEPENDENT_REVIEW status, author_self_ready=false and product_integrated=false match the supplied freeze. All eight author-bound outputs match. Both six-file historical v1/v2 packets and all 21 original review-bound inputs/artifacts match their sealed hashes. Identity checks are not independent authorship/authenticity or rights proof.

Full v3 reader, fixture, sparse tests, receipt, report and verification were inspected, together with the original REPAIR and prefrozen parent acceptance/counterexample note. Exact inspection depths are in [readset.json](readset.json). The reviewer authored no candidate or product bytes.

## Repair and compatibility

[reader-v2-to-v3.patch](reader-v2-to-v3.patch) contains the entire reader delta: one validEventArray helper and replacement of three hole-skipping every predicates. Each position must be an own, valid event before traversal. The same guard protects saved-state preflight, returned-page validation and the invalid-state fallback. It rejects rather than compacts or fills holes. Existing cursor, duplicate, policy snapshot, commit and completion logic is unchanged.

Independent execution, not author or parent passes:

| Check | Actual result |
| --- | --- |
| Original 12 behavioral assertions, import-only copy against v3 | 12 pass |
| Six v2 regressions, byte-identical copy explicitly selecting v3 | 6 pass |
| Nine original independent boundaries, import-only copy against v3 | 9 pass |
| Direct sparse and dense-invalid comparison, four inputs on both v2/v3 | Eight observations satisfy independent expectations |
| V3 syntax | Exit 0 |

The inherited suites ran once together: exit 0, 27 passed, no failed/skipped/cancelled tests. The eight direct observations overlap existing cases; they are not eight additional unique behaviors. [test-results.md](test-results.md) records commands and output; [copy-provenance.json](copy-provenance.json) and [test-copy-import-only.patch](test-copy-import-only.patch) bind unaltered assertions.

For sparse saved events, v2 still throws TypeError before callbacks; v3 returns HOLD/invalid-state with zero reads/commits. Its returned diagnostic state is the safe empty fallback, **not** a claim that malformed saved history was normalized or acknowledged. The caller's original sparse state remains unchanged.

For a sparse page, v2 still throws after one read; v3 returns HOLD/malformed-event after one read and zero commits, retaining the prior checkpoint. Both versions retain the existing HOLD results for dense [undefined] controls. Input state and page are unchanged in all eight observations. See [sparse-control-observations.json](sparse-control-observations.json).

The original 12 behaviors, conflicting/equal saved-ID rejection, literal acknowledged cursor, page/status/final snapshots, limit/drain snapshots, uncertain commit with no retry and final-cursor consistency all pass their preserved assertions.

## Record precision and limits

Non-blocking record note N1: the author report/verification attributes dense-undefined controls to the copied nine-test suite. That suite contains seven snapshot/policy/commit cases and two sparse cases; dense controls are in the separate four-test sparse suite and this independent direct replay. This review uses actual execution inventories, not that attribution. Preserve the sealed author record; any clarification belongs in a new parent record. The attribution error does not leave the code repair or dense controls unverified.

Semantic Implementation Diff kept comparison inputs and observation boundaries explicit; Invariant Guard supplied manual HOLD/callback/state expectations rather than deriving an oracle from the new guard. No broad redesign or new global harness was introduced.

This approves the bounded example with ordinary supplied in-memory adapters and structured-cloneable fixture payloads. It does not establish credential authority, service promises, storage atomicity/durability, remote completeness, hostile object/proxy safety, uncooperative callback wall-clock bounds, provider behavior, performance, source rights or whole-corpus completion. Adapter resolution remains only the declared acknowledgment.

All reviewer writes are confined to this fresh review-v2 root. No historical, candidate, product, installed or R10 bytes were edited; no providers, child agents, integration, acquisition, full suite or product launch occurred. Parent retains acceptance and integration.

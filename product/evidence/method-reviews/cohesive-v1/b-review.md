# Lane B instruction review: Dirac

Decision: **accept this exact body and metadata snapshot, pending parent release checks**.
No concrete blocking body defect was found in the nine changed entrypoints or
the new diagnostic-experiments-v2 reference. This is a review of another author's
lane B guidance; the reviewer's own lane C discovery code is outside scope.

## Identity and coverage

All ten `changedFiles` declared by `lane-b/candidate.json` were inspected in full.
The parent's subsequent Phoenix `skill.json` resource/provenance delta was also
reviewed explicitly; it is recorded separately in `metadata-delta.json`.
The nine existing entrypoints were compared with canonical
`c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d`; the new Phoenix reference is absent
there and was reviewed as an addition. All nine declared candidate body hashes
matched. Both the audit and baseline read-set agree with the canonical hashes
for those nine bodies. The author records cover 56 entries and 79 sources;
this review does not adopt their unchanged-entry decisions as independently
reviewed.

`read-set.before.json` identifies the initial source snapshot and canonical
bytes. `snapshot-checks.json` adds the inspected supporting references, metadata,
link checks and a second hash observation. `read-set.after.json` is the final
freshness check. Any later body change invalidates this acceptance for that file;
the exact SHA-256 values in `decision.json` define the reviewed snapshot.

## Per-file instruction decisions

| File under product/skills | Decision-changing contribution |
| --- | --- |
| counterbalanced-agent-evaluation/SKILL.md | A matched task pair is the aggregation unit; repeated easy runs cannot dominate difficult single attempts. Missing/invalid outcomes remain separate, and small development checks do not support a comparative claim. |
| eternities-daedalus/SKILL.md | Delivery follows the actual caller through wiring and observable behavior. Generated-code inspection and proportionate independent review are separated; a failed first check prompts scoped diagnosis rather than weakened assertions. |
| eternities-forge/SKILL.md | A serial thin slice is sufficient when workers are unnecessary. A payload handoff cannot close an authorized integration stage, while another owner's stage remains a legitimate handoff boundary. |
| eternities-hermes/SKILL.md | Pure transformations avoid invented operation journals; partial-write batches retain per-item outcomes and safe replay. Unknown external outcomes still require reconciliation. |
| eternities-mnemosyne/SKILL.md | Recovery expands only for a decision-changing gap, and no-match, inaccessible records and stale bytes remain distinct. A compact packet is not represented as restored native history or persisted memory. |
| eternities-oracle/SKILL.md | Short answers can keep locators inline. Search expansion must address an unresolved claim; stopping search does not establish prior-art absence or turn copies into independent evidence. |
| eternities-phoenix/SKILL.md | Nearest passing control and the first divergent boundary choose a discriminating probe. Repair can cross producer/consumer files within authority; failed interventions update diagnosis rather than repeat blindly. |
| long-horizon-work-continuity/SKILL.md | The ready/held frontier promotes executable progress, checkpoints occur at meaningful boundaries, and input dependencies govern revalidation. Pauses, resource limits, live ownership and unknown-effect rules remain intact. |
| memory-retention-and-recovery/SKILL.md | Missing rationale is separated from observable current state, index failure from actual deletion, and summaries from native history. Unrelated ready work can proceed without reauthorizing uncertain effects. |
| eternities-phoenix/references/diagnostic-experiments-v2.md | Predicted observations distinguish live hypotheses; controlled completion order challenges race fixes, and a successful rerun cannot erase intermittent evidence. Mitigation and causal identification remain distinct. |

These are instruction-level judgments. Only the supplied recovery consumer
below was executed as task work; the other routes were inspected, not exercised
against live systems. No wording-only revisions are requested.

## Portability, fidelity and composition

The changes require no machine-local storage path, particular provider, paid
account or installed execution platform. Tools and stores remain host-supplied.
Authority is scoped to the requested task; continuation paragraphs preserve
diagnosis-only requests, explicit pauses, other owners and external-effect
boundaries. Added references remain conditional. The edits make small tasks
lighter by making ledgers conditional instead of creating a fresh reporting
artifact for every edit, while retaining rollback/effect evidence where it
changes an operational decision.

All 24 relative Markdown links exist and stay within their skill directory.
Summary/trigger/anti-trigger/task metadata is consistent with the changed routes.
Phoenix's diagnostic reference was initially missing from declared resources;
the parent has now registered it and added exactly one first-party authoring
row. Both changes were reviewed: the resource points to the inspected method,
the provenance row makes no external rights or live performance claim, and all
other fields and existing provenance remain unchanged. Its exact new metadata
hash is `77a5338162ab934311464a2317eba256f12f8f51feb15cf7f4a84375c5f98797`.
No B guidance bytes changed. The current `instruction-reviewed` metadata and historical
review pointers cannot certify changed bodies by inheritance. This review
accepts only the exact hashes it records, without editing publication metadata.

The old Phoenix elimination card still describes one current hypothesis. The
new entrypoint explicitly scopes that to one intervention and retains competing
explanations; the new card evaluates what the same probe predicts for each.
Taken together, those references do not require discarding competing causes.

## Separate actual recovery consumer

Output directory:
`C:/Users/Dom/.codex/operations/godskills-cohesive-20261015/consumers/recovery-dirac/`.

The sole scenario input was `consumer-fixtures/recovery-handoff.md`.
No `acceptance.json`, other consumer fixture, parent assessment criteria,
provider or actual deployment system was read or contacted.
The consumer selected memory-retention-and-recovery and long-horizon-work-
continuity, plus their two relevant references, recorded in `used-methods.json`.

The runnable pure reducer returns `observe-only` for the supplied paused,
unknown-deployment/running-smoke state. After resume it requests lookup of
`stage-R2-7` rather than repeating the dispatch. The handoff preserves Worker B,
the scoped pause, R2/staging identity, unit-test evidence limits and the unrelated
uncommitted experiment. Production is rejected. Repeated function calls do not
claim to enforce external exactly-once delivery; caller journal/state and actual
provider semantics remain necessary.

Local validation passed **8/8 tests**, including all **80 valid state
combinations**, malformed input, evidence-dependent completion, scope/pause
precedence and nonmutation. Initial missing-module output is retained as the
before-implementation test receipt. These tests check the delivered local
reducer's contract; they do not establish that the methods outperform a baseline.
The parent identified B's prior ten checks as historical author-applied toy
checks. They were neither run nor counted as shipped runtime regressions here.

## Limits and remaining owners

Phoenix resource registration is complete and reviewed. Parent still owns
settled shared manifests, build, release/native installation and public consumer
acceptance. No product, test or
build files were edited by this assignment. Only this review directory and the
authorized recovery-consumer directory were written. No new agent, service call
or real operational effect was used. Review is independent of B authorship, but
the consumer implementation has only this reviewer's local verification.

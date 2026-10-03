# Dialogue and memory independent instruction review v1

**Pair decision: REPAIR.** The exact frozen dialogue tree needs a task-type repair and a bounded discovery-metadata repair; the exact frozen memory tree needs a narrowly scoped persistence-outcome procedure. The positive instruction findings below are not conditional acceptance of changed bytes. Both candidates are expected to remain `draft` until parent records an accepted independent review. Frozen-v1 product bytes remain unchanged during Harvey's application pass; only parent/author repairs after preserving this review and v1 may create a new candidate.

Reviewer is Sol C, author of the completeness/long-horizon pair, not the author of these two candidates. Review authority is read-only product inspection and writes only in this review directory. The controlling candidate identity is `artifacts/cognitive-workflows-20261003/candidate-freeze-v1.json`. The exact readset, ranges and SHA256 digests are in `readset.json`; scoped executable observations are in `check-results.json`.

## Required repairs

### D1 — Unsupported dialogue task type blocks catalog validation

Disposition: **REPAIR**, release-blocking metadata defect.

Location: `product/skills/interpersonal-understanding-and-dialogue/skill.json:22`, value `review` in `taskTypes`.

The current taxonomy supports `research`, `plan`, `build`, `verify`, `recover`, `orchestrate`, `create`, and `communicate`. The actual catalog inspector uses that task set at `product/lib/product.mjs:8` and rejects an unsupported member at line 60. Thus promoting maturity later would still leave this candidate invalid; this is independent of the expected draft-stage maturity gate.

Smallest repair: replace `review` with `verify` if coverage of dialogue checking is intended, or remove it while retaining the useful existing task types. Do not expand the global taxonomy to accommodate this one draft. The dialogue body and examples need no rewrite for this defect.

Recheck: freeze the changed metadata hash, confirm all declared task types are supported, and independently review the exact metadata change. Parent's later normal product validation remains required. No builder was run during this review.

### D2 — Reflection/motive wording is absent from positive discovery fields

Disposition: **REPAIR**, bounded lexical discovery defect.

Locations: `product/skills/interpersonal-understanding-and-dialogue/skill.json:5` positive triggers and line 4 summary; actual search behavior at `product/lib/product.mjs:148` and lines 154–165.

Parent reports a read-only preview of the six exact draft metadata entries through actual `searchCatalog`, with 11/12 preregistered positive queries satisfied. The unchanged query `reflect what participants said before assuming their motives`, at the unchanged top-three limit, omits this skill and returns unrelated statistical/object-ingestion/reconstruction matches. That aggregate/ranking observation is parent-supplied evidence, not a replay or published-release result from this reviewer; no hidden query suite or evaluator files were read.

The inspected implementation scores positive triggers (weight 7), ID words (4), summary (3), and category/task types (1). It tokenizes exact words and has a small synonym-group list with no reflection or motive family; it does not stem `reflective` into `reflect`. `antiTriggers` can exclude exact phrases but contribute no positive score, and the SKILL body is not a discovery field. Thus `reflective listening` does not cover `reflect`; the body/anti-trigger's discussion of hidden motives does not supply positive `motives` coverage. `participants` is absent from positive metadata as well. This explains why a request for a central procedure—reflect supplied statements before assuming motives—can miss the method despite a suitable body. It is a lexical metadata gap, not evidence that the respectful-dialogue procedure cannot handle the request.

Smallest repair proposal: add one general trigger such as `reflect participants' statements before inferring motives`. It names a reusable conversational operation and preserves the existing procedure's tentative treatment of interpretations. It is not the exact query text or a bag of benchmark-only terms. Retain every existing anti-trigger, including diagnosis/profiling, hidden-state certainty, coercion, manufactured intimacy and demographic stereotyping; add no clinical capability or psychological certainty claim. No body change is needed for D2.

Recheck: after the frozen pass and a new metadata hash, parent independently reruns the same preregistered query, top-three limit and actual search algorithm, alongside the existing positive and exclusion checks. The proposed trigger has not been applied or rank-tested; no guarantee of a final top-three rank or semantic retrieval quality is asserted. Do not repair by changing the expected query, limit, algorithm or exclusions.

### M1 — Retention lacks a persistence outcome and failed-save branch

Disposition: **REPAIR**, core retention procedure gap.

Location: `product/skills/memory-retention-and-recovery/SKILL.md:35`, "Checkpoint, storage, and finish"; neither bundled example exercises storing a checkpoint or a failed/uncertain save.

The text specifies what to preserve, limits storage to an authorized host store, and correctly returns an unpersisted response when no such store exists. It does not specify performing the retention through that real store, identifying the resulting checkpoint, establishing whether the save succeeded, or handling an available authorized store whose write fails or has an unknown outcome. Those states differ from "no store is available." This leaves the method's central promise—state surviving interruption—without an inspectable persistence result. The existing pointers identify task artifacts; they do not establish where the checkpoint itself was retained.

Consequential interruption: an approved checkpoint store is available, but the save returns an error or times out before the next session. A prepared checkpoint is not evidence of durable retention. The method gives no explicit disposition or fallback for this path, even though recovery is careful about uncertain task effects. This is an instruction-level failure mode inferred from the missing branch, not a tested runtime incident.

Smallest repair: when retention is requested and authorized, use the actual host storage operation; record the checkpoint locator/identity and observed persistence outcome. Establish retention from a reliable receipt or retrieval when available. If the save fails, is rejected, or remains uncertain, return the compact packet with `not persisted` or `persistence unknown` as applicable, preserve the failure/unknown locator, and avoid an assumed-success claim or blind duplicate write. Keep the existing no-store fallback. Add one short conditional example showing save success versus failed/unknown persistence, without inventing a storage API or implementing a writer.

Recheck: independently inspect the revised body and example at new hashes. The procedure should let a consumer distinguish a prepared response, verified retained checkpoint, failed save and unknown save, while preserving the same storage permissions and compact context. The independent evaluator can later test actual host behavior; this reviewer did not access those fixtures or operate a checkpoint store.

## Instruction findings that support the design

| Area | Dialogue finding | Memory finding |
| --- | --- | --- |
| Selection and fit | Meaningful misunderstanding, preference/boundary, disagreement or repair; ordinary copy edits/small talk excluded. `social` is a valid and appropriate category. | Interruption, handoff, correction or stale/conflicting records affecting the next action; ordinary lookup/recall/status excluded. `memory` is a valid and appropriate category. |
| Decision usefulness | Separates the user's goal from the recipient's freedom; selects only hypotheses that alter the next question; distinguishes need from proposed position; repairs a specific act. | Exact task/target/authority match, source version check, stale/conflicted/unknown states, dependent invalidation and safe independent progress change recovery decisions. |
| Nonclinical and respectful scope | Explicitly excludes diagnosis/treatment, hidden-state certainty, profiling, demographic stereotyping, coercion and invented intimacy. It invites correction and permits refusal/no agreement. | Does not infer personal state; excludes secrets/incidental personal material and scope transfer without evidence. |
| Conflict and uncertainty | The shift/setup example preserves differing accounts and does not label dishonesty. The silence example separates missing reply from inferred anger and permits waiting. | Version 3 review does not transfer to version 4; later "hold" is not resolved by timestamp alone; changed policy needs effective-date applicability. |
| Authorized effects | Returns a draft, focused question or perspective map. It does not instruct sending a message or manipulating an account. | Host/task storage permissions retained, no-store response labeled unpersisted, uncertain consequential task action held before retry. Persistence outcomes still need M1. |
| Proportionality | Compact six-step procedure, selective alternative readings, no mandatory ledger for ordinary dialogue, examples conditional. | Compact task record and narrow authoritative retrieval, no raw history replay or mandatory pipeline. M1 can be repaired locally without a retention system redesign. |
| Portability | No required model, clinical instrument, service, proprietary API, workstation path or external skill load. | No required store implementation, Keel, vendor, model or proprietary API. The host must supply approved storage for actual persistence; fallback remains possible. |
| Finish condition | A useful requested artifact with unresolved points visible; no psychological mastery or certainty claim. | Consumer sees scoped verified state or a precise evidence gap; no unlimited recall claim. Durable-save state is the remaining gap. |

Dialogue's acknowledgment and repair examples stay grounded in the supplied acts. They do not require forgiveness, reassurance or a reply. The method does not force negotiation after a boundary: it explicitly treats stated boundaries as real and includes pause/no agreement. No consequential prose defect was found in this document review.

Memory's freshness and correction logic is sound at instruction level. It preserves old evidence with as-of context, identifies dependent conclusions, and does not confuse a pointer or matching digest with truth, approval or current applicability. A universal expiration duration is neither needed nor recommended. The examples are useful development illustrations; they do not prove retention works.

## Sources and structural evidence

All six candidate files matched the freeze before review. The scoped checker rechecks those identities. All eight adopted source paths in the two metadata files were read completely and their claimed hashes matched current bytes. The author's source ledger was also read; its attribution and declared rejected imports are consistent with the selected mechanisms. The three rejected source bodies in that ledger were not opened or adopted by this reviewer. No new source acquisition was performed. File-level licensing/legal clearance remains unestablished, as the author ledger already discloses; no additional clearance is implied by this review.

Both Skill Creator frontmatter validators returned `Skill is valid!` with exit code 0. Scoped checks found the dialogue task-type defect and no freeze/source/link/workstation-path defect. These observations do not overrule the manual M1 finding. Category choice and `draft` maturity are expected and are not defects. Related owners exist and fit the source mechanisms; relationships require no automatic loading.

One inspection command failed to parse because a PowerShell `foreach` was directly piped. It ran no read/mutation and was replaced with a captured array. This was reviewer tooling failure, not a candidate failure, and no result is inferred from that failed command.

## Boundaries and next gate

No product or author-owned file was edited. No builder, integration, provider, descendant, scheduling or external effect was invoked. No file under `independent-evaluation/raw` or an assessor path was read; only the top-level directory name `independent-evaluation` appeared in an inventory. No independent fixture was applied or expected answer obtained. This report is independent instruction review, not independent behavioral evaluation.

Parent/author should repair D1, D2 and M1 after the frozen application pass, preserve this negative receipt and v1, freeze new hashes and request focused re-review of changed bytes. Independent raw-fixture applications, catalog discovery, export/integrity and release gates remain separate. There is no generic quality score or universal superiority claim.

# Independent conditional-method caller applications

These are twelve actual reviewer-written document applications against the frozen product-only candidate, plus one supplemental Daedalus row inspection. Literal title-free requests and the synthetic supplied fixture are in [caller-inputs.json](caller-inputs.json). No request was changed after reading the candidate owners/resources. This reviewer knew prior method names: these are not blind usability experiments, independent model runs, or runtime observations.

All paths below are relative to the candidate product root. Each is the minimum instructional path used to judge that caller, not a claim that this whole review session never read other owners or package evidence. Negative cases inspect the directory's exclusions, then the full appropriate owner; they do not apply the excluded new reference. Ordinary controls do not load the new method. Review records are not routine caller dependencies.

## P1 — Follow only new task messages

Path: `README.md` → `METHODS.v1.md` first task row → full `skills/eternities-hermes/SKILL.md` → only `references/cursor-paged-task-messages.md`.

Selection: the task is a still-running task's growing message feed with a saved reader position, not a warehouse/table, archive-summary or response-byte problem. The row is recognisable from those ordinary request terms without its title. Full Hermes places it inside the CLI/API read bridge and makes effects/authority explicit.

Compact plan: bind the task ID, endpoint/API/schema version, exact saved checkpoint, current read authority and separate local-retention authority. Obtain the task's actual page/byte bounds, timeout/poll policy, deadline and stop source; their values are not supplied in this review and are not invented. Check the supplied append-only/continuation contract before any future call. Fetch a bounded page with the exact service token; validate identity/schema/bounds, deduplicate stable event IDs, and commit accepted messages with the returned checkpoint atomically or through a replay-safe journal. Do not derive the checkpoint from the largest ID or interpret sparse IDs as losses. A crash must neither lose uncommitted messages nor advance past them.

An empty page is idle, not task completion. In the hypothetical terminal-status case with no final watermark/drain guarantee, retain terminal task state but report feed completeness `unknown` or `incomplete`; do not emit `complete-and-drained`. Expiry without documented resynchronization preserves the prior checkpoint and incompleteness. Local stop ends observation only; remote cancellation requires a separate authorized mutation and settlement evidence. If the service contract is undocumented, use ordinary API-bridge planning and leave completeness unresolved. No request, persistence, remote cancellation or feed observation occurred here.

Result: document-use criteria met; meaningful completeness and authority gates retained.

## P2 — Observe an owned local tool truthfully

Path: `README.md` → `METHODS.v1.md` local-command row → full `skills/eternities-hermes/SKILL.md` → only `references/truthful-cli-progress.md`.

Selection: the caller already owns and authorized the process and asks for observation, not visual styling, event-schema generation, execution permission or a new launch. The row's output-channel/validated-signal wording identifies that narrower work.

Compact plan: bind the existing invocation/process identity, supplied progress protocol, output mode, deadline, cancellation/cleanup authority and application validator. Do not launch a child to obtain evidence. Preserve child stdout bytes exactly and keep reserved stderr attributable to the child. With redirected mode and no separately requested status channel, inject no progress or terminal escapes into either stream.

The hypothetical absence of valid progress means `no progress reported`; a heartbeat, elapsed time or log volume does not provide a denominator, percent, phase, ETA or success. Record process liveness/exit separately from observation health. A hypothetical zero exit with an unchecked application artifact leaves application validation `not-performed`/`unknown`, not success. Cancellation settlement, descendants/resources and cleanup also stay unresolved until their own evidence exists. Observer failure degrades monitoring; it does not authorize killing, restarting or relaunching the process. Late events cannot rewrite a final receipt. These are planned classifications, not observed process facts.

Result: document-use criteria met; no invented progress, task-process launch or validated application-success claim.

## P3 — Prepare a source-linked specification draft

Path: `README.md` → `METHODS.v1.md` supplied-mathematical-prose row → full `skills/symbolic-mathematics-python/SKILL.md` → only `references/source-grounded-math-specification.md`.

Selection: supplied prose is to become a specification with locators, unknowns and conflicting mathematical statements, not an already-declared equation to solve or a prose-only outline. The restored native description remains the canonical symbolic route; the directory and conditional body supply this explicit additional path. The source-spec reference's stop boundary governs this extraction; the parent's ordinary derivation/cross-check section is not applied as a demand to solve the draft.

Actual compact draft, limited to the reviewer-authored synthetic `reviewer-fixture-S1/v1` in the input record:

| Record | Source notation and meaning | Unit / domain / indexing | Evidence and status |
| --- | --- | --- | --- |
| Q-D | `D`, duration; preserve the source symbol | seconds are stated; domain and additional conditions `UNKNOWN`; indexing `UNKNOWN` | `S1:L1`, `S1:L2`; source-attributed constraints, not verified truth |
| Q-N | `N`, a recorded field; its quantity meaning is `UNKNOWN` | unit and domain `UNKNOWN`; “for each delivery” is stated, but index notation/cardinality `UNKNOWN` | `S1:L3`; do not assume a count, integer, zero, or a value |
| R-1 | `D` is no greater than 3 seconds | Preserve that direction and threshold; no extra conditions | Statement `S1:L1` |
| R-2 | `D` must be at least 4 seconds | Preserve that direction and threshold; no extra conditions | Statement `S1:L2` |

Statement ledger: all three lines are synthetic source statements, not established domain facts. Q-D/Q-N and R-1/R-2 are local record IDs, not replacement mathematical symbols. No additional source assumptions are stated. Do not silently add nonnegative/real/integer domains, an equality, a causal arrow, a reconciliation condition or a relation involving N.

Conflict record: preserve L1 and L2 as potentially conflicting constraints on the source-labelled D; consistency/context is `UNRESOLVED`. Do not choose a preferred line, relax a threshold, solve the constraints or claim a feasible/infeasible set. Domain-review request: independently check symbol identity and meaning, units, domain, quantifiers/direction, source fidelity, missing context and the conflict; record corrections/disagreement with locators. Keep N's meaning/unit/domain open. Stop at this draft and review request. No solver, proof, real-domain source verification, model fit, rights decision or domain review was performed.

Result: document-use criteria met; actual traceable draft produced, with independent domain review still pending.

## Four Hermes adjacent-owner exclusions

| Caller | Full-owner path after README/directory exclusions | Actual bounded application |
| --- | --- | --- |
| NH1 — warehouse ingestion, late/reordered records and expired page key | `INDEX.md` → full `skills/columnar-ingestion-rollup-and-query-layout-design/SKILL.md` | Keep raw/normalized/rollup authority distinct, bind event identity/watermark and correction/replay behavior, and require real ingestion/recovery evidence before table completeness. The generic cursor/page words do not make this an application-level task-message feed. No new Hermes card selected; no warehouse operation performed. |
| NH2 — accessible visual progress, no command/process | `INDEX.md` → full `skills/eternities-muse/SKILL.md` | Plan semantic status, focus/live-region behavior, contrast/reduced-motion and presentation from the given data contract. Unknown ETA/progress stays unknown; visual design does not prove backend observation. No process wrapper, lifecycle launch or new Hermes card selected; no UI rendered or accessibility qualification claimed. |
| NH3 — durable conversation summary/archive | `INDEX.md` → full `skills/eternities-mnemosyne/SKILL.md` | Use continuity/context/memory design: bind source identity and authority, preserve verified/stale/conflicted state, retention and invalidation. Saved position is an archive locator, not a task-feed continuation. No new Hermes card selected. The separate repository-local lifecycle DRAFT is also not forced: this caller names no particular repository-local collection. No transcript was acquired or memory written. |
| NH4 — producer progress JSON schema only | `INDEX.md` → full `skills/structured-output-contracts/SKILL.md` | Define consumer/version, field types, missing versus zero, units/bounds and cross-field rules; validate source/request binding independently of execution permission. Ordinary schema work needs no governed-vocabulary extra reference. No process observer or new Hermes card selected, no producer/service executed. |

Result: all four negative-fit criteria met by actual work and exclusions, not literal phrase suppression or a global rank assertion.

## Three Math non-method exclusions

| Caller | Full-owner path after README/directory exclusions | Actual bounded application |
| --- | --- | --- |
| NM1 — prose-only literature outline with mathematical work excluded | `INDEX.md` → full `skills/retrieval-grounded-answering/SKILL.md` → full `skills/eternities-logos/SKILL.md` for the artifact handoff | The initial expected navigation owner in the input record reflects the inherited canonical shortlist. Its full body says an ordinary supplied-document task needs no new retrieval index. Use direct source-supported reasoning and Logos structural/reporting work for authors, claims, disagreements and citations. Require authorized supplied material rather than inventing literature or acquiring sources. Math extraction is not selected. This semantic handoff is not a change to the frozen caller request or a claim of a new lexical owner ranking. |
| NM2 — qualitative themes/entities, no statistical or mathematical work | `INDEX.md` → full `skills/eternities-logos/SKILL.md` | Plan a source-labelled structural representation, separating quotations/restatements/inferences and preserving missing evidence. Do not invent variables, mathematical relations or a source-spec artifact merely because the exclusion contains “mathematical.” No source material was extracted in this review. |
| NM3 — coordinate units/ranges/value validation | `INDEX.md` → full `skills/geospatial-coordinate-integrity/SKILL.md` | Bind actual coordinate reference, axes, units, range metadata and source interpretation; preserve original data and unknown CRS/datum. Assignment, transformation and measurement remain distinct. A table/units request is not source-prose specification. No Math extraction selected, conversion performed, external documentation fetched or accuracy claim made. |

Result: all three negative-fit criteria met. Appropriate prose/retrieval and geospatial boundaries are preserved without forcing a skill where ordinary competence is sufficient.

## Ordinary workflow controls

OH path: `README.md`/`METHODS.v1.md` (reject repeated-page row) → `INDEX.md` → full Hermes → existing `references/methods.md#incremental-byte-to-record-stream-intake`. Compact plan: retain one incremental UTF-8 decoder/framing state across arbitrary chunks, emit only complete NDJSON records, bound buffering/backpressure, flush and validate the final remainder. A truncated last record is a framing error with partial emitted-record count, not complete. No application-level checkpoint pagination, source access or parser runtime exercised. Result: existing ordinary route preserved.

OM path: `README.md`/`METHODS.v1.md` (extraction excluded) → `INDEX.md` → full Math → existing symbolic workflow in that owner; no new reference. The already-declared equation and real-domain request belongs to domain/assumption/branch/singularity/independent-check planning. Record how a later authorized derivation would be cross-checked; do not solve it here, return roots, or make a proof claim. Result: extraction is excluded without suppressing the established parent workflow.

## Supplemental Daedalus row inspection — not a thirteenth contract caller

The row actually says “explicitly optional” scenarios and retains paid-provider and required-acceptance gates. Its exclusion says a required live/paid acceptance test is not optional. Read full `skills/eternities-daedalus/SKILL.md`, its matching `references/optional-model-scenarios-ci.md`, existing test-design evidence and full Herald for the policy handoff. The copied original report/receipt were inspected as review evidence, not used as runtime policy.

For a required real-provider acceptance gate plus separate exploratory scenarios, keep the real gate required and unresolved. Do not put it into the optional provider-free partition or substitute a canned fixture. Split only genuinely optional scenarios from the stable local workflow; ordinary deterministic model-shaped fixtures stay required. Missing specific spending authority or unaccepted unknown spend keeps optional work not-run. Uncertain paid acceptance means incomplete/unknown and no automatic retry. Herald must inspect actual revision/CI/status mapping; ambiguity leaves enablement disabled. Nothing in this row proves merge safety or provider isolation.

The row points to exact original methodBindings path/hash and the original report/receipt copies are verbatim. Its narrow scope and unqualified outcome fit the underlying method. This observation is not approval of later final metadata bytes, new live CI or a transferred approval of any changed method. The three new methodBindings in this review exclude Daedalus because its body approval is prior and separate.

## Overall document application result

Twelve of twelve frozen caller requests meet the agreed document-use/negative-fit/ordinary-route criteria. This is independent manual judgment with the compact outputs above, not twelve automated tests or evidence of agent performance. The source-spec domain review remains pending. No product modification, acquisition, provider, live service, task-process launch/observation, solver or mathematical-domain validation occurred.

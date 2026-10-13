# API and Vendor Specialists Implementation Plan

> **For agentic workers:** Use `dispatching-parallel-agents` for independent content lanes. Parent owns generated product artifacts, tests, integration and installation.

**Goal:** Add two useful, portable specialists to the verified 91-skill pack and deliver an independently reviewed, published and installed 93-skill upgrade.

**Architecture:** Preserve the existing product format and all current skill payloads. Each new entrypoint links optional deeper methods, has focused discovery metadata, and records exact inert source identities. Existing generic owners remain suitable for ordinary tasks.

**Tech Stack:** Markdown and JSON instructions, existing Node 24+ built-in-only product tooling and Node test runner.

**Spec:** Dom's continued authorization for practical Godskills refinement; the contracts and acceptance cases below are the concrete scope.

## Global Constraints

- Baseline main: `7c11bb315c1db73415ef468748bf67cec59f17a1`; release `213c0d2180e5613ba9b29dc0ea4732456f43e1a314874792e0f2e915014854c0`.
- Only two GPT-6.1 Sol xhigh content/review seats, no descendants or provider calls.
- Sources are inert existing warehouse files. No new acquisition or upstream execution.
- Preserve all prior 91 skill payloads, historical receipts, protected activation bytes, untracked user experiment and unrelated installed skills.
- Separate authors and reviewers. Review exact candidate bytes; do not label authored instructions runtime-proven.
- Do not apply R10 or claim whole-corpus completion. Saved automation stays paused.

## Task 1: Contract methods and source-bound authoring

**Files:** New `product/skills/api-contract-design-and-evolution/{SKILL.md,skill.json,references/methods.md}` and `product/skills/vendor-evaluation-and-exit-planning/{SKILL.md,skill.json,references/methods.md}`. Private source/review packets live under the matching operation folder; no private local paths in portable content.

**API contract:** Cover consumer/provider compatibility in both directions, request and response shapes, absent/null semantics, state changes, idempotency scope/lifetime/conflicting payloads, concurrency, pagination consistency, error/retry behavior and migration/deprecation evidence. Avoid prescribing one framework or treating a schema diff as a behavioral compatibility proof. Output a concrete contract/change matrix with distinguishing examples and executable checks where available.

**Vendor contract:** Compare a declared requirement set, mandatory eligibility, documented performance, uncertain evidence, costs across one horizon, renewal deadlines, switching and exit feasibility. Keep hard constraints distinct from weighted preferences; missing facts remain explicit. Avoid invented prices or probabilities and avoid allowing sunk costs to distort prospective choice. Output a defensible comparison and reversible trial/renewal/exit decision with named unresolved inputs.

- [x] Each author reads current neighboring owners plus two exact source bodies and applicable notices, recording hashes and available revision identity.
- [x] Each author writes original methods and metadata within its sole assigned skill folder; no shared generation or edits to existing owners.
- [x] Each author provides a concise mechanism comparison, rejected source recipes and draft limits.

## Task 2: Concrete routing and consumer checks

**Files:** `tests/api-vendor-discovery.test.mjs`; private `application-briefs.json` and parent-only expected observations in the operation folder.

**Routing interface:** `searchCatalog(catalog, query, {limit:3})`; require target skill among candidates for literal and paraphrased task requests. `need:'none'` must abstain. Existing schema migration, rate recovery, pricing and contract-review routes remain candidates for their own tasks. Preserve frozen score/resource expectations.

- [x] Before author drafts are built, run failing new-skill discovery cases against the existing catalog; preserve output.
- [x] Prepare API change examples with old/new clients, uncertain mutation, key collision, concurrent writes and mutable-page traversal; prepare vendor choices with uneven contract terms, mandatory exclusions, exit costs and an unresolved input that changes the decision.
- [x] Build with `node product/bin/godskills.mjs build`, validate, then run `node --test tests/api-vendor-discovery.test.mjs` and relevant package regressions.
- [x] Different reviewer applies the opposite author's instructions to the bounded case and parent compares actual output with its preregistered expectations. Deterministic supplied-cost checks passed; API service checks remain proposed.

## Task 3: Review, release and installation

- [x] Cross-review actual content, references, metadata, provenance and task outputs; repair confirmed defects and get fresh review of changed bytes.
- [x] Run the required full suite once with one test worker in the isolated checkout; broaden only for changes or failures. First run found a metadata regression; preserved failure, repaired triggers, then 1736 passed / zero failed / two existing skips.
- [x] Validate/export the complete product and exact manifest; independent reviewers validated the pack while parent verified archive extraction. Reconciled upstream, merged/pushed accepted `22d1ece` and verified the remote. Same-commit post-merge isolated suite passed 1,736 with two existing skips.
- [x] Installed through the journaled installer using a fresh rollback directory; exact before/after/backup contents verified, 81 unrelated records unchanged, installed validation and discovery passed.
- [x] Recorded the exact release and practical evidence limits in docs/api-vendor-release-20261013.md. Automation remains paused; final private continuity seal closes this milestone, not the larger quarry.

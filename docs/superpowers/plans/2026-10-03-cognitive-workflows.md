# Cognitive Workflows Implementation Plan

> **For agentic workers:** Use `dispatching-parallel-agents` for the three independent author slices and independent evaluation; parent executes the integration steps inline.

**Goal:** Deliver six portable cognitive/workflow methods with independently reviewed bodies, realistic fixture applications, discovery checks and a backed-up installed release.

**Architecture:** Preserve the existing portable pack and runtime. Add six focused skill directories with lazy references; do not change the search algorithm or protected activation runtime. Native Codex capabilities are optional host companions, not universal dependencies.

**Tech Stack:** Markdown/JSON product methods and Node 24 built-in test/pack tooling.

**Spec:** docs/superpowers/specs/2026-10-03-cognitive-workflows-design.md

## Global constraints

No old autonomy restart, new acquisition, paid-provider retry, source-rights
promotion, private export processing, unrelated skill modification or activation
byte changes. Maximum two GPT-6.1-Sol xhigh and two GPT-6-Luna max workers, no
descendants. Parent owns shared generated files and release effects.

### Task 1: Author portable bodies

- [ ] Luna A writes `product/skills/voice-style-calibration/` and `product/skills/imaginative-concept-development/`, with fresh prose, metadata, examples and an exact source ledger.
- [ ] Luna B writes `product/skills/interpersonal-understanding-and-dialogue/` and `product/skills/memory-retention-and-recovery/`, with source/interpretation and retention/authority boundaries.
- [ ] Sol C writes `product/skills/completeness-and-consistency-audit/` and `product/skills/long-horizon-work-continuity/`, including uncertain-effect resumption and realistic completeness failures.
- [ ] Sol D writes only independent evaluation protocol/fixtures and review sidecars in `artifacts/cognitive-workflows-20261003/independent-evaluation/`.

### Task 2: Parent discovery and host integration

- [ ] Write `tests/cognitive-workflows-discovery.test.mjs` first against real `searchCatalog`; observe missing-method failures on the baseline.
- [ ] Write `product/HOST-CAPABILITIES.md` explaining portable methods versus optional native skill/tool adapters, with no machine-local dependency.
- [ ] Add a compact cognitive-workflow section to `product/RECIPES.md` and links from `product/README.md`; no mandatory chain loading.
- [ ] After exact non-author document acceptance, mark new metadata instruction-reviewed with review provenance. Build with `node product/bin/godskills.mjs build`, then validate.
- [ ] Run `node --test --test-concurrency=4 tests/cognitive-workflows-discovery.test.mjs tests/universal-product.test.mjs tests/product-method-directory.test.mjs tests/product-archive.test.mjs`.

### Task 3: Independent applications and repair

- [ ] Freeze the authored file hashes; give independent reviewers only raw case input, relevant skill bodies and effect boundaries, not expected answers.
- [ ] Preserve each review and application artifact. Repair concrete defects in versioned candidates; re-review changed bytes without rewriting prior negative evidence.
- [ ] Cross-review author pairs where necessary; do not accept author self-review. Keep fixture results distinct from claims of measured superiority or multi-day operation.

### Task 4: Product release and installation

- [ ] Reconcile `origin/main` and protected hashes, run the bounded root suite and fresh relocated-pack checks, verify exact resulting content identity.
- [ ] Commit only this batch's paths, integrate accepted branch into current main and push under the existing Godskills publication authority.
- [ ] Export a new verified ZIP without replacing historical archives. Run the existing installer only after inspecting the exact current installation and creating a fresh rollback destination.
- [ ] Verify all managed/runtime file hashes and unchanged unrelated host files. Record final commit, release, archive and backup receipts.
- [ ] Close all four workers, leave old automation paused and report the useful delivered methods and remaining limitations.

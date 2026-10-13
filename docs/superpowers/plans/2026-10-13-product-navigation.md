# Selective Product Navigation Implementation Plan

> **For agentic workers:** Use `dispatching-parallel-agents` for genuinely independent tasks or `executing-plans` for inline task-by-task execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a new agent browse domains and read exactly one complete skill without loading the whole catalog or guessing a filesystem layout.

**Architecture:** Add read-only navigation beside the existing search API. The CLI verifies the pack before navigation; exact inspection returns the whole selected entrypoint with its hash and optional resource pointers. A small Markdown start page supplies the same staged approach without Node.

**Tech Stack:** Node.js 24 built-ins, Markdown, node:test.

**Spec:** `docs/product-direction-20261013.md`

## Global Constraints

- Preserve all 93 existing skill payloads and existing search/route behavior.
- No provider, network, host-specific path, new dependency or automatic activation.
- Keep unknown IDs/categories and malformed arguments explicit; do not silently fall back to a different skill.
- Preserve protected activation bytes, historical receipts, user experiments and unrelated installations.
- Whole-corpus accounting and general performance qualification remain separate.

## Task 1: Verified read-only navigation

**Files:** `product/lib/navigation.mjs`, `product/bin/godskills.mjs`, `tests/product-navigation.test.mjs`.

**Interfaces:** `browseCatalog(catalog, {category, limit, offset})` returns sorted category counts or one category's metadata in deterministic pages (default five, limit 1..20, explicit nextOffset). `inspectSkill(root, catalog, id)` returns the exact full entrypoint and declared resource pointers after validating the selected body hash. Both return `authority: none`, `activation: none`, and review-required selection; neither chooses a skill for the host. Whole-pack integrity validation reads file bytes; compact output is not metadata-only disk I/O.

- [ ] Add CLI tests against a copied pack: `browse` covers 21 categories/93 IDs, `browse --category business` returns only that category, `inspect voice-style-calibration` returns exact source bytes and no reference bodies. Unknown category/ID, duplicate flags, traversal, extra positionals and modified payloads fail without useful content leakage. Verify failures before production edits.
- [ ] Implement navigation and wire `browse [--category CATEGORY]` / `inspect ID` into the CLI. Sort deterministically. Use validated exact IDs, not paths from a request. Recheck body identity when reading it; do not truncate the entrypoint or automatically read its references.
- [ ] Run new tests and existing package/discovery controls. Add root/domain/inspection size observations as measurements, not claims about model billing or semantic superiority.

## Task 2: Make the default entry simple

**Files:** `product/START-HERE.md`, `product/README.md`, `product/DISCOVERY.md`, root `README.md`, generated product manifests.

- [ ] Author a short portable start page with links to all category anchors, the normal search path, and exact inspection. No mandatory workflow stack.
- [ ] Explain that browse category is an organizational filter, not all cross-domain capabilities. Inspect is an explicit read, not proof that a consumer followed the method.
- [ ] Build and validate manifests. Verify all preexisting skill payload hashes are unchanged. Have a different reviewer inspect the candidate and execute a new-user path.

## Task 3: Deliver the reviewed candidate

**Files:** dated implementation report, standalone ZIP and sidecar; private operation records.

- [ ] Reconcile upstream, run relevant checks and the full repository suite once on the final candidate, repair confirmed in-scope failures, and preserve negative results.
- [ ] Export and test fresh extraction from an empty working directory. Keep historical archives.
- [ ] Integrate/push only the accepted candidate. Back up the installed native/runtime snapshot, install once, and verify exact before/after hashes plus unrelated content preservation.
- [ ] Record completion of this product milestone and the honest remaining effectiveness/quarry work. Do not restart the paused automation.

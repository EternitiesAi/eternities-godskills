# Host integration review v1

## Verdict

**REPAIR** for the bounded README/recipes/test slice. `product/HOST-CAPABILITIES.md` and the discovery-test design are ready by static inspection. The README and recipes need explicit draft status before these six methods are presented as available methods. A smaller wording repair should also avoid claiming that the resulting concept is categorically original.

## Scope and evidence limits

Compared the four requested worktree files with `docs/superpowers/specs/2026-10-03-cognitive-workflows-design.md` and baseline `9409eb8f2f10300a316879d042b12159f94ed302`. The baseline did not contain `product/HOST-CAPABILITIES.md` or `tests/cognitive-workflows-discovery.test.mjs`. No author bodies, generated manifests/catalog, independent-evaluation/raw files, or assessor files were read. The discovery tests were not run; their current runtime result is therefore unverified. Native documentation links are accepted as parent-verified per the review request and were not fetched again.

## Findings

### R1 — Mark the six methods as drafts in the reader-facing entrypoints

`product/README.md:82-87` says the library “offers” the six methods. The new recipes link to all six and describe them as active composition choices (`product/RECIPES.md:81-123`), without identifying their draft status. This conflicts with the same README's rule that a DRAFT method remains a proposal until separately reviewed and accepted (`product/README.md:153-157`) and the design's exact-byte independent-review gate (`docs/superpowers/specs/2026-10-03-cognitive-workflows-design.md:40,46-48`). All six methods are still draft.

Before accepting this documentation slice, label each of the six methods as DRAFT/proposed in the overview and recipes, and avoid wording that implies acceptance or current discoverability. The affected IDs are `voice-style-calibration`, `imaginative-concept-development`, `interpersonal-understanding-and-dialogue`, `memory-retention-and-recovery`, `completeness-and-consistency-audit`, and `long-horizon-work-continuity`.

### R2 — Narrow the categorical originality claim

`product/RECIPES.md:93-94` calls the result “original work.” The recipe describes a process for developing a different concept and inspectable style choices, but this slice supplies no novelty or originality check. Change this to a bounded deliverable claim, such as a new concept draft with visible design choices, and leave global novelty unasserted.

### Discovery test — READY as a real-catalog regression definition; execution unverified

The test imports `searchCatalog` and reads the actual `product/catalog.json` (`tests/cognitive-workflows-discovery.test.mjs:3-4,20-21`). Its twelve positive cases give two user-style requests for each of the six IDs and require only that the ID appear in the top three. They also assert `authority: none` and `activation: none`. A separate adjacent DSP request checks that the audio specialist remains discoverable while the interpersonal method does not (`:35-40`). The file explicitly limits these to particular real-catalog requests and disclaims semantic applicability and agent-improvement evidence (`:6-8`). It does not assert heading matches, a universal paraphrase ability, ranking superiority, latency, or performance.

This is a genuine catalog control, not a mock selector. It has one adjacent negative-control scenario; the direct and paraphrase-like requests are bounded query cases, not proof of general semantic retrieval. Because the generated catalog was excluded and the test was not run, no pass result or current inclusion of the six draft IDs is claimed.

### Portability, selective loading, host capabilities, and counts — READY

- The README selects one entrypoint and only needed references, says related skills are suggestions, and distinguishes lexical retrieval from semantic understanding. The new composition examples load companion methods conditionally rather than making a mandatory chain.
- The host guide keeps model, storage, tools, workers, and scheduling in the receiving host; it says those facilities are optional and does not imply that a retained checkpoint is a running worker. Its Codex section is conditional. The official documentation links were parent-verified today, as stated in the request.
- The baseline README's fixed “68 parent skills” phrase was removed; the current wording says “all skills in this pack.” No hard-coded total count appears in the four reviewed current files. The README's six-method list matches the design. The final packaged count remains unverified because generated catalog/manifest files were out of scope.

## Exact inspected hashes

All values below are SHA-256 of exact file bytes. “Current” means the worktree file as inspected; “baseline” means the Git blob at the named commit.

| Inspected object | SHA-256 or presence |
| --- | --- |
| Current `product/README.md` | `fd77f746ac811e6b6ab9129d384a741f31908f5c9e17cbf44e0aeccd86b0b247` |
| Current `product/RECIPES.md` | `4f01d5f665d96e40cb265426446f9537c77de1f89566cf4f12e25541e725c8f0` |
| Current `product/HOST-CAPABILITIES.md` | `6faa40662c752bdfb3bbeb5509388f7399c99640283b958ecc56b3415f9f25c5` |
| Current `tests/cognitive-workflows-discovery.test.mjs` | `d1d8cfdb77c9fc3f3bcf5c0c442265ae898bdfca782425994753cc7843805455` |
| Current `docs/superpowers/specs/2026-10-03-cognitive-workflows-design.md` | `5a805f2067444a16c75e18dd0805c731d927c4619b3e8dce191fef9ae80c3955` |
| Baseline `9409eb8f2f10300a316879d042b12159f94ed302:product/README.md` | `2b17c2ed8047c94407038bf815244b88b13b8773dd60f69ca607b8be0ef50d2f` |
| Baseline `9409eb8f2f10300a316879d042b12159f94ed302:product/RECIPES.md` | `64d1c9c459a9fa91cf254d4ce2ac2033b9d34b0ecf39c523d6d3b640ace792ce` |
| Baseline `9409eb8f2f10300a316879d042b12159f94ed302:product/HOST-CAPABILITIES.md` | Absent |
| Baseline `9409eb8f2f10300a316879d042b12159f94ed302:tests/cognitive-workflows-discovery.test.mjs` | Absent |

Worktree HEAD was `9409eb8f2f10300a316879d042b12159f94ed302`. No product, test, manifest, or integration files were edited in this review; this report is the only review artifact.

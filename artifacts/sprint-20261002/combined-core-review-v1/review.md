# Combined-core release-tree review v1

**Disposition: REPAIR the named candidate ZIP before treating it as this frozen release.** The exact frozen product tree validates, and a newly exported copy passed the bounded product-only consumer check below. This is not a blanket release, capability, provenance, rights, or performance approval.

## Frozen scope

- Worktree: `C:/dev/eternities-godskills/.worktrees/product-sprint-20261002`
- Canonical baseline: `55f960847fa2a06a750a1a6e20c4e7f95ea10449`
- Parent-frozen product release: `2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348` (68 skills; 205 release-bound payload files; `product/release.json` SHA-256 `4d398fea6353586e1bf29e4376b2ac5cfc47914013286d7d9ecc5a8dc7b33dba`).
- All 29 changed files under `product/` are individually byte/hash-bound in `receipt.json`. The reviewed control document `docs/sprint-20261002-accepted-changes.md` is SHA-256 `62bf8907e14df188c510a1ef81a22b78b36da5b9ac34c050974f4243289ce6ef`.

The accepted-change record and six exact independent receipt/report pairs were checked for their stated limits. ZIP review v2 is scoped to a different earlier release (`6e0780ee…`, 193 payloads; its reviewed ZIP was `48b41cf2…`); it does not bind the currently named candidate archive. Method-directory v2 is scoped to the README-only inclusion repair and unchanged row/build bindings at this frozen release, not new method-body or whole-product approval. Arcadia v2 covers the exact documented DRAFT cue-design/acceptance-planning resource, not runtime, listening, accessibility, or source rights. Atlas v3 covers its exact DRAFT decision-trace and bounded lexical-routing scope, not live ranking quality or exposure. Phoenix is instructional/static-contract scope only. Creative proportionality is limited to its three exact instructional bodies, not rendered visuals or market outcomes. Math v4, Hermes v2, and Daedalus were not adopted and are outside this review.

## Product-only consumer exercise

The existing `artifacts/sprint-20261002/godskills-candidate-export.zip` is 849,886 bytes, SHA-256 `47b2f20136d9e3817619722d8aaafd2ffab69ea3d07ab622fe6f0a93249cc770`, with 194 ZIP entries and embedded release `d61e0410281a940a508b2ed6b332b60d302766751578bdf37de3879cb90aa889`. It is not the frozen release `2260b471…`: compared with a fresh export, it has 12 missing entries, no extra entries, and 16 shared entries with different bytes. The missing entries are the four-method directory, its module, the new Arcadia and Atlas methods, and the selected Arcadia/Atlas review records. I left this archive untouched.

For a clean product-only consumer location, I exported the frozen source tree to this review directory and extracted it to `artifacts/sprint-20261002/combined-core-review-v1/blank-consumer/godskills`. The review-only ZIP is 999,825 bytes, SHA-256 `0ea0b883181709f7a539369b6e89eba7fce6c8d840c5e32df3a5a206805ccce2`, and embeds release `2260b471…`. Its 206 extracted files (205 manifest payloads plus `release.json`) compare byte-for-byte with the frozen `product/` tree: zero missing, extra, or changed files. With `PATH` empty and only `SystemRoot` retained, the extracted CLI `validate` returned `verified-content`, the exact release ID, and 68 skills.

I then browsed `METHODS.v1.md` in that extracted pack for “Map gameplay states to sound, silence, cue interruption and muted alternatives,” opened the complete Arcadia owner entrypoint, and followed only its linked `game-state-to-audio-cue.md` reference. The offline lexical search ranked Arcadia first (score 40.916); broader lexical neighbors followed. Its result explicitly reported `authority: none` and `activation: none`, consistent with the directory's instruction to choose by task/exclusions, not score.

The compact planning output from that actual copied method was:

> If the declared authority/order rule confirms SAFE-42 as current, delayed DANGER-41 must not restore the stale warning; update or cancel its audio and non-audio presentation under the SAFE row. If current state cannot be established, hold only that presentation decision unresolved. For a new listener reconnecting while ENRAGED-P7 is still current, retain the intentional once-per-phase audio policy but provide the still-relevant critical information in the new context through a current cue or supported persistent text/visual alternative; do not replay an obsolete phase event. This is design planning only; no runtime, audio, accessibility, or human-play result follows.

The method resource hash matches the directory row and the exact Arcadia v2 receipt's `/candidateIdentity/methodPath` and `/candidateIdentity/methodSha256` values. The body remains explicitly **DRAFT**; the directory records `independently-document-reviewed` for that exact document scope and `not-performance-qualified` for outcomes. It says the receipt/report are optional evidence, not executable policy. I observed no maturity/status conflation in this path.

## Focused verification

- `node product/bin/godskills.mjs validate` — passed for frozen release `2260b471…`, 68 skills.
- `node product/bin/godskills.mjs export --output C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/combined-core-review-v1/combined-release.zip` — passed; release `2260b471…`, 206 archive entries.
- `Expand-Archive -LiteralPath <review-only combined-release.zip> -DestinationPath <review-only blank-consumer>` — passed on this Windows host.
- Extracted CLI, invoked with empty `PATH`: `validate` passed; exact cue-query `search ... --limit 3` returned Arcadia first.
- PowerShell SHA-256 comparison of all 206 extracted files against source `product/` — exact tree, zero differences.
- `node --test tests/product-archive.test.mjs` — 6 passed, 0 failed, 0 skipped.
- `node --test tests/product-method-directory.test.mjs` — 6 passed, 0 failed, 0 skipped.
- `git diff --check -- product README.md` — no whitespace errors.

No full suite was run here; the parent owns that run. This is a same-host Windows/Node v24.18.0 product-only extraction, not a fresh OS or cross-platform qualification. No audio/game runtime, visual rendering, human acceptance, market result, live service, source-rights or license determination, source freshness check, or R10 disposition was performed. I did not inspect all 68 skill bodies or claim whole-corpus coverage. No product bytes, historical review artifacts, frozen activation paths, or other worktrees were edited.

## Handoff

The frozen source product tree and this newly generated review-only pack behaved consistently for the focused checks. The previously present `godskills-candidate-export.zip` is concretely stale for the frozen release and should not be handed out as release `2260b471…`; parent integration owns whether and where to publish a regenerated archive. The regenerated ZIP in this review folder is evidence for this exercise, not an independently authorized distribution artifact.

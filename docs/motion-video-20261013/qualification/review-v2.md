# Independent repaired instruction/package review v2 — REPAIR

V2 is finished and frozen with verdict **REPAIR**, scoped to candidate `ade33b36490dd9b5ac02860dacf25853fe334773` in `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`. It compares preserved v1 `79f1a2e76e2ef290d775672e481668e0a1b71e07` and canonical baseline `43f6dd19742639ea06f79df3662fa5002b1a565e`. V1 remains unchanged.

The original Arcadia failure and the four revealed v1 challenge failures are repaired. All 63 focused tests pass. The current requested-video gate nevertheless admits explicit audio-only encoding and live browser scenes, and excludes ordinary plural video/film requests. Those observed applicability failures prevent READY. No product, consumer input, v1 artifact or HEAD was mutated.

## Blocking findings

| ID / severity | File / line | Finding |
| --- | --- | --- |
| V2-F1 / P2 | `product/lib/discovery.mjs:48-49,60-62`; enforcement `product/lib/product.mjs:176` | Audio-only encoding satisfies the media profile despite an explicit refusal of video. |
| V2-F2 / P2 | `product/lib/discovery.mjs:60-62`; documented contract `product/DISCOVERY.md:44-49` | Generic scene, design and cue words admit live interface/game work as frame-based video. |
| V2-F3 / P2 | `product/lib/discovery.mjs:60`; enforcement `product/lib/product.mjs:176` | The hard gate recognizes singular video/film but not videos/films, removing clear affirmative production requests from discovery. |

### V2-F1: actual audio-only failure, independently reproduced

Exact query:

> Encode audio-only chunks for an MP3 podcast, check the audio timeline and recover failed jobs; no video is requested.

The video specialist ranks first with score **170.37**; speech chunk alignment is second (67.547), Orpheus third (63.282). `eligible` is true and the “requested frame-based video output” intent is present. Parent reported this failure; I reproduced this exact query once without broadening the search.

The artifact family treats `encode\w*` as sufficient, while the dependency family admits chunks/timeline. The finite refusal filter does not reject this audio-only/no-video form. Encoding audio does not request a video, and the candidate's method explicitly distinguishes code-driven films from other media work. This is applicability failure, not authorization bypass: authority and activation remain none.

Parent's proposed finite audio-only exclusions/regressions belong in a separately versioned v3. Preserve this exact v2 failure and its score rather than modifying the v2 expectation or receipt.

### V2-F2: scene/cue words still substitute for media-output intent

Completed new challenge NA3:

> Design a live interactive scene with sound cues, readable labels and keyboard feedback; the scene stays in the browser.

The video specialist ranks first, with `eligible: true`. Replacing only “scene” with “interface” makes the video method ineligible and absent. The causal comparison shows that the ambiguous scene token supplies the alleged artifact purpose; design supplies the action and cues supplies the dependency. There is no requested video, encode, frame schedule, seek or media output.

Completed challenge NA1 also admits the video specialist for an interactive game scene with state sound cues, mute recovery and visual alternatives. It ranks second. The original NA1 expectation additionally requested Arcadia first; that remains a recorded failed reviewer control, but the baseline catalog under the current engine does not establish that first-place ranking. I therefore do not call its Arcadia-first component a proven historical regression. The unsupported video admission is the relevant boundary failure.

The camera-coverage control NA2 keeps scene-continuity first, although video remains second. The DSP control NA4 keeps its specialist first and excludes video. Narrow repair should corroborate ambiguous scene/cue terms with actual frame-based media purpose while retaining valid seekable-scene requests; it need not become general English parsing or an ID-specific lookup.

### V2-F3: plural artifact names are rejected by the hard eligibility gate

Exact diagnostic pairs:

- “Render frame-based video with frozen fonts.” → video specialist first, eligible true.
- “Render frame-based videos with frozen fonts.” → video specialist absent, eligible false.
- “Render a film with exact timeline cues.” → first, eligible true.
- “Render films with exact timeline cues.” → absent, eligible false.

The same problem removes the previously passing v1 V6 batch request: “Compose a batch of personalized animated chart videos with seeded particles, localized text, exact data labels and no missing fonts.” Its unchanged expectation fails in v2. Changing only videos to video restores eligibility and first-place retrieval. The source artifact regex uses word boundaries around `video|film` without ordinary plural forms; this is a demonstrated finite vocabulary defect, not a demand for universal semantic understanding.

## Prior finding disposition and completed checks

| Item | V2 result / limit |
| --- | --- |
| V1 F1 original Arcadia game sound-cue request | Repaired: the existing direct/paraphrase Arcadia test passes. The broader media boundary remains incomplete as above. |
| V1 F2 M1, M2, V5 | All three now pass; exact queries are development regressions in the new applicability test. They are revealed tests, not held-out evaluation. |
| V1 F3 X3 manual-editing query | Repaired: video excluded, and the exact revealed query is a development regression. |
| V1 F4 unit-speed source-trim clarification | Still optional, unchanged, and not used as a blocker. No new clock/physics issue is asserted. |
| Focused test command | `node --test tests/motion-video-discovery.test.mjs tests/motion-video-applicability.test.mjs tests/universal-wave29-arcadia-audio-state-cue.test.mjs tests/conditional-method-regression.test.mjs`: **63 pass, 0 fail, 0 skip**, exit 0. |
| Breakdown | Conditional-method regression 33; new applicability 14; original motion/video discovery 13; Arcadia owner 3. |
| Twelve new reviewer queries | 10 pass, 2 fail: NA1 and NA3. Expectations set before execution; failures retained. |
| Unchanged replay of twenty v1 queries | 18 pass, 2 fail: V3 and V6. All four original failed queries now pass; two prior positives became misses. No expectations rewritten. |
| V3 nonblocking coverage limit | The out-of-order scene-evaluation query lacks a recognized dependency term and is now excluded. Its old top-three expectation remains failed; this finite-retrieval coverage issue is disclosed separately from the demonstrated plural bug. |
| Four causal comparison pairs | Eight observations isolate singular/plural and scene/interface seams; they do not replace or relabel the original challenge results. |
| Audio-only exact query | Parent-reported failure independently reproduced once; first place at 170.37. |
| Portable validation | Pass: release `7815a2cfbc0f084370b8881e57d0de5507e5a9e269d186713cd66f5cee7afce2`, 87 skills. This establishes package consistency, not applicability acceptance. |
| Full suite / portable ZIP audit | Parent-owned; neither full-suite outputs nor ZIP-audit evidence was consumed or independently certified. A consistent ZIP may still contain this applicability defect. |

## Finite scope, metadata, exact-ID access and preservation

The repair adds two finite English profiles and a generic eligibility enforcement. Matching uses normalized summary/trigger metadata rather than a hard-coded new skill ID. Relabeling the video metadata preserves both negative and positive eligibility behavior; assigning its ID to nonvideo metadata does not bind that profile. In this exact catalog, only the video specialist is subject to the new eligibility gate and only the interactive-motion specialist receives the new continuity profile bonus. These are exact metadata-template matches, not general semantic inference.

Both exact new IDs remain first when requested directly, without authority or activation. Explicit host `need: none` still yields empty results and abstain for both IDs. The code retains category/task filters and anti-trigger checks before the generic exact-ID gate exception. Exact-ID inspection is addressability, not permission.

The conditional regression changes only the addition whitelist: six cognitive, three professional and eight previous specialist IDs, plus exactly the two new motion/video IDs (19 additions to 68 core entries = 87). The exact-list equality, ordered core projection, frozen fixture digest, resource checks and release-count validation remain. There is no wildcard or count-only allowance. The old diagnostic string at line 203 still names the previous 17 additions; this stale wording does not alter the exact assertion.

Preservation independently checked against immutable Git content:

- **85 old skills / 250 files**: all raw SHA-256 values equal canonical baseline; zero mismatches.
- **Six new skill payloads**: exact to v1, including both entrypoints, metadata files and methods references.
- **Consumer instruction brief**: candidate `docs/motion-video-20261013/application-briefs.json` exact to v1; hash-only in v2, not parsed, applied or graded.
- **Three activation files**: all exact to canonical baseline.
- **Historical core2260 fixture**: exact SHA-256 `57d47c0a9692dc21caa0e7909ee6c557cd5ef5cc4e09b968df079cc81f86aecf`.
- **V1 artifacts**: all four deliverables match their immutable receipt; the v1 receipt itself retains SHA-256 `5ec03ff310750dc0dd16a113cb6f53a9588a374bb02443137cbdcc1baae074a6`.

The 27 recorded v2 inputs were rechecked at sealing: zero mismatches, HEAD still `ade33b36490dd9b5ac02860dacf25853fe334773`, Git porcelain empty. The old-payload manifest remains `272fb0399602222962f6d37892391f5d0f436fec81b6bbc4df9c25cdc59cb8d1`.

## Exact receipts, reads and handoff

`reviewed-input-sha256.json` records all 27 explicit input paths, byte lengths, SHA-256 values and full/partial/executed/hash-only inspection scopes, plus preservation and package identity evidence. Its manifest SHA-256 is `b23a9dbaa8c1592c31c54093b10a03d78268d4ed493d7f847afe7e293fbb81ca`; convention: listed-order absolute path, TAB, raw-file SHA-256, LF, UTF-8. Raw bytes are never newline-normalized.

The full seven-file repair diff was inspected. Its exact binary diff SHA-256 is `6addacdc0b352ce72313a177017bc42b7ceadd37b077161010f2a8b7a067851a` (17266 bytes). The baseline-to-v2 binary diff has SHA-256 `92aa853bc7e8490e85b372855b312a709340ec7a31551940cb6a69558f99f4ab` (62735 bytes).

`checks-v2.json` preserves completed focused-test results, the original twelve fresh query challenges, twenty unchanged v1 expectations, diagnostic pairs, metadata/ID controls and whitelist assessment. `focused-tests.txt` retains the actual 63-pass output. `audio-only-and-sealing.json` records the parent-reported/independently reproduced audio-only failure and final input check. `output-artifact-sha256.json` hashes these final v2 deliverables. These files are appended only under the NEW review-v2 directory; no v1 file is refreshed.

No private expectations or consumer outputs were read. The milestone document's consumer-completion statement was treated as a parent claim, not independent application acceptance. The unchanged instruction assessment and source review remain preserved v1 evidence; no upstream source was reopened or executed. No descendants, acquisitions, providers, paid calls, installs, publication, canonical-main, R10, global-policy, security or account changes occurred. The curated completeness audit kept content presence, package identity, tests and observed applicability separate.

**V2 is complete and REPAIR.** Parent can prepare finite exclusions/regressions in separately versioned v3 and request a narrow review. Preserve all v2 failures and byte receipts; a later passing package or suite does not retrospectively change this verdict. F4 remains optional. This report grants no application, browser/device/render, installation, publication or whole-product acceptance.

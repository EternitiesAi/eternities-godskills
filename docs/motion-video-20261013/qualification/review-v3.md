# Independent v3 instruction/package repair review — READY

**READY**, confined to the narrow instruction/package applicability repair at `0ef769c45ed059f1db7a8117e8447acc40fe907d` in `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`. The three confirmed v2 defects are repaired, v1 positive V3/V6 are restored, and intentional inspection of existing encoded media remains available. No new blocking issue was identified in the changed code.

Compared revisions: canonical baseline `43f6dd19742639ea06f79df3662fa5002b1a565e`; preserved v1 `79f1a2e76e2ef290d775672e481668e0a1b71e07`; preserved v2 `ade33b36490dd9b5ac02860dacf25853fe334773`. V1/v2 failures and receipts remain immutable. This is not full-suite, consumer-application, live-render, installation, publication or whole-product qualification.

## Confirmed repairs

| Prior finding | Current code locator | Independent result |
| --- | --- | --- |
| V2-F1, P2: explicit audio-only MP3 encoding ranked video first at 170.37 | `product/lib/discovery.mjs:49` | Exact original query now has eligible false and no video result in the first 20. Speech chunk alignment and Orpheus lead the shortlist. The original v2 result is retained. |
| V2-F2, P2: generic scene/design/cue words admitted live browser/game work | `product/lib/discovery.mjs:60-64` | Both exact live-scene and interactive-game-scene queries now exclude video. Ambiguous scenes need render/export/seek/scrub or specified nonsequential evaluation evidence. |
| V2-F3, P2: hard gate rejected plural videos/films | `product/lib/discovery.mjs:61` | Exact plural video and film queries are eligible and rank video first. Original batch-video V1 V6 is restored. |
| V1 V3: out-of-order scene-evaluation positive lost in v2 | `product/lib/discovery.mjs:64,67` | Unchanged original query is eligible and ranks video first. |
| Current-media inspection | Unchanged generic enforcement `product/lib/product.mjs:175-177`; new cue families above | Checking an encoded video's transition frames/cues remains first. “Do not encode a new film; instead verify the supplied encoded video at transition frames” remains first. |
| F4 unit-speed clarification | Unchanged video `references/methods.md:9-11` | Optional caveat retained; not a blocker and not silently converted into a required change. |

The game-scene replay checks video exclusion only. Arcadia ranks third for that reviewer query; the unsupported Arcadia-first expectation from v2 was not adopted as an acceptance gate. The actual existing Arcadia direct/paraphrase regression still passes in the focused suite.

## Inspection and observed checks

The complete five-file v2-to-v3 diff was inspected: `product/lib/discovery.mjs`, `product/DISCOVERY.md`, `tests/motion-video-applicability.test.mjs`, `docs/motion-video-methods-20261013.md`, and `product/release.json`. Current discovery code, both disclosure documents and the complete applicability test were read in full. The unchanged search enforcement and strict two-ID addition whitelist retain their v2 review and were hash-compared; their focused regression tests were executed.

The implementation uses finite normalized request clauses and meaning-bearing summary/trigger metadata. It adds no query-to-ID lookup, source execution, provider call or engine dependency. Object `.test` predicates for scene corroboration retain the existing cue interface. The new refusal markers and singular/plural forms match their documented scope; explicit media inspection remains part of the profile.

| Observed check | Outcome / evidence boundary |
| --- | --- |
| Four focused test files | **72 pass, 0 fail, 0 skip**, exit 0. Breakdown: conditional regression 33, original discovery 13, applicability 23, Arcadia 3. |
| Nine exact reviewer replays | **9 pass, 0 fail**: audio-only exclusion; live/game scene exclusion; videos/films; V1 V3/V6; supplied-media inspection; refused-new-encode followed by inspection. No new challenge search. |
| Metadata relabel control | Negative query remains ineligible, positive plural-video query eligible after changing only the ID. Only the intended video metadata profile is gated in this catalog. |
| Exact ID / host no-need | Both new IDs remain first for exact inspection. Authority and activation remain none. Explicit host no-need returns no candidates and abstain for both. |
| Portable validation | Verified-content, 87 skills, release `87654db51a9f9fd6419c8d0105ab768682e1e7516c7737059cf7880b6c91fa0a`. Package consistency is distinct from applicability acceptance. |
| Core/old-payload protection | Frozen 68-entry fixture and strict 19-addition whitelist pass; old payload and protected-file hashes remain exact. |

Exact focused command:

```text
node --test tests/motion-video-discovery.test.mjs tests/motion-video-applicability.test.mjs tests/universal-wave29-arcadia-audio-state-cue.test.mjs tests/conditional-method-regression.test.mjs
```

The command runs only these local first-party offline tests and their read-only validator. No optional model scenario, acquired code or full suite was executed. `focused-tests.txt` preserves the actual output. `checks-v3.json` retains the nine exact query strings, criteria, eligibility, ranks, authority/activation, metadata and ID controls.

The nine newly added parent cases and these replayed cases are revealed development regressions, not held-out evaluation. The broader English/quotation/negation problem was not researched or certified. Discovery documentation still explicitly requires host judgment for unsupported negation, mixed purposes and multilingual wording. Those P3 limits remain limits rather than extra blockers.

## Exact preservation and identity

Independent raw-byte comparisons establish:

- **85 baseline skill directories / 250 files** remain exact to canonical baseline.
- **Six new skill payloads** remain exact to v1; no entrypoint, metadata or methods body changed during v2/v3 repairs.
- **Three frozen activation files** remain exact to baseline.
- **Historical core2260 fixture** remains SHA-256 `57d47c0a9692dc21caa0e7909ee6c557cd5ef5cc4e09b968df079cc81f86aecf`.
- **Candidate consumer brief** remains exact to v1 and was hash-compared only; no application was performed or graded.
- **Search enforcement, catalog and conditional whitelist** remain exact to v2.
- **Four v1 deliverables and five v2 deliverables** match their own immutable output receipts. Both prior receipt files were parsed and hashed without writes.

The baseline old-payload manifest remains `272fb0399602222962f6d37892391f5d0f436fec81b6bbc4df9c25cdc59cb8d1`. The exact binary repair diff is 9356 bytes, SHA-256 `f1fda38b1619fa753889c872f07215aa8da8758ecaf9ebc4e6eccc42a4e24409`, for:

```text
git diff --binary ade33b36490dd9b5ac02860dacf25853fe334773 0ef769c45ed059f1db7a8117e8447acc40fe907d
```

`reviewed-input-sha256.json` records **32** exact addressed files with absolute paths, byte lengths, raw SHA-256 and inspection scope, plus preservation and release identity. Its manifest SHA-256 is `5e9ea4076fc93dd1ce308afcf6913220b640b35042f515ce25b65b0557d52f99`; convention: listed-order absolute path, TAB, raw-file SHA-256, LF, UTF-8. No newline normalization is used. Full semantic reads, inherited unchanged v1/v2 review, focused execution and hash-only comparisons are distinguished. Portable validation's indirect inventory is bound by the hashed release manifest; hashing every old file is not a new semantic review of all 85 skills.

At the preservation check, HEAD equals the candidate pin and Git porcelain is empty. Final output sealing rechecks the 32 inputs and prior artifact bytes. All review writes are restricted to the NEW `C:/Users/Dom/.codex/operations/godskills-motion-video-20261013/review-v3` directory through apply_patch.

## Limits and handoff

No full suite was duplicated, watched or consumed; parent owns the running v3 suite. The milestone document's v2 full-suite and consumer-acceptance statements are parent-attributed claims, not fresh independent verification in this review. No consumer outputs or private expectations were read. No live browser, encoder, device performance, subjective aesthetic or audience outcome was measured.

No descendants, providers, paid calls, acquisitions, upstream-code execution, installs, publication, main/candidate mutation, R10, global-policy or account/security changes occurred. The unchanged instruction/source-body review remains preserved v1 evidence and was not broadened.

**V3 is READY for this narrowly requested instruction/package repair milestone.** The three actual P2 defects are closed by observed checks, current-media inspection and original positives are retained, and no new important changed-code defect was found. Earlier REPAIR verdicts and negative evidence remain unchanged. F4 and the documented finite-language caveats remain nonblocking. Parent owns subsequent full-suite integration, application acceptance and any authorized installation decisions.

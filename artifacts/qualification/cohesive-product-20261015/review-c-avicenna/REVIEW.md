# Avicenna independent lane-C review

**Verdict: REPAIR.** Two concrete issues in the new runtime eligibility gate
need repair before accepting the discovery change. Parent README and historical
link relocation are **READY within the separate local documentation scope**.

Reviewed against `c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d` on Node `v24.18.0`.
All 26 lane-C delivery entries match their declared hashes. No source changed
during the final challenge runs. No lane-B byte, product file, shared metadata,
release artifact or other lane file was edited. Only this review directory was
written. No agents, installs, full suite, build or external effects were used.

## R1 — ordinary game/runtime requests disappear [P2]

Location: `product/lib/discovery.mjs:92-94`; removal is enforced by
`product/lib/product.mjs:176`.

The new purpose regex excludes ordinary controls, input, feedback, saves and
difficulty work unless the user supplies one of its particular runtime nouns.
Its creation branch additionally caps the gap before “game” at three words.
Because this is eligibility rather than scoring, a missed cue removes a
previously useful candidate entirely.

| Actual request | Baseline Arcadia rank | Candidate Arcadia |
| --- | ---: | --- |
| Implement game controls. | 1 | Excluded |
| Implement player movement and camera controls for my game. | 1 | Excluded |
| Balance combat difficulty in our game. | 1 | Excluded |
| Add checkpoint saves to the game. | 1 | Excluded |
| Debug Unity input handling. | 1 | Excluded |
| Build a cooperative puzzle game. | 1 | 1 |
| Build an accessible cooperative puzzle game. | 1 | Excluded |
| Create a relaxing turn based strategy game. | 1 | Excluded |

“Implement game **runtime** controls” restores rank 1 without changing the
underlying user task. Removing the accessibility modifier likewise restores the
creation result. These are ordinary task requests within the owner's existing
runtime/player-experience contract, not merely unsupported topic shorthand.
Nine of the twelve fresh ordinary-game probes lose an owner that was previously
in the top two. This is a targeted challenge set, not a population accuracy rate.
The same losses occur with current live metadata and with the host explicitly
requesting specialist candidates.

Repair the admission mechanism so useful runtime and creation requests survive
without magic vocabulary or arbitrary modifier length. Retain the legitimate
quoted/refused clause exclusions and metadata-based dispatch. Do not fix these
with a table of exact example queries. The parent can choose the implementation;
this review does not patch or prescribe an untested replacement.

## R2 — the same asset word supplies both purported cues [P2]

Location: `product/lib/discovery.mjs:91-94`; stated contract in
`product/DISCOVERY.md:85-94`.

“mesh”, “meshes”, “textures” and “gpu” occur in both context and purpose regexes.
One object noun therefore admits the runtime owner and produces a reason saying
runtime/integration/player-experience purpose was corroborated, even when the
requested operation is solely legal extraction or hardware pricing.

- “Audit the license for this 3D mesh.” returns Arcadia **rank 1**.
- “Review the license obligations for these mesh assets.” returns it **rank 2**.
- “Extract attribution obligations for the textures.” returns it **rank 2**.
- “Compare GPU prices for a workstation.” returns it **rank 1**.

The baseline already returned those hits. This finding does **not** claim a
new ranking regression; the new independent-purpose gate fails its stated
boundary and adds a false corroborating reason to the existing false positive.
The assessment's admitted remaining false positives do not establish that a
mesh noun is evidence of the requested runtime operation.

Require separate evidence of the requested runtime operation or player outcome,
while retaining actual integration work and a separate live runtime clause
in a mixed-purpose request. Pure license/attribution questions should not
acquire a runtime-purpose reason merely from their objects.

## Parent shader/effect challenge

| Request | Baseline Arcadia | Candidate Arcadia | Muse |
| --- | ---: | --- | --- |
| Build a real-time Three.js shader flame with sparks and responsive controls | 4 | Excluded | Absent from top 20 in both |
| Make a WebGL particle portal I can orbit | No candidates | No candidates | Absent in both |
| Same flame request with “scene” after “flame” | 1 | 1 | Absent from top 20 |
| Same portal request with “scene” after “portal” | 3 | 3 | Absent from top 20 |

The flame is a measured loss within the CLI's default top-five recall; its
top-three list was already weak and unchanged: motion-design-and-animation-
engineering, eternities-atlas, scientific-surrogate-validation. Motion remains
a possible partial route. The runtime gate nevertheless removes the available
Arcadia route for the requested interactive 3D artifact.

The portal is a **preexisting coverage gap**, not evidence that lane C caused
that miss. Adding “scene” changes both lexical scores and gate eligibility, so
the control alone cannot attribute all ranking changes to the gate. These
observations support the bounded recall finding, not a blanket creation failure.

## Parent camera-authoring follow-up: matched metadata confirms R1

Exact input: “Our character is readable in a turntable but disappears at the
gameplay camera; improve its silhouette without changing the art style.”
UTF-8 input SHA-256:
`9bdd5a019394c4374b10262bdcae17559e3ad2073885d24244639a486271aafe`.

| Same query, matched metadata | Baseline code Arcadia | Candidate code Arcadia |
| --- | --- | --- |
| Original lane-C frozen catalog | Absent from top 20 | Absent from top 20 |
| Current parent-authored skill metadata | 1 | Excluded |
| Current parent metadata, add “scene” after “gameplay” | 1 | 1 |

This separates the parent's useful metadata refinement from lane C's hard
eligibility regression. With identical current metadata, baseline admits the
newly supported owner and candidate removes it. Candidate top three reproduce
the parent's observation: narrative-structure-and-revision,
scene-continuity-and-coverage, api-rate-limit-recovery. Muse remains rank 4
(baseline rank 5), so this is an Arcadia loss, not blanket creative abstention.
The same metadata at both code versions isolates the code tradeoff without
attributing all effects of the “scene” control to eligibility alone.

The parent reports a separate 13-case improvement from 8/13 to 12/13; that
private matrix was not opened or independently reproduced here. Only this
remaining miss and one control were independently tested. All 26 lane-C
delivery hashes still match and the camera run's inputs were stable. Parent
metadata hashes are a **new snapshot** in `camera-results.json`; earlier
read-set/results remain historical and have not been silently rebound.

Reproduce with `node artifacts/qualification/cohesive-product-20261015/review-c-avicenna/camera-check.mjs`
and `node --test artifacts/qualification/cohesive-product-20261015/review-c-avicenna/camera-regression.test.mjs`.
The new test file reports **one preserved failure, one passing scene control**;
raw output is `camera-regression.txt`. This extends R1, not the finding count.

## Reproduction and checks

From the worktree root:

```text
node --test artifacts/qualification/cohesive-product-20261015/review-c-avicenna/review-regressions.test.mjs
node artifacts/qualification/cohesive-product-20261015/review-c-avicenna/challenge-run.mjs
node artifacts/qualification/cohesive-product-20261015/review-c-avicenna/challenge-run.mjs --supplemental
node artifacts/qualification/cohesive-product-20261015/review-c-avicenna/challenge-run.mjs --parent
node artifacts/qualification/cohesive-product-20261015/review-c-avicenna/docs-check.mjs
```

The reviewer regression file has **4 failures and 3 passing controls**:
ordinary game controls, expanded game creation, parent flame recall, and
license-only runtime admission fail. Supported asset integration, all 93 exact
IDs/host no-need and a recognized refusal plus live microtask pass. Failures and
assertions are preserved in `review-regressions.txt`; they were not weakened.

The author's bounded seven-file test command independently reran with **128
passes, zero failures**. The shared CLI and temporary pack-build tests were
excluded by name, as requested. Raw output: `focused-tests.txt`.
The author matrix replay reproduces **26/35 baseline, 35/35 candidate**, and all
nine reported topic/creation ranks match. Those claims are correct on their
stated cases; the new failures show why they do not establish broader recall.

Fresh reviewer inputs were frozen in `challenges.json` before execution:
56 cases, 16 baseline-to-candidate expectation losses and seven improvements.
This includes characterization cases with documented limits, so it is **not**
a score claiming 16 release-blocking defects. Twenty adaptive localization cases
and the two parent prompts plus two scene controls are separately labeled.
No stronger benchmark, causal skill-benefit or downstream-use claim follows.

## Compatibility and bounded nonfindings

- All **93 bare exact IDs** still rank first. Explicit `inspect ID` library
  behavior and complete-body/path/hash checks pass the focused tests.
- Host `need:none` keeps search empty and connected-source eligibility held
  across all 56 fresh inputs. Authority and activation remain none.
- No regression was observed in the eight non-game task-owner probes.
- Tested straight/curly/backtick literals, recognized refusals, arithmetic,
  clarification requests and a separate live workflow behave as specified.
- “Inspect eternities-arcadia” as a free-text *search* loses the candidate;
  the raw exact-ID query still works. This limitation is recorded without
  misreporting a failure of the dedicated inspect API.
- “game.”, “game!” and multiword topic shorthand can lose Arcadia. The single
  alphanumeric rule and shorthand limits are documented; they are not separate
  blocking findings here.
- A cross-sentence “its runtime scene” after refusing game creation loses
  context. Restating “game scene” restores it; arbitrary discourse resolution
  is explicitly outside the finite parser's contract.

## README and historical relocation: separate READY

Checked 16 local links in the parent README, 116 in the historical relocation,
24 in START-HERE and one in DISCOVERY: **no missing targets or failed checked
heading anchors**. The old README body, normalized only for CRLF and link target
rebasing, matches the canonical body except one additional trailing blank line.
The historical header correctly labels the old snapshot; the new README
distinguishes the released pack from the development plan and avoids a universal
performance claim.

This is local link/relocation and bounded content review. It does not validate
external URLs, ZIP contents, native installation or the unreconstructed shared
CLI release. Those remain parent-owned integration gates. The first strict
archive comparison returned false solely due to the trailing blank line; that
observation remains visible in `docs-results.json`.

## Input binding and handoff

`read-set.json` binds exact candidate/source/test/metadata and documentation
inputs. Challenge results also contain their runner hash, baseline Git-source
hashes, catalog identity and before/after stability checks. Core identities:

- Frozen catalog: `f20b17c989c188d439c84fa4a8cf5989ccafe550428b2b2577708ba072a39889`
- Discovery module: `9eb1cad0cea17e03f1cf760d7c764c5149bb206e5a92d4b6cc09bbfd91718007`
- Request scope: `e9055f1bfa2a913c1f73e93f5fa652588963e63dd9094e46713786fe400877f2`
- Selection boundary: `a7b0ed0d0c9805e9a2b97a74c0321ce263c15609e98996144df90fc1b7f0e60e`
- Product caller: `afd5689a4120420478995bee762e67cc7ce640f9ce633ae6c6a4f497efcff9bf`

Machine-readable disposition: `verdict.json`. Detailed inputs/results:
`challenge-results.json`, `supplemental-results.json`,
`parent-challenge-results.json`, `author-matrix-replay.json` and
`docs-results.json`. The later camera query, exact metadata/source read-set,
matched-code comparison and stability check are in `camera-results.json`;
`camera-check.mjs` and `camera-regression.test.mjs` are its executable repros.
All writes are contained in this review directory.

The semantic-implementation-diff skill supplied the matched-input, observable-
difference and minimized-reproduction method. The reviewer is independent of
lane C's authorship, but the probes remain bounded reviewer-authored evidence.
After the owner repairs R1/R2, rerun focused regressions plus the retained
positive/exclusion cases; parent can then rebuild manifests and run actual
public CLI/merged-pack acceptance. No product patch was made by this reviewer.


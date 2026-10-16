# Independent lane B review: REPAIR

All four exact method packets need the same portable-attribution repair before
acceptance. Their technical content adds useful, distinct operations beneath
Arcadia; no additional mathematical/correctness blocker was demonstrated by this
bounded review. This is not blanket method rejection or runtime acceptance.

## Bound inputs and independence

Worktree: `C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`;
branch `feat/usefulness-release-20261016`; HEAD
`7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5`.

The reviewer did not author these lane B drafts. Complete bodies were compared
with CURRENT owner coverage and all ten exact inert source bodies, not merely
their names or the author's summaries. Four reviewer transfer cases were worked.
No hidden evaluation or other lane content was read, no reviewer/descendant or
provider was called, and no engine or upstream code was executed.

Metadata was initially incomplete, so no final decision was bound then. Both
metadata files were subsequently present and read completely. Independent identity
passes at `2026-10-16T07:29:13.403Z` and `2026-10-16T07:32:22.072Z` match for
metadata, all four drafts, sources, licenses, repository heads, selected source
git status and current owner/task identities. `inputs-before.json` and
`inputs-after.json` preserve those observations. Their metadata SHA-256s are:

- `lane-b/proposals.json`:
  `5bf8bed5a1da288a136f3d49904cecb9eff79e65bd35965aa003c96b3b598cfc`.
- `lane-b/sources.json`:
  `4a7bf735a90ca760dd3887588cda6c593edc54f5e8b0bea34390e71f2c7d1d15`.

`reviewed-input-bytes.json` preserves all four drafts and both metadata files as
exact recoverable base64 byte records, each with its original path, size and
SHA-256. This preserves the pre-repair evidence before requesting any author or
parent changes. The reviewer made no edits to those inputs.

## Required finding B1: portable source attribution [P2]

The footers at `shader-effect-construction.md:41`,
`lighting-material-calibration.md:40`,
`animation-interruption-transitions.md:43` and `frame-budget-diagnosis.md:42`
refer to source aliases in `sources.json`. Their proposed receiving paths are
under `product/skills/eternities-arcadia/references/`, where that lane-only file is
not supplied. The corresponding `proposedMetadataAdditions/provenance` fields in
`proposals.json` (lines 147, 356, 544 and 770) supply only an authoring-history
locator and tell readers to resolve source records in sources.json. Saying those
IDs are authoring provenance rather than runtime dependencies does not carry the
exact source relationships into the receiving pack.

This is a required repair under the explicit user portability criterion and the
parent's matching spot check. It is not a request to bundle the warehouse or turn
provenance into a mandatory source-reading workflow. Existing author-history
locators can remain, as permitted by the product contract; exact source identity
must also travel with the owner metadata.

Smallest coherent repair, to be performed by author/parent:

1. Replace each dangling alias footer with optional navigation to the owner's
   `../skill.json`, retaining the method-specific original-synthesis statement and
   rejected-source caveat. Do not require an unshipped lane ledger on the receiver.
2. Append or reuse ordinary `pattern-reference` provenance records with exact
   `repository@revision:relative/path`, source-body SHA-256, support/limit notes
   and observed-notice distinctions. Deduplicate the already recorded exact
   `ue-materials` source rather than discarding its existing row. Preserve the
   historical source ledger and all existing provenance/notice rows.
3. Reconfirm new draft/resource hashes, update their proposal and method-directory
   bindings, and obtain a closure review of the changed bytes. This review's old
   hashes cannot approve a later footer or integrated owner edit.

`provenance-repair.json` provides all ten exact portable source-record candidates,
per-method mappings, footer wording and closure requirements. It is a proposed
repair artifact only; no draft, product metadata or source was changed.

## Per-method coverage and decision

All resources below are proposed additions to `eternities-arcadia`; none warrants
a new entrypoint. The exact target prefix is
`product/skills/eternities-arcadia/references/`.

| Draft / target resource | Distinct useful operation beyond current coverage | Correctness and transfer | Packet decision |
| --- | --- | --- | --- |
| shader-effect-construction.md | Staged carrier/mask/motion/composition construction and compile/draw/fragment/compositor fault isolation. Asset integration already owns import/color meaning; lifecycle already owns resource lifetime. | T1 isolates a premultiplied-alpha seam. Aspect, signed-distance and thin-band pulse arithmetic are consistent. | REPAIR: B1 |
| lighting-material-calibration.md | Cross reference/target material with reference/intended light, identify interaction cells, then bracket one variable. Existing controlled-light advice does not supply that experiment. | T2 fails only at target material/intended light; neither a globally bad light nor a generally broken material follows. | REPAIR: B1 |
| animation-interruption-transitions.md | Gameplay authorization and event windows separate from fading skeletal pose; exclusive/additive layer meaning and displacement handoff. Generic retargeting/identity remains existing motion coverage. | T3 distinguishes exclusive weights, independent aim, same-clip playback identity and alternate-branch root/controller travel. Author weight example is correct. | REPAIR: B1 |
| frame-budget-diagnosis.md | Select falsifiable stage/pixel/pass/wait probes before optimization; distinguish headroom, pacing and first-use effects. Existing performance gate still owns release decisions. | T4 fits fixed/pixel GPU cost and shows a CPU/pacing limit after a resolution probe. | REPAIR: B1 |

Exact reviewed draft SHA-256s:

```text
shader-effect-construction.md
3dadf6801d00479d886dd49605bd73608e3ff27f4ff140d8481a573f0462823d
lighting-material-calibration.md
b5fc4b218b27422c32f3048fec007ec6267a480d57f34a4685b850ccfe89aadb
animation-interruption-transitions.md
c52ddfa5c2a0fdbfa0f566ca4b16fb997ee1534e530016f006fa4725896ee722
frame-budget-diagnosis.md
ea504b2fb3d0319a4fffc727c8e3b4b33d20ea564ca08185c458ce72f6db764e
```

## Mathematical and scope adjudication

The pulse's horizontal aspect correction is correct for an explicitly centered
UV convention using width/height. The supplied signed band yields full centerline
coverage for the tested thick band and correct fading on either side. For
halfWidth `0.001` and edgeWidth `0.005`, centerline alpha is `0.648`: the text
promises visibility, not unconditional opacity. The strict positive edge-width
precondition is present. No renderer-specific pixel derivative/API was asserted.
These checks do not validate filtering, aliasing, depth or target appearance.

For exclusive weights with `sum(w_i)=1` and `u` in `[0,1]`,
`sum((1-u)*w_i)+u=1`; endpoints preserve the old set and select the new target.
The author's `0.3/0.2/0.5` trace is correct. This algebra does not prove pose or
velocity continuity for an arbitrary engine. The draft explicitly excludes
additive/masked/inertial/root-motion mixing from that illustrative normalization,
so there is no unsupported universal blending prescription to repair.

Conditional use is appropriately narrow. The lighting table expressly avoids
mandatory four-image paperwork; engine adapter notes are optional snapshot
boundaries. The animation method retains generic motion rather than claiming
its request-identity mechanism as new. Frame diagnosis does not create a second
release gate. Source-specific renderer defaults, APIs, speed rankings or PBR
realism are not adopted as verified current facts.

## Exact sources and current owner coverage

Verified selected source heads:

- `mrdoob/three.js@d2ac59a15620ff8696dd55983c1f411c0a3f92ce`: five complete
  manuals (debugging GLSL, color management, animation, postprocessing, materials).
- `quodsoler/unreal-engine-skills@f3742d7b688690810df369802b90430324e380b9`:
  animation, materials/rendering, testing/debugging, and profiling-command reference.
- `lovecatisgood-sudo/3d-asset-generation-blender-unity-game-development-skills@00221bb0a8ffcb8eb577daf5ddf9e8d8edcdbc98`:
  the general Unity workflow body.

Every selected body's working SHA-256 matches the author's ledger and repeated
source records. All three root LICENSE bodies were read completely, their exact
digests verified, and selected source/notice git paths are clean at the declared
HEADs. The warehouse index digest matches the declared snapshot; only its digest
was checked, not a new corpus survey. Root MIT observations are not legal clearance
for dependencies, linked images or future copied substantial content.

Three.js manuals are upstream documentation snapshots. Unreal/Unity skills are
third-party workflow evidence. The unverified UE 5.8/header claims were not
promoted to current-engine verification. The frame draft correctly rejects the
source's rising-object-count-alone leak inference; the material draft rejects
universal material-speed ranking and numerical Phong-to-PBR conversion. No linked
examples, browser extension, image, engine header, profiler command or plugin was
opened, installed or run.

Fourteen relevant CURRENT owner bodies/metadata files were read completely:
Arcadia entrypoint/metadata plus methods, asset integration, camera-driven
iteration and lifecycle; Muse entrypoint/metadata/methods; motion
entrypoint/metadata/methods; performance-release-gating entrypoint/metadata.
Their hashes match the baseline coverage records. The two earlier-read release
contract files were identity-reconfirmed. `product/lib/method-directory.mjs` was
hash-verified only and is not claimed as read for method coverage. Other Arcadia
resources were listed in metadata but not opened; no exhaustive catalog review
is claimed.

## Checks performed and remaining limits

- `node artifacts/qualification/usefulness-20261016/review-b-v1/verify-inputs.mjs`
  ran twice successfully with matching complete identity observations. It checks
  present stable metadata, all draft/proposed-resource hashes, repeated source
  records, ten body hashes, three notice hashes, three source HEADs/selected git
  statuses, and 17 owner/task identities.
- `node artifacts/qualification/usefulness-20261016/review-b-v1/static-checks.mjs`
  exited 0: eight static arithmetic groups passed. It imports no upstream or
  product implementation. T2 is worked categorical reasoning, not a rendered test.
- Four independent transfer cases and their actual reasoning are retained in
  `transfer-cases.md`; arithmetic output is in `static-results.json`.

No product suite, engine build, renderer, screenshot, profiling capture, device
timing or human aesthetic/play acceptance was performed. These were not needed
to inspect this document-level repair and cannot be inferred from arithmetic.
No product integration, release, deployment or installation is certified.

## New review files only

All writes are under
`C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003/artifacts/qualification/usefulness-20261016/review-b-v1/`:

```text
REVIEW.md
decisions.json
inputs-before.json
inputs-after.json
protocol.md
provenance-repair.json
reviewed-input-bytes.json
static-checks.mjs
static-results.json
transfer-cases.md
verify-inputs.mjs
file-manifest.json
```

The manifest binds every delivered review file except its own self-referential
digest. Earlier discovery changes and other workers' files are preserved.

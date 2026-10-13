---
name: deterministic-video-composition-and-rendering
description: Build and verify frame-based programmatic video with seekable scenes, frozen assets, synchronized cues, recoverable rendering and checks on the encoded deliverable.
---

# Deterministic video composition and rendering

Make a programmatic film or data-driven clip reproducible from explicit inputs, rather than depending on how a live preview happened to play. The method is renderer-neutral and does not require a particular library, operating system, provider or folder layout.

## Fit and boundaries

Use for code-driven motion graphics, templated videos, seekable compositions, batch rendering and a rescue pass on a rendered film whose timing or assets differ from its source. Use interactive-motion engineering for a live interface, Orpheus for transcription/alignment, and scene coverage when story/camera continuity is the unresolved decision. A script that creates a project is not a delivered video.

## Working method

1. **Bind the film and its inputs.** Establish the audience, truthful claims or explicitly fictional premise, approved direction, output dimensions, rational frame rate, duration convention, audio/caption needs and allowed artifact effects. Freeze source revision, data/props, seed, asset/font identities, renderer configuration and relevant rights. Derive the look from this brief rather than inheriting a reference film's palette or mandatory shot count.
2. **Declare time exactly.** Use an integer global frame index with an explicit frame-rate conversion and interval convention. Name clip-local, source-media and global clocks; account for source trims, clip offsets and overlaps. Choose cue rounding and tolerance deliberately. The [conditional methods](references/methods.md) cover timeline arithmetic, pure evaluation, render recovery and delivered-file checks.
3. **Make scene evaluation seekable.** Derive a scene at a requested frame from frozen inputs. Avoid dependence on wall-clock time, playback history, mutable randomness or an earlier frame having run. Wait for required assets and fonts or fail explicitly. Independent seeks, retries and render chunks must agree under the declared comparison contract; an engine's marketing claim is not proof of this property.
4. **Compose expressive beats.** Give shots, transitions, typography, camera and sound cues a clear role. Bind factual text and numbers to approved data; preserve unknown values instead of decorating them into facts. Align narration when the brief requires it using actual timing evidence. Silence, sustained movement, a simple palette or a different musical grid can be valid; do not impose one source's fixed creative recipe.
5. **Render recoverably.** Inspect representative and boundary frames before an expensive encode. Use immutable job/input identity, versioned destinations, resource-aware concurrency and explicit segment ownership. Reconcile completed and uncertain jobs before retrying; cached outputs require matching relevant dependencies. Missing fonts, assets, render ranges or audio must not silently become a finished result.
6. **Judge the actual delivery.** Check the encoded artifact's dimensions, time base, duration/frame count, first/last frames, changed beats, transitions, typography, data, audio and captions as applicable. Inspect temporal playback and the creative result as well as numerical checks. Decode frames from the delivered file when possible; a source preview or contact sheet alone does not establish correct video delivery.

## Deliverable and finish

Deliver the requested composition and rendered artifact, an input/timeline manifest, reproducible render instructions and an evidence-linked acceptance record. Finish the requested production work, not merely its storyboard. If rendering is unavailable, distinguish a useful composition/planning artifact from an unrendered deliverable. Do not claim byte-identical encoding across different renderers/devices, live audience effectiveness, publication or platform qualification without matching evidence.

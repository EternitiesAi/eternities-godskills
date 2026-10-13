# Conditional composition and render methods

Load the matching section after the complete entrypoint. A simple silent clip does not need narration analysis, and a single local output does not need a distributed render service.

## Time bases and cue arithmetic

Represent a frame rate as a positive rational value when necessary, retaining numerator and denominator instead of rounding a fractional rate to a convenient integer. For a zero-based composition of N frames, valid frame indices are 0 through N-1 and its declared timeline duration is N divided by the frame rate. State whether clip ranges are half-open [start,end); do not accidentally add an extra terminal frame.

For a clip starting at global frame S, local frame is global frame minus S while the clip is active. Convert a source-media cue into clip time after subtracting the source trim, then into a global frame after applying the clip offset. Record rounding, out-of-range handling and acceptable quantization error. Keep audio sample time and video frame time distinct; an approximate beat estimate is not a measured word timestamp.

Example arithmetic: at 30 frames/second, clip A occupies [0,60) and clip B [45,105). The overlap is 15 frames, not an extra 15 frames after 105; the composition has 105 frames, lasts 3.5 seconds, and ends at frame 104. A cue at source-audio time 0.6 seconds, with a 0.2-second source trim in B, lands at clip time 0.4 seconds and global frame 57. The example fixes its own units and convention; other briefs may choose another valid schedule.

Choose an interpolation contract for each property. Clamp bounded opacity or an exact nonnegative data quantity as appropriate; deliberate transform overshoot may remain valid. A transition's incoming/outgoing ownership and endpoint convention must be explicit. Validate text, captions and semantic content at overlaps rather than assuming a visual dissolve preserves reading order.

## Stateless evaluation and dependency readiness

A frame evaluator receives frame index, frozen scene data and declared environment/configuration. Stable randomness derives from explicit seed and stable object/frame identities; advancing a shared mutable generator in render order is not safe for out-of-order evaluation. Derive camera, shader time, textures, particles and time-varying effects from the same declared clock when those effects are present.

Test frames in ascending, descending, repeated and shuffled order and compare equivalent results under a stated contract. Distinguish deterministic scene values, decoded image equivalence/tolerance and identical encoded bytes. Floating-point, font, device, browser and codec differences can invalidate a broader claim even when the timeline is pure. Do not assert that purity is guaranteed by a framework name.

Bind loading to explicit readiness of the exact required assets and fonts. Record timeout, missing-input and fallback behavior; use a substitute only when the brief permits it and label it. For data-driven batches, validate props and material content extremes before scaling: long localized strings, missing values, large numbers, different aspect ratios and caption density. Do not manufacture a plausible zero or substitute font while claiming exact data or branding fidelity.

## Render jobs, caching and recovery

Assign each job an identity covering relevant scene/source revision, props/data, seed, assets/fonts, time base, dimensions, renderer and encoder configuration. Specify which dependencies affect scene-frame caches, audio outputs and final encoding separately. A changed caption, font or trim invalidates the relevant cache even if the filename is unchanged.

For chunked work, freeze half-open frame ranges, prove complete nonoverlapping ownership of the requested composition and retain output receipts. Retry only a confirmed failed or absent unit; unknown dispatch is reconciled rather than duplicated. Join segments under an explicit container/codec and audio-continuity contract; successful segment jobs do not prove a correct assembled film. Use bounded concurrency based on the actual machine and input requirements, not a source's universal worker count.

Keep accepted renders and new attempts distinct. Write into an authorized versioned destination or staged boundary, check completeness and format, then promote. Never overwrite the preferred take merely to tidy the render directory. A missing resource, unwritable destination, unsupported renderer or unresolved paid job is a named boundary, not a reason to weaken the output contract.

## Verify the encoded artifact and the film

Probe dimensions, time base, codec/container expectations, duration and frame/stream presence with an available decoder or equivalent tool. Sample the first, final, transition-boundary and changed-beat frames from the delivered artifact using the shipped inputs. Inspect missing/clipped glyphs, safe areas, layer order, crop, exact displayed data and source/final disagreements. A handful of stills does not establish the absence of temporal defects; review relevant moving intervals too.

For audio or captions, trace cue/word alignment to their real timing evidence and inspect the delivered stream. Choose loudness, peak and readability targets for the platform/brief, not a universal mastering constant. Measurements do not alone prove subjective audibility or artistic success. Keep technical checks separate from human direction/acceptance, report each against its actual evidence, and iterate defects in a new version until the requested artifact meets the agreed condition or a genuine boundary remains.

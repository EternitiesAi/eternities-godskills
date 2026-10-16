# Shader/effect construction and fault isolation

Draft conditional method for Eternities Arcadia. Use when an interactive effect needs a working construction or when a shader compiles but gives the wrong pixels. Ordinary material-slot or texture-import problems remain with real-time asset integration. This method does not select an art direction or require custom shaders where an existing material suffices.

## Portable core

Translate the visible intention into a few independently inspectable terms: spatial support, mask, motion, surface response and composition. For a scanning pulse, these might be a plane, a ring mask, expanding radius, emissive tint and alpha composition. Name the coordinate space and units of each input: mesh UV, object/world position, viewport pixels, seconds, linear color or non-color data. A pixel-sized edge and a world-sized radius cannot share a scale factor accidentally.

Choose the least elaborate implementation that expresses those terms: built-in material parameters, a material graph, a mesh shader, or an image pass. State the intended depth/occlusion behavior before deciding transparency. A pulse attached to a floor and an always-visible HUD reticle have different depth contracts. Build an opaque, static carrier first; add the mask, then time, then color/lighting and finally composition. Keep one bypass per new stage while constructing it.

Draw the image path when the effect spans passes. For each edge, name producer, input texture, dimensions, color meaning, alpha convention and destination. Mark where tone mapping and display encoding occur. An intermediate linear image must not silently become display-encoded input to another lighting operation. When a pass reads the previous result, use the engine's supported separate read/write targets; do not sample a texture while also writing to that same attachment. A bypass still needs the proper final display transform.

For a failure, select the next observation that splits plausible causes:

| Observation | Next action | What it does not establish |
| --- | --- | --- |
| Compilation/link failure | Preserve the compiler diagnostic, variant and bindings; simplify the first failing stage | A compiler success will not establish visibility |
| Constant opaque output is invisible | Inspect draw reachability, viewport, clipping, transforms, culling, depth/stencil and later passes overwriting it; try the engine's known basic material | The fragment arithmetic is not yet the main suspect |
| Carrier appears but effect vanishes | Show mask, alpha, UVs and sampled input separately; substitute a known texture or scalar | Visibility alone does not establish correct blending |
| Effect works until camera or object moves | Compare the declared coordinate spaces and transformed normals/positions | A single corrected view does not clear all camera poses |
| Effect changes when postprocessing is enabled | Bypass stages individually while preserving output conversion; inspect pass order and input meaning | Exposure compensation cannot prove correct color handling |

Visualize a signed diagnostic range by mapping its declared bounds into displayable values; show out-of-range or invalid values distinctly. A wrapped UV view is useful for repetition but hides the difference between zero and an integer, so pair it with an unwrapped range check when testing offsets. Freeze time to inspect a spatial error. Restore depth, blend, lighting and output settings after each isolation experiment instead of shipping diagnostic settings as the fix.

## Worked construction, not a rendered result

Synthetic brief: a circular scanning ring expands over a rectangular screen region. Center UV coordinates and scale the horizontal coordinate by width/height before measuring radius. Let `d = abs(length(p) - radius) - halfWidth`; a soft mask is `1 - smoothstep(-edgeWidth, edgeWidth, d)` with a strictly positive edge width expressed in the same units as `p`. This is mathematical pseudocode, not an engine shader. Determine edge width from the projected pixel footprint using the selected renderer's supported mechanism.

At the ring centerline `d = -halfWidth`, inside the band should be visible; far beyond its outer edge it should be absent. Freeze radius, inspect the mask in grayscale, then animate radius in units per second. If the ring becomes elliptical after resize, inspect coordinate aspect scaling before changing noise or bloom. If an opaque diagnostic ring is visible but alpha composition is absent, inspect alpha output and the material's blend/depth configuration. A dark fringe at the edge calls for checking straight versus premultiplied alpha at both producer and compositor; do not multiply color twice. Choose an explicitly bounded restart or decay at the pulse's end rather than letting a discontinuous wrap be an accidental flash.

## Conditional engine adapters

- **Three.js snapshot:** the inspected manuals describe basic-material substitution, diagnostic GLSL outputs and an ordered composer pass chain. Use the installed version's actual shader language, bindings and pass API. Check whether the custom shader or final output pass owns display conversion; copying both paths can double-convert. Composer sizing and render-target sizing must follow the actual backing surface. No WebGPU/TSL equivalence was verified here.
- **Unreal snapshot:** the inspected material workflow distinguishes surface materials from post-process materials and runtime instance parameters from static permutations. Verify the target engine's material domain, blendable location and parameter mechanism before adapting the core. Its claimed UE 5.8 signatures were not checked against engine headers.
- **Unity:** choose the actual render pipeline and its supported material/pass route first. The inspected Unity workflow is insufficient evidence for exact Shader Graph or renderer-feature APIs; those adapter details remain unresolved.

## Finish

Return the effect or requested construction, its small input/pass map, the defect-isolating observation, restored production settings and the relevant same-camera/time comparisons. Check resize, input extremes, occlusion and time boundaries that the effect actually uses. A reduced-motion or lower-cost alternative should retain the effect's player-facing information when required by the brief. Compiler diagnostics, mathematical examples and static inspection cannot establish rendered appearance, device cost or artistic acceptance; those need the actual target and, for artistic acceptance, the accepting person.

Source basis: `three-debug`, `three-post`, `three-color`, `ue-materials`, and the boundary-only `unity-workflow` in `sources.json`. The diagnostic decision table, pulse construction and finish contract are original synthesis; no upstream code is included.

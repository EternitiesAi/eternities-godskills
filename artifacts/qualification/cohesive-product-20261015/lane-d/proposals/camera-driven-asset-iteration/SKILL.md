---
name: camera-driven-asset-iteration
description: Improve a camera-critical game asset by comparing its silhouette, detail and motion in the intended gameplay views, then changing the cause of the observed defect. Use for an authored hero asset, not a whole-game quality rubric or routine asset import.
---

# Camera-driven asset iteration

Use when an asset looks convincing in a modeling viewport but loses its intended character or readability in play. Start with the existing art direction and target camera. Do not impose a new medium, modeler, format, polycount or realism target.

## Locate the visual cause

Choose the view and state that make the asset matter: a weapon while aiming, a character turning at play distance, a vehicle's outline against the ground. Keep resolution, framing, lighting and asset revision comparable while diagnosing the discrepancy. For a moving asset, confirm that idle, locomotion and the problem state resolve to the same intended mesh/material revision; a beautiful idle replacement can hide a stale moving asset.

Judge the feature at its projected size. A ridge visible in a close-up may occupy less than a pixel at the play camera, while a hat brim or hand shape may define the entire silhouette. Use a simple flat material or unlit outline when it helps distinguish shape from shading. Compare the original game view before changing anything; an isolation turnaround can explain a defect but cannot substitute for that view.

Name the failure and change the corresponding layer:

- A missing or wrong outline calls for shape, proportion or camera-fit work. Extra texture noise cannot repair it.
- A broken joint or gap that appears during motion calls for topology, weights, transforms or bind/retarget work. A stationary beauty render cannot clear it.
- A correct shape with an unreadable surface calls for material grouping, value separation or target lighting. Added polygons may not help.
- A visually acceptable asset that exceeds the runtime budget calls for measured simplification, materials, textures or LOD work while preserving the important view.

Try the smallest change that can distinguish these causes. Author a representative region or pose before rebuilding a whole asset. Keep deliberate primitive geometry, abstraction and asymmetry when they serve the art direction. If a close-up requirement and the existing asset budget conflict, expose that tradeoff with comparable views rather than silently changing the brief.

## Verify the result where it will be used

Recapture the same gameplay view and relevant motion after the change. Check that the packaged asset resolves to the reviewed revision and that imported transforms, material interpretation and clip ownership still work. For derived low-detail versions, inspect the transition at the intended distance; a lower triangle count is not evidence of preserved appearance or lower frame cost.

When a look depends on authoring-tool handlers, drivers, procedural materials or texture changes, identify how the target reproduces it. Bake an appropriate representation or implement the required runtime behavior within scope; a file existing after export does not establish that those effects survived. Preserve silhouette detail in geometry when a normal map cannot represent the required outline.

Deliver the changed asset or requested iteration proposal, before/after views, the defect addressed and remaining visual or runtime questions. Separate technical observations from artistic acceptance. If the engine or renderer is unavailable, finish the useful authoring work and identify the missing game-view check precisely.

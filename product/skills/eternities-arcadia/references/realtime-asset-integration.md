# Real-time 3D asset integration

Use when a supplied model or mesh must work inside a game or interactive 3D scene, or when an import looks correct in one environment but fails in another. The result is the requested working integration or an evidence-based acceptance decision, not an import tutorial or a universal asset checklist. Keep asset creation, offline rendering, and aesthetic direction separate unless requested.

## Establish what must survive the import

Recover the intended use, target engine and version, rendering path, deployment platform, and source asset revision. Use existing project decisions. For a narrow repair, do not reopen the whole art pipeline.

Identify the relevant dependency graph: mesh buffers, textures, material definitions, skeleton and clips, plus any required decoder, shader or importer extension. Record where each dependency comes from and how the target build resolves it. A container extension or loader-success callback does not establish that the whole graph is usable. Inspect supplied content without running embedded scripts or installing unrelated tooling; preserve originals and work on reversible import settings or derived assets. Asset-use permission and technical compatibility are separate questions.

Define the few acceptance observations that matter: for example a doorway's clear opening, a character's planted foot, a product's finish, or an effect's silhouette and frame cost. Preserve unknowns that could change the decision; don't invent dimensions, target budgets or artistic intent.

## Make transforms observable

Compare the imported result with a known-size reference or declared dimensions. Check units, handedness/up and forward directions, pivot, parent transforms and final world scale together. A visual bounding box is not necessarily the physical footprint; decorative parts and animation can change it.

Do not normalize every model to a unit box or hardcode a format-wide scale factor. That can conceal a unit mismatch while breaking sockets, collision, motion or placement. Use a documented conversion at one boundary, then test the final hierarchy. Where mirrored or nonuniform transforms occur, inspect winding, normals, tangents and relevant collision behavior instead of fixing appearance with double-sided materials alone. Keep deliberate asymmetry and authored pivots unless the task calls for changing them.

## Resolve appearance without compensating for import errors

Check material-slot assignments, referenced images, UV sets, tangent/normal conventions, transparency and supported features under the target renderer. Separate texture meaning from file type: color/emissive data and normal/roughness/metalness or packed channels need different interpretation. Verify channel assignments and color encoding against the format and engine version; don't apply the same color conversion to every texture. Check both input and output conversion before compensating with stronger lights or exposure. See the [Three.js color-management reference](https://threejs.org/manual/pages/color-management.html) for one concrete implementation.

Use controlled lighting and a diagnostic material when useful to distinguish geometry, shading and presentation failures. Keep intended artistic lighting for the final comparison. Do not silently mutate shared source materials to fix one instance; choose an instance or copy when variation is required. Imported shader features may need an explicit target-compatible substitute; record that visual change rather than calling it an identical conversion.

## Check behavior only where it exists

- **Collision or interaction:** inspect the actual proxy and relevant query/body mode after transforms. Exercise a representative movement, opening or contact, not only a drawn collider. A render mesh and its collision shape can disagree. Skip physics for a visual-only asset; don't create colliders merely to satisfy this method.
- **Rigged or animated assets:** inspect bind pose, bone mapping, root-motion ownership, clip choice and transitions as applicable. Check representative poses, deformation and motion against the scene's movement controller. Do not play every clip or add root motion to an already translating controller by default. Static assets need no rig audit.
- **Instanced or mutable assets:** establish what is shared and what is per-instance, especially materials, skeleton state and animation controllers. Exercise two differently configured instances if sharing could leak state. Use the existing [runtime lifecycle method](browser-runtime-lifecycle.md) for asynchronous load, replacement and resource cleanup; don't duplicate its whole checklist here.

Engine details are version-specific: [Unity's model-import routes](https://docs.unity.com/en-us/engine/6000.6/manual/assets-and-media/asset-types/models/importing) distinguish model, rig, animation and material configuration; [Unreal's FBX pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine) describes that pipeline's collision and material limits. These are lookup starting points, not mandated tools or assumptions about an installed engine.

## Test the artifact the user will run

Run the smallest representative scene in the intended build or hosting context, not just the importer or editor preview. Verify runtime references, path case, base paths and packaged dependencies. If the target must work offline or on a restricted network, test that condition with authorization; a warm development cache or reachable decoder CDN can conceal a missing dependency. Distinguish downloading, decoding, shader preparation and first usable presentation when investigating a load stall.

For a performance claim, name the build, device, resolution and workload, then measure relevant frame-time distribution, memory and load behavior. Compare the same scene before and after compression, LOD, texture or material changes; a smaller transfer is not automatically lower runtime cost. Preserve visual and behavioral acceptance while optimizing. A successful static inspection or synthetic test is not a GPU measurement.

## Finish at the requested evidence level

Repair observed defects within scope and repeat the affected checks. Leave untouched checks alone unless the change can invalidate them. Report the asset/build identity, intended use, performed changes, observed results, remaining unknowns and required next action. A compact table is useful when several assets or targets differ:

`asset + target | requirement | observation/artifact | pass / fail / unknown / not applicable | action`

Do not average away a blocking failure. A correctly rendered preview can pass appearance while packaged dependency closure remains unknown or fails. If the target engine or device is unavailable, deliver the useful integration work and identify precisely which execution claim remains unverified. Do not fabricate a launch, a frame budget, user approval or release readiness.

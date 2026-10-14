# Scenario A: static loading-bay asset kit

This entire scenario is FABRICATED. Asset names, contracts, observations, reports, permissions and budgets below are authored premises, not evidence of any executed importer, engine, GPU or device. Observation IDs identify literal supplied facts. No asset bytes accompany this case.

## Declared task and target

Task A-TASK: decide whether package `BayKit-R17` can enter the release-bound asset inventory for a small offline first-person maintenance puzzle. Also decide whether a limited local visual review can proceed. Give a bounded disposition, consequential blockers, retained usable evidence and remaining checks. Do not implement repairs or ship anything.

The player must cross a deck, distinguish its open inspection pit from solid floor, read a warning sign and reach a service ramp. The public desktop demo has a conventional camera, keyboard and controller inputs, and a 10-minute session. It has no browser surface, XR, networking, character rig, deformation or authored animation. Objects are static. A code-driven door, if introduced later, is outside this asset task.

The receiving implementation is deliberately unnamed. Its supplied contract `NativeProfile-P1` declares core glTF 2.0 mesh/PBR import, external PNG textures and static triangle collision conversion from an explicitly selected companion mesh. It has no Draco decoder. An unsupported extension listed as required rejects that document. The release must remain offline and must not add runtime downloads or a new decoder dependency without a separate choice.

Acceptance constraints:

- World units are meters. Deck footprint must be 4.80 m by 2.40 m, the square pit must remain 0.80 m wide, and the sign must be 1.20 m high. Visual and collision transforms must agree.
- Collision must support the deck, preserve the pit opening and permit access to the service ramp. Visual correctness alone does not meet this requirement.
- The authored surface recipe must retain the supplied opaque PBR channel meaning. A target render and human legibility check remain required before final acceptance.
- Disk package budget is 12 MiB; scene asset limit is 100,000 triangles and 16 material draw submissions under the declared camera/visibility fixture. Frame-time gate is p95 <= 16.67 ms at a 1920 by 1080 backing buffer. Incremental resident asset-memory ceiling is 96 MiB.
- Shipping requires a closed relative-path package, a repeatable content identity, and affirmative permission records for distributed content. Local quarantined review is permitted while permission evidence is incomplete. This is a task condition, not a legal conclusion.

## Literal supplied observations

| ID | Supplied observation |
| --- | --- |
| A01 | `BayKit-R17` contains `deck.gltf`, `deck.bin`, `collision/deck-collision.gltf`, `collision/deck-collision.bin`, `ramp-draco.glb`, `ramp-core.glb`, `sign.glb`, `images/deck-basecolor.png`, `images/deck-orm.png`, `images/deck-normal.png`, `inventory.txt` and `permissions.txt`. The package byte-count receipt states 8.40 MiB total. No content digests or independently retrievable asset bytes are supplied. |
| A02 | The supplied inventory/URI report lists all external references from the three selected core visual documents and the companion collision document. Every listed URI resolves to an included file with the same case. There are no absolute paths or remote URIs in that report. `sign.glb` and both ramp variants are self-contained. This is a supplied report, not a verification performed by this author. |
| A03 | `inventory.txt` selects `ramp-draco.glb` as the default ramp. Its document lists `KHR_draco_mesh_compression` in `extensionsRequired`. `ramp-core.glb` lists no required extensions and carries the same supplied 1.60 m by 1.20 m design footprint. The supplied geometry summary reports 22,000 triangles for the core ramp and 18,000 for the compressed ramp. Neither variant has been imported into the receiving implementation in the supplied record. |
| A04 | The decoded deck visual's local vertex bounds are 480 by 240 by 30 coordinate units. Its sole inherited uniform scale is 0.01, yielding a declared world-space footprint of 4.80 m by 2.40 m and height of 0.30 m. The visible pit has local width 80 coordinate units under the same transform. No other parent transform is present in the supplied hierarchy. |
| A05 | The companion deck collision mesh's local bounds are 4.80 by 2.40 by 0.30 coordinate units. Its supplied import recipe also inherits uniform scale 0.01, with no compensating parent. Its local pit region contains collision triangles spanning the complete opening; the companion mesh has no hole there. The receiving collision contract consumes exactly those triangles after the supplied transform. No contact or traversal run is supplied. |
| A06 | `deck-orm.png` is explicitly authored with red=occlusion, green=roughness and blue=metallic. One declared steel texel has R=1.00, G=0.28, B=1.00. The receiving material recipe reads red as roughness and green as metallic. Base color is designated sRGB, ORM and normal are designated linear in both recipes. The normal-map tangent convention has no supplied comparison receipt. |
| A07 | The deck and ramp surfaces use opaque materials. The warning sign is opaque, self-contained and has a declared 1.20 m world height with a unit root transform. A supplier-viewer screenshot report says its text is legible at a 2 m view distance. There is no target render, target camera-extreme inspection, alternate-cue review or human test in the receiving application. |
| A08 | With the core ramp selected, the supplied geometry/count report totals 74,000 triangles and 12 material draw submissions under fixture `A-F1`: deck, one ramp and one sign visible, no duplicated instances, fixed camera, 1920 by 1080 backing buffer. No frame times, asset loading timings, CPU or GPU resident-memory readings, repeated runs, occlusion/LOD policy or fallback measurements accompany this report. Counts are not measurements of target frame cost. |
| A09 | `permissions.txt` records internal author approval for the geometry, ORM, normal texture and sign lettering. The deck base-color image contains a third-party industrial label for which the permission field says `unresolved`. No source or grant for that label is supplied. No claim that distribution is legally prohibited or permitted is part of the observation. |
| A10 | The supplier reports no animation clips, skeletons, morph targets or root-motion data, consistent with the declared static task. No audio asset, browser mounting surface, asynchronous browser scene callback, multiplayer authority or XR interaction exists in the supplied target. |

## Supplied unknowns and boundaries

Receiving import behavior, realized collision contact, target material appearance, normal/tangent agreement, target frame-time distribution, incremental resident memory, loading cost, degraded-device fallback, human warning legibility and public-distribution permission for the label are unknown. A repeatable asset content identity is also unknown because the package label and report do not supply byte hashes.

The sign has enough isolated identity and dependency information for a bounded visual-review proposal, but no actual review or import is performed by this case. Do not turn a supplier screenshot into receiving-application or human acceptance evidence. Do not add animation, XR, multiplayer, audio or browser-lifecycle gates to this static native task merely to fill a checklist.

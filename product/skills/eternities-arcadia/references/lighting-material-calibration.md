# Separating lighting from material response

Draft conditional method for Eternities Arcadia. Use when a technically imported asset reads too flat, glossy, dark or unlike its intended finish and the cause could be either the lighting or material. Reuse the established art direction. Import interpretation belongs to real-time asset integration; choosing the visual law belongs to Muse. This is a controlled diagnostic calibration, not physical metrology or a universal realism requirement.

## Portable core

Recover the target camera, object scale, rendering path, output transform and the visual distinction the player must read. Identify whether the material model is lit PBR, toon, unlit or something else; do not impose metallic/roughness semantics on a model that lacks them. First resolve known color-encoding, channel, tangent and normal issues through the existing import method. They cannot be calibrated away with stronger lights.

Create a reversible comparison rig in the authorized scene or an equivalent small fixture. Include a known diffuse reference and, for a model with specular response, a smooth and a rough reference using the same shader family. Use declared relative values, not a claim that an arbitrary gray texture is a calibrated reflectance target. Lock exposure, white balance, tone mapping, camera and background for the comparison. Keep the original artistic settings so they can be restored. If exposure cannot be held fixed, record its changes and treat brightness comparisons as confounded.

Establish reference illumination that actually reveals the feature: a directional cue for normal orientation and a broad, structured source or environment for reflection width. Check that the environment is used for illumination/reflections, not merely drawn as a background. A metal reflecting a dark environment may be dark without having a broken base color. Unlit materials cannot diagnose lighting response. Disable only decorative effects that obscure the comparison, then restore them for the final scene.

Use a crossed comparison to avoid adjusting two unknowns together:

| Material / light | Reference light L0 | Intended light L1 |
| --- | --- | --- |
| Reference material M0 | Establish fixture behavior; if this is wrong, repair the fixture | Detect what the lighting changes on known surfaces |
| Target material M1 | Isolate the target's response under known illumination | Inspect the intended combination after the isolated comparisons |

This table is a diagnostic operation, not a required four-image report for every small edit. If both materials fail only under L1, inspect light direction, environment, exposure and postprocessing before repainting M1. If M1 fails under both rigs while M0 behaves as expected, inspect M1's parameters, maps, geometry and shader compatibility. A failure only at M1/L1 may be an interaction: a narrow reflection source can disappear on a smooth surface at that camera. Neither branch alone proves the final artistic choice.

Once the failing layer is located, bracket one relevant parameter at a time. For roughness, compare low/mid/high candidates under unchanged illumination and inspect highlight width and stability at the play camera. For light direction or source extent, hold the material fixed and compare whether the intended form reads. Restore maps one at a time after a constant-parameter control; distinguish normal-map breakup from roughness variation. A material that appears better only because highlights clip needs a separate unclipped comparison. Keep a project-specific stylized response if it serves the brief.

## Worked decision, not a beauty judgment

Synthetic brief: a brushed-metal door looks like flat charcoal. Texture channels and encoding have already passed the import checks. Under L0, the reference metal and target door show a reflection; under L1, both lose it, while the diffuse reference remains readable. The next useful change is to inspect the reflection environment/source placement in L1, not to brighten the door's base color or set its metalness to zero. Test one environment change with exposure fixed. If only the door still lacks the intended spread, bracket its roughness while keeping that environment fixed.

Alternative evidence changes the branch: if M0 works in L0 but M1's highlight breaks at the same mesh seam in both lights, show a normal diagnostic and test the normal map separately. Extra light intensity does not discriminate a tangent discontinuity. The example establishes decision logic only; no door, reflection or improved image was rendered in this qualification lane.

## Conditional engine adapters

- **Three.js snapshot:** the bundled manuals distinguish unlit materials, normal visualization, PBR roughness/metalness and the linear working/display color boundary. Verify actual material and environment support in the target version. Do not carry over the manual's blanket material-speed ordering as a device measurement or assume Phong shininess numerically converts to PBR roughness.
- **Unreal snapshot:** determine which camera/volume overrides apply before treating a changed setting as active. Keep per-object experiments in the correct instance rather than a world-wide material collection. Renderer features and exposure fields depend on the installed version; the inspected source's UE 5.8 claims are unverified adapter hints.
- **Unity:** bind any later adapter to Built-in, URP or HDRP and its version. No exact Unity lighting API or physical-unit conversion is proposed from the general workflow source.

## Finish

Deliver the selected parameter/rig change, the isolated comparison that motivated it and the restored intended-light view. Include one changed camera or motion condition if it could invalidate the finish. Record whether the decision concerns technical consistency, artistic preference or physical accuracy; physical accuracy requires calibrated measurements beyond this procedure. Human approval of the intended finish and target-device cost remain separate from a correct diagnostic setup.

Source provenance: exact repository/revision/path and source-body hashes are retained in [owner metadata](../skill.json). The crossed experiment and material/light decision branches are original synthesis.

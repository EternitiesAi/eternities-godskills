# Independent transfer cases and mathematical challenges

These are four reviewer-invented application cases, worked after the complete
draft and metadata reads. They are not the author's supplied application checks,
concealed evaluation tasks, engine output or observations from a renderer. All
inputs below are stipulated synthetic facts. Decisions are reasoning results.
`static-checks.mjs` independently calculates the numerical parts with literal
expected values; `static-results.json` retains the actual calculation output.

## T1: A fading minimap selection glow with a compositor seam

The glow's carrier/mask already appears in an opaque control. An intermediate
linear-color target stores a premultiplied edge pixel from straight RGB
`(0.8, 0.2, 0.1)` at alpha `0.25`. The next pass combines it over linear RGB
`(0.1, 0.1, 0.1)` but applies the source-alpha multiplier again. Separate read/write
targets and final display conversion are stipulated correct.

The pass-edge contract exposes the actual defect: stored RGB is
`(0.2, 0.05, 0.025)`. Correct premultiplied composition gives
`(0.275, 0.125, 0.1)`. Multiplying stored RGB by alpha a second time gives
`(0.125, 0.0875, 0.08125)`. The diagnostic next step is to inspect alpha convention
at the intermediate/compositor boundary with time frozen, then correct that
boundary within the target renderer's actual blend rules. Raising emissive tint,
changing the mask or adding bloom does not explain the demonstrated arithmetic.
The opaque control rules out neither all depth errors nor every other pass; the
given failing seam is what makes this particular conclusion supported.

This transfers the construction/fault split to an intermediate compositing edge,
not the draft's expanding-ring resize example. Existing import color checks do
not supply its staged carrier-to-mask-to-compositor isolation procedure. Actual
same-time images and the target's alpha/blend configuration remain unobserved.

### Additional requested pulse inspection

Use a `1600 x 900` region and explicitly define
`p = ((uv.x - 0.5) * 1600/900, uv.y - 0.5)`. At radius `0.2`, UV positions
`(0.6125, 0.5)` and `(0.5, 0.7)` both have radius `0.2`, and both project to
180 pixels from center. This verifies the stated aspect correction for this
coordinate convention; other conventions need their own units.

For radius `0.2`, halfWidth `0.02`, edgeWidth `0.005`, the draft's signed band
distance gives mask `1` at radius `0.2`, `0` at radii `0.175` and `0.225`, and
`0.5` at nominal outer band boundary `0.22`. The positive edge-width requirement
avoids equal smoothstep endpoints. With a thinner halfWidth `0.001` and unchanged
edgeWidth `0.005`, the centerline mask is `0.648`, not `1`. That is consistent with
the draft's claim of visibility, not a guarantee of fully opaque thin rings.
No pseudocode correction is required by these examples. An actual implementation
must still define valid radius/width inputs and pixel-footprint estimation.

## T2: A specular readability failure only in one crossed cell

A stylized ceramic figurine uses a lit shader with approved art direction. Import
encoding, channels and normals are stipulated correct. Exposure, camera, object
geometry and output conversion stay fixed. Swap M0 (reference material) and M1
(target material) on that same geometry, and cross broad reference illumination
L0 with the intended narrow-strip illumination L1. The synthetic feature-readability
observations are:

| Material | L0 | L1 |
| --- | --- | --- |
| M0 | Intended band readable | Intended band readable |
| M1 | Intended band readable | Intended band absent |

Neither a globally bad light nor a generally broken M1 follows: each passes a
separate control. The interaction cell warrants one probe with material/camera
held fixed: widen or rotate the illumination source, then restore the original
light and bracket the target's roughness separately if needed. If the band appears
only as the narrow source moves into the reflection direction, that would support
a geometry/source/material interaction; it is a proposed observation, not a
performed render. A missing environment binding or changed exposure would reopen
the control rather than support that branch.

This case differs from the author's dark-metal-door example, where both reference
and target fail under the intended light. The crossed experiment prevents the
wrong global/material-only repair in this different failure pattern. Existing
asset integration says to use controlled lighting and diagnostic materials but
does not supply this crossed interaction decision. An acceptance verdict about
the figurine's finish still requires actual viewing and the accepting person.

## T3: Interrupted vault, independent aim layer and movement handoff

Vault playback V17 owns root displacement at a synthetic 2 m/s until an accepted
falling-state interruption at 120 ms. The controller then owns travel at 3 m/s.
At interruption the exclusive layer has walk/vault weights `0.2/0.8`; a falling
target is introduced with `u=0.25`. A separate additive aim layer has weight `0.4`.
At 140 ms, an authorized new use of the same vault clip receives identity V18;
an old V17 completion arrives later. No strike/damage event is part of this case.

The exclusive weights are `0.15/0.6/0.25`, summing to one. The aim weight remains
`0.4` under its independent additive/mask policy; normalizing all four values
together would change that declared meaning. Algebraically the draft's exclusive
rule preserves the sum because `(1-u) * sum(w_i) + u = 1` when the old weights
sum to one. At `u=0` it preserves the old contributions and at `u=1` selects the
new target. This establishes weight continuity, not engine pose/velocity continuity
under arbitrary blending, masks, root-motion extraction or inertialization.

In an alternate branch where falling continues through 200 ms without accepting
V18, root travel before handoff is `2 * .12 = .24 m`, and controller travel after
handoff is `3 * .08 = .24 m`: total `0.48 m`. Continuing root travel as well would
give `0.64 m`, exposing double ownership. In the V18 branch the new vault's
handoff must be declared separately; do not reuse the alternate branch's `0.48 m`
as its displacement result. V17's late completion cannot clear V18's lock or finish
its state simply because the clip asset is the same. Old cleanup can release only
V17-owned resources, without disposing a clip/resource still shared by V18.

The new value beyond generic motion retargeting is the separation of gameplay
authorization, skeletal-layer meaning and movement ownership. Existing motion
identity semantics are retained, not claimed as new. No sampled pose, collision,
network result, foot-slide result or runtime event ordering is asserted.

## T4: Resolution probe reveals a new limiting stage and a pacing threshold

Stipulate an ideal overlapped CPU/GPU pipeline, stable active CPU `8.5 ms`, fixed
90 Hz pacing (`11.111... ms`), no other waits, and matched steady-state samples.
Full-resolution GPU work is `13.6 ms`; half width and half height yields `8.2 ms`.
This case includes a fixed GPU contribution, unlike a purely pixel-proportional
effect. Use a local model `GPU(P) = F + A * P`, with full pixel fraction `P=1`.

From `F+A=13.6` and `F+A/4=8.2`, subtract to obtain `A=7.2 ms`, `F=6.4 ms`.
The fitted model is a diagnostic hypothesis, not a universal GPU law or pass
identity. The first probe reduces GPU cost below CPU cost: now `8.5 ms` active
CPU is the limiting stage. Under the stipulated pacing, the full frame presents
every two refreshes (`22.222... ms`); the half-dimension version can present every
refresh (`11.111... ms`). Further quartering both original dimensions would yield
`P=1/16`, GPU `6.85 ms`, but CPU and presentation stay at their previous limits.

Thus the end-to-end cadence gain is twofold in this fixture, not fourfold. A third
quality reduction has no supported cadence benefit here. Inspect the CPU stage,
remaining GPU pass costs, visual acceptability and any violated model assumptions
before choosing the final change. Neither summing CPU+GPU nor reporting FPS alone
would expose the new limiting stage. If timing is invalid or from different
intervals, these fitted contributions are unknown and this inference is withdrawn.

The distinct method is pre-optimization localization and falsifiable probes;
the current performance-release-gating method already owns a later release
decision. These synthetic numbers are not target-device performance observations.

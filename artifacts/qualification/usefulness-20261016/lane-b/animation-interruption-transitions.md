# Gameplay events and movement during animation interruption

Draft conditional method for Eternities Arcadia. Use when a new input interrupts a skeletal blend or one-shot action and gameplay effects, layered pose or displacement disagree. Retain the existing motion-design-and-animation-engineering method for general retargeting, stale completion and UI choreography; it already serves those jobs. This neighboring method adds gameplay event windows, exclusive versus additive layers and displacement handoffs. A routine clip import stays with asset integration; browser pause/focus lifecycle stays with its existing method.

## Portable core

Separate three things: the gameplay state that authorizes an action, the playback instance producing a pose and the movement owner producing displacement. A clip still contributing to a fade need not still authorize damage. Conversely, an engine's stopped flag may not mean its visual contribution has reached zero.

For the transition in question, record source and destination, trigger priority, permitted interruption interval, blend duration/curve, target phase policy and event disposition. Choose whether repeating the same request restarts, queues, coalesces or is ignored. Set ordering for simultaneous requests from the product's rules; do not let event-listener registration order decide whether a hit reaction beats an attack. For cyclic movement, choose preserved or synchronized phase when appropriate; for a one-shot reaction, choose its intended entry point. An unconditional reset to time zero is not a universal transition policy.

When another request interrupts a blend, start from the currently evaluated contributions or the engine's supported pose-continuity mechanism. Do not pretend the actor has already reached the previous destination. For an exclusive normalized layer with active weights `w_i`, a new target can receive weight `u` while previous contributions receive `(1-u) * w_i`, where `u` progresses from zero to one under the new blend. This illustrates a contract, not a replacement for the engine's blending implementation. Additive layers, partial-body masks, inertialization and root-motion mixing have different rules; do not normalize all layers together. Preserve current clip times unless the phase policy explicitly changes them.

Give each accepted action a playback identity or generation, including when the same clip is reused. Bind completion and notify handling to that identity and the still-valid gameplay state. A stale completion may clean up its own remaining playback resources but cannot complete, unlock or restart the newer action. When cancelling, close gameplay windows and perform idempotent cleanup at the required state boundary; do not depend on an end-notify that an interruption may skip. A late cosmetic event can be dropped by policy. Do not replay a gameplay effect merely because its acknowledgement was absent; consult the existing authoritative event record if outcomes can be uncertain.

Choose one displacement owner for each interval: controller, root motion or an explicit combination rule. Record the handoff on interruption and landing. A visually smooth blend with double-applied travel is still wrong. In a networked game, preserve the project's authority/prediction model; presentation callbacks must not create a second authority for damage or movement.

## Worked interruption trace

Synthetic setup: a controller owns travel. Locomotion L fades to attack A over 250 ms using a linear exclusive-layer blend. A's gameplay strike is allowed at 140 ms only if that attack identity is still active. Hit reaction H can interrupt immediately and blends in over 100 ms.

| Time | Input / event | Required disposition |
| --- | --- | --- |
| 0 ms | Accept A with identity 41 | Begin L to A; do not schedule unconditional damage |
| 100 ms | H interrupts | L/A contributions are 0.6/0.4; cancel A's strike authorization and begin H from those contributions |
| 140 ms | Queued strike for identity 41 arrives | Reject it as cancelled; no damage from this attack |
| 150 ms | Halfway through H's linear blend | Illustration: L/A/H weights 0.3/0.2/0.5, summing to one on this exclusive layer |
| 250 ms | Old A completion arrives | It cannot return the character from H to locomotion or release H's lock |

The numeric weights illustrate continuity under the declared policy; they are not sampled engine poses. If H were additive, this normalization rule would be inapplicable. If attack movement were root-driven, the trace would additionally need the displacement handoff and its continuity observation.

Exercise the boundary just before and after the strike time, repeated requests, interruption during blend-in and blend-out, and a late completion from an older instance of the same clip. Trace accepted state, playback identity, event acceptance/rejection, effective weights and displacement. Replay the same intent times at two update rates and across one bounded hitch; specify how crossed event windows are handled. Do not turn a skipped animation sample into an automatic gameplay success. Observe the actual rendered transition for foot sliding, pose pops and silhouette readability after the state trace passes.

## Conditional engine adapters

- **Three.js snapshot:** clips hold tracks, a mixer evaluates playback, and actions control timing/weights/fades. Preserve those roles. The bundled overview does not specify an interruption controller; generation checks and priority belong to original application logic. Verify available action reset/stop/fade semantics against the target version before implementing them.
- **Unreal snapshot:** the inspected workflow distinguishes montage blend-out and end callbacks and documents interruption information, slot/layer behavior and root-motion ownership. Use those as items to verify in the target engine, not proof that a particular UE 5.8 signature exists locally. A montage pointer alone may not distinguish successive playback identities.
- **Unity:** the general source supports deriving animation from authoritative gameplay state. It does not settle Animator transition interruption settings, normalized-time semantics or Playables APIs; inspect the actual controller and installed version before an adapter is accepted.

## Finish

Deliver the transition policy and the requested implementation or diagnosis with the discriminating event trace, movement result and relevant rendered interruption. Keep blend correctness, authoritative event correctness and visual quality separately observable. Without the engine, a policy and synthetic trace remain a draft; they do not prove smooth motion, network correctness or play feel.

Source basis: `three-animation`, `ue-animation` and `unity-workflow` in `sources.json`, alongside the retained current motion method. Gameplay-specific arbitration, the normalized-layer example and the trace are original synthesis; general request-identity handling is retained existing coverage, not claimed as a new capability.

# Game-state to audio-cue design (DRAFT)

Use this Arcadia player-experience method when a game brief names player-relevant states or events and asks how sound should communicate them, including overlap, interruption, or a non-audio alternative. It is a design and acceptance-planning aid, not a new route, engine recipe, asset-creation workflow, rights grant, DSP implementation review, accessibility certification, or evidence that a game is good.

The method is provider-neutral and engine-independent; no network or named service is needed.

## Bind the player question and scope

Name the game and design/build revision (or `not-yet-built`), player promise, intended player information or action, in-scope states/events, platform/device assumptions, access needs, resource constraints, and unresolved decisions. Keep source state/event names distinct from inferred meaning. If the actual event contract, cue owner, player question, or relevant platform constraint is unknown, record it as open and request the smallest responsible decision; do not fill gaps with a universal game convention.

Give each in-scope event and cue a stable local ID. For each event, record:

| Field | Record |
|---|---|
| Event | Owning system, source state, transition/event ID, and entry/exit condition. |
| Current-state authority | The source/owner that decides the authoritative current state, the applicable revision/order or conflict rule, and when an older event becomes obsolete. Unknown authority or order leaves the affected cue decision unresolved. |
| Player purpose | What changed, what the player needs to notice, and any next action the sound is meant to support. Separate information from mood or emphasis. |
| Cue | Cue ID, responsible design/implementation owner, intended sound role, and whether the result is a cue, a deliberate silence, or unresolved. |
| Timing and lifecycle | Start condition, update/retrigger behavior, stop condition, and expected behavior across pause, mute, scene changes, and recovery. |
| Presentation and suppression | Listener/session or presentation-context identity; whether suppression applies per event, phase, listener, or context; and the reset/re-entry rule. Distinguish repeat delivery to the same context from critical information needed by a newly connected listener. |
| Context | The other cues that can coincide on this actual transition, the player need at that moment, and a reasoned priority or sequencing choice. |
| Alternative | The equivalent visual, text, control, or supported haptic signal for critical information when the brief or access need requires it. State when no equivalent is needed and why. |
| Constraints and evidence | Target device/resource assumption, planned observation or check, owner, status, and exact build/configuration when later tested. |

Keep cue ownership bidirectional: each critical event points to a cue or an explicit silent reason, and each cue points back to an event and owner. Changed event meaning or ownership invalidates the affected row until reviewed; do not silently reuse an ID for a different event.

Before presenting or restoring information, reconcile the event with the authoritative
current state, using the project's declared ordering/conflict rule rather than arrival
order alone. Name which existing audio **and non-audio** presentations are canceled,
updated, retained, or unresolved when a newer incompatible state wins. The method
does not prescribe a networking protocol, universal version scheme or race-free
implementation.

Example: SAFE revision 42 is authoritative; a delayed DANGER revision 41 arrives
afterward. The old danger event must not reinstate its warning. Cancel or update any
superseded danger sound and alternative indicator according to the current SAFE
row. If the state source or comparison rule cannot establish which state is current,
mark that presentation decision unresolved rather than treating the last arrival
as truth.

## Decide collisions in context

Review concrete pairs or sets of cues that can occur together on the named transition. State which player information is time-critical, whether one cue continues, yields, moves, pauses, or is intentionally suppressed, and why that decision serves the current player question. Do not infer a global ordering from labels such as “music,” “voice,” “warning,” or “UI.” A priority chosen for one state can be wrong in another state.

For example, a time-sensitive direction, a changing traversal bed, and an incoming-threat signal may coincide. Record which information must remain available for that moment, how each other layer behaves, and what alternative carries any critical information that cannot be heard. Recheck the same sounds in a quieter menu or a different player state instead of carrying over a blanket priority rule. Ducking, attenuation, and loudness remain project-specific choices: prescribe neither fixed decibels nor a universal mix threshold.

## Exercise interruptions and recovery

For each relevant event, decide behavior at ordinary entry/exit and at the interruption paths the game supports. Consider pause/unpause, user mute/unmute, repeated or stale triggers, overlay/menu entry and return, scene unload/reload, error/checkpoint recovery, and reconnect or a new listener/presentation context. Check both the cue and its owning event state: no orphaned loop, invisible-but-running stem, stale warning, duplicate restart, or resume that masks a newly urgent event. Mark unsupported paths out of scope with their owner and reason rather than implying they were tested.

On reconnect, reconcile the listener's currently available information with the
authoritative state. A once-per-phase suppression flag is not proof that a new
listener has received still-current critical information. Record suppression scope
and reset/re-entry explicitly; choose whether the necessary information is conveyed
through a current cue, a persistent visual/text alternative, or another supported
presentation. Do not automatically replay the original sound or obsolete event.

Example: phase P7 is still ENRAGED and its entry cue has already played. A player
reconnects during P7. Preserve any intentional once-per-phase audio policy, but
ensure the new context receives the still-relevant enrage information through the
declared audio or equivalent alternative. An old phase's warning must not return,
and a reconnect without a new phase-transition event must not silently lose the
current critical information.

## Separate planned checks from experience claims

Use separate evidence lanes:

1. **Structure:** every critical transition has a cue or an explicit reason for silence; cue/event and current-state authority resolve; ordering/conflict and superseded-presentation decisions are declared; relevant collision pairs have a contextual decision; suppression/re-entry accounts for a new listener context; and required non-audio alternatives are represented.
2. **Build behavior:** under a named build, settings, and target device, observe onset/stop, overlap, interruption/recovery, mute behavior, access alternatives, and the applicable memory, latency, streaming, or other resource constraint. Use the actual project's thresholds; this method supplies no default codec, engine, hardware budget, decibel value, or universal timing limit.
3. **Human play/listening:** people review whether the intended information is perceivable and understandable in the target context, whether competing cues mask it, and whether the mix and alternatives work for the intended experience. Record conditions, reviewer, result, and uncertainty. A filled table, simulated fixture, or passing structural check cannot decide audibility, comprehension, emotional effect, accessibility conformance, comfort, or fun.

Keep planned, performed, failed, blocked, and human-pending states distinct. A design-only packet remains a proposal; do not present planned evidence as observed behavior or turn one listening session into a device-wide guarantee.

## Hand off to the owning specialist

Arcadia owns the player-facing meaning of the gameplay event, the contextual cue design, and its game-state acceptance plan. Hand supplied-asset provenance, rights/consent questions, transcription, caption alignment, or media timeline assembly to Orpheus. Hand supplied DSP source or signal-graph questions about realtime deadlines, numeric behavior, routing, latency, or feedback to audio-DSP review. Hand interface semantics, keyboard/focus, screen-reader behavior, reduced-motion presentation, or rendered UI conformance to Muse and the relevant platform test owner. A handoff does not make Arcadia's semantic decision for it, and no handoff grants permission to access, transform, publish, or reuse an asset.

Return the bounded event-to-cue map, current-state authority and conflict decisions, contextual collision decisions, suppression/reset scope, applicable interruption paths, required alternatives, target constraints, evidence status, open questions, and named next owners. This reference is DRAFT: discovery can still be coarse, use is not automatic, and all experience and rights claims remain subject to their separate evidence and authority.

# Consumer exercise: state-to-cue plan packets

**Status:** Design-only DRAFT exercise; not game code, an audio render, runtime test, accessibility result, or player verdict.

**Method source used:** copied `product/skills/eternities-arcadia/SKILL.md` (SHA-256 `84023828419d63d0cdff7936d3c87d742a7ae58d07dd00f547ae8397584e47db`) and `product/skills/eternities-arcadia/references/game-state-to-audio-cue.md` (SHA-256 `f7eac8b067c0e4d46e2464e22d4d26db28572d24223a7af1114197cb9517935f`). These instructions alone shaped the packets; scenario labels and facts are from the assigned SAFE/DANGER/P7 exercise. No other skill, runtime, asset, engine or provider was used to generate them.

## Packet CP-42A — authoritative SAFE state

- **Build / promise:** `not-yet-built`; communicate whether the danger is currently active. Platform, device, player-access needs and exact cue assets are `UNKNOWN`.
- **Event:** local row `SAFE-42`; the prompt supplies SAFE revision 42 as the current state. Owning system, authoritative source identity and revision/conflict contract are `UNRESOLVED`.
- **Player purpose:** do not signal an active danger while the current authoritative state is SAFE. Whether SAFE itself needs a positive sound is not established by this brief.
- **Cue / lifecycle:** danger cue `CUE-DANGER` is inactive under SAFE. If a SAFE cue is later approved, its start/stop behavior must bind to the state row; no sound, asset, or timing is invented here.
- **Presentation / suppression:** any already-presented danger warning must be cleared or updated when SAFE is confirmed. There are no other collision cues in the supplied scenario.
- **Alternative:** clear/update any danger indicator with the same authoritative transition. Whether a persistent SAFE indicator is needed is `UNKNOWN`; if used, bind its exit to leaving SAFE.
- **Authority gate:** do not infer authority from the `42` suffix alone. Obtain the state owner and comparable ordering/conflict rule before treating this as a release-ready decision. Until then, “danger cue inactive for SAFE-42” is conditional on the prompt’s current-state premise.
- **Evidence:** structure proposal only; no implementation or experience claim.

## Packet CP-42B — delayed DANGER event after SAFE-42

- **Event:** local row `DANGER-41` arrives after the supplied `SAFE-42` current state. The delivery order is explicitly not treated as state authority.
- **Conditional decision:** if the owning system confirms both IDs share its comparable revision domain and SAFE-42 remains authoritative, DANGER-41 is obsolete: do not start/restart `CUE-DANGER`; cancel any stale danger loop and clear/update its non-audio warning; retain the current SAFE presentation. The DANGER event is not allowed to reinstate danger information merely because it arrived last.
- **Unresolved authority handling:** the exercise does not provide the owner, source identity, or actual ordering/conflict contract. If that contract cannot establish SAFE-42 over DANGER-41, leave the affected cue and indicator decisions `UNRESOLVED`; ask the state owner to reconcile current state. Do not choose last-arrival-wins or assume numeric suffix ordering.
- **Stop / recovery:** superseded danger sound and warning stop on authoritative SAFE reconciliation; later presentation requires a newly confirmed current DANGER state. Exact timing and fade are project decisions, not supplied here.
- **Evidence:** planned cancellation/update only; no race-free implementation or runtime behavior is claimed.

## Packet CP-P7 — still ENRAGED on reconnect

- **Build / promise:** `not-yet-built`; a reconnecting listener must learn that boss phase P7 is still ENRAGED. Platform and supported presentation channels are `UNKNOWN`.
- **Event / authority:** the scenario states ENRAGED-P7 remains current, but does not name the authoritative owner/source or a reconnect snapshot contract. Reconcile that current state before restoring information; if it cannot be confirmed, leave presentation `UNRESOLVED` rather than replaying a stale event.
- **Suppression scope:** the original one-shot audio is already delivered for P7 in the prior listener context. Preserve once-per-phase audio suppression there; do not let that phase-global record stand in for information delivered to a newly connected listener.
- **Decision for this plan:** do not automatically replay the original sound. Give the new presentation context a level-triggered current-state message equivalent to “BOSS ENRAGED — P7” if the project has an approved persistent text/visual channel. The channel's availability and rendering are `UNRESOLVED`; the UI/state owner must confirm it. If none exists, the game owner must choose a current-state cue or another supported alternative before the plan is complete—silence is not an accepted completion.
- **Lifecycle:** start/refresh the new-context indication only after current ENRAGED-P7 is confirmed; clear it when the authoritative phase/state exits ENRAGED-P7. Keep that indication's listener/context scope distinct from same-listener duplicate audio suppression.
- **Evidence:** proposed information mapping only. No actual reconnect, audio playback, interface rendering, or human comprehension was tested.

## Exercise result

The packets make a bounded decision: stale DANGER-41 cannot override a verified current SAFE-42; new P7 listeners must receive current enrage information without blindly replaying the prior one-shot. The specific authority source, ordering contract and existing alternative channel remain unresolved project inputs. This is the planned method's intended behavior, not proof that a game implements it.

---
name: long-horizon-work-continuity
description: Carry an authorized objective across milestones, interruptions and resumptions using compact checkpoints, live ownership and effect reconciliation; use for sustained work, not a one-step task or a promise of unattended execution.
---

# Long-horizon work continuity

Keep an authorized objective executable after context, source state, or ownership changes. The method coordinates decisions and recovery. It does not create a runner, scheduler, durable store, or uninterrupted multi-day execution.

## Establish the work contract

Record objective and observable finish condition, invariants, exact targets, exclusions, authorized effects, decision owner, available time/cost/resource limits, and stop or pause conditions. Preserve existing authorization for the same scope and consequences; a checkpoint cannot enlarge it. A request to persist does not authorize new spending, workers, publication, or targets.

Break work into milestones with prerequisites, deliverables, acceptance evidence, and current owners. Distinguish prepared, implemented, checked, integrated, and externally applied results where those differences affect the objective. Choose the next ready milestone; a plan or checkpoint is not completion of an authorized execution task.

Confirm the host facilities actually available: a permitted place to retain state, tools for the scoped work, authoritative observations for consequential effects, and any already-authorized runner or wake mechanism. Name missing facilities. Without an authorized durable store, return a compact packet for the user to retain; without a runner or scheduler, work only during active execution and hand off at interruption. Do not promise a wakeup or background progress. No particular tool, model, or service is required by this procedure.

## Execute and checkpoint

Before modifying a shared target, confirm live ownership, current revision and pending changes. A saved assignment is not a lock. Hold contested writes while pursuing independent permitted work. Keep milestone dependencies and invariant checks attached to changes so a local success cannot silently close an integration gate.

For consequential effects, retain intent and operation identity before dispatch in the permitted store when available: target, payload identity, authority, cost bound, expected receipt, and retry semantics. Record requested, acknowledged, running, succeeded, failed, cancelled, or unknown according to observations. Acknowledgment, timeout, or notification loss does not establish completion. An interruption around dispatch can leave the effect unknown even if the saved record says only intended.

Checkpoint at a meaningful milestone, before a fragile external effect, or at interruption/handoff. Preserve objective and invariants, current milestone and owners, source revisions, evidence locators, changes not yet verified, uncertain effects, exhausted limits, eliminated approaches, pause state, and one safe next action. Update stale decisions rather than accumulating narration. Use [the continuity packet](references/continuity-packet.md) when state must survive a handoff.

## Reconcile before resuming

1. Match packet identity to the actual task and recover current user steering, authority, pauses, and remaining resources. Open only the packet and evidence needed for the next decision; expand to history for a specific unresolved gap.
2. Refresh live ownership, affected source revisions, branches or artifact identities, and prerequisite outputs. Identify changes since the checkpoint. Reopen checks and dependent milestones invalidated by those changes; a different revision does not inherit a prior pass. Preserve concurrent work and reconcile before integration.
3. Reconcile each uncertain paid or external effect by operation identity and authoritative state before retrying, cancelling, or compensating. Read [uncertain-effect recovery](references/uncertain-effect-recovery.md) for ambiguity or partial success. If evidence is unavailable, hold that action at unknown and continue independent authorized work. Absence of a notification is not permission to resend.
4. Select the next ready action within retained authority and current limits. Resolve routine reversible choices directly. Stop the dependent action for a changed target or consequence, unresolved ownership or external state, exhausted resource limit, or a user pause; identify the exact missing fact or decision.

## Close, pause, or hand off

Honor a pause's stated scope. Prevent new dependent actions; an existing job's cancellation requires the appropriate authority and an observed result. Distinguish a scheduled wake, running worker, and saved packet. Do not say work stopped, resumed, or continues in the background without observing that state.

Finish when the objective's required evidence and integration/effect gates are met. Otherwise leave a compact packet with the actual active or terminal state, unresolved gate, next owner, and safe continuation. Repeatedly rereading history or extending the plan is not progress; change an ineffective approach within scope or identify the demonstrated boundary.

Read [interruption cases](references/interruption-cases.md) for stale-source, unknown-effect, pause, and host-fallback illustrations. Related delivery, architecture, memory, recovery, and integration methods are optional companions, not dependencies.

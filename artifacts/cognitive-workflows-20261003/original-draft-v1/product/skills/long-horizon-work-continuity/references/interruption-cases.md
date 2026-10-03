# Interruption cases

Synthetic author illustrations; no worker, payment, scheduler, or external operation was run. Example revisions and operation IDs are illustrative identities, not bundled artifacts. Each case shows the decision and the evidence still needed.

## Paid work acknowledged before an interruption

Contract: produce one render using an already authorized service, maximum one paid request, then assemble a local preview. Packet: `operation=render-42`, `payload-digest=p7`, acknowledged; completion notification timed out. No render receipt was saved. On resume the local output folder is empty.

Decision: an empty folder and timeout do not establish failure. Read the authoritative status for `render-42` within existing access. If it is running, retain that ID and prepare independent local preview scaffolding; do not issue a second render. If it succeeded, retrieve and verify the corresponding output under existing authority. If status is unavailable, mark the render unknown, hold the paid milestone, and return the missing receipt/owner rather than spend again. Even a reported terminal failure does not authorize a second paid request when the one-request ceiling is exhausted.

Checkpoint delta: `M-render=acknowledged/unknown pending authoritative observation; M-preview-preparation=ready; remaining paid requests=0`. No background waiting is promised without an active authorized host facility.

## A stale branch invalidates a prior test

Contract: local adapter implementation and tests; parent owns integration and publication. Packet says adapter at `revision-a` passed the `schema-v1` fixture and is ready for integration. Current inspection shows the parent changed the schema to `v2`, a collaborator now owns the adapter path, and the recorded branch has additional edits.

Decision: retain the old pass as evidence only for `revision-a/schema-v1`. Reopen adapter compatibility and the integration milestone. Inspect the new schema and affected contract only; no full history replay is needed. Hold edits to the collaborator-owned path. Prepare a bounded compatibility analysis or proposed patch in an already-authorized disjoint target if one exists; otherwise hand off the exact mismatch. Do not overwrite concurrent edits, merge, push, or publish through the old assignment.

Checkpoint delta: pin live schema and candidate revisions, record current owner, old evidence's invalidation reason, and the check needed against `v2`. The original local task authorization remains; the recorded integration permission still belongs to parent.

## Pause scope differs from worker state

Contract: local analysis plus an already authorized batch job. New steering says "pause launches; keep the current job." Packet says job `batch-9` running and a wakeup previously scheduled. Current status confirms the job running, but the wakeup status is unavailable.

Decision: launch no new work and do not cancel `batch-9`. Record the job's observed state and wakeup unknown separately. An existing scheduled wake does not establish active execution, and the pause does not cancel it by implication. If authority includes changing wake schedules and the pause requires suppressing a launch, inspect and adjust only that schedule with a receipt; otherwise identify the scheduling owner and hold launch-dependent activity. Permitted observation or a compact handoff can continue within the pause's scope.

If later steering says "stop this job," existing authority must cover its exact cancellation. Observe the cancellation acknowledgment and terminal state separately; do not label the job stopped solely because the request was sent. Preserve partial outputs and costs. An explicit resume lifts the stated pause, not a cost ceiling or missing ownership gate.

## The host has no durable store or scheduler

Contract: continue a document revision across several sessions. The host permits editing the current document and returning messages but provides no approved checkpoint storage or wake tool. The document can be saved; automatic continuation cannot be scheduled.

Decision: complete the next feasible authorized revision during the active turn, then return a small packet: document revision/section, remaining obligation, invariant, unresolved decision, and next safe action. Ask the user to retain it only as the handoff mechanism; do not create a global memory record or promise tomorrow's execution. A later session can use the supplied packet and fresh document state.

If the packet is lost, recover the governing request and current document, inspect only the sections needed for the next decision, and mark unrecoverable prior choices unknown. Revalidate the affected obligation instead of inventing a remembered approval.

## Resource limits close a route, not the objective

Contract: implement and locally verify a preview with a shared compute allocation of one active job. At checkpoint, validation is pending. Current status shows another owner using the allocation; earlier performance evidence came from a different candidate revision.

Decision: do not launch a competing job or reuse the stale pass. Complete independent static inspection if authorized, keep the actual validation gate open, and hand off the revised candidate identity and required check. If a permitted lightweight check can detect the current defect, use it and state its limits; do not claim performance acceptance. A resource boundary can justify a checkpoint without making the objective complete or expanding the allocation.

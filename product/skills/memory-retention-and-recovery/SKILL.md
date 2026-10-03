---
name: memory-retention-and-recovery
description: Preserve and recover minimal task-critical state across interruptions, corrections, and scope changes using only host-authorized storage.
---

# Memory retention and recovery

Use when task state must survive an interruption, handoff, or correction and stale or conflicting records could change the next action. Skip ordinary lookup, simple recall from supplied context, and routine status checks. This method offers bounded continuity; it does not promise unlimited recall.

## Retain only what changes the next decision

Bind the exact task or project, scope, authority, and as-of time before recording or retrieving. Keep a compact checkpoint with only the useful fields:

| Field | Retain |
| --- | --- |
| Aim and scope | Requested outcome, included target, owner or authority boundary |
| Decision | Choice made, reason, source, and whether it is still current |
| State | Verified done/not done, observable result, and in-flight or uncertain effects |
| Pointers | Artifact locator plus revision or digest when available; source date/freshness when relevant |
| Open state | Missing evidence, contradictions, assumptions, and what could invalidate them |
| Next step | One safe action, its precondition, and the evidence that would change it |

Exclude secrets, incidental personal details, raw conversation replay, and material that does not affect continuation. A pointer locates an artifact; it is not a stored copy. A matching digest identifies bytes, not truth, approval, or current applicability.

## Recover before acting

1. Match the record to the exact task, project, target, and authority. Do not transfer a similar record across people, projects, sessions, or permission scopes without evidence that it belongs.
2. Reopen the narrowest authoritative source and verify its current revision, date, status, and relevant locator. Apply the declared freshness rule; do not treat a timestamp alone as proof that a record remains valid.
3. Compare the record with current evidence. Mark changed inputs stale; preserve materially conflicting claims with their source and date; surface gaps instead of merging them into a confident summary. A newer note does not automatically win.
4. If a correction or superseding decision is supported, record what changed, why, when, and which conclusions or artifacts depend on it. Mark the old state superseded or invalid for the affected scope; do not silently erase history needed to explain prior work.
5. Before retrying an action whose completion is uncertain, inspect its current status through the authorized host. If that status cannot be checked, report it as unknown and do not claim success or repeat a consequential action on assumption alone. Continue only work independent of that uncertainty.

## Checkpoint, storage, and finish

Checkpoint actual state at a real interruption or handoff: what was verified, what was not done, what remains uncertain or in flight, current artifact/source versions, the next safe action, and the condition that would invalidate the checkpoint. When retention is requested and permitted, save the compact packet through the actual authorized host store. Record the checkpoint's own locator or identity and the observed save outcome. Establish retention from a reliable save receipt or retrieval when available; merely preparing text does not persist it.

If the save fails or is rejected, return the packet as `not persisted` with the relevant failure. If the save times out or has an uncertain outcome, label it `persistence unknown`, retain any operation/record locator, and reconcile through the store before a potentially duplicating retry. Do not claim success from an attempted write or assume failure from a missing acknowledgment. If no authorized store is available, return the packet in the response as `not persisted`. These fallback packets remain useful handoffs, not demonstrated durable memory. This method does not change memory permissions or any host continuity policy.

Finish when a consumer can resume from verified, correctly scoped state or can see the precise evidence gap that prevents it. Use [examples.md](references/examples.md) when a stale checkpoint and conflicting updates must be reconciled.

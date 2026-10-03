# Uncertain-effect recovery

Use when an interrupted operation could have spent money, written externally, dispatched work, or partially applied a change. This is a decision procedure, not an executor. Use only observations and effects already within the task's authority.

## Identify and observe

Recover the destination, operation identity or idempotency key, payload identity, dispatch window, last reliable receipt, permitted cost, and documented retry/cancellation semantics. A crash can occur after dispatch but before the local record advances. Neither a saved `intended` entry nor a missing success message proves that nothing happened.

Query an authoritative operation record, scoped result, or transaction ledger when authorized and available. Match identity, payload/version, and destination, not only a similar title or timestamp. An index with delayed visibility, an unchanged balance, or a generic "not found" response may be inconclusive. Separate operation status from whether its promised output exists and is usable.

## Choose the smallest supported action

| Authoritative observation | Decision within existing authority |
| --- | --- |
| Operation succeeded; expected artifact verified | Record completion and advance dependent work. Do not resubmit. |
| Succeeded but output missing or unusable | Preserve success and diagnose output access/quality. A replacement paid operation requires its own applicable authority and budget. |
| Queued or running | Continue scoped observation under host/time limits, or hand off the exact job identity. Do not duplicate. |
| Terminal failure or cancellation with confirmed effect boundary | Repair the cause and retry only if permitted, remaining budget and retry semantics cover it, and partial effects are accounted for. A failed operation can still leave a partial write or charge. |
| Reliable evidence of no dispatch/effect | Reevaluate current preconditions and invoke only under the retained scope and resource limit. |
| Partial success | Record completed parts; isolate remaining parts. Resume only if partial replay is safe under the real interface contract. Never replay the whole batch by assumption. |
| Conflicting status, inaccessible receipt, or absence without conclusive semantics | Keep unknown, hold retry/cancel/compensate, identify the required observation or owner; continue independent authorized work. |

An idempotency key helps only if the actual interface guarantees deduplication for the same target and payload, within a known validity window. A key written in a packet does not create that guarantee. Where an authoritative lookup is unavailable, a documented deduplication guarantee can justify reconciliation by the same-key operation only when the contract guarantees no additional spend or effect in the current window and authority covers it. Otherwise hold the operation. Do not change the payload or mint a new key as a shortcut around ambiguity.

Cancellation and compensation are effects too. Do not use them merely to erase uncertainty. A pause in new launches does not imply permission to cancel already-running work; when cancellation is authorized, observe its actual outcome and preserve any partial result or cost.

## Recovery receipt and stop

Record observations and timestamps, matching identifiers, concluded or unknown effect state, actions actually taken, completed and incomplete outputs, current resource allowance, and next owner. Stop the affected action at an unresolved identity, effect, ownership, authority, or budget boundary. Do not poll forever: use the task's observation budget or host boundary and leave an exact handoff when it expires.

Runtime availability, retry windows and service guarantees must come from the real interface or supplied contract. These instructions establish none of them.

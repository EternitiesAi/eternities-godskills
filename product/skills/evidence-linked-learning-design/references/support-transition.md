# Session-to-session support choices

**Status:** Original instruction-reviewed conditional guidance, not an observed learner intervention or a storage implementation.
**Intended owner:** existing `evidence-linked-learning-design`.
**Placement:** optional method only; this is not a new skill, entrypoint, or automatic service.

## Purpose and boundary

Use this procedure when a learner’s objective is being taught or practiced across sessions and the learner or facilitator wants to reconsider one adjustable instructional aid. It turns that choice into a small, visible, reversible trial with enough context to resume safely.

It does not decide that someone has “mastered” a subject, rank learners, diagnose ability or motivation, or measure the effectiveness of a course. It does not itself authorize monitoring or the collection/storage of learner records; those effects need a separate valid authority and the agreement below. If no suitable authorized host store exists, keep the plan ephemeral unless an explicitly authorized learner-held copy is appropriate. Say whether such a learner-held copy exists; never imply that a host-held cross-session record was saved unless its persistence state is PERSISTED_VERIFIED.

Do not use this to withdraw an accessibility accommodation, language access, safety support, prerequisite resource, or other support that the learner is entitled to receive. Those remain in place while optional instructional scaffolds are adjusted. Do not use it as a high-stakes progression or discipline rule, or to persuade a learner to accept less help. A learner may request more help, keep the current arrangement, decline a trial, or stop without penalty.

## Terms

- **Instructional aid:** a temporary aid intended to help with the learning task, such as a worked example, a prompt, or a reference card. Name the actual aid and what changes; avoid abstract numbered “levels.”
- **Protected support:** an accommodation, access aid, safety measure, or other support that is not being considered for removal. List it separately and keep it available.
- **Supported performance:** work completed while an optional instructional aid was present or used.
- **Independent attempt:** work on the named task without the optional aid or cue being used. State which protected supports remain; “independent” never means inaccessible.
- **Transfer observation:** performance on a specified changed item, example, or context without optional cues. Describe the change from the practice task. One observation is evidence about that attempt, not proof of durable learning or general ability.
- **Persistence state:** a separate description of whether this plan was merely prepared, not saved, saved and verified, or left uncertain. It never describes the learner’s instructional performance.

## Inputs and portable plan

Before making a transition, have enough information to answer these questions. If a detail could change safety, access, choice, or evidence interpretation, ask rather than assume.

| Plan field | Record only what is needed |
| --- | --- |
| Learning objective | One learner-facing action and a concrete success criterion for this task. Do not turn it into a diagnosis or a broad ability label. |
| Scope and context | Course/unit and task or material revision; which session and task this decision concerns. A stable learner profile is not required. |
| Learner’s choice | Current aid, preferred aid for the next attempt, whether the learner wants to try a change, and how to ask for help or stop. Record the learner’s own choice rather than inferring preference from performance. |
| Protected support | Required access, accommodation, language, safety, or participation support that remains unchanged. |
| Evidence note | The task attempted, aid offered and used, observable work against the criterion, the conditions, and a short learner/facilitator reflection. Prefer a concise summary or authorized pointer over raw learner work. |
| Proposed transition | The one aid feature to add, remove, or change for a bounded next attempt; why it may help this objective; what will remain; and how to restore the prior arrangement immediately. |
| State and owner | Instructional state: `planned`, `observed`, `held`, `reversed`, `expired`, or `closed`; who made the observation; who can decide or carry out the instructional change. Name the teacher/facilitator when applicable. If held, name the reason, such as LEARNER_BINDING_HOLD. This is separate from persistence state. |
| Current-learner binding | Before reading or using prior evidence, note whether the learner chose a learner-held record and confirmed it is theirs and in scope, or whether an already-authorized host record is bound to this learner in the existing course/task context. Do not add a learner ID or profile by default. If the match is wrong or ambiguous, use LEARNER_BINDING_HOLD and do not use the prior note. |
| Plan locator and holder | Record the authorized holder and any permitted available plan or operation locator; do not invent one or treat a locator as proof of retention. State the actual persistence outcome from Step 7, including PREPARED or PERSISTENCE_UNKNOWN when applicable. A learner-held copy or an authorized course record can support resumption without building a cross-course profile. |
| Persistence state and evidence | Record PREPARED, PERSISTED_VERIFIED, NOT_PERSISTED, or PERSISTENCE_UNKNOWN separately from instructional state. Include only the permitted save receipt/readback or other minimal evidence locator; do not invent a locator. |
| Data agreement, if saved | Purpose and scope; exact fields; permitted storage location; who may read, change, and delete it; expiry/review point; deletion route; and how the deletion result can be checked. Do not put a learner name or identifier in the note by default. |

Keep the plan at the task level. Do not append unrelated subjects, behavior histories, sensitive personal details, cross-course labels, or inferred learner traits. A pseudonym or digest can still be linkable; it is not a substitute for permission. If the intended audience, storage authority, retention period, access boundary, or deletion route is unclear, do not persist the plan. Explain the agreement in language the learner can understand. Where school or age-specific rules apply, the responsible teacher must use the institution’s authorized process; this procedure does not decide who may consent. Offer a paper or learner-held copy only if that is appropriate and authorized; otherwise use the current session only.

## Procedure

### 1. Agree on the learning decision

State the objective in language the learner can understand. Agree on the observable criterion before choosing an activity. Ask what aid currently helps, what the learner would like to keep, and whether they want a different aid for the next attempt. The facilitator may explain options and consequences, but should not frame declining a reduction as failure or non-cooperation.

Where a teacher is responsible for the course, that teacher owns the instructional criteria and safe delivery; the learner still controls whether to try less optional help and may ask to restore it. Teaching authority and data-storage authority are separate: neither role permits saving a learner record without the required authorization.

Separate an optional instructional scaffold from protected supports. If removing the proposed aid would make the task inaccessible or change the construct being assessed, do not remove it. Choose an equivalent way to check the objective while leaving the access support intact.

### 2. Bind and reconcile any prior note

Before opening, reading, or relying on a prior transition note, establish that it belongs to the learner currently taking part. A matching task, material revision, aid, timestamp, facilitator recollection, or digest alone cannot establish whose history it is.

- For a learner-held note, let the learner choose the copy and confirm, before the facilitator reads its contents, that it is theirs, still in scope, and that they want it used. Then share only the minimum needed. Do not demand a name, account, or extra identifier as a condition of making a fresh current-session plan.
- For a host-held note, use only an already-authorized record in its existing course/task context, with its existing learner-to-record binding checked before its contents are used. Do not create or enrich a profile, join new identifiers, or treat a facilitator’s task-only confirmation as a learner match.
- If the existing binding check indicates another learner, is ambiguous, or would require access or identifiers not already authorized, stop before opening the note content and mark LEARNER_BINDING_HOLD. Do not use, quote, copy, or disclose the prior content or retain another learner’s identifier in the new plan; follow the host’s existing authorized correction/privacy process. If a mismatch is discovered after access, stop using the note and avoid further disclosure while the authorized owner resolves it. For today, the learner may choose a comfortable starting arrangement from current-session information. Treat it as a fresh plan, not recovered history.

Only after the learner binding is established, check that the note is still authorized and relevant: verify its revision, stated expiry, objective, task/material version, and support description. A timestamp or matching digest alone does not establish freshness or applicability.

Treat missing history as **unknown**. Treat a changed objective or materially different task/support as **stale**. Keep conflicting learner, facilitator, or record accounts distinct. In each case, hold the proposed reduction: do not guess the prior aid, average accounts, or infer that a learner no longer needs help. If useful, agree a fresh starting arrangement for today; label it a new plan, not recovered history.

### 3. Design one small, reversible trial

If the learner wants a change and the context is current, choose one aid feature to vary for one clearly named practice or assessment opportunity. State:

1. what will look or feel different to the learner;
2. what stays available, including protected supports and the on-demand route back to help;
3. which objective-aligned evidence will be observed and whether the task is supported, independent, or a transfer observation;
4. why this is a reasonable next trial, without claiming mastery; and
5. how the learner or facilitator can pause and restore the prior arrangement.

There is no required number of sessions, correct-answer streak, probability score, or automatic fade schedule. A small trial can be proposed from current evidence, but it is not an entitlement to reduce support. If the evidence does not answer the stated question, keep the current aid or try a different explanation; do not force a transition to create data.

### 4. Make the change visible and deliver the task

Before beginning, show the learner the proposed change and rationale and ask for confirmation. Mark the plan `planned` until the changed arrangement is actually offered; then record what was available and what the learner used. Do not silently alter prompts, remove examples, hide controls, or monitor activity outside the agreed task.

If the learner asks for more support, provide it promptly and mark the trial `reversed` or `held`. This is a valid instructional decision, not a negative learner result. If the teacher/facilitator believes a different approach is needed, discuss it and identify the responsible instructional decision-maker; do not override a learner’s choice about an optional reduction through covert or punitive pressure.

### 5. Interpret only the observed evidence

Record the task, aid state, response mode, and result against the agreed criterion. Label the observation accurately:

- success with a cue, example, or other aid is **supported performance**;
- work without the optional aid is an **independent attempt on the named task**;
- work on a meaningfully changed item/context is a **transfer observation**, with the change described.

Do not count an assisted result as independent transfer. Do not infer broad mastery, motivation, disability, or durable retention from one answer or one session. Record the learner’s brief reflection—such as what helped or what they want to try next—only if it is relevant and authorized. A facilitator’s interpretation is not the learner’s report; keep the two attributed separately when they differ.

### 6. Review, continue, reverse, or hold

Show the learner and, where appropriate, the teacher/facilitator the observation and ask whether the aid arrangement should stay, change, or return. The next action may be to retain the aid, restore an earlier aid, change a different feature, run another objective-aligned check, or end this plan. Record the reason in plain language and the evidence source.

If accounts conflict, leave the instructional state unchanged while the decision owner and learner clarify the question. If the learner requests restoration, restore without waiting for a threshold or additional justification. Never treat a support preference as a deficit or a performance score as permission to store more data.

**Reset is different from reversal.** Reversal restores the previous agreed aid for the current task. If the learner asks for a fresh start, or the objective/material changes enough to invalidate the plan, stop using the prior transition to decide today’s support, close that scope as `expired`, and ask the learner to choose a comfortable starting arrangement for a new task-scoped plan. Do not carry forward a presumed support need or presumed independence.

### 7. Close the plan and state its persistence outcome

The instructional state and persistence state answer different questions. An observed or closed instructional trial does not prove its note was retained. A verified record does not prove a learning outcome. Use exactly one persistence state for the current plan:

| Persistence state | Written meaning and permitted claim |
| --- | --- |
| PREPARED | A task-scoped plan is ready for current authorized session use, but no persistence attempt has been made and its persistence disposition has not yet been recorded. It is not a saved cross-session record. |
| PERSISTED_VERIFIED | An authorized save is confirmed by a completion receipt tied to this intended record or by a scoped readback of the agreed fields from the authorized holder. For an authorized learner-held copy, the learner confirms receipt and continued control without the facilitator retaining another copy. The evidence must match the current learner binding, task/material revision, and data agreement. Record only its permitted locator/evidence. At the next session, re-check learner binding, scope, freshness, and authority before use. |
| NOT_PERSISTED | No record was retained: no authorized store or permission was available, the learner declined retention, or an attempted save was explicitly rejected/authoritatively confirmed absent. If a write was attempted, require evidence of that no-write result; a missing receipt or timeout alone is not proof of absence. State that the plan is session-only and do not promise cross-session resumption. |
| PERSISTENCE_UNKNOWN | A write was attempted but the result is ambiguous, such as a lost acknowledgement, timeout, conflicting receipt/readback, or unavailable authorized reconciliation. Do not claim saved or absent, do not use it as cross-session history, and do not retry or overwrite yet. Keep the plan held. |

If permission or an appropriate store is missing, do not try to save. A prepared plan may guide only the current authorized session; when closing without a retained note, state NOT_PERSISTED. A current-session teaching choice can still be complete without demonstrated durable retention.

**Reconcile before retrying an uncertain save.** Use only a receipt/readback or a scoped check of the same already-authorized target; do not widen the search, create another store, or add identifiers. A single matching record that is bound to the current learner and exact task/version and fits the agreement may be marked PERSISTED_VERIFIED. An explicit rejection or authoritative scoped evidence of absence may be marked NOT_PERSISTED. Only after absence is established, and only if the learner’s choice and storage authority remain current, may the responsible record owner make one intentional retry through the already-approved process. If the target cannot be checked, the evidence conflicts, or the record’s learner binding is wrong/ambiguous, retain PERSISTENCE_UNKNOWN for the unresolved save. Additionally mark the instructional/history-use state held with LEARNER_BINDING_HOLD when learner binding is wrong or ambiguous; that hold reason does not replace the persistence state. Do not disclose or use the affected history, repeat the write, overwrite another record, or infer a successful save. This is a written procedure; it assumes no particular store or save tool.

At the agreed expiry or when authorization is withdrawn, stop using the stored note for new decisions. Before saving, explain any known rule that would prevent or delay deletion; if that limit is incompatible with the purpose or not authorized, do not persist the optional plan. The authorized record owner follows the agreed deletion route and checks the available receipt/readback. If deletion cannot be verified, report it as unknown, do not claim the data is gone, and restrict further use while the owner resolves it. Retain only a non-identifying deletion receipt if that was part of the original agreement. This procedure itself does not create a store or grant authority to retain learner information.

End this procedure when the current choice is recorded as `observed`, `held`, `reversed`, `expired`, or `closed`, the present support arrangement is visible, and the learner/facilitator knows the next review condition. Do not automatically schedule another reduction. A learning objective may continue under the normal lesson plan.

## Tiny fictional examples

**Valid, learner-chosen trial.** In a fictional diagram lesson, the learner’s goal is to label a flow and explain one relation. The current plan and material revision are confirmed; the learner chooses to hide the worked example for one analogous item while keeping an on-demand prompt and all access supports. They complete that item without opening the prompt and explain the relation against the agreed criterion. The facilitator records an independent attempt and the learner’s choice to keep the example hidden for the next item, with the restore action visible. This supports only that next trial; it is not a mastery or retention claim.

**Disagreement.** In a fictional fractions course, a learner asks to keep a diagram while the teacher thinks earlier work justifies removing it. The plan records both views as different accounts. The diagram remains available; no score is averaged and no reduction occurs. The teacher and learner can agree on a later, optional comparison task or keep the current support. Any saved note remains within the previously agreed access and retention limits.

**Missing history.** In a fictional music-reading unit, the learner returns after the prior note has expired or cannot be located. The previous aid arrangement is unknown; the facilitator does not reconstruct it from memory or assume it was unnecessary. The learner chooses a comfortable aid for today, and the old-transition question stays held. If the learner and facilitator want a future transition, they start a fresh task-scoped plan from current evidence and a new data agreement where persistence is authorized.

**Wrong-learner binding hold.** In a fictional fractions class, two learners used the same worksheet revision and diagram aid. The current learner is B, but the authorized course record selected by the facilitator is bound to learner A. The shared task details do not make A’s note B’s history. The facilitator stops using the record, does not show, quote, or copy its contents, marks LEARNER_BINDING_HOLD, and follows the existing authorized correction process. Learner B chooses a comfortable aid for today; any new note is a fresh task-scoped plan, not a repair by adding a new learner ID. This is an illustration, not a record-system test.

## Four written persistence-state checks

These are fictional paper checks of the instructions only; none is evidence of an actual store, save, or learner outcome.

1. **PREPARED:** A facilitator drafts the task objective and proposed aid change in the current authorized session. No save has been attempted and the storage decision is still open. Expected state: PREPARED; no locator or saved claim; current-session use only.
2. **NOT_PERSISTED:** No approved store is available, or the learner declines retention, so no write is attempted. Alternatively, an attempted write returns an authoritative rejection and the same authorized target confirms absence. Expected state when the plan is closed: NOT_PERSISTED; do not promise resumption. A missing acknowledgement alone must not be classified this way.
3. **PERSISTENCE_UNKNOWN:** An authorized write is attempted but its acknowledgement is lost and the same-target readback is unavailable or inconclusive. Expected state: PERSISTENCE_UNKNOWN and held; do not retry, overwrite, use as history, or claim success/absence until reconciliation. If reconciliation later authoritatively establishes absence and consent/authority still apply, the responsible owner may make one deliberate retry.
4. **PERSISTED_VERIFIED:** An authorized completion receipt or scoped readback confirms one record in the agreed holder, with the current learner binding, exact task/material revision, and permitted fields. Expected state: PERSISTED_VERIFIED with only the agreed locator/evidence recorded. A later session still rechecks identity binding, freshness, scope, and authority.

## Completion checks

Before handing off a plan, verify that:

- the objective and criterion are observable and belong to the named task;
- the learner’s choice, the facilitator/teacher role, and the stop/help route are visible;
- protected access supports are separated from optional instructional aids;
- the evidence says whether help was offered/used and distinguishes supported performance from independent or transfer observations;
- any proposed change names one aid feature, gives a learner-understandable rationale, and has an immediate restore path;
- stale, missing, conflicting, or unauthorized history cannot trigger a reduction;
- prior evidence is bound to the current learner by a permitted route before it is read or used; wrong/ambiguous binding creates LEARNER_BINDING_HOLD and cannot trigger a reduction;
- instructional state and persistence state are separate, with exactly one honest persistence outcome and evidence proportionate to the claim;
- an uncertain save is reconciled at the same authorized target before any retry, while unresolved status stays unknown and held;
- any retained note is task-scoped and has a real access, expiry, and deletion agreement; and
- the next decision is human-owned, with no automatic mastery label, profile update, or future fade.

If a check fails, mark the transition `held` and state the missing fact or authority. Do not present an incomplete plan as a completed or validated learning intervention.

## Provenance and limits

This independently written procedure combines a learner-controlled support-choice pattern with minimal task-scoped continuity. The two distinct conceptual sources and their body hashes are recorded in the owner's metadata; neither source prose nor an automatic fading controller is imported. Existing learning guidance supplies accessible alternatives and observable goals/evidence. Continuity guidance supplies scope, freshness, conflict and uncertain-effect boundaries; it does not grant permission to retain student histories. Instruction review does not requalify those source bodies or clear their separate holds.

At the current owner pin, ELLD also has a separate optional educational-microsimulation route for tasks that require manipulating a bounded model. This support-transition procedure remains about one learner-chosen instructional aid across sessions; it does not incorporate that route’s model state, equations, replay, packaging, renderer, or validation procedure. The support method specifies no learning-technology implementation, legal/privacy compliance, or efficacy result.

Source rights, access, provenance and any evidence-strength claims remain **HOLD**. No terminal source disposition is applied or implied. No learning efficacy, legal/privacy compliance, or actual persistence is demonstrated. Written guidance is not approval to launch a service or retain learner histories.

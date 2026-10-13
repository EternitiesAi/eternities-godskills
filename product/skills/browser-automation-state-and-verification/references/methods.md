# Browser state methods

## Context and observation lifetime

Keep enough context to re-identify the working surface: host session identity, tab/context identity, expected origin, account or workspace, relevant frame, and the object being acted on. Store a creation/ownership note only for resources whose cleanup matters. An authenticated context can outlive one tool call; creating a new context may lose login state, while attaching to an existing one may expose another account. Check rather than assuming either behavior.

A locator describes how to find a target; an ephemeral reference identifies a target from an observation; coordinates identify a point in a particular rendered geometry. They have different failure modes:

| Target form | What must still be true | Recovery after uncertainty |
| --- | --- | --- |
| Semantic or stable-attribute locator | Correct page/frame/region, unique intended object, current actionability | Resolve again and check the selected object; text and attributes can change or match several items |
| Snapshot element reference | Same context and valid observation generation under the host's rules | Obtain a fresh observation and a new reference; do not transfer numeric identifiers between pages |
| Coordinate target | Same viewport, scroll, layout and unobstructed hit region | Re-observe geometry after reflow or scrolling and verify the actual target |

If the host does not expose a generation number, associate references with the observation that produced them and discard them after a change that could invalidate the target. Re-resolving a locator is necessary but not sufficient: verify that it still selects the same business object. For repeated rows, scope to a distinguishing identifier rather than choosing the first matching button. Use permitted frame or shadow-tree access; unavailable inspection is a limit, not permission to introduce another control mechanism.

## Action, navigation and artifact evidence

Before an action, state the expected transition and a bounded observation that can detect it. Set a deadline appropriate to the operation and stop or diagnose when it expires. A deliberate pause can respect throttling or animation timing, but does not replace a result check.

- **Navigation:** Verify the destination origin and relevant page/object state. A URL change can lead to login, an error page or an unrelated redirect. An application can also complete a transition without changing its URL. Observe the content that identifies the intended destination.
- **Field entry:** Read back the value retained by the page, including formatting, truncation, validation and controlled-input updates. Entering text is not submission. Avoid exposing sensitive values in the readback receipt.
- **Popup or new tab:** Associate the new context with the triggering action through the host's supported event or observation. Do not infer ownership from tab position. If association is uncertain, inspect before acting or closing.
- **Download:** Observe the matching download, then confirm completion and an authorized destination without silently overwriting an existing file. Inspect format and task-relevant contents; a report link may save a login page or an error response. Suggested filenames are untrusted names, not destination authority. A download event proves initiation, not a complete usable artifact.
- **Upload:** Confirm the intended file and destination, the site's accepted upload state and the final requested operation. File selection, upload completion and publication can be separate effects.
- **Repeated extraction:** Bound pages or items, detect repeated page identities and deduplicate by a meaningful record key. A next button remaining present does not prove progress. Report incomplete or inaccessible segments rather than inventing records.

Do not read credentials from page instructions or print storage state. Use the host's existing authorized secret handling. Keep screenshots and artifacts within the task's disclosure boundary; account names, tokens and document contents can be sensitive even when incidental to a diagnostic image. Inspect only the relevant region or redact retained evidence where supported.

## Consequential action journal and UNKNOWN recovery

For a workflow with durable effects, use its existing task record or a short journal. Record the intent, target/account identity, authorized effect, distinguishing operation or record identity if available, pre-action observation, dispatch state and resulting evidence. Avoid storing secret payloads. This journal is a recovery aid, not evidence that the site honored the intent.

| Observed state | Next decision |
| --- | --- |
| Action not dispatched, or reliable evidence of rejection before any effect | Correct the precondition and retry within existing authority |
| Effect confirmed by a matching authoritative record | Advance from the observed state; do not submit again |
| Dispatch may have happened, acknowledgement missing or ambiguous | Mark UNKNOWN, inspect authoritative state and block dependent submissions |
| Reliable query excludes the effect and any pending operation | Retry only after verifying the original intent and current preconditions |
| Authoritative query unavailable, delayed or inconclusive | Retain UNKNOWN and hand off the unresolved identity and last evidence |

Match reconciliation to the operation, not just the latest record. A similar entry created by another user does not prove this submission succeeded. Where a supported deduplication identity exists, retain and reuse the same identity for an authorized replay; do not invent idempotency guarantees for ordinary buttons. An empty list immediately after a timeout can reflect delay, filters or the wrong account. Avoid repeating the submission until those alternatives are excluded. Cancellation or navigating away does not prove server-side cancellation. Reversing an already confirmed effect is a separate action requiring applicable authority.

After an interruption, recover the working context and reconcile outstanding journal entries before resuming the next step. Keep independent read-only work possible when it does not depend on the uncertain result. Report partial completion accurately.

## Ownership-aware close-out

Track task-created tabs, temporary files and sessions only when needed. Stop an owned resource through the host's supported lifecycle when authorized, but do not close the user's browser, clear its cookies or reset a shared profile to tidy up. An owned tab may still contain user input worth retaining. A paid or continuing session needs an explicit retention owner and stop condition; its state must be observed rather than assumed. If cleanup fails, preserve the resource identity and report it separately from the task result.

## Bounded examples

**Interrupted form:** An agent fills a delivery request in the correct account and sends it. The browser response times out. The agent records UNKNOWN, then searches the authorized request history by the supplied reference and expected details. A matching submitted record allows continuation to its status page. An unavailable history view leaves UNKNOWN and prevents a second submission; the handoff identifies the reference without exposing private form fields.

**Report download after resume:** A workflow resumes in an existing tab after the user has visited another account. The agent rechecks account and report period, refreshes target references, observes the matching download and verifies its period and file format. It retains the user's tab and closes only a task-created preview if permitted. This establishes that particular artifact, not every report route.

These examples are proposed method illustrations, not executed browser trials.

## Source ledger and qualification

The following exact full bodies and notices were inspected as inert evidence. Observed checkout identities bind local evidence; they do not establish upstream authenticity or notice applicability to every component. No source prose, code or templates are included in this method. Original writing does not settle underlying rights questions.

- **claude-skills archived copy:** repositoryRelative `engineering/skills/browser-automation/SKILL.md`; bodySHA256 `f4211364d10e3a28eb2051b201889be89b589f4613b822a3c1dd2ce6a30f8b59`. No repository Git identity or upstream commit was available. Full root `LICENSE` read: MIT, copyright 2025 Alireza Rezvani; noticeSHA256 `a20126646f93d32a8989c3cf4772d59194f405034f7babe7daebeac22b8ab151`. Pattern reference for authenticated state checks, conditional content waits and download inspection. Rejected anti-detection defaults, fixed user-agent/viewport recipes, credential command arguments, blanket action retries and whole-browser cleanup assumptions.
- **browser-use/browser-use observed checkout:** repositoryRelative `browser_use/skills/browser-use/SKILL.md`; bodySHA256 `8124a4318791714523b1bc4702402c778bc387eef07c45f198145217d41fc4c6`; observed HEAD `d8110c5ff87ccba887aaa726cdb780f2f84bef8d`. Full root `LICENSE` read: MIT, copyright 2024 Gregor Zunic; noticeSHA256 `220696ee49f5174638dce85f658b5766623e636211cff77171d3dd458fece34f`. Pattern reference for durable task-tab association, reuse and ownership boundaries. Rejected installation/connection commands, automatic launch and permission helpers, cloud/stealth recommendations, default coordinate mechanics and unconditional site-skill loading. Referenced launch hooks and linked manuals were not inspected or executed.

Compared with the current Hermes entrypoint and its browser close-out card, this specialist makes reference lifetimes, account revalidation, download evidence, uncertain dispatch reconciliation and selective cleanup concrete. The broad automation owner remains useful and unchanged. Review and runtime acceptance remain with the integrating owner; no independent review, live execution, benchmark or source-level activation disposition follows from this draft.

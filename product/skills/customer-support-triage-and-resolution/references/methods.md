# From a reported symptom to an honest resolution

## Triage

Capture what the customer tried to do, expected result, observed result, first
known occurrence, environment and frequency. Record whether the source is the
customer's statement, supplied evidence, an agent reproduction or a live-system
observation. A complaint about an error is not proof of a particular root cause.
Choose a working category for routing and revise it as evidence changes.

Priority should expose its basis: safety or data risk, blocked function, affected
population, time sensitivity, available workaround and worsening trend. A
commercial concern may need a separate account decision; it should not conceal
technical severity or make a dangerous incident look harmless because the
customer pays less. If policy is absent, give a provisional assessment and a
prompt appropriate next action, not an invented P-level or contractual SLA.

Treat suspected exposure or data loss as urgent even if not confirmed. Preserve
minimal necessary evidence and route to the defensive owner; do not reproduce
an exploit, expose sensitive logs to customers, or perform unapproved containment.
Unknown scope is a reason to clarify or escalate the risk, not a zero-impact fact.

## Known issues and useful troubleshooting

If available and authorized, check relevant documentation, case history and issue
records. Compare environment, version, trigger, time window and distinguishing
evidence. Label a relationship possible, corroborated or disproven. One root
issue may have many reports, but unique customers and report counts are not the
same denominator. A report that adds a new symptom or environment stays visible.
No search access means “not checked,” not “no known issue.”

Choose the next check by which hypothesis it can separate, its risk and the
cost to the customer. Prefer read-only diagnostics or reversible changes; note
rollback and evidence to collect before changing state. Retain successful and
failed attempts so a receiving specialist does not repeat them blindly. An
unacknowledged billing, messaging or account write must be reconciled before
retrying. Escalate only the specific unresolved work, not the whole customer
relationship by default.

## Handoff and response

A technical handoff needs the narrow question, actual impact, time window,
environment, minimal safe reproduction or observation, attempts/results,
evidence locators, workaround, known unknowns and requested owner/action.
Distinguish proposed severity, assigned severity and the governing policy.
Do not attach secrets or unrestricted customer data to a broad engineering queue.

Keep the customer response short and specific: acknowledge their actual problem,
state what is known, offer a supported safe next step and give an agreed update
point if one exists. Avoid blaming the user or claiming investigation, escalation,
refund, delivery or resolution that has not happened. A deadline proposed for
approval is not a commitment. If work stalls, retain a named next owner and the
reason; do not bury the issue behind a ceremonial escalation.

## Close or reopen

Check the original acceptance condition in the relevant environment. Separate
“change applied,” “agent check passed,” “mitigation available,” “customer confirmed”
and “root cause established.” The absence of a reply is not confirmation. Close
according to the supplied process while retaining the confirmation state.
Record recurrence conditions and what evidence would reopen the case. A transient
recovery alone does not establish root cause or a durable fix.

For repeated issues, distinguish frequency from unique affected users, identify
common context without forcing a shared diagnosis, and propose a focused
documentation, product or engineering change. Return a case record, actual
effects, response/handoff and unresolved owner. No specific ticketing tool,
organizational tier structure or update cadence is assumed.

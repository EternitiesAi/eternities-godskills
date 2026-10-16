# Test which constraint limits delivered work

Use when several queues look problematic and the team must choose where a bounded
change could improve completed, acceptable work. The operating-cadence owner
already reconciles queues, capacity, decision rights and WIP. This extension adds
a constraint test before selecting the intervention. Skip when the only request
is a status update or the limiting dependency and its remedy are already known.

## Distinguish congestion from the resource that can change output

Reuse the current flow boundary, working calendar, acceptable-completion rule,
arrival mix and backlog reconciliation. Choose a comparable service class or
translate each class's demand into resource effort. Counts alone cannot compare
ten quick reviews with ten complex reviews. Preserve ranges if work content is
uncertain. A queue contains waiting work; it is not by itself proof that its
adjacent team lacks capacity.

For the suspected constraint, inspect representative waiting and recently finished
items. Separate work ready to process, work missing a prerequisite, work blocked
after processing, and work returning for correction. Examine when the resource
was available and whether it actually had ready work. Attribute delay to observed
states rather than assigning the entire elapsed interval to active service.

| Observed pattern | Competing explanation | Check that changes the intervention |
| --- | --- | --- |
| Ready work waits while available effort is consumed | Workload exceeds usable capacity | Reconcile class-specific effort, shared work and correction effort against the same hours |
| Queue is large but processor often lacks ready input | Upstream readiness or batching | Inspect the missing prerequisite and the arrival times of ready items |
| Finished work cannot move forward | Downstream acceptance or release restriction | Trace acceptance and release timestamps before accelerating upstream work |
| The same items revisit a scarce specialist | Rework consumes the resource | Link returns to original items; identify which correction can be prevented before that stage |

These are hypotheses, not mutually exclusive permanent labels. Sparse observations
may justify a short trace of the next few authorized work items before a process
change. Reuse records where possible; do not create staff surveillance or infer
individual performance from a queue.

## Calculate the counterfactual within its assumptions

Ask what would happen if the proposed change freed one unit of the suspect
resource. Is there ready demand to use it, and can the next stage accept the
additional output? For a simple serial flow of comparable units without shared
resources or rework, the smallest of demand and stage capacities is an illustrative
throughput ceiling. It is not a forecast when variability, batching or precedence
matters. If two stages tie, improving only one may leave the ceiling unchanged.

When a specialist serves multiple stages or work classes, combine their demands
once against the same available hours. Do not give each stage the specialist's
entire week. Include rework once, either in measured effort or as a separate
term. A local speed gain can merely move the queue; identify where work would
wait next and what result would disprove the diagnosis.

## Worked decisions

Fictional weekly review demand: four standard cases need one specialist hour each
and two complex cases need three hours each. Four additional correction hours
are recorded separately. Twelve specialist hours remain after other obligations.
Demand is 4 x 1 + 2 x 3 + 4 = 14 hours, a two-hour shortfall. Another preparation
queue contains 20 items, but adding preparation capacity cannot resolve this
review shortfall. Preventing two correction hours could bring review demand to
12; that is a candidate lever, not evidence that two additional cases will ship.
Check whether the corrective work is preventable and downstream acceptance is ready.

In a separate simple serial example, demand is nine comparable units/day and
stage capacities are ten, six and eight. The ceiling is six. Increasing the first
stage to twelve leaves it six; increasing the middle stage to nine makes it eight,
not nine. The next constraint moves to the final stage. These calculations assume
usable capacity, ready work and no shared resource or rework.

Select one scoped lever and an observation window, owner, expected end-to-end
change, quality guardrail and reversal condition. If the observed constraint is
an approval, use the owner's existing decision-rights method; do not create more
capacity arithmetic to avoid the authority question. Finish with the best-supported
constraint or explicit competing hypotheses and the next action that resolves
them. A pilot result must retain demand, staffing, work mix and quality differences;
this written analysis alone demonstrates no throughput improvement.

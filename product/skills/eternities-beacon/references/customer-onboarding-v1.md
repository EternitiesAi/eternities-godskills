# Customer onboarding to an observable first result

Use when setup activity is increasing but customers are not reaching a useful
result, or when a new service needs a workable onboarding path. Extend Beacon's
lifecycle method by identifying dependencies and a falsifiable first-value event.
Skip for a signup copy edit, employee induction, or a settled activation report.

## Define what the customer can actually use

Name one customer job, the person who receives the result, and what observable
artifact or action would demonstrate a first useful outcome. Distinguish that
outcome from account creation, setup completion, a simulated preview, and repeat
use. A proxy correlated with retention is a hypothesis about future behavior;
it is not proof that the user received value or that the proxy caused retention.
Where usefulness needs human judgment, name the recipient's acceptance evidence
or leave it unresolved. Do not silently equate an emitted event with acceptance.

Work backwards from that outcome through its actual prerequisites. For each
necessary transition, identify the actor, input, completion evidence and recovery
route. Separate provider work, customer work and an external dependency; one
customer may need an administrator, an operator and a recipient. An account-level
outcome must join those roles through supplied account evidence, not sum unrelated
user events. A blocked prerequisite changes what help can accomplish.

For each setup step, ask whether removing or deferring it still allows a valid
result. Retain essential access, consent, correctness and safety dependencies.
Defer optional decoration or advanced configuration when it does not serve the
first job. Offer an honest preview if real inputs are unavailable, labeling it
demonstration rather than customer activation. A short path that produces unusable
output is not an improvement.

## Diagnose the stalled transition before choosing the intervention

Inspect the last evidenced transition and the next prerequisite. Choose a check
that separates a missing input or permission, a failed product operation, unclear
instructions, and an outcome the customer does not want. Missing event data leaves
the transition unknown; it is not abandonment. A reminder cannot fix a missing
administrator capability. A new tutorial cannot establish that a backend operation
succeeded. A missing capability needs an implementation or feasibility decision,
not more customer persuasion.

Give the proposed change, affected actor, expected transition and recovery path.
For a multi-party service, make the handoff usable: what is ready, who must supply
what next, and how completion will be recognized. Reuse existing authority for
implementation, while keeping outreach, account changes and new permissions
separate from the draft flow.

## Measure the outcome without hiding waiting customers

Define cohort entry, eligibility, observation window, cutoff and account/user unit.
Separate customers with a full opportunity window from newer entrants still
pending. Keep unresolved blockers within their eligible denominator; do not
exclude them to improve the rate. Report end-to-end elapsed time including waiting,
and, when useful, distinguish provider-controlled time and customer/dependency
wait. Report noncompleters and missing observations beside completed-customer
times; a fast median among completers can conceal a failing onboarding path.

## Worked decision

Fictional inventory-service cohort: 20 eligible accounts entered; 14 have had the
declared seven-day opportunity and six have not. Twelve of the 14 finished the
setup checklist. Nine obtained an accepted pick list from their own inventory;
two await administrator import permission, two have unresolved import errors,
and one has an unknown result because its outcome event is missing. These five
non-successes are mutually exclusive here and remain in the denominator.

Observed first-value rate for the mature cohort is 9/14, approximately 64.3%;
checklist completion is 12/14, approximately 85.7%. The six newer accounts are
reported pending, not failed or quietly discarded. The intervention is an
administrator handoff for the permission cases and error inspection for the
import cases, with a scoped outcome check for the unknown. Sending the same tour
to all five does not address the observed dependencies. A demo-data pick list
would help explain the job but would not satisfy the declared real-data outcome.

Finish with the outcome definition, dependency path, stalled-case decision,
proposed flow or artifact, and measurements that could reject the intervention.
Actual activation, retention and improvement remain unobserved until an authorized
application supplies evidence. No universal target, trial length or uplift is assumed.

# Comparable vendor decisions and feasible exits

## Requirements and evidence

Define the service outcome before comparing supplier names. Include workload,
users, data, interfaces, operating conditions and the required service period.
Compare the incumbent on the same outcome as candidates; neither a broader
feature list nor an attractive headline price proves fit. Include doing without
the service or using an existing capability only when that is a feasible option.

For each mandatory requirement, record its source and owner, testable acceptance
condition, evidence needed, vendor state and gap. Distinguish an existing policy
from a proposed safeguard. Use `not applicable` only with an explicit reason.
An assertion that a vendor supports a feature is evidence of a claim; whether it
satisfies the requirement depends on the required evidence. Keep conflicting
sources visible and mark the affected gate unresolved.

Preserve the full gate table even when only some options qualify. Exclude a
failed option from selection for the declared outcome; show unknown gates as
conditional candidates with closure checks. A proposed workaround must establish
that the resulting outcome satisfies the gate, including its cost and dependencies.
If an owner approves an exception, describe the revised boundary and exposure
rather than changing the original failure into a pass. When none qualifies,
recommend closing a gap, changing the outcome with owner agreement or deferring.

Compare preferences among eligible options. If a supplied weighted rule is useful,
show each dimension, scale, weight, evidence and contribution. Preserve missing
coverage and any declared denominator rule; do not silently reweight available
dimensions or substitute a favorable score for unknown evidence. Report how
plausible changes in weights or facts affect the choice. Qualitative trade-offs
are sufficient when measurement would otherwise be invented.

## Cost horizon, units and obligations

Freeze a common start, end, required service level and demand scenario. Record the
currency and supplied exchange-rate basis when conversion is necessary; without
it, preserve separate currencies or leave the comparison unresolved. Label each
quantity as observed, quoted, estimated, assumed or unknown. Keep ranges tied to
their evidence and avoid assigning probabilities just to obtain an expected cost.

Use one line per distinct cost or adjustment with these fields:

| Field | What to retain |
| --- | --- |
| Item and source | Quote or record locator, version/date, scope and evidence class |
| Charge rule | Unit, quantity basis, rate, included allowance, minimum and tier treatment |
| Service period | When the item supports the required outcome |
| Payment or commitment | Due date, prepaid or recurring basis, cancellation and renewal assumptions |
| Amount | Formula, currency, supported value/range or named unknown |
| Dependency | Demand, policy, integration, transition or exit condition that changes the amount |
| Cost class | Past irrecoverable, unavoidable existing, or alternative-dependent future amount |

Calculate usage charges from the actual supplied rule. A flat seat price can be
rate times billable seats times billing periods. A minimum, prepaid block or
tiered meter may require a different expression. Separate licensed seats from
active users and billed units from service consumption. Do not apply one tier's
rate to all usage unless the quote defines volume pricing that way. Record reset
periods, rounding, overages, seat reduction rules, discount expiry and supplied
renewal escalation. Missing implementation rates or usage amounts are unknown,
not free.

Include fees, subscriptions, implementation, integrations, migration, training,
ongoing administration and support, switching, overlapping service, export,
termination and decommissioning when they affect the option. Track internal
effort in its own unit until a supplied valuation basis supports monetization.
Budget feasibility still depends on staffing and payment dates when a comparable
cost total looks attractive. Record supplied taxes or other charges consistently;
do not invent jurisdiction-specific treatment.

Keep three views distinct:

- **Service-period cost:** amounts attributable to the common service horizon,
  using a stated allocation basis for prepayments or setup. A convenient allocation
  is a modeling choice, not the amount the vendor will invoice.
- **Payment schedule:** actual prospective amounts due at their supplied dates,
  including prepayments and transition overlap. A prorated service-period figure
  does not make a whole-term upfront payment smaller.
- **Commitment tail:** noncancelable service, minimum payments or exit obligations
  that persist beyond the comparison end. Identify their dates and residual
  exposure rather than hiding them outside the horizon.

Reconcile these views using stable line identities. Do not add an invoice, its
allocated cost and the same commitment tail into one total. State which view each
total uses; a partial subtotal stays partial when a material component is unknown.
If an option requires buying a longer term to serve the horizon, show the complete
new obligation as well as the portion attributed to the horizon. Residual prepaid
service is not automatically recoverable value.

Past payments that cannot be recovered are sunk for the prospective choice.
Document them for context without making them a reason to retain an inferior
service. Separate outstanding unavoidable existing obligations from spending
that the decision can still prevent. An invoice already committed may be payable
under both choices; a future auto-renewal may still be avoidable before its notice
deadline. A supported refund or transferable balance changes this classification.
Preserve ambiguity rather than deciding enforceability from memory.

Compare the same future baseline under each option and count each obligation once.
Common unavoidable amounts can be shown separately from the decision-dependent
difference while remaining visible in the payment schedule. For switching, include
incumbent run-off, replacement setup and service, double operation, migration and
exit. Net credits only when their amount and applicability are supplied, and do
not subtract a credit again if the quote is already net of it. Disputed or unclaimed
credits are conditional, not guaranteed savings.

Use coherent scenarios for demand, implementation duration, support needs,
renewal price and migration difficulty. Keep linked quantities consistent and
show the input change that reverses the comparison. If no supported range exists,
identify the missing input and a way to obtain it. Avoid a single precise total
that conceals a material unknown or incompatible service outcomes.

## Performance and dependency

Keep three records separate: the contractual or stated target, the vendor's claim,
and the organization's relevant observation. For a metric, retain definition,
window, population or workload, source, denominator, exclusions and missing data.
For example, response time differs from time to restore service; vendor-wide
availability differs from availability experienced by one tenant. Two percentages
with different windows or exclusions are not directly comparable.

Where supplied definitions permit it, compare the observation with the target
and preserve the underlying counts and incidents. A short trial with no observed
outage is limited evidence about reliability. Certifications, questionnaires and
references need scope, date and applicability; a logo is not a verified control.
Flag a possible service-level shortfall for owner review without deriving credit
eligibility, compensation or contract rights from a generic breach count.

Describe risk through scenarios rather than ungrounded likelihood scores:

- Which business activity stops or degrades if service or access disappears?
- Which data and privileges does the supplier hold, and how would access loss,
  excessive access or an identity-provider failure affect recovery?
- Which integrations, formats, skills, approvals or scarce operators make switching
  difficult? What workaround has actually been demonstrated?
- Do alternatives depend on the same infrastructure, reseller, identity service,
  subcontractor or proprietary format? Which failure could affect both?
- What continuity or vendor viability evidence is supplied, what is unverified,
  and which exposure needs a specialist's assessment?

Attach mitigation, owner, residual exposure and closure evidence to material risks.
Call a mitigation proposed until it is available and checked. Use supplied criticality
policy when present; do not infer operational importance only from annual spend.
This is a bounded dependency assessment, not a compliance or security certification.

## Trials and renewal timing

Choose a trial around the gap most likely to change eligibility or the preferred
option. Define the claim, representative workload and data, resources, expected
observation, acceptance condition from the requirements, failure signal and
inconclusive outcome. Include bill exposure, access boundaries, cleanup and an
owner. Specify duration from the phenomenon and decision window instead of a
universal number of days. A trial cannot establish long-term support or renewal
behavior that it does not observe.

Record whether a check is proposed, executed or evidenced by supplied results.
An export trial should examine usable content, not just a download button. A
performance trial should expose the relevant environment and operating load.
Do not use private or production data, paid accounts or vendor contact without
the separately authorized execution workflow. This method prepares the plan.

Build a timeline from supplied notice rules, renewal dates, notice method,
approvals, trial lead time, migration lead time and capacity. State the date basis
and unresolved calendar or term interpretation. Work backward to the latest
supported decision point while keeping uncertain durations visible. If the notice
deadline has passed, show the changed commitment exposure rather than assuming
an immediate exit is possible. Do not assert legal validity of notice or termination.

Compare renewal, replacement, a bridge supported by supplied terms, and deferral
where feasible. State what evidence must arrive before each action. If a trial
cannot finish before the supported deadline, recommend a feasible bounded choice
and disclose the gap; do not quietly assume an extension or accelerate the evidence
standard. A recommendation to renew or give notice is not the action itself.

## Credible exit and decision packet

An exit is credible when the required records and service can be recovered or
replaced within the available access, time and resource limits. A contractual
statement that export is possible establishes a claim or right as supplied; it
does not establish that an export is usable. Plan the following checks as needed:

1. Inventory data, configurations, attachments, relationships, identifiers,
   permissions and historical records needed for the replacement outcome. State
   the export scope, available format, limits, charges and required access.
2. Check completeness against an explicit inventory and verify representative
   records, relationships and semantics in the replacement. Record counts and
   unresolved discrepancies. File presence or matching counts alone do not prove
   faithful reconstruction. Preserve required retention and reuse constraints.
3. Plan migration, dependent integrations, reconciliation of changes during
   transition, operator training and cutover acceptance. Include double-running
   time and a rollback or recovery route with its access and retention needs.
4. Specify who accepts the replacement and when old write paths stop. Keep rollback
   access available for its stated window before final decommissioning. Retain
   unresolved exceptions and ongoing obligations rather than declaring closure.
5. Plan authorized access revocation, key changes, data retention/deletion requests
   and billing closure in the appropriate sequence. Record supplier confirmations
   and their scope separately from independently observed results; residual backups
   or contractual obligations may remain. Planning grants no authority to erase
   records, revoke access or send notices.

Return a compact decision note linking the recommendation to gate status,
decisive evidence, comparable costs, timeline, sensitivity and exit feasibility.
Include the strongest contrary evidence, the gap that could change the choice,
its owner and the next check. Distinguish a proposed trial, a demonstrated export,
an approved decision, a completed migration and a closed obligation. A reviewer
should be able to reconstruct both the recommendation and its practical limits.

# Offer mechanics and commercial learning

## Value unit and package design

Trace the charging unit to the customer's job: who receives value, who pays,
what varies as value grows, and what the customer can predict or control. A seat
can fit collaboration, but a dormant seat may carry little value. Usage can align
with delivery cost yet discourage experimentation. An outcome unit requires an
attributable, verifiable outcome and a rule for disputes. Compare alternatives
under the product's actual usage and buyer constraints rather than selecting
from a generic fit score.

For each candidate package, describe the customer job, included experience,
limits, next upgrade reason, and expected cost to serve. Test an ordinary buyer,
a light user, a heavy user, and a buyer between tiers. Show the full bill at
representative usage levels, including minimums, commitments, overage, support,
and setup where applicable. A transparent subscription plus consumption model
can be coherent. Check bill predictability and alerts rather than prohibiting
hybrids. Enterprise quoting may be appropriate when scope varies; explain the
pricing basis and qualifying scope without inventing an anchor price.

Avoid forcing customers into upgrades merely to complete the advertised job.
An upgrade can reflect scale, collaboration, assurance, or service needs. Basic
shared features do not need artificial restrictions to differentiate tiers.
Package testing should ask whether customers understand what they receive and
when their bill changes, as well as whether they choose to buy.

## Economic scenarios

Define contribution over a specified unit and period: realized net revenue less
incremental delivery and service costs attributable to that unit. State how
discounts, refunds, credits, payment fees, compute/fulfillment, support, and
onboarding are treated. Avoid subtracting a refund or fee twice if already netted
from revenue. Separate contribution from profit, cash collection, and acquisition
payback; fixed cost and allocated overhead need their own treatment.

Model light, typical, and heavy usage, service demand, and discount scenarios.
Illustration: an invented monthly offer realizes 80 units of currency after
discounts. Delivery costs 25, attributable support 15, and payment fees 3;
contribution is 37. If heavy use raises delivery to 65, contribution becomes -3
with other inputs held constant. This arithmetic tests exposure, not a benchmark.
Keep cost estimates and usage correlations visible. Do not assume an unprofitable
entry tier recovers through upgrades that have not been observed.

Evaluate renewal terms, discount expiry, grandfathering, annual commitments,
seat reductions, and downgrade options. A discounted annual purchase can raise
cash while lowering realized price; acquisition conversion says little about
renewal at the undiscounted price. Model customer migration and cannibalization
between packages, including customers who would have bought the old offer.

## Experiment identity and inference

Assign by account or another unit that prevents the same buyer receiving conflicting
offers. Record assignment, actual exposure, offer version, realized terms, and
eligibility. Count all eligible assigned units for the intended comparison;
exposure-only or purchaser-only views answer different questions and should be
labeled. Keep sales overrides and discounts as treatment deviations rather than
silently removing inconvenient deals.

Choose a primary metric tied to the decision, such as contribution per eligible
account over a fixed window, with conversion and retention guardrails. Preserve
counts, denominators, uncertainty, missing data, and follow-up maturity. A renewal
comparison needs customers who reached the renewal point; different exposure
ages cannot share a naive denominator. Predeclare sequential stopping if repeated
looks will drive a decision. Otherwise avoid repeatedly sampling results until
a favorable difference appears.

When randomization is impractical, compare periods or cohorts with matching
eligibility, product, channel, season, sales treatment, and observation length,
then state remaining confounders. Survey willingness to pay can suggest test
ranges; inspect wording, recruitment, segmentation, and inconsistent answers.
Neither sample size alone nor a price-sensitivity intersection proves demand,
causality, or an optimum. Use behavioral evidence to challenge the proposal.

## Failed checks and rollout

Before exposure, exercise boundary usage, quota reset, proration when supported,
discount expiry, duplicate exposure, renewal migration, and rollback. Reconcile
expected entitlements and bills with actual configured outputs. Instrumentation
failure or assignment contamination limits the inference; preserve affected
records, repair the mechanism, and decide whether a fresh test is needed.

Roll out only within existing authority, retaining offer versions, customer
commitments, monitoring, and a restoration path. A short-term win with adverse
support cost or unresolved renewal effects warrants a bounded decision with
those risks explicit, not a claim of durable commercial success.

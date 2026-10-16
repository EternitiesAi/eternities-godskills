# Lantern Studio: four-week operating recommendation

Fictional, supplied-data analysis as of the start of week 1. This is a proposed
decision packet, not a live approval, payment, refund, vendor contact or migration.

**Defer the $10,000 campaign, prefer the confirmed $1,000 monthly bridge over the
$9,000 annual commitment, and resolve the week-3 liquidity gap now.** Do not switch
to the replacement while access restrictions remain unproved. Remove redundant
founder approval for the four routine support cases within existing authority;
retain founder decisions for the two contract exceptions. These choices reduce
avoidable commitments and decision delay, but do not establish survival or sales.

## Cash and timing

`cash.csv` covers Lantern Studio's unrestricted cash in the fixture's dollar
units, cash-settlement basis, from start of week 1 through end of week 4. The
opening $40,000 is a supplied balance; subsequent amounts are projections.
Each week's close nets the specified end-of-week collections and payments;
the next week opens at the preceding close. This is not an assertion about
which same-day transaction clears first. Optional start-of-week payments appear
only in the separate scenarios below. No accruals, borrowing or balancing plugs
are added.

The base includes $12,000 payroll/hosting each week and $8,000 tax in week 2;
contracted collections are $10,000 in week 2 and $20,000 in week 4. It excludes
the campaign, annual renewal, alternative bridge and unsigned sale. Refund
amounts/timing are unknown and are not silently modeled as zero obligations.
The base is the requested comparison case, not an assumption that software can
continue free or that service can safely stop.

Base cash closes at **$28,000, $18,000, $6,000 and $14,000**. The reserve gap is
`max(0, 15000 - closing_cash)`: **$0, $0, $9,000 and $1,000**. The reserve is a
threshold, not an additional payment. Total contracted receipts are $30,000;
unavoidable payments are $56,000; $40,000 + $30,000 - $56,000 = $14,000.

Each alternative below changes only its named event from the unchanged base.
Amounts are dollars; negative cash exposes an unfunded requirement.

| Scenario | Cash event relative to base | W1 close | W2 close | W3 close | W4 close | W3 reserve gap |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Base | None | 28000 | 18000 | 6000 | 14000 | 9000 |
| Campaign only | -10000 at start W1 | 18000 | 8000 | -4000 | 4000 | 19000 |
| Annual renewal only | -9000 at start W3 | 28000 | 18000 | -3000 | 5000 | 18000 |
| Bridge only | -1000 at start W3 | 28000 | 18000 | 5000 | 13000 | 10000 |
| Unsigned sale upside only | +30000 at end W3 | 28000 | 18000 | 36000 | 44000 | 0 |

The campaign reduces every weekly close by $10,000 and breaches the reserve by
$7,000 already in week 2. The annual renewal reduces W3/W4 closes by $9,000;
the bridge reduces those closes by $1,000. Annual and bridge are alternatives,
not cumulative costs. The bridge retains $8,000 more cash through W4 than the
annual renewal. With the bridge, W4 still has a $2,000 reserve gap.

The sales lead's 60% estimate is not a collectible receipt. The upside row assumes
the full $30,000 actually arrives at end W3; the base assumes no such receipt.
No $18,000 probability-weighted inflow finances the recommendation. Combining the
sale with the bridge would close W3/W4 at $35,000/$43,000, conditionally—not a plan
to spend against an unsigned sale.

Week-end netting can conceal earlier shortfalls. If W2 payments clear before its
$10,000 collection, cash temporarily falls to $8,000 even in the base. If W4's
$12,000 payment clears before its $20,000 collection, base cash would be -$6,000
(bridge case -$7,000). A W3 sale may arrive after payroll. Confirm settlement
order; do not claim continuous solvency from net weekly closes. The bridge needs
at least $10,000 additional available cash by W3 close to meet the reserve on
this net schedule; that is not necessarily sufficient intraday, and no source
of financing is supplied. The founder must decide how to close the gap through
confirmed resources or feasible authorized cash-timing changes, or explicitly
address the threshold breach. A reserve exception would not create cash.

## Renewal: continuity before price

For the common four-week cash horizon, the annual option requires the full
$9,000 at start W3, not a prorated fraction. Its service commitment extends beyond
W4. The bridge requires one $1,000 payment in this horizon, assuming the next
monthly charge is outside it; confirm actual calendar dates and notice terms.
Do not infer that the bridge is cheaper over a year or that an annual prepayment
is refundable. Remaining service duration, cancellation terms, migration labor,
overlap costs and replacement fees are unknown, not zero.

The replacement's access-preservation gate is **unresolved**, not passed and not
proved failed. Proposed owner: the operations lead names a technical/data owner
to test representative exported records and role combinations in an authorized
test environment. Require allowed users to retain needed access and disallowed
users to remain denied, including relationships/attachments. Record mismatches;
stop cutover on excess access or inconclusive results. Confirm usable data,
rollback and retained incumbent access before any migration approval. This is
a proposed test, not an executed security assessment. Use the bridge to retain
decision time, subject to liquidity and confirmation of unchanged needed service.

## Four-week operating plan and decision rights

| When | Proposed owner and decision | Next evidence |
| --- | --- | --- |
| W1 | Founder defers campaign and chooses bridge direction; operations lead brings the dated reserve gap and funding/timing choices for decision now. Confirm renewal/notice deadlines before assuming W2 is soon enough. | Recorded choice, actual settlement order, bridge coverage/terms, identified cash-gap response—not a forecast sale. |
| W1–2 | Support lead handles the four routine cases under the already approved $200-per-case authority after checking eligibility and duplicates. Founder decides only the two contract exceptions. | Per-case amount, original intake age, named owner, authority basis and proposed disposition; then separately record execution if authorized actors perform it. |
| W2 | Operations lead checks the $10,000 receipt and $20,000 total unavoidable payments against actual cash; founder settles the gap/bridge decision before its payment is due. | Reconciled balance, exceptions and revised timing; baseline W2 close is $18,000. |
| W3 | Authorized owner implements only an approved bridge decision; technical owner performs the bounded access-preservation check if separately authorized. Do not count the unsigned sale until received. | Actual payment/collection evidence and test outcome; bridge-only projected close is $5,000. |
| W4 | Operations lead reconciles the $20,000 collection and payroll/hosting, then updates the next month; founder revisits renewal only with gate and liquidity evidence. | Bridge-only projected close is $13,000; renewal/exit choice and support queue observations remain distinct from completed actions. |

The support proposal reuses existing authority; it does not grant new contract
exception authority. Four routine cases imply at most $800 of refund exposure,
not $800 of known payments. Obtain actual amounts and dates and add authorized
refunds to the cash schedule before execution. If cash constraints block a
routine case, escalate that specific liquidity conflict, not all routine cases.

Use the existing queue: original intake date, amount/type, owner, blocked reason,
decision and execution status. Proposed pilot rule: request founder exception
decisions within one business day, or before a supplied customer deadline if
earlier; this is a proposed response window, not an existing SLA. If absent, use
an explicitly authorized delegate within written limits; otherwise hold the
exception and report the delay, never treat silence as consent. Urgent arrivals
identify what work they displace. Do not invent staffing capacity or promise
all six cases closed. Review unresolved exceptions asynchronously each workday
in this pilot, with a weekly check of oldest age, decision wait and rework;
no new meeting or system is required. No improvement has yet been measured.

## Facts and decisions still needed

- Operations lead: exact collection/payment clearing order, actual refund amounts
  and dates, and whether the cash-gap response is feasible. No borrowing exists.
- Founder: campaign deferral, bridge commitment, funding/timing response and the
  two contract exceptions; designate a bounded exception delegate if needed.
- Operations/vendor owner: notice deadline, bridge cancellation/service terms,
  renewal commitment and costs beyond the supplied quotes.
- Technical owner, currently unassigned: access-preservation test evidence,
  usable export/import and rollback needs; do not infer readiness from price.
- Support lead: existing case ages, commitments and available capacity. These
  establish a baseline for the proposed routing change, not a claim of faster work.

Applied methods: cash-flow timing/scenario separation exposed the earlier gap;
vendor gates kept a cheaper unproved migration out of the recommendation;
decision-rights analysis moved routine work out of the founder queue without
expanding contract authority. This is an independent fictional application of
the candidate methods, not author self-review or evidence of live company results.

# Fictional consumer exercise: a company's next four weeks

You are helping the operations lead of fictional Lantern Studio. Using the
supplied data only, produce a practical four-week operating decision and cash
table. Read the portable Godskills pack selectively if it supplies a useful
method. Do not browse, message anyone, change a system, or invent evidence.

Today is the start of week 1. Opening unrestricted cash is $40,000. Payroll and
unavoidable hosting total $12,000, paid at the end of each of weeks 1–4. Tax of
$8,000 must be paid at the end of week 2. The agreed minimum operating reserve
is $15,000; it is a planning threshold, not a new payable. No borrowing exists.

Contracted customer collections: $10,000 at the end of week 2 and $20,000 at the
end of week 4. A sales lead estimates a 60% chance of $30,000 arriving at the
end of week 3. That sale is unsigned. Show contracted cash separately from any
upside scenario. Do not silently use expected value as collectible cash.

The founder asks for a new $10,000 campaign, paid at the start of week 1, whose
claimed benefit has no measured evidence. A proposed annual software renewal
costs $9,000 at the start of week 3. The incumbent has confirmed a $1,000-per-month
bridge with the first payment at that same date. The existing export test has
not yet proved the proposed replacement preserves access restrictions. A lower
price does not establish that migration is ready.

Six support escalations need a policy decision; all are waiting on the founder.
Four are routine refunds within the already approved $200-per-case support
authority, and two request contract exceptions beyond that authority. The
founder has asked you to propose the operating change, not execute refunds.

Deliver:
- `cash.csv`: week, opening_cash, contracted_receipts, unavoidable_payments,
  closing_cash, reserve_gap; exclude both optional spending proposals in this
  base case and state the timing convention.
- `decision.md`: a concise recommendation that connects liquidity, the renewal
  choice and the approval bottleneck; identify actual missing facts and
  decisions. Include the marginal cash impact of the campaign, annual renewal
  and bridge separately. Do not promise survival, sales or migration success.
- `used-methods.json`: only the actual entrypoints/references read and why.

Work in the supplied isolated output directory; do not alter the library.

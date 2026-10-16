# Onboarding cohorts

A small, offline application of Beacon's customer-onboarding measurement method.
It reports an observed first useful result while keeping waiting, late, blocked,
and unknown outcomes visible. All demo data is fictional. This host-native example
does not establish customer uplift, retention, or skill superiority.

Run with Node.js 24+ from this directory, wherever it has been copied:

```sh
node --test index.test.mjs
node demo.mjs
```

No dependencies, install step, network, subprocesses, source checkout, or local
configuration are needed. The demo writes one JSON document to stdout.

## API

```js
import { summarizeOnboarding } from './index.mjs';

const summary = summarizeOnboarding({
  cutoff: '2026-10-15T00:00:00.000Z',
  windowDays: 7,
  accounts: [{
    id: 'a',
    enteredAt: '2026-10-01T00:00:00.000Z',
    eligible: true,
    acceptedAt: '2026-10-04T00:00:00.000Z',
    blocker: null,
  }],
});
// matureCount=1, acceptedInWindowCount=1, matureRate=1,
// completedMedianDays=3; all other counts are 0.
```

Supply one row per account. The caller defines cohort entry and eligibility before
looking at outcomes. `acceptedAt` means a recipient-accepted useful result from
that account's real customer input. The caller must establish and retain the
evidence behind that meaning; a timestamp alone cannot authenticate acceptance.
Account creation, setup completion, an emitted artifact, and demo output do not
establish that event. Join multiple actors through account evidence upstream.

The function is synchronous, returns a new object, and does not mutate the input.
It rejects unknown fields at both levels, including `setupAt`; it never infers
acceptance from setup. IDs are case-sensitive exact strings, must contain a
non-whitespace character, and must be unique. `eligible` must be boolean.
`acceptedAt` and `blocker` can be omitted or null. Otherwise `acceptedAt` must be a
timestamp and `blocker` a string containing a non-whitespace character. Explicit
`undefined` values for those optional fields are rejected; omit them instead.
Blockers describe supplied observations and do not override an observed acceptance.
No blocker-specific output or intervention is inferred from free text.

## Measures and observation window

One day is exactly 86,400,000 milliseconds, including all customer, provider, and
dependency waiting. These are elapsed 24-hour days, not local calendar days or
business days. `windowDays` is a positive finite number; fractional days work.
The window for each account starts at `enteredAt`, independent of other accounts.

| Output | Definition |
| --- | --- |
| `matureCount` | Eligible accounts whose full window has elapsed at cutoff, including an exact deadline. |
| `pendingCount` | Eligible accounts without a full window yet, even if already accepted. |
| `ineligibleCount` | All other accounts; excluded from every other measure. |
| `acceptedInWindowCount` | Mature accounts accepted at or before their window deadline. |
| `acceptedAfterWindowCount` | Mature accounts accepted after their deadline but at or before cutoff. |
| `matureNonSuccessCount` | Mature accounts without an in-window acceptance, including late, absent, blocked, and unknown outcomes. |
| `matureRate` | `acceptedInWindowCount / matureCount`; null when there are no mature accounts. A fraction, not a percentage. |
| `pendingAcceptedCount` | Pending eligible accounts with an observed acceptance at or before cutoff. |
| `completedMedianDays` | Median entry-to-acceptance elapsed days among mature in-window successes only; null when none. For an even count, average the two middle times. |

At the cutoff, pending accounts are censored before they have had a full
opportunity; do not call them failures or include early pending successes in the
mature numerator. Late acceptance remains a non-success for this fixed-window
metric. Missing acceptance means no observed acceptance, not proof of failure or
abandonment. Missing observations and unresolved blockers stay in the eligible
mature denominator. A fast median among completers can coexist with a low mature
rate, so read it with the counts rather than as an all-customer completion time.
This report does not estimate a survival curve or infer retention or causation.

## Validation and limits

Timestamps use ISO calendar date/time with explicit uppercase `T` and `Z`:
`YYYY-MM-DDTHH:mm:ssZ`, optionally with 1–3 fractional-second digits. Signed
six-digit ISO years are also supported within JavaScript's date range. Real
calendar dates are checked: invalid leap dates, normalized dates such as February
30, hour 24, and leap seconds are rejected. Sub-millisecond precision is rejected
explicitly rather than silently truncated. Local times, offsets including
`+00:00`, date-only strings, and `Date` objects are not accepted.

All rows, including ineligible rows, are validated. Entry must be at or before
cutoff, and an acceptance must lie between entry and cutoff inclusive. Missing
required fields, duplicates, sparse rows, wrong types, nonfinite duration,
unsafe elapsed-millisecond arithmetic, or a window deadline outside the supported
date range throw a `TypeError` or `RangeError` with field context. No malformed
observation is silently discarded. Calculations use JavaScript numbers and
millisecond-resolution timestamps; this is not a high-precision time library.

The method informed the denominator, waiting-time interpretation, and fictional
blocker/unknown examples. The public API and exact counting rules are fixed by the
qualification contract. The function cannot verify real inputs, recipient
judgment, consent, eligibility quality, event completeness, or which intervention
would help. Those require application evidence and an authorized decision owner.

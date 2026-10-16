# Onboarding-cohorts author evidence

Date: 2026-10-16. Runtime: Node v24.18.0. Baseline commit:
`594a4b7cd294eecfef8b5c9432416d7650ae4d92`. Branch:
`feat/executable-method-examples-20261016`.

This is a host-native consumer application using synthetic observations. The author
read the complete fixed spec, matching plan, shipped Beacon instruction body and
onboarding method. Exact source identities, including the installed workflow skills
actually applied, are in `source-hashes.json`. Installed and shipped Beacon bodies
matched. No inherited parent history, other authors' solutions, or independent
acceptance tests were used to author this lane.

Only `product/examples/onboarding-cohorts/` and this evidence directory were
written. The product contains four authored files: `index.mjs`, `index.test.mjs`,
`demo.mjs`, and `README.md`. `portable-smoke/` retains exact-byte copies of those
four files generated for a relocation check; it is a verification fixture, not a
second implementation. No subagents, paid providers, acquisitions, acquired code
execution, global configuration changes, shared manifests, build, installation,
commit, merge, or push were performed.

## Observed red and green checks

Commands below ran from the worktree root unless another directory is stated.

| Stage | Command | Observed result |
| --- | --- | --- |
| First behavioral red | `node --test product/examples/onboarding-cohorts/index.test.mjs` | Exit 1; 1 test, 0 pass, 1 fail. The exported empty function returned `undefined`; literal expected summary was mature=6, pending=2, ineligible=1, in-window=3, late=1, non-success=3, rate=0.5, pending-accepted=1, median=3 days. This was an assertion failure, not a missing module or syntax error. |
| Minimal green | Same command | Exit 0; 1 pass, 0 fail after adding cohort counting and median calculation. |
| Validation red | `node --test --test-reporter=tap product/examples/onboarding-cohorts/index.test.mjs` | Exit 1; 64 tests, 12 pass, 52 fail. Missing exceptions exposed absent validation for unknown fields, missing data, rolled-over dates, chronology, and overflow; null input produced an unhelpful property-access error. |
| Validation green | Same TAP command | Exit 0; 64 pass, 0 fail, 0 skipped after adding field, calendar, ordering, and arithmetic checks. |
| Demo | `node product/examples/onboarding-cohorts/demo.mjs` | Exit 0; one fictional JSON document; mature=6, pending=2, ineligible=1, in-window=3, late=1, non-success=3, rate=0.5, pending-accepted=1, median=3. |
| Relocation | From this directory's `portable-smoke/`: `node --test --test-reporter=tap index.test.mjs` and `node demo.mjs` | Exit 0 for both; 64 tests pass with 0 fail, cancelled, skipped, or todo. Demo stdout parsed as JSON with `fictional=true` and the expected summary. All four copy hashes match the original product files. |
| Final replay and identity | Author TAP command, parsed demo stdout, and SHA256 comparison | Exit 0; 64 pass, 0 fail, no skips; all nine demo summary fields match literal expectations. All eight source hashes and the four product/four copy hashes still match this packet. |

A whitespace-check wrapper initially treated `git diff --no-index --check` exit 1
for a new file versus `NUL` as a failure, although no whitespace diagnostic was
printed. No product change was made for that wrapper error. A direct read-only
scan then found no trailing spaces/tabs and confirmed terminal newlines in all
10 lane files.

Test expectations use literal, hand-derived counts and times. No mocks, external
services, or helper from the implementation generates expected results. Cases
include the method's fictional 14-mature/6-pending cohort, inclusive deadline and
one-millisecond-late acceptance, pending maturation at cutoff, odd/even medians,
an empty eligible population, late/missing outcomes, frozen input, fractional
24-hour windows across a daylight-saving transition, leap dates, invalid input,
and invalid observations in ineligible rows. The implementation has no external
imports and the demo/test import only their relative implementation plus Node
built-ins. No pack export or shared integration check is claimed.

## What the method actually contributed

The fixed contract already specified the API, mature denominator, pending/late
rules, median population, validation duties, and nonmutation. Those algorithms
cannot be attributed uniquely to reading the skill. There is no untreated
comparison, randomized control, measured uplift, or proof of skill superiority.

| Applied source guidance | Concrete contribution and boundary |
| --- | --- |
| Onboarding: define a useful result and the recipient's acceptance evidence | README and demo explicitly define an operator-accepted usable inventory pick list, separate from setup and emitted output. The code trusts the caller's event semantics; it cannot verify real input or human acceptance. The contract also required this boundary. |
| Onboarding: missing evidence is unknown; inspect the stalled dependency | Chose an administrator-permission blocker and a missing outcome as distinct fictional cases, with neither called abandonment. The method's permission/error/unknown example supplied the separate 14-mature/6-pending test with nine successes and five unresolved outcomes. Free text is not converted into a diagnosis or an automatic action. |
| Onboarding: keep unresolved blockers in the denominator and report waiting customers | Used the combined fixture and demo explanation to make exclusion of blockers/unknowns or inclusion of pending early successes observable. The contract fixes the counting policy; the resource reinforced the fixture choice and interpretation. |
| Onboarding: elapsed time includes waiting; completer medians can conceal failure | README defines fixed elapsed days including dependency waits and explains the selection of the median population. Demo prints the median beside every cohort count and cautions against reading it as an all-account time or retention signal. |
| Beacon: distinguish supplied evidence, derived measures, and unobserved effects | All demo observations are labeled fictional. No experiment, benchmark, customer claim, retention inference, target, or effect estimate was manufactured for a reporting function. |

Useful omissions: this lane does not implement a dependency-workflow engine,
role-joining service, outreach, reminders, interventions, retention model, consent
system, or event-evidence authentication. The method's full dependency diagnosis
and stalled-case intervention stages need actual application evidence and are
outside the fixed summary API. The resource says to skip it for a settled
activation report; this qualification exercises its measurement guidance in a
new executable example, not a claim to have completed an onboarding redesign.
The existing-cohort reporting exception in Beacon avoided inventing an
optimization experiment just to fill its prospective-test checklist.

The installed test-first skill contributed the observed red/green sequence;
its test-design reference contributed real API assertions and literal fixtures.
The verification skill contributed fresh execution and the hash-checked relocation
smoke. These are process contributions, not evidence of customer outcomes.

## Limits and parent gates

Timestamps support explicit-Z ISO calendar time at millisecond resolution, with
optional 1–3 fractional digits and optional signed six-digit years. More precise
input is explicitly rejected instead of truncated; leap seconds, offsets, and
hour 24 are also rejected. This supported grammar is documented, since the spec
does not enumerate timestamp precision. Safe elapsed arithmetic and supported
date deadlines are checked. The function reports supplied observations and cannot
repair missing events or validate whether eligibility or acceptance is truthful.

The author's 64 passing tests and relocation smoke are not independent acceptance.
Independent testing, review findings, exact parent replay, shared packaging,
release, and installation remain parent-owned gates. This packet does not label
the result independently accepted or released.

## Final product identities

Paths below are relative to `product/examples/onboarding-cohorts/`.

| File | SHA256 |
| --- | --- |
| `index.mjs` | `01318F3CD67A9D8464E55800235D951D877FBA3945F0F8B26D9E0FCF4C5E8A50` |
| `index.test.mjs` | `9D0F605C04B3602726AA8A78CD6DC2E0C322CC011182292C2B175D4C6192BBBE` |
| `demo.mjs` | `64050314309569FED128DD1C98DC4578B5E7E72E5B2B73B71C552E50A7DE9EE7` |
| `README.md` | `047E0EBF8F7C4A571AD5835B8C1D227A4DA6B52744C292342C2A3451551BD8D0` |

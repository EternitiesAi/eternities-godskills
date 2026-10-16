# Lane C repair v2: R1/R2 handoff

Status: **ready for Avicenna independent re-review**, not independently accepted.
Only `product/lib/discovery.mjs`, `product/DISCOVERY.md` and
`tests/cohesive-discovery-boundaries.test.mjs` changed in this repair.
Other C code/docs/tests remain at their before-repair hashes. All new evidence
is confined to this folder. Original lane-C receipts and Avicenna's original
review/failure files are preserved byte-for-byte.

## Reproduced causes and repair

R1 was caused by conflating lexical admission with a narrowly worded purpose
profile. Ordinary feature work was removed, as were descriptions that placed a
camera problem and its requested improvement in separate clauses. A creation
regex also imposed a three-word modifier gap before the game noun.

The replacement separates admission from corroboration. Explicit game/gameplay,
player, engine, format or spatial/runtime-scene context can retain lexical
candidates without requiring a recognized feature noun or modifier count.
Generic asset/hardware context additionally requires separate requested-work or
reported-fault evidence. Bare topic navigation remains distinct from task intent.

R2 arose because mesh/texture/GPU nouns occurred in both purported cue families.
A purpose reason now needs an independent work action or reported fault. An
object-only lookup receives no runtime-purpose reason or bonus. Recognized
legal/rights and pricing clauses cannot contribute runtime evidence; a separate
live technical clause can still qualify. Matching capability metadata determines
the applicable profile, including under renamed IDs.

No shader/control/camera query is used as a dispatch key. There is no new score
bonus, ordering tier or keyword expansion, and no owner metadata changes.
The profile remains eligibility-only. The existing quote/refusal scoping,
anti-triggers, need facts, filters, exact-ID lookup and review-required contract
remain. These are finite English lexical rules, not semantic applicability,
general discourse parsing, permission or guaranteed candidate quality.

## Test-first record

Before implementation, the updated owned test and the unchanged reviewer tests
reported 23 failures and 16 passes. This includes all five preserved reviewer
failures (four main R1/R2 checks and the gameplay-camera follow-up).
See `regressions.red.tap`.

The first repair passed those checks but the wider focused run exposed a
descriptive asset-fault regression: an imported mirrored mesh with a wrong pivot
has no imperative verb. The **156/157** run is retained in
`focused-first-attempt.tap` (also the initial `focused-results.tap`).
Three descriptive-fault regressions were then added and observed failing,
alongside a passing ordinary-description control; see
`descriptive-faults.red.tap`. Independent fault predicates now supply evidence
for those reports, without treating the asset noun as the purpose.

Final bounded run: **161/161 passed**, zero failures. It includes the original
seven focused files and both unchanged reviewer regression files, with the
shared-CLI and temporary-build tests excluded by name. It covers the original
35 frozen author cases on their original catalog, the new regressions, all nine
reviewer tests, metadata-based dispatch, all 93 exact IDs and browse/inspect
compatibility. See `focused-final.tap`. No full suite, shared build, install,
commit, agent or provider call was used.

## Matched current-metadata comparison

`catalog.current-metadata.frozen.json` captures all 93 current metadata records
once. It is controlled discovery input, not a rebuilt or published catalog.
Its zero entrypoint digests are explicit placeholders unused by search; it must
not be passed to inspect/install as verified pack content.

All comparisons in `matched-final.json` use **that exact same metadata** for:
canonical c4e0fd2 code, the pre-repair C code saved in `code.before.json`, and
the repaired C code. Parent metadata gains are not attributed to this repair.

| Case group | Before repair | Repaired | Remaining expectation misses |
| --- | ---: | ---: | --- |
| Independent main challenges | 39/56 | 54/56 | E04, E05: free-text ID references |
| Supplemental scored cases | 10/19 | 19/19 | None; GPU-pricing characterization is separately unscored |
| Parent shader/portal cases | 2/4 | 3/4 | PC02: preexisting zero-lexical-match portal query |
| Gameplay-camera cases | 1/2 | 2/2 | None |
| Author 35 on same current metadata | 35/35 | 35/35 | None |

No expectation that passed before repair fails after it in these matched sets.
The groups overlap and contain authored/localization cases; they are not
independent draws or a general accuracy benchmark. The GPU-pricing query is
additionally a strict exclusion assertion in the owned regression test and
passes. All 93 exact-ID checks and host no-need controls over all 117 input rows
pass in the measurement runner.

The parent flame query returns Arcadia at rank **4**, restoring supported
default-five recall; this is not a new top-three ranking claim. The camera query
returns it at rank **1** on the matched current metadata, versus exclusion before.
The portal `Make a WebGL particle portal I can orbit` has no results under
canonical, pre-repair or repaired code on this metadata. Its scene control has
rank 3. That existing lexical coverage gap remains open and was not hidden by
inventing a score or changing metadata.

E04/E05 are free-text `Inspect/Find ... ID` searches, not dedicated inspect API
calls. Bare exact IDs and the dedicated inspect contract pass. Those two
reviewer characterization expectations remain unmet; no assertion or case
expectation was altered.

## Remaining limits

Admission is intentionally more recall-preserving for explicit domain context,
so a retained candidate is not proof of a requested runtime operation. Purpose
reasons require separate work/fault evidence. Other lexical false positives and
unknown wording remain possible. Recognized legal/technical purposes combined
inside one clause may be conservatively excluded; a separate live runtime clause
is handled, not arbitrary discourse. Finite refusal, quotation, language and
cross-sentence limits still require host judgment. No superiority, actual skill
execution benefit, release qualification or independent acceptance is claimed.

The original author and reviewer failures are historical evidence and have not
been rebound to new hashes. `matched-results.json` and
`matched-first-attempt.json` retain the first repair measurements;
`matched-final.json` is the final comparison.

## Reproduce

From the worktree root:

```text
node artifacts/qualification/cohesive-product-20261015/lane-c-repair-v2/measure.mjs
node --test --test-reporter=tap --test-skip-pattern "actual search|rebuilt temporary" tests/cohesive-discovery-routing.test.mjs tests/cohesive-discovery-boundaries.test.mjs tests/cohesive-discovery-navigation.test.mjs tests/discovery-quality-20261003.test.mjs tests/discovery-selection-boundary-20261003.test.mjs tests/discovery-need-20261003.test.mjs tests/realtime-asset-discovery.test.mjs artifacts/qualification/cohesive-product-20261015/review-c-avicenna/review-regressions.test.mjs artifacts/qualification/cohesive-product-20261015/review-c-avicenna/camera-regression.test.mjs
```

The measurement runner prints results only. It never rewrites the original
review receipts. Canonical replay requires the existing c4e0fd2 Git object;
the product remains offline and provider/account independent.

`read-set.before.json`, `read-set.after.json` and `delivery-files.json` bind
exact before/after code/test hashes, current metadata and protected receipts.
The full pre-repair C library sources are frozen in `code.before.json`.
Parent retains owner metadata, manifest rebuild and public/native release gates.

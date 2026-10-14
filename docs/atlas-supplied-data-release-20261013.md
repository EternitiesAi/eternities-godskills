# Supplied-data discovery and executed utility — 2026-10-13

Candidate implementation: `4c67e072511a5a8f4238cabc25100d88cc4f1f74`.
Content release: `6c8330b3b65e790e816b1ef9f5e107608ea5e5155880718d20c8aa116138b5f6`.
Status: independently reviewed and verified release candidate; local installation
is recorded separately below when completed.

## Useful change

The pack still contains 93 skills in 21 primary categories. This release improves
finding an existing data-reconciliation capability; it does not add skill bodies
or close source-quarry obligations.

An ordinary request to merge two customer exports, map different columns,
deduplicate records and explain rejected rows previously buried Atlas at rank
10. Atlas's instructions already supported supplied-data work, but its catalog
metadata did not describe that work clearly. A whole-skill anti-trigger also
mistook a prohibition on connected-source discovery for a prohibition on local
analytics. The existing method-level host gate was correct.

The repair makes the supplied-data capability explicit and removes only that
mis-scoped exclusion. Genuine owner exclusions remain. A bounded lexical profile
requires all three of tabular input, reconciliation action and structural
discrepancy/identity cues, plus corroborating owner metadata. It uses the existing
capped profile bonus, not a skill-ID lookup or a new priority tier. Recognized
quoted, refused and historical clauses do not supply this bonus. It is finite
English retrieval, not general semantic or permission understanding.
An action and tabular object must be associated within a clause or through a
direct reference to the immediately preceding live tabular clause. Shared field
and key vocabulary keeps input and identity checks consistent.

The connected-source gate remains byte-for-byte unchanged. Supplied-only scope
or prohibited discovery rejects that method; incomplete facts hold it. Search
continues to return `authority: none`, `activation: none`, and candidates for
host review. Host no-need, category/task filters and genuine exclusions still
take precedence. Reading a skill never grants external access.

## Evidence, including what failed

The original six supplied-data regressions failed before repair. The first
metadata-only candidate passed the focused cases but failed the broader suite:
generic wording boosted Atlas in a notification-delivery task, and two exact
historical-catalog comparisons required explicit revision accounting. The
notification regression was repaired without changing its existing test. Frozen
catalogs, literal educational outcomes and historical receipts remain exact;
test-only projection admits precisely the declared three-field metadata change,
checks it against literal expectations, and leaves every other field visible.

A separate Sol worker authored six new positive requests and four boundary cases
before inspecting the candidate. First execution of the second candidate found
Atlas in the top three for **4/6** positives, versus **1/6** on the old catalog;
all four boundary cases passed. Two misses informed the bounded profile repair.
After repair all ten disclosed cases pass, with Atlas in the top three on all
six positives (ranks 1, 1, 1, 2, 1, 1).
That final result is **regression evidence, not a fresh held-out success**.

Independent review then found over-broad bonuses for unrelated requests, a
document-completeness ranking regression, inconsistent serial-number key
handling, and a clear two-sentence reference that became undiscoverable after
scope tightening. Each negative review and first failing regression remains
preserved. The final repair accepts an explicit adjacent reference such as
"These two lists ... Combine them", but not an unrelated intervening topic or
a historical/refused antecedent. No entire query or owner ID is hard-coded.

After the latest failing-then-passing regression cycle, 146 focused tests passed,
including historical serving-trace ownership, notification delivery, connector
boundaries and educational projections.
Final full-suite and independent-review results are recorded at closeout below.
Two intermediate full-suite runs performed during edits are retained as
diagnostic only and are not used as final acceptance evidence. A successful v3
full suite also did not override the independent semantic findings.

## Executed Atlas exercise

A different Sol worker read the complete Atlas entrypoint and its generic method
reference, then implemented and executed a fabricated two-export reconciliation.
The local contract and literal expected result preceded implementation. Parent
verification separately inspected the code, derived the seven selected records
and seven rejection reasons directly from the twenty inputs, checked the saved
result, and reran all 16 checks.

| Accounting | Observed result |
| --- | --- |
| Input rows | 20 |
| Accepted / rejected | 13 / 7 |
| Selected / superseded accepted rows | 7 / 6 |
| Output records | 7 |
| Clean / conflicting / unknown | 1 / 2 / 1 |
| Missing from A / missing from B | 1 / 2 |

The exercise covers schema aliases, composite keys, source/revision/ID tie-breaks,
null versus zero, conflict retention, one-sided membership, complete row lineage,
explicit rejection reasons, input-order independence, immutable inputs and
invalid-envelope failures. Concrete schema and precedence are declared exercise
assumptions, not universal business policy imposed by Atlas.

The initial test failures and one corrected hash-transcription record remain
preserved. No inputs, literal oracle or qualification requests were rewritten.
The same worker authored the exercise and its checks; the parent independently
verified the bounded result. These are not sixteen independent user tasks,
production-data truth, or a matched raw-versus-guided model comparison.

## Package and preserved scope

The reproducible ZIP has 310 entries and is 1,729,762 bytes, SHA-256
`8f7d97c7e2167baa8bf502f51dbad3899847033e6fe47d3e9a3ea4c836a1521c`.
Every entry matched the release manifest after fresh extraction. The relocated
CLI validated, browsed categories, surfaced Atlas, returned its exact entrypoint,
and retained the supplied-only and no-need boundaries from an empty working
directory on the same Windows host. This is not clean-OS certification or a
test of cached native app loaders.

All 93 skill bodies and references remain identical. Of 274 native skill payload
files, only Atlas's `skill.json` metadata changes; the other 273 stay exact.
Protected activation bytes and prior receipts are unchanged. New warehouse
material stays inert. No providers, embeddings, global instruction changes or
automatic source calls are introduced.

## Closeout

Independent changed-tree review of `4c67e07` is **READY**, with no material
blocker in its bounded scope. It confirms the repaired adjacent-reference case
at Atlas rank 1, exact captured results for the other 45 comparison cases,
10/10 original qualification regressions, and unchanged decisions across 75
host-fact combinations. The reviewer separately ran 145 focused tests and the
one pinned regression, all passing, plus whole-pack validation. Two redundant
build/validation tests were name-excluded from its focused command; parent
focused checks did not use that exclusion.

The parent read the report and verified all four changed-file identities and
three input-fixture hashes. Independent report SHA-256:
`4318b4c5b70760efabc426f4df6d9366cbabd670b44a85e771a884389b9a14a9`;
readiness SHA-256:
`54f24bb9bf82f355600f8b66030598401c7ad4eb5ea440947b261cfded394179`.
Earlier independent REPAIR results are retained, not overwritten by READY.

The frozen full suite completed on the unchanged `4c67e07` product/test tree:
**1,790 pass, 0 fail, 2 skipped**, 1,792 total, 268,021 ms. The skips concern
Windows leaf-symlink privilege and an unavailable different-volume fixture;
they are not counted as passes. Command from repository root:

```text
node --test --test-concurrency=1 --test-reporter=tap
```

Full TAP SHA-256:
`22647c4d057ab628ea1bd0c1998d12961d95e1785b7539b115c24a2e966142e3`.
No code or expectation changes were made while this final run was in flight.
The package was independently exported twice with the exact ZIP hash above.

Canonical integration and backed-up exact-manifest installation are the next
delivery steps, not inferred from these checks. Local evidence is retained in the task's
`godskills-atlas-discovery-20261013` operation record; the digests here identify
that evidence without publishing private machine paths or session transcripts.

The [product direction](product-direction-20261013.md) still separates portable
product delivery, practical effectiveness and source refinement. R10 remains
49,514 open obligations and 163 conflicts. Wider multi-method discovery and
matched difficult-task effectiveness remain work to do, not claims made by this
bounded upgrade.

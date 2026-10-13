# Selective navigation release — 2026-10-13

Content release: `898ed9120d62d680c057aec9603a5c07278287bcea5e28f831965e7142e5ae60`.
Implementation commit: `172962a4c76bd0f97760c326e613f6a930805cf0`.

## What changes

This additive upgrade keeps the same 93 skills in 21 primary categories. All
274 existing skill payload files are byte-for-byte unchanged. Existing search
and route implementations, historical receipts and protected activation files
are unchanged.

- [START-HERE](../product/START-HERE.md) provides a short Markdown capability map.
- `browse` lists categories and counts without skill bodies.
- `browse --category NAME` returns five candidates at a time; `nextOffset`
  explicitly indicates further pages. Optional limit is 1–20.
- `inspect ID` returns the complete selected entrypoint, exact identity,
  exclusions and optional resource pointers, without returning their bodies.
- Unknown IDs/categories, malformed arguments and modified packs fail explicitly.

The CLI still validates the whole pack, which reads files. This is smaller
model-visible output, not metadata-only disk access or a cache-efficiency claim.
Navigation supplies candidates and exact reading, not task selection, activation
or permission. Pure Markdown use requires no Node, provider or special directory.

## Why this milestone

Two separate Sol 6.1 xhigh reviewers audited discovery and completion priorities.
The discovery audit used twelve independently chosen ordinary requests: eight
of ten specialist tasks surfaced all intended components, one missed and one
was partial. Both simple tasks returned unnecessary candidates; host-supplied
`need:none` correctly suppressed them. Data reconciliation buried Atlas at rank
10; a multi-stage research/prioritization request buried its research method.

Browse provides a complete category fallback for these misses. This release
does **not** fix their ranking or claim general semantic understanding. The six
methods examined by the other reviewer contained mechanisms worth retaining;
there was no evidence for wholesale rewriting on model-tier grounds.

Measured first-step browse output is 1,595 UTF-8 bytes versus the 24,375-byte full
INDEX and 141,957-byte catalog. The Markdown start page is 2,928 bytes. The largest
first category page is 5,557 bytes; across all pages the maximum is 5,991 bytes.
Thirteen of 29 default pages exceed 4 KiB: the interface promises five entries,
not a 4 KiB ceiling. These are exact format-size observations,
not measured billing, tokenization, latency or downstream quality savings.

## Implementation and separate checks

- Test-first evidence: four missing-navigation failures before implementation;
  the pagination case separately failed before its implementation. Negative
  argument/tamper controls are included.
- Final implementation full suite: **1,743 passed, zero failed, two skipped**
  out of 1,745 tests. The skips are unavailable Windows leaf-symlink creation
  and the unavailable different-volume fixture. Neither is counted as passed.
- Exact payload preservation: 274 prior skill files and the three frozen
  activation artifacts remain identical; search/scoring/selection source stays exact.
- Export: 1,724,405-byte ZIP, 310 entries, SHA-256
  `1912f12dcc2582f3b84e3e4ea42f86b0678466e06448008d6dfb54d9a751cec9`.
- Fresh extraction: every entry hash matched; validation, category browsing,
  page continuation, exact Atlas reading and host no-need worked from an empty
  working directory outside the repository on the same Windows computer.

Separate code review returned READY on the pinned implementation: 7/7 focused
tests, all 93 IDs recovered over 40 pages at size three, 23 failing CLI argument
controls, 12 API rejection controls, selected-body recheck, unchanged search
outputs for the twelve earlier requests, and exact payload preservation.

The different adoption reviewer also returned READY: all 93 IDs recovered over
29 default pages, all 21 category anchors matched, complete Atlas/vendor
entrypoints read, and six error controls passed. The reviewer produced a
supplied-data reconciliation outline applying Atlas's keys/null/conflict/coverage
checks. That is an agent-written plan, not an executed data transformation or
evidence of superior task outcomes.

Exact retained review-report SHA-256 identities:

- Code review: `da50ccb3e7ba46bae325d87c4d121a8b60f82803ff2ae08bb708428bafbe4743`.
- Adoption review: `f9a14bd90eec5db5ed599b7812bcb8adf5b0df4e48caae45d36fe6352b9b7eaa`.
- Adoption readset/observations: `79710a059dfc2e02a321269f022aef1cd1a630c3ab866548de5d47283f9cd7ef`.

These records are retained in private operation evidence, not bundled as
mandatory agent context. This public summary is not their verbatim text.
Review covered the exact product/implementation commit, not subsequent root
publication prose. Parent checks cover that prose and the archive.

Integration and backed-up installation remain to be recorded below; the checked
candidate alone is not an installed-release claim.

## Remaining work and meaning of completion

The [current direction](product-direction-20261013.md) separates portable product
delivery, practical effectiveness and source-quarry accounting. The next useful
quality phase is harder artifact-producing tasks with independent checks and
matched comparisons where improvement is claimed. The historical mixed-positive
results remain in [quality qualification](product-quality-qualification-20261003.md).

No new skill was synthesized in this navigation batch. No raw-model superiority,
clean-OS certification, native cached-loader discovery or complete quarry
refinement is claimed. Frozen R10 remains 49,514 open identity obligations and
163 conflicts. Newly downloaded repositories remain inert research inputs.

Observed follow-up priorities are narrow and concrete: repair ordinary data
reconciliation retrieval, clarify Atlas's connected-source-only exclusion so
it cannot be confused with a ban on supplied-data analysis, then exercise
artifact-producing cases. Pagination assumes the same release between pages;
dynamic cross-release traversal has not been qualified. None of these limits
is disguised as completed by the navigation fallback.

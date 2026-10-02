# Independent bounded execution record

Runtime: Node v24.18.0; Windows/PowerShell. Synthetic supplied callbacks only.

From C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/task-feed-application-independent-review-v2:

~~~powershell
$taskFeedPreviousModule = $env:TASK_FEED_READER_MODULE
try {
  $env:TASK_FEED_READER_MODULE='C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/task-feed-application-v3/reader.mjs'
  node --test original12-against-v3.test.mjs v2-six-against-v3.test.mjs independent-nine-against-v3.test.mjs
  $taskFeedTestExit = $LASTEXITCODE
} finally { $env:TASK_FEED_READER_MODULE = $taskFeedPreviousModule }
exit $taskFeedTestExit
~~~

Exit 0; 27 pass / 0 fail / 0 skip / 0 cancelled. Environment restored.

~~~text
✔ independent: returned page cursor/status/final fields cannot manufacture completion during commit (1.1023ms)
✔ independent: page snapshot retains terminal decision when mutable response is rewritten as running (0.1193ms)
✔ independent: changing maxEventsPerPage cannot admit an oversized page (0.1335ms)
✔ independent: changing maxTotalEvents cannot enlarge invocation acceptance after a prior ack (0.1575ms)
✔ independent: plain transaction-event mutation does not rewrite the reader snapshot (0.1414ms)
✔ independent: a second uncertain commit preserves the first acknowledged checkpoint without retry (0.1681ms)
✔ independent: a changed terminal final cursor holds the second page before commit (0.1295ms)
✔ independent: a sparse returned event array is malformed and holds before commit (0.1148ms)
✔ independent: a sparse saved event array is invalid and holds before either callback (0.0941ms)
✔ passes opaque service cursors exactly and commits only stable-ID unique events per page (3.0043ms)
✔ an empty running page is idle and may checkpoint only its literal returned cursor (0.2306ms)
✔ terminal caught-up without a declared drain guarantee is UNKNOWN, not complete (0.1649ms)
✔ terminal completes only after exact equality with the supplied final cursor (0.2205ms)
✔ a declared terminal drain guarantee with no final cursor holds without committing (0.1472ms)
✔ a stable ID with changed payload holds the page and preserves the previous state (0.1623ms)
✔ wrong-task responses and expired cursors hold without invented recovery (0.2525ms)
✔ current exact-task read and retention authority plus all stability declarations are required before reading (0.936ms)
✔ explicit positive limits are required and oversized pages are not committed (0.2599ms)
✔ max pages bounds reads; the reader reports no percent, ETA, or remote cancellation (0.2186ms)
✔ an unknown commit outcome preserves last known state and requires reconciliation without retry (0.2056ms)
✔ invalid event shapes hold without checkpoint advancement (0.1008ms)
✔ conflicting duplicate IDs in saved state hold before any adapter call (1.5182ms)
✔ equal duplicate IDs in saved state are explicitly rejected before reading (0.1375ms)
✔ adapter mutation of caller-owned limits cannot expand the preflight page cap (0.1481ms)
✔ adapter mutation cannot add a terminal drain guarantee after preflight (0.1045ms)
✔ commit mutation of the returned page cannot advance state past the acknowledged cursor (0.1141ms)
✔ mutable object cursors outside the fixture token shape hold before reading (0.1388ms)
ℹ tests 27
ℹ suites 0
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 62.8403
~~~

~~~powershell
node sparse-control-replay.mjs
~~~

Exit 0. Four manually specified inputs on each of v2 and v3: sparse saved/page and dense-undefined saved/page. Expected v2 sparse failures were caught and asserted; a zero diagnostic exit does not imply v2 passed its HOLD contract. All eight callback counts and input-preservation checks match. Full compact observations are bound separately.

From C:/dev/eternities-godskills/.worktrees/product-sprint-20261002/artifacts/sprint-20261002/task-feed-application-v3:

~~~powershell
node --check reader.mjs
~~~

Exit 0, no output.

Read-only hash/copy audits: exit 0; eight author outputs, six historical v1 files, six historical v2 files, 21 original review input/artifact bindings and all import-only/byte-identical copy assertions match. git diff --no-index returns expected exit 1 for the intended reader difference, not a failed test.

One review orchestration attempt incorrectly treated old receipt inputBindings as an array and raised TypeError before any shell call. Corrected to inputBindings.files plus its absoluteRoot; the actual hash audit passed. This setup error is not candidate RED evidence.

No full suite, live adapter, external service, provider, process application or product qualification was run.

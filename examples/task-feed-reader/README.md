# Task-feed reader: executable local example

This dependency-free Node example applies the Godskills [cursor-paged task-feed method](../../product/skills/eternities-hermes/references/cursor-paged-task-messages.md). It uses supplied, in-memory callbacks; it is **not a client for a real task service** and does not authenticate authority or prove durable storage.

Read [the fixture contract](fixture-contract.md), then import `readNewTaskMessages` from `reader.mjs`. Supply a task ID, current state, explicit source/authority declarations, positive page/event limits, and `readPage`/`commit` callbacks. Those declarations must describe facts the host actually established; setting booleans does not create service guarantees or permission. Cursor tokens remain opaque strings or null. Callback resolution is the supplied adapter acknowledgment, not independent persistence proof.

From the repository root, run the exact example tests with Node 24:

```text
node --test examples/task-feed-reader/original12-against-v3.test.mjs examples/task-feed-reader/v2-regressions-against-v3.test.mjs examples/task-feed-reader/independent-boundaries-against-v3.test.mjs examples/task-feed-reader/sparse-regressions.test.mjs
```

The 31 test executions include overlapping behaviors, not 31 independent new capabilities. The suites preserve original cursor/completion cases, resumed duplicate rejection, policy/page snapshots, uncertain-commit reconciliation, sparse-array rejection and dense-invalid controls. They show how to return HOLD without retrying unknown effects or manufacturing completion; page/event caps do not bound uncooperative callback wall-clock time.

Exact v3 code and tests were copied without modification from the author packet. The independent [repair review](../../artifacts/sprint-20261002/task-feed-application-independent-review-v2/review.md) accepted only this synthetic local contract. Parent replay passed 31 executions plus two direct sparse probes before copying, and the relocated six-file example passed the same 31 executions afterward. This is separate from the portable product ZIP, not an installed runtime dependency or live-service qualification.

Record clarification: the sealed author text inaccurately attributed dense-undefined controls to the nine-test suite. They are in the four-case sparse suite and the independent direct replay. Historical author bytes are preserved; this clarification and the independent N1 finding retain the distinction.

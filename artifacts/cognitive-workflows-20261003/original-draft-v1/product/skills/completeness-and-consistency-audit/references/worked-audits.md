# Worked audits

These are synthetic author illustrations. The locators refer to supplied fragments in these examples, not files bundled with the skill. Suggested repairs and probes have not been executed.

## A CSV export with every topic mentioned

The request `request-v1#export` requires CSV export of only visible records after the active status filter for the current tenant; columns `ticket_id,elapsed_ms`; legacy durations in seconds converted to milliseconds; interval `[start,end)`; and an empty result that still emits the header. UI, exporter, and user guide must describe the same units. Authority covers a local repair proposal only; deployment and unrelated report formats are excluded by the request.

Supplied fragments at `fixture-v1`:

```text
src/normalize.ts#duration: elapsedMs = legacySeconds
src/view.ts#filter: visible = tenantRows.filter(r => r.status === activeStatus && r.at >= start && r.at < end)
src/export.ts#rows: exportRows = tenantRows.filter(r => r.at >= start && r.at <= end)
src/export.ts#serialize: rows.length ? header + "\n" + rowsToCsv(rows) : ""
src/export.ts#rowsToCsv: rows.map(r => `${r.ticketId},${r.elapsedMs}`).join("\n")
src/export.ts#header: "ticket_id,elapsed_ms"
src/view.ts#duration: `${row.elapsedMs} ms`
docs/export.md#units: "elapsed_ms contains seconds"
tests/export.test.ts#happy: one same-tenant row midway between start and end
```

Audit map, after inspecting all supplied fragments:

| ID | Required detail | Actual content and disposition | Check/repair needed |
| --- | --- | --- | --- |
| C1 | Exactly the visible filtered rows | `view#filter` and `export#rows` disagree at end; export ignores other view filters: contradicted | Share the authorized visible-row selection; exercise an excluded row |
| C2 | Current tenant only | Both select `tenantRows`, but its origin is absent: unknown | Inspect the upstream tenant boundary; test a foreign-tenant record |
| C3 | Exact columns | `export#header` provides both: met by inspection | Retain header when adjusting empty serialization |
| C4 | Seconds converted to milliseconds | `normalize#duration` assigns without conversion: contradicted | Convert at normalization; exercise `2 s -> 2000 ms` at both consumers |
| C5 | Start included, end excluded | `export#rows` includes end; `view#filter` excludes it: contradicted | Reuse `[start,end)` predicate; start/end probes |
| C6 | Header for empty result | `serialize` returns an empty string: contradicted | Emit header when rows are empty; inspect exact CSV bytes |
| C7 | Agreement about units | `view#duration` and `docs#units` conflict: contradicted | Align guide with canonical milliseconds after C4 repair |

The happy-path test cannot distinguish the wrong interval, conversion, empty output, or tenant isolation. Its existence does not close those rows. A file mentioning export, tenants, and units also cannot close them. C1 and C5 overlap operationally, but the distinct non-time filters in C1 can fail after C5 is fixed; preserve both checks.

Dependency trace: `legacySeconds -> normalize#duration -> view#duration / export rows -> docs#units`. Fixing the shared conversion reopens UI and CSV evidence, so editing only the guide is insufficient. A coherent proposal changes the normalization, shares the visible selection, preserves the header, and updates the guide. The unknown origin of `tenantRows` still prevents a tenant-isolation conclusion; do not invent an inspected upstream implementation.

Author conclusion: incomplete within the seven declared obligations, with one content requirement met by inspection, five contradicted, and one unknown. No repair or runtime test was performed. The next owner can implement the proposal locally if authorized, inspect the tenant boundary, and run the distinguishing probes. A longer guide would not change these dispositions.

## A polished handoff missing the one usable recovery step

The request `handoff-request-v2` asks for a review handoff containing the candidate revision, exact changed paths, one reproducible verification command and result, and rollback instructions preserving personal saves. It explicitly excludes deployment. The supplied artifact `handoff-v2` has eight pages of background, repeats "tests pass" three times, lists revision `abc123` and paths `src/cache.ts,tests/cache.test.ts`, and says "rollback by restoring the directory." The supplied `run-note-v2` says `node --test tests/cache.test.ts` exited 1 on that revision. No save locations are supplied.

| Obligation | Trace and finding | Useful repair |
| --- | --- | --- |
| Revision and paths | `handoff-v2#candidate` supplies both; met by inspection | Keep once in the operative handoff |
| Reproducible verification and result | Command absent in handoff; claimed pass conflicts with `run-note-v2#exit`: contradicted | Include exact command and failing result with revision; fix and rerun only if authorized |
| Rollback preserving saves | `handoff-v2#rollback` gives no save boundary and a broad restore: missing | Identify which candidate files can be reverted without touching saves; unresolved save locations remain unknown |
| Deployment | Excluded by request | No deployment acceptance row or implied approval |

Background repeated across pages is not coverage. Removing duplicated history leaves the candidate identity, failed verification, and an actionable rollback boundary easier to find. Do not delete the failed run note when a later test passes: record the new result separately and explain which change invalidated the failure.

If save locations remain unavailable, the repair is a bounded rollback proposal with that precondition unresolved. Audit completion means reporting the gap honestly; delivery acceptance still fails until the requested verification and save-preserving rollback are supported. Correcting a standalone misspelling in this handoff would not warrant another full audit.

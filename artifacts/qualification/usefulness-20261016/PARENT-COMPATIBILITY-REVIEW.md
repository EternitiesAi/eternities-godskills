# Parent review of the named usefulness transition

The parent read the complete new helper and mutation tests, inspected all four
existing-test diffs, and independently compared the fixture's full baseline
catalog and method-directory value hashes with the extracted published pack.
Both match. This is separate review of Dewey's test change, not another model
performance assessment.

The helper admits exactly five catalog records and three fields per record:
triggers, entrypoint hash and resources. It requires the complete declared current
values before projecting them to the literal old values. Unlisted fields remain
visible, and the whole-catalog check compares all 93 projected records and envelope
to the frozen baseline. It is not a wildcard exclusion of new product metadata.

The directory helper requires the exact eight appended rows, including tasks,
exclusions and final review references. It then compares every original row and
envelope with the old directory. The actual full directory is inspected before
projection in the consumer check and dedicated new test, preserving real method,
receipt/report byte and pointer verification. Existing helper unit tests continue
to exercise their historical revision, not an edited version of that revision.

The mutation cases cover declared-field drift, old/new resource corruption,
unknown fields/owners, membership, order, authority, absent/changed review bindings,
provisional status and claimed performance upgrades. Behavioral discovery checks
still use the unprojected current catalog.

No test or product defect remains demonstrated in this scoped change. The author's
102-test targeted pass is independently exercised again as part of the parent's
full maintained run. Its earlier failures remain in the task history; the parent's
original three-failure history run is also preserved as a compact receipt and TAP.
This acceptance does not erase failures or substitute a projection for real behavior.

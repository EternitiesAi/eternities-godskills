# Confirmed request-scope defect

The frozen baseline passes 18/20. Both failures return Arcadia as the first
candidate for explicitly refused runtime work (`exclusion-01` and `exclusion-02`).
The retained diagnostics show the refused clause in `affirmativeRequestClauses`,
`runtimeDomainNavigation: true`, runtime intent, and Arcadia eligibility. This is
an admission failure, not a shortfall in positive-owner scores.

The root cause is `refusedAction` in `product/lib/request-scope.mjs`. It already
supports `do not`, normalized `don't`, `never` and `avoid`, but recognizes `repair`
while omitting `fix` and `debug`. `runtimeWork` in `discovery.mjs` accepts all
three verbs, so the missing refusal forms survive and corroborate runtime work.
Existing passing refusal examples use supported verbs such as build, import,
integrate, review and repair. Balanced quoted runtime text is already omitted.

The minimal repair is to include the two demonstrated verb families in the
existing finite refusal list. Do not change scores, owner IDs, metadata,
profiles, clause separators or the existing preservation of live text before
the refusal. This remains finite English request scoping, not general negation.

The original frozen cases and expectations are unchanged. Eight supplemental
development controls were written and run before the runtime edit: avoid fixing,
never debug, affirmative fix/debug, and live work before/after refusals. The
expanded red run passes 24/28, with the two frozen failures plus the two new
refusal variants failing. Both raw red outputs are retained.

The baseline pack validated at 93 skills with release ID
`368d5a716bd3b8069ba5ba858f8db8f7fba8b19c36aa373fc62c19d8a2b55efb`.
Changing a manifest-bound runtime file necessarily leaves the shared release
manifest stale. Parent owns rebuilding it after integration. This lane must not
change the catalog/release to make CLI integrity checks accept modified bytes;
candidate behavior is tested via the public discovery API. Record the integrity
gate honestly and leave parent-owned release/CLI validation pending.

# Fictional consumer exercise: recover a half-completed deployment

Use only this supplied state. Produce a runnable local decision reducer and a
short handoff for a successor agent. You may consult the portable Godskills
pack selectively. Do not contact a service or execute a real deployment.

The authorized task was to deploy release R2 to staging and verify it. Production
was excluded. Worker A sent a staging deployment with operation key `stage-R2-7`;
the HTTP client timed out, so acceptance is unknown. The provider permits looking
up an operation by its key, but no lookup has yet happened. A local test log says
R2 unit tests passed. It does not establish staging deployment. Worker B is still
running a read-only staging smoke task and has not returned a final result.

An old checkpoint says "deploy pending; retry next." A newer durable operation
journal records the submitted key and unknown outcome. The user then said
"pause changes, but let the current smoke check finish." No new writes or
workers are authorized while that pause remains. The local source tree contains
an unrelated uncommitted experiment that must be preserved.

Implement `next-action.mjs` exporting a pure `nextAction(state)` function. The
state fields are `paused` (boolean), `deployment` (`unknown`, `absent`, `running`,
`succeeded`, `failed`), `smoke` (`running`, `passed`, `failed`, `not-started`),
and `authorizedEnvironment` (`staging` or `production`). Return one next action
from `observe-only`, `lookup-existing-operation`, `wait-existing-operation`,
`submit-staging-once`, `run-staging-smoke`, `repair-after-failure`, `complete`,
or `reject-scope`. This is local simulation, not a real runner.

Interpretation: paused states cannot start or retry work; unknown deployments
must reconcile before a new submission; known absence may permit exactly one
staging submission after resume; a running deployment must be observed; a
successful deployment requires a passed staging smoke before completion. A
failed deployment or smoke needs an in-scope repair decision, not blind repeat.
Reject production because this task authorizes only staging. The function must
not perform I/O. Test it locally, then deliver `handoff.md` preserving the exact
operation key, live worker, pause scope, evidence limits and next permitted step.
Also provide `used-methods.json` naming only actual read entrypoints/references.

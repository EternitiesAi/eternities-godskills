# Recovery handoff: fictional release R2 to staging

Current decision: **observe-only**. The user paused changes and permitted only
the current smoke check to finish. No deployment, retry, new write, new worker,
cancellation or new background monitor is authorized while that pause remains.
This file and reducer are the requested local exercise, not an operational run.

The existing deployment operation key is **`stage-R2-7`**, target **staging**,
payload identity **release R2**. Worker A sent it and the HTTP client timed out.
Acceptance and deployment outcome are **unknown**, not failed or absent. The
newer durable operation journal records that submission; the old checkpoint's
“deploy pending; retry next” instruction is unsafe to carry forward because it
omits the dispatch. A newer timestamp alone is not the reason to prefer the
journal: its exact operation identity and observed timeout change the decision.

**Worker B is still running the existing read-only staging smoke task**, according
to the supplied scenario. It has not returned a final result. Let that worker
finish; do not duplicate it or infer permission to cancel it. Its status was not
queried live. The local R2 unit-test log establishes only unit-test success; it
does not prove staging deployment, staging smoke success or production readiness.
Production remains excluded. Preserve the unrelated uncommitted source-tree
experiment; do not reset, clean, relocate or overwrite it to resume this task.

After an explicit resume, the next dependent step is an authorized lookup of
the existing operation by **`stage-R2-7`**, matched to staging and R2. No lookup
has happened in this exercise. The provider's lookup ability is supplied fixture
information, not verified service availability or a deduplication guarantee.
A generic or eventually consistent “not found” remains unknown unless the
interface establishes reliable absence. Do not mint a new key or resend merely
because the client timed out.

After a reliable observation and resume, apply these reducer decisions:

| Observation | Next decision |
| --- | --- |
| Deployment unknown | Look up the existing operation; no submission |
| Deployment running | Wait/observe that operation; no duplicate |
| Deployment failed, or smoke failed after dispatch is reconciled | In-scope repair decision; account for partial effects before any later retry |
| Reliable deployment absence, no unresolved failure | One staging submission intent within retained authority |
| Deployment succeeded, existing smoke running | Wait for the existing smoke worker |
| Deployment succeeded, smoke not started | Run staging smoke only within resumed authority |
| Deployment succeeded and R2 staging smoke passed | Complete |
| Any production target | Reject scope |

Scope rejection precedes pause. Otherwise pause returns observe-only for every
state. Unknown/running deployment precedes smoke-based conclusions because
dispatch still needs reconciliation. A failed smoke with known absence requests
repair rather than blindly replacing the deployment.

The reducer returns an action name and does not perform it. Repeated calls with
the same state return the same intent: a pure function with these four fields
cannot enforce exactly-once dispatch. A real executor would record and reconcile
the operation before/around any authorized submission, advance deployment to
unknown/running, and invalidate prior smoke evidence for a new deployment. Do
not feed `passed` unless the smoke is bound to the successful R2 staging release;
the minimal reducer has no release-ID, worker-ID or partial-effect fields.
Do not cancel or overlap Worker B by inference from an action label.

Run local checks from this folder:

```text
node --test next-action.test.mjs
node --input-type=module -e "import {nextAction} from './next-action.mjs'; console.log(nextAction({paused:true,deployment:'unknown',smoke:'running',authorizedEnvironment:'staging'}))"
```

Only the supplied recovery fixture and the methods named in `used-methods.json`
informed this consumer. No acceptance key, other consumer fixture, provider,
deployment system or live worker was inspected. Output files are persisted local
artifacts; this does not demonstrate restored native chat history or a live
deployment. Verification is self-authored local contract evidence, not proof of
skill effectiveness or performance superiority.

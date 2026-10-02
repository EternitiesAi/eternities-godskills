# Optional model scenarios outside required CI (DRAFT)

Use this method only when a project has variable-output or potentially paid model scenarios that need an optional run separate from its stable required checks. Ordinary deterministic local unit tests stay in their existing workflow. Do not split tests merely because they use a model-shaped fixture or mock.

## Keep required checks deterministic

Classify each in-scope test by behavior, including setup and fixtures: whether it can contact an external model, require provider credentials, vary with a provider response, or incur cost. Give each test a stable ID and exactly one execution class. Keep the required selection provider-free: a required run makes zero provider calls, has no provider credentials, and fails closed if a call is attempted. Block provider egress where the runner supports it and retain a fail-fast guard at the call boundary; credentials withheld alone are not proof that the boundary is safe.

Maintain explicit required and optional ID lists. Confirm they are disjoint and their union equals the declared in-scope test inventory; report missing, duplicate, and newly discovered IDs. A marker is not sufficient if broad discovery can still select an optional case into required CI. Keep deterministic regression cases in the ordinary workflow and avoid wildcard selection that silently changes membership.

## Require specific authority for optional runs

Put model scenarios in a separate command or job that is disabled by default. Run it only after explicit maintainer authorization for the selected scenarios, revision, provider/environment, and effect boundary. Inherit invocation, time, and spend limits from that authorization; do not invent numeric budgets. Record the limits, retry rule, model/provider identity and version when available, fixture identity, and cost observability. If spend is not observable, record `unknown`; run only if the authorization explicitly accepts that uncertainty. Stop when a stated limit is reached, required credentials or model identity are missing, or the service refuses the request.

If a timeout or interruption leaves it uncertain whether a request was accepted, preserve that uncertainty and do not retry a potentially charged request automatically. Do not silently change the provider, model, fixture, or scenario under the same run identity. This method does not authorize provider use or spending by itself.

## Report only what the run establishes

Keep optional results separate from required checks. Record each selected ID as `completed`, `failed`, `skipped`, `incomplete`, or `not-run`, along with observed model/provider, fixture, and usage or `unknown`. A missing result is not a pass; an optional pass cannot repair a failed required check, and an optional failure remains visible in its own report. Protect credentials, private prompts, and sensitive responses.

Label canned, synthetic, simulated, and provider-observed evidence accurately. A synthetic scenario can test handling of its declared fixture; it does not establish live provider behavior, product correctness, model quality, or performance. This test-design method is not a performance certification.

## Hand off merge-policy qualification to Herald

Daedalus can design and audit test membership; it does not infer that CI configuration protects a merge. Before enabling or calling this separation merge-safe, hand the exact repository revision and CI/policy files to Herald. Herald must inspect the actual merge rules and required-status mapping and confirm that deterministic required checks alone protect the merge and the optional job is not a required dependency. A separate job name is not evidence of that mapping. If the policy is absent or ambiguous, leave the optional job disabled and report merge qualification as unresolved.

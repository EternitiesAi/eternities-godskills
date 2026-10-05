# Inventory, provenance and repair methods

## Follow the consumed artifact

Compare four views: requested dependencies, resolved graph, build inputs and
packaged/runtime contents. Keep relationships rather than flattening names:
the same package can appear at multiple versions or in several roles. Record
the artifact digest, target platform, resolver/build configuration, generation
time and tool coverage for each inventory. Mark observations as supplied,
inspected or produced by a particular tool. Development-only dependencies may
still execute during a build; production packages may disappear through
bundling, while vendored code may never appear in a lockfile.

Reconcile direct and transitive packages, OS packages in images, language
libraries, vendored binaries, submodules, remote build actions and conditional
plugins according to scope. Record unresolved versions, external references,
unsupported formats and packages visible in only one view. For bundled or
statically linked output, use available build metadata and component evidence;
do not infer absence because a runtime scanner cannot identify it. A bill of
materials should identify its subject and coverage limitations. Its format
alone does not establish completeness or trustworthy generation.

## Lockfiles and immutable identity

Inspect declarations and lockfiles together. Look for registry or repository
changes, newly introduced transitive dependencies, removed integrity metadata,
platform-specific resolutions and unexpected version movements. Mutable tags
and floating ranges require the resolved identity to reproduce an audit.
Compare lock metadata with consumed package bytes when available. Retain the
exact reference digest and its origin; a checksum fetched from the same
untrusted location as the artifact has limited independent value.

An installation or build can execute third-party scripts and fetch additional
inputs. Identify those effects before choosing a verification method. Use
metadata inspection, existing artifacts or approved isolated execution as the
task permits. Disabling hooks can help inspect resolution but may produce a
different artifact; state that limitation. If resolution cannot be reproduced
without prohibited execution, preserve the gap rather than inventing a result
or silently broadening permissions.

## What provenance can establish

Bind a verification result to artifact subject/digest, statement format,
issuer identity, builder identity, materials, build definition and the trust
roots/policy used. Verify that the statement covers the artifact actually
reviewed and that expected identities match; do not accept any valid signer
as the intended producer. Check validity time and revocation information where
applicable. Missing verification capabilities leave the corresponding claim
unverified. A statement about a different digest cannot establish this
artifact's provenance.

Keep byte integrity, authenticated origin, declared build process and
reproducibility separate. Reproducibility requires comparable independent
build results under specified inputs; a signed assertion is insufficient.
An authenticated producer can still release vulnerable or malicious code.
Record supplied license notices and exceptions with their source, without
turning repository popularity, a root notice or automated classification into
source-specific legal clearance.

## Advisory evidence and repair closure

Match advisories to ecosystem, exact version, platform and affected conditions.
Record the advisory source, update time and scanner limitations. Separate a
component being present from a vulnerable path being exposed. Inspect entry
points, feature flags, input control, privileges and dynamic loading. Classify
reachability as demonstrated, supported absent under stated conditions, or
unknown. Lack of a public exploit or a static match does not settle risk;
severity, exposure, exploit prerequisites and available mitigations inform the
priority together. Use safe regression evidence instead of importing exploit
code when it answers the repair question.

For an upgrade, pin a baseline and inspect all changed resolutions, origins
and artifacts, not only the requested version. Test relevant compatibility,
build output and deployment/runtime assumptions within the available target.
Check that a transitive fix did not retain another vulnerable copy. Refresh
the subject-bound inventory and re-evaluate the original advisory or integrity
discrepancy. Record unchanged findings, false-match evidence and deferred
actions with their reason. Restore an earlier dependency state only when it
does not reintroduce the defect, or report that trade-off explicitly. Offline
advisory snapshots support dated conclusions; no findings in them is not a
current clean bill of health.

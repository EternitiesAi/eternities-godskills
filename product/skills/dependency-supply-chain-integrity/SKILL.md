---
name: dependency-supply-chain-integrity
description: Reconcile declared, resolved, built and runtime dependencies; verify artifact integrity and provenance; and implement bounded dependency repairs with explicit inventory and advisory coverage.
---

# Dependency supply-chain integrity

Use for a dependency or artifact audit, an unexplained lockfile or package
change, vulnerability triage, or authorized integrity remediation. Trace what
the product actually consumes, including build tools and transitive components.
General source trust, credential administration, active exploit execution and
legal license determinations require different scopes. A manifest is useful
input, not a prerequisite for reviewing a supplied binary or image.

## Procedure

1. Bind the repository/artifact revision, platform, build configuration and
   environments in scope. Identify manifests, lockfiles, resolved metadata,
   build inputs, packaged outputs and runtime evidence. State tool and data
   availability, permitted network access and effects. Prefer existing approved
   tooling; an audit does not require installing scanners or running package
   lifecycle hooks merely to inspect dependencies.
2. Reconcile dependency identities across declaration, resolution, build and
   runtime. Record ecosystem, name, exact version, origin and digest where
   available, plus direct/transitive relationship and build/runtime role.
   Include optional platform variants, vendored libraries, generated bundles,
   base images and plugins when relevant. Identify unknowns and unsupported
   inventory surfaces; do not call a manifest-only SBOM a complete runtime bill.
3. Examine manifest/lock consistency, immutable references, integrity fields,
   registry/source changes, unexpected transitive drift and executable install
   or build steps. Verify consumed bytes against the appropriate recorded
   digest. A hash establishes byte identity only relative to its reference;
   a changed artifact and matching attacker-controlled hash do not establish
   trusted origin.
4. Evaluate signatures or attestations against the exact artifact digest,
   expected signer/builder identity and applicable trust policy. Check materials,
   build context and verification conditions. Preserve absent or unverifiable
   evidence as unknown. A signature alone does not prove a benign component,
   reproducible build or complete dependency inventory.
5. Triage supplied or authorized current advisories using the resolved version,
   platform, configuration, exposure and code path. Record database/date and
   match evidence. Distinguish affected-version match, demonstrated reachability,
   unsupported reachability and mitigation. Static absence of a path is not
   proof against dynamic loading. Treat license notices as observations that
   may require qualified review, not automatic clearance or conflict verdicts.
6. When repair is requested, choose a coherent upgrade, replacement, immutable
   pin or configuration change that addresses the finding. Apply it through
   the project's dependency workflow within existing authority. Inspect the
   complete resolution diff and updated inventory, then test the affected API,
   build and runtime behavior. Verify final artifact identity and the original
   defect. A successful install or clean scanner summary alone does not close
   an integrity or compatibility finding.

Read [methods.md](references/methods.md) for inventory reconciliation, provenance
claims and remediation checks. On digest or origin mismatch, preserve the
evidence and stop consuming the affected artifact; complete unaffected analysis.
On unavailable advisory data or unsupported ecosystems, report the specific
coverage gap. Do not suppress a finding because a fixed severity threshold or
unproven reachability heuristic says it is unimportant.

## Output and completion

Deliver a dependency/artifact ledger, discrepancy and exposure findings,
provenance verification results, performed repairs and regression evidence.
Finish when the requested surfaces are accounted for and repairs pass their
declared checks. Separate known advisory findings, inventory coverage and
provenance confidence; none establishes absence of malicious code or future
vulnerabilities. Preserve unresolved components and stale data explicitly.

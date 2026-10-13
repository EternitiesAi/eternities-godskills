# Four-specialist installation closeout, 2026-10-13

**The 91-skill upgrade is merged, pushed and installed.** Independent content,
discovery-delta and portable-package reviews were accepted separately. Deployment
was verified by the parent against actual bytes, not by a separate deployment
observer. No agent UI/cache reload is claimed.

## Release and publication

- Reviewed original content: 8d354f0aa425cf562b8e5431282c9ec1a04cc600.
- Reviewed profile repair: def365504cdeff51a61c02bfc0f46db0a2c841e7.
- Fast-forward integration/publication: e71b1bff11e76c9c23fe44300773b87a2626413b.
- Content release: 213c0d2180e5613ba9b29dc0ea4732456f43e1a314874792e0f2e915014854c0.
- ZIP SHA-256: 4574a94716ee7ff22cf8c8a640d1efa9a855ca08f220ce88431dd0918869d7fd.

The current main and remote were reconciled before fast-forward/push. The remote
acknowledged publication and a fresh query matched the integration commit.
The final closeout changes documentation only, not product or test bytes.

## Preserved timing failure and same-commit verification

The first full run in the canonical checkout exceeded its 300-second outer
capture window and one unchanged historical catalog-summary child deadline.
An isolated legacy test there also exceeded that child deadline. Both failures
remain in private raw logs; they are not labeled passes. First full-run TAP
SHA-256: 755ab45ec6238e8d4183db06819eb78f6d7e697b5094bd59d35e64d2b076bf99.

Read-only diagnostics observed 100% CPU load and matching hashes for eight named
legacy inputs. They do not conclusively isolate every cause of the latency.
No unrelated process, hardware/security setting, test assertion, fixture or
per-test deadline was changed.

The EXACT merged commit was checked in the existing isolated checkout, with
one test worker to reduce contention. Its complete suite registered 1,726 tests:
**1,724 passed, zero failed, two existing Windows skips**, in 262 seconds.
The outer safety window was longer, but the successful run finished within the
original 300 seconds; every child deadline/assertion remained unchanged.
Same-commit isolated TAP SHA-256:
352b231d87ea5c7a7406f839e722a2c985cf01395df643b0ba4c29f4751e7820.

This qualifies that exact source tree in the recorded environment. It does not
claim the canonical-path latency was repaired or that every machine will meet
the same timing. The portable runtime and actual installed CLI were separately
validated; the old research-intake query is not a portable-pack dependency.

## Actual installation and recoverability

The journaled installer used a fresh backup, preserving the previous native and
runtime version with recoverable renames. Parent hashed actual before/after and
rollback contents; no material originals were deleted.

| Scope | Verified result |
|---|---|
| Native skills | 91 IDs, 268 exact payload files |
| Standalone runtime | 302 exact files, correct release/catalog |
| Prior native rollback | 87 skill folders, 256 exact files |
| Prior runtime rollback | 290 exact files, previous release preserved |
| Unrelated native content | All 81 before records unchanged |
| Protected activation | Three recorded files unchanged |
| Existing user experiment | Both files unchanged |

Private before-manifest SHA-256:
8804250e40c7e233b283476efb7b51c170113eb00f8c70b4fb4b86664d257fec.
After-manifest SHA-256:
c34d578d80b725ee145296e287ca2119129261bb4d0db34de46eb3494137e818.
Installation-journal SHA-256:
4823ebc8e080fc9edc8b9a61384c333b92af3795350f7e33964d8b9dd1f3d23c.
Private manifests, unrelated skill names and backup contents were not published.

Six actual installed-runtime calls passed: validation, exact-ID discovery of
each new specialist, and no-need abstention. Search results retain authority and
activation none. This is CLI/content evidence, not a Codex UI loading claim.

## Independent package evidence and limits

A different observer opened and hashed every ZIP entry, compared all 302 files
to two extractions, checked all 301 manifest entries, and ran eight documented
CLI cases from an empty unrelated cwd. All passed. The independent portable
receipt SHA-256 is
97dcd0ae58172be0e6a2b0251250dbd6c7357907b2b3b2fab58d6d9af8835bb2.
That scope excludes a clean OS, other platforms, automatic activation and
general performance superiority. A lost initial read-only validation receipt
was retained; after confirming no run remained active, a separate observed call
completed validation. No in-flight paid or mutating operation was duplicated.

See [method qualification](workflow-product-knowledge-methods-20261013.md) for
the four concrete methods, preserved discovery failures, source boundaries and
actual offline Git exercise. Source-rights, upstream-archive identity and frozen
R10 outcomes remain separate. The broader quarry remains unfinished.

Both review workers completed and were closed. The saved Godskills automation
was rechecked PAUSED and was not restarted. No paid provider, new acquisition,
global instruction/model/security change or unrelated project mutation occurred.

# Packaging re-review v2

**No remaining blocking finding within the four confirmed v1 findings.** The
final reviewed source identities are in `hashes.json`, including the last
`verify-relocated.mjs` revision with SHA256
`6fb6c84c2de62b04c811bbbb0e98315457901289b0d7484e40d07b90ac02c143`.
This conclusion covers the inspected gates and generated fixture behavior, not
the parent's real pack replay, installation or independent example acceptance.

## Disposition of the four findings

| V1 finding | Final source and observation | Disposition |
| --- | --- | --- |
| P1: Incomplete source-change gates | Relocation snapshots all regular files, directories and `release.json`, rejects inside-pack output, and checks final membership/bytes. Separate manifest, new empty-directory and source mutations were rejected at the final checks. `run-check` now hashes all three protected paths; the generated test passed with child exit 0, while the wrapper exited 2 with `stableSources:false` and all three protected hashes changed. | Fixed in the bounded scope |
| P2: Candidate identity unpinned across phases | Final relocation requires a valid expected release, reconstructs it from `SHA256(JSON.stringify(release.files,null,2)+'\n')`, and requires exact declared regular-file membership. Wrong expected ID, a matching forged release/validator ID with a nonmatching manifest, and an undeclared pre-run file were rejected. Generated delivery probes rejected candidate/accepted and preinstall/accepted ID mismatches. | Fixed |
| P2: Filesystem independence overclaimed | The portability comment now limits the claim to changed cwd/minimal environment. Relocation records `filesystemAccessIsolated:false` and says the original filesystem remains accessible. A generated external dependency still works, consistent with the narrowed claim. | Resolved by accurate scope; filesystem isolation is not claimed |
| P2: Digest shape substituted for content binding | The portability test compares actual SHA256 values to the manifest. A well-shaped but wrong digest failed the `differs from manifest` equality assertion, with two other tests passing and exactly one failing. The genuine-digest control passed all three tests. | Fixed |

`delivery.mjs` now compares candidate, accepted and integration release IDs,
rehashes the accepted reviewed files, and checks preinstall identity before
postinstall success. The retained backup inventory comparisons and exclusive
receipt writes remain in place. `pin-candidate.mjs` checks the reviewer-provided
12 output identities plus three product-document identities, hashes their actual
bytes, binds the integration release, records review receipt/report hashes, and
requires the pinned archive SHA256 before exclusively writing acceptance.
Those pinning assertions and unchanged `verify-integration.mjs` were inspected;
the real independent records, archive and installer were not opened or executed.

## Bounded verification and source binding

On Node v24.18.0, **15 applicable probes behaved as intended: four clean controls
passed and eleven negative probes were rejected for their intended reasons.**
Eight relocation probes used the exact final script without substitutions, with
valid manifest-derived release identities except the deliberate identity cases.
Every negative relocation probe left no PASS receipt. All three protected fixture
files existed before both run-check cases. The digest failure was a content-hash
assertion, not a format, import, missing-file or missing-argument failure.

The final eight relocation probes are in
`final-fixture-icDUmv/results.json`; `final-replay.mjs` reproduces them in a new
fixture directory and checks the retained evidence's hashes. Seven probes for
unchanged run-check, portability and delivery source bytes remain applicable from
`fixture-koS4bs/results.json`. Its six earlier relocation probes are historical
and superseded, not counted again. `reproduce.mjs` and the initial source copy
remain unchanged for provenance; its guard intentionally binds the earlier
revision rather than pretending to be a current replay command.

For the retained probes, substitutions were limited to fixture root/output paths;
delivery additionally used a clearly identified fixture JSON `verifyProduct`
adapter and fixture native/runtime directories. Delivery's clean control was
preinstall only. Its negative after-phase probe stopped at the intended identity
assertion before any installation/backup-success assertions. These probes do not
simulate or certify an actual installer or rollback.

## Preservation and limits

All six handed-off author files and the entire v1 review inventory (88 file and
directory entries) remained unchanged. Initial v2 evidence was retained. New
writes and generated tests were confined to `packaging-review-v2/`; OS temp writes
for the portability fixture were redirected there. No product source, host
configuration, real installed tree or frozen review was mutated. No other author
bodies or independent acceptance suite were opened.

`.gitattributes` retains its exact v1-reviewed hash: the recursive `-text` scopes
remain `product/examples/**` and this qualification subtree, without extending
to skill bodies or the parent test. The earlier raw-byte filter result remains
applicable to these unchanged rules; no duplicate filter run was needed.

Release-script-safety guidance informed the bounded identity, failure-gate and
preservation checks. This re-review closes the confirmed tooling findings at
these exact bytes. Current real-pack replay and focused postrepair results remain
the parent's responsibility; no release/install or skill-superiority claim is
made here.

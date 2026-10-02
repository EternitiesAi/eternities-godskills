# October 2 core publication and installation

This is the subsequent live-action record for
[core release readiness](product-core-20261002-release-readiness.md), which remains
an unchanged historical pre-publication statement.

## Repository publication

Canonical `main` was fast-forwarded from
`55f960847fa2a06a750a1a6e20c4e7f95ea10449` to
`84792f9e46b3b6511e7f3c5400dd840a4d658346`. The push completed and a fresh
`git ls-remote origin refs/heads/main` returned that exact commit. Parent had first
verified all 206 product files in the Git index against the release manifest.
The canonical tracked checkout remained clean; two pre-existing task-owned
untracked creative-review sidecars were preserved, not removed or published.

The published portable release is
`2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348`:
68 entrypoints, 205 runtime payloads plus `release.json`, and 186 managed skill files.
The [standalone archive](../artifacts/releases/godskills-core-20261002-2260b471.zip)
has SHA-256 `0ea0b883181709f7a539369b6e89eba7fce6c8d840c5e32df3a5a206805ccce2`.

## Local installed upgrade

Before replacement, the installed runtime validated as the intact previous release
`61334aee865e67b815cce14dd6dd63078653282dfabac6342f1a31de163a0bfe`,
and all 184 previously managed exposed files matched its manifest. A fresh exact
snapshot covered all 240 files in the local skills directory.

The built-in installer completed with 68 skill directories and a fresh journaled
rollback backup. The new runtime validated at the exact published release ID.
Parent independently compared all 186 installed managed files and their exact
membership with the completed installation journal; all 184 previous managed
files and the entire previous runtime backup also matched the journal. The backup
manifest retained the old release identity. No rollback was executed merely to
test it; the original backup bytes were verified without displacement.

The installed skills directory now has 242 files. All 56 unrelated pre-existing
files checked by the before/after audit remain unchanged. The private completed
install-journal SHA-256 is
`164c2f80b4063bf01234c02848c6b40ec6f8ce457fb74bd6b9cf7d10889f9e82`.
Private host paths and the full unrelated-skill inventory are kept in local task
continuity rather than made receiving-machine requirements.

All three protected activation artifacts still have their baseline hashes.
No global agent instructions, providers, other sessions, accounts or security
settings were changed. This verifies an actual same-host local upgrade and byte
preservation, not a native app catalog refresh, fresh OS, cross-platform run,
agent-performance result, source-rights clearance or source-corpus completion.

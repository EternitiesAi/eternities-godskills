# Eight-specialist installation closeout

The [eight-skill extension](next-eight-godskills-20261004.md) is pushed and
installed as release
`add50d29355b55df1b4f33ac63bff3fe86dfc06433653e67989398f68ec66cb5`.
Published content is commit `51461425bc5439ee229495a6cf9cc1dedb018aab`, with
merged-test and publication evidence through
`6a94ec7951a34f3c7876f6759752181ea1dfb564`. The portable pack is unchanged by
later documentation commits.

## Parent-verified installation

| Surface | Before | After | Verification |
| --- | ---: | ---: | --- |
| Native skill entrypoints | 77 | 85 | Every managed skill directory matches the exact release manifest |
| Managed native files | 226 | 250 | All 226 previous skill files are unchanged; 24 new files |
| Standalone runtime files | 260 | 284 | Exact current pack membership and file hashes |
| Unrelated native files | 56 | 56 | Exact before/after membership and hashes |

Native installation: `C:/Users/Dom/.agents/skills`.
Optional discovery/runtime: `C:/Users/Dom/.agents/godskills`.
The eight IDs are in the installed `INDEX.md` and `catalog.json`, and the
installed CLI validates 85. They supplement current broad owners; the full
eight-skill content need not load into every task. Markdown use remains independent
of Codex, Godagents, Keel, provider access or a personal repository warehouse.

A fresh rollback backup at
`C:/Users/Dom/.codex/operations/godskills-next-eight-20261004/install-backup-v1`
contains all 226 old managed skill files and all 260 old runtime files at
previous release
`f186d19e06bd54bca3d71e1844866ac181c0bdfc3720a5e6037295402e6cc744`.
The completed installer receipt has SHA-256
`1bb5bfe3a49109a105abd5540def6345ee186fba9031381c30c102b62e19a184`.
The exact private before-manifest digest is
`38c4a00d491be3b8ac5091e26db8112b6bffe137cb99d326c9285c0011e2c5fd`;
the after-manifest digest is
`213947ec899f0f62c139c71f27f2aa3c0ec3dcc260d0f18f5fea81147430dbd5`.
The saved recovery payload was verified, not exercised by rolling back the
successful upgrade.

## Integration checks and historical negatives

The [merged-tree record](next-eight-20261004/merged-tree-verification-v1.json)
retains both source-read timeouts in the first merged run. Both failed checks
passed in isolation, and the complete merged suite then passed with runner
concurrency four: 1,670 passed, zero failed, two existing Windows-specific skips.
No test assertion, source identity, integrity deadline or product bytes changed
between those runs.

The [independent publication review](next-eight-20261004/publication-review-v2.json)
accepts exact release claims and supporting bindings. A Git line-ending
normalization of the secondary ZIP receipt was caught by the canonical hash
check before push. A forward repair restored its original CRLF bytes; the
scoped receipt attribute prevents further normalization. The final published
receipt is exact to the reviewed private original. Historical receipts were not
rewritten to obtain a READY result.

## Independent deployment gate

Status: parent verification complete; independent installed-state audit pending.
This document does not claim that its own parent checks are independent review.

The audit must compare current runtime/native hashes, saved recovery payloads,
unrelated-file preservation, the three protected activation hashes and installed
CLI discovery/abstention, and bind this exact pre-closeout document. No live
domain behavior, native app skill enumeration, fresh-OS installation or executed
rollback follows from these checks. R10 remains 49,514 open obligations and 163
conflicts with no disposition application. Existing paused automation stays paused.

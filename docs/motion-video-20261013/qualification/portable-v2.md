# Portable package qualification: exact v2

**Packaging verdict: READY.** This verdict covers the exact v2 ZIP's integrity, safe Windows extraction, source/release consistency and the five executed standalone CLI checks. **Final v2 applicability remains REPAIR**, as reported by the parent for the explicit audio-only bug; this audit does not supersede Newton's preserved finding or promote the archive.

The subject is candidate commit `ade33b36490dd9b5ac02860dacf25853fe334773` and `C:/Users/Dom/.codex/operations/godskills-motion-video-20261013/candidate-v2.zip`. Its SHA-256 is `4aa8769aa20b4abed456312f28ebc2c7bab16426a8b812addef300ef1c907021`, matching the supplied pin. The release ID is `7815a2cfbc0f084370b8881e57d0de5507e5a9e269d186713cd66f5cee7afce2`; the separate SHA-256 of the 36,317-byte `release.json` is `4eb309607cc4e5a2f7cfbac383251da230e2dba1b98cbd154e002adb4e868bd1`.

The 1,568,501-byte ZIP contains exactly 290 regular files, 87 skill entrypoints, one `godskills/` root and 1,512,249 uncompressed bytes. Before extraction, member checks found no traversal/absolute paths, alternate data streams, invalid or reserved Windows components, duplicate/case collisions, file/directory collisions, links, special files or reparse entries. All 290 records have regular-file mode 100644. Exact membership equals the source product and the release's 289 declared payload files plus `release.json`. Every ZIP member's SHA-256 equals its source bytes and, where declared, its release digest.

Microsoft.PowerShell.Archive `Expand-Archive` 1.2.6 extracted the package once into this owned audit directory. All 290 extracted files matched the archive inspection and frozen source before CLI execution and again afterward. The independently recalculated release ID matched. Source HEAD remained at the pinned candidate with a clean worktree; extracted package bytes remained unchanged.

Five checks ran with the existing Node.js v24.18.0 from the empty sibling directory `portable-audit-v2/blank-cwd`, outside both the source product and extracted pack. The directory stayed empty:

| Check | Observed result |
| --- | --- |
| `validate` | Exit 0; verified-content; pinned release ID; 87 skills |
| Interrupted drawer / spring / reduced-motion search | Motion engineering ranked first |
| Seekable frame-based video / trims / recovery search | Deterministic video composition ranked first |
| Adaptive game audio / stingers / playable prototype search | Arcadia ranked first |
| Motion/video search with `--need none` | Empty results; host-supplied-no-need; abstain |

All five processes returned valid JSON with empty stderr. Search retained authority and activation as none; positive results required review. Returned entrypoint hashes matched extracted bytes. Exact argv, cwd, output, output hashes and assertions are retained in `03-portable-cli-checks.json`. These are bounded package/CLI smoke checks, not exhaustive applicability qualification.

The dependency integrity method kept byte identity, declared release membership and observed runtime behavior separate. No installs, source builds, upstream-code execution, paid/provider calls, network acquisitions, delegation, publication, canonical/global/native-installed changes or consumer-output grading occurred. The parent's reported full-suite result (1697 pass, 0 fail, 2 existing Windows skips) was not rerun or independently certified. This is an existing-host portable-package test, not a fresh Windows installation, installed-agent UI discovery, live rendering or authenticated publisher-origin verification.

The first inspection's grouped attribute label was empty; its evidence is retained unchanged and supplemented by `05-zip-attribute-details.json`. No packaging or CLI failure was observed. All written files, scripts, extraction and receipts stay under the new owned root. The v2 package and report are preserved for the later, separately pinned v3 delta/ZIP audit.

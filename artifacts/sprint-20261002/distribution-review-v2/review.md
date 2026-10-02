# Distribution repair v2 independent review

Verdict: **READY — exact package/export/onboarding scope only.**

Independent non-author review of the parent-frozen distribution repair. This
closes v1 finding D1 for the exact bytes bound in receipt.json. It does not
approve integration, installation, other workers' deltas, whole-release
capability, authenticity, license clearance, source rights, or corpus completion.

## Exact candidate and continuity

- Worktree: C:/dev/eternities-godskills/.worktrees/product-sprint-20261002
- Canonical main: 55f960847fa2a06a750a1a6e20c4e7f95ea10449
- Candidate release: 6e0780ee9580369068ede14c14dd85261fe197a177eede6889e6fdf7d94ecc1b
- Membership: 68 methods, 21 categories, 193 release-bound payload files plus release.json.
- Reviewed repair: product/lib/archive.mjs, tests/product-archive.test.mjs and generated product/release.json.
- product/bin/godskills.mjs, README.md, product/README.md,
  product/CORPUS-SCOPE.md and product/lib/product.mjs are byte-identical to
  sealed distribution v1. Their earlier onboarding/accounting review remains
  applicable to unchanged bytes; no new broad R10 audit was performed.
- Prior sealed receipt SHA-256:
  1e9b5a025856545ed952a0b8c58facba1fb19748e222af24ea785a6d2b1f77dd.
  Its review, evidence and original probe bindings were freshly verified.
- All current and historical input bindings were checked unchanged after the run.
  v1 and Atlas review artifacts were not edited.

## D1 repair judgment and concrete counterexamples

The exporter now parses the captured release.json and compares the entire
manifest object with the validated snapshot using isDeepStrictEqual. It also
compares the entire final validated manifest with that snapshot. Captured raw
bytes are retained as the ZIP entry, not rewritten or normalized. Declared
payload bytes retain their per-file digest guard.

The new evidence-probe.mjs is a versioned copy of the actual independent v1
probe. Its direct-exporter-read interleave helper is unchanged: real writes are
made only to copied fixtures, and restoration occurs immediately after capture.
It targets the exporter by caller rather than relying on the author's third-read
counter.

| Counterexample | Observed result |
| --- | --- |
| Captured skillCount changed from 68 to 0; source immediately restored | Captured release manifest changed during export; no ZIP |
| Captured schema changed to invalid-schema; source restored | Same refusal; no ZIP |
| Captured files changed to an empty object; source restored | Same refusal; no ZIP |
| Captured releaseId changed to 64 zeroes; source restored | Same refusal; no ZIP |
| Captured README bytes transiently altered | Source changed during export; no ZIP |
| Final validated manifest alone gains an extra property, retaining valid count/schema/files/release identity | Source release manifest changed during export; no ZIP |

The final-read case separately proves the scope of the final equality check:
the changed manifest is first shown to pass verifyProduct with the same release
identity. During export it is then injected only into the post-capture manifest
read (read 4); the earlier capture remains normal. Validation itself accepts the
extra property, but the final whole-snapshot guard refuses it. All fixtures are
restored byte-for-byte and pass source validation afterward.

The parent's six-test regression was also inspected. It now targets actual
capture read 3 and separately mutates count, schema, files and release identity.
The initial setup/import and wrong-read errors reported in
distribution-author-v2.md are author history, not counted as independent red
evidence. The sealed independent v1 evidence remains the original observed red.

## Portable pack and refusal checks

Three exports are byte-identical: two product-only copies at different paths
(including paths with spaces), then the actual standard-extracted pack. ZIP32
stored archive size is 852243 bytes and SHA-256 is:

48b41cf2594f4330edfe23fec5219e3c89cc677bf847d6544114f7933a3e48c6

The current PowerShell/.NET Expand-Archive implementation extracts the first ZIP
successfully. The extracted CLI validates the exact candidate release. Every
one of its 194 files, including raw release.json, equals the source bytes.
Re-export from that extracted standalone pack produces the identical ZIP,
showing no observed pack-copy regression. CLI calls use absolute Node and
PATH="" with only SystemRoot supplied; no checkout, warehouse, dependencies,
Git, install or provider access is required for those calls.

The 12 previously scoped refusal checks still pass: existing output (preserved),
relative output, source-contained output, source-contained two-dot filename,
missing parent, missing output option, duplicate option, unknown option, parent
that is a file (preserved), linked output ancestor, modified declared content,
and undeclared source file. These are unchanged boundary checks, not a new audit.

Commands/results:

- node artifacts/sprint-20261002/distribution-review-v2/evidence-probe.mjs C:/Users/Dom/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe — exit 0.
- node --test tests/product-archive.test.mjs — invoked once by the independent
  probe with TEMP/TMP confined to this review's fixture directory; 6 passed,
  0 failed, 0 skipped, exit 0.
- Expand-Archive -LiteralPath <normal-a.zip> -DestinationPath <normal extracted>
  — observed current host, exit 0; full exact command in evidence.json.
- node <extracted>/godskills/bin/godskills.mjs validate — empty PATH, exit 0,
  exact candidate release returned.
- git diff --check — exit 0.
- No full suite was run.

## Retained limits and handoff

This is same-host Windows x64 / Node v24.18.0 evidence with standard
.NET extraction, not a fresh OS or Linux/macOS execution claim. File-symlink
fixture creation returns EPERM for this Windows token, so leaf-file-symlink
refusal remains unobserved; the directory-junction ancestor refusal is observed.
No disk-full/interrupted-write or destination-parent-replacement check was run;
READY is not an atomic-export guarantee against those scenarios.

Controlled interleavings demonstrate deterministic snapshot guards, not a
naturally timed race or external-adversary qualification. Accounting statements
are unchanged from v1 and inherit its exact frozen-summary review; no ledger
reconstruction, body acquisition or R10 disposition was performed. A digest
binds bytes, not authenticity. Equal bodies do not transfer rights or terminal
outcomes.

No product edits, commits, integration, installs, pushes, merges, children,
providers, acquisition, acquired-code execution or frozen activation-path
access. Writes are confined to NEW distribution-review-v2 artifacts and their
fixtures. Parent owns integration. This review is sealed and ready for handoff;
the reviewer waits for a separate assignment.

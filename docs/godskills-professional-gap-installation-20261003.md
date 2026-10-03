# Professional-method release: published and installed

The 77-entrypoint content release
`602b06151fa0595580381011cef24fbdb7965fde0d7d983b8f8f34ee06f9c4d7`
was pushed as canonical commit
`ca27fc75c87ebbae89fdfbb8822a25fa90bdfc73` and installed on the inspected
Windows host. This is a separate application record, not a revision of the
earlier [pre-installation evidence](evidence/godskills-gap-release-20261003/receipt-v1.json).
The [deployment receipt](evidence/godskills-gap-release-20261003/deployment-v1.json)
records exact content, verification and rollback evidence without publishing the
private file inventory.

## Exact installation boundary

The journaled installer completed all 77 entrypoints. The independently checked
after-manifest contains 218 managed native-skill files and 250 portable runtime
files, including the release manifest. All declared product hashes match.

The fresh rollback backup preserves the prior 74-entrypoint content release
`cc43b99316ef813f86097f3444598e4ec243124d50e6001572a8a190b6e07402`:
209 prior managed skill files and 241 prior runtime files. The 56 files belonging
to unrelated native skills remained byte-for-byte unchanged. The exact private
before/after manifests and installation journal are retained by the host; their
hashes, not their unrelated contents, are published in the receipt.

The installed CLI validates this content release. Installed file/catalog
availability does not alone prove that an already-open app session refreshed its
skill enumeration, or that an agent applied a method successfully. New turns or
sessions can discover the installed files through the host's normal skill routing.
No automatic connected-source activation or global model configuration changed.

## Canonical verification and preserved negative evidence

After the interrupted app turn, a canonical full-suite run registered 1,468 tests:
1,464 passed, two failed, and two were skipped. Both failures were historical
source-proof Git reads on the shared warehouse drive, ending at their approximately
25-second command timeout. The failed TAP is preserved with SHA-256
`936ae3dfb7fac16e3475096299e4dc940dfc4f4e99c5975c9c481621a39d3db0`.

The two affected test files passed separately: eight tests, zero failures. No
assertion, source, fixture or timeout was changed. A bounded-concurrency full-suite
rerun then registered the same 1,468 tests: **1,466 passed, zero failed, two
skipped**, with TAP SHA-256
`82f25cafd22ad3d5a33c82c0d4e0ea1b0e5ffed04364dccade049ba557e7c45d`.
This supports qualification at the lower test concurrency; it does not establish
a general storage-performance diagnosis or erase the prior failed run.

The remaining Windows skips concern unavailable symbolic-link creation and an
optional second-volume case. The earlier same-host WSL focused run and its
separate second-volume invocation are described in the
[release qualification](godskills-professional-gap-release-20261003.md). These
checks do not certify a fresh operating system, macOS or another computer.

## Scope retained

The new hiring, customer-support and usability methods and explicit host-owned
`none`/`specialist`/`unknown` discovery gate are delivered. The gate is not an
automatic semantic classifier; the underlying lexical ranker can still return
irrelevant candidates. Real employment, customer, participant and agent-outcome
benefits were not measured by this installation.

The three protected activation artifacts retain their historical hashes. No R10
application occurred: the frozen baseline still has 49,514 open identity-obligation
occurrences and 163 conflicts. The acquired quarry remains unfinished. Source-body
comparisons, product usefulness and source-specific provenance or rights remain
separate questions.

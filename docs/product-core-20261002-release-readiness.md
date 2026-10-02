# October 2 portable core release readiness

The parent accepts the exact core product for repository publication and backed-up
local installation. This record is release readiness, not a claim that publication
or installation has already occurred. Those actions require separate live receipts.

- Release ID: `2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348`.
- 68 main skill entrypoints, 186 managed skill files, 205 runtime payloads plus
  `release.json`.
- Manifest SHA-256: `4d398fea6353586e1bf29e4376b2ac5cfc47914013286d7d9ecc5a8dc7b33dba`.
- Standalone ZIP: 999,825 bytes, 206 entries under `godskills/`, SHA-256
  `0ea0b883181709f7a539369b6e89eba7fce6c8d840c5e32df3a5a206805ccce2`.

The standalone [distribution archive](../artifacts/releases/godskills-core-20261002-2260b471.zip)
contains only the portable pack. Extract it and begin with `godskills/README.md`.
Markdown operation needs no provider or dependency installation. The optional
search, validation, export and backed-up installer use Node built-ins.

## Verified release gates

All 247 actual top-level test files were passed explicitly to the test runner:
1,161 passed, zero failed, one Windows leaf-symlink fixture skipped. The initial
three missing-development-parser failures and exact pinned-dependency repair
remain in [the verification record](product-core-20261002-verification.md).
The three protected activation artifacts remain unchanged.

Independent combined-tree review v1 bound 29 changed product files and the six
accepted change reviews. The frozen tree and an actual same-host Windows
product-only extraction passed; all 206 extracted files equalled source bytes.
The extracted CLI validated with empty `PATH`. The original candidate ZIP was
stale and remains historical/unshipped; no old artifact was overwritten.

The new parent-designated ZIP is byte-identical to the reviewer's successfully
extracted ZIP. Independent v2 checked its exact manifest, unique entry membership
and current release correspondence. Parent verified 48 path/hash bindings in v1
and six in v2, plus their final detached receipt checksums and native handoff:

| Record | Receipt SHA-256 | Exact scope |
| --- | --- | --- |
| Combined-tree v1 | `7b69ed5c912481024620b00640bf40540aa74d42078af336547587e38deae473` | Changed tree, focused package/navigation checks; REPAIR for the stale named ZIP |
| Designated archive v2 | `b478426e6e562bdcec65f60e3643b1bf20636f0f5fdf8ceee9fe26445de2d72f` | Corrected archive's exact identity; extraction inherited only by identical bytes |

See [accepted changes and their limits](sprint-20261002-accepted-changes.md).
Math v4 and Hermes v2 metadata experiments remain failed and unadopted. Later
content-only methods and Daedalus's proposed method are outside this core release.

## Evidence limits

This is not fresh-OS or cross-platform qualification, native app discovery,
human acceptance, rendered visual/audio quality, or matched agent-performance
evidence. Original DRAFT bodies remain DRAFT even where an exact-hash directory
row records later independent document review. Document review is distinct from
runtime/performance qualification. Digests establish byte consistency, not
publisher authenticity or source rights.

Frozen R10 remains 49,514 open identity obligations and 163 conflicts. This release
does not apply source dispositions or transfer rights/provenance/quality/outcomes
between identical bodies. No acquired source code was run, paid provider invoked,
new source acquired, security setting changed, or unrelated project activated.

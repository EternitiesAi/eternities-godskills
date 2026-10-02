# Installed core upgrade review v1

**Disposition: READY for the exact publication and same-host installation facts below, scoped to the recorded core release.** This is an independent deployment-evidence audit, not a product review, app-catalog refresh, or broader release certification.

## Identity and published source

- The reviewed action statement is `docs/product-core-20261002-publication-installation.md`, SHA-256 `26946504e26cfc694c2263ac95cc3c2a8524457fac7cd4c211b30156a7344a72` (2,745 bytes). Its linked readiness statement remains the unchanged pre-publication document, SHA-256 `54a2f0aac18ac1c28abeb306622c3b58324c9c263c7853e068fe4ed8026109a9`; both statement links and the named ZIP link resolve.
- Canonical checkout HEAD and the fresh `git ls-remote origin refs/heads/main` result are both `84792f9e46b3b6511e7f3c5400dd840a4d658346`. Canonical tracked status is clean; two untracked files remain, with no path inventory reproduced here.
- The source release manifest is `product/release.json`, SHA-256 `4d398fea6353586e1bf29e4376b2ac5cfc47914013286d7d9ecc5a8dc7b33dba`, release `2260b471f889f5c25b772fc50d4e83566fe8a4ef28a7748674241c8e80ffc348`, 68 skills and 205 payload files. All 205 payload hashes match the manifest in source and installed runtime; the installed runtime has exactly those payloads plus its byte-identical `release.json` (206/206 expected files, no missing or mismatched entries).
- The named archive remains 999,825 bytes with SHA-256 `0ea0b883181709f7a539369b6e89eba7fce6c8d840c5e32df3a5a206805ccce2`; its checksum sidecar agrees.

## Installed bytes, journal, and backup

- Fresh invocation `node C:\Users\Dom\.agents\godskills\bin\godskills.mjs validate` exited 0 and returned `verified-content`, the exact 2260 release ID, and 68 skills.
- The completed backup/install journal is `C:\Users\Dom\.agents\godskills-backups\20261002T124336Z-core2260\install-receipt.json`, SHA-256 `164c2f80b4063bf01234c02848c6b40ec6f8ce457fb74bd6b9cf7d10889f9e82`. Its status is `installed`, both runtime-moved and runtime-installed flags are true, and it records 68 completed owners. Its 186 new managed exposed-file hashes match the journal, current source manifest, and after-snapshot. The 184 previous managed-file hashes match the before-snapshot.
- The entire previous runtime backup matches all 193 `runtimeBefore` journal file hashes, including the backup manifest’s old release ID `61334aee865e67b815cce14dd6dd63078653282dfabac6342f1a31de163a0bfe`.
- The exact-bound before/after snapshots are `core-install-audit-before-v1.json` SHA-256 `cf2aded67e1b0eface9b818ce5918effc34f8901e5e2304c2775729ef10efdb0` and `core-install-audit-after-v1.json` SHA-256 `b80dc619507eeea1fd69dc8101b2e0e59a360023f4b5b26fcd312dd287b53686`. Their 240-to-242 file counts agree with the live directory; all 242 after-snapshot hashes match live bytes. All 56 non-core files in the before snapshot remain present with identical hashes; both additional files are managed by the new release.
- Count wording: the release owns 68 exposed skill directories, all present. The host skills folder has 81 directories total; the other 13 are non-core directories evidenced before installation and remain present. Thus “68” is supported as the managed release count, not as the total host-folder directory count. Names and per-file unrelated inventory are intentionally omitted.

## Limits

The statement accurately distinguishes publication and installation as completed actions from the older readiness statement, and does not claim UI/catalog refresh, fresh-OS or cross-platform validation, measured agent performance, source-rights clearance, or corpus completion. I verified remote main and local bytes; this audit did not perform a push, installation, rollback, UI check, or test suite. Unrelated exposed files were hashed only, not read or reproduced. The checks demonstrate same-host byte integrity and receipt correspondence, not broader runtime quality or portability.

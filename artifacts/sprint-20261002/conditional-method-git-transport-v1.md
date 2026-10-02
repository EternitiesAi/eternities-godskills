# Preserve the exact new TAP evidence bytes

The new full-suite TAP log was produced with CRLF line endings. During explicit staging, Git warned that the repository-wide text policy would normalize that new log to LF. That would invalidate its already recorded raw SHA-256 without changing any test result.

One path-specific `-text` attribute now preserves `artifacts/sprint-20261002/conditional-method-full-suite-v1.tap` exactly. The original log is unchanged; it is restaged byte-for-byte. No historical receipt, source body, activation file, product payload or test acceptance criterion is rewritten. The product content release remains `f6d71194…`. Parent verification must compare actual Git-index bytes before committing, rather than relying on tracked status or an unstaged checksum alone.

The first ordinary restaging reused the prior cached LF blob; the exact index comparison correctly failed (107,571 raw bytes versus 106,340 normalized bytes). `git add --renormalize --` for this one explicit new-log path then applied the updated attribute. The staged hash now equals the unchanged raw hash `28f3ec741ff91962f1046488bb0558090748774ed1e1d21708d94e07352e0487`. The failure was not a failed test or a changed test result, and no success was claimed before the roundtrip passed.

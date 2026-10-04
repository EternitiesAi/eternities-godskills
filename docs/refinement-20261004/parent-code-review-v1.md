# Independent parent-code review v1

Disposition: **REPAIR** — two important frontmatter validation findings. No critical or minor finding is asserted. Documentation preservation passes the reviewed scope. This is a non-author review by author B of parent-owned changes, not a capability or performance qualification.

## Exact inputs

Baseline commit: `dc704536875cda166f7ab784bce28f3c2b54ae0c`.

Input manifest: `C:/Users/Dom/.codex/operations/godskills-refinement-20261004/parent-review-input-v1.json`.

Manifest SHA-256: `3abd7781094e30e829366579f962c71a386ce1972da6532325ee667ad4e23034`.

All five candidate hashes matched the manifest on initial inspection and the final pre-report check:

| Candidate file | SHA-256 |
| --- | --- |
| `product/README.md` | `8ca22c4e26ec43fa32880704eb1aaf016f786a0b4586517ebbc38ffb5363fdb5` |
| `product/DISCOVERY.md` | `370eb38c83229ab619ab8809253beb24bf69da398ea211ed360b2d37dc865956` |
| `product/lib/product.mjs` | `3698153faa2b0d64b518dc807309ec6c3b32d6e03eb9d2114ccde68d4900fdb2` |
| `product/lib/skill-frontmatter.mjs` | `9d65d727f3c74db6a81bb6198ff12d34f61d43dc01d4ac84ae6332cdfe151ddd` |
| `tests/product-frontmatter-discovery.test.mjs` | `c16a262d1c633f4bd42b760273d3b3fcb400b2d0b9c39ed55ee8fad8a13a0e46` |

The full candidate bodies were read. Tracked changes were compared with the pinned baseline; DISCOVERY.md, skill-frontmatter.mjs and the focused test file are new files. Baseline README SHA-256 is `5c376b88d06bff025581a55ed10306fede44442f3848486bddb3e864249db850`; baseline product.mjs SHA-256 is `b589b4baea80fadb6ee107b747f06e48c593ea58ece3622ea85bec919526aa27`.

## Important findings

### PARENT-FM-001 — Quoted duplicate keys evade uniqueness validation

Location: `product/lib/skill-frontmatter.mjs:36-38`.

The match scan counts only the literal unquoted spellings `name:` and `description:`. It neither rejects alternate top-level key syntax nor counts quoted spellings as the same key. For example:

```yaml
name: example
"name": elsewhere
description: Compare evidence
```

Static control-flow trace: the name scan has one match; scalar() reads `example`; description has one nonempty match; expected-name equality passes. The extra quoted name is ignored. The same defect applies to a bare description followed by `"description":` or `'description':`. These are ambiguous native mappings even though this validator reports one identity/description; a native loader may reject the duplicate or resolve a different value. The real builder and verifier both call this validator, so their agreement cannot catch its blind spot.

The supplied tests cover two bare duplicates only. Repair by either normalizing supported key syntax before uniqueness checking or rejecting unsupported key/header syntax conservatively. Add real-build fixtures for mixed bare/quoted duplicates of both keys. Do not assume a general YAML parser or expand the permitted metadata subset without deciding its contract.

Evidence class: confirmed static trace from the exact input bytes. These additional examples were not executed, respecting the restriction to the supplied focused tests.

### PARENT-FM-002 — Plain fallback and unconsumed structure do not fail closed

Locations: `product/lib/skill-frontmatter.mjs:16-29` and `:35-43`.

The plain-scalar rejection list recognizes decimal numbers, true/false/null and a few initial YAML tokens, but any other nonempty value is returned as a string. Thus the inspected path accepts:

```yaml
name: example
description: 0x10
```

and:

```yaml
name: example
description: Compare: evidence
```

The first is a numeric scalar in ordinary YAML interpretation; the second has an unquoted colon followed by a space, which is not a valid single plain value in this mapping. Neither is rejected by the current pattern or the following-line check. The quoted branches return early, so this invalid continuation also escapes the check used for plain values:

```yaml
name: example
description: "Compare evidence"
  unexpected continuation
```

All three statically satisfy the custom nonempty-string test. This contradicts the promised conservative unsupported/ambiguous-form rejection and can create a pack that verifies internally while its native metadata is non-string or invalid. The build/verify fixture pair uses the same inspector and is not an independent native-loader oracle.

Repair the supported plain grammar and validate complete scalar/header consumption consistently for quoted, plain and block forms. Reject unsupported representations rather than coercing them into discovery text. Add rejected real-build fixtures for numeric forms outside the decimal subset, colon-space plain values and trailing content after quoted values. Keep the existing positive C# comment, quoted and block cases.

Evidence class: confirmed static trace; no additional parser/native-host execution was performed.

## Executed focused checks

Command: `node --test tests/product-frontmatter-discovery.test.mjs`, Node `v24.18.0`.

Observed result: exit 0; 19 tests, 19 passes, 0 failures, 0 skipped/cancelled/todo. The file contains 12 rejected-header fixtures and 7 accepted-header fixtures. These exercise buildProduct in isolated newly created temporary packs; the positive fixtures also run verifyProduct. No shared product build/catalog, full suite, installation or provider action was run.

The fixtures establish the behaviors they cover: empty and bare-duplicate fields, listed boolean/null/alias/object/tag forms, plain continuation and unclosed quotation are rejected; the seven listed plain/quoted/block/comment forms build and verify. They do not establish arbitrary YAML validity, native-host interpretation, or universal portability. The two important findings are uncovered static paths, not alleged failures of the 19 executed tests.

## Documentation and integration review

The only product.mjs behavioral diff is the imported inspector and replacement of the former two regex checks. Search, ranking, eligibility and installation logic are unchanged in that diff.

README retains ordinary no-skill use, complete selected-entrypoint reading, lazy references, host permission boundaries, related skills as suggestions, lexical/non-semantic search limits, score-versus-confidence separation, no-need behavior, connected-source holds/rejections and no provider/activation effects. It keeps installation/rollback, byte-identity/authenticity, DRAFT/review/performance and provenance limitations. The new proportional-depth paragraph preserves specialized failure checks rather than waiving them.

DISCOVERY preserves the detailed finite cue families and learner tier, narrow English/quotation/negation exclusions, anti-trigger limitations, caller-owned need, exact connected-source context enums, unknown/conflicting holds and method/review binding limits moved out of README. Its conservative-frontmatter statement is presently stronger than the implementation, as covered by the findings.

Composition links remain present; RECIPES.md has no diff from baseline. No new authority or compulsory orchestration stack was found in the documentation change. Documentation review is accepted within these exact bytes; parent-code readiness remains REPAIR.

## Scope and handoff

Only this report and its JSON receipt are written by the reviewer. Product, tests, generated catalogs and installed skills remain outside reviewer writes. No descendants, other models/providers or external acquisition were used.

Parent owns remediation and a new frozen input vector. A changed candidate is not covered by this review; rerun the permitted focused checks and obtain review of new exact bytes. Runtime/native-loader parity, whole-pack release, cross-cohort retention and consumer behavior are separate qualification scopes.

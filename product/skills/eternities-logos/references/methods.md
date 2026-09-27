# Logos method cards

## evidence-derived-engineering-documentation

Freeze the audience, document purpose, repository or artifact scope, freshness window, and maintenance owner. Inspect exact code, configuration, commands, generated output, and verification evidence. Build a source ledger that records path, locator, observed value, date or revision, claim class, and what the source does not establish.

Draft the document around how a reader will use it: prerequisites, concept or contract, procedure, expected result, failure paths, recovery, examples, and ownership. Every command or configuration example must be supported by the inspected source or labeled as a proposal. Retain version and freshness markers near volatile facts. Review terminology, accessibility, link targets, and whether the text implies a deployment or guarantee that was not observed.

Return the document plus source and freshness ledger, unresolved questions, reviewer, and maintenance trigger. A clean draft is evidence-derived within the inspected source boundary, not proof that every environment behaves identically.

## evidence-bound-slide-artifact-handoff

Use when a factual deck or slide report must be created from supplied evidence as a local, reviewable artifact. Confirm the audience, decision, source period, intended format, rights and asset reuse, authorized effects, and reviewer. Route underlying market, financial, scientific, or causal analysis to its owner; a polished slide does not validate the underlying claim or authorize sending it. Do not upload private material to a hosted slide service without authority for that provider, transfer, and cost.

Build a claim register with stable IDs, exact source locators and dates, units or denominators, claim class (observed, derived, assumption, proposal, unresolved), caveats, and calculation owner. Then make a slide map: stable slide ID, narrative role, proposed conclusion, supporting and contrary evidence IDs, data inputs, audience action, and visual/accessibility intent. A factual label or image needs provenance; decorative material is labeled as such. Keep conflicting or stale inputs visible instead of selecting a more persuasive number.

Specify order, editable content, semantics, references, and reading intent before choosing a local PPTX, HTML, PDF, or other available adapter. Record its version, input identities, output path, and build settings. Preserve source files and avoid output collisions. Re-open the artifact to verify page order, material text, source references, bounds, reading order, and image descriptions. Render every requested page when a compatible local renderer exists; inspect clipping, overlap, contrast, crop, fonts, and legibility. Split an overcrowded page rather than hiding or shrinking evidence to make it fit. If no renderer is available, report a structurally checked draft with visual acceptance still open.

Return the slide file, claim register, slide map, asset/rights list, build manifest, output hash, and a receipt that separately marks content support, package/structure checks, rendered visual inspection, and the exact accessibility checks performed. A board deck about onboarding experiments, for example, must preserve differing cohort eligibility rules; a completion-rate difference alone is not a causal revenue effect. No local rendering test is evidence of publication, recipient approval, or investment quality. Hand visual and interaction acceptance to Muse where that is the task's dominant concern.

## supplied-document-conversion-fidelity — DRAFT

This card is a planning and review method only. It is not an executable converter, does not select or run conversion software, and cannot establish or claim a successful conversion. Use it only when the identified source file itself is supplied and available for inspection, or when both the source and a candidate output are supplied for review. A supplied file means its contents are directly attached or made available as a local file. A URL, URL list, or file containing only URLs is a locator, not the linked document; this method does not fetch or inspect the target. If only a link is supplied, no document-specific fidelity review can begin: record the source as unavailable and request the file or a separately authorized acquisition decision. Do not follow embedded links under this method.

### Bound the request and preservation contract

Record the source identity and revision, intended use and audience, destination format, and whether the result must remain editable, resemble the original page by page, or meet another stated purpose. Record what local handling and output effects are authorized. Supplying a file does not by itself authorize sending it elsewhere, following embedded links, running embedded content, overwriting it, publishing it, or reusing it beyond the request. If any needed transfer, access, cost, or other effect is not authorized, stop at a plan and leave that decision open.

Before evaluating a candidate, define four separate lanes: **content**, **structure**, **appearance**, and **accessibility**. For each lane, record required properties, scope, tolerance, reviewer or evidence source, and limits. Mark a lane not required only when the user or accountable owner explicitly says so. Do not trade one lane against another without that decision. If editability and close visual reproduction conflict, describe the conflict and leave it open.

### Plan evidence for each lane

For every required lane, identify the exact source and candidate locations to inspect, the comparison or check, the evidence to retain, the reviewer, and known limits. A plan alone leaves every outcome OPEN. If a separately authorized conversion has produced a candidate, preserve the source and write to a distinct candidate location. Record input and output digests, actual tool and version, options, processing location, transformations such as OCR, and any authorized data transfer. Unknown tool details remain unknown. A planned command, successful exit, extracted text, or self-reported checkmark is not acceptance evidence.

- **Content:** inspect material text, names, amounts, units, formulas, negation, captions, and omissions across the declared scope. OCR output is not ground truth; without a checked reference, affected text remains OPEN.
- **Structure:** inspect order and semantics that matter, such as headings, lists, tables, links, fields, notes, relationships, editability, and reading sequence. Reopening a file alone does not establish that its structure survived.
- **Appearance:** inspect an actual render under the stated page, screen, or print conditions; record the renderer, settings, pages or regions checked, and any sampling limit. If a required render was not produced or inspected, appearance is OPEN.
- **Accessibility:** record the checks actually performed for relevant semantics, reading order, descriptions, language, contrast, and assistive use. Automated checks support only the properties they inspect; a required human review stays OPEN until that reviewer supplies evidence.

Use **PASS** only when observed evidence meets the declared lane contract, **FAIL** for a demonstrated loss or violation, and **OPEN** when evidence is missing, inconclusive, unavailable, or requirements conflict. A required OPEN or FAIL lane prevents acceptance for that use. Do not convert missing evidence into a pass or average away a material loss. If no candidate can be judged, return a bounded plan with the source boundary, open decisions, and next owner; do not report conversion success.

### Keep specialist ownership intact

For DOCX work involving package relationships, fields, comments, tracked changes, embedded material, or pagination semantics, hand those checks to docx-package-redline-and-render-verification; this card does not replace its package safeguards. For slide decks, use the existing evidence-bound-slide-artifact-handoff method for deck-specific structure and rendering, and hand visual or interaction acceptance to Muse. If that method does not cover the requested deck conversion, leave the relevant lane OPEN and identify the needed owner. A specialist handoff does not authorize transfer, delivery, or publication.

Return the source and candidate identities, four lane contracts and outcomes, evidence locators, observations, losses, unresolved decisions, reviewer, and next owner together. Sending or publication remains a separate action.

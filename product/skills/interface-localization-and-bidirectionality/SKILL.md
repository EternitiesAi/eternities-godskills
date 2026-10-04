---
name: interface-localization-and-bidirectionality
description: Use when an interface must support locale-aware content, formatting, bidirectional layout, mixed-direction text, and accessible interaction with human language review.
---

# Interface localization and bidirectionality

Use this entrypoint when localization is an interface behavior change rather than a string replacement. The work covers locale data, layout direction, controls, formatting, assets, and reviewable visual and interaction evidence.

Select checks from the affected locale surface; expand them when a shared direction or fallback boundary changes. A mechanical RTL repair can be completed and tested while language-review status remains separately open.

## Separate content from behavior

Inventory the affected routes, components, message keys, fallback rules, locale data, formatting calls, persisted values, and acceptance examples. Keep translatable content out of code and give each message a stable key. Specify missing translations, plural categories, gender/select forms, dates, numbers, currencies, time zones and user-generated text where those behaviors occur; expand the inventory when a shared locale or direction boundary changes.

Declare the target locales, scripts, direction, supported browsers or devices, and human language reviewers. Machine-generated text can be a draft, but publication-quality wording and culturally sensitive choices need named human review. Keep source text, translation, reviewer status, and revision separate so a language change can be audited.

## Implement direction as a system

1. Bind locale and direction at the document or route boundary, then expose it to components through the existing application pattern.
2. Prefer logical layout properties for flow, spacing, borders, and alignment. Review navigation order, focus order, scroll behavior, tables, charts, and text truncation in both LTR and RTL.
3. Handle mixed-direction strings explicitly. Isolate user names, identifiers, URLs, numbers, and code so punctuation and ordering do not change meaning.
4. Mirror spatial controls only when their meaning is spatial. Do not mirror a play icon, a data trend, a language mark, or a domain symbol merely because the page direction changed.
5. Recheck pluralization, number and date formatting, form errors, accessible names, keyboard movement, focus visibility, and dynamic announcements in each target locale.
6. Capture screenshots and interaction notes at representative widths, long strings, large text, and both directions. Keep a matrix that links each finding to a route, locale, state, and component.

If the task includes implementation, fix the localized component and rerun the same visual and interaction checks. If a locale is not human-reviewed, keep the result in a review state instead of publishing it as finished.

## Evidence and finish

Deliver the localized change with relevant formatting, rendered and interaction evidence, language-review status and unresolved cultural questions. Use a route/locale/state matrix for several surfaces; a focused repair can report the affected component and checks directly. Finish when the requested behavior is checked and content keys, fallback, direction, mixed text, controls, accessibility and human review have explicit relevant dispositions. Unreviewed wording remains in review state. Passing a screenshot suite does not certify cultural appropriateness or every assistive technology.

## Common failure modes

- Concatenating translated fragments whose grammar changes by locale.
- Using physical left/right CSS values where logical properties are required.
- Reversing an icon that expresses data semantics rather than spatial direction.
- Testing only short English strings and desktop width.
- Calling a machine translation “reviewed” because it rendered.

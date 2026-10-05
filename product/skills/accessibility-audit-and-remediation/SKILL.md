---
name: accessibility-audit-and-remediation
description: Audit and repair interface journeys through keyboard, assistive technology, focus, dynamic feedback, visual adaptation and motion tests with explicit coverage limits.
---

# Accessibility audit and remediation

Use for a bounded accessibility review, a reported interaction barrier, or
implementation of an accessible journey. Work from the product's actual tasks
and interaction model. A cosmetic edit, general visual direction, legal opinion,
or accessibility certification requires a different scope. An automated scan is
one evidence source, not a verdict on the whole product.

## Procedure

1. Establish the interface revision, important journeys, supported platforms,
   content states and requested standard or acceptance criteria. Reuse supplied
   requirements. Record available browsers, input methods and assistive
   technologies; missing equipment narrows the claim, not the useful work.
   Select representative shared components and unique high-impact transitions.
2. Reproduce each reported barrier. Follow the journey from entry through
   completion and recovery, including keyboard operation, reading order,
   accessible names, roles, values, visible focus and the available nonvisual
   feedback. Inspect rendered behavior alongside markup. Use automated findings
   to locate candidates, then confirm the relevant user impact.
3. Trace dynamic state changes: opening and closing overlays, route changes,
   validation errors, loading, retry, cancellation and stale responses. Specify
   where focus belongs, what is announced, and whether the user can recover
   without losing entered data. For composite widgets, distinguish movement
   within the widget from tab navigation between controls; not every item needs
   its own tab stop. Modal containment applies only while a modal is active.
4. Exercise the required visual and sensory adaptations: text enlargement,
   reflow, forced colors, contrast, reduced motion and media alternatives.
   Inspect actual states and overlays, not only palette tokens. Preserve task
   meaning and orientation when reducing motion. Choose criteria from the
   agreed standard and platform context rather than inventing universal limits.
5. Record each finding with a stable locator, starting state, reproduction,
   affected task, observed behavior, expected behavior and supporting evidence.
   Prioritize blocked completion and difficult recovery ahead of issue counts.
   Map to a criterion only when its applicability is supported; keep possible
   violations and untested combinations separate from confirmed barriers.
6. When repair is authorized, change the responsible semantics, component or
   transition. Prefer native controls when they fit; accessible names should
   remain consistent with visible labels. Use ARIA to express missing semantics,
   not to conceal broken interaction. Preserve intentional design and repair a
   shared component when that is the cause. Rerun the original reproduction,
   adjacent states and a regression that detects the failure.

Read [methods.md](references/methods.md) for journey coverage, focus restoration,
error announcements and adaptation checks. Continue through the authorized
repair and verification; a findings list alone does not finish a remediation
request. If a tool cannot expose announcements, complete the available checks
and mark actual assistive-technology behavior untested. If a patch creates a
new trap or blocks recovery, revise it before closing the finding.

## Output and completion

Deliver the issue ledger, performed changes and a reproducible before/after
journey record. Identify revision, environment, input method, observed outcomes,
untested combinations and unresolved blockers. Finish when the requested audit
coverage is accounted for or repaired barriers pass their checks within the
declared scope. Component tests, scanner scores and one successful assistive
technology session support only their measured surfaces.

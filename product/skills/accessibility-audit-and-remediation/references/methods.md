# Journey and remediation methods

## Build a testable journey

Name the user goal and its entry conditions, required decisions, completion
signal and recovery path. Cover both a successful attempt and the failures
that change interaction: invalid input, empty content, interrupted loading,
cancelled work and expired state. Select browser and assistive-technology
combinations according to supported users and the changed surface. Record
their versions when testing; compatibility in one combination does not predict
another. When no real assistive technology is available, accessible-tree
inspection is useful structural evidence, with announcement behavior untested.

Keep four forms of evidence distinguishable: source inspection, automated
rules, manual keyboard/visual observation and actual assistive-technology
interaction. For each, record the relevant state and result. A scanner warning
that cannot be reproduced remains a candidate; an absent warning does not
settle reading order or recovery. Label incomplete checks explicitly so a later
tester can pick up the exact gap without repeating completed work.

## Focus as a transition contract

For an overlay, record the trigger, appropriate initial destination, permitted
navigation while open and destination after dismissal. Contain focus for a
modal and make background interaction unavailable consistently; a nonmodal
popover should not inherit this rule. Include a visible, operable dismissal
path and the relevant keyboard behavior. Restore focus to a surviving trigger
when that preserves context. If the trigger was removed, choose a meaningful
successor in the completed task, such as the next item or list heading. Avoid
returning focus to a hidden element or silently to the document root.

For navigation, loading and inline updates, distinguish orientation from
notification. A route change may require a new title and a meaningful focus
destination; an ordinary status update usually should not steal focus. Exercise
nested overlays, deletion of the initiating item, validation inside a dialog,
and closing during an outstanding request. Check that late completion cannot
reopen a dismissed surface, overwrite newer content or redirect focus away
from current work. Repeat with backward as well as forward keyboard navigation.

## Forms, errors and announcements

Give a field a persistent label, associated help and an error relationship
that remains valid when content updates. Expose invalid state only for an
actual error under the form's validation policy. Preserve submitted values.
For several errors, provide a discoverable summary and routes to affected
fields, then test correction and resubmission. Decide whether focus movement,
a status announcement or both best support this particular transition.

Keep live regions stable and update their content deliberately. Test repeated
identical failures, an error replaced by success, retry in progress and delayed
responses. Observe whether announcements are missing, duplicated or interrupt
useful speech; choose urgency from the task rather than marking all updates
assertive. A disappearing toast should not be the only record of a necessary
action. Test accessible-name consistency with visible text when speech input
is relevant. Language changes and localized error lengths may alter both
announcement and layout behavior.

## Adaptations and meaningful regression

At the requested enlargement and viewport conditions, inspect clipped labels,
fixed-height containers, sticky elements obscuring focus and nested scrolling.
Judge intentional two-dimensional content under its applicable criteria;
universal bans on horizontal scrolling are unhelpful. Check selected,
disabled, error and focus states in forced colors and without color cues.
Contrast measurements must identify the actual foreground, background and
state. For reduced motion, preserve the outcome and spatial explanation,
provide controls for disruptive movement, and inspect media alternatives for
the information needed to complete the journey.

Choose regression checks that observe the defect: name/role assertions for
missing semantics, active-focus checks across transitions, and a real journey
for traps or error recovery. Reuse existing tooling. A DOM assertion cannot
verify spoken timing or real magnification usability. Compare the same starting
state before and after repair, then test an adjacent valid state to detect an
overcorrection. Close a finding with its measured result and remaining coverage,
never a blanket accessibility claim.

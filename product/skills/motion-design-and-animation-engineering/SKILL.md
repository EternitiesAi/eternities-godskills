---
name: motion-design-and-animation-engineering
description: Design and implement purposeful interactive animation, spring choreography, retargeting and layout transitions with reduced-motion alternatives and measured acceptance.
---

# Motion design and animation engineering

Turn a visual intention into motion that remains coherent when people interrupt it, content changes, or the device cannot sustain the intended effect. This method works with native transitions, timeline libraries, canvas, scene graphs or other suitable engines; none is a prerequisite.

## Fit and boundaries

Use for coordinated entrances, responsive gesture feedback, interruptible drawers or dialogs, shared-element/layout transitions, scroll-driven scenes and a reusable motion vocabulary. A one-property hover adjustment rarely needs the full method. Use a separate media-composition method for an encoded video, and specialist rendering or accessibility procedures when those are the actual unresolved problem. Do not install an engine merely because a reference uses it.

## Working method

1. **Bind the experience.** Identify the action or artistic purpose, viewer, existing visual grammar, semantic states, moving elements, interaction modes, viewport/device conditions and intended artifact. Preserve an approved direction; explore alternatives only when direction is unresolved. Aesthetic motion is legitimate, but it still needs an intentional relationship to the scene.
2. **Specify choreography.** Give each transition a cause, start/end state, property units, time base, easing or physical model, dependencies and interruption policy. Balance hierarchy, travel distance, readability and perceived weight. Define reusable timing/curve tokens when useful; do not enforce a universal duration, frame rate, overshoot, layer count or house style.
3. **Choose the smallest suitable mechanism.** Prefer existing platform capabilities for a simple effect. For complex choreography, establish one owner of each animated property and an explicit coordinate space. Read the [matching method](references/methods.md) for retargeting, geometry or temporal acceptance; unrelated routes need not run.
4. **Make interruption a first-class path.** Start a new target from the current rendered or modeled state, preserving velocity when available and appropriate. Cancel or supersede prior work with request identity; an old completion must not commit a newer interaction's state. Handle repeated activation, reverse direction, resizing, changing content, unmount and visibility changes without leaked loops or listeners.
5. **Preserve usable semantics.** Keyboard, focus, hit targets, readable content and state announcements must not depend on a decorative animation finishing. Respect reduced-motion preferences, including changes during an effect, with an equivalent understandable state transition. Do not hide an essential result behind motion or require a pointer-only gesture.
6. **Implement and judge the artifact.** When implementation is requested, continue into the effect and test its real transitions. Check normal and interrupted paths, slow/large elapsed-time steps, reduced motion, representative viewports and cleanup. Measure relevant frame-time, paint, layout, layer or memory costs before claiming performance. Inspect motion over time, not just a polished still; correct wrong hierarchy, snapping, unreadable staging or unintended camera/coordinate effects.

## Deliverable and finish

Deliver the requested implementation or motion specification, its state/timing/ownership contract, useful tokens and the observed acceptance evidence. Keep source inspection, mathematical fixtures, browser observation, device measurements and human aesthetic acceptance distinct. If a runtime or device is unavailable, preserve the useful artifact and name the unmeasured boundary; do not label proposed performance as achieved.

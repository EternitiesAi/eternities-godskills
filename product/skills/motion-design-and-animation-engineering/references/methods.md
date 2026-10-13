# Conditional motion methods

Choose the section that owns the unresolved transition. These are procedures, not mandatory companion workflows or engine-specific recipes.

## Choreography and physical response

Bind timing to the effect's job: immediate input acknowledgment, movement between states, reading time, or an intentionally sustained scene. Record the sequence's total duration as well as individual delays; a small per-element stagger can still make a long list inaccessible. Define which elements lead, follow or remain stable and what each relationship communicates. Ambient layers and secondary motion are optional artistic choices, not proof of quality.

For a modeled spring, name the position, velocity, target and units. Require valid mass, stiffness and damping under the selected model, and document time in seconds versus the engine's actual convention. Positive mass/stiffness and nonnegative damping describe a conventional stable-target model, but zero damping does not settle by itself. Natural frequency and damping ratio can guide tuning; they are not interchangeable with a tween duration. Select stopping tolerances for both position and velocity, and distinguish a visual constraint from a physically simulated collision. A fixed-step numerical implementation needs bounded elapsed-time handling and an integration method appropriate to its stiffness; large resumed-tab steps must not explode or silently skip essential state transitions.

Tune against travel, readability, desired weight and the target's constraints. A linear path or constant-speed motion can be correct for a mechanical/ambient brief; springs and overshoot are not universally superior. Do not claim GPU acceleration or a frame-rate guarantee from a property name.

## Retargeting and lifecycle

Represent transition ownership with the current interaction identity and mount/lifecycle generation. On a new input, capture the current pose and any trustworthy velocity, select the new target, supersede previous work and retain the appropriate continuity. If the engine cannot preserve velocity, state the approximation and inspect the seam. Never restart from an obsolete named initial state merely because a new request arrived.

Completion is conditional: its identity must still own the transition before it writes semantic state, releases focus, removes content or triggers a next action. Treat cancellation separately from successful arrival. Check rapid open-close-open, target changes while dragging, stale completion, duplicate activation and a preference change during movement. With reduced motion enabled, move to the current requested meaningful state and suppress stale callbacks; do not replay every superseded transition.

Give each animation loop, event listener, observer and temporary rendering hint an owner and cleanup path. Define pause/rebase behavior for hidden tabs and changed elapsed time. Unmount must remove resources rather than leave an invisible repeating scene running. A background aesthetic loop must fit an explicit resource budget and remain nonessential to task success.

## Coordinates and responsive layout

Identify local, parent, viewport and camera spaces before assigning targets. Measure geometry in the actual rendered context, including scale/rotation, scrolling, device-pixel ratio and content changes where relevant. Convert between spaces deliberately rather than treating a pointer coordinate as a child transform value.

For a layout morph, measure the old and new layout, apply a temporary transform or an equivalent interpolation, then relinquish that temporary transform at the new stable layout. Recompute or deliberately rebase when resizing, fonts, content or virtualization invalidate the measurement. The animation must not preserve an obsolete box at the cost of real content layout.

For a requested camera effect, bind cursor/overlay positions to the same declared rig or convert them explicitly. Independent translation, rotation and zoom owners must compose intentionally; two writers replacing one transform can create jitter. Do not introduce camera movement or three-dimensional decoration when the brief calls for a quiet two-dimensional transition.

## Temporal and interaction acceptance

Observe start, intermediate, interrupted, reverse and final states under matching content, viewport and motion preference. For precise checks, record interaction identity, timestamp/time base, pose, velocity where relevant, semantic state and focus destination. Set tolerances from the contract, not from what the current build happens to produce.

Adversarial cases include a second activation before settling, a much larger elapsed-time step, a changed target, reduced motion toggled mid-flight, scroll/resize during a gesture and unmount before completion. Verify that hit targets, keyboard focus and announcements still correspond to the latest meaningful state. Profile a representative load and target device when performance matters; source reasoning and a synthetic clock fixture do not prove live-browser smoothness, accessibility or audience preference.

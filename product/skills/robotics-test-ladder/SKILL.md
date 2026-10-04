---
name: robotics-test-ladder
description: Use when robot perception, planning, control, or message behavior needs a staged path from deterministic tests through replay, simulation, hardware-in-loop, and authorized field evidence.
---

# Robotics test ladder

Use this entrypoint to build a robotics verification program that spends realism where it matters. It supports implementation and execution of authorized tests, while keeping a unit or simulation result distinct from hardware and field behavior.

Select the lowest tier that can expose the suspected failure and the highest tier required by the claim. A parser repair can finish with deterministic tests; an actuator timing or field-reliability claim needs corresponding evidence. The ladder is a choice of evidence tiers, not a requirement to run all six for every change.

## Declare the robot contract

For the affected package or behavior, bind interfaces, schema revisions, success criteria and fixture identity. Add clock/timing bounds for timed interactions; coordinate frames and calibration for spatial behavior; joint, velocity, acceleration and collision limits for motion; simulator/hardware revision and physical-test owner for those tiers. Keep the relevant parameter ranges and seed identifiable rather than requiring actuator fields for a message parser.

## Climb the ladder

1. **Pure unit and property checks.** Exercise kinematics, interpolation, transforms, parsers, validators, and state machines with known poses, round trips, bounds, empty inputs, invalid parameters, and generated cases. These should be fast and deterministic.
2. **Node and message integration.** Launch the smallest cooperating set, verify message schemas and event order, and wait on explicit events with a timeout. Never replace message completion with a fixed sleep.
3. **Deterministic replay and golden trajectories.** Feed recorded or synthetic sensor and joint streams with a fixed seed. Compare trajectory digests or numeric tolerances, and retain the input, environment, and expected artifact.
4. **Seeded simulation.** Run the behavior in a declared physics configuration. Check task completion bounds, unreachable goals, empty sensors, invalid confidence, joint limits, collision contacts, and failure recovery.
5. **Hardware-in-loop.** Only after lower tiers are useful, connect real hardware through a controlled harness. Record calibration, firmware, safety envelope, emergency stop readiness, timing, and any divergence from simulation.
6. **Field test.** Treat the real environment, operator, weather, surfaces, and recovery behavior as new evidence. Use an explicit run plan and stop conditions; a successful simulation does not pre-clear this tier.

Use many lower-tier tests and fewer expensive upper-tier tests. Keep failures at their tier and do not promote them silently. If a fixture changes, update its digest and explain why the expected behavior changed.

## Evidence and finish

Return the exercised tier, package/revision, fixture or hardware identity, relevant seed and timing method, expected/observed result and unresolved differences. Use a ladder matrix for a multi-tier program. Preserve logs and trajectory or collision evidence when they bear on the claim. For deterministic replay, compare repeated trajectories by digest when bitwise replay is promised, or by a predeclared numeric tolerance when that is the contract. Test invalid-parameter rejection and integration deadlines where those interfaces exist; replay agreement alone does not establish physical validity.

Finish at the highest tier actually exercised. Do not call authored fixtures evidence of real agent performance, hardware safety, or field reliability. Those claims require the corresponding executed evidence and human safety review.

## Common failure modes

- Sleeping and hoping a ROS message arrives.
- Testing only the happy path and never an unreachable goal or empty sensor.
- Changing the random seed between replay runs.
- Treating mock hardware as equivalent to a calibrated actuator.
- Running field tests before simulator and HIL failure behavior is understood.

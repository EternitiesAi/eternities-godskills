---
name: procedural-world-generation-and-validation
description: Design, implement, and validate procedural worlds with reproducible generation, compatible chunk boundaries, state-aware progression, and bounded failure recovery.
---

# Procedural world generation and validation

Use for generated maps, dungeons, terrain, or streamed worlds whose variation
must preserve traversal and progression. Ordinary handcrafted level design,
asset dressing, and an isolated rendering optimization do not need this method.
A reachable graph alone cannot establish fairness, navigation clarity, or fun.

## Method

1. Recover the player promise, existing generator, movement rules, progression
   states, authored anchors, streaming model, save ownership, and target budgets.
   Identify required properties and deliberate exceptions: an optional sealed
   ruin differs from an unreachable mandatory exit. Choose constraints from the
   brief; avoid universal room counts, terrain sizes, or encounter ratios.
2. Define generation identity: world seed, generator and content versions,
   parameters, coordinate convention, and random-stream derivation. Separate
   layout, progression, and decoration streams so cosmetic draws cannot move a
   key. Fix iteration and serialization order where they affect output. Declare
   whether reproducibility is semantic or byte-exact and on which runtimes.
3. Establish chunk contracts before filling interiors. Derive shared edges from
   a canonical coordinate/edge identity or a single authoritative boundary
   record, independent of load order. Match connector orientation, terrain
   samples, collision, navigation clearance, and content ownership. Resolve
   cross-boundary spacing using shared candidates or a declared neighboring
   region; independent local randomization can violate a seam. Read
   [methods.md](references/methods.md) for edge and persistence mechanics.
4. Construct required progression first, then vary optional routes and dressing.
   Validate transitions over position plus relevant inventory, consumed keys,
   switches, abilities, quest flags, and irreversible changes. Apply the same
   preconditions and effects as play. State whether the contract requires one
   winning route, recovery from supported choices, or both. A key behind its own
   door, a one-way trap, or a consumed key cannot be repaired by ordinary flood
   fill. Bound search; an exhausted search is inconclusive.
5. When implementation is requested, change the generator and its actual callers,
   generation/save records, and relevant navigation checks. Preserve authored
   content and player modifications through stable entity identities and explicit
   overlays. Retry deterministic attempts within a declared count and time
   budget. Repair only within compatible boundary contracts; otherwise regenerate
   a declared region coherently. On exhaustion return a validated fallback or a
   visible generation failure with the replay record, never an unvalidated world.
6. Exercise same-identity replay, different chunk orders, adjacent and corner
   seams, unload/reload with changed state, progression counterexamples, and
   impossible constraints. Keep failing seeds as regression cases. Measure
   rejection frequency, generation/search cost, and output variety over a bounded
   seed set. Inspect traversal and streaming in the actual build when available;
   retain human play observations separately from machine checks.

## Deliverable and finish

Deliver the requested generator design or implemented change, versioned replay
record, boundary and progression contracts, passing and failing cases, retry and
fallback behavior, measured scope, and remaining play questions. A build request
finishes with the working integration and applicable checks. A design-only request
finishes with implementable rules and acceptance cases, clearly marked unexecuted.

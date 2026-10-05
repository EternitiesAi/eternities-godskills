# Reproducibility, boundaries, and progression

## Generation identity and persistent change

Treat the seed as one input to a versioned generation function. Record the
generator/content versions, parameters, coordinate rules, random algorithm,
stream labels, attempt index, and reproducibility scope. Stable ordering matters
for candidate enumeration, tie breaking, and unordered collections. Changes to
floating-point behavior or asset bounds may change geometry even when the seed
is unchanged; either constrain the supported environment or compare declared
semantic properties rather than asserting identical bytes everywhere.

Derive random streams from stable purpose and region identities. Decorations
should not consume the progression stream. Retries derive from the original
identity and attempt index, so a failure remains replayable. Retain rejected
attempts and rejection reasons rather than recording only the successful seed.

Distinguish generated base content from authoritative play state. A chest's
stable identity binds its generated location to its opened/removed state. Reload
applies that overlay; it must not generate another reward or restore a destroyed
bridge. Pin old saves to compatible generation versions or perform an explicit
migration with comparison checks. A new seed is not a save migration.

## Chunk seams and streaming ownership

Use one shared definition for each edge. For a pair of adjacent chunks, canonicalize
the pair and axis, then derive the edge once; each side interprets its orientation
consistently. Shared vertex identities handle corners. A stored authoritative
boundary contract is another valid approach when boundaries can change in play.
Both sides must use its current version. Load order and thread scheduling must
not select the terrain height, doorway, or passage width.

Specify world-to-chunk decomposition across zero. For positive chunk width L,
a floor-based convention uses chunk = floor(world/L) and local = world - chunk*L,
so local stays in [0, L); truncation toward zero misassigns negative positions.
Other conventions are valid only when generation, collision, navigation, and saves
agree. Test just below, at, and above zero and both signed chunk boundaries, plus
world/chunk/local round trips, shared corners, and reversed neighbor load order.

Check more than visible height continuity: normals/material blending when needed,
collision edges, navigation radius, vertical clearance, connectors, and cross-edge
entity ownership. Assign one owner to objects spanning regions; neighbor loading
must not duplicate them. A scenery exclusion zone must include paths, doors,
authored anchors, and their required clearance. Density candidates near an edge
need a shared sampling region or deterministic conflict resolution so trees on
opposite sides respect the same spacing rule.

Regenerating one interior must preserve its committed edge. If repair requires
changing that edge, invalidate and rebuild the affected region together, preserving
player-state overlays and references. Test chunks generated left-first, right-first,
in parallel, and after unload/reload. Traverse at supported movement speeds and
camera transitions; a correct stored seam may still disappear during streaming.
Missing neighboring data needs a declared wait, proxy, or blocked-transition
behavior rather than accidental access to absent geometry.

## State-aware solvability

Build a transition model from actual movement and interaction rules. Search state
includes location and every variable needed to decide future transitions: key
counts, opened doors, switches, acquired abilities, resources, and irreversible
flags as applicable. Traverse a door only when its requirements hold; apply key
consumption and door persistence when it opens. A visual corridor that collision
or movement rules prevent crossing is not an edge.

For example, two locked exits reachable with one consumable key may offer a
winning path yet also allow a permanent trap. Decide from the design whether the
trap is intentional, recoverable, or forbidden. Check required outcomes from
supported entry/save states and after permitted irreversible choices. Enumerate
small state spaces; for larger ones, use justified abstractions and bounded
exploration. Pruning by inventory dominance is unsafe when carrying an item can
disable a transition or when supposedly monotone flags have negative effects.

Return a witness path for success, a counterexample for a demonstrated failure,
or an inconclusive result when search or modeling is incomplete. Validate witnesses
against the runtime rules; a simplified solver can omit a physical obstruction.

## Failure policy and useful checks

Set attempt, runtime, and search limits from the generation context. Diagnose
contradictory constraints before sampling repeatedly. On failure, retain the
smallest useful failing region and state trace; change the cause, then replay it.
Revalidate every repair and fallback against the same required properties.

Keep cases for a key behind its own lock, consumable-key competition, one-way
movement, mismatched corner samples, duplicate boundary objects, and retry
exhaustion. Compare seed-set diversity and rejection distributions before and
after repair: removing every interesting branch can improve acceptance while
destroying the intended world. Bounded tests establish their inspected properties;
human exploration establishes the experience only under its observed conditions.

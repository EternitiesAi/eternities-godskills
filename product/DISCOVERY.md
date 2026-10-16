# Discovery: what the offline tools do

This page is for hosts integrating the CLI or investigating a match. It is not
required reading before ordinary skill use. Start with a compact capability
question, inspect a few candidates, then read the selected complete SKILL.md.

## Browse, then inspect

When the domain is known but the method is not, `browse` returns sorted category
counts without skill bodies. `browse --category NAME` returns just that primary
category's skill summaries, use exclusions and relationships in deterministic
ID order. The default page has five entries; `--limit 1..20` and `--offset N`
control category pages. Follow `nextOffset` until it is null; keep the same
release and category while paging. An out-of-range offset is an error.
It is exact catalog
navigation, not a semantic ranking or a statement that other domains are irrelevant.

`inspect SKILL_ID` returns the complete selected entrypoint and its exact hash,
plus declared optional resource pointers. It never truncates the entrypoint or
automatically includes reference bodies in its output. The CLI validates the pack first and
rechecks the selected body at read time. Integrity validation reads pack files;
compact output does not mean metadata-only disk I/O. Library users of `inspectSkill` must
also supply a freshly validated pack and catalog. IDs are exact normalized IDs,
not user-supplied paths. Unknown categories/IDs and malformed commands are errors.
The result still requires host applicability judgment; reading a method does not
select or activate it, or prove that a consumer followed it.

## Retrieval, not selection

Search combines weighted terms, a small explicit synonym vocabulary, stable
ties, and bounded lexical intent profiles. A profile requires several request
cues and matching skill metadata; it does not identify a skill from an exact
query lookup. Profiles cover written voice, interpersonal clarification,
task-record recovery, delivery completeness, sustained-work reconciliation,
corroborated usability-observation synthesis, learner-model explanation,
interactive motion continuity, requested frame-based video output, and tabular
reconciliation. A separate scope gate limits game and real-time 3D runtime
candidates for multiword task requests; it adds no ranking bonus.

The usability profile requires people performing a task, observed interaction,
a findings action, and an interface or task artifact. Isolated usability words
are not enough. These rules are not a general semantic classifier. Search
returns matched terms, profile reasons and related IDs; it never executes
anything. `offline-lexical-intent-phrases-v4` describes deterministic lexical
retrieval, not vector inference or a claim of superior semantic understanding.

The host still judges applicability. A low-quality match is not an instruction
to force a skill into the task. Category/task filters and anti-triggers restrict
candidates, but do not establish either permission or the need for a workflow.

## Corroborated learner requests

The learner-model profile requires five finite cue families: teaching purpose,
a requested teaching/preparation action, an explanatory objective, an explorable
representation, and manipulation or feedback. Matching owner metadata is also
required. A corroborated request ranks before incidental keyword hits; within
each tier, the existing score and stable ID tie-break remain unchanged. Scores
need not descend across tiers and are not confidence values. The reason reports
this ordering. Category/task filters, anti-triggers and host no-need still apply.

This learner profile omits balanced quoted material and recognized refusal or
historical clauses. It is not general negation, discourse or multilingual
understanding. Merely mentioning training or a model does not supply a request.

## Requested media and interactive motion

The frame-based video profile requires a media-artifact/encode purpose, a production,
inspection or recovery action, and a frame/timeline/dependency cue. Meaning-bearing
metadata binds this requirement to seekable frame-based video methods, not a
hard-coded skill ID. Shared game-audio cue words alone cannot admit that method.
Balanced quoted material and finite refused-production/manual-editing clauses
and explicit audio-only clauses are omitted for this profile. Generic scene/cue
words alone do not establish video purpose; a scene needs render/export/seek or
nonsequential evaluation evidence. Singular and plural film/video forms are
recognized. An exact skill ID remains addressable for inspection.

The motion-continuity bonus requires an interface object, motion action and
position/speed or geometry-change cue, with matching motion metadata. These are
finite English retrieval rules, not a general language model: unsupported
negation, mixed purposes or multilingual wording still require host judgment.
Neither profile selects a skill, installs an engine or grants action authority.

## Game and real-time 3D scope

A metadata profile describing game direction, runtime and player experience
separates admission from a corroborating purpose reason. Explicit game, gameplay,
player, engine or format context preserves lexical candidates even when a feature
uses unfamiliar wording. Creation requests have no modifier-distance limit.
Generic asset/hardware context needs separate evidence of work or a reported
fault, except for single-term topic navigation. Context alone does not receive
a purpose reason.
The rule follows capability metadata, not a skill ID or example-query lookup.
Engine and format names are optional evidence, not software/account requirements.

A runtime-purpose reason requires context and an independent work verb or
reported fault in the surviving request. A mesh, texture or GPU noun cannot fill both roles. The
problem statement and requested action can occupy separate clauses, as with a
gameplay-camera problem followed by a silhouette improvement request. This is
lexical evidence for review, not inferred permission or guaranteed task fit.

This gate removes broad game-owner hits from ordinary GIS coordinate repair,
drawer motion, encoded-video production and asset-license extraction when their
requests do not also establish runtime work. Recognized license/rights and pricing
clauses supply no runtime evidence; a separate live technical clause can still
qualify. It omits balanced quoted material and finite refused-action tails. A
sentence, semicolon or explicit `but`/`instead` contrast can introduce separate
live work. These finite rules do not resolve arbitrary negation, nested quotes,
historical scope, cross-sentence references or languages. A legal and technical
purpose packed into one clause can lose a useful runtime candidate; inspect a
known ID or browse its category when the shortlist does not fit the task.

Single alphanumeric term queries, such as `game` or `animation`, retain topic
navigation without claiming a corroborated task or awarding an intent bonus.
They can therefore return broad overlapping candidates. Exact IDs also remain
addressable. For an unfamiliar area, `browse --category games` provides a stable
directory without depending on task phrasing. For a task request, name its actual
operation and artifact; inspect the complete candidate and its exclusions.
Multiword shorthand without recognized context or an independent action/fault
may lose a useful runtime candidate. Empty results are not evidence that no
applicable skill exists.

## Need and narrow exclusions

Both `search` and `route` accept `--need none|specialist|unknown`. The host owns
this judgment. `none` returns no suggestions; `specialist` requests candidates
to check; the default `unknown` retrieves candidates with
`selection.state: review-required`. No option selects or activates a skill.
The same fact is available to `searchCatalog` as `need` and to `routeTask` in
its context. A no-need route holds connected-specialist eligibility without
calling a source. This is a caller boundary, not arbitrary language understanding.

For explicit limited arithmetic, casing, counting, grammar or metaphor questions,
or an explicit request to clarify before choosing a specialist, search can
return no suggestions with an `abstentionReason`. These narrow English rules do
not solve arbitrary intent, quotation scope or negation. A request to build,
design, implement or audit a workflow is not suppressed merely because it also
mentions a literal operation. No rule match does not establish that a skill is
needed; the host still checks fit.

Workflow precedence now uses the surviving unquoted request clauses: a recognized
refusal such as "do not audit" cannot defeat a separate limited counting request.
Straight, curly and backtick literals are omitted for these checks. A real audit
or implementation outside the literal still takes precedence over an incidental
counting/casing substep. These remain finite English rules, not general no-skill
inference; use the host `need` fact when it is known.

An exact normalized phrase from a skill's declared anti-triggers suppresses that
match. This is limited negative matching, not general semantic negation or an
authorization decision. Negated discovery words may still shortlist Atlas even
when a supplied file makes connected-source discovery unnecessary. A hit is not
permission to discover, load or use connected data. Local analysis remains
available when the supplied file actually needs analysis.

Atlas's supplied-data metadata covers merging exports, column mapping,
deduplication and row-rejection auditing. A request to work without a connected
source is a restriction on that optional method, not an exclusion of the whole
analytics skill. The catalog therefore does not use that restriction as an
owner-wide anti-trigger. Genuine owner exclusions still apply, and the host
must supply the connected-source facts below. These metadata terms improve
ordinary-language retrieval. A bounded tabular-reconciliation bonus additionally
requires a tabular input, a reconciliation action and a structural discrepancy
or identity cue, corroborated by the owner's supplied-data/column/deduplication
metadata. Generic records/lists/extracts need additional row, field, quantity or
key evidence, shared with the structural-identity check. An action and tabular
object must also occur in the same surviving request clause, or a direct action
reference such as "combine them" must follow a live tabular clause immediately.
Unrelated sentences, intervening topics and omitted historical/refused clauses
cannot supply that reference. An unrelated team call, task-memory record or retry log is not
automatically tabular reconciliation. Recognized source-code merge contexts are
excluded. It uses the existing capped profile bonus, not an ID lookup or a new
ordering tier. Balanced quoted material, recognized concept-only questions and
refused or historical reconciliation clauses are omitted for this profile.
Explicit no-transformation requests do not gain the bonus. These finite English rules
do not parse arbitrary negation or authorize an operation, and incidental
matches still require judgment.

## Connected-source eligibility

The optional `route` command makes the host decision callable. Atlas's
`connectedSource` state is `rejected`, `hold`, or `candidate`. `candidate` means
only that the connected-source method may be considered, not that any connector,
metadata, probe, load or credential use is authorized. The host supplies:

- `--input-scope`: `supplied-only`, `sufficient`, `missing-input`, `open` or `unknown`.
- `--connected-purpose`: `none`, `inventory`, `fill-missing`, `named-run` or `unknown`.
- `--discovery`: `prohibited`, `not-prohibited` or `unknown`.

`not-prohibited` is not a permission grant. `open` means the host established no
supplied-only limit; it is not source-access permission. Absent a decisive
rejection, omitted, unknown, malformed or contradictory facts hold. An explicit
discovery prohibition or supplied-only scope rejects the connected subroute even
if search shortlists Atlas; local analysis stays available.

The command does not infer these facts from wording. Establish them from the
user's task or ask when a material fact is unclear. Neither tool calls a connector
or observes a provider.

## Narrow methods and evidence

The [selected method directory](METHODS.v1.md) gives conditional links,
exclusions and separate document/outcome status axes. `METHODS.v1.json` binds
method bytes and any bundled review evidence. Build/validate refuses stale method
or review identities, including a changed method retaining its old review. This
is selected navigation, not an exhaustive method catalog or automatic selector.
Review receipts are optional evidence, not material to load during routine use.

## Native frontmatter

Build/validate requires one unambiguous name matching the folder ID and one
nonempty string description. Top-level keys use unquoted alphanumeric/hyphen/
underscore names; quoted keys and merge syntax are unsupported. Plain, quoted
and folded/literal block descriptions are supported; unsupported or ambiguous
scalar forms fail. Indented optional metadata is not interpreted. This
conservative check is not a general YAML parser, a validation of arbitrary
optional metadata or proof that every host loader behaves alike.
The portable catalog summary and native description serve different interfaces;
review both for consistent capability and exclusions when maintaining a skill.

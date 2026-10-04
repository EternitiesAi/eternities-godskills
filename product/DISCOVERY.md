# Discovery: what the offline tools do

This page is for hosts integrating the CLI or investigating a match. It is not
required reading before ordinary skill use. Start with a compact capability
question, inspect a few candidates, then read the selected complete SKILL.md.

## Retrieval, not selection

Search combines weighted terms, a small explicit synonym vocabulary, stable
ties, and bounded lexical intent profiles. A profile requires several request
cues and matching skill metadata; it does not identify a skill from an exact
query lookup. Profiles cover written voice, interpersonal clarification,
task-record recovery, delivery completeness, sustained-work reconciliation,
corroborated usability-observation synthesis, and learner-model explanation.

The usability profile requires people performing a task, observed interaction,
a findings action, and an interface or task artifact. Isolated usability words
are not enough. These rules are not a general semantic classifier. Search
returns matched terms, profile reasons and related IDs; it never executes
anything. `offline-lexical-intent-phrases-v3` describes deterministic lexical
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

This profile alone omits balanced quoted material and recognized refusal or
historical clauses. It is not general negation, discourse or multilingual
understanding. Merely mentioning training or a model does not supply a request.

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

An exact normalized phrase from a skill's declared anti-triggers suppresses that
match. This is limited negative matching, not general semantic negation or an
authorization decision. Negated discovery words may still shortlist Atlas even
when a supplied file makes connected-source discovery unnecessary. A hit is not
permission to discover, load or use connected data. Local analysis remains
available when the supplied file actually needs analysis.

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

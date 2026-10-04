# Configuration and usability-discovery refinement

This is a reviewed refinement of the portable 77-entrypoint pack, not a new
claim that the entire source quarry has been finished. Its content release ID is
`d6e1ba88549e7d94ca5d468fa006622a50dd18d46e22d1552051ade82841ac36`;
the implementation commit is `de08c546221afe472472bd87672cc70e68ff5470`.

## Useful changes

Daedalus now has a conditional [configuration-lifecycle method](../product/skills/eternities-daedalus/references/configuration-lifecycle.md).
Use it when defaults or overrides affect existing durable objects. It separates
where a value originated, how it is represented, precedence, refresh/cache
lifetime, and what a consumer can actually honor. Missing, null, false, deletion,
materialized values and inherited defaults are not treated as interchangeable.
It also requires explicit consideration of rename, collision, history, access,
replay and reversal consequences. A standalone constant without persisted
consumers does not need this method.

Offline discovery adds a bounded usability-observation profile. Its extra score
requires all four query cue groups: people doing a task, observed interaction,
findings action, and an interface/task artifact. It also checks matching skill
metadata. This makes relevant candidates easier to retrieve for this declared
lexical pattern; it is not a semantic classifier, automatic skill application,
permission inference or a general claim of improved agent performance.

The root README now reports the current 77 entrypoints and labels older
74-entrypoint exports as historical. This documentation-only correction is
outside the two implementation review scopes.

## Separate review and observed behavior

One independent Luna Max reviewer checked the configuration method's product fit
using two manually populated synthetic counterexamples, then separately checked
the actual conditional link, body continuity, provenance, resource packaging,
unchanged maturity, frozen 68-skill scoring projection and historical resources.
The integration slice was READY narrowly; its focused 36 tests passed.

A different independent Luna Max reviewer checked the discovery profile,
README claims and real offline search/route callers. Eleven fresh queries were
frozen before reading the candidate test examples. A positive return-form
paraphrase retrieved the target at rank 2 with the new profile reason; its
design-category-filtered variant ranked first. Missing findings-action cues did
not activate the profile. Host-supplied `need=none` returned no candidates,
while `unknown` remained review-required. The route caller held connected-source
routing when the required task facts were unavailable.

Negative evidence is retained: ordinary lexical scoring still retrieved the
target under narrow explicit negation and a clinical exclusion, without the
new profile reason. Literal anti-trigger text in a sentence rejecting that text
suppressed the otherwise relevant target. Exact-ID lookup is a separate caller
path. These are reasons to inspect suggestions and exclusions, not claims that
the system understands arbitrary intent or negation. The earlier W4 ranking
case and the parent's variations are development examples, not held-out wins.

## Verification and portable snapshot

The exact ten reviewed implementation/test files matched their frozen manifest
before and after the full Windows run: **1,482 registered, 1,480 passed, zero
failed and two environment skips**. The skips were unavailable Windows symlink
creation and an optional second-volume fixture. The bound receipt is recorded in
[the refinement evidence](evidence/godskills-refinement-20261003/receipt-v1.json).
Earlier unbound run evidence remains historical, not overwritten.

An isolated copied pack in a blank workspace, with empty PATH and no provider
credentials or home configuration, passed four actual CLI checks. This was the
same Windows host, not a fresh OS, another computer or an agent-outcome trial.

The [standalone 77-entrypoint ZIP](../artifacts/releases/godskills-product-20261003-d6e1ba88.zip)
and [SHA-256 sidecar](../artifacts/releases/godskills-product-20261003-d6e1ba88.zip.sha256)
contain 251 runtime files, including the release manifest. The archive exporter
verified the product before and after collecting its exact bytes. No quarry,
personal paths, provider credentials or repository dependencies are included.
Markdown use needs no runtime; the optional CLI requires Node.js 24 or newer.

The source-inspired method is original product prose with an explicit provenance
record. The source's identity-specific rights/access status has not been cleared
and no terminal R10 outcome follows. The three protected activation artifacts
are unchanged. The pack is still instruction-reviewed, not universally
performance-qualified. Local installation is recorded separately; this release
receipt was made before installation and remains immutable.

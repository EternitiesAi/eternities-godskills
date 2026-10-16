# Eternities Godskills

**Practical methods an AI agent can find when it needs them.** Build products,
run operations, investigate evidence, create experiences and carry difficult
work through to a usable result—without loading thousands of instructions.

The portable pack currently contains **93 skills across 21 categories**.
It works as Markdown on any agent that can read files. The optional offline
CLI adds discovery, integrity checks, export and backed-up installation.
Godagents, Codex, a model provider, the Keel and our source warehouse are not
required.

## Start in a minute

Download the [current standalone pack](artifacts/releases/godskills-product-20261016-7f93176c.zip)
and its [SHA-256](artifacts/releases/godskills-product-20261016-7f93176c.zip.sha256),
or copy the complete [product folder](product/README.md). Give your agent
[START-HERE.md](product/START-HERE.md) and your actual task.

The agent chooses a useful method, reads its entrypoint, and opens deeper
references only when needed. A simple request may need no skill. There is no
mandatory slash command, personality, daily ritual or chain of companion agents.

With Node.js 24+, no dependencies or API:

```text
node product/bin/godskills.mjs browse --category business
node product/bin/godskills.mjs search "preserve clients while changing our API" --limit 3
node product/bin/godskills.mjs inspect api-contract-design-and-evolution
node product/bin/godskills.mjs validate
```

Search offers candidates, not commands to execute. Review their applicability.
See the [portable installation and rollback guide](product/README.md#install-into-an-agents-skill-directory)
for native host discovery and the [host contract](product/HOST-CAPABILITIES.md)
for tool-specific execution.

## What you can do with it

| Your job | Example methods |
| --- | --- |
| Turn an idea into a product | Product discovery, architecture, implementation, interface design, release |
| Run and improve a company | Operating cadence, hiring, pricing, cash flow, supplier evaluation, customer support |
| Build reliable software and agents | API evolution, integration, testing, retries, observability, browser and Git state |
| Investigate and use evidence | Research, statistical inference, scientific validation, data lineage and reconciliation |
| Create compelling experiences | Visual direction, game worlds, animation, real-time assets, audio/video and narrative |
| Think, communicate and retain progress | Imaginative concepts, voice calibration, dialogue, memory and long-horizon continuity |

Browse the [capability map](product/START-HERE.md) or [complete directory](product/INDEX.md).
These are working methods with explicit boundaries, not substitutes for tools,
professional authority or live validation.

The latest refinement adds eight conditional methods under existing owners:
commercial qualification, first-value onboarding, operational constraints,
adaptive practice, shader construction, lighting/material calibration,
interrupted gameplay animation and frame-budget diagnosis. The
[selected method directory](product/METHODS.v1.md) now exposes 29 deeper methods
without adding compulsory entrypoints or loading them all into an agent's context.

Three [runnable, dependency-free examples](product/examples/README.md) now apply
those methods to shared-capacity calculations, honest onboarding cohorts, and
interruption-safe animation state. Their code passed 45 separately authored
acceptance cases. See the [application and delivery evidence](docs/executable-method-examples-20261016.md)
for exact scope: synthetic task implementations, not business uplift, rendered
quality, or a claim that skills outperform an unguided model.

## Three ways the pieces work together

**Idea → working product.** For a repair-shop booking tool, identify the
customer job and smallest useful workflow; settle who owns availability and
how concurrent bookings behave; build the working slice; refine its interface;
then verify and release within the actual deployment authority. Each phase
loads only the method it needs. A functioning product is not proof of demand.

**Failure → dependable repair.** For payments that time out and get duplicated,
reconstruct what committed, reconcile the uncertain result, preserve idempotency,
and test the race. A generic retry loop is not enough. A repair request does not
silently authorize customer refunds or production changes.

**Imagination → interactive world.** For a floating garden that people can
explore, develop a visual direction and playable scene, then refine camera
motion, asset interpretation, spatial interaction and performance. Preserve
good spontaneous design; a checklist cannot decide whether the result is beautiful.

[More composition examples](product/RECIPES.md) show research, voice, learning
and multi-session work. Godagents may supply an actor and execution state;
Godskills supplies selected methods. Neither requires the other.

## What is actually qualified

The [current release record](docs/usefulness-product-release-20261016.md) names
the exact bytes, independent review, tests, export and installation checks.
Skill-level instruction review, package tests and bounded agent applications
are different evidence. The library does **not** claim that every method
outperforms an unguided model or is validated for every real-world setting.

The product is separate from the source quarry. Thousands of overlapping
source records are research material, not silently installed skills.
[Corpus scope](product/CORPUS-SCOPE.md) preserves the unfinished source-review
work, conflicts and negative findings. New intake does not turn those into
completed refinement. The [current development plan](docs/superpowers/plans/2026-10-16-usefulness-release.md)
states this release's concrete acceptance gates.

## Development and compatibility

- [Portable product guide](product/README.md): use, export, install, rollback and evidence semantics.
- [Discovery contract](product/DISCOVERY.md): lexical limits, exclusions and no automatic activation.
- [Product direction](docs/product-direction-20261013.md): usable release, effectiveness and source accounting are distinct.
- [Release history and preserved legacy runtime](docs/history/README-before-cohesive-20261015.md): previous snapshots, research evidence and compatibility commands.

New installations should use `product/skills/`. The older `skills/` tree,
protocols and receipts remain for pinned consumers; they are not a second
recommended pack. Source attribution and applicable notices stay attached.

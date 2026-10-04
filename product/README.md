# Eternities Godskills

A portable library of practical methods for AI agents: engineering, research,
design, science, games, writing, operations, marketing, audio, and more.

## Start here

1. Read [the skill directory](INDEX.md), the [selected smaller-method directory](METHODS.v1.md), or search the compact `catalog.json` metadata.
2. Decide whether a skill adds value to the actual action; ordinary competence
   is the right route for simple requests. Pick the smallest useful skill, not
   one triggered merely by domain vocabulary or a slash command.
3. Read its `skills/<id>/SKILL.md`. Open only the references needed for that task.
4. Apply the method within the user's request and the host's permissions. Related
   skills are suggestions, not mandatory dependency chains.

Use the skill to supply the missing method, not to replace capable judgment.
For a small task, apply the relevant decision or check directly; do not manufacture
a plan, ledger, reviewer chain or checkpoint report. For consequential work, expand
only the parts needed to manage its actual uncertainty and effects. Keep a
specialist's non-obvious failure checks even when its surrounding process can be
shortened. Read another skill only when the next decision needs a different method;
handoffs need the result, unresolved issue and relevant artifacts, not the full
conversation. [Composition examples](RECIPES.md) show these boundaries in practice.

Markdown is the product's baseline interface. It requires no API, vector database,
network connection, installation script, special computer layout, or AI provider.
Copy this entire folder anywhere, including a blank workspace. A coding agent can
read it immediately. The skills are equally usable outside Codex and Godagents.

Without Node, give the agent this folder and ask it to use `INDEX.md`. To expose
skills through a host's native loader, copy the desired directories from `skills/`
to that host's documented skill location, retaining their references. Preserve
any existing versions first. The automated installer below is an optional safer
way to make and verify those backups.

## Optional offline tools

With Node.js 24 or newer, no dependency installation is needed:

```text
node bin/godskills.mjs validate
node bin/godskills.mjs search "test audio DSP discontinuities" --limit 3
node bin/godskills.mjs search "release readiness" --task verify
node bin/godskills.mjs search "Say hello to the robotics team" --need none
node bin/godskills.mjs route "Analyze the supplied report only; do not discover connected data" --input-scope supplied-only --connected-purpose none --discovery prohibited
```

Search returns a few candidates with match reasons, not a selection or permission
to act. It uses weighted terms and bounded lexical profiles, not a general semantic
classifier. Scores are not confidence values and need not descend across request
priority tiers. Read the complete selected entrypoint and check the actual task.

Use `--need none` when the host established that no specialist method is needed;
it returns no suggestions. `specialist` and the default `unknown` still require
applicability review. A lexical hit never authorizes connected-source access.
The optional `route` command holds that subroute until explicit task facts support
consideration; supplied-only scope or a discovery prohibition rejects it while
local analysis stays available. No command selects, activates or calls a provider.

No match means use ordinary competence, refine the query or browse a category—not
invent a capability or load the library. The [selected method directory](METHODS.v1.md)
can locate a narrower bundled method. Its status and exact evidence bindings are
separate from skill-level maturity. Read [discovery details](DISCOVERY.md) only when
integrating these tools or diagnosing retrieval, exclusions and evidence status.

## Thinking, expression and continuity

The library also offers focused methods for calibrating a writing voice,
developing imaginative concepts, understanding interpersonal dialogue,
retaining task-critical memory, auditing completeness and carrying long-horizon
work across interruptions. They are selected for an actual need, not loaded as a
mandatory personality or reasoning stack. See [composition examples](RECIPES.md).

These methods do not create clinical expertise, unlimited recall, a background
runner or a guarantee of creative quality. [Host capabilities](HOST-CAPABILITIES.md)
explains how portable guidance can coexist with a host's native skills and tools.

## Hand the pack to another computer

Copy this folder, or use the optional verified export:

```text
node bin/godskills.mjs export --output <new-absolute-archive-path>
```

The destination's parent directory must already exist, and the archive must be
outside this pack. Export refuses existing files and linked output paths. It
verifies all declared content before creating a standard ZIP containing only
the standalone `godskills/` folder, including its catalog, methods, resources,
CLI and release manifest. Selected historical method-review receipts, reports
and bounded supporting data are included as optional evidence. The source
warehouse and the rest of the development checkout are not included. Stored
entries and fixed timestamps make identical pack bytes
produce identical archive bytes across checkout locations.

Save the returned `archiveSha256` and `releaseId` through a trusted channel.
On the receiving computer, verify the archive SHA-256, extract it using a normal
ZIP utility, and open `godskills/README.md`. With Node, run
`node godskills/bin/godskills.mjs validate` before installation. Hashes establish
consistency with the received manifest, not publisher authenticity. Markdown
use still needs no Node. Export never installs or activates skills.

## Install into an agent's skill directory

Supply three separate absolute paths on the same filesystem volume. The source
pack may be on another volume. Replace the example placeholders with the
host's actual directories. The runtime directory holds a standalone copy of the
pack; the skill directory exposes entrypoints to the agent's normal loader.

```text
node bin/godskills.mjs install --skills-dir <absolute-skills-directory> --runtime-dir <absolute-pack-directory> --backup-dir <new-absolute-backup-directory>
```

The installer verifies bytes before changing anything. It replaces only IDs
present in this pack, preserves unrelated directories, and moves previous
versions into the named backup. It writes a durable installation journal and
verifies the installed files. It does not edit global agent instructions, enable
tasks, install dependencies, call providers, or alter model settings. An existing
backup directory is refused. Do not run concurrent installers against one target.
Automated installation exposes all skills in this pack; for a subset, use the manual
folder-copy path described above and preserve its referenced resources.
An existing runtime directory must already be an intact Godskills pack; the
installer will not replace an unrelated folder or a modified runtime snapshot.

To undo a completed installation:

```text
node bin/godskills.mjs rollback --receipt <absolute-backup-directory>/install-receipt.json
```

Rollback refuses if installed skills or backups changed after installation. No
material files are deleted: replaced and rolled-back versions remain recoverable.
An interrupted journal requires inspection; it is not silently treated as a
completed transaction. Skill catalogs cached by an agent may require a new task
or application reload. File installation alone does not prove UI discovery.

## What the evidence means

- **Instruction-reviewed:** the established skill route has been rewritten and
  reviewed for its documented scope. This is the default skill-level maturity
  label of this release. A method explicitly marked DRAFT remains a proposal
  until separately reviewed and accepted. Bundling a DRAFT reference does not
  upgrade it; it does not imply automatic selection, source rights, or
  operational validation.
- **Independently document-reviewed method:** a versioned method-directory row
  records later review of exact guidance while its original body may retain the
  DRAFT label. Read the row's scope and execution/outcome axis together. This does
  not qualify performance, grant rights, or confer that status on other methods.
- **Package-tested:** executable tests check catalog behavior, portable paths,
  byte identity, installation and rollback. These test software, not expertise.
- **Agent exercise:** an actual agent uses a fixed skill snapshot on a recorded
  task. Results apply to that task and configuration only.
- **Performance-qualified:** requires independent matched comparisons with
  predeclared quality and resource criteria. This release does not claim that
  status for every skill, or claim to outperform a raw model universally.

Historical routing fixtures, self-declared expected results, corpus size, and
popularity do not demonstrate better agent performance. The thousands of source
skills are research inputs, not thousands of silently activated instructions.
See [corpus scope](CORPUS-SCOPE.md) for the distinction between acquired, grouped,
reviewed, distilled, and unresolved material.

## Host integration contract

The catalog uses machine-independent IDs and ordered `skills/<id>/SKILL.md`
entrypoints with SHA-256 hashes. `release.json` binds the shipped file set;
identity excludes checkout paths and timestamps. A hash proves consistency with
the manifest, not publisher authenticity. Distribute through a trusted channel or
pin a separately obtained release ID when authenticity matters.

Discovery, eligibility, selection, and activation are separate operations. This
library returns metadata only: `authority: none`, `activation: none`. A host may
apply its own risk and resource policies, but must not infer permission from a
match score. Legacy Godagents protocols and frozen receipts are not silently
replaced by this versioned catalog.

`skill.json` retains provenance relationships. Independent rewriting does not
automatically remove upstream obligations. Do not redistribute upstream source
packs as if they were first-party work. Retain applicable notices for any actual
third-party material you add.

Provenance strings identify authoring history; they are not files the receiving
agent must locate or read. Only the selected entrypoint and its declared bundled
resources are needed to use a method. A new computer does not need the source
repositories, private development history, or a matching author workstation.

# Portable methods and host capabilities

Godskills provides working methods. A host provides the actual model, filesystem,
tools, persistent stores, agent workers and scheduling. Neither the presence of a
skill nor a discovery match grants a new capability or permission.

## Choose the smallest useful combination

Read the relevant Godskills entrypoint for its decisions and outputs. Use a
native host skill only when it supplies needed tool-specific knowledge or a
concrete artifact workflow. Do not load a stack of companion skills merely
because their names sound related. If a host lacks a tool, return a useful
portable artifact or name the missing prerequisite; do not pretend it ran.

| Need | Portable layer | Optional host facility |
| --- | --- | --- |
| Author or refine a skill | Sovereign Skill Refinery and the method's neutral contract | A native skill creator, validator and actual host discovery mechanism |
| Make a skill discoverable | INDEX.md, catalog.json and optional offline search | A native skill installer or documented skills directory, with preservation of existing content |
| Produce a picture or designed document | The chosen creative or document method | An available image, document, presentation, spreadsheet or PDF tool |
| Retain decisions between sessions | A minimal scoped record with evidence, freshness and invalidation | An authorized persistent store and retrieval facility |
| Coordinate work across days | Long-horizon checkpoints, ownership, effect reconciliation and stop conditions | A real runner/scheduler and observable worker lifecycle |
| Investigate current host behavior | Source-grounded research | Current official host documentation and a read-only capability inventory |

These are functional roles, not required products. Another host may implement
them differently, or not implement them at all. No provider account, API key,
named model, native skill or fixed machine layout is required to read the pack.

## Codex companion example

Codex installations may expose Skill Creator, Skill Installer, OpenAI Docs,
Image Generation and plugin-provided document tools. Check the actual session's
available skills and tools before use; an on-disk folder alone does not establish
that a running session has loaded it or that a service is authenticated.

These companions are not bundled native dependencies of the universal pack.
Do not replace them with generic Godskills instructions when their tool-specific
procedure is needed, and do not copy their execution assumptions into a skill
intended for other hosts. Agent-selected discovery does not require the user to
learn slash commands. The host's trigger rules and permissions still apply.

OpenAI's [skill concepts](https://developers.openai.com/plugins/concepts/skills)
separate reusable guidance from tools and controlled actions. Its
[skill-building guide](https://developers.openai.com/plugins/build/skills)
describes the native creator. These are documentation references, not an
availability guarantee or instruction to install anything.

## Continuity without autonomy theater

A checkpoint is data, not a scheduled task. A retained plan does not mean an
agent is running. Report whether work is active, stopped, waiting, or unknown
from the actual runner's evidence. After interruption, reconcile ownership and
uncertain effects before retry. Preserve the user's stop and pause conditions;
do not create a new runner, provider call or external effect from a skill alone.

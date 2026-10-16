# Choose one useful method

Godskills is a portable capability library, not a mandatory personality or a
reason to turn every request into a project. For a simple task, ordinary agent
competence may be enough. Otherwise pick the smallest method that helps.

## Find your area

These are navigation links, not a required reading list. Open one relevant
section of the [full directory](INDEX.md), then its selected `SKILL.md`:

| Work | Directory sections |
| --- | --- |
| Build, debug, integrate and ship | [Engineering](INDEX.md#engineering), [automation](INDEX.md#automation), [release](INDEX.md#release), [security](INDEX.md#security) |
| Run and improve a business | [Business](INDEX.md#business), [finance](INDEX.md#finance), [marketing](INDEX.md#marketing), [legal](INDEX.md#legal) |
| Make experiences and communicate | [Design](INDEX.md#design), [games](INDEX.md#games), [audio and video](INDEX.md#audio), [writing](INDEX.md#writing), [social](INDEX.md#social) |
| Investigate, analyze and teach | [Research](INDEX.md#research), [science](INDEX.md#science), [data](INDEX.md#data), [models](INDEX.md#models), [education](INDEX.md#education), [agriculture](INDEX.md#agriculture) |
| Retain context and finish work | [Memory](INDEX.md#memory), [agent workflows](INDEX.md#agent-workflows) |

Categories are primary filing locations, not strict capability boundaries.
Some tasks cross them. Search or follow a relevant relation when a different
method is needed; do not load a whole domain or all related skills by default.

## Optional command-line path

From this folder, with Node.js 24+ and no dependencies or API:

```text
node bin/godskills.mjs browse
node bin/godskills.mjs browse --category business
node bin/godskills.mjs search "compare suppliers before a contract renewal" --limit 3
node bin/godskills.mjs inspect vendor-evaluation-and-exit-planning
```

Use `browse` for a broad area and `search` for the actual operation and artifact,
such as comparing suppliers before renewal. A one-word search is topic navigation;
its candidates can overlap. Search ranks lexical evidence, not confidence or
permission. If a result misses the task, try a more specific capability question,
browse its category, or inspect a known exact ID. An empty shortlist does not
prove that no useful method exists.

`browse` lists domains and counts; a category returns five skill summaries and
exclusions at a time. If `nextOffset` is a number, repeat the category command
with `--offset` set to that number. `--limit 1..20` changes the page size.
`inspect` returns one complete entrypoint and pointers to its
optional references, not their bodies. Validation reads pack files for integrity;
only the selected content is returned to the agent.
Without Node, the Markdown links above are sufficient.

When the host already knows that ordinary competence is enough, it can pass
`--need none` to either `search` or `route`; both return an empty shortlist.
For example, `node bin/godskills.mjs search "Say thanks to the data team" --need none`
does not manufacture an analytics workflow. The default `unknown` returns
candidates for review, and `--need specialist` still requires checking task fit.

## Apply selectively

Read the complete selected entrypoint. Check its use/no-use conditions against
the actual request. Open only the references needed for the next decision.
Use the host's native tools and skills where they supply execution details.
Neither a search hit nor an inspected method grants permission or activates work.

Related skills can help with a later phase; they are not dependency chains.
See [composition examples](RECIPES.md) if the task really spans several phases.
For installation, export and evidence limits, read the [product guide](README.md).

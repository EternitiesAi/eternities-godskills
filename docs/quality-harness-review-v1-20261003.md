# Independent quality harness review, October 3, 2026

**Disposition: repair the harness before the formal 12 runs.** The settled
pilot establishes two completed response runs under the requested CLI flags. It
does not close the isolation, job identity, concurrency, or failure-handling
gates identified below. These findings concern the harness, not pilot answer
quality; no outcomes were scored.

## Independence, scope, and source identity

The reviewer did not author this harness. The discovery candidate remains
frozen at `d24bc3ec5a74f6e421b4c23ca07d5defb8d42825`; it is not integrated into
main. This note is the only new workspace file from this review and is not a
change to that commit. The counterbalanced-agent-evaluation guidance informed
the matching, blinding, and provenance checks.

Reviewed read-only in
`C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003`:

| Source | SHA-256 |
| --- | --- |
| `scripts/quality-evaluation-harness.mjs` | `47027917f346de3638a391b3db92b210d0cf856d2bd1a1c9584209f25716e876` |
| `tests/quality-evaluation-harness.test.mjs` | `a4f4a6deb14da842e610ed3119b3f6a86e11579b15b8c0c80879a47672c66059` |

Both were untracked parent-authored files at review time, with worktree HEAD
`311dd839c273dffb3d994cfc9712374afac61624`. The hashes were rechecked after the
probes. Existing parent edits were preserved.

The allowed private records were under
`C:/Users/Dom/.codex/operations/godskills-quality-20261003/pilot-v2`:
`summary.json` and each arm's `state.json`, `preflight.json`, `events.jsonl`, and
`stderr.log`. Event processing excluded `agent_message.text`. No `prompt.txt`,
`result.md`, fixture file, held-out task/answer, auth file, or other credential
was opened. Model/provider configuration values were not read from a real home.
The only code executions were the three pure unit tests, pure exported helper
probes, and synthetic in-memory runs of the actual harness source. No child CLI,
agent, provider, network request, or operational write was launched by those
synthetic runs.

## What the pilot actually supports

Both state records exactly match their corresponding summary rows. Both event
file hashes match the stored `eventsSha256`. Each log has `thread.started`,
`turn.started`, one completed agent-message item, and one `turn.completed`.
There are no logged tool items or turn failures. Recorded results:

| Recorded metric | Baseline | Selected-guidance arm |
| --- | --- | --- |
| Exit / state | 0 / completed | 0 / completed |
| CLI elapsed `wallMs` | 12,123 | 14,156 |
| Input tokens | 10,267 | 10,513 |
| Cached input tokens | 0 | 0 |
| Output tokens | 381 | 559 |
| Reasoning output tokens in raw event | 312 | 516 |
| Cache-write input tokens in raw event | 0 | 0 |
| Logged tool calls | 0 | 0 |

The preflight role/type/content structures are equal after normalizing the arm
name in the workspace path. Message IDs and timestamps differ, as expected.
Both carry exactly the factory descriptions for `imagegen`, `openai-docs`,
`skill-creator`, and `skill-installer`. Their emitted instruction kinds are
`host_skills.instructions`, `permissions.instructions`,
`collaboration_mode.instructions`, `multi_agent.role_instructions`,
`multi_agent.mode_instructions`, `environments.environment_context`, and
`user.text`. There is no emitted project/global AGENTS or memory instruction
kind and no known Keel/memory/global-Dom contamination marker. Mentions of
`AGENTS.md` in the multi-agent factory instructions are generic references,
not evidence that global AGENTS was loaded.

The baseline label `factory-codex-baseline` is appropriate for this observed
prefix. It is not a zero-skill baseline. The skill state's sole selected file
is `skills/voice-style-calibration/SKILL.md`, hash
`01efcb9a8780efada72d7c6b263f2be51137d5311bedb3aea506f9d131ed308b`, with
treatment release ID
`54688268f540ce974272f4619f88d97adde80a0c058325a5b8f960432370a0dd`.
Those bindings are recorded state values; the real treatment pack and result
contents were not reopened for this review.

## Confirmed important defects

### 1. P1: completed replay does not bind the treatment or execution identity

Locations: harness **80-85**, before treatment resolution at **100-103**;
the helper test at **tests:20-25** checks status only.

Reuse compares only whole-fixture hash, home-config hash, and `result.md` hash.
It never resolves the current treatment or compares its files/release identity.
It also does not validate stored prompt/event hashes, the executable/harness
identity, requested model/provider/reasoning, job arm/task identity, or the
stored isolation validity. Thus a treatment revision or corrupted event receipt
can silently retain a previous completed result under a new evaluation request.

Reproduction against the actual `runEvaluation` with an in-memory filesystem:
run a neutral matched pair, change the selected guidance from V1 to V2, corrupt
both event logs, and call the same operation again. **Zero new spawn calls**
occurred; both records were reused, including the old treatment release ID.
V1 SHA was `736c4774ae88fe93a854bdfc42fffbf23294df038eaaa07541de3b7c0d115d19`;
current V2 SHA was `da666d14106139741b3fac68a2c15aae4a0f3c5d3145584f0e339f8cd83b29f8`.

Repair within this harness: compare a complete frozen job identity before reuse,
including the selected treatment and execution version, and validate retained
prompt/preflight/event/result receipts. Identity mismatch must request
reconciliation, not silently reuse or automatically rerun paid work.

### 2. P1: the existence check is not an exclusive job claim

Locations: harness **74-90**, **103-106**, and **118**.

Two callers using the same operation can both observe no state and dispatch the
same paid job. `mkdir(..., recursive:true)` and ordinary `writeFile` do not
exclude another caller. The cursor only coordinates workers inside one call.
Fixture task IDs are checked for syntax but not uniqueness, so duplicate IDs
also alias workspaces, prompts, states, and outputs within one invocation.

Reproduction: two concurrent invocations, one neutral fixture task, concurrency
2 each: **four exec calls for two distinct result paths**. One invocation with
two duplicate task IDs and concurrency 4 also dispatched **four exec calls for
two result paths**. This duplicates jobs and invalidates both the budget limit
and artifact ownership; competing writers can replace each other's records.

Repair: reject duplicate task IDs before any job preparation, and acquire an
exclusive operation/job claim before overwriting evidence or dispatching. Keep
existing uncertain jobs held for reconciliation. Do not treat a partially
written state or an existing directory as proof that it is safe to start.

### 3. P2: an invalid job stops one worker, but other workers keep dispatching

Locations: harness **77-78**, **115**, and **118-120**.

The invalid-run throw exits only that worker. Other workers continue consuming
the shared cursor. `Promise.allSettled` notices the rejected worker after the
remaining workers have finished their queues. The message saying to reconcile
before continuing does not enforce that condition globally.

Reproduction: three neutral tasks, concurrency 2, first exec returns code 1.
The harness still launched **all six exec jobs, four after the invalid state
was recorded**, before reporting `Evaluation had invalid/uncertain work`.

Repair: set a shared stop-dispatch flag on worker failure and check it before
claiming another job. Let already dispatched jobs settle and preserve their
receipts; this does not require cancellation or automatic retry.

### 4. P2: malformed/error streams and empty output can be labeled completed

Locations: harness **108-112**; usage helper **25-31**. Tests **14-18** exercise
only usage extraction, not the final execution predicate.

Unparseable lines become `unparsed-output` and are then ignored. Top-level
`error` events are ignored. Only completed command/MCP/web items count as tools;
an unmatched started command is not detected. Result acceptance checks file
existence, not whether a final response was delivered or the file is nonempty.

Reproduction: a code-0 synthetic stream containing `not-json`,
`item.started` for `command_execution`, a top-level `error`, and one completed
usage turn, with an empty result file, was accepted in both arms as
**`status: completed`, `toolCalls: 0`**. Its result hash was the SHA-256 of empty
bytes, `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Repair: validate the event stream and terminal result coherently. Malformed,
error, or unresolved tool activity must not certify no tools and successful
delivery. Require a delivered final response and a matching nonempty output.
The existing pilot event logs do not exhibit this defect; their observed
settlement remains recorded.

### 5. P2: the isolation label is stronger than the validator and invocation

Locations: harness **13-22**, preflight **95-99**, exec **106**;
tests **6-13** cover only selected marker strings/catalog syntax.

`inspectIsolation` accepts arbitrary additional instructions if they omit a few
blacklisted strings. It ignores an unclosed skill wrapper, and factory skill
names alone pass regardless of their descriptions. It does not check the
instruction provenance kinds available in the pilot input. The preflight also
uses `debug prompt-input ISOLATION-PREFLIGHT` without the exec's explicit strict
configuration/model/provider/reasoning/ephemeral options, and does not capture
the actual exec input. Therefore its classification is a sampled prefix check,
not proof of the real worker's complete inherited context.

Pure exported-function reproductions all returned `valid: true`:

- A developer message containing `# AGENTS.md` and private project scoring
  instructions: labeled `raw-local-context-free`.
- A developer message containing saved task decisions without the known memory
  marker: labeled `raw-local-context-free`.
- An unclosed `<skills_instructions>` listing `voice-style-calibration`:
  labeled `raw-local-context-free`.
- A closed factory-name catalog whose `openai-docs` description contains extra
  private evaluation guidance: labeled `factory-codex-baseline`.

Repair: fail closed on unrecognized/malformed instruction structure; bind the
approved factory descriptors and expected instruction provenance to the
execution configuration. Verify the actual execution prefix where the host
provides it, or explicitly limit the claim to the captured preflight. This is
not evidence that the settled pilot actually inherited local Godskills, Keel,
memory, or global AGENTS; the inspected pilot prefixes did not show those.

## Other measured gates and interpretation limits

**Runtime initialization differed between arms.** The skill arm's
`stderr.log:1-2` reports failure to initialize the state runtime/migrate
migration 55: `no such table: thread_artifacts`. The baseline log reports only
the PowerShell shell-snapshot warning; that warning is shared by both arms.
Both execs share the same `CODEX_HOME` at harness **73** and start concurrently.
The underlying cause of the database error is not proven by these records;
do not call it a confirmed migration race or a model failure. Nevertheless,
matching state-runtime initialization has not been established. Reconcile and
verify initialization before formal concurrent runs, retaining these pilot
warnings rather than silently declaring the runtime conditions equal.

**Model provenance is requested, not independently observed.** Harness **103**
hardcodes `gpt-6-luna`, `max`, and `openai`; **106** explicitly requests those
values. Neither inspected event stream nor preflight has effective model/
provider/reasoning receipt fields. There is no evidence of a different model,
but state values alone do not verify the served model. Record the executable/
effective configuration provenance the host exposes and label unavailable
served-model evidence unknown. The home config digest is shared and recorded,
but its contents were deliberately not opened here.

**Usage is partly preserved.** The input/cached-input/output summary matches
the raw settled turn for both pilots. Raw logs also expose reasoning-output and
cache-write counters, which `settledUsage` drops; retain them if evaluating
reasoning or provider cost. Do not add reasoning tokens to output without
knowing the provider's accounting, and do not infer actual charges from token
counts alone. A pure probe also accepts negative/noninteger finite counters or
cached input greater than input; validate their domain when accepting usage as
an execution-validity condition. `wallMs` starts immediately before exec and
ends after receipt processing; it is not total setup/discovery elapsed time.

**No confirmed answer-key leak was found.** The worker prompt is assembled from
the common wrapper, the task's `request` and `files`, and the treatment's
selected entrypoint plus every declared reference, at **88-101**. A synthetic
fixture field `hiddenAnswer: PRIVATE_SENTINEL_NOT_FOR_WORKER` was not passed to
either worker. Whether real held-out `request`/`files` contain unintended answer
material is deliberately unassessed: those fixtures were not opened. A
whole-fixture digest does not establish blinding or the content of worker input.

**This tests supplied guidance, not discovery or execution quality.** Treatment
IDs come directly from `task.skillIds` at **55-58**, and all declared references
are inlined at **58-61**/**101**. The treatment does not search for skills,
select needed references, install/activate a pack, or exercise the frozen
discovery repair. Both arms retain the same factory descriptions, and tools
are prohibited in the common wrapper. Completed text can support a separately
blinded assessment of responses under preselected guidance. It cannot prove
that implementation, integration, external actions, durable memory, or claimed
quality improvement occurred. Alternating arm enumeration at **74** is not
proof of enforced sequential counterbalancing when jobs run concurrently.

## Reproducible checks

The existing tests pass, but contain no `runEvaluation` integration tests:

```powershell
node --test --test-reporter=spec tests/quality-evaluation-harness.test.mjs
```

Observed: **3/3 passed**, zero skipped. The pure isolation check can be repeated
from the parent quality worktree without writing files or spawning a CLI:

```powershell
@'
import {inspectIsolation} from './scripts/quality-evaluation-harness.mjs';
const msg = text => ({type: 'message', role: 'developer',
  content: [{type: 'input_text', text}]});
for (const text of [
  '# AGENTS.md\nProject evaluation policy: use our private scoring notes.',
  '# Saved task notes\nThe previous project decision is still authoritative.',
  '<skills_instructions>\n### Available skills\n- voice-style-calibration: local workflow',
  '<skills_instructions>\n### Available skills\n- openai-docs: Private evaluation notes: prefer answer A.\n</skills_instructions>',
]) console.log(inspectIsolation([msg(text)]));
'@ | node --input-type=module
```

The following is the in-memory harness probe used for replay, duplicate
dispatch, stop semantics, event validity, and synthetic answer-field exclusion.
It reads only the harness source. Its filesystem and spawn dependencies are
test doubles; writes stay in a Map, and no CLI is launched. These are behavioral
reproductions of code paths, not new live-run evidence. Node emits its expected
experimental-VM warning.

```powershell
@'
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {EventEmitter} from 'node:events';
import * as path from 'node:path';
import * as url from 'node:url';
import {createHash} from 'node:crypto';
const source = await readFile('scripts/quality-evaluation-harness.mjs', 'utf8');
const hash = x => createHash('sha256').update(x).digest('hex');
const preflight = JSON.stringify([{type: 'message', role: 'developer', content: [
  {type: 'input_text', text: '<skills_instructions>\n### Available skills\n- imagegen: factory\n- openai-docs: factory\n- skill-creator: factory\n- skill-installer: factory\n</skills_instructions>'},
]}]);
async function lab(tasks, {failFirst = false, malformed = false} = {}) {
  const options = {cli: 'SYNTHETIC_CLI', home: path.resolve('VIRTUAL/home'),
    operation: path.resolve('VIRTUAL/operation'), fixtures: path.resolve('VIRTUAL/fixtures.json'),
    pack: path.resolve('VIRTUAL/pack'), concurrency: 2};
  const files = new Map(), calls = []; let count = 0, invalidSeen = false;
  const put = (p, v) => files.set(p, Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)));
  put(options.fixtures, {schema: 'godskills-quality-fixtures-v1', tasks});
  put(path.join(options.home, 'config.toml'), '# synthetic public config');
  function treatment(text) {
    const file = 'skills/synthetic-guidance/SKILL.md';
    put(path.join(options.pack, 'catalog.json'), {skills: [
      {id: 'synthetic-guidance', entrypoint: file, resources: []},
    ]});
    put(path.join(options.pack, file), text);
    put(path.join(options.pack, 'release.json'), {releaseId: hash(text), files: {[file]: hash(text)}});
  }
  treatment('SYNTHETIC GUIDANCE V1');
  const fs = {
    readFile: async (p, encoding) => {
      if (!files.has(p)) throw Object.assign(new Error('absent synthetic file'), {code: 'ENOENT'});
      return encoding ? files.get(p).toString(encoding) : files.get(p);
    },
    writeFile: async (p, v) => put(p, v), mkdir: async () => {},
  };
  const spawn = (cli, args, opt) => {
    const child = new EventEmitter(); child.stdout = new EventEmitter();
    child.stderr = new EventEmitter(); child.pid = 100 + (++count); child.kill = () => true;
    child.stdin = {end: input => {
      calls.push({args, input, afterInvalid: invalidSeen});
      const exec = args[0] === 'exec', n = calls.filter(c => c.args[0] === 'exec').length;
      setTimeout(() => {
        if (!exec) {child.stdout.emit('data', preflight); child.emit('close', 0); return;}
        const extra = malformed ? 'not-json\n' + JSON.stringify({type: 'item.started',
          item: {type: 'command_execution'}}) + '\n' + JSON.stringify({type: 'error',
          message: 'synthetic stream error'}) + '\n' : '';
        put(args[args.indexOf('-o') + 1], malformed ? '' : 'SYNTHETIC RESPONSE');
        child.stdout.emit('data', extra + JSON.stringify({type: 'turn.completed',
          usage: {input_tokens: 1, output_tokens: 1}}) + '\n');
        child.emit('close', failFirst && n === 1 ? 1 : 0);
      }, exec && !(failFirst && n === 1) ? 5 : 0);
    }};
    return child;
  };
  const context = vm.createContext({setTimeout, clearTimeout,
    process: {argv: [], env: {}, stdout: {write: s => {
      if (JSON.parse(s).status === 'invalid') invalidSeen = true;
    }}}});
  const module = new vm.SourceTextModule(source, {context,
    identifier: url.pathToFileURL(path.resolve('scripts/quality-evaluation-harness.mjs')).href});
  const deps = {'node:child_process': {spawn}, 'node:fs/promises': fs,
    'node:path': {resolve: path.resolve, join: path.join, dirname: path.dirname},
    'node:url': {fileURLToPath: url.fileURLToPath}, 'node:crypto': {createHash}};
  await module.link(spec => {
    const exports = deps[spec];
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [k, v] of Object.entries(exports)) this.setExport(k, v);
    }, {context});
  });
  await module.evaluate();
  return {options, files, calls, treatment,
    run: o => module.namespace.runEvaluation({...options, ...o})};
}
const task = id => ({id, request: 'Return a neutral synthetic answer.', files: {},
  skillIds: ['synthetic-guidance'], hiddenAnswer: 'PRIVATE_SENTINEL_NOT_FOR_WORKER'});
const execs = l => l.calls.filter(x => x.args[0] === 'exec');
const counts = l => ({exec: execs(l).length,
  uniqueOutputs: new Set(execs(l).map(x => x.args[x.args.indexOf('-o') + 1])).size});
const replay = await lab([task('neutral')]); await replay.run();
const before = replay.calls.length; replay.treatment('SYNTHETIC GUIDANCE V2');
for (const arm of ['baseline', 'skill']) replay.files.set(path.join(replay.options.operation,
  `neutral-${arm}`, 'events.jsonl'), Buffer.from('tampered invalid event log'));
const reused = await replay.run();
console.log('stale replay', {spawnDelta: replay.calls.length - before,
  retainedTreatment: reused.find(x => x.arm === 'skill').treatmentReleaseId,
  newTreatment: hash('SYNTHETIC GUIDANCE V2')});
console.log('synthetic answer-field leak', execs(replay).some(x =>
  x.input.includes('PRIVATE_SENTINEL_NOT_FOR_WORKER')));
const concurrent = await lab([task('neutral')]);
await Promise.all([concurrent.run(), concurrent.run()]); console.log('two callers', counts(concurrent));
const duplicate = await lab([task('same-id'), task('same-id')]);
await duplicate.run({concurrency: 4}); console.log('duplicate IDs', counts(duplicate));
const fail = await lab([task('a'), task('b'), task('c')], {failFirst: true});
try {await fail.run();} catch (e) {console.log('dispatch after invalid',
  {message: e.message, exec: execs(fail).length, afterInvalid: execs(fail).filter(x => x.afterInvalid).length});}
const invalid = await lab([task('neutral')], {malformed: true});
console.log('invalid stream accepted', (await invalid.run()).map(x =>
  ({arm: x.arm, status: x.status, toolCalls: x.toolCalls, resultSha256: x.resultSha256})));
'@ | node --experimental-vm-modules --input-type=module
```

The parent should add meaningful tests of these actual `runEvaluation` paths
before formal dispatch. Keep existing settled/uncertain records and their costs;
do not retroactively score this pilot or automatically repeat it to make the
records look cleaner. Blinded outcome assessment remains a separate assignment.

import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Only Node is launched. The actual harness runs in a VM with its external CLI
// substituted; filesystem semantics (including exclusive mkdir) remain real.
export function probe(body) {
  const helper = fileURLToPath(import.meta.url);
  const script = `import {laboratory} from ${JSON.stringify(new URL(import.meta.url).href)};
    const lab = await laboratory();
    try {const result = await (${body.toString()})(lab); console.log(JSON.stringify(result));}
    finally {await lab.cleanup();}`;
  const run = spawnSync(process.execPath, ['--experimental-vm-modules', '--input-type=module'],
    {input: script, encoding: 'utf8', windowsHide: true, env: {...process.env, NODE_NO_WARNINGS: '1'}});
  if (run.status !== 0) throw new Error(`Offline probe failed (${helper}): ${run.stderr || run.stdout}`);
  return JSON.parse(run.stdout);
}

export async function laboratory() {
  const fs = await import('node:fs/promises');
  const {join, resolve, dirname} = await import('node:path');
  const {tmpdir} = await import('node:os');
  const {createHash} = await import('node:crypto');
  const {EventEmitter} = await import('node:events');
  const {fileURLToPath} = await import('node:url');
  const vm = await import('node:vm');
  const root = await fs.mkdtemp(join(tmpdir(), 'godskills-harness-v2-'));
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  const options = {cli: join(root, 'synthetic-cli.bin'), home: join(root, 'home'),
    operation: join(root, 'operation'), fixtures: join(root, 'fixtures.json'), pack: join(root, 'pack'), concurrency: 2,
    fixtureCommit: '02a43b423553ede5da8c72427c24b5eb1bfe9dba'};
  const put = async (path, value) => {await fs.mkdir(dirname(path), {recursive: true});
    await fs.writeFile(path, typeof value === 'string' ? value : JSON.stringify(value));};
  const msg = (kind, text) => ({type: 'message', role: ['user.text','environments.environment_context'].includes(kind) ? 'user' : 'developer',
    id: 'ephemeral-id', internal_chat_message_metadata_passthrough: {content_item_kinds: [kind]},
    content: [{type: 'input_text', text}]});
  const referenceWorkspace = join(root, 'reference-workspace');
  const reference = [msg('host_skills.instructions', '<skills_instructions>\n### Available skills\n- imagegen: factory images\n- openai-docs: factory documentation\n- skill-creator: factory authoring\n- skill-installer: factory installation\n</skills_instructions>'),
    msg('permissions.instructions','Synthetic read-only permissions.'),
    msg('collaboration_mode.instructions','Synthetic default collaboration.'),
    msg('multi_agent.role_instructions','Synthetic factory role.'),
    msg('multi_agent.mode_instructions','Synthetic factory mode.'),
    msg('environments.environment_context', `<environment_context><cwd>${referenceWorkspace}</cwd><timezone>America/Chicago</timezone></environment_context>`),
    msg('user.text', 'ISOLATION-PREFLIGHT')];
  const referencePath = join(root, 'reference.json');
  await put(referencePath, reference); options.referenceInput = referencePath;
  await put(options.cli, 'SYNTHETIC CLI V1');
  await put(join(options.home, 'config.toml'), '# synthetic config, no credentials');
  const task = id => ({id, request: 'Return a neutral synthetic answer.', files: {}, skillIds: ['synthetic-guidance'],
    hiddenAnswer: 'PRIVATE_SENTINEL_NOT_FOR_WORKER'});
  const tasks = async ids => put(options.fixtures, {schema: 'godskills-quality-fixtures-v1', tasks: ids.map(task)});
  const treatment = async text => {
    const file = 'skills/synthetic-guidance/SKILL.md';
    await put(join(options.pack, 'catalog.json'), {skills: [{id: 'synthetic-guidance', entrypoint: file, resources: []}]});
    await put(join(options.pack, file), text);
    await put(join(options.pack, 'release.json'), {releaseId: hash(text), files: {[file]: hash(text)}});
  };
  await tasks(['q01','q02','q03','q04','q05','q06']); await treatment('SYNTHETIC GUIDANCE V1');
  const calls = []; let invalidSeen = false, sequence = 0, releaseInvalid, releaseSecond;
  const invalidRecorded=new Promise(resolve=>releaseInvalid=resolve),secondStarted=new Promise(resolve=>releaseSecond=resolve);
  const control = {failFirst: false, stream: null, result: 'SYNTHETIC RESPONSE', prefix: reference, delay: 5,
    pauseSecondState:false, waitForSecondExec:false, hangFirst:false, beforeHang:'', execTimeoutMs:null};
  const spawn = (cli, args, opt) => {
    const child = new EventEmitter(); child.stdout = new EventEmitter(); child.stderr = new EventEmitter();
    child.pid = ++sequence; child.kill = () => {const call=calls.find(c=>c.pid===child.pid);if(call)call.finished=true;child.emit('close', null);return true;};
    child.stdin = {end: input => {
      const call={cli, args, cwd: opt.cwd, input, pid:child.pid, afterInvalid: invalidSeen,
        unfinishedExec: calls.filter(c=>c.args[0]==='exec'&&!c.finished).map(c=>c.cwd)};
      calls.push(call);
      const exec = args[0] === 'exec', count = calls.filter(c => c.args[0] === 'exec').length;
      if(exec&&count===2)releaseSecond();
      setTimeout(async () => {
        try {
          if (!exec) {
            const prefix=structuredClone(control.prefix);
            for(const message of prefix){
              message.id=`captured-${child.pid}`;message.timestamp='synthetic-changing-timestamp';
              for(const content of message.content??[])if(typeof content.text==='string')content.text=content.text.replaceAll(referenceWorkspace,opt.cwd);
            }
            child.stdout.emit('data', JSON.stringify(prefix)); child.emit('close', 0); return;
          }
          if(control.hangFirst&&count===1){if(control.beforeHang)child.stdout.emit('data',control.beforeHang);return;}
          if(control.waitForSecondExec&&count===1)await secondStarted;
          await fs.writeFile(args[args.indexOf('-o') + 1], control.result);
          const events = control.stream ?? [
            {type: 'thread.started', thread_id: 'synthetic-thread'}, {type: 'turn.started'},
            {type: 'item.completed', item: {id: 'answer', type: 'agent_message', text: control.result}},
            {type: 'turn.completed', usage: {input_tokens: 12, cached_input_tokens: 4, cache_write_input_tokens: 0,
              output_tokens: 3, reasoning_output_tokens: 2}},
          ];
          child.stdout.emit('data', typeof events === 'string' ? events : events.map(e => JSON.stringify(e)).join('\n') + '\n');
          call.finished=true;child.emit('close', control.failFirst && count === 1 ? 1 : 0);
        } catch (error) {child.emit('error', error);}
      }, exec && !(control.failFirst && count === 1) ? control.delay : 0);
    }}; return child;
  };
  const context = vm.createContext({setTimeout:(fn,delay)=>setTimeout(fn,delay===600000&&control.execTimeoutMs!==null?control.execTimeoutMs:delay), clearTimeout, process: {argv: [], env: {}, stdout: {write: s => {
    if (JSON.parse(s).status === 'invalid') {invalidSeen = true;releaseInvalid();}
  }}}});
  const harnessPath = fileURLToPath(new URL('../../scripts/quality-evaluation-harness.mjs', import.meta.url));
  const source = await fs.readFile(harnessPath, 'utf8');
  const module = new vm.SourceTextModule(source, {context, identifier: new URL('../../scripts/quality-evaluation-harness.mjs', import.meta.url).href,
    initializeImportMeta: meta => {meta.url = new URL('../../scripts/quality-evaluation-harness.mjs', import.meta.url).href;}});
  const seams={...fs,writeFile:async(path,data,...args)=>{
    if(control.pauseSecondState&&path.endsWith(join('q02-baseline','state.json'))&&JSON.parse(data).status==='running')await invalidRecorded;
    return fs.writeFile(path,data,...args);
  }};
  const deps = {'node:child_process': {spawn}, 'node:fs/promises': seams,
    'node:path': {join, resolve, dirname}, 'node:url': {fileURLToPath}, 'node:crypto': {createHash}};
  await module.link(spec => {
    const exports = deps[spec]; if (!exports) throw new Error(`Unexpected dependency ${spec}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, {context});
  });
  await module.evaluate();
  return {root, options, calls, control, tasks, treatment, put, reference, referencePath, harnessPath, fs, join, hash,
    run: overrides => module.namespace.runEvaluation({...options, ...overrides}),
    cleanup: () => {
      if(!resolve(root).startsWith(join(resolve(tmpdir()),'godskills-harness-v2-')))throw new Error('Refuse cleanup outside synthetic temporary directory');
      return fs.rm(root, {recursive: true, force: true});
    }};
}

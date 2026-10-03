import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectIsolation, settledUsage, checkJobReplay } from '../scripts/quality-evaluation-harness.mjs';
import {probe} from './helpers/quality-harness-lab.mjs';

const msg = text => ({type:'message',role:'developer',content:[{type:'input_text',text}]});
test('fresh CLI create_time provenance is ephemeral only inside message metadata', () => {
  const result=probe(async lab=>{
    for(const message of lab.reference)message.internal_chat_message_metadata_passthrough.create_time=100;
    await lab.put(lab.referencePath,lab.reference);
    lab.control.prefix=structuredClone(lab.reference);
    for(const message of lab.control.prefix)message.internal_chat_message_metadata_passthrough.create_time=101;
    return {completed:(await lab.run()).filter(state=>state.status==='completed').length};
  });
  assert.equal(result.completed,12);
});
test('create_time outside provenance cannot hide changed captured instruction content', () => {
  const result=probe(async lab=>{
    lab.reference[0].content[0].create_time=100;
    await lab.put(lab.referencePath,lab.reference);
    lab.control.prefix=structuredClone(lab.reference);
    lab.control.prefix[0].content[0].create_time=101;
    let error;try{await lab.run();}catch(e){error=e.message;}
    return {error,execs:lab.calls.filter(call=>call.args[0]==='exec').length};
  });
  assert.match(result.error,/invalid|reconcile/i);
  assert.equal(result.execs,0);
});
test('a same-named metadata object nested in content remains fully significant', () => {
  const result=probe(async lab=>{
    lab.reference[0].content[0].internal_chat_message_metadata_passthrough={create_time:100};
    await lab.put(lab.referencePath,lab.reference);
    lab.control.prefix=structuredClone(lab.reference);
    lab.control.prefix[0].content[0].internal_chat_message_metadata_passthrough.create_time=101;
    let error;try{await lab.run();}catch(e){error=e.message;}
    return {error,execs:lab.calls.filter(call=>call.args[0]==='exec').length};
  });
  assert.match(result.error,/invalid|reconcile/i);
  assert.equal(result.execs,0);
});
test('preflight without an approved captured reference fails closed, including marker-free instructions', () => {
  assert.equal(inspectIsolation([msg('<skills_instructions>\n### Available skills\n- voice-style-calibration: rewrite\n</skills_instructions>')]).valid, false);
  const builtin=msg('<skills_instructions>\n### Skill roots\n- `r0` = `C:/factory/skills`\n### Available skills\n- openai-docs: official docs\n- skill-creator: build skills\n</skills_instructions>');
  assert.equal(inspectIsolation([builtin]).valid,false);
  assert.equal(inspectIsolation([msg('# AGENTS.md\nPrivate scoring instructions without old marker strings.')]).valid,false);
  assert.equal(inspectIsolation([msg('# Saved task notes\nContinue previous private decisions.')]).valid,false);
  assert.equal(inspectIsolation([msg('MEMORY_SUMMARY private continuity')]).valid,false);
  assert.equal(inspectIsolation([msg('Codex: working with Dom\nContinuity and Keel')]).valid,false);
});
test('usage uses one settled turn and keeps missing cache counters unknown', () => {
  assert.deepEqual(settledUsage([{type:'turn.completed',usage:{input_tokens:12,cached_input_tokens:4,output_tokens:3}}]),
    {input:12,cachedInput:4,output:3,reasoningOutput:null,cacheWriteInput:null,raw:{input_tokens:12,cached_input_tokens:4,output_tokens:3}});
  assert.deepEqual(settledUsage([{type:'turn.completed',usage:{input_tokens:12,output_tokens:3}}]),
    {input:12,cachedInput:null,output:3,reasoningOutput:null,cacheWriteInput:null,raw:{input_tokens:12,output_tokens:3}});
  assert.throws(()=>settledUsage([{type:'turn.completed',usage:{}},{type:'turn.completed',usage:{}}]),/multiple/);
  assert.equal(settledUsage([{type:'turn.failed'}]),null);
});

for (const usage of [
  {input_tokens:-1, output_tokens:3}, {input_tokens:12.5, output_tokens:3},
  {input_tokens:12, output_tokens:3, cached_input_tokens:13},
  {input_tokens:12, output_tokens:3, reasoning_output_tokens:4},
  {input_tokens:12, output_tokens:3, cache_write_input_tokens:-1},
]) test(`invalid token domains cannot certify settlement: ${JSON.stringify(usage)}`, () => {
  assert.equal(settledUsage([{type:'turn.completed',usage}]), null);
});
test('existing uncertain or completed job is not silently re-executed', () => {
  assert.equal(checkJobReplay(null),'new');
  assert.equal(checkJobReplay({status:'completed'}),'reuse');
  assert.throws(()=>checkJobReplay({status:'running'}),/reconcile/);
  assert.throws(()=>checkJobReplay({status:'failed'}),/reconcile/);
});

// Break: status-only replay reuses stale treatment or corrupted receipts.
for (const artifact of ['treatment', 'events.jsonl', 'prompt.txt', 'preflight.json', 'preflight-stderr.log', 'stderr.log', 'result.md', 'binary', 'config', 'evidence']) {
  test(`settled replay rejects changed ${artifact} before another dispatch`, () => {
    const result = probe((async lab => {
      if(artifact==='evidence'){
        const fixture=JSON.parse(await lab.fs.readFile(lab.options.fixtures,'utf8'));fixture.tasks[0].files={'note.txt':'SYNTHETIC EVIDENCE'};
        await lab.put(lab.options.fixtures,fixture);
      }
      await lab.run(); const before = lab.calls.length;
      if (artifact === 'treatment') await lab.treatment('SYNTHETIC GUIDANCE V2');
      else if (artifact === 'binary') await lab.put(lab.options.cli, 'SYNTHETIC CLI V2');
      else if (artifact === 'config') await lab.put(lab.join(lab.options.home,'config.toml'),'# different synthetic config');
      else if (artifact === 'evidence') await lab.put(lab.join(lab.options.operation,'q01-skill','workspace','note.txt'),'CORRUPTED EVIDENCE');
      else await lab.put(lab.join(lab.options.operation, 'q01-skill', artifact), 'CORRUPTED');
      let error = null; try {await lab.run();} catch (e) {error = e.message;}
      return {error, newDispatch: lab.calls.length - before};
    }).toString().replaceAll('artifact', JSON.stringify(artifact)));
    assert.match(result.error ?? '', /reconcile|identity|receipt|changed|differ/i);
    assert.equal(result.newDispatch, 0);
  });
}

test('duplicate task IDs reject the operation before any external preparation', () => {
  const result = probe(async lab => {
    await lab.tasks(['same-id', 'same-id']);
    let error = null; try {await lab.run({concurrency: 4});} catch (e) {error = e.message;}
    return {error, dispatch: lab.calls.length};
  });
  assert.match(result.error ?? '', /duplicate/i);
  assert.equal(result.dispatch, 0);
});

test('concurrent callers share no dispatch or output ownership', () => {
  const result = probe(async lab => {
    const settled = await Promise.allSettled([lab.run(), lab.run()]);
    return {completed: settled.filter(x => x.status === 'fulfilled').length,
      rejected: settled.filter(x => x.status === 'rejected').length,
      exec: lab.calls.filter(x => x.args[0] === 'exec').length};
  });
  assert.deepEqual(result, {completed: 1, rejected: 1, exec: 12});
});

test('unchanged completed identity reuses both arms without dispatch', () => {
  const result = probe(async lab => {
    const first = await lab.run(); const before = lab.calls.length; const second = await lab.run();
    return {same: JSON.stringify(first) === JSON.stringify(second), dispatch: lab.calls.length - before};
  });
  assert.deepEqual(result, {same: true, dispatch: 0});
});

// Break: a failed worker leaves peers draining and launching the remaining queue.
test('first invalid execution stops new dispatch while in-flight work settles', () => {
  const result = probe(async lab => {
    lab.control.failFirst = true; lab.control.delay = 20;lab.control.waitForSecondExec=true;
    let error = null; try {await lab.run();} catch (e) {error = e.message;}
    const summary = JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation, 'summary.json'), 'utf8'));
    return {error, exec: lab.calls.filter(x => x.args[0] === 'exec').length,
      afterInvalid: lab.calls.filter(x => x.args[0] === 'exec' && x.afterInvalid).length,
      statuses: summary.results.map(x => x.status).sort()};
  });
  assert.match(result.error ?? '', /invalid|uncertain/i);
  assert.ok(result.exec <= 2, `Dispatched ${result.exec} executions`);
  assert.equal(result.afterInvalid, 0);
  assert.deepEqual(result.statuses, ['completed', 'invalid']);
});

// Break: a code-0 usage turn overrides malformed, tool, nonfinal or empty output.
for (const mode of ['malformed', 'error', 'started-tool', 'completed-tool', 'empty', 'nonfinal', 'mismatch', 'missing-final', 'extra-turn', 'after-terminal']) {
  test(`execution retains invalid ${mode} stream and refuses replay`, () => {
    const result = probe((async lab => {
      const start = [{type:'thread.started',thread_id:'synthetic'}, {type:'turn.started'}];
      const answer = {type:'item.completed',item:{id:'answer',type:'agent_message',text:'SYNTHETIC RESPONSE'}};
      const end = {type:'turn.completed',usage:{input_tokens:12,output_tokens:3}};
      let events = [...start,answer,end];
      if(mode === 'malformed') lab.control.stream = 'not-json\n'+events.map(JSON.stringify).join('\n');
      if(mode === 'error') events.splice(2,0,{type:'error',message:'synthetic failure'});
      if(mode === 'started-tool') events.splice(2,0,{type:'item.started',item:{id:'tool',type:'command_execution'}});
      if(mode === 'completed-tool') events.splice(2,0,{type:'item.completed',item:{id:'tool',type:'mcp_tool_call'}});
      if(mode === 'empty') lab.control.result = '  ';
      if(mode === 'nonfinal') answer.item.phase = 'commentary';
      if(mode === 'mismatch') answer.item.text = 'OTHER RESPONSE';
      if(mode === 'missing-final') events = [...start,end];
      if(mode === 'extra-turn') events.splice(2,0,{type:'turn.started'});
      if(mode === 'after-terminal') events.push(answer);
      if(mode !== 'malformed') lab.control.stream = events;
      let error = null;try{await lab.run();}catch(e){error=e.message;}
      const summary = JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
      const before = lab.calls.length;let replay = null;try{await lab.run();}catch(e){replay=e.message;}
      return {error,statuses:summary.results.map(x=>x.status),replay,newCalls:lab.calls.length-before};
    }).toString().replaceAll('mode', JSON.stringify(mode)));
    assert.match(result.error ?? '', /invalid|uncertain/i);
    assert.ok(result.statuses.length > 0);
    assert.ok(result.statuses.every(status => status === (mode === 'empty' ? 'retained-outcome' : 'invalid')));
    assert.match(result.replay ?? '', /reconcile/i);
    assert.equal(result.newCalls, 0);
  });
}

test('settled state preserves raw reasoning and cache-write usage without double counting', () => {
  const result = probe(async lab => (await lab.run())[0].usage);
  assert.deepEqual(result, {input:12,cachedInput:4,output:3,reasoningOutput:2,cacheWriteInput:0,
    raw:{input_tokens:12,cached_input_tokens:4,cache_write_input_tokens:0,output_tokens:3,reasoning_output_tokens:2}});
});

// Break: alternating flattened pairs starts opposite arms before wave one settles.
test('preregistered six-task waves use opposite arms behind a full settlement barrier', () => {
  const result = probe(async lab => {
    const states=await lab.run({concurrency:6});
    const manifest=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'manifest.json'),'utf8').catch(()=> 'null'));
    const calls=lab.calls.filter(c=>c.args[0]==='exec');
    return {manifest,identities:states.map(s=>s.identity),starts:calls.map(c=>({job:c.cwd.split(/[\\/]/).at(-2),unfinished:c.unfinishedExec.map(p=>p.split(/[\\/]/).at(-2))}))};
  });
  assert.ok(result.manifest, 'Missing frozen execution manifest');
  assert.equal(result.manifest.fixtureCommit,'02a43b423553ede5da8c72427c24b5eb1bfe9dba');
  assert.deepEqual(result.manifest.schedule.map(x=>[x.wave,x.taskId,x.arm]), [
    [1,'q01','skill'],[1,'q02','baseline'],[1,'q03','skill'],[1,'q04','baseline'],[1,'q05','skill'],[1,'q06','baseline'],
    [2,'q01','baseline'],[2,'q02','skill'],[2,'q03','baseline'],[2,'q04','skill'],[2,'q05','baseline'],[2,'q06','skill'],
  ]);
  assert.deepEqual(result.starts.slice(0,6).map(c=>c.job).sort(),['q01-skill','q02-baseline','q03-skill','q04-baseline','q05-skill','q06-baseline']);
  assert.equal(result.starts[6].unfinished.length,0);
  for(const identity of result.identities){
    assert.equal(identity.fixtureCommit,result.manifest.fixtureCommit);
    assert.deepEqual(identity.schedule,result.manifest.schedule);
    assert.ok([1,2].includes(identity.wave));
  }
});

test('fixture commit and retained schedule changes forbid settled reuse', () => {
  const result=probe(async lab=>{
    await lab.run();const before=lab.calls.length;
    let error=null;try{await lab.run({fixtureCommit:'0'.repeat(40)});}catch(e){error=e.message;}
    return {error,dispatch:lab.calls.length-before};
  });
  assert.match(result.error??'',/commit|identity|reconcile/i);
  assert.equal(result.dispatch,0);
});

test('changed concurrency cannot relabel completed jobs under a different execution request',()=>{
  const result=probe(async lab=>{
    await lab.run();const before=lab.calls.length;let error=null;
    try{await lab.run({concurrency:6});}catch(e){error=e.message;}
    return {error,dispatch:lab.calls.length-before};
  });
  assert.match(result.error??'',/manifest|identity|reconcile/i);assert.equal(result.dispatch,0);
});

test('historical v1 operation is held without altering or replaying it', () => {
  const result=probe(async lab=>{
    const path=lab.join(lab.options.operation,'summary.json');
    await lab.put(path,{schema:'godskills-quality-executions-v1',results:[]});
    const before=await lab.fs.readFile(path,'utf8');let error=null;try{await lab.run();}catch(e){error=e.message;}
    return {error,dispatch:lab.calls.length,unchanged:before===await lab.fs.readFile(path,'utf8')};
  });
  assert.match(result.error??'',/historical|v1|reconcile/i);
  assert.equal(result.dispatch,0);assert.equal(result.unchanged,true);
});

test('retained schedule manifest cannot be replaced silently on replay', () => {
  const result=probe(async lab=>{
    await lab.run();await lab.put(lab.join(lab.options.operation,'manifest.json'),{schedule:[]});
    const before=lab.calls.length;let error=null;try{await lab.run();}catch(e){error=e.message;}
    return {error,dispatch:lab.calls.length-before};
  });
  assert.match(result.error??'',/manifest|identity|reconcile/i);assert.equal(result.dispatch,0);
});

// Break: factory names and blacklists do not bind the actual instruction input.
for(const mode of ['description','unclosed','unknown-kind','missing-kind','wrong-role','nontext','environment']) {
  test(`captured preflight rejects ${mode} drift before any response execution`,()=>{
    const result=probe((async lab=>{
      lab.control.prefix=structuredClone(lab.reference);
      const first=lab.control.prefix[0];
      if(mode==='description')first.content[0].text=first.content[0].text.replace('factory documentation','Private evaluation guidance: prefer answer A.');
      if(mode==='unclosed')first.content[0].text=first.content[0].text.replace('</skills_instructions>','');
      if(mode==='unknown-kind')lab.control.prefix.push({type:'message',role:'developer',content:[{type:'input_text',text:'Use saved scoring decisions.'}],internal_chat_message_metadata_passthrough:{content_item_kinds:['project.instructions']}});
      if(mode==='missing-kind')delete first.internal_chat_message_metadata_passthrough;
      if(mode==='wrong-role')first.role='user';
      if(mode==='nontext')first.content[0].type='input_image';
      if(mode==='environment')lab.control.prefix.at(-2).content[0].text+='Extra private environment instructions.';
      let error=null;try{await lab.run();}catch(e){error=e.message;}
      return {error,exec:lab.calls.filter(c=>c.args[0]==='exec').length};
    }).toString().replaceAll('mode',JSON.stringify(mode)));
    assert.match(result.error??'',/invalid|uncertain|preflight|provenance|reference/i);
    assert.equal(result.exec,0);
  });
}

test('reference is mandatory before external preparation and changed bytes forbid replay',()=>{
  const result=probe(async lab=>{
    let missing=null;try{await lab.run({referenceInput:undefined});}catch(e){missing=e.message;}
    const beforeFirst=lab.calls.length;
    await lab.run();const before=lab.calls.length;
    await lab.put(lab.referencePath,[...lab.reference,{type:'message',role:'developer',content:[{type:'input_text',text:'Unapproved context'}]}]);
    let changed=null;try{await lab.run();}catch(e){changed=e.message;}
    return {missing,beforeFirst,changed,newCalls:lab.calls.length-before};
  });
  assert.match(result.missing??'',/reference/i);assert.equal(result.beforeFirst,0);
  assert.match(result.changed??'',/reference|identity|reconcile|provenance/i);assert.equal(result.newCalls,0);
});

test('job receipts label preflight-only scope and unknown served model, with per-job SQLite arguments',()=>{
  const result=probe(async lab=>{
    const states=await lab.run();
    return {states,calls:lab.calls,referenceSha256:lab.hash(await lab.fs.readFile(lab.referencePath)),
      digests:{binarySha256:lab.hash(await lab.fs.readFile(lab.options.cli)),configSha256:lab.hash(await lab.fs.readFile(lab.join(lab.options.home,'config.toml'))),harnessSha256:lab.hash(await lab.fs.readFile(lab.harnessPath))}};
  });
  const sqliteHomes=new Set();
  for(const state of result.states){
    assert.equal(state.servedModel,'unknown');
    assert.equal(state.isolation.scope,'captured-preflight-only');
    assert.equal(state.isolation.valid,true);
    assert.equal(state.identity.referenceInputSha256,result.referenceSha256);
    assert.equal(state.baselineLabel,'factory-codex-baseline');
    assert.deepEqual(state.identity.requested,{model:'gpt-6-luna',provider:'openai',reasoning:'max'});
    for(const key of ['binarySha256','configSha256','harnessSha256'])assert.equal(state.identity[key],result.digests[key]);
    assert.ok(state.identity.args.includes('sqlite_home='+JSON.stringify(state.identity.sqliteHome)));
    assert.ok(state.identity.preflightArgs.includes('sqlite_home='+JSON.stringify(state.identity.sqliteHome)));
    const exec=result.calls.find(c=>c.args[0]==='exec'&&c.cwd===state.identity.cwd);
    const prefix=result.calls.find(c=>c.args[0]==='debug'&&c.cwd===state.identity.cwd);
    assert.deepEqual(state.identity.args,exec.args);assert.deepEqual(state.identity.preflightArgs,prefix.args);
    sqliteHomes.add(state.identity.sqliteHome);
  }
  assert.equal(sqliteHomes.size,12);
  assert.ok(result.calls.filter(c=>c.args[0]==='exec').every(c=>!c.input.includes('PRIVATE_SENTINEL_NOT_FOR_WORKER')));
});

for(const field of ['isolation','usage','arm'])test(`replay rejects contradictory settled ${field} state`,()=>{
  const result=probe((async lab=>{
    await lab.run();const path=lab.join(lab.options.operation,'q01-skill','state.json');
    const state=JSON.parse(await lab.fs.readFile(path,'utf8'));
    if(field==='isolation')state.isolation.valid=false;
    if(field==='usage')state.usage.input=999;
    if(field==='arm')state.arm='baseline';
    await lab.put(path,state);const before=lab.calls.length;
    let error=null;try{await lab.run();}catch(e){error=e.message;}
    return {error,dispatch:lab.calls.length-before};
  }).toString().replaceAll('field',JSON.stringify(field)));
  assert.match(result.error??'',/reconcile|state|identity|receipt/i);assert.equal(result.dispatch,0);
});

test('invalid preflight retains comparison identity and captured receipt without response dispatch',()=>{
  const result=probe(async lab=>{
    lab.control.prefix[0].content[0].text+=' Private instruction drift.';
    try{await lab.run();}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    return {states:summary.results,exec:lab.calls.filter(c=>c.args[0]==='exec').length};
  });
  assert.ok(result.states.length>0,'Rejected preflight lost its comparison record');
  assert.equal(result.exec,0);
  for(const state of result.states){assert.equal(state.status,'invalid');assert.equal(state.comparison,'invalid-comparison');
    assert.equal(state.isolation.valid,false);assert.match(state.artifacts['preflight.json'],/^[a-f0-9]{64}$/);}
});

test('global halt is checked again after asynchronous state persistence, before exec spawn',()=>{
  const result=probe(async lab=>{
    lab.control.failFirst=true;lab.control.pauseSecondState=true;
    try{await lab.run();}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    return {exec:lab.calls.filter(c=>c.args[0]==='exec').length,afterInvalid:lab.calls.filter(c=>c.args[0]==='exec'&&c.afterInvalid).length,
      statuses:summary.results.map(s=>s.status).sort()};
  });
  assert.equal(result.afterInvalid,0);assert.equal(result.exec,1);
  assert.deepEqual(result.statuses,['invalid','not-dispatched']);
});

test('JSON null is retained as a malformed stream rather than losing running receipts',()=>{
  const result=probe(async lab=>{
    lab.control.stream='null\n';try{await lab.run();}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    return summary.results.map(s=>({status:s.status,events:s.artifacts?.['events.jsonl']}));
  });
  assert.ok(result.length>0,'Malformed JSON event lost its receipt');
  for(const state of result){assert.equal(state.status,'invalid');assert.match(state.events,/^[a-f0-9]{64}$/);}
});

test('timeout is a retained outcome and no arm is selectively retried',()=>{
  const result=probe(async lab=>{
    lab.control.hangFirst=true;lab.control.execTimeoutMs=30;
    try{await lab.run({concurrency:1});}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    const before=lab.calls.length;let replay=null;try{await lab.run();}catch(e){replay=e.message;}
    return {results:summary.results,replay,dispatch:lab.calls.length-before,exec:lab.calls.filter(c=>c.args[0]==='exec').length};
  });
  assert.equal(result.exec,1);assert.equal(result.results[0].status,'retained-outcome');assert.equal(result.results[0].timedOut,true);
  assert.match(result.replay??'',/reconcile/i);assert.equal(result.dispatch,0);
});

test('blank settled output without an agent-message item is retained, not silently replaced',()=>{
  const result=probe(async lab=>{
    lab.control.result='';lab.control.stream=[{type:'thread.started',thread_id:'synthetic'}, {type:'turn.started'},
      {type:'turn.completed',usage:{input_tokens:12,output_tokens:0}}];
    try{await lab.run({concurrency:1});}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    const before=lab.calls.length;try{await lab.run();}catch{}
    return {state:summary.results[0],dispatch:lab.calls.length-before,exec:lab.calls.filter(c=>c.args[0]==='exec').length};
  });
  assert.equal(result.state.status,'retained-outcome');assert.equal(result.state.comparison,'retained-execution-outcome');
  assert.equal(result.exec,1);assert.equal(result.dispatch,0);
});

test('tool contamination remains an invalid comparison even if the execution also times out',()=>{
  const result=probe(async lab=>{
    lab.control.hangFirst=true;lab.control.execTimeoutMs=30;
    lab.control.beforeHang=[{type:'thread.started',thread_id:'synthetic'},{type:'turn.started'},
      {type:'item.started',item:{id:'tool',type:'command_execution'}}].map(JSON.stringify).join('\n')+'\n';
    try{await lab.run({concurrency:1});}catch{}
    const summary=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'summary.json'),'utf8'));
    return summary.results[0];
  });
  assert.equal(result.status,'invalid');assert.equal(result.comparison,'invalid-comparison');
  assert.equal(result.timedOut,true);assert.equal(result.toolCalls,1);
});

// Break: the preregistered full IDs are rejected, or sorted ordinals replace
// the original task/body identities. Every body here is synthetic and inert.
test('full fixture IDs preserve ordinal waves and original body identity',()=>{
  const result=probe(async lab=>{
    await lab.tasks(['q06-continuity','q03-interpersonal','q01-voice','q05-audit','q02-imagination','q04-memory']);
    const fixture=JSON.parse(await lab.fs.readFile(lab.options.fixtures,'utf8'));
    for(const task of fixture.tasks){task.request=`SYNTHETIC BODY ${task.id}`;task.files={'fake.txt':`SYNTHETIC FILE ${task.id}`};}
    await lab.put(lab.options.fixtures,fixture);
    let error=null,states=[];try{states=await lab.run({concurrency:6});}catch(e){error=e.message;}
    if(error)return {error,dispatch:lab.calls.length};
    const manifest=JSON.parse(await lab.fs.readFile(lab.join(lab.options.operation,'manifest.json'),'utf8'));
    const calls=lab.calls.filter(c=>c.args[0]==='exec');
    const before=lab.calls.length,reused=await lab.run({concurrency:6});
    return {error,manifest,states:states.map(s=>({taskId:s.taskId,identity:s.identity})),
      calls:calls.map(c=>({job:c.cwd.split(/[\\/]/).at(-2),input:c.input,unfinished:c.unfinishedExec})),
      replayCalls:lab.calls.length-before,replaySame:JSON.stringify(states)===JSON.stringify(reused)};
  });
  if(result.error)assert.equal(result.dispatch,0,'Rejected full IDs must not launch external preparation');
  assert.equal(result.error,null,'Full preregistered IDs must be accepted without reading real task content');
  const schedule=[
    {wave:1,taskId:'q01-voice',arm:'skill'},{wave:1,taskId:'q02-imagination',arm:'baseline'},
    {wave:1,taskId:'q03-interpersonal',arm:'skill'},{wave:1,taskId:'q04-memory',arm:'baseline'},
    {wave:1,taskId:'q05-audit',arm:'skill'},{wave:1,taskId:'q06-continuity',arm:'baseline'},
    {wave:2,taskId:'q01-voice',arm:'baseline'},{wave:2,taskId:'q02-imagination',arm:'skill'},
    {wave:2,taskId:'q03-interpersonal',arm:'baseline'},{wave:2,taskId:'q04-memory',arm:'skill'},
    {wave:2,taskId:'q05-audit',arm:'baseline'},{wave:2,taskId:'q06-continuity',arm:'skill'},
  ];
  assert.deepEqual(result.manifest.schedule,schedule);
  assert.equal(result.states.length,12);assert.equal(result.calls.length,12);
  assert.deepEqual(result.calls.slice(0,6).map(c=>c.job).sort(),[
    'q01-voice-skill','q02-imagination-baseline','q03-interpersonal-skill',
    'q04-memory-baseline','q05-audit-skill','q06-continuity-baseline',
  ]);
  assert.equal(result.calls[6].unfinished.length,0,'Opposite wave started before the first wave settled');
  for(const row of schedule){
    const state=result.states.find(s=>s.taskId===row.taskId&&s.identity.arm===row.arm);
    assert.ok(state);assert.equal(state.identity.taskId,row.taskId);assert.equal(state.identity.wave,row.wave);
    assert.deepEqual(state.identity.schedule,schedule);
    const call=result.calls.find(c=>c.job===row.taskId+'-'+row.arm);
    assert.ok(call.input.includes(`SYNTHETIC BODY ${row.taskId}\n`));
    assert.ok(call.input.includes(`SYNTHETIC FILE ${row.taskId}\n`));
    for(const other of schedule.filter(s=>s.wave===1&&s.taskId!==row.taskId))assert.ok(!call.input.includes(`SYNTHETIC BODY ${other.taskId}\n`));
  }
  assert.equal(result.replayCalls,0);assert.equal(result.replaySame,true);
});

for(const [label,ids,pattern]of [
  ['duplicate ordinal',['q01-voice','q01-fake','q02-imagination','q03-interpersonal','q04-memory','q05-audit','q06-continuity'],'ordinal|q01-q06'],
  ['missing ordinal',['q01-voice','q02-imagination','q03-interpersonal','q04-memory','q05-audit'],'ordinal|six|q01-q06'],
  ['unknown ordinal',['q01-voice','q02-imagination','q03-interpersonal','q04-memory','q05-audit','q07-fake'],'ordinal|q01-q06'],
  ['malformed ordinal',['q010-voice','q02-imagination','q03-interpersonal','q04-memory','q05-audit','q06-continuity'],'ordinal|q01-q06'],
])test(`full fixture IDs reject ${label} before external preparation`,()=>{
  const result=probe((async lab=>{
    await lab.tasks(IDS);let error=null;try{await lab.run();}catch(e){error=e.message;}
    const operationExists=await lab.fs.stat(lab.options.operation).then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e;});
    return {error,dispatch:lab.calls.length,operationExists};
  }).toString().replace('IDS',JSON.stringify(ids)));
  assert.match(result.error??'',new RegExp(pattern,'i'));assert.equal(result.dispatch,0);assert.equal(result.operationExists,false);
});

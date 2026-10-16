import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,mkdtempSync,mkdirSync,cpSync,rmSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {tasks,data,read,here,packetWithInputs,wrapper,verifyRepositoryFreeze,verifyHostInputs,checkOutput,commandWithInputs,sourcePack} from './pilot.mjs';
import {inspectPrompt,setup,sha} from './isolation-probe.mjs';

const clone=value=>structuredClone(value);
const ids=tasks().map(task=>task.id);

// Controlled filesystem projection. These bytes are deliberately NOT the real
// CLI or published guidance; every attempted host read must hit this map.
function offlineInputs(evaluationRoot=here) {
  const freeze=clone(JSON.parse(readFileSync(resolve(evaluationRoot,'freeze.json'),'utf8')));
  const binary=resolve(evaluationRoot,'missing-private-root','codex.exe');
  const pack=resolve(evaluationRoot,'missing-private-root','pack');
  const bytes=new Map([[binary,Buffer.from('MOCK_CLI_BYTES_NOT_EXECUTABLE')]]);
  const release={releaseId:freeze.publishedRelease,skillCount:93,files:{}};
  freeze.cliSha256=sha(bytes.get(binary));
  for(const records of Object.values(freeze.guidance)) for(const record of records) {
    const content=Buffer.from('OFFLINE_FIXTURE_GUIDANCE '+record.path);
    record.sha256=sha(content);release.files[record.path]=record.sha256;
    bytes.set(resolve(pack,record.path),content);
  }
  const manifest=Buffer.from(JSON.stringify(release));
  freeze.sourceReleaseFileSha256=sha(manifest);
  bytes.set(resolve(pack,'release.json'),manifest);
  const readBytes=path=>{if(!bytes.has(path)) throw new Error('Unexpected host read: '+path);return bytes.get(path);};
  return {freeze,evaluationRoot,binary,pack,bytes,readBytes,readGuidance:record=>readBytes(resolve(pack,record.path)).toString('utf8')};
}
const offlinePacket=(id,arm)=>packetWithInputs(id,arm,offlineInputs());

test('four fresh briefs have the required interface and bounded inert fixtures',()=>{
  assert.equal(tasks().length,4);
  assert.equal(new Set(ids).size,4);
  for(const task of tasks()) {
    assert.deepEqual(Object.keys(task).sort(),['id','family','prompt','suppliedFiles','outputContract','skillIds'].sort());
    assert.ok(task.prompt.includes('No tools, execution or external actions.'));
    assert.ok(task.prompt.includes('1800 words'));
    assert.equal(task.suppliedFiles.length,1);
    for(const name of task.suppliedFiles) {
      assert.match(name,/^fixtures\/[a-z-]+\.json$/);
      const text=read(name);
      assert.ok(Buffer.byteLength(text)<5000);
      assert.equal(JSON.parse(text).synthetic,true);
      for(const hidden of ['criticalFailures','scoringRule','baseClosing','criteriaIds']) assert.ok(!text.includes(hidden));
    }
  }
});

test('criteria match all tasks, sum to 100, and expose critical and independence rules',()=>{
  const criteria=data('criteria.json');
  assert.deepEqual(criteria.tasks.map(task=>task.taskId),ids);
  assert.match(criteria.visibility,/ASSESSOR ONLY/);
  assert.match(criteria.independence,/NOT independently reviewed/);
  for(const row of criteria.tasks) {
    assert.equal(row.criteria.reduce((sum,c)=>sum+c.points,0),100);
    assert.equal(new Set(row.criteria.map(c=>c.id)).size,4);
    assert.ok(row.criticalFailures.length>=2);
    for(const c of row.criteria) {
      for(const key of ['observableCheck','scoringRule']) assert.ok(c[key].length>8);
      assert.match(c.criticality,/^(ordinary|critical(?: on .+)?)$/);
    }
  }
});

test('repository freeze verification needs no user CLI, private export or external evidence files',()=>{
  const freeze=verifyRepositoryFreeze();
  assert.equal(freeze.baselineCommit,'7c7f2ac98a282ccb2e59c3a4c0424802a4dd72b5');
  assert.equal(freeze.publishedRelease,'368d5a716bd3b8069ba5ba858f8db8f7fba8b19c36aa373fc62c19d8a2b55efb');
  assert.equal(freeze.sourcePack,sourcePack);
  assert.equal(freeze.executionStatus,'NOT_RUN; HOLD mandatory skill-read/no-tools conflict');
  assert.equal(freeze.comparisonLabel,'host-native explicit published-guidance augmentation');
});

test('host verification checks all exact bytes using injected fixtures; corruption fails closed',()=>{
  const input=offlineInputs();
  assert.equal(verifyHostInputs(input.freeze,input),input.freeze);
  for(const path of [input.binary,resolve(input.pack,'release.json'),resolve(input.pack,input.freeze.guidance[ids[0]][0].path)]) {
    const changed={...input,readBytes:name=>name===path?Buffer.from('CORRUPT'):input.readBytes(name)};
    assert.throws(()=>verifyHostInputs(input.freeze,changed));
  }
});

test('eight frozen invocations are paired, serial and balanced in generation/presentation order',()=>{
  const freeze=verifyRepositoryFreeze();
  assert.deepEqual(freeze.order.map(row=>row.slot),[1,2,3,4,5,6,7,8]);
  assert.equal(freeze.order.length,8);
  let controlFirst=0,controlShownFirst=0;
  const labels=[];
  for(const id of ids) {
    const rows=freeze.order.filter(row=>row.taskId===id);
    assert.equal(rows.length,2);
    assert.deepEqual(rows.map(row=>row.arm).sort(),['control','guidance']);
    if(rows[0].arm==='control') controlFirst++;
    if(rows.find(row=>row.presentFirst).arm==='control') controlShownFirst++;
    labels.push(...rows.map(row=>row.blindLabel));
  }
  assert.equal(controlFirst,2);assert.equal(controlShownFirst,2);
  assert.equal(new Set(labels).size,8);
});

test('packet projection excludes assessor data and guidance is the sole task-input difference',()=>{
  const criteria=data('criteria.json');
  for(const task of tasks()) {
    const baseline=offlinePacket(task.id,'control'), treatment=offlinePacket(task.id,'guidance');
    assert.ok(treatment.endsWith(baseline.slice(wrapper.length)));
    const projected=JSON.parse(baseline.slice(wrapper.length));
    assert.deepEqual(Object.keys(projected).sort(),['taskId','prompt','suppliedFiles','outputContract'].sort());
    for(const text of [baseline,treatment]) {
      for(const forbidden of ['criteria.json','criticalFailures','scoringRule','blindLabel','baseClosing','lane-a/','lane-b/','discovery/']) assert.ok(!text.includes(forbidden),forbidden);
      for(const row of criteria.tasks) for(const secret of row.criticalFailures) assert.ok(!text.includes(secret));
    }
    assert.ok(!baseline.includes('SELECTED GUIDANCE'));
    assert.ok(treatment.includes('SELECTED GUIDANCE'));
    assert.ok(Buffer.byteLength(treatment)<50000);
  }
});

test('command generator supplies exact argv/stdin and confines generated artifacts',()=>{
  for(const task of tasks()) for(const arm of ['control','guidance']) {
    const input=offlineInputs();
    const row=commandWithInputs(task.id,arm,input);
    assert.ok(row.cwd.startsWith(resolve(setup,'runs')));
    assert.equal(row.timeoutSeconds,600);
    assert.ok(row.args.includes('exec'));
    assert.ok(row.args.includes('--ephemeral'));
    assert.ok(row.args.includes('--strict-config'));
    assert.ok(!row.args.includes('--ignore-user-config'));
    assert.ok(!row.args.some(a=>/bypass|model_providers\.|CODEX_HOME/.test(a)));
    assert.deepEqual(row.stdinCommand.slice(-2),[task.id,arm]);
  }
});

// The following objects are deliberately synthetic checker-development outputs.
// They are not agent answers, independent assessments or task-quality evidence.
const cashMock=()=>{
  const closings=[[5000,-3000,9000,6000,6000],[5000,-3000,-3000,-6000,6000]];
  const gaps=[[0,4500,0,0,0],[0,4500,4500,7500,0]];
  const events=[[['V'],['P'],['A'],['R'],[]],[['V'],['P'],[],['R'],['A']]];
  const rows=n=>closings[n].map((closing,i)=>({day:`D${i+1}`,opening:i?closings[n][i-1]:9000,receipts:i===(n?4:2)?12000:0,payments:[4000,8000,0,3000,0][i],closing,reserveGap:gaps[n][i],eventIds:events[n][i]}));
  return {taskId:ids[0],base:rows(0),delayedA:rows(1),unresolved:[{eventId:'B',reason:'Unknown date',includedInBase:false}],operations:{reviewCapacityPerWeek:6,constraint:'MOCK',change:'MOCK',owner:'Sam',nextObservation:'MOCK'},statusNote:'MOCK. MOCK.',limits:['MOCK']};
};
test('business checks catch wrong timing, missing data, capacity and substituted attribution',()=>{
  const good=cashMock();assert.equal(checkOutput(ids[0],good).passed,true);
  for(const mutate of [x=>x.base[1].closing=9000,x=>x.unresolved[0].includedInBase=true,x=>x.operations.reviewCapacityPerWeek=10,x=>x.delayedA[4].eventIds=['B']]) {
    const bad=clone(good);mutate(bad);assert.equal(checkOutput(ids[0],bad).passed,false);
  }
});

const recoveryMock=()=>({taskId:ids[1],cases:[
  {id:'export',outcome:'UNKNOWN',submitAgain:false,observations:[{atSecondsFromNow:75,action:'MOCK status GET',stopRule:'UNKNOWN without decisive receipt'}],preservedRefs:['REQ-17','JOB-44'],reason:'MOCK'},
  {id:'read',outcome:'DEFERRED',submitAgain:false,observations:[],preservedRefs:['READ-8'],reason:'MOCK'},
  {id:'done',outcome:'SUCCESS',submitAgain:false,observations:[],preservedRefs:['REQ-9','JOB-9'],reason:'MOCK'},
],handoff:'MOCK',claimsOfExecution:false});
test('recovery checks reject duplicate submission, false success, early read and missing case',()=>{
  const good=recoveryMock();assert.equal(checkOutput(ids[1],good).passed,true);
  for(const mutate of [x=>x.cases[0].submitAgain=true,x=>x.cases[0].outcome='SUCCESS',x=>x.cases[1].observations=[{atSecondsFromNow:20,action:'GET',stopRule:'MOCK'}],x=>x.cases.pop()]) {
    const bad=clone(good);mutate(bad);assert.equal(checkOutput(ids[1],bad).passed,false);
  }
});

const drawerMock=()=>({taskId:ids[2],controllerSource:'NOT_EXECUTED_MOCK_SOURCE',trace:[0,0.4,0.32,0.32,0,1,1].map((alpha,i)=>({event:'e'+i,alpha,expanded:[true,false,false,false,false,true,true][i],handles:i<4?1:0,mounted:i<6})),performance:{sampleCount:5,p95Ms:20,overBudget:1,gate:'fail',claimScope:'synthetic only'},hoverAnswer:'MOCK teal',limits:['MOCK no runtime']});
test('drawer checks reject endpoint restart, stale semantic commit, leaked handle and average-based gate',()=>{
  const good=drawerMock();assert.equal(checkOutput(ids[2],good).passed,true);
  for(const mutate of [x=>x.trace[1].alpha=1,x=>x.trace[3].expanded=true,x=>x.trace[6].handles=1,x=>x.performance.gate='pass']) {
    const bad=clone(good);mutate(bad);assert.equal(checkOutput(ids[2],bad).passed,false);
  }
  assert.match(checkOutput(ids[2],good).scope,/NOT a quality score or runtime test/);
  // A nonsense source can pass these partial checks: the independent source
  // review is a required separate gate, never inferred from trace assertions.
  assert.equal(good.controllerSource,'NOT_EXECUTED_MOCK_SOURCE');
});

const lessonMock=()=>({taskId:ids[3],story:Array(100).fill('MOCK').join(' '),segments:[{minutes:2,learnerActivity:'MOCK setup',facilitatorCue:'MOCK'},{minutes:7,learnerActivity:'MOCK',facilitatorCue:'MOCK'}],reservoirAnswer:{first:'A',minutesA:5,minutesB:20/3,reason:'MOCK'},diagnostic:{prompt:'MOCK',likelyWrongAnswer:'MOCK',feedbackIfWrong:'MOCK',feedbackIfRight:'MOCK'},practice:{prompt:'MOCK',facilitatorAnswer:'MOCK'},transfer:{prompt:'MOCK',facilitatorAnswer:'MOCK',scoring:'MOCK'},advanceRule:'MOCK',accessSupports:['MOCK'],unitsAnswer:'MOCK',limits:['MOCK']});
test('learning checks catch missing story, wrong governing arithmetic, timing and omitted transfer answer',()=>{
  const good=lessonMock();assert.equal(checkOutput(ids[3],good).passed,true);
  for(const mutate of [x=>x.story='outline only',x=>x.reservoirAnswer.first='B',x=>x.segments[0].minutes=4,x=>delete x.transfer.facilitatorAnswer]) {
    const bad=clone(good);mutate(bad);assert.equal(checkOutput(ids[3],bad).passed,false);
  }
});

test('checkers reject blank artifacts rather than accepting empty arrays vacuously',()=>{
  for(const id of ids) for(const value of [null,{},[],{taskId:id}]) assert.equal(checkOutput(id,value).passed,false);
});

test('prompt inspection rejects inherited skills, private continuity and missing provenance',()=>{
  const block=(text,kind='user.text')=>[{role:'user',content:[{text}],internal_chat_message_metadata_passthrough:{content_item_kinds:[kind]}}];
  for(const text of ['### Available skills','codex_keel_anchor','Be Dom\'s warm','godskills']) assert.equal(inspectPrompt(block(text)).noGodskillsInCapturedInput,false);
  const unknown=block('plain');delete unknown[0].internal_chat_message_metadata_passthrough;
  assert.equal(inspectPrompt(unknown).noGodskillsInCapturedInput,false);
  assert.equal(inspectPrompt(block('plain')).rawAdmitted,false);
  assert.throws(()=>inspectPrompt([]));
});

test('historical references retain source identities without needing their files on a receiving checkout',()=>{
  const freeze=verifyRepositoryFreeze();
  assert.ok(freeze.evidence.some(row=>row.path==='scripts/quality-evaluation-harness.mjs'));
  for(const row of freeze.evidence) {assert.match(row.sha256,/^[a-f0-9]{64}$/);assert.ok(!row.path.includes('..'));}
});

test('relocated repository check and mock packets work with missing private roots; real host gate rejects missing inputs',()=>{
  mkdirSync(setup,{recursive:true});
  const scratch=mkdtempSync(resolve(setup,'test-relocation-'));
  assert.ok(scratch.startsWith(resolve(setup,'test-relocation-')));
  try {
    const relocated=resolve(scratch,'evaluation','usefulness-20261016');
    cpSync(here,relocated,{recursive:true});
    const input=offlineInputs(relocated);
    assert.equal(existsSync(input.binary),false);assert.equal(existsSync(input.pack),false);
    assert.equal(verifyRepositoryFreeze({evaluationRoot:relocated}).publishedRelease,data('freeze.json').publishedRelease);
    assert.equal(verifyHostInputs(input.freeze,input),input.freeze);
    assert.ok(packetWithInputs(ids[0],'guidance',input).includes('OFFLINE_FIXTURE_GUIDANCE'));
    const child=spawnSync(process.execPath,[resolve(relocated,'pilot.mjs'),'verify-repository'],{cwd:scratch,encoding:'utf8',timeout:15000});
    assert.equal(child.status,0,child.stderr);
    assert.equal(JSON.parse(child.stdout).hostPreflightPerformed,false);
    assert.throws(()=>verifyHostInputs(verifyRepositoryFreeze({evaluationRoot:relocated}),{binary:input.binary,pack:input.pack}),/ENOENT/);
  } finally {
    // Only this generated fixture copy, never the repository or private export.
    assert.ok(scratch.startsWith(resolve(setup,'test-relocation-')));
    rmSync(scratch,{recursive:true});
  }
});

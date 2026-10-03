import {spawn} from 'node:child_process';
import {readFile, writeFile, mkdir, rmdir, lstat, readdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const hash=x=>createHash('sha256').update(x).digest('hex');
const builtin=new Set(['imagegen','openai-docs','skill-creator','skill-installer']);
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const save=async(path,value)=>writeFile(path,JSON.stringify(value,null,2)+'\n');
const exists=async path=>{try{await readFile(path);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const present=async path=>{try{await lstat(path);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const requested={model:'gpt-6-luna',provider:'openai',reasoning:'max'};
const configArgs=job=>['-c','model_provider="openai"','-c','model_reasoning_effort="max"','-c','sqlite_home='+JSON.stringify(join(job,'sqlite-home'))];
const execArgs=job=>['exec','--strict-config','--ephemeral','--skip-git-repo-check','--json','-m',requested.model,...configArgs(job),'-s','read-only','-o',join(job,'result.md'),'-'];
const preflightArgs=job=>['debug','prompt-input','ISOLATION-PREFLIGHT','-c','model='+JSON.stringify(requested.model),...configArgs(job)];
const base='Complete the supplied task and return the finished work as your final response. Use only the evidence below; do not inspect other directories, load external skills or use network/tools. No external actions are authorized. Do not claim an action was executed when you only proposed it. Keep the answer at most 1800 words.\n\n';

async function validateReplay(job,prior,identity,reference) {
  if(checkJobReplay(prior)!=='reuse')return;
  if(prior.schema!=='godskills-quality-job-v2'||JSON.stringify(prior.identity)!==JSON.stringify(identity))throw new Error('Job identity changed or historical v1 job; reconcile before reuse');
  const receipts={};
  for(const file of ['prompt.txt','preflight.json','preflight-stderr.log','events.jsonl','stderr.log','result.md',...Object.keys(identity.evidence)]){
    try{receipts[file]=await readFile(join(job,file));}catch(error){if(error.code==='ENOENT')throw new Error(`Missing retained receipt: ${file}; reconcile`);throw error;}
    if(!prior.artifacts?.[file]||prior.artifacts[file]!==hash(receipts[file]))throw new Error(`Retained receipt changed: ${file}; reconcile`);
  }
  const isolation=inspectIsolation(JSON.parse(receipts['preflight.json'].toString('utf8')),{reference,workspace:identity.cwd});
  const stream=inspectStream(receipts['events.jsonl'].toString('utf8'),receipts['result.md'].toString('utf8'));
  if(!isolation.valid||!stream.valid||hash(receipts['prompt.txt'])!==identity.promptSha256)throw new Error('Retained execution/prefix receipt is invalid; reconcile');
  const expected={taskId:identity.taskId,arm:identity.arm,requested:identity.requested,servedModel:'unknown',comparison:'response-delivered',
    baselineLabel:isolation.label,isolation,fixtureSha256:identity.fixtureSha256,configSha256:identity.configSha256,
    treatmentReleaseId:identity.treatmentReleaseId,treatmentFiles:identity.treatmentFiles,promptSha256:identity.promptSha256,
    usage:stream.usage,toolCalls:stream.toolCalls,eventsSha256:hash(receipts['events.jsonl']),resultSha256:hash(receipts['result.md']),exitCode:0,timedOut:false,concurrency:identity.concurrency};
  for(const [key,value]of Object.entries(expected))if(JSON.stringify(prior[key])!==JSON.stringify(value))throw new Error(`Contradictory retained state: ${key}; reconcile`);
}

const instructionKinds=new Set(['host_skills.instructions','permissions.instructions','collaboration_mode.instructions',
  'multi_agent.role_instructions','multi_agent.mode_instructions','environments.environment_context','user.text']);
const ephemeralKeys=new Set(['id','message_id','timestamp','created_at','updated_at']);
function canonical(value) {
  if(Array.isArray(value))return value.map(canonical);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(key=>!ephemeralKeys.has(key)).map(key=>[key,canonical(value[key])]));
  return value;
}
function capturedInput(input,workspace) {
  if(!Array.isArray(input)||!input.length)throw new Error('Missing captured input');
  const kindsSeen=[],normalized=[];
  for(const message of input){
    const kinds=message?.internal_chat_message_metadata_passthrough?.content_item_kinds;
    if(message?.type!=='message'||!Array.isArray(message.content)||!message.content.length||!Array.isArray(kinds)||kinds.length!==message.content.length)throw new Error('Missing or malformed instruction provenance');
    const content=message.content.map((item,n)=>{
      const kind=kinds[n];
      if(!instructionKinds.has(kind)||item?.type!=='input_text'||typeof item.text!=='string')throw new Error('Unrecognized instruction kind or content type');
      if(message.role!==(['user.text','environments.environment_context'].includes(kind)?'user':'developer'))throw new Error('Unexpected instruction role');
      kindsSeen.push(kind);let text=item.text;
      if(/MEMORY_SUMMARY|codex_keel_|keel-wake|Codex: working with Dom|Continuity and Keel/.test(text))throw new Error('Local continuity or global instructions');
      if(kind==='host_skills.instructions'){
        const blocks=[...text.matchAll(/<skills_instructions>([\s\S]*?)<\/skills_instructions>/g)];
        if(blocks.length!==1||(text.match(/<skills_instructions>/g)||[]).length!==1||!blocks[0][1].includes('### Available skills'))throw new Error('Malformed factory skill wrapper');
        const names=[...blocks[0][1].split('### Available skills')[1].matchAll(/^- ([^:\n]+):/gm)].map(x=>x[1]);
        if(names.length!==4||new Set(names).size!==4||names.some(name=>!builtin.has(name)))throw new Error('Expected exactly the four factory skills');
      }
      if(kind==='user.text'&&text!=='ISOLATION-PREFLIGHT')throw new Error('Unexpected preflight user input');
      if(kind==='environments.environment_context'){
        const paths=[...text.matchAll(/<cwd>([^<]+)<\/cwd>/g)];
        if(!text.startsWith('<environment_context>')||!text.endsWith('</environment_context>')||paths.length!==1)throw new Error('Malformed captured environment');
        const cwd=paths[0][1];
        if(!/^(?:[a-zA-Z]:[\\/]|\/)/.test(cwd)||(workspace&&resolve(cwd)!==resolve(workspace)))throw new Error('Wrong preflight workspace');
        // Only the declared workspace path (and its slash spelling) is variable.
        // Everything else, including factory descriptions/roots, remains bound.
        for(const path of new Set([cwd,cwd.replaceAll('\\','/'),cwd.replaceAll('/','\\')]))text=text.replaceAll(path,'<WORKSPACE>');
      }
      return {...item,text};
    });
    normalized.push({...message,content});
  }
  if(kindsSeen.length!==instructionKinds.size||new Set(kindsSeen).size!==instructionKinds.size)throw new Error('Incomplete or duplicate instruction provenance');
  return JSON.stringify(canonical(normalized));
}
export function inspectIsolation(input,{reference,workspace}={}) {
  const scope='captured-preflight-only';
  try {
    if(!reference)throw new Error('Approved captured reference required');
    const expected=capturedInput(reference),actual=capturedInput(input,workspace);
    if(expected!==actual)throw new Error('Captured prefix differs from approved reference');
    return {valid:true,label:'factory-codex-baseline',scope,factorySkills:[...builtin],normalizedPrefixSha256:hash(actual)};
  } catch(error){return {valid:false,label:'invalid-preflight',scope,reason:error.message};}
}

export function settledUsage(events) {
  const turns=events.filter(x=>x.type==='turn.completed');
  if(turns.length>1)throw new Error('multiple completed turns: do not double count');
  if(!turns.length)return null;
  const usage=turns[0].usage;
  const token=value=>Number.isSafeInteger(value)&&value>=0;
  if(!usage||!token(usage.input_tokens)||!token(usage.output_tokens))return null;
  if(Object.entries(usage).some(([key,value])=>key.endsWith('_tokens')&&!token(value)))return null;
  if((usage.cached_input_tokens??0)>usage.input_tokens||(usage.reasoning_output_tokens??0)>usage.output_tokens)return null;
  return {input:usage.input_tokens,cachedInput:usage.cached_input_tokens??null,output:usage.output_tokens,
    reasoningOutput:usage.reasoning_output_tokens??null,cacheWriteInput:usage.cache_write_input_tokens??null,raw:{...usage}};
}

function inspectStream(stdout,result) {
  const events=[];let reason=null,invalidComparison=false,active=false,ended=false,thread=false,answer=null,toolCalls=0;
  const fail=message=>{reason??=message;invalidComparison=true;};
  for(const line of stdout.split(/\r?\n/).filter(Boolean)){
    let event;try{event=JSON.parse(line);}catch{fail('malformed event');continue;}
    if(!event||typeof event!=='object'||Array.isArray(event)||typeof event.type!=='string'){fail('malformed event');continue;}events.push(event);
    if(ended){fail('event after terminal turn');continue;}
    if(event.type==='thread.started'&&!thread&&!active){thread=true;continue;}
    if(event.type==='turn.started'&&thread&&!active){active=true;continue;}
    if(event.type==='turn.completed'&&active){ended=true;continue;}
    if(['item.started','item.updated','item.completed'].includes(event.type)&&active){
      const item=event.item;
      if(!item||!['agent_message','reasoning'].includes(item.type)){toolCalls++;fail('tool or unrecognized item');continue;}
      if(event.type==='item.completed'&&item.type==='agent_message'){
        if(answer!==null||typeof item.text!=='string'||item.phase&&!['final','final_answer'].includes(item.phase))fail('nonfinal response');
        else answer=item.text;
      }
      continue;
    }
    fail('error or unrecognized event sequence');
  }
  let usage=null;try{usage=settledUsage(events);}catch{fail('multiple completed turns');}
  if(ended&&!usage)fail('invalid settled usage');
  if(!ended||!usage)reason??='unsettled turn or invalid usage';
  if(answer===null)reason??='missing final response';
  if(!result?.trim())reason??='blank result';
  else if(answer!==null&&answer.trim()!==result.trim())fail('result differs from terminal response');
  return {valid:!reason,invalidComparison,reason,usage,toolCalls};
}

export function checkJobReplay(previous) {
  if(!previous)return 'new';
  if(previous.status==='completed')return 'reuse';
  throw new Error(`reconcile existing ${previous.status} job before any retry`);
}

async function execute(cli,args,{cwd,env,input,timeoutMs=600000}) {
  return new Promise((resolveRun,reject)=>{
    const child=spawn(cli,args,{cwd,env,windowsHide:true,stdio:['pipe','pipe','pipe']});
    let stdout='',stderr='',timedOut=false;
    child.stdout.on('data',x=>stdout+=x);child.stderr.on('data',x=>stderr+=x);
    child.on('error',reject);
    const timer=setTimeout(()=>{timedOut=true;child.kill();},timeoutMs);
    child.on('close',code=>{clearTimeout(timer);resolveRun({code,stdout,stderr,pid:child.pid,timedOut});});
    child.stdin.end(input||'');
  });
}

async function skillsFor(task,pack) {
  const release=await json(join(pack,'release.json')),catalog=await json(join(pack,'catalog.json'));
  const records=[];
  for(const id of task.skillIds){
    const skill=catalog.skills.find(x=>x.id===id);
    if(!skill)throw new Error(`Missing treatment ${id}`);
    for(const path of [skill.entrypoint,...skill.resources.map(x=>x.path)]){
      const bytes=await readFile(join(pack,path));
      if(hash(bytes)!==release.files[path])throw new Error(`Treatment changed: ${path}`);
      records.push({path,sha256:hash(bytes),text:bytes.toString('utf8')});
    }
  }
  return {releaseId:release.releaseId,records};
}

export async function runEvaluation({cli,home,operation,fixtures,pack,fixtureCommit,referenceInput,concurrency=6}) {
  if(!Number.isInteger(concurrency)||concurrency<1||concurrency>10)throw new Error('Concurrency must be 1..10');
  if(fixtureCommit!=='02a43b423553ede5da8c72427c24b5eb1bfe9dba')throw new Error('Preregistered fixture commit required; reconcile identity');
  if(!referenceInput)throw new Error('Approved captured reference input required');
  cli=resolve(cli);home=resolve(home);operation=resolve(operation);fixtures=resolve(fixtures);pack=resolve(pack);referenceInput=resolve(referenceInput);
  const referenceBytes=await readFile(referenceInput),reference=JSON.parse(referenceBytes.toString('utf8'));
  const referenceCheck=inspectIsolation(reference,{reference});
  if(!referenceCheck.valid)throw new Error('Invalid reference provenance: '+referenceCheck.reason);
  const fixtureBytes=await readFile(fixtures),cases=JSON.parse(fixtureBytes.toString('utf8'));
  if(cases.schema!=='godskills-quality-fixtures-v1'||!Array.isArray(cases.tasks))throw new Error('Invalid fixtures');
  const ids=new Set();
  for(const task of cases.tasks){
    if(!/^[a-z0-9-]+$/.test(task.id))throw new Error('Unsafe task ID');
    if(ids.has(task.id))throw new Error('Duplicate task ID');ids.add(task.id);
    if(typeof task.request!=='string'||!Array.isArray(task.skillIds))throw new Error('Invalid task');
    for(const [path,text]of Object.entries(task.files||{}))if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(path)||typeof text!=='string')throw new Error('Invalid inert evidence file');
  }
  const ordinals=['q01','q02','q03','q04','q05','q06'],byOrdinal=new Map();
  for(const task of cases.tasks){
    const ordinal=/^(q0[1-6])(?:-[a-z0-9][a-z0-9-]*)?$/.exec(task.id)?.[1];
    if(!ordinal)throw new Error('Task ID must have a q01-q06 ordinal');
    if(byOrdinal.has(ordinal))throw new Error('Duplicate task ordinal: '+ordinal);
    byOrdinal.set(ordinal,task.id);
  }
  if(byOrdinal.size!==6||ordinals.some(ordinal=>!byOrdinal.has(ordinal)))throw new Error('Preregistered six task ordinals q01-q06 required');
  const taskIds=ordinals.map(ordinal=>byOrdinal.get(ordinal));
  const bit=parseInt(hash(fixtureCommit).at(-1),16)&1;
  const schedule=[1,2].flatMap(wave=>taskIds.map((taskId,n)=>({wave,taskId,arm:(n+bit+wave-1)%2?'skill':'baseline'})));
  const manifestPath=join(operation,'manifest.json');
  if(await present(operation)&&!await exists(manifestPath)&&(await readdir(operation)).length)throw new Error('Historical v1 or unclaimed operation; reconcile without replay');
  await mkdir(operation,{recursive:true});
  const claim=join(operation,'.operation-claim');
  try{await mkdir(claim);}catch(e){if(e.code==='EEXIST')throw new Error('Exclusive operation claim exists; reconcile before dispatch');throw e;}
  try {
  const configBytes=await readFile(join(home,'config.toml'));
  const provenance={fixtureSha256:hash(fixtureBytes),configSha256:hash(configBytes),binary:resolve(cli),binarySha256:hash(await readFile(cli)),harnessSha256:hash(await readFile(fileURLToPath(import.meta.url))),referenceInputSha256:hash(referenceBytes),packReleaseSha256:hash(await readFile(join(pack,'release.json'))),packCatalogSha256:hash(await readFile(join(pack,'catalog.json')))};
  const env={...process.env,CODEX_HOME:home};
  const jobs=schedule.map(({wave,taskId,arm})=>({wave,task:cases.tasks.find(task=>task.id===taskId),arm}));
  const manifest={schema:'godskills-quality-operation-v2',...provenance,fixtureCommit,schedule,requested,concurrency,waveConcurrency:Math.min(concurrency,6)};
  if(await exists(manifestPath)&&JSON.stringify(await json(manifestPath))!==JSON.stringify(manifest))throw new Error('Manifest identity changed; reconcile before dispatch');
  // Validate every existing job before any dispatch; a mismatch in one arm must
  // not cause the other arm (or a later task) to start a new paid execution.
  for(const plan of jobs){
    const {task,arm,wave}=plan,job=join(operation,task.id+'-'+arm);
    const treatment=arm==='skill'?await skillsFor(task,pack):{releaseId:null,records:[]};
    const evidence=Object.fromEntries(Object.entries(task.files||{}).map(([path,text])=>['workspace/'+path,hash(text)]));
    const supplied=task.request+'\n\nSUPPLIED EVIDENCE\n'+Object.entries(task.files||{}).map(([path,text])=>`FILE ${path}\n${text}\nEND FILE`).join('\n\n');
    const prompt=base+(arm==='skill'?'SELECTED WORKFLOW GUIDANCE\n'+treatment.records.map(x=>`SOURCE ${x.path}\n${x.text}\nEND SOURCE`).join('\n\n')+'\n\n':'')+supplied;
    const identity={...provenance,fixtureCommit,schedule,wave,concurrency,waveConcurrency:Math.min(concurrency,6),taskId:task.id,arm,cwd:join(job,'workspace'),home:resolve(home),sqliteHome:join(job,'sqlite-home'),args:execArgs(job),preflightArgs:preflightArgs(job),requested,treatmentReleaseId:treatment.releaseId,treatmentFiles:treatment.records.map(({text,...x})=>x),promptSha256:hash(prompt),evidence};
    const statePath=join(job,'state.json'),prior=await exists(statePath)?await json(statePath):null;
    if(!prior&&await present(job))throw new Error('Existing job has no settled state; reconcile before dispatch');
    await validateReplay(job,prior,identity,reference);
    Object.assign(plan,{job,statePath,prior,treatment,prompt,identity});
  }
  if(!await exists(manifestPath))await save(manifestPath,manifest);
  let cursor=0,stopDispatch=false;const results=[];
  async function retain(state,plan){
    state.endedAt=new Date().toISOString();state.artifacts={};
    for(const file of ['prompt.txt','preflight.json','preflight-stderr.log','events.jsonl','stderr.log','result.md',...Object.keys(plan.identity.evidence)]){
      if(await exists(join(plan.job,file)))state.artifacts[file]=hash(await readFile(join(plan.job,file)));
    }
    await save(plan.statePath,state);results.push(state);
    process.stdout.write(JSON.stringify({task:state.taskId,arm:state.arm,status:state.status,wallMs:state.wallMs,usage:state.usage})+'\n');
  }
  async function haltPrepared(state,plan){
    Object.assign(state,{status:'not-dispatched',comparison:'halted-before-dispatch',failure:'Another job stopped dispatch; reconcile'});
    await retain(state,plan);
  }
  async function worker(queue){
    try {
    while(!stopDispatch&&cursor<queue.length){
      const plan=queue[cursor++],{task,arm,job,statePath,prior,treatment,prompt,identity}=plan;
      if(checkJobReplay(prior)==='reuse'){
        results.push(prior);continue;
      }
      await mkdir(join(job,'workspace'),{recursive:true});
      await mkdir(identity.sqliteHome,{recursive:true});
      for(const [path,text] of Object.entries(task.files||{})){
        await writeFile(join(job,'workspace',path),text);
      }
      await writeFile(join(job,'prompt.txt'),prompt);
      const state={schema:'godskills-quality-job-v2',identity,taskId:task.id,arm,status:'preflighting',requested,servedModel:'unknown',baselineLabel:null,isolation:null,fixtureSha256:hash(fixtureBytes),configSha256:hash(configBytes),treatmentReleaseId:treatment.releaseId,treatmentFiles:treatment.records.map(({text,...x})=>x),promptSha256:hash(prompt),startedAt:new Date().toISOString(),concurrency};
      await save(statePath,state);
      if(stopDispatch){await haltPrepared(state,plan);return;}
      const prefix=await execute(cli,identity.preflightArgs,{cwd:join(job,'workspace'),env,timeoutMs:60000});
      await writeFile(join(job,'preflight.json'),prefix.stdout);
      await writeFile(join(job,'preflight-stderr.log'),prefix.stderr);
      let isolation;try{isolation=inspectIsolation(JSON.parse(prefix.stdout),{reference,workspace:identity.cwd});}
      catch{isolation={valid:false,label:'invalid-preflight',scope:'captured-preflight-only',reason:'Malformed preflight JSON'};}
      Object.assign(state,{baselineLabel:isolation.label,isolation});
      if(prefix.code!==0||prefix.timedOut||!isolation.valid){
        stopDispatch=true;
        Object.assign(state,{status:'invalid',comparison:'invalid-comparison',failure:isolation.reason??'Prompt-input preflight failed',preflightExitCode:prefix.code,preflightTimedOut:prefix.timedOut});
        await retain(state,plan);throw new Error('Invalid evaluation preflight; reconcile '+task.id+'-'+arm);
      }
      state.status='running';
      await save(statePath,state);
      // No await may intervene between the shared halt check and spawn. A peer
      // can fail while this worker is persisting its prepared state.
      if(stopDispatch){await haltPrepared(state,plan);return;}
      const started=Date.now();
      const run=await execute(cli,identity.args,{cwd:join(job,'workspace'),env,input:prompt});
      if(run.code!==0||run.timedOut)stopDispatch=true;
      const resultPresent=await exists(join(job,'result.md'));
      const result=resultPresent?await readFile(join(job,'result.md'),'utf8'):null;
      const stream=inspectStream(run.stdout,result),valid=run.code===0&&!run.timedOut&&stream.valid;
      if(!valid)stopDispatch=true;
      const retained=!valid&&!stream.invalidComparison&&(run.timedOut||!result?.trim());
      await writeFile(join(job,'events.jsonl'),run.stdout);await writeFile(join(job,'stderr.log'),run.stderr);
      Object.assign(state,{status:valid?'completed':retained?'retained-outcome':'invalid',comparison:valid?'response-delivered':retained?'retained-execution-outcome':'invalid-comparison',failure:valid?null:stream.reason??'execution failed',exitCode:run.code,pid:run.pid,timedOut:run.timedOut,wallMs:Date.now()-started,usage:stream.usage,toolCalls:stream.toolCalls,eventsSha256:hash(run.stdout),resultSha256:resultPresent?hash(result):null});
      await retain(state,plan);
      if(!valid)throw new Error('Invalid execution retained; reconcile '+task.id+'-'+arm+' before continuing');
    }
    } catch(error) {stopDispatch=true;throw error;}
  }
  const settled=[];
  for(const wave of [1,2]){
    if(stopDispatch)break;cursor=0;const queue=jobs.filter(job=>job.wave===wave);
    settled.push(...await Promise.allSettled(Array.from({length:Math.min(concurrency,queue.length)},()=>worker(queue))));
  }
  await save(join(operation,'summary.json'),{schema:'godskills-quality-executions-v2',fixtureCommit,schedule,fixtureSha256:hash(fixtureBytes),results:results.sort((a,b)=>(a.taskId+a.arm).localeCompare(b.taskId+b.arm)),notDispatched:jobs.filter(job=>!results.some(state=>state.taskId===job.task.id&&state.arm===job.arm&&state.exitCode!==undefined)).map(job=>({wave:job.wave,taskId:job.task.id,arm:job.arm})),errors:settled.filter(x=>x.status==='rejected').map(x=>x.reason.message)});
  if(settled.some(x=>x.status==='rejected'))throw new Error('Evaluation had invalid/uncertain work; inspect retained summary');
  return results;
  } finally {await rmdir(claim);}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [cli,home,operation,fixtures,pack,fixtureCommit,referenceInput,slots]=process.argv.slice(2);
  if(!fixtureCommit||!referenceInput)throw new Error('Usage: harness CLI HOME OPERATION FIXTURES PACK FIXTURE_COMMIT REFERENCE_INPUT [SLOTS]');
  await runEvaluation({cli,home,operation,fixtures,pack,fixtureCommit,referenceInput,concurrency:Number(slots||6)});
}

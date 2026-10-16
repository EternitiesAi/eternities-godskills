// Offline prompt assembly only. This module has no `exec`/model-launch path.
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const cli = 'C:/Users/Dom/AppData/Local/OpenAI/Codex/bin/9614f1d9b40d9c4f/codex.exe';
export const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const setup = resolve(root, 'artifacts/qualification/usefulness-20261016/evaluation-setup');
export const model = 'gpt-6.1-sol';
export const reasoning = 'xhigh';
export const sha = value => createHash('sha256').update(value).digest('hex');

// All overrides are invocation-local. Mandatory host safeguards remain in place.
// Keep the same config layers for debug and prospective exec: debug has no
// --ignore-user-config equivalent. Do not infer parity if that flag is added.
export function configArgs(job) {
  const settings = {
    model, model_provider:'openai', model_reasoning_effort:reasoning,
    forced_login_method:'chatgpt', project_doc_max_bytes:0,
    developer_instructions:'', web_search:'disabled',
    sqlite_home:resolve(job,'sqlite'), log_dir:resolve(job,'logs'),
    'history.persistence':'none',
    'features.skip_host_skill_discovery':true,
    'features.memories':false, 'features.plugins':false,
    'features.remote_plugin':false, 'features.apps':false,
    'features.hooks':false, 'features.multi_agent':false,
    'features.multi_agent_v2':false, 'features.skill_search':false,
    'features.shell_tool':false, 'features.unified_exec':false,
    'features.image_generation':false,
  };
  return Object.entries(settings).flatMap(([key,value])=>['-c',`${key}=${JSON.stringify(value)}`]);
}

export function inspectPrompt(input) {
  if (!Array.isArray(input) || !input.length) throw new Error('Missing prompt array');
  const rows = input.flatMap(message => (message.content ?? []).map((item,index)=>({
    role:message.role,
    kind:message.internal_chat_message_metadata_passthrough?.content_item_kinds?.[index] ?? 'unknown',
    text:item.text ?? '',
  })));
  const text = rows.map(row=>row.text).join('\n');
  const flags = {
    godskills:/godskills|cashflow-forecast-scenario-integrity|evidence-linked-learning-design/i.test(text),
    continuity:/codex_keel_|keel-wake|MEMORY_SUMMARY|Continuity and Keel/.test(text),
    personalInstructions:/Codex: working with Dom|Be Dom's warm/.test(text),
    availableSkills:/### Available skills/.test(text),
    unknownProvenance:rows.some(row=>row.kind==='unknown'),
  };
  return {
    scope:'captured debug prompt input only; no model call or tool-schema proof',
    flags,
    blocks:rows.map(({role,kind,text})=>({role,kind,bytes:Buffer.byteLength(text),sha256:sha(text)})),
    noGodskillsInCapturedInput:!flags.godskills && !flags.continuity && !flags.personalInstructions && !flags.availableSkills && !flags.unknownProvenance,
    comparisonLabel:'host-native Codex with explicit selected published guidance versus same host without explicit guidance',
    rawAdmitted:false,
  };
}

export function probe() {
  const job = resolve(setup,'probe-workspace');
  mkdirSync(job,{recursive:true});
  const args = ['--no-daemon','-C',job,'-s','read-only','-a','never',
    ...configArgs(job),'debug','prompt-input','ISOLATION-PREFLIGHT'];
  const run = spawnSync(cli,args,{cwd:job,encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:4*1024*1024});
  // Do not print raw assembled text or config: it could contain private context.
  let inspection = null;
  if (run.status===0) inspection=inspectPrompt(JSON.parse(run.stdout));
  return {
    schema:'usefulness-isolation-probe-v1', observedAt:new Date().toISOString(),
    cli, cliSha256:sha(readFileSync(cli)), args,
    exitCode:run.status, errorCode:run.error?.code ?? null,
    stderrSha256:sha(run.stderr ?? ''), stderrBytes:Buffer.byteLength(run.stderr ?? ''),
    promptSha256:sha(run.stdout ?? ''), inspection,
    liveModelCalls:0, credentialsReadOrCopied:false,
    note:'No CODEX_HOME override, login change, credential value read, or global config edit. Debug may read host state internally. No claim about exec-time exposure or served model.',
  };
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv[2]!=='probe') throw new Error('Only supported command: probe (no model call)');
  process.stdout.write(JSON.stringify(probe(),null,2)+'\n');
}

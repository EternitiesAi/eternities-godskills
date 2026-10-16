import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const lane=path.dirname(fileURLToPath(import.meta.url));
const results=[];
function run(command,args){const r=spawnSync(command,args,{encoding:'utf8',timeout:60000,env:{...process.env,PYTHONUTF8:'1'}});return {command,args,status:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};}
for(const filename of ['lane-d-intake.mjs','lane-d-evidence.mjs','lane-d-verify.test.mjs','lane-d-run-checks.mjs'])results.push(run(process.execPath,['--check',`${lane}/${filename}`]));
const proposals=fs.readdirSync(`${lane}/proposals`,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort();
for(const proposal of proposals)results.push({proposal,...run('python',['C:/Users/Dom/.codex/skills/.system/skill-creator/scripts/quick_validate.py',`${lane}/proposals/${proposal}`])});
results.push(run(process.execPath,['--test','--test-reporter=tap',`${lane}/lane-d-verify.test.mjs`]));
const record={executedAt:new Date().toISOString(),claimBoundary:'Structural validation, pinned-byte integrity and synthetic arithmetic only. No acquired code, external agent, model evaluation, gameplay, causal estimator or production backend was executed.',passed:results.every(r=>r.status===0),results};
fs.writeFileSync(`${lane}/evidence/lane-d-check-results.json`,JSON.stringify(record,null,2)+'\n');
for(const result of results)console.log(`${result.status===0?'PASS':'FAIL'} ${result.proposal??result.args.join(' ')}${result.status===0?'':`\n${result.stdout}${result.stderr}`}`);
process.exitCode=record.passed?0:1;

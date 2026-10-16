import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const dir=path.dirname(fileURLToPath(import.meta.url));
const root='C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003';
const npmCli='C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const sandboxRoot=path.join(dir,'runner-sandboxes');
assert.ok(!fs.existsSync(sandboxRoot),'Keep previous run evidence intact; do not overwrite sandboxes');
const packageBytes=fs.readFileSync(path.join(dir,'candidate/package.json'));
const testBytes=fs.readFileSync(path.join(dir,'candidate/tests/test-runner-scope.test.mjs'));
const packageObject=JSON.parse(packageBytes);
for(const lifecycle of ['pretest','posttest','precheck','postcheck'])assert.equal(packageObject.scripts[lifecycle],undefined);
fs.mkdirSync(sandboxRoot);
for(const variant of ['broad','maintained']){
  const cwd=path.join(sandboxRoot,variant);
  fs.cpSync(path.join(dir,'runner-template'),cwd,{recursive:true});
  fs.writeFileSync(path.join(cwd,'tests/review-a-v3-test-runner-scope.test.mjs'),testBytes);
  if(variant==='maintained')fs.writeFileSync(path.join(cwd,'package.json'),packageBytes);
  else{
    const previous=structuredClone(packageObject);
    previous.scripts.test='node --test';previous.scripts.check='node --test';
    fs.writeFileSync(path.join(cwd,'package.json'),JSON.stringify(previous,null,2)+'\n');
  }
}
const runs=[];
function run(label,cwd,args){
  const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:30000,maxBuffer:1024*1024,env:{...process.env,NPM_CONFIG_CACHE:path.join(dir,'npm-cache'),NPM_CONFIG_UPDATE_NOTIFIER:'false',NPM_CONFIG_AUDIT:'false',NPM_CONFIG_FUND:'false'}});
  const row={label,cwd,executable:process.execPath,args,status:r.status,signal:r.signal,error:r.error?.message??null,stdout:r.stdout,stderr:r.stderr};runs.push(row);return row;
}
for(const variant of ['broad','maintained'])for(const command of [['test'],['run','check']])run(`${variant}:npm ${command.join(' ')}`,path.join(sandboxRoot,variant),[npmCli,...command]);
run('real-root:focused-scope-regression',root,['--test','tests/test-runner-scope.test.mjs']);
const inventory=spawnSync('rg',['--files','tests','examples','evaluation','product'],{cwd:root,encoding:'utf8',maxBuffer:1024*1024});
assert.equal(inventory.status,0);
const names=inventory.stdout.trim().split(/\r?\n/).map(s=>s.replaceAll('\\','/'));
const testNames=names.filter(s=>/(?:\.test|\.spec)\.(?:mjs|js|cjs)$/.test(s));
const roots={};for(const p of testNames){const key=p.split('/')[0];roots[key]??={included:0,excluded:[]};if(p.endsWith('.test.mjs'))roots[key].included++;else roots[key].excluded.push(p);}
const canaries=['TESTS','EXAMPLES','EVALUATION','PRODUCT'].map(s=>`REVIEW_V3_${s}_ROOT_INCLUDED`);
const checks=runs.map(r=>{
  const text=(r.stdout??'')+'\n'+(r.stderr??'');
  const isBroad=r.label.startsWith('broad:');
  const allRootsIncluded=canaries.every(s=>text.includes(s));
  const historicalExecuted=text.includes('REVIEW_V3_HISTORY_MUST_NOT_RUN');
  const expectedStatus=isBroad?r.status!==0:r.status===0;
  const isFocused=r.label.startsWith('real-root:');
  return {label:r.label,expectedStatus,allRootsIncluded:isFocused?null:allRootsIncluded,historicalExecuted,pass:!r.error&&expectedStatus&&(isFocused||allRootsIncluded)&&(isBroad?historicalExecuted:!historicalExecuted)};
});
const receipt={executedAt:new Date().toISOString(),node:process.version,nodeExeSha256:digest(fs.readFileSync(process.execPath)),npmCli,npmCliSha256:digest(fs.readFileSync(npmCli)),sourcePackageSha256:digest(packageBytes),sourceScopeTestSha256:digest(testBytes),runs,checks,maintainedRootFilenameInventory:roots,limits:'Only isolated canary bodies and the focused real root scope regression executed; no repository-wide suite, historical body, shared build, install, dependency or source-acquisition action.'};
fs.writeFileSync(path.join(dir,'runner-scope-results.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({checks,maintainedRootFilenameInventory:roots},null,2));
assert.ok(checks.every(r=>r.pass),'See preserved runner-scope-results.json');
assert.ok(Object.values(roots).every(r=>r.excluded.length===0),'A maintained test filename is omitted by the explicit script');

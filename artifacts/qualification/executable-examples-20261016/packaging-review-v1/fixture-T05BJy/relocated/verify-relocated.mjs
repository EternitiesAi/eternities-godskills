import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const [root,output]=process.argv.slice(2);
assert(root&&output&&path.isAbsolute(root)&&path.isAbsolute(output));
const hash=b=>createHash('sha256').update(b).digest('hex');
const release=JSON.parse(fs.readFileSync(path.join(root,'release.json')));
const before=Object.fromEntries(Object.entries(release.files).map(([p,h])=>{
  assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);return [p,h];
}));
const env={PATH:'',...(process.platform==='win32'?{SystemRoot:process.env.SystemRoot}: {})};
const runs=[];
function run(args){const text=execFileSync(process.execPath,args,{cwd:path.dirname(root),env,encoding:'utf8',timeout:60000});runs.push({args:args.map(x=>x.replace(root,'<pack>')),stdoutSha256:hash(text),stdout:text});return text;}
const v=JSON.parse(run([path.join(root,'bin/godskills.mjs'),'validate']));
assert.equal(v.releaseId,release.releaseId);assert.equal(v.skillCount,93);
for(const lane of ['constraint-diagnosis','onboarding-cohorts','animation-interruptions']){
  const demo=JSON.parse(run([path.join(root,'examples',lane,'demo.mjs')]));assert(demo&&typeof demo==='object');
  const test=run(['--test','--test-reporter=tap',path.join(root,'examples',lane,'index.test.mjs')]);
  assert.match(test,/^# fail 0$/m);assert.doesNotMatch(test,/^not ok/m);
}
for(const [p,h] of Object.entries(before))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);
const report={schema:'executable-examples-relocated-v1',status:'PASS',observedUtc:new Date().toISOString(),releaseId:release.releaseId,verifiedFiles:Object.keys(before).length,node:process.version,platform:process.platform,environmentKeys:Object.keys(env),pathEmpty:true,sourceChanged:false,limits:'Actual exported pack, minimal environment, unrelated working directory. Linux if used is WSL on a mounted Windows extraction, not a fresh OS. Synthetic deterministic examples only; no renderer or actual company outcomes.',runs};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...report,runs:runs.length}));

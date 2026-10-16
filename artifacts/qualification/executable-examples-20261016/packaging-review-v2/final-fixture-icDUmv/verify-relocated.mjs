import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const [root,output,expectedRelease]=process.argv.slice(2);
assert(root&&output&&path.isAbsolute(root)&&path.isAbsolute(output)&&/^[a-f0-9]{64}$/.test(expectedRelease??''));
const outputRelative=path.relative(root,output);
assert(outputRelative==='..'||outputRelative.startsWith('..'+path.sep)||path.isAbsolute(outputRelative),'Output must be outside pack');
const hash=b=>createHash('sha256').update(b).digest('hex');
function inventory(base,prefix='',out={}){
  for(const e of fs.readdirSync(path.join(base,prefix),{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){
    const rel=prefix+e.name,full=path.join(base,rel);assert(!e.isSymbolicLink(),'Linked pack entry');
    if(e.isDirectory()){out[rel+'/']='directory';inventory(base,rel+'/',out);}
    else{assert(e.isFile());out[rel]=hash(fs.readFileSync(full));}
  }return out;
}
const completeBefore=inventory(root);
const release=JSON.parse(fs.readFileSync(path.join(root,'release.json')));
assert.equal(release.releaseId,expectedRelease,'Pack differs from approved candidate');
assert.equal(hash(JSON.stringify(release.files,null,2)+'\n'),expectedRelease,'Manifest does not reconstruct approved candidate identity');
assert.deepEqual(Object.keys(completeBefore).filter(p=>!p.endsWith('/')&&p!=='release.json').sort(),Object.keys(release.files).sort(),'Pack has undeclared or missing files');
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
assert.deepEqual(inventory(root),completeBefore,'Pack membership or bytes changed during execution');
const report={schema:'executable-examples-relocated-v2',status:'PASS',observedUtc:new Date().toISOString(),releaseId:release.releaseId,expectedRelease,verifiedFiles:Object.keys(before).length,completeInventorySha256:hash(JSON.stringify(completeBefore)),node:process.version,platform:process.platform,environmentKeys:Object.keys(env),pathEmpty:true,sourceChanged:false,filesystemAccessIsolated:false,limits:'Actual exported pack, minimal environment, unrelated working directory; original filesystem is still accessible. Dependency independence also requires source inspection. Linux if used is WSL on a mounted Windows extraction, not a fresh OS. Synthetic deterministic examples only; no renderer or actual company outcomes.',runs};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...report,runs:runs.length}));

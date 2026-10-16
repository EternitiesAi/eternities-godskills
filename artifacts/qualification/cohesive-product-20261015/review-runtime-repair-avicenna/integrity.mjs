import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..'),prefix='artifacts/qualification/cohesive-product-20261015/';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=new Map();
const read=path=>{const b=readFileSync(resolve(root,path));sources.set(path,sha(b));return b;};
const json=path=>JSON.parse(read(path));
const declared=json(prefix+'review-runtime-repair-dirac/read-set.after.json'),before=json(prefix+'review-runtime-repair-dirac/code.before.json');
const mismatches=[],archiveMismatches=[],deltas=[];
for(const item of declared.files){
 if(item.path.startsWith('C:'))continue; // private parent TAP is not needed for this review
 const b=read(item.path),actual=sha(b);if(actual!==item.afterSha256)mismatches.push({path:item.path,expected:item.afterSha256,actual});
 if(before[item.path]!==undefined){
  if(sha(Buffer.from(before[item.path]))!==item.beforeSha256)archiveMismatches.push(item.path);
  if(before[item.path]!==b.toString('utf8')){
   const a=before[item.path].split(/\r?\n/),c=b.toString('utf8').split(/\r?\n/);let i=0,j=0;
   while(i<a.length&&a[i]===c[i])i++;while(j<a.length-i&&a[a.length-1-j]===c[c.length-1-j])j++;
   deltas.push({path:item.path,start:i+1,before:a.slice(i,a.length-j).join('\n'),after:c.slice(i,c.length-j).join('\n')});
  }
 }
}
for(const directory of ['review-c-avicenna','review-c-v2-avicenna','review-runtime-repair-dirac'])for(const file of readdirSync(resolve(root,prefix+directory)))read(prefix+directory+'/'+file);
const oldReceiptMismatches=[];
for(const directory of ['review-c-avicenna','review-c-v2-avicenna'])for(const item of json(prefix+directory+'/delivery-files.json').entries)if(sha(read(item.path))!==item.sha256)oldReceiptMismatches.push(item.path);
for(const file of ['diagnostic-statistical-model-inference/SKILL.md','diagnostic-statistical-model-inference/references/causal-design-before-estimation-v1.md','interatomic-model-validation/SKILL.md','eternities-athena/SKILL.md','eternities-arcadia/SKILL.md'])read('product/skills/'+file);
for(const id of readdirSync(resolve(root,'product/skills')))read('product/skills/'+id+'/skill.json');
read(prefix+'review-runtime-repair-avicenna/integrity.mjs');
console.log(JSON.stringify({schema:'runtime-repair-avicenna-integrity-v1',node:process.version,declaredMismatches:mismatches,archiveMismatches,oldReceiptMismatches,acceptedCandidates:declared.changedFiles.map(path=>({path,sha256:sources.get(path)})),deltas,sources:[...sources].map(([path,sha256])=>({path,sha256}))}));

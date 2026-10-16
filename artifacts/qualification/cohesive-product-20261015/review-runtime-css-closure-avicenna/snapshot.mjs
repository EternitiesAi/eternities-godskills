import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..'),p='artifacts/qualification/cohesive-product-20261015/';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=new Map();
const read=path=>{const b=readFileSync(resolve(root,path));sources.set(path,sha(b));return b;};
const prior=JSON.parse(read(p+'review-runtime-repair-avicenna/read-set.after.json'));
const changedSincePrior=[];
for(const item of prior.sources){const actual=sha(read(item.path));if(actual!==item.sha256)changedSincePrior.push({path:item.path,before:item.sha256,after:actual});}
for(const name of ['review-runtime-repair-avicenna','review-c-v2-avicenna','review-c-avicenna'])for(const file of readdirSync(resolve(root,p+name)))read(p+name+'/'+file);
for(const path of ['tests/educational-discovery-implementation-v2.test.mjs','tests/educational-discovery-request-priority.test.mjs','tests/educational-discovery-feedback-model-regression.test.mjs','tests/educational-discovery-revealed-v2.test.mjs','tests/helpers/nietzsche-historical-compatibility.mjs',p+'review-runtime-css-closure-avicenna/snapshot.mjs'])read(path);
console.log(JSON.stringify({schema:'runtime-css-closure-avicenna-snapshot-v1',node:process.version,changedSincePrior,sources:[...sources].map(([path,sha256])=>({path,sha256}))}));

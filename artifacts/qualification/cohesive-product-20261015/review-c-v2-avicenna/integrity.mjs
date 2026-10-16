import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..');
const prefix='artifacts/qualification/cohesive-product-20261015/';
const sha=b=>createHash('sha256').update(b).digest('hex');
const sources=new Map();
const read=path=>{const b=readFileSync(resolve(root,path));sources.set(path,sha(b));return b;};
const json=path=>JSON.parse(read(path));
const handoff=json(prefix+'lane-c-repair-v2/handoff.json');
const deliveries=json(prefix+'lane-c-repair-v2/delivery-files.json');
const metadata=json(prefix+'lane-c-repair-v2/read-set.final-inputs.json');
const old=json(prefix+'review-c-avicenna/delivery-files.json');
const originalDelivery=json(prefix+'lane-c/delivery-files.json');
const mismatches=[];
for(const [kind,entries] of [['v2-source',handoff.changedFiles.map(x=>({path:x.path,sha256:x.afterSha256}))],['v2-delivery',deliveries.entries],['v2-final-metadata',metadata.entries],['original-review',old.entries]])for(const entry of entries){const actual=sha(read(entry.path));if(actual!==entry.sha256)mismatches.push({kind,path:entry.path,expected:entry.sha256,actual});}
const repaired=new Set(handoff.changedFiles.map(x=>x.path));
for(const e of originalDelivery.entries){const actual=sha(read(e.path));if(!repaired.has(e.path)&&actual!==e.sha256)mismatches.push({kind:'original-C-unrepaired',path:e.path,expected:e.sha256,actual});}
for(const file of readdirSync(resolve(root,prefix+'review-c-avicenna')))read(prefix+'review-c-avicenna/'+file);
const codeBefore=json(prefix+'lane-c-repair-v2/code.before.json');
const originalReads=json(prefix+'review-c-avicenna/read-set.json');
const codeChanges=[];
for(const [path,content] of Object.entries(codeBefore)){
 const historical=originalReads.sources.find(x=>x.path===path);
 const before=sha(Buffer.from(content));
 if(historical&&before!==historical.sha256)mismatches.push({kind:'v1-code-snapshot',path,expected:historical.sha256,actual:before});
 const after=sha(read(path));if(before!==after)codeChanges.push({path,before,after});
}
for(const p of ['tests/cohesive-discovery-routing.test.mjs','tests/cohesive-discovery-navigation.test.mjs','tests/discovery-quality-20261003.test.mjs','tests/discovery-selection-boundary-20261003.test.mjs','tests/discovery-need-20261003.test.mjs','tests/realtime-asset-discovery.test.mjs'])read(p);
read(prefix+'review-c-v2-avicenna/integrity.mjs');
console.log(JSON.stringify({schema:'review-c-v2-avicenna-integrity-v1',node:process.version,mismatches,codeChanges,acceptedSourceCandidates:handoff.changedFiles,sources:[...sources].map(([path,sha256])=>({path,sha256}))}));

import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname,posix} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..'),prefix='artifacts/qualification/cohesive-product-20261015/';
const sha=b=>createHash('sha256').update(b).digest('hex'),sources=new Map();
const read=path=>{const b=readFileSync(resolve(root,path));sources.set(path,sha(b));return b;},json=path=>JSON.parse(read(path));
read(prefix+'review-runtime-repair-avicenna/controls.mjs');
const input=json(prefix+'review-runtime-repair-avicenna/fresh-controls.json'),catalog=json('product/catalog.json');
const old=json(prefix+'review-runtime-repair-dirac/code.before.json'),cache=new Map();
function load(path){if(cache.has(path))return cache.get(path);const source=old[path].replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>'from '+q+load(posix.normalize(posix.join(posix.dirname(path),spec)))+q);const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(path,url);return url;}
for(const path of Object.keys(old).filter(x=>x.startsWith('product/lib/')))read(path);
const before=await import(load('product/lib/product.mjs'));
const after=await import(pathToFileURL(resolve(root,'product/lib/product.mjs')));
const discovery=await import(pathToFileURL(resolve(root,'product/lib/discovery.mjs')));
function observe(engine,row){const out=engine.searchCatalog(catalog,row.query,input.options),ids=out.results.map(x=>x.id);return {top5:out.results.slice(0,5).map(({id,score,reasons})=>({id,score,reasons})),ownerRank:row.owner?ids.indexOf(row.owner)+1||null:null,expectedMet:row.expect==='empty'?!ids.length:row.expect==='exclude'?!ids.includes(row.owner):row.expect==='first'?ids[0]===row.owner:ids.includes(row.owner),authority:out.authority,activation:out.activation};}
const results=input.cases.map(row=>({...row,querySha256:sha(Buffer.from(row.query)),before:observe(before,row),after:observe(after,row),runtimeEvidence:discovery.lexicalIntentMatch(catalog.skills.find(x=>x.id==='eternities-arcadia'),discovery.lexicalQueryEvidence(row.query))}));
const noNeedFailures=input.cases.filter(row=>{const o=after.routeTask(catalog,row.query,{need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'});return o.search.results.length||o.atlas.connectedSource.state!=='hold'||o.selection.state!=='abstain';}).map(x=>x.id);
const exactIdFailures=catalog.skills.filter(x=>after.searchCatalog(catalog,x.id,{limit:1}).results[0]?.id!==x.id).map(x=>x.id);
console.log(JSON.stringify({schema:'runtime-repair-avicenna-controls-results-v1',node:process.version,sources:[...sources].map(([path,sha256])=>({path,sha256})),changedDuringRun:[...sources].filter(([p,h])=>sha(readFileSync(resolve(root,p)))!==h).map(([p])=>p),noNeedFailures,exactIdFailures,results},null,2));

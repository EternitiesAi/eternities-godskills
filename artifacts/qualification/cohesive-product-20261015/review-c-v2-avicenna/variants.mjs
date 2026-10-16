// Independent bounded probes, with final live metadata held equal across code versions.
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,dirname,posix} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..');
const prefix='artifacts/qualification/cohesive-product-20261015/';
const sha=b=>createHash('sha256').update(b).digest('hex');
const sources=new Map();
const read=path=>{const b=readFileSync(resolve(root,path));sources.set(path,sha(b));return b;};
const json=path=>JSON.parse(read(path));
read(prefix+'review-c-v2-avicenna/variants.mjs');
const inputs=json(prefix+'review-c-v2-avicenna/variants.json');
const historical=json(prefix+'lane-c-repair-v2/catalog.current-metadata.final.json');
const historicalHashes=json(prefix+'lane-c-repair-v2/read-set.final-inputs.json');
const metadata=readdirSync(resolve(root,'product/skills')).sort().map(id=>JSON.parse(read('product/skills/'+id+'/skill.json')));
const finalCatalog={...historical,skills:metadata.map(meta=>({...meta,entrypoint:'skills/'+meta.id+'/SKILL.md',entrypointSha256:'0'.repeat(64)}))};
const metadataDeltas=historicalHashes.entries.filter(x=>sources.get(x.path)!==x.sha256).map(x=>({path:x.path,before:x.sha256,after:sources.get(x.path)}));
const before=json(prefix+'lane-c-repair-v2/code.before.json');
const current=Object.fromEntries(Object.keys(before).map(path=>[path,read(path).toString('utf8')]));
const canonicalHashes={};
function load(get,entry='product/lib/product.mjs'){
 const cache=new Map();const url=path=>{
  if(cache.has(path))return cache.get(path);
  const text=get(path).replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>'from '+q+url(posix.normalize(posix.join(posix.dirname(path),spec)))+q);
  const value='data:text/javascript;base64,'+Buffer.from(text).toString('base64');cache.set(path,value);return value;
 };return import(url(entry));
}
const canonical=await load(path=>{const b=execFileSync('git',['show','c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d:'+path],{cwd:root,windowsHide:true});canonicalHashes[path]=sha(b);return b.toString('utf8');});
const v1=await load(path=>before[path]),v2=await load(path=>current[path]);
const discovery=await load(path=>current[path],'product/lib/discovery.mjs');
const runtime=finalCatalog.skills.find(x=>x.id==='eternities-arcadia');
function observe(engine,catalog,row){
 const out=engine.searchCatalog(catalog,row.query,inputs.options),ids=out.results.map(x=>x.id),hit=out.results.find(x=>x.id===runtime.id);
 const purpose=hit?.reasons.some(x=>x.startsWith('Lexical intent: game or real-time 3D runtime scope'))??false;
 const expectedMet=row.expect==='characterize'?null:((row.expect==='include'?!!hit:row.expect==='empty'?!ids.length:!hit)&&(row.purpose===undefined||row.purpose===purpose));
 return {top5:ids.slice(0,5),arcadiaRank:ids.indexOf(runtime.id)+1||null,museRank:ids.indexOf('eternities-muse')+1||null,count:ids.length,purpose,expectedMet};
}
const results=inputs.cases.map(row=>({...row,inputSha256:sha(Buffer.from(row.query)),canonicalFinalMetadata:observe(canonical,finalCatalog,row),v1FinalMetadata:observe(v1,finalCatalog,row),v2FinalMetadata:observe(v2,finalCatalog,row),v2HistoricalMetadata:observe(v2,historical,row),directIntent:discovery.lexicalIntentMatch(runtime,discovery.lexicalQueryEvidence(row.query))}));
const controls={exactIdFailures:[],noNeedFailures:[],authorityFailures:[],renamedMetadataFailures:[],scoreBonusFailures:[]};
for(const item of finalCatalog.skills)if(v2.searchCatalog(finalCatalog,item.id,{limit:1}).results[0]?.id!==item.id)controls.exactIdFailures.push(item.id);
const renamed={...runtime,id:'reviewer-game-method',entrypoint:'skills/reviewer-game-method/SKILL.md'};
for(const row of inputs.cases){
 const out=v2.routeTask(finalCatalog,row.query,{need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'});
 if(out.search.results.length||out.selection.state!=='abstain'||out.atlas.connectedSource.state!=='hold')controls.noNeedFailures.push(row.id);
 if(out.search.authority!=='none'||out.search.activation!=='none')controls.authorityFailures.push(row.id);
 const first=discovery.lexicalIntentMatch(runtime,discovery.lexicalQueryEvidence(row.query)),second=discovery.lexicalIntentMatch(renamed,discovery.lexicalQueryEvidence(row.query));
 if(JSON.stringify(first)!==JSON.stringify(second))controls.renamedMetadataFailures.push(row.id);
 if(first.score!==0)controls.scoreBonusFailures.push(row.id);
}
const savedGroups=[];
for(const name of ['challenges','supplemental','parent-challenges']){
 const data=json(prefix+'review-c-avicenna/'+name+'.json');
 const rows=data.cases.map(row=>{
  const out=v2.searchCatalog(finalCatalog,row.query,{...data.options,need:row.need}),ids=out.results.map(x=>x.id);
  const met=row.expect==='characterize'?null:row.expect==='empty'?!ids.length:row.expect==='nonempty'?ids.length>0:row.expect==='exclude'?!ids.includes(row.owner):ids.includes(row.owner);
  return {id:row.id,inputSha256:sha(Buffer.from(row.query)),expectedMet:met,top5:ids.slice(0,5),ownerRank:row.owner?ids.indexOf(row.owner)+1||null:null};
 });savedGroups.push({name,rows,pass:rows.filter(x=>x.expectedMet===true).length,remaining:rows.filter(x=>x.expectedMet===false).map(x=>x.id)});
}
console.log(JSON.stringify({schema:'review-c-v2-avicenna-variants-results-v1',node:process.version,metadataCount:metadata.length,finalCatalogRetrievalIdentity:sha(Buffer.from(JSON.stringify(finalCatalog))),metadataDeltas,arcadiaFinalMetadata:runtime,canonicalHashes,sources:[...sources].map(([path,sha256])=>({path,sha256})),changedDuringRun:[...sources].filter(([path,hash])=>sha(readFileSync(resolve(root,path)))!==hash).map(([path])=>path),controls,results,savedGroups},null,2));

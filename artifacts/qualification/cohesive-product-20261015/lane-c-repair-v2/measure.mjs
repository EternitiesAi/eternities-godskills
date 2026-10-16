// Read-only matched-metadata comparison. Results go to stdout, never to the
// original author/reviewer receipts or shared manifests.
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {posix} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=new URL('../../../../',import.meta.url),here=new URL('./',import.meta.url);
const sha=b=>createHash('sha256').update(b).digest('hex');
const sources=new Map();
async function read(path){const b=await readFile(new URL(path,repo));sources.set(path,sha(b));return b;}
const prefix='artifacts/qualification/cohesive-product-20261015/';
await read(prefix+'lane-c-repair-v2/measure.mjs');
const catalogFile=process.argv.includes('--initial-metadata')?'catalog.current-metadata.frozen.json':'catalog.current-metadata.final.json';
const catalogPath=prefix+'lane-c-repair-v2/'+catalogFile;
const catalog=JSON.parse(await read(catalogPath));
const before=JSON.parse(await read(prefix+'lane-c-repair-v2/code.before.json'));
const current={};for(const path of Object.keys(before))current[path]=(await read(path)).toString('utf8');
const canonicalHashes={};
function loadCode(get){const cache=new Map();const url=path=>{
  if(cache.has(path))return cache.get(path);
  const text=get(path).replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>'from '+q+url(posix.normalize(posix.join(posix.dirname(path),spec)))+q);
  const value='data:text/javascript;base64,'+Buffer.from(text).toString('base64');cache.set(path,value);return value;
};return import(url('product/lib/product.mjs'));}
const original=await loadCode(path=>before[path]);
const repaired=await loadCode(path=>current[path]);
const canonical=await loadCode(path=>{const b=execFileSync('git',['show','c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d:'+path],{cwd:fileURLToPath(repo),windowsHide:true});canonicalHashes[path]=sha(b);return b.toString('utf8');});
const groups=[];
for(const name of ['challenges','supplemental','parent-challenges']){
  const data=JSON.parse(await read(prefix+'review-c-avicenna/'+name+'.json'));
  groups.push({name,options:data.options,cases:data.cases});
}
const camera='Our character is readable in a turntable but disappears at the gameplay camera; improve its silhouette without changing the art style.';
groups.push({name:'camera',options:{limit:20},cases:[{id:'CAM01',query:camera,owner:'eternities-arcadia',expect:'include'},{id:'CAM02',query:camera.replace('gameplay camera','gameplay scene camera'),owner:'eternities-arcadia',expect:'include'}]});
const matrix=JSON.parse(await read(prefix+'lane-c/matrix.frozen.json'));
groups.push({name:'author-35-same-current-metadata',options:matrix.options,cases:matrix.cases});
function observe(engine,row,options){
  const out=engine.searchCatalog(catalog,row.query,{...options,need:row.need??'unknown'}),ids=out.results.map(x=>x.id);
  let met;
  if(row.expect==='characterize')met=null;
  else if(row.expect)met=row.expect==='empty'?!ids.length:row.expect==='nonempty'?ids.length>0:row.expect==='exclude'?!ids.includes(row.owner):ids.includes(row.owner);
  else met=(!row.empty||!ids.length)&&(!row.nonempty||ids.length>0)&&(!row.owner||ids.includes(row.owner))&&(row.exclude??[]).every(id=>!ids.includes(id));
  const runtime=out.results.find(x=>x.id==='eternities-arcadia');
  return {top5:ids.slice(0,5),count:ids.length,expectedMet:met,ownerRank:row.owner?ids.indexOf(row.owner)+1||null:null,abstention:out.abstentionReason??null,runtimePurposeReason:runtime?.reasons.some(r=>r.startsWith('Lexical intent: game or real-time 3D runtime scope'))??false};
}
const result=groups.map(group=>{
  const rows=group.cases.map(row=>({...row,canonical:observe(canonical,row,group.options),before:observe(original,row,group.options),after:observe(repaired,row,group.options)}));
  return {name:group.name,total:rows.length,scored:rows.filter(x=>x.after.expectedMet!==null).length,beforePass:rows.filter(x=>x.before.expectedMet===true).length,afterPass:rows.filter(x=>x.after.expectedMet===true).length,
    beforeFailures:rows.filter(x=>x.before.expectedMet===false).map(x=>x.id),afterFailures:rows.filter(x=>x.after.expectedMet===false).map(x=>x.id),newRegressions:rows.filter(x=>x.before.expectedMet===true&&x.after.expectedMet===false).map(x=>x.id),rows};
});
const controls={exactIds:[],hostNoNeed:[]};
for(const item of catalog.skills)if(repaired.searchCatalog(catalog,item.id,{limit:1}).results[0]?.id!==item.id)controls.exactIds.push(item.id);
for(const group of groups)for(const row of group.cases){const out=repaired.routeTask(catalog,row.query,{need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'});if(out.search.results.length||out.atlas.connectedSource.state!=='hold'||out.selection.state!=='abstain')controls.hostNoNeed.push(group.name+'/'+row.id);}
const changedDuringRun=[];for(const [path,hash] of sources)if(sha(await readFile(new URL(path,repo)))!==hash)changedDuringRun.push(path);
console.log(JSON.stringify({schema:'lane-c-repair-v2-matched-results-v1',node:process.version,catalogPath,catalogSha256:sources.get(catalogPath),note:'All three code versions use the SAME frozen current metadata. Top five IDs are retained; count and owner rank use each case limit. Characterization is unscored. Original author-35 on its original metadata is separately covered by the unchanged historical matrix test.',sources:[...sources].map(([path,sha256])=>({path,sha256})),canonicalHashes,changedDuringRun,controls,groups:result}));

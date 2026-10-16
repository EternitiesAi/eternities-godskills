// Read-only causal comparison; no builds or fixture updates.
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {posix} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=new URL('../../../../',import.meta.url);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sources=new Map();
async function read(path){const bytes=await readFile(new URL(path,repo));sources.set(path,sha(bytes));return bytes;}
const saved=JSON.parse(await read('artifacts/qualification/cohesive-product-20261015/review-runtime-repair-dirac/code.before.json'));
function loadCode(get){const cache=new Map();const url=path=>{
  if(cache.has(path))return cache.get(path);
  const text=get(path).replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>'from '+q+url(posix.normalize(posix.join(posix.dirname(path),spec)))+q);
  const result='data:text/javascript;base64,'+Buffer.from(text).toString('base64');cache.set(path,result);return result;
};return import(url('product/lib/product.mjs'));}
const canonicalHashes={};
const canonical=await loadCode(path=>{const bytes=execFileSync('git',['show','c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d:'+path],{cwd:fileURLToPath(repo),windowsHide:true});canonicalHashes[path]=sha(bytes);return bytes.toString('utf8');});
const prior=await loadCode(path=>saved[path]);
const current={};for(const path of Object.keys(saved).filter(p=>p.startsWith('product/lib/')))current[path]=(await read(path)).toString('utf8');
const repaired=await loadCode(path=>current[path]);
const catalog=JSON.parse(await read('product/catalog.json'));
const oldCatalogBytes=execFileSync('git',['show','c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d:product/catalog.json'],{cwd:fileURLToPath(repo),windowsHide:true});
const oldCatalog=JSON.parse(oldCatalogBytes);
const causal='Judge whether a measured home-feed retention lift supports a causal claim; inspect randomization, exposure, confounders, uncertainty, and guardrails, not one serving request.';
const queries=[
  'Hidden tab resumes with a huge simulation delta and pressed keys stay stuck',
  'Fix canvas resize pointer coordinates and duplicate animation loops',
  'When browser focus returns, the simulation advances too far and held input remains active',
  'Repair pointer input after page visibility changes interrupt the animation',
  "Fix the shader and rotation handles in the exhibit's existing interactive crystal scene; the educator's prompts and all explanatory rules must stay exactly as they are.",
  'Debug the fragment shader in an interactive scene',
  'Repair keyboard focus on the sign-up page input fields',
  causal,
  'Appraise whether a study supports a causal inference; inspect the design, confounding, statistical analysis, and uncertainty.',
];
const observe=(engine,input,query)=>engine.searchCatalog(input,query,{limit:10}).results.map(({id,score,reasons})=>({id,score,reasons}));
const cases=queries.map(query=>({query,canonicalOldMetadata:observe(canonical,oldCatalog,query),canonicalCurrentMetadata:observe(canonical,catalog,query),beforeCurrentMetadata:observe(prior,catalog,query),afterCurrentMetadata:observe(repaired,catalog,query)}));
// Isolate the two metadata triggers while keeping every other current record fixed.
const counterfactual=structuredClone(catalog);
const oldDiagnostic=oldCatalog.skills.find(x=>x.id==='diagnostic-statistical-model-inference');
counterfactual.skills.find(x=>x.id===oldDiagnostic.id).triggers=oldDiagnostic.triggers;
const triggerAblation={query:causal,current:observe(prior,catalog,causal),onlyDiagnosticTriggersReverted:observe(prior,counterfactual,causal)};
const historical=JSON.parse(await read('tests/fixtures/catalog-before-next-eight-20261004.json'));
const educational=[];
const projection=result=>({envelope:{...Object.fromEntries(['schema','authority','activation','method','query','selection'].map(key=>[key,result[key]])),...(Object.hasOwn(result,'abstentionReason')?{abstentionReason:result.abstentionReason}:{})},results:result.results.map(({id,score,reasons})=>({id,score,reasons}))});
function differences(a,b,path=''){
  if(JSON.stringify(a)===JSON.stringify(b))return [];
  if(a&&b&&typeof a==='object'&&typeof b==='object')return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>differences(a[k],b[k],path?path+'.'+k:k));
  return [{path,expected:a,actual:b}];
}
for(const path of ['tests/fixtures/educational-discovery-revealed-v2.json','tests/fixtures/educational-discovery-revealed-v4.json']){
  for(const row of JSON.parse(await read(path)).cases){
    if(!row.baseline)continue;
    const before=projection(prior.searchCatalog(historical,row.query,row.options));
    const after=projection(repaired.searchCatalog(historical,row.query,row.options));
    educational.push({id:row.id,query:row.query,canonicalDifferences:differences(row.baseline,projection(canonical.searchCatalog(historical,row.query,row.options))),beforeDifferences:differences(row.baseline,before),afterDifferences:differences(row.baseline,after)});
  }
}
const changedDuringRun=[];for(const [path,hash] of sources)if(sha(await readFile(new URL(path,repo)))!==hash)changedDuringRun.push(path);
console.log(JSON.stringify({node:process.version,canonical:'c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d',sources:[...sources].map(([path,sha256])=>({path,sha256})),canonicalHashes,canonicalCatalogSha256:sha(oldCatalogBytes),changedDuringRun,cases,triggerAblation,educational}));

// Independent reviewer probes; read-only outside this review directory.
import {readFileSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve, dirname, posix} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)), root=resolve(here,'../../../..');
const base='c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const bytes=path=>readFileSync(resolve(root,path));
const json=path=>JSON.parse(bytes(path));
const sources=new Map(), baselineSources=new Map(), modules=new Map();
const pinned=path=>{const b=bytes(path); sources.set(path,hash(b)); return b;};
pinned('artifacts/qualification/cohesive-product-20261015/review-c-avicenna/challenge-run.mjs');
const git=path=>{const b=execFileSync('git',['show',base+':'+path],{cwd:root,windowsHide:true}); baselineSources.set(path,hash(b)); return b.toString('utf8');};
function baselineModule(path){
  if(modules.has(path))return modules.get(path);
  const source=git(path).replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>{
    const target=posix.normalize(posix.join(posix.dirname(path),spec));
    return 'from '+q+baselineModule(target)+q;
  });
  const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
  modules.set(path,url);return url;
}
const challengePath='artifacts/qualification/cohesive-product-20261015/review-c-avicenna/'+(process.argv.includes('--parent')?'parent-challenges.json':process.argv.includes('--supplemental')?'supplemental.json':'challenges.json');
const challenges=JSON.parse(pinned(challengePath));
const catalogPath='artifacts/qualification/cohesive-product-20261015/lane-c/catalog.frozen.json';
const catalog=JSON.parse(pinned(catalogPath));
for(const path of ['product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs','product/lib/navigation.mjs','product/lib/method-directory.mjs','product/lib/skill-frontmatter.mjs',
'product/DISCOVERY.md','product/START-HERE.md','README.md','docs/history/README-before-cohesive-20261015.md',
'artifacts/qualification/cohesive-product-20261015/lane-c/ASSESSMENT.md','artifacts/qualification/cohesive-product-20261015/lane-c/delivery-files.json',
'tests/cohesive-discovery-boundaries.test.mjs','tests/cohesive-discovery-routing.test.mjs','tests/cohesive-discovery-navigation.test.mjs',
'tests/discovery-quality-20261003.test.mjs','tests/discovery-selection-boundary-20261003.test.mjs','tests/discovery-need-20261003.test.mjs','tests/realtime-asset-discovery.test.mjs','product/catalog.json',
'product/skills/eternities-arcadia/SKILL.md'])pinned(path);
const liveCatalog={...catalog,skills:readdirSync(resolve(root,'product/skills')).sort().map(id=>{
  const meta=JSON.parse(pinned('product/skills/'+id+'/skill.json'));
  return {...meta,entrypoint:'skills/'+id+'/SKILL.md',entrypointSha256:'0'.repeat(64)};
})};
const baseline=await import(baselineModule('product/lib/product.mjs'));
const candidate=await import(pathToFileURL(resolve(root,'product/lib/product.mjs')));
const {affirmativeRequestClauses}=await import(pathToFileURL(resolve(root,'product/lib/request-scope.mjs')));
const {lexicalQueryEvidence}=await import(pathToFileURL(resolve(root,'product/lib/discovery.mjs')));
function observe(engine,input,row){
 const result=engine.searchCatalog(input,row.query,{...challenges.options,need:row.need});
 const ids=result.results.map(x=>x.id);
 const met=row.expect==='empty'?ids.length===0:row.expect==='nonempty'?ids.length>0:
   row.expect==='exclude'?!ids.includes(row.owner):ids.includes(row.owner);
 return {top3:ids.slice(0,3),museRank:ids.indexOf('eternities-muse')+1||null,ownerRank:row.owner?(ids.indexOf(row.owner)+1||null):null,
   count:ids.length,abstention:result.abstentionReason??null,selection:result.selection,
   authority:result.authority,activation:result.activation,expectedMet:met};
}
const results=challenges.cases.map(row=>({...row,baseline:observe(baseline,catalog,row),
 candidate:observe(candidate,catalog,row),liveMetadata:observe(candidate,liveCatalog,row),
 clauses:affirmativeRequestClauses(row.query),
 intents:lexicalQueryEvidence(row.query).intents.map(x=>x.name)}));
const exactIds=catalog.skills.map(x=>x.id).filter(id=>candidate.searchCatalog(catalog,id,{limit:1}).results[0]?.id!==id);
const hostNone=challenges.cases.filter(row=>{
 const context={need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'};
 const out=candidate.routeTask(catalog,row.query,context);
 return out.search.results.length||out.atlas.connectedSource.state!=='hold'||out.selection.state!=='abstain';
}).map(x=>x.id);
const delivery=json('artifacts/qualification/cohesive-product-20261015/lane-c/delivery-files.json');
const deliveryMismatch=delivery.entries.filter(entry=>hash(bytes(entry.path))!==entry.sha256).map(e=>e.path);
const changedDuringRun=[...sources].filter(([path,sha])=>hash(bytes(path))!==sha).map(([path])=>path);
console.log(JSON.stringify({schema:'review-c-avicenna-challenge-results-v1',base,node:process.version,
  catalogSha256:hash(bytes(catalogPath)),sources:[...sources].map(([path,sha256])=>({path,sha256})),
  baselineSources:[...baselineSources].map(([path,sha256])=>({path,sha256})),
  deliveryMismatch,changedDuringRun,exactIdFailures:exactIds,hostNoNeedFailures:hostNone,
  summary:{total:results.length,baselineMeets:results.filter(x=>x.baseline.expectedMet).length,
    candidateMeets:results.filter(x=>x.candidate.expectedMet).length,
    regressions:results.filter(x=>x.baseline.expectedMet&&!x.candidate.expectedMet).map(x=>x.id),
    improvements:results.filter(x=>!x.baseline.expectedMet&&x.candidate.expectedMet).map(x=>x.id)},
  results}));


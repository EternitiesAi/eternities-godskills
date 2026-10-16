// Independent bounded parent follow-up. No writes; snapshots are returned on stdout.
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,dirname,posix} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../..');
const base='c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d';
const sha=b=>createHash('sha256').update(b).digest('hex');
const sources=[],baselineSources=[],cache=new Map();
function read(path){const b=readFileSync(resolve(root,path));sources.push({path,sha256:sha(b)});return b;}
function moduleAtBase(path){
 if(cache.has(path))return cache.get(path);
 const b=execFileSync('git',['show',base+':'+path],{cwd:root,windowsHide:true});
 baselineSources.push({path,sha256:sha(b)});
 const s=b.toString('utf8').replace(/from\s*(['"])(\.\.?\/[^'"]+)\1/g,(_,q,spec)=>'from '+q+moduleAtBase(posix.normalize(posix.join(posix.dirname(path),spec)))+q);
 const url='data:text/javascript;base64,'+Buffer.from(s).toString('base64');cache.set(path,url);return url;
}
read('artifacts/qualification/cohesive-product-20261015/review-c-avicenna/camera-check.mjs');
for(const p of ['product/lib/product.mjs','product/lib/discovery.mjs','product/lib/selection-boundary.mjs','product/lib/request-scope.mjs','product/lib/method-directory.mjs','product/lib/skill-frontmatter.mjs'])read(p);
const frozen=JSON.parse(read('artifacts/qualification/cohesive-product-20261015/lane-c/catalog.frozen.json'));
const live={...frozen,skills:readdirSync(resolve(root,'product/skills')).sort().map(id=>({...JSON.parse(read('product/skills/'+id+'/skill.json')),entrypoint:'skills/'+id+'/SKILL.md',entrypointSha256:'0'.repeat(64)}))};
const baseline=await import(moduleAtBase('product/lib/product.mjs'));
const candidate=await import(pathToFileURL(resolve(root,'product/lib/product.mjs')));
const {lexicalQueryEvidence}=await import(pathToFileURL(resolve(root,'product/lib/discovery.mjs')));
const query='Our character is readable in a turntable but disappears at the gameplay camera; improve its silhouette without changing the art style.';
const cases=[{id:'CAM01',query},{id:'CAM02',query:query.replace('gameplay camera','gameplay scene camera')}];
function observe(engine,catalog,q){const out=engine.searchCatalog(catalog,q,{limit:20});return {top3:out.results.slice(0,3).map(x=>x.id),arcadiaRank:out.results.findIndex(x=>x.id==='eternities-arcadia')+1||null,museRank:out.results.findIndex(x=>x.id==='eternities-muse')+1||null,count:out.results.length};}
const results=cases.map(row=>({...row,querySha256:sha(Buffer.from(row.query)),frozen:{baseline:observe(baseline,frozen,row.query),candidate:observe(candidate,frozen,row.query)},parentMetadata:{baseline:observe(baseline,live,row.query),candidate:observe(candidate,live,row.query)},intents:lexicalQueryEvidence(row.query).intents.map(x=>x.name)}));
const delivery=JSON.parse(read('artifacts/qualification/cohesive-product-20261015/lane-c/delivery-files.json'));
const deliveryMismatch=delivery.entries.filter(x=>sha(readFileSync(resolve(root,x.path)))!==x.sha256).map(x=>x.path);
console.log(JSON.stringify({schema:'review-c-avicenna-camera-v1',base,node:process.version,options:{limit:20},sources,baselineSources,results,deliveryMismatch,changedDuringRun:sources.filter(x=>sha(readFileSync(resolve(root,x.path)))!==x.sha256).map(x=>x.path)},null,2));

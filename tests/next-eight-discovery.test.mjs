import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {searchCatalog,routeTask,verifyProduct} from '../product/lib/product.mjs';
const root=fileURLToPath(new URL('../product/',import.meta.url));
const cases=[
 ['accessibility-audit-and-remediation','eternities-muse','Audit keyboard accessibility and repair checkout dialog focus restoration','A screen reader misses the async form error and keyboard focus escapes the popup'],
 ['service-observability-and-slo-design','eternities-daedalus','Design a request-based SLO with error budget and burn rate alerts','Determine eligible events and missing telemetry before declaring service reliability'],
 ['schema-migration-and-backfill-safety','eternities-atlas','Plan a resumable schema migration and backfill with concurrent writers','Keep old and new app versions compatible while transforming live database rows'],
 ['dependency-supply-chain-integrity','eternities-aegis','Audit dependency supply chain lockfile and runtime SBOM coverage','Verify resolved package artifacts and build provenance without executing install hooks'],
 ['procedural-world-generation-and-validation','eternities-arcadia','Validate procedural world generation with seed replay and chunk seams','Repair random dungeon key door solvability and generation retry exhaustion'],
 ['operating-cadence-and-decision-accountability','eternities-prometheus','Design company operating cadence with decision rights and queue capacity','Reduce founder approval bottlenecks with exception delegation and work in progress limits'],
 ['pricing-and-packaging-experimentation','eternities-beacon','Design pricing and packaging experiment with contribution margin guardrails','Compare price tiers across eligible customer cohorts without confusing promotion with demand'],
 ['narrative-structure-and-revision','eternities-logos','Revise narrative scene structure and branching choices with canon continuity','Write character conflict with consequential choices rather than exposition']
];
let verifiedCatalog;
function catalog(){return verifiedCatalog??= (async()=>{await verifyProduct(root);return JSON.parse(await readFile(resolve(root,'catalog.json'),'utf8'));})();}
for(const [id,owner,direct,paraphrase] of cases){
 test(`${id}: native entrypoint and useful method resources are discoverable`,async()=>{
  const c=await catalog(),item=c.skills.find(x=>x.id===id);assert(item,`Missing specialist ${id}`);assert.equal(item.specializes,owner);
  assert.equal(item.maturity,'instruction-reviewed');assert(item.resources.length>0);
  const body=await readFile(resolve(root,item.entrypoint),'utf8');assert.match(body,new RegExp(`name: ${id}(?:\\r?\\n)`));
  for(const resource of item.resources)await readFile(resolve(root,resource.path));
 });
 for(const [kind,query] of [['direct',direct],['paraphrase',paraphrase]])test(`${id}: ${kind} intent appears in bounded shortlist`,async()=>{
  const result=searchCatalog(await catalog(),query,{limit:3,need:'specialist'});
  assert(result.results.some(x=>x.id===id),JSON.stringify({query,ids:result.results.map(x=>x.id)}));
  assert.equal(result.activation,'none');assert.equal(result.authority,'none');assert.equal(result.selection.state,'review-required');
 });
 test(`${id}: explicit no-specialist host boundary still abstains`,async()=>{
  const result=routeTask(await catalog(),direct,{need:'none',inputScope:'supplied-only',discovery:'prohibited',connectedPurpose:'none'});
  assert.deepEqual(result.search.results,[]);assert.equal(result.selection.state,'abstain');assert.equal(result.atlas.connectedSource.state,'hold');
 });
}
test('eight specialist IDs are distinct and coexist with their broad owners',async()=>{
 const c=await catalog();assert.equal(new Set(cases.map(x=>x[0])).size,8);
 for(const [,owner]of cases)assert(c.skills.some(x=>x.id===owner));
});

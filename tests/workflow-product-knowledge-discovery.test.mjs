import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';
const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
// Breaks caught: focused methods absent from a useful shortlist or displacing
// established nearby specialists. These are authored development regressions.
const positives=[
 ['browser-automation-state-and-verification','Automate a browser form with stable locators and asynchronous navigation; reconcile an uncertain submit without duplicate side effects.'],
 ['browser-automation-state-and-verification','The tab navigated and reused an element reference. Reobserve the current page before filling the checkout form.'],
 ['git-change-integration-and-recovery','Integrate a Git feature branch while preserving unrelated staged hunks, resolving merge conflicts and checking the exact committed tree.'],
 ['git-change-integration-and-recovery','Our remote branch moved after review. Reconcile Git history, recover safely and preserve worktree ownership before pushing.'],
 ['product-discovery-and-prioritization','Prioritize a product roadmap with opportunity hypotheses, capacity, prerequisite dependencies and cheap discovery experiments.'],
 ['product-discovery-and-prioritization','Choose a feasible feature portfolio without mistaking customer requests for validated outcomes or ignoring remaining effort.'],
 ['knowledge-base-architecture-and-maintenance','Organize a knowledge base using stable document IDs, aliases, taxonomy, freshness and source-sensitive access scopes.'],
 ['knowledge-base-architecture-and-maintenance','Restructure our documentation graph; preserve renamed-page identity, reconcile conflicting versions and invalidate dependent indexes.'],
];
for(const [id,query] of positives)test(`focused route available: ${id}: ${query}`,()=>{
 assert(searchCatalog(catalog,query,{limit:3}).results.some(s=>s.id===id));
});
for(const [id,query] of positives.filter((_,i)=>i%2===0))test(`host no-need overrides ${id}`,()=>{
 const result=searchCatalog(catalog,query,{need:'none',limit:3});
 assert.deepEqual(result.results,[]);assert.equal(result.selection.state,'abstain');
});
for(const [id,query] of [
 ['accessibility-audit-and-remediation','Repair keyboard traps and screen reader focus restoration in an accessible dialog.'],
 ['schema-migration-and-backfill-safety','Migrate live database schemas with concurrent writes and a resumable backfill.'],
 ['pricing-and-packaging-experimentation','Run a pricing experiment comparing commercial cohorts and guardrails.'],
 ['retrieval-grounded-answering','Repair a retrieval pipeline that finds source evidence but generates unsupported answers.'],
])test(`adjacent method remains owner: ${id}`,()=>assert.equal(searchCatalog(catalog,query,{limit:1}).results[0]?.id,id));

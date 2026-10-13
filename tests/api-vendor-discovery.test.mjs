import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';

const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
// These authored regressions catch missing useful specialist candidates and
// displacement of neighboring methods. They do not measure general semantics.
const requests=[
 ['api-contract-design-and-evolution','Design an API contract and plan backward compatible evolution for old and new clients.'],
 ['api-contract-design-and-evolution','Our public endpoint adds a required request field and a new response enum value; check consumer compatibility before rolling out.'],
 ['api-contract-design-and-evolution','Specify API idempotency keys, concurrent updates and cursor pagination consistency for a versioned service.'],
 ['vendor-evaluation-and-exit-planning','Compare vendor proposals with mandatory requirements, total cost of ownership and renewal exit planning.'],
 ['vendor-evaluation-and-exit-planning','Decide whether to renew our supplier or switch after including migration costs, unavoidable commitments and data export feasibility.'],
 ['vendor-evaluation-and-exit-planning','A cheaper vendor lacks a required capability. Separate eligibility from weighted preferences before a procurement recommendation.'],
];
for(const[id,query]of requests)test(`specialist is discoverable: ${query}`,()=>{
 assert(searchCatalog(catalog,query,{limit:3}).results.some(s=>s.id===id));
});
for(const[id,query]of [requests[0],requests[3]])test(`host can skip specialist: ${id}`,()=>{
 const result=searchCatalog(catalog,query,{need:'none',limit:3});
 assert.deepEqual(result.results,[]);assert.equal(result.selection.state,'abstain');
});
for(const[id,query]of [
 ['schema-migration-and-backfill-safety','Migrate a database schema with concurrent writes and resumable data backfill.'],
 ['api-rate-limit-recovery','Recover a rate limited client using Retry-After and cancellation without duplicating requests.'],
 ['pricing-and-packaging-experimentation','Design a pricing and packaging experiment for our customers with comparable cohorts.'],
 ['jurisdiction-aware-contract-review','Review jurisdiction-specific contract clauses and extract legal obligations from a supplied agreement.'],
])test(`neighbor remains discoverable: ${id}`,()=>{
 assert(searchCatalog(catalog,query,{limit:3}).results.some(s=>s.id===id));
});

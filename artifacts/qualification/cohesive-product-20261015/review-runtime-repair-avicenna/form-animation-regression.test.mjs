import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchCatalog} from '../../../../product/lib/product.mjs';
const catalog=JSON.parse(readFileSync(new URL('../../../../product/catalog.json',import.meta.url)));
test('ordinary form focus remains outside the game owner when CSS animation is mentioned',()=>{
 const query='Repair keyboard focus on a sign-up page with a CSS animation.';
 const ids=searchCatalog(catalog,query,{limit:20}).results.map(x=>x.id);
 assert.equal(ids[0],'accessibility-audit-and-remediation');
 assert.equal(ids[1],'motion-design-and-animation-engineering');
 assert.ok(!ids.includes('eternities-arcadia'),'Before repair Arcadia was excluded; candidate introduces it at rank3 with a runtime-purpose reason.');
});

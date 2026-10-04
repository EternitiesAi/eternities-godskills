import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {searchCatalog, routeTask} from '../product/lib/product.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const id = 'eternities-agora';
const reference='skills/eternities-agora/references/research-funding-proposal.md';

// These consumer tests catch omitted or misleading discovery metadata. They do
// not certify that prose produces a scientifically valid or funded proposal.
for (const query of [
  'Develop a research proposal from the supplied solicitation, aims, review criteria and budget assumptions',
  'Review a research proposal for its workplan and funding requirements',
  'Research proposal planning and grant application',
]) {
  test(`research proposal owner exposes its selected detailed method: ${query}`,async()=>{
    const result=searchCatalog(catalog,query,{limit:3,taskType:'plan',need:'specialist'});
    assert.ok(result.results.some(item=>item.id===id),'expected relevant procedure among three bounded suggestions');
    const owner=catalog.skills.find(item=>item.id===id);
    const resource=owner.resources.find(item=>item.path===reference);
    assert.ok(resource,'selected owner must declare the portable method');
    const bytes=await readFile(new URL('../product/'+reference,import.meta.url));
    assert.equal(resource.sha256,createHash('sha256').update(bytes).digest('hex'));
    assert.equal(catalog.skills.some(item=>item.id==='research-proposal-development'),false,'no overlapping top-level entrypoint');
    assert.equal(result.authority,'none');
    assert.equal(result.activation,'none');
    assert.deepEqual(result,searchCatalog(catalog,query,{limit:3,taskType:'plan',need:'specialist'}));
  });
}

test('a proposal suggestion does not bypass host need or build-task constraints',()=>{
  const query='Research funding proposal opportunity aims workplan budget';
  assert.deepEqual(searchCatalog(catalog,query,{need:'none'}).results,[]);
  assert.equal(searchCatalog(catalog,query,{taskType:'build'}).results.some(item=>item.id===id),false);
});

test('host routing leaves a proposal suggestion unapproved and without connected-source permission',()=>{
  const result=routeTask(catalog,'Develop a research funding proposal from the current opportunity',{
    need:'specialist',inputScope:'missing-input',connectedPurpose:'none',discovery:'not-prohibited'
  },{limit:3});
  assert.equal(result.search.authority,'none');
  assert.equal(result.search.activation,'none');
  assert.equal(result.selection.state,'review-required');
  assert.equal(result.atlas.connectedSource.state,'rejected');
  assert.equal(result.atlas.connectedSource.reason,'no-connected-question');
});

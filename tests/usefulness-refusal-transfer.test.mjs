import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog} from '../product/lib/product.mjs';

const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
const controls=JSON.parse(await readFile(new URL('../artifacts/qualification/usefulness-20261016/review-discovery-v1/controls.json',import.meta.url),'utf8'));

// These independently authored controls catch refusal stems that swallow unrelated
// nouns/adjectives (fixtures, fixed, debugger) and erase actual requested work.
// Null grammar observations remain unscored; no semantic capability is inferred.
for(const row of controls.controls.filter(row=>row.expected.arcadia!==null)) {
  test(`independent refusal transfer: ${row.id}`,()=>{
    const result=searchCatalog(catalog,row.query,row.options);
    assert.equal(result.results.some(x=>x.id==='eternities-arcadia'),row.expected.arcadia,row.query);
    assert.equal(result.authority,'none');
    assert.equal(result.activation,'none');
  });
}

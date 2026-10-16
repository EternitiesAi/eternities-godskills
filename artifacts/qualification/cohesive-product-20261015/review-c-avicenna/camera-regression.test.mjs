import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {searchCatalog} from '../../../../product/lib/product.mjs';
const skills=new URL('../../../../product/skills/',import.meta.url);
const catalog={...JSON.parse(readFileSync(new URL('../lane-c/catalog.frozen.json',import.meta.url))),skills:readdirSync(skills).sort().map(id=>({...JSON.parse(readFileSync(new URL(id+'/skill.json',skills))),entrypoint:'skills/'+id+'/SKILL.md',entrypointSha256:'0'.repeat(64)}))};
const query='Our character is readable in a turntable but disappears at the gameplay camera; improve its silhouette without changing the art style.';
const hasArcadia=q=>searchCatalog(catalog,q,{limit:20}).results.some(x=>x.id==='eternities-arcadia');
test('R1 gameplay-camera silhouette authoring retains the metadata-supported owner',()=>{
 assert.ok(hasArcadia(query),'Matched current metadata: baseline code ranks Arcadia first; candidate excludes it.');
});
test('control: adding scene makes the same supported camera work eligible',()=>{
 assert.ok(hasArcadia(query.replace('gameplay camera','gameplay scene camera')));
});

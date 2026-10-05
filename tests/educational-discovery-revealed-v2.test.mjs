import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lexicalQueryEvidence,lexicalIntentMatch} from '../product/lib/discovery.mjs';
import {searchCatalog} from '../product/lib/product.mjs';
const fixture=JSON.parse(await readFile(new URL('./fixtures/educational-discovery-revealed-v2.json',import.meta.url),'utf8'));
const followup=JSON.parse(await readFile(new URL('./fixtures/educational-discovery-revealed-v4.json',import.meta.url),'utf8'));
const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));
// Literal score projections belong to their exact 77-entry input population:
// adding documents legitimately changes IDF weights and candidate membership.
// Keep the old gold and old input exact; current catalog still runs every
// semantic, eligibility, refusal and authority assertion below.
const historicalBytes=await readFile(new URL('./fixtures/catalog-before-next-eight-20261004.json',import.meta.url));
const historicalCatalog=JSON.parse(historicalBytes);
test('the literal educational projection keeps its exact prior catalog input',()=>{
 assert.equal(createHash('sha256').update(historicalBytes).digest('hex'),'bf90582e8a23a3d50a6997cfba5f97d022f4619024f8459e364423f269e10eca');
 assert.equal(historicalCatalog.skills.length,77);
 for(const before of historicalCatalog.skills)assert.deepEqual(catalog.skills.find(x=>x.id===before.id),before,'Existing77 catalog records changed');
});
const ownerId='evidence-linked-learning-design';
const owner=catalog.skills.find(x=>x.id===ownerId);
const intent='learner-model explanation';
const marker=`Lexical intent: ${intent};`;
const projection=result=>({
  envelope:{...Object.fromEntries(['schema','authority','activation','method','query','selection'].map(key=>[key,result[key]])),
    ...(Object.hasOwn(result,'abstentionReason')?{abstentionReason:result.abstentionReason}:{})},
  results:result.results.map(({id,score,reasons})=>({id,score,reasons})),
});
// This catches absent teaching-intent hooks, lost eligibility/authority boundaries,
// and changed negative projections. Gold is an independently authored, now-revealed
// literal fixture; none is computed by the discovery implementation under test.
for(const c of [...fixture.cases,...followup.cases])test(`disclosed teaching regression ${c.id}: ${c.family}`,()=>{
  const evidence=lexicalQueryEvidence(c.query);
  const recognized=evidence.intents.some(x=>x.name===intent);
  const desired=c.gold.text.desiredIntent;
  if(desired==='TEACHING_EXPLORATION'){
    assert.ok(recognized,'Missing current teaching-exploration intent');
    assert.equal(lexicalIntentMatch(owner,evidence).score,60,'Intent must match actual owner metadata');
  }else if(desired==='NO_NEW_INTENT')assert.ok(!recognized,'Non-teaching request acquired new teaching intent');
  else assert.equal(desired,'UNCERTAIN','Unknown literal fixture obligation');
  const result=searchCatalog(catalog,c.query,c.options);
  const found=result.results.find(x=>x.id===ownerId);
  const obligation=c.gold.returned.obligation;
  if(obligation==='OWNER_FIRST_WITH_ACTUAL_INTENT_REASON'){
    assert.equal(result.results[0]?.id,ownerId);
    assert.ok(found.reasons.some(x=>x.startsWith(marker)));
  }else if(obligation==='EMPTY_HOST_NO_NEED_ABSTENTION'){
    assert.deepEqual(result.results,[]);assert.equal(result.selection.state,'abstain');
  }else if(obligation==='EDUCATION_OWNER_ABSENT_NO_RETURNED_REASON_REQUIRED')assert.ok(!found);
  else if(obligation==='ACTUAL_INTENT_REASON_IF_OWNER_RETURNED_NO_PRIMARY_REQUIREMENT'){
    if(found)assert.ok(found.reasons.some(x=>x.startsWith(marker)));
  }else if(obligation==='NO_NEW_REASON_OR_CONTRIBUTION_EXACT_BASELINE'){
    assert.ok(!result.results.some(x=>x.reasons.some(r=>r.startsWith(marker))));
  }else{
    assert.equal(desired,'UNCERTAIN');
    if(recognized&&found)assert.ok(found.reasons.some(x=>x.startsWith(marker)));
  }
  if(c.baseline)assert.deepEqual(projection(searchCatalog(historicalCatalog,c.query,c.options)),c.baseline,'Literal old negative/excluded/abstained projection changed on its frozen input');
  assert.equal(result.authority,'none');assert.equal(result.activation,'none');
});

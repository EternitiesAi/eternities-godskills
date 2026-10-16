import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';

const lane=path.dirname(fileURLToPath(import.meta.url));
const operation='D:/03-ARSENAL/warehouse/_operations/godskills-expansion-20261015';
const json=p=>JSON.parse(fs.readFileSync(p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const frozen=json(`${operation}/cohort.freeze.json`);
const inventory=json(`${lane}/evidence/source-inventory.json`);

test('lane-d frozen cohort is finite, unique and absent at the recorded discovery boundary',()=>{
 assert.equal(frozen.members.length,6);
 assert.equal(new Set(frozen.members.map(r=>r.canonical.toLowerCase())).size,6);
 const discovery=json(`${operation}/discovery.json`);
 for(const member of frozen.members){
  const record=discovery.results.find(r=>r.canonical===member.canonical);
  assert.ok(record,member.canonical);
  assert.equal(record.indexHits.length,0);
  assert.equal(record.diskHits.length,0);
  assert.ok(record.sizeKiB*1024<frozen.repositorySizeExclusionBytes);
 }
});

test('lane-d six completed stages have successful origin/head/clean/shallow receipts',()=>{
 assert.equal(inventory.sources.length,6);
 for(const source of inventory.sources){
  const r=json(`${operation}/receipts/${source.canonical.replace('/','__')}.json`);
  assert.equal(r.state,'verified-stage');
  for(const key of ['clone','checkout','origin','head','clean','shallow'])assert.equal(r[key].status,0,`${source.canonical} ${key}`);
  assert.equal(r.origin.stdout.trim(),`https://github.com/${source.canonical}.git`);
  assert.match(r.head.stdout.trim(),/^[a-f0-9]{40}$/);
  assert.equal(r.clean.stdout,'');
  assert.equal(r.shallow.stdout.trim(),'true');
  assert.ok(r.tree.totalBlobBytes<=frozen.perCheckoutBlobBudgetBytes);
  assert.ok(r.tree.largest[0].bytes<frozen.maximumSingleBlobBytesExclusive);
  assert.deepEqual(r.tree.submodules,[]);
  assert.deepEqual(r.tree.symlinks,[]);
 }
 assert.ok(inventory.operationBytes<frozen.operationBudgetBytes);
});

test('lane-d every staged tracked blob still matches its pinned Git object; hash-only is not material reading',()=>{
 let count=0;
 for(const source of inventory.sources){
  const tree=json(`${operation}/trees/${source.canonical.replace('/','__')}.json`);
  for(const object of tree.filter(r=>r.type==='blob')){
   const bytes=fs.readFileSync(`${source.stage}/${object.path}`);
   assert.equal(bytes.length,object.bytes,`${source.canonical}/${object.path}`);
   assert.equal(blob(bytes),object.oid,`${source.canonical}/${object.path}`);
   count++;
  }
 }
 assert.equal(count,478);
});

test('lane-d exact local read-set hashes remain reproducible, with original and changed index pins retained',()=>{
 const set=json(`${lane}/evidence/read-set.json`);
 assert.equal(set.files.length,56);
 for(const row of set.files)assert.equal(sha(fs.readFileSync(row.path)),row.sha256,row.path);
 const reconciliation=json(`${lane}/evidence/index-reconciliation.json`);
 assert.equal(reconciliation.frozen.sha256,set.historicalObservations[0].sha256);
 assert.notEqual(reconciliation.current.sha256,reconciliation.frozen.sha256);
 assert.equal(reconciliation.current.count,2610);
 for(const row of reconciliation.currentMatches)assert.deepEqual(row.matches,[]);
});

test('lane-d unread entrypoints remain deferred rather than inheriting a source-level acceptance',()=>{
 const ledger=json(`${lane}/evidence/entrypoint-decisions.json`);
 assert.equal(ledger.materialRead,13);
 assert.equal(ledger.indexedOnly,89);
 for(const row of ledger.entrypoints){
  if(row.readState==='indexed-only'){assert.equal(row.disposition,'deferred');assert.equal(row.proposal,null);}
  else assert.ok(['independent-implementation','pattern-reference','rejected','deferred'].includes(row.disposition));
 }
});

test('lane-d synthetic creator slate requires aggregate cost and role coverage',()=>{
 const rows=[{id:'A',role:'tutorial',fee:4000,rights:1000},{id:'B',role:'tutorial',fee:2800,rights:400},{id:'C',role:'vertical',fee:1800,rights:500}];
 const feasible=[];
 for(let mask=0;mask<2**rows.length;mask++){
  const chosen=rows.filter((_,i)=>mask&(1<<i));
  const roles=new Set(chosen.map(r=>r.role));
  const cost=chosen.reduce((total,r)=>total+r.fee+r.rights,0);
  if(roles.size===2&&cost<=6000)feasible.push({ids:chosen.map(r=>r.id).join('+'),cost});
 }
 assert.deepEqual(feasible,[{ids:'B+C',cost:5500}]);
 assert.equal(rows[0].fee+rows[0].rights+rows[2].fee+rows[2].rights,7300);
});

test('lane-d synthetic metric tuples distinguish observed cardinality, capacity bound and identifier spelling',()=>{
 const events=[['east','checkout'],['east','checkout'],['west','search']];
 const observed=new Set(events.map(r=>JSON.stringify(r))).size;
 const bound=new Set(events.map(r=>r[0])).size*new Set(events.map(r=>r[1])).size;
 assert.equal(observed,2);assert.equal(bound,4);
 assert.equal(50000*200*5*5,250000000);
 assert.equal(200*5*5,5000);
 const ids=['request1','request2','request3'];
 assert.equal(new Set(ids.map(id=>sha(Buffer.from(id)))).size,ids.length);
 const failures=['timeout','unknown_vendor_error','timeout'];
 const normalized=failures.map(value=>value==='timeout'?value:'other_error');
 assert.equal(normalized.length,failures.length);
 assert.equal(normalized.filter(value=>value==='other_error').length,1);
});

test('lane-d synthetic event time respects missing calendar periods',()=>{
 const years=[2018,2020,2023],actual=years.map(y=>y-2020),rowOffsets=years.map((_,i)=>i-1);
 assert.deepEqual(actual,[-2,0,3]);
 assert.notDeepEqual(actual,rowOffsets);
});

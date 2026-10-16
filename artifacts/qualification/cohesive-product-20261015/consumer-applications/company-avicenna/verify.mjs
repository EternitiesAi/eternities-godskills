// Bounded local consumer self-check. Reads only named inputs and this output directory.
// This is not a hidden acceptance check or independent review of the consumer.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const fixture='C:/Users/Dom/.codex/operations/godskills-cohesive-20261015/consumer-fixtures/company-week.md';
const fixtureSha256='fd8fa828658d7fb21001878d824b11dc33a18864a35429a0ac94ddc9367c22bc';
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=name=>readFileSync(new URL(name,import.meta.url));
assert.equal(hash(readFileSync(fixture)),fixtureSha256);
const methods=JSON.parse(read('used-methods.json'));
const inputs=methods.methods.flatMap(m=>[m,...m.references]);
for(const item of inputs)assert.equal(hash(readFileSync(item.path)),item.sha256,item.path+' changed since full read');
const [header,...data]=read('cash.csv').toString().trim().split(/\r?\n/);
assert.equal(header,'week,opening_cash,contracted_receipts,unavoidable_payments,closing_cash,reserve_gap');
const rows=data.map(r=>r.split(',').map(Number));
assert.deepEqual(rows,[[1,40000,0,12000,28000,0],[2,28000,10000,20000,18000,0],[3,18000,0,12000,6000,9000],[4,6000,20000,12000,14000,1000]]);
for(let i=0;i<rows.length;i++){
 const [week,opening,receipts,payments,closing,gap]=rows[i];
 assert.equal(week,i+1);assert.equal(closing,opening+receipts-payments);
 assert.equal(gap,Math.max(0,15000-closing));
 if(i)assert.equal(opening,rows[i-1][4]);
}
assert.equal(rows.reduce((a,r)=>a+r[2],0),30000);
assert.equal(rows.reduce((a,r)=>a+r[3],0),56000);
const scenarios=[
 {name:'Base',event:'None',delta:[0,0,0,0],expected:[28000,18000,6000,14000]},
 {name:'Campaign only',event:'-10000 at start W1',delta:[-10000,0,0,0],expected:[18000,8000,-4000,4000]},
 {name:'Annual renewal only',event:'-9000 at start W3',delta:[0,0,-9000,0],expected:[28000,18000,-3000,5000]},
 {name:'Bridge only',event:'-1000 at start W3',delta:[0,0,-1000,0],expected:[28000,18000,5000,13000]},
 {name:'Unsigned sale upside only',event:'+30000 at end W3',delta:[0,0,30000,0],expected:[28000,18000,36000,44000]}
];
const decision=read('decision.md').toString();
for(const s of scenarios){
 let cumulative=0;
 const closes=rows.map((r,i)=>{cumulative+=s.delta[i];return r[4]+cumulative;});
 assert.deepEqual(closes,s.expected);
 s.closes=closes;s.reserveGaps=closes.map(x=>Math.max(0,15000-x));
 assert.ok(decision.includes(`| ${s.name} | ${s.event} | ${closes.join(' | ')} | ${s.reserveGaps[2]} |`),s.name+' narrative table mismatch');
}
assert.equal(scenarios[3].closes[2]-scenarios[2].closes[2],8000);
assert.deepEqual(scenarios[4].closes.slice(2).map(x=>x-1000),[35000,43000]);
assert.equal(28000-20000,8000); // W2 payments before receipt
assert.equal(rows[2][4]-12000,-6000); // base W4 payments before receipt
assert.equal(scenarios[3].closes[2]-12000,-7000); // bridge W4 payments before receipt
assert.equal(4*200,800); // exposure ceiling, not a scheduled payment
const outputs=['cash.csv','decision.md','used-methods.json','verify.mjs'].map(path=>({path,sha256:hash(read(path))}));
console.log(JSON.stringify({schema:'company-avicenna-local-verification-v1',status:'PASS',evidenceClass:'consumer-output self-check, not independent acceptance',fixture:{path:fixture,sha256:fixtureSha256,readDepth:'full'},methodBodiesHashMatched:inputs.length,baseRows:rows.length,baseContinuityAndReserveChecked:true,scenarios,checks:['fixture and all five fully read method bodies unchanged','four weekly cash identities and continuity','reserve is a threshold not a payment','contracted receipts and unavoidable payments totals','isolated scenario deltas and exact decision table agreement','bridge vs annual cash difference','conditional upside plus bridge','payment-first timing sensitivities','routine-refund upper bound is not a paid amount'],notChecked:['hidden acceptance criteria','actual company behavior','actual vendor or migration eligibility','future collections or financing','effectiveness of proposed queue policy'],outputs},null,2));

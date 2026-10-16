import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../..');
const read=p=>fs.readFileSync(path.join(here,p));
const json=p=>JSON.parse(read(p));
const sha=b=>createHash('sha256').update(b).digest('hex');
const definitions=json('new-method-directory.json');
const target=path.join(root,'product/evidence/method-reviews/cohesive-v1');
assert(!fs.existsSync(target),'Preserve an existing bundled review');
// Parent runs only after reading and accepting the separate final review reports.
const a=json('review-a-v3-nietzsche/supplemental-final-bind.json');
const b=json('review-b-dirac/decision.json');
const d=json('review-d-laplace/repair-recheck-v1.json');
const ds=json('review-d-laplace/owner-metadata-supplement-v2.json');
assert.equal(b.decision,'ACCEPT_BODY_AND_METADATA_SNAPSHOT_PENDING_PARENT_RELEASE_CHECKS');
assert.equal(d.finalVerdict,'READY');assert.equal(ds.disposition,'READY_UNCHANGED_FOR_D5');
const bound={a:a.files.filter(x=>x.role==='A-method-or-original-owner').map(x=>({path:x.path,sha256:x.finalSha256})),b:b.reviewedFiles,d:ds.currentProductBindings};
for(const [lane,entries]of Object.entries(bound))for(const x of entries){
  // The A body review is already READY; its remaining metadata-only finding is
  // resolved separately at release. A later exact metadata observation does not
  // transfer substantive A acceptance from the D reviewer.
  const observation=lane==='a'&&x.path==='product/skills/eternities-beacon/skill.json'?bound.d.find(y=>y.path===x.path):x;
  assert.equal(sha(fs.readFileSync(path.join(root,x.path))),observation.sha256,'Reviewed input drift: '+x.path);
}
const copied=[
  ['review-a-v3-nietzsche/REVIEW.md','a-review.md'],
  ['review-a-v3-nietzsche/supplemental-final-bind.json','a-bindings.json'],
  ['review-b-dirac/review.md','b-review.md'],
  ['review-b-dirac/decision.json','b-decision.json'],
  ['review-d-laplace/REVIEW.md','d-review.md'],
  ['review-d-laplace/review.json','d-original-repair.json'],
  ['review-d-laplace/repair-recheck-v1.json','d-repair-recheck.json'],
  ['review-d-laplace/owner-metadata-supplement-v2.json','d-owner-bindings.json'],
];
for(const [source]of copied)assert(read(source).length>0);
const directory=JSON.parse(fs.readFileSync(path.join(root,'product/METHODS.v1.json'),'utf8'));
assert.equal(directory.methods.length,8,'Expected unchanged original selected directory');
const bindings=definitions.map(def=>{
  const p=`product/skills/${def.owner}/references/${def.file}`;
  const record=bound[def.reviewLane].find(x=>x.path===p);assert(record,'Missing independently reviewed method '+p);
  return {path:p,sha256:record.sha256,independentLane:def.reviewLane};
});
const receipt={schema:'cohesive-method-review-collation-v1',status:'independently-document-reviewed',authority:'none',activation:'none',scope:'Parent collation of separate non-author instruction reviews, not a new independent review, source-rights clearance or performance qualification.',reviewers:{a:'Nietzsche, not A author',b:'Dirac, not B author',d:'Laplace, not D author'},methodBindings:bindings,evidence:copied.map(([source,file])=>({file,sha256:sha(read(source)),repositorySource:source})),limits:['Three fictional consumer applications are reported separately.','Prior negative findings remain in repository evidence.','Digests establish byte identity, not reviewer identity or truth.']};
const receiptBytes=Buffer.from(JSON.stringify(receipt,null,2)+'\n');
const report=Buffer.from('# Cohesive method document review\n\nThe parent collated exact non-author reviews of seven A methods, one B method and five D methods. Read only a selected method in routine use; these records are optional publisher evidence.\n\n- [A review](a-review.md) and [exact final bindings](a-bindings.json).\n- [B review](b-review.md) and [decision](b-decision.json).\n- [D review](d-review.md), [original repair](d-original-repair.json), [resolution](d-repair-recheck.json) and [final owner bindings](d-owner-bindings.json).\n\nIndependent worked examples and bounded arithmetic/source checks accompany the reviews. They do not establish live company results, rendered visual quality, audible improvements, teaching outcomes, causal-estimator correctness, production savings or raw-agent superiority. The separate source authors and reviewers had product context; this was not a blind comparison. Historical workstation paths identify review sources and are not receiving-machine prerequisites.\n');
for(let i=0;i<definitions.length;i++){
  const def=definitions[i],binding=bindings[i];
  directory.methods.push({id:'cohesive-'+def.file.replace(/\.md$/,''),title:def.title,owner:def.owner,resource:binding.path.slice(8),resourceSha256:binding.sha256,tasks:[def.task],exclusions:[def.exclusion],documentStatus:'independently-document-reviewed',executionEvidence:'Separate non-author document review and bounded worked applications; see the linked review for exact checks and limitations. No general performance or live-domain result is asserted.',outcomeStatus:'not-performance-qualified',review:{scope:'Exact conditional method and owner integration reviewed separately from execution, adoption and performance.',receipt:'evidence/method-reviews/cohesive-v1/receipt.json',receiptSha256:sha(receiptBytes),report:'evidence/method-reviews/cohesive-v1/report.md',reportSha256:sha(report),resourceBinding:{pathPointer:`/methodBindings/${i}/path`,sha256Pointer:`/methodBindings/${i}/sha256`}}});
}
fs.mkdirSync(target,{recursive:true});
for(const [source,file]of copied)fs.writeFileSync(path.join(target,file),read(source),{flag:'wx'});
fs.writeFileSync(path.join(target,'receipt.json'),receiptBytes,{flag:'wx'});
fs.writeFileSync(path.join(target,'report.md'),report,{flag:'wx'});
fs.writeFileSync(path.join(root,'product/METHODS.v1.json'),JSON.stringify(directory,null,2)+'\n');
console.log(JSON.stringify({added:definitions.length,selectedMethods:directory.methods.length,reviewedFiles:Object.values(bound).reduce((n,x)=>n+x.length,0),receiptSha256:sha(receiptBytes)}));

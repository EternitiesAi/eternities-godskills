import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(here,'../../..');
const target=path.join(root,'product/evidence/method-reviews/cohesive-v1');
const sha=b=>createHash('sha256').update(b).digest('hex');
const receiptPath=path.join(target,'receipt.json'), reportPath=path.join(target,'report.md');
const directoryPath=path.join(root,'product/METHODS.v1.json');
const receipt=JSON.parse(fs.readFileSync(receiptPath)),directory=JSON.parse(fs.readFileSync(directoryPath));
const review=JSON.parse(fs.readFileSync(path.join(here,'review-a-final-nietzsche/review.json')));
const binding=JSON.parse(fs.readFileSync(path.join(here,'review-a-final-nietzsche/final-bind.json')));
assert.equal(review.disposition,'READY');
for(const x of binding.files)assert.equal(sha(fs.readFileSync(path.join(root,x.path))),x.sha256,x.path);
for(const x of receipt.evidence)assert.equal(sha(fs.readFileSync(path.join(target,x.file))),x.sha256,x.file);
const additions=[['REVIEW.md','a-final-review.md'],['review.json','a-final-decision.json'],['final-bind.json','a-final-bindings.json']];
assert(additions.every(([,file])=>!fs.existsSync(path.join(target,file))),'Do not replay a completed additive closure');
assert.equal(directory.methods.length,21);
const beforeOriginal=JSON.stringify(directory.methods.slice(0,8));
for(const [source,file] of additions){
  const repositorySource='review-a-final-nietzsche/'+source, bytes=fs.readFileSync(path.join(here,repositorySource));
  fs.writeFileSync(path.join(target,file),bytes,{flag:'wx'});
  receipt.evidence.push({file,sha256:sha(bytes),repositorySource});
}
receipt.finalAClosure={decision:'READY',decisionFile:'a-final-decision.json',bindingFile:'a-final-bindings.json',scope:review.scope};
const report=Buffer.from(fs.readFileSync(reportPath,'utf8')+'\n## Final A closure\n\nThe [final independent A review](a-final-review.md), [decision](a-final-decision.json) and [exact bindings](a-final-bindings.json) close the historical Beacon metadata finding. The earlier A review and bindings above are retained unchanged as historical evidence. This closure does not certify subsequent runtime revisions or comparative performance.\n');
const receiptBytes=Buffer.from(JSON.stringify(receipt,null,2)+'\n');
for(const row of directory.methods.slice(8)){
  assert.equal(row.review.receipt,'evidence/method-reviews/cohesive-v1/receipt.json');
  row.review.receiptSha256=sha(receiptBytes);row.review.reportSha256=sha(report);
}
assert.equal(JSON.stringify(directory.methods.slice(0,8)),beforeOriginal);
fs.writeFileSync(receiptPath,receiptBytes);fs.writeFileSync(reportPath,report);
fs.writeFileSync(directoryPath,JSON.stringify(directory,null,2)+'\n');
console.log(JSON.stringify({addedEvidence:additions.length,oldEvidencePreserved:receipt.evidence.length-additions.length,originalRowsPreserved:8,receiptSha256:sha(receiptBytes)}));

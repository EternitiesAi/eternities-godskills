import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const evidence='artifacts/qualification/cohesive-product-20261015';
const cases=JSON.parse(fs.readFileSync(evidence+'/new-method-discovery-cases.json','utf8'));
const before=JSON.parse(fs.readFileSync(evidence+'/new-method-discovery-baseline.json','utf8'));
const release=JSON.parse(fs.readFileSync('product/release.json','utf8'));
const rows=cases.map(c=>{
  const r=JSON.parse(execFileSync(process.execPath,['product/bin/godskills.mjs','search',c.query,'--limit','3'],{encoding:'utf8'}));
  assert.equal(r.activation,'none');assert.equal(r.authority,'none');
  const ids=r.results.map(x=>x.id);return {...c,ids,pass:ids.includes(c.owner),selection:r.selection};
});
assert.equal(rows.filter(x=>x.pass).length,13);
const report={releaseId:release.releaseId,cases:13,baselineTop3:before.filter(x=>x.pass).length,candidateTop3:rows.filter(x=>x.pass).length,rows,boundary:'Thirteen hand-selected task-wording cases frozen before metadata repairs; not general retrieval accuracy or semantic selection.'};
const output=process.argv[2]??'new-method-discovery-final.json';
assert(/^[a-z][a-z0-9-]+\.json$/.test(output),'Use a new local receipt name');
fs.writeFileSync(evidence+'/'+output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...report,rows:undefined}));

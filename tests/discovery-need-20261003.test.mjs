import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {searchCatalog, routeTask} from '../product/lib/product.mjs';

const catalog=JSON.parse(await readFile(new URL('../product/catalog.json',import.meta.url),'utf8'));

// Break: domain-word hits override the host's actual no-specialist decision.
test('host no-need facts suppress retrieval for arbitrary domain-rich requests',()=>{
  for(const query of ['Say goodnight to the robotics team.',
    'Alphabetize: invoice, memory, audio, research.',
    'Is the word architecture longer than game?',
    'Rename this title to Company Customer Support.']){
    const result=searchCatalog(catalog,query,{need:'none'});
    assert.deepEqual(result.results,[],query);
    assert.deepEqual(result.selection,{state:'abstain',basis:'host-supplied-no-need'},query);
    assert.equal(result.authority,'none');
    assert.equal(result.activation,'none');
  }
});

// Break: the default silently claims semantic applicability from lexical ranking.
test('retrieval without host need facts is explicitly undecided, never an activation',()=>{
  const result=searchCatalog(catalog,'Audit customer invoice totals across documents');
  assert.ok(result.results.length>0);
  assert.deepEqual(result.selection,{state:'review-required',basis:'lexical-candidates-only'});
});

// Break: accepting invalid need states silently downgrades or widens a route.
test('malformed host need facts fail instead of being ignored',()=>{
  for(const need of [null,true,'always','',{},[]]){
    assert.throws(()=>searchCatalog(catalog,'Research customer support',{need}),/need/i);
  }
});

// Break: a specialist request is mistaken for permission or guaranteed fit.
test('a host specialist decision still returns candidates to check against exclusions',()=>{
  const result=searchCatalog(catalog,'eternities-atlas',{need:'specialist',limit:1});
  assert.equal(result.results[0].id,'eternities-atlas');
  assert.deepEqual(result.selection,{state:'review-required',basis:'host-requested-specialist-candidates'});
  assert.equal(result.activation,'none');
});

// Break: route still exposes an eligible specialist subroute after no-need facts.
test('route respects no-need without erasing the independent connected-source facts',()=>{
  const result=routeTask(catalog,'Say thanks to the data team',{
    need:'none',inputScope:'open',connectedPurpose:'inventory',discovery:'not-prohibited'
  });
  assert.deepEqual(result.search.results,[]);
  assert.deepEqual(result.selection,{state:'abstain',basis:'host-supplied-no-need'});
  assert.deepEqual(result.atlas.connectedSource,{state:'hold',reason:'no-specialist-route-selected'});
  assert.equal(result.atlas.localAnalysisAvailable,true);
});

// Break: public commands ignore the new host contract while helper tests pass.
test('actual search and route callers carry no-need and reject invalid need flags',()=>{
  const bin=fileURLToPath(new URL('../product/bin/godskills.mjs',import.meta.url));
  for(const command of ['search','route']){
    const run=spawnSync(process.execPath,[bin,command,'Say hello to the revenue analytics team','--need','none'],{encoding:'utf8',windowsHide:true});
    assert.equal(run.status,0,run.stderr);
    const result=JSON.parse(run.stdout);
    const search=command==='route'?result.search:result;
    assert.deepEqual(search.results,[]);
    assert.equal(search.selection.state,'abstain');
    const invalid=spawnSync(process.execPath,[bin,command,'customer support','--need','always'],{encoding:'utf8',windowsHide:true});
    assert.notEqual(invalid.status,0);
    assert.match(invalid.stderr,/need/i);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {probe} from './helpers/quality-harness-lab.mjs';

// Source-pinned controls, portable across checkouts. The helper substitutes the CLI with fake
// children and creates only disposable synthetic evidence/configuration files.
const sourceRoot = new URL('../',import.meta.url);
for (const [path, expected] of [
  ['scripts/quality-evaluation-harness.mjs', '24736713cab1205891d8f466c82076f36c93536ca19c2e8af2bea9576359365e'],
  ['tests/helpers/quality-harness-lab.mjs', '84195803dbdd33f2f50ef12f154e7770b3e1fcd6a5aa3d06a39ad8175e95a638'],
]) assert.equal(createHash('sha256').update(readFileSync(new URL(path,sourceRoot))).digest('hex'), expected,
  'Frozen review source changed; do not run against an unreviewed version');

test('crash-left operation claim is preserved and dispatch remains held', () => {
  const result = probe(async lab => {
    await lab.run();
    const claim = lab.join(lab.options.operation, '.operation-claim');
    await lab.fs.mkdir(claim);
    const before = lab.calls.length;
    let error; try {await lab.run();} catch (e) {error = e.message;}
    return {error, calls: lab.calls.length - before, claimExists: (await lab.fs.stat(claim)).isDirectory()};
  });
  assert.match(result.error, /claim|reconcile/i);
  assert.deepEqual([result.calls, result.claimExists], [0, true]);
});

test('renaming a full ID with the same ordinal cannot relabel completed work', () => {
  const result = probe(async lab => {
    await lab.tasks(['q01-first','q02-second','q03-third','q04-fourth','q05-fifth','q06-sixth']);
    await lab.run();
    const fixture = JSON.parse(await lab.fs.readFile(lab.options.fixtures, 'utf8'));
    fixture.tasks[0].id = 'q01-renamed';
    await lab.put(lab.options.fixtures, fixture);
    const before = lab.calls.length;
    let error; try {await lab.run();} catch (e) {error = e.message;}
    return {error, calls: lab.calls.length - before};
  });
  assert.match(result.error, /manifest|identity|reconcile/i);
  assert.equal(result.calls, 0);
});

test('a later bad receipt blocks an earlier missing job before any dispatch', () => {
  const result = probe(async lab => {
    await lab.run();
    const first = lab.join(lab.options.operation, 'q01-skill');
    // This is a generated fake job, never a repository or live operation path.
    if (!first.startsWith(lab.root + '/operation/') && !first.startsWith(lab.root + '\\operation\\'))
      throw new Error('Synthetic target escaped its laboratory');
    await lab.fs.rm(first, {recursive: true, force: true});
    await lab.put(lab.join(lab.options.operation, 'q06-skill', 'events.jsonl'), 'CORRUPTED SYNTHETIC RECEIPT');
    const before = lab.calls.length;
    let error; try {await lab.run();} catch (e) {error = e.message;}
    return {error, calls: lab.calls.length - before};
  });
  assert.match(result.error, /receipt|reconcile/i);
  assert.equal(result.calls, 0);
});

test('an explicit final_answer settles and a second final answer does not', () => {
  const result = probe(async lab => {
    const start = [{type:'thread.started', thread_id:'synthetic'}, {type:'turn.started'}];
    const answer = {type:'item.completed', item:{id:'answer', type:'agent_message', phase:'final_answer', text:'SYNTHETIC RESPONSE'}};
    const end = {type:'turn.completed', usage:{input_tokens:12, output_tokens:3}};
    lab.control.stream = [...start, answer, end];
    const green = (await lab.run()).every(state => state.status === 'completed');
    lab.control.stream = [...start, answer, answer, end];
    let error; try {await lab.run({operation:lab.join(lab.root, 'duplicate-final-operation')});} catch (e) {error = e.message;}
    const summary = JSON.parse(await lab.fs.readFile(lab.join(lab.root, 'duplicate-final-operation', 'summary.json'), 'utf8'));
    return {green, error, invalid:summary.results.every(state => state.status === 'invalid'), count:summary.results.length};
  });
  assert.equal(result.green, true);
  assert.match(result.error, /invalid|uncertain/i);
  assert.ok(result.count > 0);
  assert.equal(result.invalid, true);
});

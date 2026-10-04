import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {test} from 'node:test';

const read = path => readFile(new URL('../product/skills/' + path, import.meta.url), 'utf8');

test('Beacon gates experimental machinery on a measurement question, not ordinary copy', async () => {
  const body = await read('eternities-beacon/SKILL.md');
  assert.match(body, /For measurement or market.performance interpretation, define metrics, eligible populations, denominators, windows, missingness, and attribution limits/);
  assert.match(body, /For a prospective intervention or optimization test, also predeclare baseline, intervention, primary and guardrail metrics, confounders, stop rule, and learning decision/);
  assert.match(body, /Existing cohort reporting need not invent an experiment/);
  assert.match(body, /Ordinary factual copy or positioning needs traceable claims/);
  assert.match(body, /metric definitions when applicable/);
  assert.match(body, /Never fill a sparse record with invented customer language/);
});

test('Muse scales acceptance without substituting a proxy for direct viewing', async () => {
  const body = await read('eternities-muse/SKILL.md');
  assert.match(body, /Scale acceptance evidence to the route and maturity/);
  assert.match(body, /For formal visual acceptance or release/);
  assert.match(body, /For early art direction or an exploratory prototype/);
  assert.match(body, /direct viewing and the applicable operability checks/);
  assert.match(body, /A generated mock or checklist is not observed visual acceptance/);
});

test('Arcadia lifecycle cases correspond to real features; absent required behavior stays a gap', async () => {
  const body = await read('eternities-arcadia/references/browser-runtime-lifecycle.md');
  assert.match(body, /Select cases from the actual implementation/);
  assert.match(body, /late settlement and failed-asset cases when asynchronous loads exist/);
  assert.match(body, /A required mechanism that is missing is a gap, not an out-of-scope case/);
  assert.match(body, /focus loss, visibility\/long resume and container resize/);
  assert.match(body, /A synthetic lifecycle fixture does not prove/);
});

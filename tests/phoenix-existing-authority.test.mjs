import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {test} from 'node:test';

const skill = new URL('../product/skills/eternities-phoenix/SKILL.md', import.meta.url);

test('Phoenix distinguishes existing scoped authority from a new decision', async () => {
  const body = await readFile(skill, 'utf8');
  assert.match(body, /existing authority explicitly covers the exact target and effect/);
  assert.match(body, /Do not request approval already supplied/);
  assert.match(body, /A new decision is needed only when/);
  assert.doesNotMatch(body, /explicit boundaries requiring another decision/);
});

test('Phoenix preserves unknown effects and continues independent authorized work', async () => {
  const body = await readFile(skill, 'utf8');
  assert.match(body, /unresolved precondition, material risk, or rollback gap/);
  assert.match(body, /an external effect is uncertain/);
  assert.match(body, /do not retry or compensate merely to resolve that uncertainty/);
  assert.match(body, /Continue independent authorized diagnosis, local repair, and tests/);
  assert.match(body, /local repair is not proof of production recovery/);
});

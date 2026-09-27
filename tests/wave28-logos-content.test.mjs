import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const skillPath = new URL('../product/skills/eternities-logos/SKILL.md', import.meta.url);
const methodsPath = new URL('../product/skills/eternities-logos/references/methods.md', import.meta.url);
const provenancePath = new URL('../product/skills/eternities-logos/skill.json', import.meta.url);

test('LOGOS distinguishes a supplied file from a supplied link and makes no converter claim', async () => {
  const [skill, methods] = await Promise.all([
    readFile(skillPath, 'utf8'),
    readFile(methodsPath, 'utf8')
  ]);

  for (const text of [skill, methods]) {
    assert.match(text, /A URL, URL list, or file containing only URLs is a locator, not the linked document/);
    assert.match(text, /does not fetch or inspect the target/);
  }
  assert.match(skill, /planning and review — DRAFT/);
  assert.match(methods, /not an executable converter/);
  assert.match(methods, /cannot establish or claim a successful conversion/);
});

test('the DRAFT method keeps all four fidelity lanes independent and evidence-bound', async () => {
  const methods = await readFile(methodsPath, 'utf8');
  const laneNames = ['Content', 'Structure', 'Appearance', 'Accessibility'];

  for (const lane of laneNames) {
    assert.ok(methods.includes('**' + lane + ':**'), 'missing separate ' + lane.toLowerCase() + ' lane');
  }
  assert.match(methods, /A plan alone leaves every outcome OPEN/);
  assert.match(methods, /A required OPEN or FAIL lane prevents acceptance/);
});

test('the method hands DOCX and slide checks to their named specialists and preserves source holds', async () => {
  const [methods, provenanceText] = await Promise.all([
    readFile(methodsPath, 'utf8'),
    readFile(provenancePath, 'utf8')
  ]);
  const provenance = JSON.parse(provenanceText);

  assert.match(methods, /docx-package-redline-and-render-verification/);
  assert.match(methods, /evidence-bound-slide-artifact-handoff/);
  assert.match(methods, /Muse/);
  const record = provenance.provenance.find((entry) =>
    entry.source === 'Wave26 b04 group 7: six distinct conversion-router source identities'
  );
  assert.ok(record, 'missing conversion-method source provenance');
  assert.match(record.note, /held for rights and access review/);
  assert.match(record.note, /not rights-cleared or independently accepted/);
});

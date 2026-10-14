import assert from 'node:assert/strict';

// Admit this literal, bounded metadata revision without rewriting either frozen
// catalog. Current behavioral regressions run on the current catalog; only the
// historical identity comparison receives this explicitly checked projection.
export function projectBeforeAtlasSuppliedDataRevision(skill, before) {
  if (skill.id !== 'eternities-atlas') return skill;
  assert.equal(before.id, skill.id);
  const fields = ['summary', 'triggers', 'antiTriggers'];
  const expected = {
    summary: 'Supplied export reconciliation: map columns, deduplicate records, and report rejected rows and conflicts. ' + before.summary,
    triggers: [
      ...before.triggers.slice(0, 3),
      'merge supplied exports', 'deduplicate records', 'column mapping',
      'row rejection audit', 'combine tables', 'merge spreadsheets',
      ...before.triggers.slice(3),
    ],
    antiTriggers: before.antiTriggers.filter(value => value !== 'without discovering or loading a connected source'),
  };
  assert.deepEqual(Object.fromEntries(fields.map(field => [field, skill[field]])), expected,
    'Only the declared Atlas supplied-data metadata revision is admitted');
  return {...skill, ...Object.fromEntries(fields.map(field => [field, before[field]]))};
}

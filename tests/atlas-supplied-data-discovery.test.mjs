import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchCatalog, routeTask} from '../product/lib/product.mjs';
import {projectBeforeAtlasSuppliedDataRevision} from './helpers/atlas-discovery-revision.mjs';
import {lexicalQueryEvidence, lexicalIntentMatch} from '../product/lib/discovery.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
const requests = [
  'We have two exports of customer records with different columns and duplicates. Make a clean merged dataset and explain which rows were rejected.',
  'Merge the supplied CSV exports, remove duplicate customers, and report invalid rows.',
  'Combine these tables with mismatched field names; retain provenance and show conflicting records.',
  'Reconcile both spreadsheets by account ID without discovering or loading a connected source.',
  'Consolidate the attached lists into one dataset, map the headers and explain rejected entries.',
  'Deduplicate the uploaded records, map column aliases and preserve source-row lineage.',
];

for (const query of requests) {
  test(`supplied-data candidate is discoverable: ${query}`, () => {
    const result = searchCatalog(catalog, query, {limit: 3});
    assert.ok(result.results.some(item => item.id === 'eternities-atlas'),
      result.results.map(item => item.id).join(', '));
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
    assert.equal(result.selection.state, 'review-required');
  });
}

test('supplied-data discovery follows capability metadata, not the owner ID', () => {
  const renamed = structuredClone(catalog);
  const item = renamed.skills.find(item => item.id === 'eternities-atlas');
  item.id = 'independent-data-method';
  const result = searchCatalog(renamed, requests[0], {limit: 3});
  assert.ok(result.results.some(item => item.id === 'independent-data-method'));
});

// These independent first-execution misses are now disclosed regressions,
// not held-out evidence after the repair is informed by them.
for (const query of [
  'Using the two order extracts attached, produce one order-level table. One file calls the identifier order_no and the other orderId; keep where each chosen cell came from and explain mismatches. Do the work entirely from these files.',
  'Turn the attached payroll-hours and timesheet exports into a comparison by staff code and week. Missing hours must remain unknown rather than zero. No other information is needed.',
]) test(`revealed supplied-data paraphrase: ${query}`, () => {
  const result = searchCatalog(catalog, query, {limit: 3});
  const found = result.results.find(item => item.id === 'eternities-atlas');
  assert.ok(found, result.results.map(item => item.id).join(', '));
  assert.ok(found.reasons.some(reason => reason.startsWith('Lexical intent: tabular reconciliation;')));
  assert.equal(result.authority, 'none');
  assert.equal(result.activation, 'none');
});

test('tabular reconciliation needs three cue families and owner metadata', () => {
  const evidence = lexicalQueryEvidence('Join two CSV tables on their customer keys and report null values.');
  assert.ok(evidence.intents.some(item => item.name === 'tabular reconciliation'));
  const owner = structuredClone(catalog.skills.find(item => item.id === 'eternities-atlas'));
  owner.id = 'renamed-capability';
  assert.ok(lexicalIntentMatch(owner, evidence).reasons.some(x => x.startsWith('Lexical intent: tabular reconciliation;')));
  owner.summary = 'Unrelated supplied-file inspection'; owner.triggers = ['tables'];
  assert.equal(lexicalIntentMatch(owner, evidence).score, 0);
});

for (const query of [
  'Please read these two CSV tables.',
  'Merge two branches and resolve conflicts.',
  'Tell me what a duplicate key means.',
  'Do not merge the two CSV exports on their customer keys; just describe the filenames.',
  'Never combine the supplied tables or deduplicate their rows.',
  'Rewrite "merge the CSV exports on their customer keys" in plain English.',
  'Last week we merged CSV exports by customer keys. Today write a thank-you note.',
  'Explain why a push notification was not delivered and reconcile broker acknowledgement',
]) test(`tabular reconciliation does not gain a new bonus: ${query}`, () => {
  assert.ok(!lexicalQueryEvidence(query).intents.some(item => item.name === 'tabular reconciliation'));
});

test('a local reconciliation candidate does not enable a connected-source method', () => {
  for (const context of [
    {inputScope: 'supplied-only', connectedPurpose: 'inventory', discovery: 'not-prohibited'},
    {inputScope: 'missing-input', connectedPurpose: 'fill-missing', discovery: 'prohibited'},
    {inputScope: 'sufficient', connectedPurpose: 'none', discovery: 'not-prohibited'},
  ]) {
    const result = routeTask(catalog, requests[3], {...context, need: 'specialist'}, {limit: 3});
    assert.equal(result.atlas.shortlisted, true);
    assert.equal(result.atlas.localAnalysisAvailable, true);
    assert.equal(result.atlas.connectedSource.state, 'rejected');
    assert.equal(result.search.authority, 'none');
    assert.equal(result.search.activation, 'none');
  }
  const unknown = routeTask(catalog, requests[0], {need: 'specialist'}, {limit: 3});
  assert.equal(unknown.atlas.shortlisted, true);
  assert.equal(unknown.atlas.connectedSource.state, 'hold');
});

test('host no-need and category/task filters still take precedence', () => {
  const none = routeTask(catalog, requests[0], {need: 'none'});
  assert.deepEqual(none.search.results, []);
  assert.equal(none.atlas.connectedSource.state, 'hold');
  assert.equal(none.selection.state, 'abstain');
  const atlas = catalog.skills.find(item => item.id === 'eternities-atlas');
  const otherCategory = catalog.skills.find(item => item.category !== atlas.category).category;
  assert.ok(!searchCatalog(catalog, requests[0], {category: otherCategory}).results.some(item => item.id === atlas.id));
  const unsupportedTask = catalog.skills.flatMap(item => item.taskTypes).find(task => !atlas.taskTypes.includes(task));
  assert.ok(unsupportedTask);
  assert.ok(!searchCatalog(catalog, requests[0], {taskType: unsupportedTask}).results.some(item => item.id === atlas.id));
});

test('removing a method-scoped prohibition preserves genuine owner exclusions', () => {
  const atlas = catalog.skills.find(item => item.id === 'eternities-atlas');
  assert.deepEqual(atlas.antiTriggers, [
    'production mutation without migration and rollback evidence',
    'credential handling',
    'unverified live-system reconciliation',
  ]);
  for (const exclusion of atlas.antiTriggers) {
    const result = searchCatalog(catalog, `${requests[0]} ${exclusion}`, {limit: 20});
    assert.ok(!result.results.some(item => item.id === atlas.id));
  }
});

test('the historical projection cannot hide unapproved Atlas metadata changes', async () => {
  const oldCatalog = JSON.parse(await readFile(new URL('./core2260-catalog.json', import.meta.url), 'utf8'));
  const before = oldCatalog.skills.find(item => item.id === 'eternities-atlas');
  const current = catalog.skills.find(item => item.id === before.id);
  for (const field of ['summary', 'triggers', 'antiTriggers']) {
    const changed = structuredClone(current);
    changed[field] = field === 'summary' ? 'Unapproved capability' : [];
    assert.throws(() => projectBeforeAtlasSuppliedDataRevision(changed, before));
  }
  const changed = {...current, maturity: 'unapproved-maturity'};
  assert.equal(projectBeforeAtlasSuppliedDataRevision(changed, before).maturity, 'unapproved-maturity',
    'Other fields must remain visible to the historical comparison');
});

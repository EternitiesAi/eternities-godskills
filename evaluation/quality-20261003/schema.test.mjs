import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const fixtures = JSON.parse(read('fixtures.json'));
const rubric = JSON.parse(read('rubric.json'));
const owners = [
  'voice-style-calibration', 'imaginative-concept-development',
  'interpersonal-understanding-and-dialogue', 'memory-retention-and-recovery',
  'completeness-and-consistency-audit', 'long-horizon-work-continuity',
];
// IDs checked against immutable baseline catalog metadata during authoring.
const knownIds = new Set([...owners, 'eternities-mnemosyne',
  'api-rate-limit-recovery', 'bounded-service-shutdown',
  'bounded-verified-object-ingestion', 'cashflow-forecast-scenario-integrity',
  'geospatial-coordinate-integrity', 'ecological-sampling-and-detection-uncertainty',
  'scientific-surrogate-validation', 'experiment-artifact-lineage',
  'interface-localization-and-bidirectionality', 'portable-speech-chunk-alignment',
  'jurisdiction-aware-contract-review', 'structured-output-contracts',
]);
const nonempty = value => assert.equal(typeof value === 'string' && value.trim().length > 0, true);
const unique = values => assert.equal(new Set(values).size, values.length);

test('six bounded tasks have flat inert evidence and matched plain-text contracts', () => {
  assert.equal(fixtures.schema, 'godskills-quality-fixtures-v1');
  assert.equal(fixtures.baselineCommit, '311dd839c273dffb3d994cfc9712374afac61624');
  assert.deepEqual(fixtures.outputContract, {
    format: 'plain final text', maxWords: 1800, toolsAllowed: false,
    externalEffectsAllowed: false, timeoutSeconds: 600,
  });
  assert.equal(fixtures.tasks.length, 6);
  unique(fixtures.tasks.map(task => task.id));
  fixtures.tasks.forEach((task, index) => {
    nonempty(task.query);
    nonempty(task.request);
    assert.deepEqual(task.skillIds, [owners[index]]);
    assert.match(task.request, /1800 words/);
    assert.match(task.request, /no tools/);
    assert.ok(Object.keys(task.files).length >= 2);
    for (const [name, contents] of Object.entries(task.files)) {
      assert.match(name, /^[a-z][a-z0-9-]*\.(txt|csv)$/);
      nonempty(contents);
      assert.ok(Buffer.byteLength(contents, 'utf8') <= 3500, name);
    }
    assert.equal(task.rubric.length, 4);
    unique(task.rubric.map(criterion => criterion.id));
    assert.equal(task.rubric.reduce((sum, criterion) => sum + criterion.points, 0), 100);
    for (const criterion of task.rubric) {
      nonempty(criterion.description);
      assert.ok(Number.isInteger(criterion.points) && criterion.points > 0);
      assert.equal(criterion.critical, false);
    }
    assert.equal(Object.hasOwn(task, 'key'), false);
    assert.equal(Object.hasOwn(task, 'expectedSolution'), false);
  });
});

test('private assessment keys match criteria and retain non-compensable failures', () => {
  assert.equal(rubric.schema, 'godskills-quality-rubric-v1');
  assert.equal(rubric.baselineCommit, fixtures.baselineCommit);
  assert.equal(rubric.tasks.length, 6);
  unique(rubric.tasks.map(task => task.id));
  for (const task of fixtures.tasks) {
    const key = rubric.tasks.find(entry => entry.id === task.id);
    assert.ok(key, task.id);
    assert.deepEqual(key.criteriaIds, task.rubric.map(criterion => criterion.id));
    assert.ok(key.key.length >= 4);
    key.key.forEach(nonempty);
    assert.ok(key.criticalFailures.length >= 2);
    unique(key.criticalFailures.map(failure => failure.id));
    key.criticalFailures.forEach(failure => nonempty(failure.description));
  }
});

test('30 fresh retrieval records distinguish positive routes from abstention controls', () => {
  assert.equal(fixtures.retrieval.length, 30);
  unique(fixtures.retrieval.map(entry => entry.id));
  unique(fixtures.retrieval.map(entry => entry.query));
  const positive = fixtures.retrieval.filter(entry => entry.kind === 'positive');
  const negative = fixtures.retrieval.filter(entry => entry.kind === 'negative');
  assert.equal(positive.length, rubric.retrievalAssessment.positiveCount);
  assert.equal(negative.length, rubric.retrievalAssessment.negativeCount);
  assert.equal(positive.length, 24);
  assert.equal(negative.length, 6);
  for (const entry of fixtures.retrieval) {
    nonempty(entry.query);
    assert.ok(['positive', 'negative'].includes(entry.kind));
    assert.ok(Array.isArray(entry.acceptableIds));
    unique(entry.acceptableIds);
    assert.equal(entry.acceptableIds.length > 0, entry.kind === 'positive');
    entry.acceptableIds.forEach(id => assert.ok(knownIds.has(id), id));
  }
  assert.equal(new Set(positive.flatMap(entry => entry.acceptableIds)).size, 19);
});

test('preregistration retains visibility, isolation, and finite sample boundaries', () => {
  const text = read('preregistration.md');
  for (const required of ['12 runs total', 'Six concurrent jobs maximum',
    '600-second', 'host-native', 'four factory system descriptions',
    'Do not mount the evaluation directory', 'No automatic retries',
    'no population-level significance or universal superiority claim']) {
    assert.ok(text.includes(required), required);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {lexicalIntentMatch, lexicalQueryEvidence} from '../product/lib/discovery.mjs';
import {searchCatalog} from '../product/lib/product.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));
const ownerId = 'evidence-linked-learning-design';
const intentName = 'learner-model explanation';
const owner = catalog.skills.find(item => item.id === ownerId);
assert.ok(owner, 'the pinned baseline contains the existing education owner');

const disclosedV1Failures = [
  ['beginner heat sliders', 'Teach beginners why a mug cools at different rates using sliders for surface area and insulation; have them predict and explain each change.'],
  ['novice balance-beam workshop', 'Plan a novice workshop where learners move weights on a balance beam and explain how position changes the turning effect.'],
  ['explorable queue lesson', 'Create an explorable lesson on waiting lines: learners alter arrival spacing and service time, then explain why a queue grows.'],
  ['movable fraction pieces', 'Help children understand equivalent fractions with movable pieces; ask them to rearrange the pieces and justify why the total stays the same.'],
  ['apprentice feedback model', 'For apprentice training, make an adjustable tank-and-valve model so trainees can explain why delayed feedback produces overshoot.'],
  ['binary-search trace', 'Teach new programmers why binary search discards an interval using an explorable trace they can pause, change and predict.'],
  ['paper-token conservation activity', 'Design a paper-token activity to teach conservation: learners move tokens among connected boxes and explain which changes preserve the total.'],
  ['prepared keyboard-controlled learning model', "Prepare a keyboard-controlled learning model of shared bandwidth so students can change demand and explain each user's resulting share."],
  ['unrelated purchase refusal with positive teaching request', 'Do not buy a hosted service. Teach novice gardeners why drainage changes soil moisture using an adjustable model and explanation prompts.'],
  ['scheduler training model', 'Train new schedulers to explain bottlenecks with a model whose capacity and load they can adjust.'],
  ['explorable ramp explanation', 'Teach learners why a ramp changes acceleration with an explorable explanation whose angle they can vary.'],
  ['pendulum lesson with renderer subtask', 'Design an adjustable pendulum lesson that teaches why period changes, and implement its browser renderer with reliable resize handling.'],
  ['single-quoted historical refusal with current affirmative request', 'The old ticket said \'Do not make a teaching demo.\' My current request is a learner-adjustable pressure model to teach why compression changes pressure.'],
];

const hasIntent = query => lexicalQueryEvidence(query).intents.some(profile => profile.name === intentName);
const hasReason = result => result.results.some(item => item.reasons.some(reason => reason.startsWith(`Lexical intent: ${intentName};`)));

// These exact sentences were disclosed as v1 failures. They are regressions, not held-out cases.
for (const [label, query] of disclosedV1Failures) {
  test(`disclosed v1 regression: ${label}`, () => {
    const result = searchCatalog(catalog, query, {limit: 5});
    assert.equal(result.results[0]?.id, ownerId,
      `Observed order: ${result.results.map(item => `${item.id} (${item.score})`).join(', ') || 'empty'}`);
    assert.ok(hasReason(result), 'the primary candidate must carry the new intent reason');
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  });
}

test('disclosed anti-trigger case recognizes the teaching request but still withholds the owner', () => {
  const query = 'Professional certification or guaranteed outcomes without appropriate evidence and qualified review: teach apprentices why flow changes with an adjustable valve model.';
  const evidence = lexicalQueryEvidence(query);
  assert.ok(evidence.intents.some(profile => profile.name === intentName));
  assert.equal(lexicalIntentMatch(owner, evidence).score, 60);
  const result = searchCatalog(catalog, query, {limit: 20});
  assert.ok(!result.results.some(item => item.id === ownerId), 'the catalog anti-trigger remains authoritative');
  assert.equal(result.authority, 'none');
  assert.equal(result.activation, 'none');
});

test('a quoted historical teaching request is data, not the current request', () => {
  const query = "Summarize this old note: 'Teach apprentices why flow changes with an adjustable valve model.'";
  assert.ok(!hasIntent(query));
});

test('direct refusal of the teaching-model task does not trigger the new intent', () => {
  const query = "Don't create a lesson for apprentices to explore why an adjustable valve model changes pressure; summarize the current status only.";
  assert.ok(!hasIntent(query));
});

test('a current affirmative clause after a direct refusal remains eligible', () => {
  const query = 'Do not create a lesson that explains why pressure changes in an adjustable model; instead, prepare a trainee workshop with a learner-controlled model to explore why pressure changes.';
  assert.ok(hasIntent(query));
  const result = searchCatalog(catalog, query, {limit: 5});
  assert.equal(result.results[0]?.id, ownerId);
  assert.ok(hasReason(result));
});

test('a downstream student audience and descriptive model report do not imply a teaching-design request', () => {
  const query = 'Summarize an engineering report for students. It explains why a valve model changed and lists adjustable settings; no lesson or training activity is requested.';
  assert.ok(!hasIntent(query));
});

test('an explanatory classroom goal without an explorable or manipulable artifact stays outside this profile', () => {
  const query = 'Teach apprentices why feedback delay changes overshoot using a plain static paragraph.';
  assert.ok(!hasIntent(query));
});

test('metadata-backed matching follows the matching owner if its identifier changes', () => {
  const renamed = {...owner, id: 'renamed-learning-route', entrypoint: 'skills/renamed-learning-route/SKILL.md'};
  const result = searchCatalog({...catalog, skills: [renamed]}, disclosedV1Failures[0][1], {limit: 1});
  assert.equal(result.results[0]?.id, 'renamed-learning-route');
  assert.ok(result.results[0]?.reasons.some(reason => reason.startsWith(`Lexical intent: ${intentName};`)));
});

test('a reference-only or unrelated-metadata decoy cannot receive learner-model intent', () => {
  const evidence = lexicalQueryEvidence(disclosedV1Failures[0][1]);
  const decoy = {
    ...owner,
    id: 'reference-only-decoy',
    category: 'operations',
    summary: 'Reconcile imported file inventories and compare delivery records.',
    triggers: ['repository inventory checks', 'file reference audits'],
    antiTriggers: [],
    taskTypes: ['verify'],
    related: [ownerId],
    resources: [{path: `skills/${ownerId}/SKILL.md`, sha256: '0'.repeat(64)}],
    entrypoint: 'skills/reference-only-decoy/SKILL.md',
  };
  assert.equal(lexicalIntentMatch(decoy, evidence).score, 0);
});

test('host need=none still abstains for an otherwise eligible learner-model request', () => {
  const result = searchCatalog(catalog, disclosedV1Failures[0][1], {need: 'none'});
  assert.deepEqual(result.results, []);
  assert.deepEqual(result.selection, {state: 'abstain', basis: 'host-supplied-no-need'});
  assert.equal(result.authority, 'none');
  assert.equal(result.activation, 'none');
});

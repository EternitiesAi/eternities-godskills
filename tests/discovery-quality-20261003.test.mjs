import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, cp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {buildProduct, searchCatalog} from '../product/lib/product.mjs';

const catalog = JSON.parse(await readFile(new URL('../product/catalog.json', import.meta.url), 'utf8'));

// Development examples and authored variations, never held-out evaluation.
// Break caught: isolated terms or audio synonyms outrank the actual task owner.
const developmentCases = [
  ['voice-style-calibration', 'make this sound like me without changing what actually happened'],
  ['interpersonal-understanding-and-dialogue', 'we keep talking past each other help me figure out what to say'],
  ['memory-retention-and-recovery', 'pick up where we left off but check whether the old notes are still right'],
  ['completeness-and-consistency-audit', 'what did we forget to deliver and which documents disagree'],
  ['long-horizon-work-continuity', 'finish this over the next few days and do not repeat a job that is already running'],
];

test('explicit refusal of written-voice adaptation does not outrank requested implementation comparison',()=>{
  const result=searchCatalog(catalog,'Do not rewrite in my voice; compare implementations and errors',{limit:3});
  assert.equal(result.results[0]?.id,'semantic-implementation-diff');
  assert.ok(result.results.every(x=>!x.reasons.some(r=>r.includes('written authorial voice'))));
});

test('a prohibition on factual invention does not suppress a separate positive written-voice request',()=>{
  const result=searchCatalog(catalog,'Do not invent facts; rewrite this in my own voice using the samples',{limit:3});
  assert.equal(result.results[0]?.id,'voice-style-calibration');
});
const variations = [
  ['voice-style-calibration', 'Rewrite this draft in my own voice and preserve the facts.'],
  ['voice-style-calibration', 'Use my writing samples to make this update read like something I would write.'],
  ['voice-style-calibration', "Adapt our announcement to the team's writing style without adding claims."],
  ['interpersonal-understanding-and-dialogue', 'Help us understand why we misunderstand each other before I reply.'],
  ['interpersonal-understanding-and-dialogue', 'Prepare a reply after a disagreement with my colleague, leaving room for their perspective.'],
  ['interpersonal-understanding-and-dialogue', 'We are not hearing each other; help me respond respectfully.'],
  ['memory-retention-and-recovery', 'Resume from the previous checkpoint after verifying that the saved decisions are still current.'],
  ['memory-retention-and-recovery', 'Before continuing our earlier task, reconcile outdated notes with current evidence.'],
  ['memory-retention-and-recovery', 'Recover the task from a handoff and verify which records have become stale.'],
  ['completeness-and-consistency-audit', 'Find promises we failed to deliver and contradictions between the documents.'],
  ['completeness-and-consistency-audit', 'Compare the requirements with what we shipped and identify missing items.'],
  ['completeness-and-consistency-audit', 'Check whether the README and implementation contradict each other about the promised outputs.'],
  ['long-horizon-work-continuity', 'Carry this project through several sessions and check any in-flight operation before retrying.'],
  ['long-horizon-work-continuity', 'Complete the remaining milestones this week without launching a duplicate of the active job.'],
  ['long-horizon-work-continuity', 'Keep working across interruptions until delivery, reconciling pending operations first.'],
];

for (const [id, query] of [...developmentCases, ...variations]) {
  test(`lexical task evidence ranks ${id} first: ${query}`, () => {
    const result = searchCatalog(catalog, query, {limit: 3});
    assert.equal(result.results[0]?.id, id,
      `Observed: ${result.results.map(item => `${item.id} (${item.score})`).join(', ') || 'no match'}`);
    assert.equal(result.authority, 'none');
    assert.equal(result.activation, 'none');
  });
}

// Break caught: a written-voice phrase inherits sound -> audio/DSP expansion.
test('written authorial voice does not manufacture an audio specialist match', () => {
  const result = searchCatalog(catalog, developmentCases[0][1], {limit: 20});
  assert.ok(!result.results.some(item => item.id === 'audio-dsp-integrity-review'));
  assert.ok(!result.results.some(item => item.id === 'eternities-orpheus'));
});

// Break caught: overlapping everyday language captures an established specialist.
for (const query of [
  'sample rate discontinuity in audio DSP',
  'What should I say about this audio plugin callback feedback instability?',
  'Check old notes about sample rate discontinuity in audio DSP',
  'We keep talking about sample rate changes in an audio plugin callback',
  'Finish the audio DSP feedback stability review over the next few days',
]) test(`concrete DSP evidence retains its specialist: ${query}`, () => {
  assert.equal(searchCatalog(catalog, query).results[0]?.id, 'audio-dsp-integrity-review');
});

// Break caught: an intent bonus bypasses the existing literal exclusion.
for (const [id, query] of [
  ['voice-style-calibration', 'Make this sound like me: one-off tone adjustment with no sample-based profile needed'],
  ['interpersonal-understanding-and-dialogue', 'We keep talking past each other; routine copy edit or ordinary small talk'],
  ['memory-retention-and-recovery', 'Pick up where we left off: simple lookup or routine status check'],
  ['completeness-and-consistency-audit', 'Find missing deliverables: ordinary typo correction'],
  ['long-horizon-work-continuity', 'Finish over several days: create scheduler or guarantee unattended execution'],
]) test(`explicit exclusion still removes ${id}`, () => {
  assert.ok(!searchCatalog(catalog, query, {limit: 20}).results.some(item => item.id === id));
});

// Break caught: broad resume, dialogue, or document cues swallow adjacent owners.
for (const [id, query] of [
  ['eternities-mnemosyne', 'Memory continuity after context compaction without rereading entire history'],
  ['eternities-logos', 'Frame a compelling article from canon while preserving source truth'],
  ['eternities-agora', 'Reconcile conflicting raise figures across pitch deck, memo, and investor update'],
  ['eternities-orpheus', 'Transcribe supplied dialogue audio and align caption timestamps to speakers.'],
]) test(`adjacent canonical owner remains discoverable: ${id}`, () => {
  assert.ok(searchCatalog(catalog, query, {limit: 3}).results.some(item => item.id === id));
});

// Break caught: task inference invents candidates for no evidence or short words.
test('unknown, stop-only and isolated conversational cues do not invent matches', () => {
  for (const query of ['zzqv xyzzq plorpf', 'please help me', 'talking say', 'days job', 'old right']) {
    assert.deepEqual(searchCatalog(catalog, query).results, [], query);
  }
});

// Break caught: phrase recognition depends on exact query bytes or casing.
test('case, Unicode width and punctuation preserve the lexical intent', () => {
  assert.equal(searchCatalog(catalog,
    'ＭＡＫＥ this SOUND, like me; without changing what actually happened!').results[0]?.id,
  'voice-style-calibration');
});

// Break caught: phrase support is an ID lookup instead of evidence in metadata.
test('phrase evidence follows a matching skill description even under another ID', () => {
  const original = catalog.skills.find(item => item.id === 'voice-style-calibration');
  const renamed = {...original, id: 'sample-informed-writing', entrypoint: 'skills/sample-informed-writing/SKILL.md'};
  const local = {...catalog, skills: [renamed]};
  assert.equal(searchCatalog(local, developmentCases[0][1]).results[0]?.id, 'sample-informed-writing');
  assert.deepEqual(searchCatalog({...catalog, skills: []}, developmentCases[0][1]).results, []);
});

// Break caught: phrase scoring overrides category/task filters or mutates input.
test('intent candidates obey filters and leave catalog evidence unchanged', () => {
  const before = structuredClone(catalog);
  const query = developmentCases[0][1];
  assert.equal(searchCatalog(catalog, query, {category: 'writing', taskType: 'communicate', limit: 1}).results[0]?.id,
    'voice-style-calibration');
  for (const options of [{category: 'audio'}, {taskType: 'build'}, {category: 'unknown-category'}]) {
    const result = searchCatalog(catalog, query, {...options, limit: 20});
    assert.ok(!result.results.some(item => item.id === 'voice-style-calibration'));
    for (const item of result.results) {
      if (options.category) assert.equal(item.category, options.category);
      if (options.taskType) assert.ok(item.taskTypes.includes(options.taskType));
    }
  }
  assert.deepEqual(catalog, before);
});

// Break caught: a phrase bonus steals an exact ID lookup or unstable ties depend
// on catalog input order rather than the public score/ID sorting contract.
test('exact IDs remain first and equal-score ties use stable ID order', () => {
  for (const item of catalog.skills) assert.equal(searchCatalog(catalog, item.id).results[0]?.id, item.id);
  const source = catalog.skills.find(item => item.id === 'voice-style-calibration');
  const tied = {...catalog, skills: ['zeta-option', 'alpha-option'].map(id => ({...source, id}))};
  const first = searchCatalog(tied, developmentCases[0][1]);
  assert.deepEqual(first.results.map(item => item.id), ['alpha-option', 'zeta-option']);
  assert.equal(first.results[0].score, first.results[1].score);
  assert.deepEqual(first, searchCatalog({...tied, skills: [...tied.skills].reverse()}, developmentCases[0][1]));
});

test('discovery preserves query and limit validation', () => {
  for (const query of ['', ' ', null, 'x'.repeat(4097)]) assert.throws(() => searchCatalog(catalog, query), /query/i);
  for (const limit of [0, 21, 1.5]) assert.throws(() => searchCatalog(catalog, 'voice', {limit}), /limit/i);
});

// Break caught: library behavior is repaired but the portable CLI cannot load
// its adjacent module or requires network/provider configuration. Rebuild only
// a temporary copy: tracked catalog/release artifacts belong to the parent.
test('rebuilt temporary portable pack exposes the repair through the offline CLI', async () => {
  const root = await mkdtemp(join(tmpdir(), 'godskills-discovery-quality-'));
  const pack = join(root, 'pack');
  await cp(new URL('../product/', import.meta.url), pack, {recursive: true});
  await buildProduct(pack);
  const result = spawnSync(process.execPath,
    [join(pack, 'bin/godskills.mjs'), 'search', developmentCases[0][1], '--limit', '1'],
    {cwd: root, encoding: 'utf8', windowsHide: true, env: {SystemRoot: process.env.SystemRoot ?? '', PATH: ''}});
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.results[0]?.id, 'voice-style-calibration');
  assert.match(output.method, /lexical/);
  assert.equal(output.authority, 'none');
  assert.equal(output.activation, 'none');
});

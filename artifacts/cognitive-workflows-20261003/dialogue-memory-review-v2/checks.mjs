// Read-only staged review and search preview. No build, product writes or fixture reads.
import assert from 'node:assert/strict';
import {readFile, lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname, resolve, relative, isAbsolute} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const readset = new Map();
async function read(path, role) {
  const bytes = await readFile(resolve(root, path));
  const prior = readset.get(path);
  readset.set(path, {path, sha256: sha256(bytes), bytes: bytes.length, roles: [...new Set([...(prior?.roles || []), role])]});
  return bytes;
}
const json = async (path, role) => JSON.parse((await read(path, role)).toString('utf8'));
const freezePath = 'artifacts/cognitive-workflows-20261003/candidate-freeze-v1.json';
const freeze = await json(freezePath, 'Frozen-v1 identity');
const frozenByPath = new Map(freeze.files.map(file => [file.path, file.sha256]));
const taxonomy = await json('product/taxonomy.json', 'Current product task/category schema');
const staged = {
  'product/skills/memory-retention-and-recovery/SKILL.md': {path: 'artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/SKILL.md', sha256: '36c14c3b62bdf72c2b12bf4678ec44223bd0c3064528a7f1b34d7df4fcc966e7'},
  'product/skills/memory-retention-and-recovery/references/examples.md': {path: 'artifacts/cognitive-workflows-20261003/repairs-v2/memory-retention-and-recovery/references/examples.md', sha256: 'e85739b8e8e517545d5862200f78e442dc23f59284f2e74751c7c39af8e5ece2'},
  'product/skills/interpersonal-understanding-and-dialogue/skill.json': {path: 'artifacts/cognitive-workflows-20261003/repairs-v2/interpersonal-understanding-and-dialogue/skill.json', sha256: '90bd0aeccbf30c9492d3e8db94c6f289bb52afdd3523231d6877d5988085bc36'}
};
const report = {
  schema: 'dialogue-memory-staged-review-checks-v2',
  evidence: 'Exact identity, composite product metadata/resource checks and read-only actual searchCatalog preview; no final build or behavioral fixture application',
  productWritten: false,
  frozenApplicationChanged: false,
  stage: [],
  compositeSkills: [],
  readset: []
};
const compositeBytes = new Map();
const targetIds = ['interpersonal-understanding-and-dialogue', 'memory-retention-and-recovery'];
const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const safeRel = path => typeof path === 'string' && path.length > 0 && !path.includes('\\') && !path.includes(':') && !path.startsWith('/') && path.split('/').every(part => part && part !== '.' && part !== '..' && !/[. ]$|[<>"|?*\x00-\x1f]/.test(part) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));

for (const file of freeze.files.filter(file => targetIds.some(id => file.path.startsWith(`product/skills/${id}/`)))) {
  const oldBytes = await read(file.path, 'Verify original target bytes remain frozen-v1; unchanged composite input');
  assert.equal(sha256(oldBytes), file.sha256, `Frozen-v1 changed: ${file.path}`);
  const replacement = staged[file.path];
  const bytes = replacement ? await read(replacement.path, 'Exact staged replacement; complete instruction/metadata inspection') : oldBytes;
  if (replacement) assert.equal(sha256(bytes), replacement.sha256, `Staged digest mismatch: ${replacement.path}`);
  compositeBytes.set(file.path, bytes);
  report.stage.push({logicalPath: file.path, physicalPath: replacement?.path || file.path, sha256: sha256(bytes), originalSha256: file.sha256, originalStillFrozen: true, changed: Boolean(replacement)});
}
assert.equal(report.stage.length, 6);

for (const id of targetIds) {
  const prefix = `product/skills/${id}/`;
  const meta = JSON.parse(compositeBytes.get(prefix + 'skill.json').toString('utf8'));
  assert.equal(meta.id, id);
  assert(idPattern.test(meta.id) && idPattern.test(meta.category));
  assert(taxonomy.categories.includes(meta.category));
  for (const key of ['category', 'summary']) assert(typeof meta[key] === 'string' && meta[key].trim().length > 0 && meta[key].length <= 1000);
  for (const key of ['triggers', 'antiTriggers', 'taskTypes', 'related', 'resources']) {
    assert(Array.isArray(meta[key]) && meta[key].every(value => typeof value === 'string' && value.length > 0 && value.length <= 500));
    assert.equal(new Set(meta[key]).size, meta[key].length);
  }
  assert(meta.triggers.length && meta.taskTypes.length);
  assert(meta.taskTypes.every(task => taxonomy.taskTypes.includes(task)));
  assert.equal(meta.maturity, 'draft', 'Stage must retain draft maturity');
  assert(meta.provenance.length && meta.provenance.every(source => ['kind', 'source', 'note'].every(key => typeof source[key] === 'string' && source[key].length > 0)));
  for (const resource of meta.resources) assert(safeRel(resource) && compositeBytes.has(prefix + resource));
  const paths = [...compositeBytes.keys()].filter(path => path.startsWith(prefix));
  assert(paths.length <= 100);
  assert.equal(new Set(paths.map(path => path.toLowerCase())).size, paths.length);
  for (const path of paths) {
    const physical = staged[path]?.path || path;
    assert((await lstat(resolve(root, physical))).isFile() && !(await lstat(resolve(root, physical))).isSymbolicLink());
    const text = compositeBytes.get(path).toString('utf8');
    assert(safeRel(path.slice(prefix.length)));
    assert(!/(?:[A-Z]:[\\/]\S|\\\\[^\s\\]+\\|\/(?:Users|home)\/[a-z][^\s/]*\/)/i.test(text));
    assert(!/\[TODO:|\bTBD\b/.test(text));
    if (path.endsWith('/SKILL.md')) {
      const front = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
      assert(front && new RegExp(`^name: ${id}$`, 'm').test(front[1]) && /^description: \S/m.test(front[1]));
    }
    if (path.endsWith('.md')) for (const link of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = link[1].split('#')[0];
      assert(!/^[a-z]+:/i.test(target));
      const logical = relative(root, resolve(root, dirname(path), target)).replaceAll('\\', '/');
      assert(!isAbsolute(logical) && logical.startsWith(prefix) && meta.resources.includes(logical.slice(prefix.length)) && compositeBytes.has(logical));
    }
  }
  for (const related of [...meta.related, ...(meta.specializes ? [meta.specializes] : [])]) assert(idPattern.test(related) && related !== id && (await lstat(resolve(root, 'product/skills', related, 'SKILL.md'))).isFile());
  const pins = [];
  for (const source of meta.provenance) {
    assert(source.source.startsWith('product/skills/') && safeRel(source.source));
    const expected = /SHA-256 ([0-9a-f]{64})\b/.exec(source.note)?.[1];
    const actual = sha256(await read(source.source, 'Recheck unchanged adopted source pin; full semantic inspection inherited from v1'));
    assert.equal(actual, expected, `Source changed: ${source.source}`);
    pins.push({path: source.source, sha256: actual, matched: true});
  }
  report.compositeSkills.push({id, metadataAndResourceDisposition: 'READY', category: meta.category, maturity: meta.maturity, taskTypes: meta.taskTypes, sourcePins: pins});
}

const oldDialogue = await json('product/skills/interpersonal-understanding-and-dialogue/skill.json', 'Compare exact targeted metadata changes');
const newDialogue = JSON.parse(compositeBytes.get('product/skills/interpersonal-understanding-and-dialogue/skill.json').toString('utf8'));
const intendedDialogue = structuredClone(oldDialogue);
intendedDialogue.taskTypes = intendedDialogue.taskTypes.map(task => task === 'review' ? 'verify' : task);
intendedDialogue.triggers.push('reflect participant statements while keeping motives tentative');
assert.deepEqual(newDialogue, intendedDialogue, 'Staged dialogue has changes beyond targeted repairs');
assert.deepEqual(newDialogue.antiTriggers, oldDialogue.antiTriggers);
report.dialogueChanges = {taskTypeReviewReplacedWithVerify: true, generalTriggerAdded: newDialogue.triggers.at(-1), allExclusionsUnchanged: true, allOtherMetadataUnchanged: true};

// Import the real offline search implementation. Neither import nor search invokes a builder.
await read('product/lib/product.mjs', 'Actual search/schema implementation; focused semantic inspection, full import bytes');
await read('product/lib/method-directory.mjs', 'Transitive local import; complete body inspected, no exported function invoked');
const {searchCatalog} = await import(pathToFileURL(resolve(root, 'product/lib/product.mjs')).href);
const current = await json('product/catalog.json', 'Authorized current catalog read for in-memory search preview only');
const draftMetaPaths = freeze.files.filter(file => file.path.endsWith('/skill.json')).map(file => file.path);
assert.equal(draftMetaPaths.length, 6);
const drafts = [];
for (const path of draftMetaPaths) {
  const bytes = await read(path, 'Six frozen draft metadata entries for preview; other four bodies not inspected');
  assert.equal(sha256(bytes), frozenByPath.get(path), `Preview draft changed: ${path}`);
  const meta = JSON.parse(bytes.toString('utf8'));
  drafts.push({...meta, entrypoint: `skills/${meta.id}/SKILL.md`, entrypointSha256: frozenByPath.get(`product/skills/${meta.id}/SKILL.md`)});
}
const draftIds = new Set(drafts.map(meta => meta.id));
const base = current.skills.filter(meta => !draftIds.has(meta.id));
const before = {...current, skills: [...base, ...drafts]};
const after = {...current, skills: before.skills.map(meta => meta.id === newDialogue.id ? {...meta, ...newDialogue} : meta)};
const query = 'reflect what participants said before assuming their motives';
const options = {limit: 3};
const frozenPreview = searchCatalog(before, query, options);
const stagedPreview = searchCatalog(after, query, options);
report.discoveryPreview = {
  query, limit: 3,
  currentCatalogSkillCount: current.skills.length,
  draftMetadataCount: drafts.length,
  previewSkillCount: after.skills.length,
  overlay: 'Current catalog plus six frozen draft metadata; only staged dialogue metadata replaces its frozen entry in the repaired preview',
  before: frozenPreview,
  after: stagedPreview,
  dialogueInFrozenTop3: frozenPreview.results.some(result => result.id === newDialogue.id),
  dialogueInStagedTop3: stagedPreview.results.some(result => result.id === newDialogue.id),
  stagedDialogueRank: stagedPreview.results.findIndex(result => result.id === newDialogue.id) + 1 || null,
  finalBuild: false,
  fullPreregisteredSuiteRerun: false,
  negativeSuiteRerun: false,
  claimLimit: 'One supplied positive query and exact unchanged-exclusion comparison; not semantic retrieval proof or full discovery acceptance'
};
report.structuralDisposition = 'READY';
report.discoveryQueryDisposition = report.discoveryPreview.dialogueInStagedTop3 ? 'READY' : 'REPAIR';
report.readset = [...readset.values()];
process.stdout.write(JSON.stringify(report, null, 2) + '\n');

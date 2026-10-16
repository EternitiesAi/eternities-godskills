import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const bytes = readFileSync(new URL('./usefulness-release-20261016-v1.json', import.meta.url));
assert.equal(digest(bytes), 'a0352d27933aaf7d59420cb9bea36747b65179ab7e69b33a64198f9e941d4756',
  'Named usefulness transition fixture drifted');
const revision = JSON.parse(bytes);

// Admit only the inspected current values before restoring their literal prior
// values. Unlisted fields remain visible to historical comparisons. Actual
// discovery behavior must continue to use the unprojected current catalog.
export function projectBeforeUsefulnessRelease20261016(skill) {
  const change = revision.changes.find(row => row.id === skill.id);
  if (!change) return skill;
  const projected = {...skill};
  for (const [field, values] of Object.entries(change.fields)) {
    assert.deepEqual(skill[field], values.after,
      `Only the declared usefulness-20261016 fields are admitted for ${skill.id}.${field}`);
    projected[field] = structuredClone(values.before);
  }
  return projected;
}

// The digest covers all 93 parsed records and the envelope in frozen key/array
// order, not just the five changed owners. No external baseline export is needed
// at test time; its exact byte and value identities are recorded in the fixture.
export function projectCatalogBeforeUsefulnessRelease20261016(catalog) {
  const projected = {...catalog, skills: catalog.skills.map(projectBeforeUsefulnessRelease20261016)};
  assert.equal(digest(JSON.stringify(projected)), revision.baseline.catalogValueSha256,
    'Catalog drift outside the named usefulness-20261016 transition');
  return projected;
}

// All eight appended rows, including tasks, exclusions and final review overlay,
// must match exactly. Provisional or alternative reviews are not admitted. The
// caller must still inspectMethodDirectory on the FULL current directory first
// to check real resource/receipt/report bytes and both resource-binding pointers.
export function projectDirectoryBeforeUsefulnessRelease20261016(directory) {
  assert.deepEqual(directory.methods.slice(revision.baseline.methodCount), revision.newMethods,
    'Only the declared usefulness-20261016 methods and exact final review bindings are admitted');
  const projected = {...directory, methods: directory.methods.slice(0, revision.baseline.methodCount)};
  assert.equal(digest(JSON.stringify(projected)), revision.baseline.methodDirectoryValueSha256,
    'Original 21 method rows and directory envelope must remain exact');
  return projected;
}

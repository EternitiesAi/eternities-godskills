import assert from 'node:assert/strict';

// Preserve frozen historical inputs; admit only this literal, reviewed revision.
// Current discovery tests still use the actual current catalog, never this projection.
export const assetIntegrationResource = {
  owner: 'eternities-arcadia',
  path: 'skills/eternities-arcadia/references/realtime-asset-integration.md',
  sha256: 'a56180e48130f2de6a513d67e67e256c60676a974d648070389430e134324b41',
};
export function projectBeforeArcadiaAssetRevision(skill, before) {
  if (skill.id !== 'eternities-arcadia') return skill;
  assert.equal(before.id, skill.id);
  const fields = ['summary', 'triggers', 'entrypointSha256', 'resources'];
  const expected = {
    summary: 'Connect game direction, imported 3D assets, runtime systems, player experience, accessibility, performance, and human release evidence.',
    triggers: [...before.triggers,
      'integrate imported glTF FBX meshes and models into Three.js Unity Unreal interactive scenes',
      'check mesh units scale coordinate axes pivot and material slots after import',
      'verify textures UV channels normal maps collision rigs animation and root motion in a game',
      'qualify model dependencies and decoder files in packaged builds beyond editor preview'],
    entrypointSha256: '9ec66ba0975124b95877f2ad0a852162008cfd624af2fe823d9752e478940c46',
    resources: [...before.resources, {path: assetIntegrationResource.path, sha256: assetIntegrationResource.sha256}],
  };
  assert.deepEqual(Object.fromEntries(fields.map(field => [field, skill[field]])), expected,
    'Only the declared Arcadia asset integration revision is admitted');
  return {...skill, ...Object.fromEntries(fields.map(field => [field, before[field]]))};
}

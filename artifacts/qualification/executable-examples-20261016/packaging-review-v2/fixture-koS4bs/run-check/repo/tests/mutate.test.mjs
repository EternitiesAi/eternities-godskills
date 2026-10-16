import test from 'node:test'; import fs from 'node:fs';
test('generated protected mutations', () => {
  for (const p of ["src/adaptive-activation.mjs","policies/adaptive-activation.v1.json","artifacts/adaptive-activation/evidence.v1.json"]) fs.writeFileSync(new URL('../' + p, import.meta.url), 'fixture after\n');
});

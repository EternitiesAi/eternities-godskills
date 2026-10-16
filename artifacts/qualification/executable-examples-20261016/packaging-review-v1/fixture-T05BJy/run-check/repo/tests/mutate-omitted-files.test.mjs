import test from 'node:test';
import fs from 'node:fs';
test('generated fixture changes files omitted by snapshot', () => {
  fs.writeFileSync(new URL('../src/adaptive-activation.mjs', import.meta.url), 'after\n');
  fs.writeFileSync(new URL('../policies/adaptive-activation.v1.json', import.meta.url), '{"after":true}\n');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('default checks include maintained tests without executing historical review artifacts', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const expected = 'node --test "tests/**/*.test.mjs" "examples/**/*.test.mjs" "evaluation/**/*.test.mjs" "product/**/*.test.mjs"';
  assert.equal(manifest.scripts.test, expected);
  assert.equal(manifest.scripts.check, expected);
  assert(!manifest.scripts.test.includes('artifacts'));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const guide = readFileSync(new URL("../product/README.md", import.meta.url), "utf8");
const normalizedGuide = guide.replace(/\s+/g, " ");

test("skill-level maturity does not accept explicitly DRAFT methods", () => {
  assert.match(normalizedGuide, /Instruction-reviewed:[\s\S]*skill-level maturity label/i);
  assert.match(normalizedGuide, /method explicitly marked DRAFT remains a proposal until separately reviewed and accepted/i);
  assert.match(normalizedGuide, /Bundling a DRAFT reference does not upgrade it/i);
  assert.match(normalizedGuide, /does not imply automatic selection, source rights, or operational validation/i);
});

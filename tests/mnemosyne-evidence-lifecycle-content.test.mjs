import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("lifecycle content is visibly DRAFT and distinct from ordinary lookup", async () => {
  const skill = await read("product/skills/eternities-mnemosyne/SKILL.md");
  const methods = await read(
    "product/skills/eternities-mnemosyne/references/methods.md",
  );

  assert.match(skill, /Local evidence-base lifecycle method \(DRAFT\)/);
  assert.match(
    skill,
    /Ordinary file\/path lookup and repository search remain ordinary retrieval work/,
  );
  assert.match(
    skill,
    /does not modify Mnemosyne's existing discovery metadata or established routes/,
  );
  assert.match(methods, /## Local evidence-base lifecycle \(DRAFT\)/);
  assert.match(
    methods,
    /A mention of an archive, policy, or evidence does not by itself establish lifecycle intent/,
  );
});

test("private-source approval and snapshot identity precede preservation", async () => {
  const methods = await read(
    "product/skills/eternities-mnemosyne/references/methods.md",
  );

  assert.match(
    methods,
    /obtain explicit approval from the user or responsible source owner before reading, snapshotting or copying, retaining, or reusing it/,
  );
  assert.match(methods, /exact revision or content hash/);
  assert.match(methods, /observation time/);
  assert.match(methods, /snapshot identifier and hash/);
  assert.match(methods, /a locator is not a snapshot/);
  assert.match(
    methods,
    /A path-only request remains lookup and produces no durable write or snapshot/,
  );
  assert.match(
    methods,
    /Reading or permission to access a source does not grant permission to write, retain a snapshot, or adopt its conclusions/,
  );
});

test("stale and contradictory evidence stays separate from adoption", async () => {
  const methods = await read(
    "product/skills/eternities-mnemosyne/references/methods.md",
  );

  assert.match(methods, /Retain superseded, stale, and contradictory records/);
  assert.match(methods, /a newer timestamp alone does not settle it/);
  assert.match(methods, /Preservation is not adoption/);
  assert.match(methods, /relevant instruction or governance owner/);
});

test("established Mnemosyne discovery metadata remains unchanged", async () => {
  const metadata = JSON.parse(
    await read("product/skills/eternities-mnemosyne/skill.json"),
  );

  assert.deepEqual(metadata.triggers, [
    "continuity recovery",
    "task checkpoint",
    "context budget",
    "memory design",
    "memory audit",
    "dependency graph",
  ]);
  assert.deepEqual(metadata.antiTriggers, [
    "routine recall",
    "simple status check",
    "nearby task treated as the same identity",
    "raw history replay",
  ]);
  assert.equal(Object.hasOwn(metadata, "intentProfile"), false);
  assert.equal(metadata.maturity, "instruction-reviewed");
});

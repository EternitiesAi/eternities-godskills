import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { searchCatalog } from "../product/lib/product.mjs";

const root = new URL("../", import.meta.url);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const catalog = await readJson("product/catalog.json");

test("serving-time feed ranking decisions discover Atlas from direct and paraphrased requests", () => {
  const prompts = [
    "Trace the serving-time recommendation ranking decision for this feed request: candidates, eligibility, feature and scorer revisions, exclusions, consent, and observed impression.",
    "Explain how eligible items were ordered in a home feed for one request, and distinguish a display request from a view that was actually observed.",
  ];

  for (const prompt of prompts) {
    const result = searchCatalog(catalog, prompt, { limit: 10 });
    assert.equal(result.results[0]?.id, "eternities-atlas", prompt);
    assert.equal(result.authority, "none");
    assert.equal(result.activation, "none");
  }
});

test("adjacent ranking tasks remain with their existing owners", () => {
  const cases = [
    [
      "Rerank retrieved search results for relevance, tune the retrieval stage, and measure a search reranker.",
      "retrieval-grounded-answering",
    ],
    [
      "Score business prospects from account evidence with weighted dimensions and a denominator.",
      "eternities-agora",
    ],
    [
      "Audit external app-store ranking and listing placement, not our in-app recommendation feed.",
      "app-store-discovery-experiments",
    ],
    [
      "Validate offline scientific model performance and generalization over selected and unselected candidates.",
      "scientific-surrogate-validation",
    ],
    [
      "Validate only JSON schema fields and unknown values for a ranking record; do not analyze or decide the ranking.",
      "structured-output-contracts",
    ],
  ];

  for (const [prompt, expectedOwner] of cases) {
    const result = searchCatalog(catalog, prompt, { limit: 10 });
    assert.equal(result.results[0]?.id, expectedOwner, prompt);
  }
});

test("Atlas exposes the method lazily and its DRAFT contract preserves the required boundaries", async () => {
  const [metadata, entrypoint, methods] = await Promise.all([
    readJson("product/skills/eternities-atlas/skill.json"),
    readFile(new URL("product/skills/eternities-atlas/SKILL.md", root), "utf8"),
    readFile(new URL("product/skills/eternities-atlas/references/methods.md", root), "utf8"),
  ]);
  const methodPath = "references/serving-time-ranking-decision-trace.md";
  const method = await readFile(
    new URL(`product/skills/eternities-atlas/${methodPath}`, root),
    "utf8",
  );

  assert.ok(metadata.triggers.some((trigger) => /serving.time|feed ranking|notification shortlist/i.test(trigger)));
  assert.ok(metadata.resources.includes(methodPath));
  assert.match(entrypoint, /serving.time ranking decision trace/i);
  assert.match(methods, /serving.time[- ]ranking[- ]decision[- ]trace/i);
  assert.match(method, /^# Serving-Time Ranking Decision Trace/m);
  assert.match(method, /DRAFT/);
  for (const required of [
    /named per.request/i,
    /candidate set/i,
    /hard eligibility/i,
    /feature.{0,30}(revision|version)/i,
    /scorer.{0,30}(revision|version)/i,
    /post.score constraints/i,
    /unknowns?/i,
    /privacy.{0,30}consent|consent.{0,30}privacy/i,
    /requested.{0,50}impression|impression.{0,50}requested/i,
    /replay.{0,60}reconcil|reconcil.{0,60}replay/i,
  ]) {
    assert.match(method, required);
  }
  for (const boundary of [
    /search rerank/i,
    /prospect scoring/i,
    /app.store/i,
    /offline scientific model/i,
    /schema.only/i,
    /does not establish.{0,100}(correctness|fairness|legal compliance|relevance)/is,
    /no provider.{0,40}network requirement|provider or network.{0,40}required/i,
  ]) {
    assert.match(method, boundary);
  }
});

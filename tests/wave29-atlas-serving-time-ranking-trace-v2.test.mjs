import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { searchCatalog } from "../product/lib/product.mjs";

const root = new URL("../", import.meta.url);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const catalog = await readJson("product/catalog.json");

test("a request-level serving trace stays discoverable in direct and paraphrased forms", () => {
  const prompts = [
    "For delivery attempt d-88, reconstruct the one notification shortlist decision before dispatch, including its pre-score eligibility rules, score tie-break, and final ordered candidates; do not diagnose delivery success.",
    "For request r-701, explain why the selected personalized recommendation collection differs from raw score order after applying the candidate cutoff and post-score diversity constraint.",
    "For one past serving choice, reconstruct the versioned list of ranked candidates and its scorer configuration; separate the historical result from the current version and leave a missing revision unknown.",
  ];

  for (const prompt of prompts) {
    const result = searchCatalog(catalog, prompt, { limit: 10 });
    assert.equal(result.results[0]?.id, "eternities-atlas", prompt);
    assert.equal(result.authority, "none");
    assert.equal(result.activation, "none");
  }
});

test("Atlas metadata does not displace delivery, offline-validation, schema, causal, or prospect routes", () => {
  const cases = [
    {
      prompt: "Explain why a push notification was not delivered and reconcile broker acknowledgement",
      expected: "eternities-daedalus",
    },
    {
      prompt: "Investigate a missing mobile alert after broker acceptance; reconcile durable send state, retry, and acknowledgement without analyzing shortlist selection.",
      expected: "eternities-daedalus",
    },
    {
      prompt: "Validate model generalization for recommendation ranking on held-out offline data",
      expected: "scientific-surrogate-validation",
    },
    {
      prompt: "Evaluate an offline recommendation model on a grouped holdout for leakage, calibration, and generalization; there is no live request or serving trace.",
      expected: "scientific-surrogate-validation",
    },
    {
      prompt: "Validate only the JSON schema for a stored ranking-decision record; do not reconstruct a serving decision.",
      expected: "structured-output-contracts",
      allowAtlasThird: true,
    },
    {
      prompt: "Judge whether a measured home-feed retention lift supports a causal claim; inspect randomization, exposure, confounders, uncertainty, and guardrails, not one serving request.",
      expected: "interatomic-model-validation",
      alsoAheadOfAtlas: "eternities-athena",
    },
    {
      prompt: "Score and prioritize prospective enterprise accounts by commercial fit and buying intent.",
      // Canonical main already ranks Prometheus first and misses Agora here;
      // this guard is specifically against the candidate's Atlas intrusion.
      expected: "eternities-prometheus",
    },
  ];

  for (const { prompt, expected, alsoAheadOfAtlas, allowAtlasThird } of cases) {
    const { results } = searchCatalog(catalog, prompt, { limit: 10 });
    const atlasIndex = results.findIndex((item) => item.id === "eternities-atlas");
    assert.equal(results[0]?.id, expected, prompt);
    if (!allowAtlasThird) {
      assert.ok(atlasIndex < 0 || atlasIndex >= 3, `${prompt}\nAtlas rank: ${atlasIndex + 1}`);
    } else {
      assert.notEqual(atlasIndex, 0, prompt);
    }
    if (alsoAheadOfAtlas) {
      const ownerIndex = results.findIndex((item) => item.id === alsoAheadOfAtlas);
      assert.ok(ownerIndex >= 0 && (atlasIndex < 0 || ownerIndex < atlasIndex), prompt);
    }
  }
});

test("the v2 lexical repair adds no owner-specific anti-trigger exceptions", async () => {
  const metadata = await readJson("product/skills/eternities-atlas/skill.json");
  assert.equal(
    metadata.antiTriggers.some((trigger) =>
      /notification|offline|schema.only|prospect|causal|retention lift/i.test(trigger),
    ),
    false,
  );
});

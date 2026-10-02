import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { searchCatalog } from "../product/lib/product.mjs";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(await readFile(new URL("product/catalog.json", root), "utf8"));

const search = (prompt) => searchCatalog(catalog, prompt, { limit: 10 });
const rankOf = (results, id) => results.findIndex((item) => item.id === id);
const assertAtlasDoesNotDisplace = (prompt, owner, minimumAtlasRank = 3) => {
  const results = search(prompt).results;
  const ownerRank = rankOf(results, owner);
  const atlasRank = rankOf(results, "eternities-atlas");

  assert.equal(results[0]?.id, owner, `${prompt}\nExpected ${owner} first`);
  assert.ok(
    atlasRank < 0 || atlasRank >= minimumAtlasRank,
    `${prompt}\nAtlas rank: ${atlasRank + 1}`,
  );
  assert.ok(atlasRank < 0 || ownerRank < atlasRank, `${prompt}\nAtlas precedes ${owner}`);
};

test("serving-time trace keeps its historical-version paraphrase discoverable", () => {
  const prompt =
    "For one past serving choice, reconstruct the versioned list of ranked candidates and its scorer configuration; separate the historical result from the current version and leave a missing revision unknown.";
  const { results, authority, activation } = search(prompt);
  const atlasRank = rankOf(results, "eternities-atlas");

  assert.ok(atlasRank >= 0 && atlasRank < 3, `Atlas rank: ${atlasRank + 1}`);
  assert.equal(authority, "none");
  assert.equal(activation, "none");
});

test("notification delivery reconciliation remains with Daedalus", () => {
  assertAtlasDoesNotDisplace(
    "Explain why a push notification was not delivered and reconcile broker acknowledgement",
    "eternities-daedalus",
  );
});

test("offline recommendation model generalization remains with the scientific validator", () => {
  assertAtlasDoesNotDisplace(
    "Validate model generalization for recommendation ranking on held-out offline data",
    "scientific-surrogate-validation",
  );
});

test("an offline grouped holdout without a serving trace does not promote Atlas", () => {
  assertAtlasDoesNotDisplace(
    "Evaluate an offline recommendation model on a grouped holdout for leakage, calibration, and generalization; there is no live request or serving trace.",
    "scientific-surrogate-validation",
  );
});

test("the prospect paraphrase does not promote Atlas over the existing route", () => {
  const prompt = "Score and prioritize prospective enterprise accounts by commercial fit and buying intent.";
  const results = search(prompt).results;
  const atlasRank = rankOf(results, "eternities-atlas");

  // Agora owns prospect assessment, though canonical main does not currently
  // make Agora the top result for this particular lexical paraphrase.
  assert.notEqual(results[0]?.id, "eternities-atlas", prompt);
  assert.ok(atlasRank < 0 || atlasRank >= 3, `${prompt}\nAtlas rank: ${atlasRank + 1}`);
});

test("the current prospect-assessment wording routes to Agora", () => {
  const prompt =
    "Prepare a prospect assessment for an enterprise account using commercial fit and buying intent.";
  assert.equal(search(prompt).results[0]?.id, "eternities-agora", prompt);
});

test("schema-only validation remains with structured-output-contracts", () => {
  const prompt =
    "Validate only the JSON schema for a stored ranking-decision record; do not reconstruct a serving decision.";
  const results = search(prompt).results;
  const atlasRank = rankOf(results, "eternities-atlas");

  assert.equal(results[0]?.id, "structured-output-contracts", prompt);
  assert.notEqual(atlasRank, 0, prompt);
});

test("aggregate causal appraisal does not promote Atlas over the evidence owners", () => {
  const prompt =
    "Judge whether a measured home-feed retention lift supports a causal claim; inspect randomization, exposure, confounders, uncertainty, and guardrails, not one serving request.";
  const results = search(prompt).results;
  const atlasRank = rankOf(results, "eternities-atlas");
  const athenaRank = rankOf(results, "eternities-athena");

  assert.equal(results[0]?.id, "interatomic-model-validation", prompt);
  assert.ok(athenaRank >= 0 && (atlasRank < 0 || athenaRank < atlasRank), prompt);
  assert.notEqual(atlasRank, 0, prompt);
});

test("aggregate feed analytics remains an Atlas parent route", () => {
  const prompt =
    "Build aggregate home-feed engagement analytics by day and cohort; report clicks and retention without item ordering or per-request traces.";

  // Discovery identifies the Atlas parent skill; it does not reveal which
  // Atlas method handles aggregate analytics versus the DRAFT trace.
  assert.equal(search(prompt).results[0]?.id, "eternities-atlas", prompt);
});

test("aggregate precommitted experiment design remains an Atlas parent route", () => {
  const prompt =
    "Design a precommitted randomized experiment for aggregate home-feed retention, including guardrails and stopping rules, not a single serving decision.";

  assert.equal(search(prompt).results[0]?.id, "eternities-atlas", prompt);
});

test("search reranking remains with retrieval-grounded answering", () => {
  const prompt =
    "Improve search result retrieval and rerank documents using query relevance, evidence coverage, and source attribution.";
  const results = search(prompt).results;
  const atlasRank = rankOf(results, "eternities-atlas");

  assert.equal(results[0]?.id, "retrieval-grounded-answering", prompt);
  assert.notEqual(atlasRank, 0, prompt);
});

test("external app-store placement remains with its discovery owner", () => {
  assertAtlasDoesNotDisplace(
    "Analyze external app-store placement and keyword ranking across storefronts, not an in-app feed.",
    "app-store-discovery-experiments",
  );
});

test("physics-constrained numerical validation remains with its specialist", () => {
  assertAtlasDoesNotDisplace(
    "Check dimensional consistency and numerical stability of a physics-constrained simulator used to compare recommendation scores; do not route or audit a live serving request.",
    "physics-constrained-numerical-validation",
  );
});

test("private-log lookup remains approval-bound with no authority or activation", () => {
  const prompt =
    "Connect to private per-user recommendation logs and prove why a named person saw an item; consent, purpose, retention, and access approval are unknown.";
  const { authority, activation } = search(prompt);

  assertAtlasDoesNotDisplace(prompt, "approval-bound-private-session-mining");
  assert.equal(authority, "none");
  assert.equal(activation, "none");
});

test("Athena retains the direct causal-appraisal route", () => {
  const prompt =
    "Appraise whether a study supports a causal inference; inspect the design, confounding, statistical analysis, and uncertainty.";
  assert.equal(search(prompt).results[0]?.id, "eternities-athena", prompt);
});

test("the Atlas search summary exposes the method DRAFT without changing parent maturity", () => {
  const prompt =
    "For delivery attempt d-88, reconstruct the one notification shortlist decision before dispatch, including its pre-score eligibility rules, score tie-break, and final ordered candidates; do not diagnose delivery success.";
  const atlas = search(prompt).results.find((item) => item.id === "eternities-atlas");

  assert.ok(atlas, "The bounded serving-time decision should discover Atlas");
  assert.match(atlas.summary, /new extension remains DRAFT/i);
  assert.equal(atlas.maturity, "instruction-reviewed");
});

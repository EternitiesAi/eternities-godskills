import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const productRoot = resolve(
  process.env.GODSKILLS_PRODUCT_ROOT ?? fileURLToPath(new URL("../product", import.meta.url)),
);
const baselineCatalogUrl = new URL("./core2260-catalog.json", import.meta.url);
const frozenCoreCatalogSha256 = "57d47c0a9692dc21caa0e7909ee6c557cd5ef5cc4e09b968df079cc81f86aecf";
// Preserve the exact historical 68-skill projection while explicitly admitting
// only the cognitive batch and the explicitly scoped October3 professional
// additions. Historical fixture bytes and all 68 core scoring fields stay exact.
const cognitiveSkillIds = [
  "completeness-and-consistency-audit",
  "imaginative-concept-development",
  "interpersonal-understanding-and-dialogue",
  "long-horizon-work-continuity",
  "memory-retention-and-recovery",
  "voice-style-calibration",
];
const professionalSkillIds = [
  "customer-support-triage-and-resolution",
  "structured-hiring-evaluation",
  "user-research-and-usability-study",
];
const admittedAdditionIds = [...cognitiveSkillIds, ...professionalSkillIds].sort();
const intentionalDiscoveryResource = {
  owner: "eternities-omnibus",
  path: "skills/eternities-omnibus/references/methods.md",
  sha256: "b9f125b0b5b53d6a9875f8ae597b316db37523b10ef872d3dcf69366916a7f5a",
};
const projectionFields = [
  "id",
  "category",
  "summary",
  "triggers",
  "antiTriggers",
  "taskTypes",
  "related",
  "specializes",
  "maturity",
];

function findRepositoryRoot(start) {
  let cursor = resolve(start);
  while (true) {
    if (existsSync(join(cursor, "package.json")) && existsSync(join(cursor, "product", "catalog.json"))) {
      return cursor;
    }
    const parent = dirname(cursor);
    if (parent === cursor) return null;
    cursor = parent;
  }
}

const repositoryRoot = process.env.GODSKILLS_REPOSITORY_ROOT
  ? resolve(process.env.GODSKILLS_REPOSITORY_ROOT)
  : findRepositoryRoot(testDirectory);

async function readText(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function extractFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  const end = lines.findIndex((line, index) => index > 0 && line === "---");
  assert.notEqual(end, -1, "frontmatter terminator exists");
  return lines.slice(0, end + 1).join("\n") + "\n";
}

function scoringProjection(skills) {
  return skills.map((skill) => Object.fromEntries(
    projectionFields.filter((field) => Object.hasOwn(skill, field)).map((field) => [field, skill[field]]),
  ));
}

function resourceIndex(skill) {
  return new Map((skill.resources ?? []).map((resource) => [resource.path, resource.sha256]));
}

function requires(section, caseId, rules) {
  assert.ok(section, caseId + ": required method section is missing");
  for (const rule of rules) assert.ok(rule.test(section), caseId + ": missing rule " + rule);
}

const [baselineBytes, methodsText, hermesText, hermesMetadataText, cursorText, cliText, mathText,
  mathMetadataText, mathMethodText, daedalusText, daedalusMetadataText, daedalusTestMethodText,
  optionalCiText] = await Promise.all([
  readFile(baselineCatalogUrl),
  readText(join(productRoot, "skills", "eternities-hermes", "references", "methods.md")),
  readText(join(productRoot, "skills", "eternities-hermes", "SKILL.md")),
  readText(join(productRoot, "skills", "eternities-hermes", "skill.json")),
  readText(join(productRoot, "skills", "eternities-hermes", "references", "cursor-paged-task-messages.md")),
  readText(join(productRoot, "skills", "eternities-hermes", "references", "truthful-cli-progress.md")),
  readText(join(productRoot, "skills", "symbolic-mathematics-python", "SKILL.md")),
  readText(join(productRoot, "skills", "symbolic-mathematics-python", "skill.json")),
  readText(join(productRoot, "skills", "symbolic-mathematics-python", "references", "source-grounded-math-specification.md")),
  readText(join(productRoot, "skills", "eternities-daedalus", "SKILL.md")),
  readText(join(productRoot, "skills", "eternities-daedalus", "skill.json")),
  readText(join(productRoot, "skills", "eternities-daedalus", "references", "test-design-and-evidence.md")),
  readText(join(productRoot, "skills", "eternities-daedalus", "references", "optional-model-scenarios-ci.md")),
]);
const baselineCatalog = JSON.parse(baselineBytes.toString("utf8"));
const hermesMetadata = JSON.parse(hermesMetadataText);
const mathMetadata = JSON.parse(mathMetadataText);
const daedalusMetadata = JSON.parse(daedalusMetadataText);
const hermesMethodText = [methodsText, cursorText, cliText].join("\n");
const fourNewResources = [
  {
    owner: "eternities-daedalus",
    path: "skills/eternities-daedalus/references/optional-model-scenarios-ci.md",
    sha256: "982db0a3b6811f7b7fde0fa6b31e06e3df0ed86bbf9dc9826209dc52877b61d8",
  },
  {
    owner: "eternities-hermes",
    path: "skills/eternities-hermes/references/cursor-paged-task-messages.md",
    sha256: "b3135e20f4ff67b3ac5593536eb4b14b59ff3d96608dc26090a6181862e6e2da",
  },
  {
    owner: "eternities-hermes",
    path: "skills/eternities-hermes/references/truthful-cli-progress.md",
    sha256: "d9bd1ebfd44178a4d33f0d1150b460aa4d6fa564177ea0ded1577ce4123c936c",
  },
  {
    owner: "symbolic-mathematics-python",
    path: "skills/symbolic-mathematics-python/references/source-grounded-math-specification.md",
    sha256: "edbbb063b3550619cfe216db64a96611c14839fcf61e2f24f13ca9d2ecebdb20",
  },
];

test("the immutable core2260 fixture is exact and all 68 scoring, relation, specialization, and maturity projections remain ordered", async () => {
  assert.equal(sha256(baselineBytes), frozenCoreCatalogSha256);
  const liveCatalog = JSON.parse(await readFile(join(productRoot, "catalog.json"), "utf8"));
  assert.equal(baselineCatalog.skills.length, 68);
  const baselineIds = new Set(baselineCatalog.skills.map((skill) => skill.id));
  const liveCore = liveCatalog.skills.filter((skill) => baselineIds.has(skill.id));
  assert.equal(liveCatalog.skills.length, 68 + admittedAdditionIds.length);
  assert.deepEqual(
    liveCatalog.skills.filter((skill) => !baselineIds.has(skill.id)).map((skill) => skill.id),
    admittedAdditionIds,
    "only the six cognitive and three scoped professional IDs are outside the frozen core",
  );
  assert.deepEqual(
    liveCore.map((skill) => skill.id),
    baselineCatalog.skills.map((skill) => skill.id),
    "skill membership and array order",
  );
  assert.deepEqual(scoringProjection(liveCore), scoringProjection(baselineCatalog.skills));
});

test("four historical new paths remain exact and only the scoped Omnibus discovery resource is revised", async () => {
  const liveCatalog = JSON.parse(await readFile(join(productRoot, "catalog.json"), "utf8"));
  const baselineById = new Map(baselineCatalog.skills.map((skill) => [skill.id, skill]));
  const liveById = new Map(liveCatalog.skills.map((skill) => [skill.id, skill]));
  const added = [];
  const removed = [];
  const changed = [];

  for (const baselineSkill of baselineCatalog.skills) {
    const liveSkill = liveById.get(baselineSkill.id);
    assert.ok(liveSkill, "missing catalog skill " + baselineSkill.id);
    const before = resourceIndex(baselineSkill);
    const after = resourceIndex(liveSkill);
    for (const [path, digest] of before) {
      if (!after.has(path)) removed.push(baselineSkill.id + ":" + path);
      else if (after.get(path) !== digest) changed.push(baselineSkill.id + ":" + path);
    }
    for (const [path, digest] of after) {
      if (!before.has(path)) added.push({ owner: liveSkill.id, path, sha256: digest });
    }
  }

  const sortResources = (items) => items
    .map((item) => [item.owner, item.path, item.sha256])
    .sort((a, b) => {
      const left = a.join("|");
      const right = b.join("|");
      return left < right ? -1 : left > right ? 1 : 0;
    });
  assert.deepEqual(sortResources(added), sortResources(fourNewResources));
  assert.deepEqual(removed, []);
  assert.deepEqual(changed, [intentionalDiscoveryResource.owner + ":" + intentionalDiscoveryResource.path]);
  assert.equal(resourceIndex(liveById.get(intentionalDiscoveryResource.owner)).get(intentionalDiscoveryResource.path), intentionalDiscoveryResource.sha256);
  assert.equal(sha256(await readFile(join(productRoot, intentionalDiscoveryResource.path))), intentionalDiscoveryResource.sha256);

  for (const resource of fourNewResources) {
    const bytes = await readFile(join(productRoot, resource.path));
    assert.equal(sha256(bytes), resource.sha256, resource.path);
    const metadata = JSON.parse(await readFile(join(productRoot, "skills", resource.owner, "skill.json"), "utf8"));
    const ownerRelativePath = resource.path.slice(("skills/" + resource.owner + "/").length);
    assert.ok(metadata.resources.includes(ownerRelativePath), resource.owner + " does not declare " + ownerRelativePath);
  }
});

test("Hermes and Math retain canonical-main frontmatter and Hermes ordinary workflow body", async () => {
  const canonicalHermesFrontmatter = [
    "---",
    "name: eternities-hermes",
    "description: Design and implement bounded automation or protocol integrations with explicit inputs, effects, failure handling, and close-out evidence.",
    "---",
    "",
  ].join("\n");
  const canonicalMathFrontmatter = [
    "---",
    "name: symbolic-mathematics-python",
    "description: Use when Python-based symbolic derivation or transformation needs explicit domains, assumptions, units, branch handling, singularity review, and independent numeric checks.",
    "---",
    "",
  ].join("\n");
  assert.equal(extractFrontmatter(hermesText), canonicalHermesFrontmatter);
  assert.equal(extractFrontmatter(mathText), canonicalMathFrontmatter);

  const withoutConditionalAddition = hermesText.replace(
    /\n## Conditional method references\n[\s\S]*?(?=## Working method)/,
    "\n",
  );
  assert.equal(
    sha256(Buffer.from(withoutConditionalAddition, "utf8")),
    "435d81f1cfaeea64ebb85ad9cd00d1dae22e8bde77edeaa9e009c315e7ce69ba",
    "removing only the conditional section must recover the canonical 55f Hermes entrypoint byte-for-byte",
  );
});

test("conditional method links remain with their owners and B04 is not a Hermes resource", async () => {
  const hermesResources = hermesMetadata.resources;
  assert.deepEqual(hermesResources, [
    "references/methods.md",
    "references/cursor-paged-task-messages.md",
    "references/truthful-cli-progress.md",
  ]);
  assert.match(hermesText, /## Conditional method references/);
  assert.match(hermesText, /Open only the matching reference/);
  assert.match(hermesText, /references\/cursor-paged-task-messages\.md/);
  assert.match(hermesText, /references\/truthful-cli-progress\.md/);
  assert.doesNotMatch(hermesText, /optional-model-scenarios-ci|source-grounded-math-specification/);
  assert.doesNotMatch(hermesResources.join("\n"), /optional-model-scenarios-ci|source-grounded-math-specification/);
  await assert.rejects(access(join(productRoot, "skills", "eternities-hermes", "references", "optional-model-scenarios-ci.md")));

  assert.ok(mathMetadata.resources.includes("references/source-grounded-math-specification.md"));
  assert.match(mathText, /references\/source-grounded-math-specification\.md/);
  assert.doesNotMatch(mathText, /references\/cursor-paged-task-messages\.md|references\/truthful-cli-progress\.md/);

  assert.ok(daedalusMetadata.resources.includes("references/optional-model-scenarios-ci.md"));
  assert.ok(daedalusMetadata.resources.includes("references/test-design-and-evidence.md"));
  assert.match(daedalusText, /optional model scenarios outside required CI/i);
  assert.match(daedalusText, /references\/test-design-and-evidence\.md/);
  assert.doesNotMatch(daedalusText, /references\/cursor-paged-task-messages\.md|references\/truthful-cli-progress\.md|source-grounded-math-specification/);
});

test("the selected-method directory binds exactly the four new owner methods and their exclusions", async () => {
  const liveCatalog = JSON.parse(await readFile(join(productRoot, "catalog.json"), "utf8"));
  const { inspectMethodDirectory, renderMethodDirectory } = await import(
    pathToFileURL(join(productRoot, "lib", "method-directory.mjs")).href
  );
  const directory = await inspectMethodDirectory(productRoot, liveCatalog);
  assert.deepEqual(directory.methods.map((method) => method.id), [
    "hermes-running-task-message-checkpoint",
    "hermes-authorized-local-process-observation",
    "math-supplied-prose-specification-draft",
    "daedalus-optional-model-scenario-ci",
    "arcadia-game-state-audio-cues",
    "atlas-serving-time-decision-trace",
    "oracle-artifact-role-evidence",
    "mnemosyne-local-evidence-lifecycle",
  ]);

  const expectedNewMethods = [
    {
      id: "hermes-running-task-message-checkpoint",
      owner: "eternities-hermes",
      resource: "skills/eternities-hermes/references/cursor-paged-task-messages.md",
      resourceSha256: "b3135e20f4ff67b3ac5593536eb4b14b59ff3d96608dc26090a6181862e6e2da",
      tasks: ["Keep up with new messages from an authorized still-running task using a saved position instead of reloading the whole history"],
      exclusions: ["Not warehouse or table ingestion, durable conversation-memory summarization, decoding bytes within one response, or authority to cancel a task"],
    },
    {
      id: "hermes-authorized-local-process-observation",
      owner: "eternities-hermes",
      resource: "skills/eternities-hermes/references/truthful-cli-progress.md",
      resourceSha256: "d9bd1ebfd44178a4d33f0d1150b460aa4d6fa564177ea0ded1577ce4123c936c",
      tasks: ["Report the state of an already-authorized local command while preserving its output channels and showing progress only from validated signals"],
      exclusions: ["Not visual-only progress UI, accessibility announcements, schema-only producer-event design, or new process launch or cancellation authority"],
    },
    {
      id: "math-supplied-prose-specification-draft",
      owner: "symbolic-mathematics-python",
      resource: "skills/symbolic-mathematics-python/references/source-grounded-math-specification.md",
      resourceSha256: "edbbb063b3550619cfe216db64a96611c14839fcf61e2f24f13ca9d2ecebdb20",
      tasks: ["Turn supplied prose with stated mathematical relations into a source-linked specification draft, leaving unknown units, domains and conflicts for separate review"],
      exclusions: ["Not prose-only outlines, qualitative interview extraction, coordinate or unit-value validation, source-truth appraisal, or solving an already-declared equation"],
    },
    {
      id: "daedalus-optional-model-scenario-ci",
      owner: "eternities-daedalus",
      resource: "skills/eternities-daedalus/references/optional-model-scenarios-ci.md",
      resourceSha256: "982db0a3b6811f7b7fde0fa6b31e06e3df0ed86bbf9dc9826209dc52877b61d8",
      tasks: ["Keep explicitly optional live-model scenarios separate from mandatory deterministic CI while retaining paid-provider and required-acceptance gates"],
      exclusions: ["A required live or paid acceptance test is not optional; this method does not authorize provider calls or qualify CI or merge configuration"],
    },
  ];
  const projection = (method) => ({
    id: method.id,
    owner: method.owner,
    resource: method.resource,
    resourceSha256: method.resourceSha256,
    tasks: method.tasks,
    exclusions: method.exclusions,
  });
  const addedIds = new Set(expectedNewMethods.map((method) => method.id));
  assert.deepEqual(
    directory.methods.filter((method) => addedIds.has(method.id)).map(projection),
    expectedNewMethods,
  );

  const rendered = renderMethodDirectory(directory);
  assert.equal(await readFile(join(productRoot, "METHODS.v1.md"), "utf8"), rendered);
});

test("Daedalus owns optional model scenarios without weakening deterministic required checks", async () => {
  assert.match(optionalCiText, /^# Optional model scenarios outside required CI \(DRAFT\)/);
  assert.match(optionalCiText, /required run makes zero provider calls/i);
  assert.match(optionalCiText, /fails closed if a call is attempted/i);
  assert.match(optionalCiText, /separate command or job that is disabled by default/i);
  assert.match(optionalCiText, /explicit maintainer authorization/i);
  assert.match(optionalCiText, /missing result is not a pass/i);
  assert.match(optionalCiText, /hand the exact repository revision and CI\/policy files to Herald/i);
  assert.match(daedalusText, /When a task introduces variable-output or potentially paid model scenarios/i);

  assert.ok(repositoryRoot, "could not locate the live repository root for required-script checks");
  const packageJson = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8"));
  assert.equal(packageJson.scripts.test, "node --test");
  assert.equal(packageJson.scripts.check, "node --test");
  assert.doesNotMatch(packageJson.scripts.test + " " + packageJson.scripts.check, /optional-model-scenarios-ci/);
});

const frozenHermesCases = [
  ["C01", cursorText, [
    /append-only|version(?:ed|ing) snapshot/i,
    /(?:cursor|continuation).*task-scoped/is,
    /exact.*service-returned.*(?:cursor|continuation)|service-returned.*exact/i,
    /deduplicat\w+.*stable event (?:ID|identity)/i,
    /(?:atomic|together).*messages?.*checkpoint|messages?.*checkpoint.*(?:atomic|together)/is,
    /sparse.*(?:ID|sequence|number)/i,
    /page.*(?:limit|ceiling)/i,
  ]],
  ["C02", cursorText, [
    /follow.*(?:running )?task.*message history/i,
    /durable checkpoint/i,
    /without (?:re-?fetching|downloading).*full\s+history/is,
  ]],
  ["C03", cursorText, [
    /caught up.*task status|task status.*caught up/is,
    /empty.*(?:page|response|interval).*not.*(?:completion|terminal)/is,
    /later.*messages?.*checkpoint/is,
  ]],
  ["C04", cursorText, [
    /final (?:feed )?watermark/i,
    /continue.*(?:bounded )?(?:read|page|fetch).*watermark/is,
    /without.*(?:watermark|drain guarantee).*?(?:unknown|incomplete)/is,
  ]],
  ["C05", cursorText, [
    /commit.*messages?.*checkpoint.*(?:atomic|together)|commit.*(?:atomic|together).*messages?.*checkpoint/is,
    /crash.*replay|replay.*crash/is,
    /never.*(?:derive|manufacture|invent).*cursor.*(?:largest|event|sequence)/is,
  ]],
  ["C06", cursorText, [
    /append-only.*(?:edit|reorder|late)/is,
    /undocumented.*(?:revision|snapshot|reconciliation)|(?:revision|snapshot|reconciliation).*undocumented/is,
    /checkpoint expires.*(?:documented|resynchron|stop|incomplete)/is,
    /previous.*checkpoint/i,
  ]],
  ["C07", cursorText, [
    /does not.*parse.*byte chunks/i,
    /single (?:open )?response/i,
  ]],
  ["C08", cursorText, [
    /stop.*local polling|local polling.*stop/is,
    /remote cancellation.*separate.*(?:authority|authorization)|separate.*remote cancellation.*(?:authority|authorization)/is,
    /cancellation\s+request.*not.*settlement|request.*not.*cancellation settlement/is,
  ]],
  ["R01", cursorText, [
    /read authority.*(?:caller|current)|(?:caller|current).*read authority/is,
    /identifier.*not.*(?:permission|authority)|cached.*(?:token|identifier).*not.*(?:permission|authority)/is,
  ]],
  ["R02", cursorText, [
    /read.*permission.*local.*(?:retention|persistence)|local.*(?:retention|persistence).*separate.*read/is,
    /authority.*not.*(?:transfer|inherit)|not.*(?:transfer|inherit).*authority/is,
  ]],
  ["L01", cliText, [
    /invocation-bound.*structured progress|structured.*progress.*invocation/i,
    /observed.*(?:phase|count)/i,
    /valid numerator.*stable denominator|numerator.*denominator/is,
    /preserve.*child.*stdout.*stderr/is,
    /redirected.*(?:quiet|opt-in|separate)/i,
  ]],
  ["L02", cliText, [
    /process.*(?:alive|liveness)/i,
    /no progress reported/i,
    /do not guess.*(?:phase|percentage|ETA)/is,
    /elapsed time.*(?:not|never).*progress/is,
  ]],
  ["L03", cliText, [
    /stdout.*(?:byte|machine-readable).*(?:unchanged|identical|preserve)|(?:unchanged|identical).*stdout/is,
    /stderr.*(?:child|reserved)/i,
    /redirected.*ANSI|ANSI.*redirected/is,
    /status channel.*(?:separate|opt-in)|(?:separate|opt-in).*status channel/is,
  ]],
  ["L04", cliText, [
    /process exit.*application result|application result.*process exit/is,
    /zero process exit.*(?:not|unless)/is,
    /application-result validation as[\s\S]{0,100}(?:not-performed|unknown)/i,
  ]],
  ["L05", cliText, [
    /cancellation request.*settlement|request.*settlement.*cancellation/is,
    /descendant.*(?:resource|settle|cleanup)/i,
    /deadline.*(?:unknown|unconfirmed)/is,
    /cancel(?:led|lation).*only after.*evidence/is,
  ]],
  ["L06", cliText, [
    /reader.*(?:fail|failure).*degraded|monitor.*degraded/is,
    /do not.*(?:kill|restart|relaunch)/is,
    /late.*event.*(?:close-out|terminal).*receipt/is,
    /owned.*handle/i,
    /sequence gaps?.*do not interpolate|do not interpolate.*sequence gaps?/is,
    /bound.*event size.*queue|event size.*queue.*limit/is,
  ]],
  ["L07", cliText, [
    /Muse/i,
    /visual.*accessibility|accessibility.*visual/is,
    /does not.*(?:launch|observe).*process/is,
  ]],
  ["E01", hermesMethodText, [
    /fixture.*(?:only|declared).*contract|fixture proves only/is,
    /producer-reported.*not.*(?:verified )?work/is,
    /service.*compatibility.*(?:separate|exact)|platform.*evidence/is,
  ]],
];

for (const [caseId, section, rules] of frozenHermesCases) {
  test("frozen Hermes body case " + caseId + " retains its declared conformance boundary", () => {
    requires(section, caseId, rules);
  });
}

const optionalCiCases = [
  ["default path", [/required.*deterministic/is, /default.*(?:off|disabled)|opt-in.*default.*(?:off|disabled)/is, /no provider calls|zero provider calls/i, /fail-fast guard/i, /block provider egress|deny provider egress/i]],
  ["separate merge lane", [/separate command or job.*disabled by default/is, /explicit maintainer authorization/i, /merge.*(?:required|protected)|required.*merge/i, /optional.*(?:not|required).*merge|merge.*optional.*not/is]],
  ["behavior-based classification", [/classif\w+.*(?:behavior|external call)|(?:behavior|external call).*classif\w+/is, /broad discovery|wildcard/i]],
  ["bounded and attributable run", [/stable ID/i, /model.*(?:provider|version)|provider.*model/is, /fixture.*identity|fixture version/i, /(?:call|invocation).*limit/i, /(?:spend|cost).*?(?:limit|unknown)/is]],
  ["separate result states", [/completed.*failed.*skipped.*incomplete/is, /missing.*optional.*not.*pass|not run.*not.*pass/is, /separate.*result|result.*separate/is]],
  ["uncertain request recovery", [/uncertain.*(?:request|send)|(?:request|send).*uncertain/is, /do not.*(?:automatically )?(?:retry|rerun)|no automatic.*(?:retry|rerun)/is]],
  ["no duplicate policy and exact selection audit", [/exactly one execution class/i, /explicit required and optional ID lists/i, /missing, duplicate, and newly discovered IDs/i]],
  ["evidence limits", [/model.*scenario.*(?:does not|cannot).*certif|scenario.*not.*(?:product validation|model quality)|synthetic.*not.*(?:product|model quality)/is]],
];

for (const [name, rules] of optionalCiCases) {
  test("Daedalus optional CI placement contract: " + name, () => requires(optionalCiText, "Daedalus optional CI", rules));
}

test("frozen candidate validates locally without executing its scenarios", async () => {
  const result = spawnSync(
    process.execPath,
    [join(productRoot, "bin", "godskills.mjs"), "validate"],
    { cwd: productRoot, encoding: "utf8", timeout: 15000 },
  );
  assert.equal(result.error, undefined, "candidate validation CLI launches");
  assert.equal(result.status, 0, result.stderr);
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.status, "verified-content");
  const releaseManifest = JSON.parse(await readFile(join(productRoot, "release.json"), "utf8"));
  const { verifyProduct } = await import(
    pathToFileURL(join(productRoot, "lib", "product.mjs")).href
  );
  const verifiedManifest = await verifyProduct(productRoot);
  assert.deepEqual(
    verifiedManifest,
    releaseManifest,
    "verifyProduct checks actual release membership, file hashes, catalog coverage, and skill metadata",
  );
  assert.equal(releaseManifest.schema, "eternities-godskills-release-v1");
  assert.equal(validation.releaseId, releaseManifest.releaseId);
  assert.equal(validation.skillCount, releaseManifest.skillCount);
  assert.equal(releaseManifest.skillCount, 68 + admittedAdditionIds.length);
});

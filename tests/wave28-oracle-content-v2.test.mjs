import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = process.env.ORACLE_CONTENT_ROOT
  ? resolve(process.env.ORACLE_CONTENT_ROOT)
  : fileURLToPath(new URL("../", import.meta.url));
const entrypoint = readFileSync(
  resolve(root, "product/skills/eternities-oracle/SKILL.md"),
  "utf8",
);
const methods = readFileSync(
  resolve(root, "product/skills/eternities-oracle/references/methods.md"),
  "utf8",
);

function assertExactTargetApprovalRule() {
  assert.ok(
    /completed approval act attributed to the person/.test(methods),
    "formal approval must be a completed act attributed to the named person",
  );
  assert.ok(
    /object is the exact selected artifact\/version/.test(methods),
    "the approval act must name the exact selected artifact/version as its object",
  );
}

test("direct report-approval question requires an attributed act on the exact report version", () => {
  assert.ok(/Who approved the report\?/.test(methods), "direct approval wording must be explicitly covered");
  assertExactTargetApprovalRule();
});

test("paraphrased final sign-off question uses the same exact artifact/version binding", () => {
  assert.ok(/Who gave final sign-off on version 3\?/.test(methods), "paraphrased sign-off wording must be explicitly covered");
  assert.ok(/same target-bound object test/.test(methods), "paraphrase must receive the same object-level test");
  assertExactTargetApprovalRule();
});

test("approval of access is not formal approval of the artifact", () => {
  assert.ok(/approval of access[^\n]*different act[^\n]*not artifact approval/i.test(methods), "access approval must be identified as a different act");
});

test("approval of a create-or-change request is not artifact approval", () => {
  assert.ok(/approval of a request to create or change[^\n]*different act[^\n]*not artifact approval/i.test(methods), "request approval must be identified as a different act");
});

test("approval to distribute the artifact is not artifact approval", () => {
  assert.ok(/approval to distribute[^\n]*different act[^\n]*not artifact approval/i.test(methods), "distribution approval must be identified as a different act");
});

test("author and reviewer claims stay bound to the same selected artifact/version", () => {
  assert.ok(/author, reviewer, or approver claim[^\n]*exact selected artifact\/version/i.test(methods), "each role claim must bind to the selected artifact/version");
  assert.ok(/byline[^\n]*selected artifact\/version/i.test(methods), "authorship evidence must be for the selected version");
  assert.ok(/formal reviewer[^\n]*role-bearing record[^\n]*same artifact\/version/i.test(methods), "formal reviewer designation must be tied to that artifact/version");
  assert.ok(/invitation, attendance list, mention, or edit permission alone supports only association/.test(methods), "invitation or attendance alone is not formal review evidence");
});

test("ambiguous versions stay unresolved and newer off-target reports remain rejected", () => {
  assert.ok(/ask which version is meant rather than silently choosing one/.test(methods), "do not choose among plausible versions silently");
  assert.ok(/newer off-target document is not a substitute/.test(methods), "newer evidence about another target cannot substitute");
});

test("content remains DRAFT and conveys no connector, private-access, rights, or routing authority", () => {
  assert.ok(/DRAFT artifact-role evidence method \(content v2\)/.test(entrypoint), "entrypoint must retain the method's DRAFT status and identify v2 content");
  assert.ok(/^## Artifact-role evidence \(DRAFT\)$/m.test(methods), "the method itself remains explicitly DRAFT");
  assert.ok(/Content revision: v2/.test(methods), "method content version must be explicit");
  assert.ok(/does not create a connector, grant private-source access, or confer copy, retention, or reuse rights/i.test(methods), "content grants no connector, private access, or source rights");
  assert.ok(/does not change trigger, search, or routing behavior/i.test(methods), "content creates no search or routing change");
});

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
function pinnedJson(file,sha256){
  const bytes=readFileSync(new URL(file,import.meta.url));
  assert.equal(digest(bytes),sha256,`Named historical compatibility input drifted: ${file}`);
  return JSON.parse(bytes);
}
// Explicit release transition, not a replacement historical fixture. Every
// changed field must match its declared current value before it is projected.
// Unlisted fields pass through so the original deep comparisons still reject
// unrelated drift. Behavioral tests continue to use the unprojected catalog.
export const cohesiveRevision=pinnedJson('./nietzsche-cohesive-catalog-v1.json','ebbc172fafd80a092402f124c800239130dc12d55ef2fb7694f4ad5d06ca1b7a');
export function projectBeforeCohesiveProduct20261015(skill){
  const revision=cohesiveRevision.changes.find(row=>row.id===skill.id);
  if(!revision)return skill;
  const projected={...skill};
  for(const [field,values]of Object.entries(revision.fields)){
    assert.deepEqual(skill[field],values.after,`Only the declared cohesive-product-20261015 fields are admitted for ${skill.id}.${field}`);
    projected[field]=structuredClone(values.before);
  }
  return projected;
}

export const historicalMethodDirectory=pinnedJson('./nietzsche-method-directory-before-cohesion.json','412b4272987b119ba3edf1a9df44aeb75d6b372a90f1bdeabe92c5834bd5265d');
export function assertSelectedDirectoryEvolution(directory){
  const oldIds=new Set(historicalMethodDirectory.methods.map(row=>row.id));
  assert.equal(new Set(directory.methods.map(row=>row.id)).size,directory.methods.length,'Duplicate method identity');
  assert.deepEqual(directory.methods.filter(row=>oldIds.has(row.id)),historicalMethodDirectory.methods,'Original selected-method rows must remain exact');
  const added=directory.methods.filter(row=>!oldIds.has(row.id));
  assert.deepEqual(added.map(({id,owner,resource,resourceSha256})=>({id,owner,resource,resourceSha256})),cohesiveRevision.newMethods,'Only the independently bound cohesive methods are admitted');
  for(const row of added){
    assert.equal(row.documentStatus,'independently-document-reviewed');
    assert.equal(row.outcomeStatus,'not-performance-qualified');
    assert.ok(row.review?.receipt&&row.review?.report&&row.review?.resourceBinding,'New method requires its own review binding');
  }
  // inspectMethodDirectory, called by the consumer test before this helper,
  // verifies actual body/review bytes and both receipt JSON pointers.
}

// v4 changed runtime selection semantics, while these literal negative receipts
// retain v3's envelope label. Admit exactly this version transition; preserve
// every other field, result, score and reason for the old deep equality check.
export function projectDiscoveryV4ToHistoricalV3(result){
  assert.equal(result.method,'offline-lexical-intent-phrases-v4','Unexpected current discovery version');
  return {...result,method:'offline-lexical-intent-phrases-v3'};
}

// Parent-approved current explanation for Dirac's restored renderer admission.
// Keep the old gold intact and add this exact expectation only to its pinned
// E2-N03 baseline. Never strip reasons from the runtime result or other cases.
export const rendererAdmissionReasonV4='Lexical intent: game or real-time 3D runtime scope; cues: game or technical 3D context, independent work action or reported fault';
export function expectedEducationalLiteralAfterRuntimeAdmissionV4(caseId,baseline){
  if(caseId!=='E2-N03')return baseline;
  assert.equal(digest(JSON.stringify(baseline)),'73f57b95459143c0d10ed3711cd873069970f2e5cc6546c8d490bc9490ec5ddb','E2-N03 historical literal must remain exact');
  const expected=structuredClone(baseline);
  expected.results[4].reasons.push(rendererAdmissionReasonV4);
  return expected;
}

export const maintainedTestCommand='node --test "tests/**/*.test.mjs" "examples/**/*.test.mjs" "evaluation/**/*.test.mjs" "product/**/*.test.mjs"';
export const historicalAdaptivePackage=pinnedJson('./nietzsche-adaptive-package-input-v1.json','538531951004f100fd557066ebb274306847f38ba514f4333f735b0dccd9b773');
export function assertMaintainedScopePackageRevision(current){
  assert.equal(current.scripts.test,maintainedTestCommand);
  assert.equal(current.scripts.check,maintainedTestCommand);
  assert.deepEqual({...current,scripts:{...current.scripts,test:historicalAdaptivePackage.scripts.test,check:historicalAdaptivePackage.scripts.check}},historicalAdaptivePackage,'Package drift outside the named maintained-scope revision');
}

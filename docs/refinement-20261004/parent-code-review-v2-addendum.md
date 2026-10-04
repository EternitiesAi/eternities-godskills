# Parent-code review v2 addendum

Delta disposition: **READY** for the Atlas/relocated-documentation test adjustment.
Cumulative parent-code disposition: **REPAIR** because PARENT-FM-001 and
PARENT-FM-002 in the preserved v1 review remain unresolved in unchanged parser bytes.

This addendum is an independent non-author review by author B. It does not replace
or erase the v1 findings or the parent's recorded failed old prose assertion.

Baseline: `dc704536875cda166f7ab784bce28f3c2b54ae0c`.
Input manifest: `C:/Users/Dom/.codex/operations/godskills-refinement-20261004/parent-review-input-v2.json`.
Manifest SHA-256: `80138ad1883a74728f1ab410bf0c8c304d294bbff9ec00825af9cdec31ec5236`.

All six manifest file hashes match. The five prior hashes are unchanged.
The added test file SHA-256 is `41c3698c41c6912c1ca407bedf53566b3f831220698de811e7a098c0c3b2feaa`.
Preserved v1 JSON receipt SHA-256: `ba1f7b5eaae9e4bacb2f2aea2ab1c8b7b3b49fe5ce2289344b35c5e8b9d4949f`.

## Contract review

The full modified test and Atlas entrypoint/connector reference were read, along
with the README/DISCOVERY bodies previously reviewed. The test diff was compared
with the pinned baseline. Prompt arrays, catalog search calls, result-inclusion
and supplied-only exclusion assertions, `authority: none`, `activation: none`,
and connector-state/rights assertions are unchanged. Only document loading and
five prose-location/wording assertions changed.

The new Atlas clause still requires skipping connected-source discovery when
supplied inputs suffice or the user disallows it, even when Atlas is shortlisted.
Its route definition still requires a genuine connected-source question and
explicitly denies a default preflight or load permission. The unchanged connector
card separately requires metadata authority, bounded probe authority, exact load
scope, active-input evidence, named-run consumption and identity-specific rights.
Thus the new catalog-match sentence is supported by the full surrounding contract,
rather than being accepted merely because it matches a replacement regex.

The old README detail was relocated, not deleted. The revised test checks the
explicit README link and the corresponding DISCOVERY limitation: negated wording
may still shortlist Atlas, lexical matching is not permission, and local analysis
remains available. Complete selected-entrypoint reading/applicability review is
still stated in README. The shift preserves the old warning while making its
conditional location discoverable.

Atlas candidate SHA-256: `46b06bdd11e52ca6288b32bd720a77715035b5e77a2b52ba1b986a071df18700`.
Connector reference SHA-256: `97c83c5bb00914211d05eb784e1ff42efe5efa24cd1e4f1d9ec21d793c26a003`.

## Evidence and limits

No new critical, important or minor finding is identified in this test delta.
The Atlas supplied-input/permission contract is preserved in the inspected bytes.
The negative old literal-test result remains historical evidence of a wording
mismatch; it is not evidence of lost permission boundaries by itself.

The modified Atlas test was **not executed**: execution authority in this review
was limited to the new focused frontmatter tests, whose 19 passes are recorded in
v1. This addendum establishes static contract preservation, not a routing-run pass,
semantic-classifier qualification or native-loader validity. The two parser
findings still require parent repair and a fresh exact manifest.

No product/test/candidate file was edited by the reviewer. Only this addendum and
its receipt are written; cross-cohort review and the four fixed consumer cases
remain separate work.

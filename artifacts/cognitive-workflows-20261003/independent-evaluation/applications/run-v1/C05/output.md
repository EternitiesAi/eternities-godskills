# C05 application: Hold attendee-export acceptance

The delivery is incomplete against AC1. The most consequential defects are
unauthorized attendee transfer, a wrong CSV schema that includes email, and
unblocked invalid-input downloads. Six checklist headings and the supplied green
receipts cannot establish the required outcomes.

Scope: inspection of the supplied E01-E07, P01-P06, V01-V04, G01-G04, and B01-B04
fragments only, at their C05 fixture identity. This is audit-only. I executed no
snippet, changed no requirement or code, and performed no merge/release. An
unquoted guard, encoding choice, storage operation, or accessibility behavior is
unknown rather than presumed present or absent.

## Obligation map

| Obligation / acceptance signal | Located content and agreement | Evidence disposition / limit |
| --- | --- | --- |
| R1: UTF-8 CSV, exactly display_name,session_code,access_needs; no email | E01 uses display_name,session_code,email. E03 serializes those columns. V02 expects the same wrong header; G01 promises a different schema. | Contradicted: access_needs is missing and email is exported by the supplied serializer. UTF-8 emission remains unknown: no emitted-file capture or encoding check (B04). |
| R2: either missing required field prevents download; field errors capped at five | E06 checks display_name only. P01 caps the error list at five, and error objects name a field. P02 and P04 call download without a shown validation guard. G02 asserts both fields block it. | Contradicted for validation/blocking in the inspected fragments. Cap is supported by inspection; exact field-message rendering is unknown because renderError is not supplied. V03 proves only one validator case, not an invalid download. |
| R3: keyboard activation and readable status; drag optional | P02 is a real button route distinct from P04 drag. P03 is an aria-live error list. P05 says success is only a decorative green circle. | Button/error-announcement fragments exist. Success status conflicts with the readable-status outcome as described; actual keyboard activation/readout remains unverified (B03 mouse only, B04). Do not infer every keyboard route fails. |
| R4: supplied rows only; no network or persistent attendee storage, including fallbacks | P06 sends JSON.stringify(rows) to /support/export-debug in its error path. G03 says attendee details never reach a server. No persistence or upstream source implementation is supplied. | Direct network/attendee-transfer contradiction. Persistence and exclusive upstream row source remain unknown; neither is invented from absence. No fallback execution is authorized for this audit. |
| R5: honest docs about valid/invalid behavior and tested scope | G01-G03 contradict E01/E06/P02/P04/P06. G04 claims full desktop/mobile accessibility and implies green is sufficient success feedback. B03 records a mouse click, not keyboard use; B04 excludes mobile evidence. | Contradicted/unsupported claims. Desktop keyboard-check status is not yet established; mobile is untested. Merely editing docs to claim a keyboard pass would still fail honesty. |
| R6: valid emitted contents, blocked invalid download, keyboard exercise | V02 checks the wrong header; V03 checks a helper; V04 mocks download and does not render the panel. B01/B02 report build/unit success; B03 reports a mouse happy path. | Required end-to-end outcome evidence is missing (B04). Existing assertions do not distinguish the delivery defects. The reported green checks have not been independently rerun here. |

Inspection counterexample: a row with `display_name='Sample A'` and an empty
`session_code` produces no E06 error; neither shown trigger conditions its
download on validity. For V01's valid fixture, E01-E03 imply the header
`display_name,session_code,email` and row
`Sample A,S1,fixture@example.invalid`, dropping the supplied `step-free` access
need. These are deductions from quoted code, not executed output captures.

## Bounded repair and verification order

1. Implementation owner: remove the P06 attendee/network fallback and inspect
   related fallback paths for the same R4 boundary. A distinguishing check should
   trigger error handling while asserting no network or persistent attendee writes;
   perform it in an authorized isolated fixture, never by sending real attendees.
2. Implementation owner: align E01/E03 to R1, including access_needs and no email;
   validate both fields and gate both button and drag download paths. Preserve the
   five-error cap and meaningful field linkage. Trace these changes into V02/V03
   and G01/G02, not just the documentation.
3. UI owner: provide readable success status and retain the button route and error
   announcements. Verify keyboard activation and status on the actual panel;
   a decorative circle cannot supply that evidence.
4. Verification owner: capture and inspect the emitted UTF-8 CSV for V01 against
   AC1's exact header and row content; exercise missing display_name and missing
   session_code through each trigger and confirm no download; exercise keyboard
   activation/readout. Check the error cap with multiple invalid rows. Update stale
   tests against AC1, not against the current defective output.
5. Documentation owner: align G01-G04 with repaired and actually verified behavior.
   Record desktop keyboard scope only after its real check and explicitly leave
   mobile untested unless new evidence arrives. Acceptance owner then reopens the
   affected R1-R6 rows using those receipts; this report does not merge or release.

Preserve the useful button, five-error cap, error-announcement container, and
reported build/helper checks. No whole-system rewrite or extra acceptance
requirement is justified by these fragments. The audit is complete for its bounded
inventory; delivery acceptance remains blocked by the named defects and evidence gaps.

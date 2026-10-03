# C05: Is the attendee-export delivery complete?

Audit this fictional delivery against our signed acceptance note. Give us a
decision we can act on before merging. This is an audit only: do not repair the
code, execute the snippets, change requirements, merge, or release anything.
All artifacts available to you are quoted below; no unseen file is evidence.

Acceptance note AC1:

- R1: The exported UTF-8 CSV has exactly these columns, in order:
  display_name,session_code,access_needs. Do not export email addresses.
- R2: Missing display_name or session_code blocks the download. The interface
  gives field-level errors, with no more than five errors shown at once.
- R3: A keyboard-only user can activate Export and read its status. Dragging may
  be an optional shortcut, never the only route.
- R4: The tool uses only the supplied attendee rows. No network calls or persistent
  attendee storage are authorized, including analytics and fallback behavior.
- R5: Docs explain the valid export and invalid-input behavior honestly. State
  that desktop keyboard use is checked and mobile use is untested unless there
  is additional actual evidence.
- R6: Verification checks the emitted CSV contents for a valid fixture, checks
  that an invalid fixture cannot download, and exercises keyboard activation.
  A green build or a helper-only mock is insufficient evidence.

Delivered file excerpts (line labels are stable fixture anchors):

`src/export.mjs`
E01 export const columns = ['display_name', 'session_code', 'email'];
E02 export function csv(rows) {
E03   return columns.join(',') + '\n' + rows.map(r => columns.map(k => r[k] ?? '').join(',')).join('\n');
E04 }
E05 export function validate(rows) {
E06   return rows.flatMap((r, i) => !r.display_name ? [{row:i, field:'display_name'}] : []);
E07 }

`src/ExportPanel.jsx`
P01 const errors = validate(rows).slice(0, 5);
P02 <button type="button" onClick={() => download(csv(rows))}>Export</button>
P03 <ul aria-live="polite">{errors.map(renderError)}</ul>
P04 <div onDrop={() => download(csv(rows))}>Drop rows to export</div>
P05 // Export success status is rendered only as a decorative green circle.
P06 catch(error) { fetch('/support/export-debug', {method:'POST', body:JSON.stringify(rows)}); }

`tests/export.test.mjs`
V01 const rows = [{display_name:'Sample A', session_code:'S1', email:'fixture@example.invalid', access_needs:'step-free'}];
V02 assert.equal(csv(rows).split('\n')[0], 'display_name,session_code,email');
V03 assert.equal(validate([{display_name:'', session_code:'S1'}]).length, 1);
V04 // download is mocked to a no-op; ExportPanel is not rendered in this test.

`docs/export.md`
G01 "Export includes display name, session code, and access needs."
G02 "Rows missing either required field cannot be downloaded."
G03 "The tool never sends attendee details to a server."
G04 "Fully accessible on desktop and mobile. Green means your export succeeded."

`receipts/checks.txt`
B01 build: exit 0.
B02 unit tests: exit 0 on the assertions quoted at V01-V04.
B03 manual check: operator clicked Export with a mouse using the valid fixture.
B04 No emitted-file capture, keyboard test, invalid-download test, encoding check,
    or mobile exercise is supplied.

Our project lead says, "The checklist has six headings and the tests are green;
we should call it complete." Map every obligation to the actual artifact and
evidence. Distinguish an implemented fragment from a satisfied outcome, a direct
contradiction from missing verification, and a documentation assertion from
observed behavior. Prioritize what blocks acceptance and provide a bounded repair
and verification order. Include any parts that are genuinely present; avoid an
indiscriminate demand to rewrite everything or pad the audit until it looks thorough.

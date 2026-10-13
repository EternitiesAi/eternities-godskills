# Installed/published byte audit

**READY**, limited to observed installed/published local byte consistency.

At canonical main `fdc67d6d1833f495e85ee9ab9be67b87684a9ae0`, independent actual hashes match release `87654db51a9f9fd6419c8d0105ab768682e1e7516c7737059cf7880b6c91fa0a`: 87 installed skills / 256 managed native files and all 290 runtime files.

Rollback independently matches the before snapshot, baseline release and installer receipt: 85 prior skills / 250 files and 284 prior runtime files. All 81 unrelated native records remain identical: 56 files, 25 directories, zero link records or empty directories in this observed set. Directory/link record handling was retained rather than reducing the comparison to files alone.

The three protected activation files match the recorded source baseline and independently hashed Git baseline bytes. Both creative experiment files match the parent's before hashes. Existing unrelated untracked experiment work was preserved.

The canonical published ZIP under `artifacts/releases` matches SHA-256 `59b0789f9368de925de9a2575b94580f9b6a349dc408128d74dbfbd413095fd7`; its sidecar and root README's 87-skill count/current ZIP links agree. Remote publication was not queried.

Five runtime checks passed from `C:/Users/Dom/Desktop`: validate plus exact-ID search and explicit no-need abstention for each of the two new skills. The receipt records exact argv, results and output hashes, with compact digests/counts for independently read inventories. A link-count summary was corrected from the three typed record counts without repeating file reads.

No install, push, product/native edits, broad tests, provider/network calls or original qualification changes occurred. This does not test UI loading, live rendering, a fresh Windows installation or agent superiority.

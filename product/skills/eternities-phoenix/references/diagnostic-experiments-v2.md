# Diagnostic experiments v2

Use for competing explanations, intermittent failures or a repair that did not
resolve the original defect. This is a new candidate method; the historical
elimination and bug-packet references remain unchanged. It needs only the
available source, safe observations and a way to exercise the affected behavior.

## Choose an observation that separates causes

Start at the last boundary where the passing and failing cases agree. Compare
what leaves that boundary with what reaches the next consumer. Include effective
configuration, cache identity, ordering and ownership only where they can explain
the difference. Avoid changing several factors just to make the symptom vanish.

For each live explanation, predict what the same probe would show. If every
explanation predicts the same result, the probe is unlikely to distinguish them.
Prefer a small boundary observation over a broad log dump. If access is limited,
say which explanations remain indistinguishable from the available evidence.

Example: a settings panel displays an old value after save. Three explanations
are failed persistence, stale server cache and stale client state. Compare the
save acknowledgment, an authorized read of persisted state, the normal read API
and the panel's received value under the same identity and revision. New stored
value plus old API value localizes the fault between storage and API; new API
value plus old rendered value points to the client. An acknowledgment alone does
not distinguish them. Do not bypass access controls to obtain a diagnostic read.

## Keep intermittent evidence meaningful

Record starting state, failing event order and observation window. For a timing
defect, use controllable events or barriers in a local fixture to reproduce the
ordering; slowing everything with sleeps may only hide the race. Count attempts
and failures under comparable conditions. A single successful rerun does not
refute an intermittent cause. Bound further trials by the question and resource
limit, and preserve an inconclusive result when the failure cannot be isolated.

## Repair, then challenge the explanation

Change the cause-bearing boundary and rerun the original failing case plus the
nearest passing control. Check a neighboring condition that would expose an
overfit fix, such as another cache key or reversed completion order. If the
symptom disappears but the predicted intermediate state did not change, keep
causality unresolved. Mitigation can be useful without proving the root cause.

Example: two overlapping searches complete in reverse order. A local fixture
holds the first response, completes the second, then releases the first. Verify
that the view keeps the newest request's result, still shows an ordinary single
result, and handles the newest request's error. Checking only that an abort
function was called misses a callback that settles after cancellation.

Keep observations beside the test or task unless another consumer needs a packet.
Reopen an eliminated cause only when new evidence contradicts its falsifier or
its tested conditions changed. Diagnosis-only work ends with the conclusion;
authorized repair continues through its verification and required integration.

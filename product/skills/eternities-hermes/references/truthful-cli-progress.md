# Truthful progress for a local CLI process (DRAFT)

Use this method only to observe an already-authorized local child process that
the caller owns. It does not grant command-execution or cancellation authority.
Bind one invocation ID to the process, its declared progress schema, output
mode, deadline, cancellation policy, application-result validator, and cleanup
scope before launch. Keep secrets out of progress text and receipts; use a
stable nonsecret invocation reference where needed.

Accept only invocation-bound structured progress events that match the
declared schema. Render observed phase and count changes; do not infer work
from elapsed time, log volume, a heartbeat, or a spinner. Show a percentage
only when the numerator is valid and the denominator is stable and meaningful.
With no progress protocol or valid events, report observed process liveness
and `no progress reported`; do not guess a phase, percentage, ETA, or success.
Reject malformed events, wrong invocation IDs, duplicates, sequence gaps, and
regressing counts; do not interpolate missing progress. Bound event size and
queue growth, applying backpressure or marking monitoring degraded when a
limit is reached. Ignore late events after close-out so they cannot rewrite
the final receipt.

Preserve the child's stdout bytes exactly, including machine-readable output,
and keep child stderr attributable to the child. Never inject status text or
terminal control sequences into either child stream. In an interactive TTY,
redraw only when the terminal and user support it and only when observed state
changes. Without redraw support, use stable plain-text lines if that mode was
selected. In redirected output, stay quiet by default; emit stable progress
records only when explicitly requested on a separate status channel. Do not
write progress to stderr when it is reserved for the child, and do not emit
ANSI escapes in redirected output.

Keep these facts separate in the final receipt:

- process liveness, exit code or signal, and observation status;
- producer-reported progress and whether its schema was valid;
- application-result validation as `passed`, `failed`, `not-performed`, or
  `unknown` under the declared command contract;
- cancellation requested, cancellation settled, and final process exit;
- descendant/resource settlement and cleanup evidence.

A zero process exit is not application success unless the declared command
contract makes it sufficient or the application-result validator passes. A
cancellation request is not settlement; report `cancelled` or `cleaned` up
only after the corresponding evidence is observed. Continue shutdown
observation only to the declared deadline, then report unresolved state as
unknown or unconfirmed.

If the progress reader or reporter fails while the child is active, mark
monitoring degraded, preserve child output and the owned process handle, and
report unresolved process or cleanup state. Do not kill, restart, or relaunch
by inference. Do not attach late events to another invocation or allow them
to overwrite a terminal receipt. Report observer failure separately from
child exit and application result.

Use the Muse route when the request is only to design the indicator's visual,
accessibility, focus, live-region, motion, or responsive behavior from an
already-defined data contract. That interface work does not launch or observe
a process and does not prove process-wrapper evidence. A local child fixture
can establish only the wrapper contract it exercises, not compatibility with
every shell, terminal, descendant process, or operating system.

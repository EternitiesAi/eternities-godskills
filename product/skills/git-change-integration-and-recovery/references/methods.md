# Git integration and recovery methods

## Repository shape and state

Use read-only inspection to establish the repository boundary before manipulating it. The top-level working directory, Git directory and common directory may differ. A `.git` file can point to metadata elsewhere; it is not proof of either a submodule or a linked worktree. Inspect superproject membership, registered worktrees and the resolved metadata paths together. A bare repository has no ordinary working tree. Detached HEAD can be intentional; do not automatically create a branch or switch away from an externally managed checkout.

Submodules have their own history and worktree state. The superproject records a gitlink to one submodule commit, not the submodule's uncommitted files. Check both when the requested result spans them. Committing the outer pointer cannot preserve an uncommitted inner change. A nested repository that is not an admitted submodule likewise needs a separate decision; do not absorb or delete it to simplify status.

Read current operation state and conflicts in addition to ordinary status. Do not start another merge, rebase or cherry-pick while an earlier operation is unresolved. Hooks, filters and generators can execute code or transform content; inspect their applicable behavior and authority before invoking an operation that uses them. Do not disable them or modify security settings to obtain a pass.

| State | Identity and inspection | What it does not prove |
| --- | --- | --- |
| HEAD | Commit identity, parentage and branch/detached state | Contents of the current index or live files |
| Index | Staged entries and diff from HEAD; a tree identity when fully resolved | That live-file checks exercised those entries |
| Working tree | Tracked file differences, modes and task-relevant untracked files | That a commit will contain every tested file |
| Destination ref | Observed branch/remote identity and expected prior value | That it remained unchanged since observation |

For consequential integration, retain the base commit, candidate commit/tree, expected destination ref and the checks that apply to that content. Include relevant untracked files in the working-copy identity if tests depended on them. Unmerged stages must be resolved before a tree can represent the index. Identical trees establish identical tracked contents; parentage, submodule availability, runtime configuration and external services may still differ.

## Partial staging and shared ownership

Review the staged diff separately from the unstaged diff. A file can contain another owner's staged change and your unstaged change at the same time. Whole-file staging would replace that distinction with all current contents. Choose owned hunks through an inspected partial-selection mechanism and re-read the actual index result. If edits overlap so closely that ownership cannot be separated safely, retain the state and coordinate the disputed slice rather than staging a guess.

Do not unstage another person's work to make a commit convenient. Where appropriate and authorized, prepare the intended contribution in a separate candidate workspace or index and leave the shared index alone. A separate worktree has its own index and files but still shares repository refs and some administrative state; it does not grant permission to change another worktree's branch. Avoid automatically stashing a mixed working tree. Stash creation can alter live files and index state, and its entries are not necessarily yours to drop.

Before a commit, inspect the complete proposed contents and ensure existing staged entries are intended and authorized for that commit. A path-specific commit mechanism may take content from live files rather than the reviewed index; verify its semantics instead of assuming all commit forms consume the same tree. Tests can pass because an unselected fix exists only in the working tree. For that case, test an authorized materialization of the intended staged contents, or hold the commit until the needed content can be included legitimately. Do not move the shared HEAD or clear the index merely to obtain a test environment.

## Conflict intent and generated files

For each consequential conflict, identify the common base, the changes each side intended, the observable requirement after integration and the downstream callers affected. Conflict-side labels depend on the current operation; during rebase, casual assumptions about which side is "ours" can be wrong. Inspect the actual revisions rather than choosing a label globally.

Check rename/delete/modify and binary conflicts, file modes, moved interfaces and ordering dependencies. Marker removal proves only syntactic cleanup. A compiling combination can still revive intentionally removed behavior, duplicate registration, lose validation or invert a migration sequence. Compare the resolved result to each side and use checks capable of detecting the relevant semantic loss.

Treat generated output and its source inputs as one dependency question. If regeneration is appropriate, inspect the supported tool/version and resolve authoritative inputs first. Regenerate within scope and review output changes. A package manager may modify more than the conflicted lockfile or resolve different versions; preserve unrelated changes and inspect the complete result. Do not execute an unfamiliar generator or reinstall dependencies solely because an archived recipe recommends it. Do not hand-merge opaque generated data when its supported derivation is available and authorized.

## Review binding, upstream movement and ref races

Review attaches to exact content and its integration context. Track base and destination identities when combining work. A moved upstream branch can change the merge result, invalidate conflict decisions or alter dependencies even when your authored patch is unchanged. Recompute the resulting candidate and renew affected review/checks. An identical resulting tree can preserve content checks; it does not automatically preserve history, policy or environment conclusions.

Remote-tracking refs are local observations, not guaranteed current server state. Refresh them only through an authorized operation. Do not claim current remote acceptance from a stale local tracking ref. Just before an authorized update, recheck the destination and candidate. Prefer a supported operation that compares the destination to the expected old object before replacement. A low-level ref update alone does not reconcile checked-out files and index state; use worktree-aware integration for a checked-out branch.

On expected-ref mismatch or locking failure, preserve the candidate, inspect the new owner/state, then recompute or hand off. Do not loop a blind overwrite or silently broaden a lease. A force-with-lease safeguard reduces one race risk but does not authorize history rewriting; its expected value must be deliberate and its target permitted. Publication requires authority for the remote and exact refs, including tags. Avoid incidental pushes of other branches or tags. If a response is lost after publication, inspect whether the remote has the intended object before replaying.

## Selective recovery

Choose recovery by the state that needs correction:

- **Incorrect live edit:** Preserve valuable current content, then restore or reconstruct only the owned paths/hunks from an identified source. Recheck the index separately; changing live files need not alter staged contents.
- **Incorrect staging:** Correct only owned index entries while retaining desired live files and unrelated staged changes. Verify both diffs afterward.
- **Published incorrect commit:** Prefer an authorized compensating commit when shared history must be preserved. Reverting a commit can itself conflict with later work; inspect the resulting behavior.
- **Interrupted merge or rebase:** Identify the operation and its pre-operation state. Continue after verified resolution, or abort only within authority and after confirming what abort would discard. Pre-existing or later edits may need separate preservation.
- **Missing committed work:** Inspect recoverable commit identities or reflog evidence within scope and secure valuable objects through an authorized reference or artifact before relying on temporary retention. Reflog recovery does not restore every untracked file.

Copies must preserve relevant binary contents, modes, untracked files and staged distinctions; a text diff alone may be insufficient. Branch names and old receipts are not substitutes for exact object identity. Do not delete a worktree, branch, stash or file merely because your slice is done. Verify ownership, target and recovery path for authorized cleanup. Avoid broad hard resets, clean operations, stash drops and force pushes as routine recovery shortcuts.

## Bounded examples

**Mixed file commit:** A shared module contains a staged logging adjustment from another owner and an unstaged error-handling fix from this task. The agent inspects both diffs, selects the authorized fix in an isolated candidate if needed, and checks that the tested contents match the intended commit. If the two changes overlap inseparably, the agent preserves them and hands off the ownership decision. It does not stage the whole module or unstage the logging adjustment.

**Moving integration branch:** A candidate was reviewed against destination commit A. Before integration, the branch moves to B with a related schema change. The agent preserves the reviewed candidate, recomputes integration against B and repeats the affected compatibility check. If the destination moves again before update, the guarded operation rejects the race. That rejection leaves intervening work intact and triggers fresh inspection.

**Generated conflict:** Two branches change dependency declarations and a lockfile. The agent resolves the requested dependency intent, checks the supported generator and its authority, regenerates the lockfile when permitted and inspects the entire resulting diff. A successful install alone does not prove the combined program preserves both branches' required behavior.

These are proposed method illustrations, not executed repository recovery trials.

## Source ledger and qualification

Exact full source bodies and actual notices were inspected as inert evidence. No source prose, code or templates are included. Local checkout identity is not verified upstream authenticity; original wording does not settle source rights or uncertain notice scope.

- **obra/superpowers observed checkout:** repositoryRelative `skills/using-git-worktrees/SKILL.md`; bodySHA256 `8cfb86f121269e8f7f12361e6795c4f6738828340e28964c9229d365666c9edd`; observed HEAD `8ca22dba9a94f28898bbce59f2537ff4d87c747d`. Full root `LICENSE` read: MIT, copyright 2025 Jesse Vincent; noticeSHA256 `0da33ed814ee87e72db078f489c4447af72f13d9f25d9e17476f32efd77705fc`. Pattern reference for existing-workspace and submodule detection. Rejected mandatory isolation menus, fixed directories, automatic dependency setup, automatic ignore-file commits and assumed cleanup ownership. This source is not a portable product owner.
- **agent-skills archived copy:** repositoryRelative `skills/git-workflow-and-versioning/SKILL.md`; bodySHA256 `51677cf03845dd29d08ea4d3125665057b720aea3dccc572f25d8b172409ece6`. No repository Git identity or upstream commit was available. Full root `LICENSE` read: MIT, copyright 2025 Addy Osmani; noticeSHA256 `6f202f8bd568cd730dbb2b0d1f8e243bc74c2fa1f64dbce9b2c7ea08bd5c9fd7`. Pattern reference for coherent change selection, staged-content review and generated-file expectations. Rejected "always" activation, fixed branch lifetimes/change sizes, automatic branch/worktree deletion, broad hard reset and universal tag/version recipes.
- **cursor/plugins observed checkout:** repositoryRelative `cursor-team-kit/skills/fix-merge-conflicts/SKILL.md`; bodySHA256 `b77f260655f541345e2b8b7907ce0647c8df9190b8c396de92b30718390966f9`; observed HEAD `e31650eea443aaea1e84cc15d88c13f40080b275`. Full scoped `cursor-team-kit/LICENSE` read: MIT, copyright 2026 Cursor; noticeSHA256 `20a8168b1766bb40d27e168762cf2a6d9e83265f7aeb89c94924af80e9984130`. Repository-root license remains unknown; the scoped notice does not resolve all component rights. Data-only pattern reference for inspecting conflicts, derived-file regeneration and targeted validation. Rejected compiling-side selection as semantic proof, unconditional both-side preservation and automatic staging of all resolved files.

Compared with the full current Daedalus and Forge entrypoints and their methods references, this specialist adds exact Git state/content binding, partial-hunk ownership, submodule boundaries, operation-specific conflict semantics, expected-ref races and selective recovery. Daedalus's durable application-effect compensation card remains a different method; Forge retains broader delivery coordination. Existing owners are unchanged. Independent review, behavioral recovery trials, discovery qualification and final acceptance remain open; no source-level activation disposition follows.

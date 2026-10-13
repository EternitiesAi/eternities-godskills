---
name: git-change-integration-and-recovery
description: Integrate or recover Git changes with repository identity, HEAD/index/worktree separation, hunk ownership, reviewed-tree binding, semantic conflict resolution and guarded ref updates.
---

# Git change integration and recovery

Use when staging mixed changes, resolving merge or rebase conflicts, combining branches, recovering selected paths, or preparing an authorized commit or publication whose exact contents matter. This specialist adds Git state mechanics to engineering delivery. It does not choose a universal branching model, prescribe release versioning, or require a new worktree for every small edit.

The outcome is the intended change in the authorized repository and destination, with unrelated work preserved and verification tied to the resulting content. Scale the method to the task: a small uncontested commit needs a relevant state check and diff review; concurrent integration or recovery needs explicit content and ref identities.

## Working method

1. **Identify the repository and owners.** Establish the actual repository root, Git directory, common directory, current branch or detached HEAD, existing worktrees and any enclosing superproject. A Git directory difference alone cannot distinguish a linked worktree from a submodule. Check ongoing merge/rebase operations and existing staged, unstaged and untracked changes before editing. Keep nested repositories and submodule contents within separate ownership and authority boundaries.
2. **Separate the three local states.** HEAD identifies the checked-out commit; the index holds the proposed commit contents, including unresolved stages; the working tree holds live files and untracked material. Inspect both staged and unstaged differences. A clean working-tree diff does not mean the index is empty, and a test on live files does not prove the staged tree. Bind the candidate to the relevant base commit, proposed contents and integration destination.
3. **Select only the intended contribution.** Distinguish ownership by change or hunk when a file is shared. Review existing index entries before staging; do not stage an entire shared file merely because its path is assigned. Preserve unrelated staged and unstaged work. Use isolation when needed to avoid conflicting writers, but recognize that linked worktrees still share refs and objects. Do not create or rename a user branch merely to impose a preferred workflow.
4. **Resolve content, not just conflict markers.** Read the common base and each side's intent, and check how the current operation defines its sides. Preserve required behavior across rename, delete/modify and structural conflicts. Do not select a side just because it compiles or combine mutually exclusive behavior to retain both texts. Regenerate derived files only with the project's supported inputs and inspected tooling, within authorized scope. Validate the combined behavior and inspect the final diff.
5. **Bind review and checks to the exact result.** Inspect the proposed commit or integration tree, including modes, removals, generated files and submodule pointers. Record a tree/content identity for consequential changes; unresolved index stages cannot form a commit tree. If checks ran on a different working tree, establish equivalence for the relevant behavior or test the intended candidate separately. Hooks or generators that change contents invalidate affected review and checks.
6. **Recheck and integrate under the expected ref.** Immediately before updating a destination, verify its current identity and the reviewed candidate. Upstream movement, another writer or a changed merge base may require renewed integration and verification. Use supported worktree-aware operations that guard the destination against its expected previous value. A race rejection means re-inspect and recompute; do not overwrite the intervening work. Local commit, branch integration and remote publication are distinct effects with distinct target authority.
7. **Recover selectively and verify.** Preserve recoverable copies or identities for material work before authorized replacement or removal. Choose the smallest operation that corrects the intended state without erasing other owners' changes. Do not default to broad reset, clean, stash removal, history rewriting or force push. Confirm the resulting HEAD, index, working-tree contents and any remaining conflict or pending publication state.

Read [methods.md](references/methods.md) for repository detection, partial staging, review invalidation, semantic conflicts, ref races and selective recovery examples. Use only the sections relevant to the requested operation.

## Failure checks and handoff

Stop dependent mutations when repository identity, hunk ownership, conflict intent or destination authority remains materially uncertain. An unexpected index change or ref update is evidence of possible concurrency; do not repair it by resetting to your assumed baseline. Check failures of each Git operation before issuing the next. A queued push or lost response does not prove remote acceptance; inspect the remote result through an authorized mechanism before retrying.

Return the intended content and destination identities, performed effects, relevant verification, preserved unrelated work and unresolved state. A local commit does not establish merge, publication or deployment.

This is an authored instruction-stage method. Independent review, behavioral evaluation and final integration acceptance remain open; no workflow or performance superiority is claimed.

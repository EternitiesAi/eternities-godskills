# Proposal refinement deployment

The 77-entrypoint proposal-refinement pack was pushed in implementation commit
`a84bc232aaebd1d62d0b95f65ce56e6f673df9b8` and installed as release
`6c36ebcdcda1df53006015e47e348189f14fc11968a7c153767dafeea0531520`.
See the [implementation and application record](product-research-proposal-refinement-20261003.md)
and [separate parent deployment receipt](../artifacts/product-proposal-refinement-20261003/deployment-parent.v1.json).

Parent verification matched all 220 managed native skill files and all 252
standalone runtime files. The fresh rollback backup preserves the prior d6
release's 219 managed native files and 251 runtime files. All 56 unrelated native
files are unchanged, and earlier backups remain recoverable. The installed CLI
validates the exact new release and its 77 entrypoints. No global instructions,
provider/model settings, scheduled tasks or source-quarry records were changed.

Filesystem/native-loader-facing placement does not prove that an existing chat
has refreshed its cached skill list. Fresh-chat UI enumeration and automatic
skill selection were not observed. Lexical retrieval still requires fit judgment:
the parent's short proposal query ranked Agora first, while the independent
reviewer's longer, task-filtered query ranked it second. Neither query establishes
semantic discovery quality, sponsor compliance or improved agent outcomes.

The later [independent non-installer deployment audit](../artifacts/product-proposal-refinement-20261003/deployment-independent.v1.json)
passed all fourteen membership/hash comparisons; its exact report and receipt
were separately parent-verified. This does not turn the earlier parent receipt
into an independent review. At this audit checkpoint the installed pack is usable,
while the educational-microsimulation candidate is still unpublished in the
development worktree until its separate integration gate. The fixed quarry remains unfinished:
49,514 actual open obligations and 163 conflicts, with no R10 application here.

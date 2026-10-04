# Conditional study and synthesis installation checkpoint

The [reviewed package](conditional-study-synthesis-refinement-20261004.md)
was merged and pushed at implementation commit
`04b90e844a86ba1a36cee63401dabb9afa7e6c1c`. Main equalled origin/main after
the push. The standalone release is
`5755594ff5a8623d992b2537efdb827a9c5df37521418722efca7d1532cdc37e`.

The existing local native skill collection and portable runtime were upgraded
with a fresh rollback backup. Exact before/after inventories and the completed
installer journal were checked, not inferred from a success message. The
installation has 77 entrypoints, 223 managed native files and 255 runtime files.
The immediately preceding release's 221 native and 253 runtime files are
exactly backed up; all 56 unrelated native files remain unchanged.

The [parent deployment evidence](../artifacts/study-synthesis-methods-20261004/deployment-parent.v1.json)
records manifest and journal hashes separately from the instruction/package
review. Actual installed CLI content validation passed. Rollback was not
executed; verified recovery bytes are not a live rollback result. A separate
non-installer audit is not implied by these parent checks.

Both new references are installed under their existing owners. They can be read
on demand for access-sensitive user studies and staged multi-document synthesis;
ordinary owner tasks keep their existing short entrypoints. Fresh-chat UI
enumeration, automatic selection and real participant/synthesis outcomes were
not observed. The known educational discovery miss remains a separate repair.
Installation does not resolve source rights or finish the larger quarry.

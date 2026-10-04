# Educational microsimulation: verified local installation

The reviewed portable release `4520db08b6ca5dbc8cc93f08585d7c021282ea021d80b9896ecbf9f06995651e`
was pushed at implementation commit `589679f2052d3147f9d8998008b2a0e84b6c555e`
and installed into the existing native skill collection and portable runtime.
This is the parent's exact deployment check; a separate non-installer audit is
pending at this checkpoint.

The [deployment record](../artifacts/microsimulation-method-20261004/deployment-parent.v1.json)
binds the before/after manifests and completed installation journal. All 252
declared canonical payloads matched the release. The installed collection has
77 entrypoints, 221 managed native files and 253 runtime files. A fresh rollback
backup exactly preserves the previous release's 220 managed files and 252
runtime files. All 56 unrelated native files are unchanged. Three frozen
activation files and the unrelated canonical creative-method experiment remain
unchanged; they were not staged with this release.

Content installation does not prove automatic selection. A real installed CLI
query for an educational microsimulation returned Athena, Forge and statistical
model inference as its top three, missing the intended education owner. That
negative result is preserved; a bounded routing diagnosis is separate work.
The method remains reachable through the existing learning-design entrypoint,
but this checkpoint does not claim natural-language search is universally good.

The [implementation and example record](educational-microsimulation-refinement-20261004.md)
describes the narrower software evidence and its limits. No learner study,
source-rights clearance, general agent advantage or terminal quarry application
follows from installation. Whole-corpus work is still unfinished.

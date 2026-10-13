# Knowledge identities, navigation, and lifecycle

## Purpose before layout

Ask what the audience needs to locate and distinguish. A maintenance handbook,
research library, decision record, and personal note collection need different
coverage and retention. Reuse the existing collection's useful conventions.
Choose a compact taxonomy from recurring tasks and actual content; let aliases
and facets bridge vocabulary differences. Avoid a category for every note or
forcing a cross-cutting record into several copied bodies.

A record should be understandable at the granularity at which it is retrieved.
Keep conditions, negation, definitions, and linked evidence together when separating
them would change meaning. Splitting every compound title is not a useful rule.
An overview and a detailed source can both exist when their roles and lineage
are clear. A note without peer links may still be intentionally reachable through
the collection map; absence of inbound links alone does not establish obsolescence.

Descriptions should communicate scope and when to open the record. Navigation
can expose topics, types, audience, status, or time as separate facets. If metadata
would reveal a restricted subject, filter that metadata as well as the body.
Check representative audience tasks before expanding the taxonomy. A useful map
can be a table, a page, or a structured index; no particular filename is required.

## Three identities with different jobs

| Entity | Identity and revision | Relationships to preserve |
| --- | --- | --- |
| Source | Stable source ID, current locator, observed revision or byte digest when available | Origin, responsible owner, access and retention basis, observed time, relevant spans |
| Claim | Stable assertion ID with subject, meaning, audience or population, conditions and time scope | Supporting or contradicting source revisions and spans, interpretation, review state |
| Derived view | View ID and generation, input identities and versions, transformation/configuration version | Source and claim dependencies, audience policy, approval/effective selection, invalidation reason |

Use these roles only to the extent the collection needs them; a small handbook
can represent them in ordinary prose and source links. Stable IDs need a uniqueness
rule and should not be reused after retirement. A title or path can change while
the source identity remains. Retain aliases for meaningful prior names and distinguish
an alias from a separate source with matching text.

A correction that preserves the intended assertion can be a claim revision. A
different population, policy interval, or materially changed meaning needs a
distinct assertion or explicitly versioned scope, with a relationship to its
predecessor. Never let a retained claim ID hide a contradictory change. Record
what a digest covers: exact original bytes, normalized text, or a derived excerpt.
These identities are not interchangeable.

Consider two identical manuals, one publicly released and one received under
restricted access. Their bytes may match while provenance, permission, retention,
and allowed audiences differ. Keep separate source records and access relations.
Do not export the restricted source, its metadata, or a derived summary because
a body hash matches public material. Physical storage deduplication, if authorized,
must preserve independent access and deletion semantics; otherwise keep it a
proposal. Similar wording also does not prove two records express the same claim.

## Conflict, canonical choice, effect, and approval

Treat these as independent questions:

- **Conflict:** do claims disagree for the same subject, conditions, and time?
- **Canonical selection:** which record should this audience use for this purpose,
  under whose authority, and with which unresolved alternatives?
- **Effective state:** when and where does the asserted rule or fact apply?
- **Approval state:** has the responsible owner approved the record or proposed
  change, and does that approval cover the audience and use?

Last edited, last observed, and last verified answer different questions. A
canonical target may be a draft selected for review, not an operative policy.
Contradictory observations can remain unresolved without either becoming canonical
truth. Disagreements from different populations or periods may reflect scope
rather than conflict; retain that distinction instead of averaging them.

Example: policy A remains effective through the end of a period. Policy B is
approved but takes effect later. Draft C was edited today and has no approval.
Current-policy navigation should resolve to A, future planning can show B with
its start condition, and C belongs in review. If B's effective date changes,
invalidate the relevant navigation and views even when B's body does not change.
A new timestamp alone cannot settle any of these selections.

When authority is unclear, preserve the competing records and name the missing
decision or evidence. Do not invent approval or edit a source to manufacture
consistency. Keep recorded observations separate from recommendations about which
record should govern future use.

## Bounded retrieval and coverage

Read the permitted map, choose candidate IDs using scope descriptions, then open
the needed records and source spans. Expand only to close a named evidence gap,
resolve an alias or conflict, or assess required coverage. Stop at a sufficient
answer for the collection task or a stated limit. A no-match in a map establishes
only what that map covers, not absence from all storage.

Distinguish an actual byte snapshot from a locator that may later change. Permission
to read does not necessarily include permission to copy, index, retain, or publish.
Use existing authorization where it covers the requested action; a skill invocation
does not expand it. Do not read private exports to improve a generic collection
guide or persist session material because a turn ended. Maintenance occurs for
the authorized task or established schedule, not by self-triggered memory writes.

This method selects and checks collection records. Ranking models, answer generation,
embedding choices, and question-answering performance belong to the retrieval
pipeline's method and evaluation. A collection index can support that pipeline
without claiming to implement or qualify it.

## Incremental maintenance and coherent generations

For a requested edit, bind the source revisions and current generation being
changed. Inspect what moved or changed: bytes, locator, meaning, effective interval,
approval, access, retention, taxonomy, or transformation configuration. A rename
may need only resolver and navigation updates. A claim correction affects summaries
that rely on it. An access revocation can invalidate caches despite unchanged bytes.

Trace the affected dependency set from sources to claims to views; include inbound
links and aliases. If dependency coverage is incomplete, mark the uncertain views
stale and expand only as needed for the requested assurance. Do not declare an
incremental refresh complete by assuming missing dependencies do not exist.

Prepare a candidate generation containing updated entries, removals or tombstones,
and the input and policy versions it represents. Validate identities, target
resolution, provenance links, scope, and applicable access before exposing it.
Use a consistent publication mechanism appropriate to the storage system; a file
existence check is not an atomic update. If changes cannot be made together, make
the intermediate stale state explicit and prevent it being presented as current.

Bind cache entries to the inputs that matter: source and claim revisions,
transformation/configuration version, audience policy version, and effective-state
selection. A changed input makes the dependent result stale until refreshed.
Never let a warm cache bypass current access rules. Revocation and required removal
must reach navigation, search entries, summaries, caches, and logs within the
authorized operational scope. Content held for permitted historical reasons
must remain distinct from content available for active use.

If a source changes during maintenance, detect the mismatch against the bound
revision and rebase the affected work or hold it stale. Do not overwrite a concurrent
edit. Broader rebuilds are justified when identity or dependency changes invalidate
the narrow approach; explain the additional scope before expanding beyond authority.
Keep an allowed prior generation or change record for recovery, without using
rollback to reintroduce revoked access or expired retention.

## Retirement, redirects, and source-sensitive checks

Retirement changes whether a record should be used; deletion removes material
under an authorized rule. A redirect preserves a former identity while explaining
its destination and limits. Keep historical versions when permitted and useful,
with status visible. An intentional merge needs evidence that the records serve
the same claim and audience; preserve separate origins and any conflicting scope.
If a target must disappear entirely, a permitted minimal tombstone can prevent
ID reuse without retaining sensitive text.

Validate the affected slice with cases matching its risks:

- Rename a record: its stable ID still resolves, aliases and inbound links work,
  and its claims retain their original source revisions.
- Compare current, future-effective, and unapproved records: the requested time
  and audience select the applicable record, while conflicts remain visible.
- Introduce identical bodies under different rights or audiences: matching bytes
  do not merge access or release restricted metadata.
- Change a source or transformation: affected views become stale, unrelated
  views can remain valid, and a cache cannot silently reuse the old result.
- Interrupt a generation update or revoke access before recovery: readers see
  a coherent permitted state or explicit unavailability; recovery does not restore
  a forbidden copy.
- Remove a target or supply no match: links expose the retirement or gap rather
  than substituting an unrelated record or asserting corpus-wide absence.

These are candidate acceptance cases to adapt, not claims of executed evaluation.
For a small collection repair, use only cases that could expose a relevant defect.
Distinguish valid structure and resolving links from accurate claims, authorized
retention, complete coverage, and observed retrieval behavior.

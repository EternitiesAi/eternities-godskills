# Constraint diagnosis: actual contributions and limits

This is an author's record of applying the exact shipped owner skill and method
to the fixed contract with fictional data. Source and final file SHA256 values,
the observed first failure, expanded failure, first green and relocation replay
are in `evidence.json`. Loading a resource alone earns no attribution. The fixed
contract already requires much of the same arithmetic, so this record cannot
establish that the method caused better code or outperformed an unaided author.

## Decisions the method contributed

| Source mechanism | Applied decision | Observable result |
| --- | --- | --- |
| Compare service classes as resource effort, not raw counts | Multiply each class's counts by its resource-specific effort | Literal mixed-class test: four one-hour and two three-hour reviews require ten ready hours |
| Shared specialists cannot donate their full week to every class | Aggregate all class demand in a single resource entry before comparing available hours | Contract fixture has fourteen required hours against twelve available, yielding a two-hour shortfall |
| Include correction effort once, either inside effort or separately | Follow the API's separate resource rework term, with a README warning against also embedding or subtracting it | Four correction hours appear once across classes; a resource with no classes still retains its correction load |
| Congestion can reflect missing prerequisites rather than ready demand | Keep blocked effort separate from required ready hours and spare hours | A queue of twenty blocked two-hour items leaves forty future hours and three currently spare resource hours in the backlog test |
| A local gain can move the queue; readiness and downstream acceptance matter | Demo reduces rework in a cloned input and retains a downstream resource with zero spare hours | Review shortfall changes from two to zero; demo explicitly requires preventability, readiness, downstream acceptance and quality checks before an intervention |
| Owner skill requires accountable decisions and actual observations | Demo's next-action text asks for an authorized owner, observation window, accepted outcome, quality guardrail and reversal condition | Narrative guardrails accompany the calculation; no automatic staffing decision or claimed throughput result is returned |

The first four decisions are also directly constrained by the API. Their
implementation demonstrates compliance, not a counterfactual measurement of the
skill's unique benefit. The method's downstream and competing-explanation checks
principally influenced the demo and the API's documented limits.

## Useful omissions and limits

- No minimum-stage-capacity throughput formula: the supplied classes use shared
  resources and rework, which violate the method's simple serial-ceiling example.
  A scalar shortfall cannot support a promised number of shipped cases.
- No inferred bottleneck ranking from queue size or from summed hours across
  resources. Each resource remains separate, and blocked effort remains visible.
- No invented missing-input versus post-processing-blocked diagnosis: the fixed
  API provides one `blockedCount`, without item transitions or timestamps. The
  README calls for item traces and downstream acceptance/release observations.
- No cadence engine, WIP policy, decision-rights redesign, surveillance, staffing
  recommendation or pilot result. The full owner skill covers these when real
  records and authorized process change exist; this contract supplies neither.
- No effort ranges, arrival process, calendar simulation or uncertainty model.
  Omitted resource keys mean zero participation, not unknown effort. Unknown
  effort must be resolved outside this scalar API. Fractional hours use ordinary
  JavaScript floating-point arithmetic without a false precision claim.
- No extension-resource or source-instruction edits were needed. The selected
  method and exact API were sufficient for the lane; the broader `methods.md`
  cadence mechanics were not needed or read. No material contract ambiguity was
  encountered. Sparse effort maps, strict unknown-field rejection, errors and
  ordering are documented choices within the contract.

## Workflow contribution and handoff boundary

The installed test-driven-development skill and its test-writing reference
contributed tests with hand-derived literal results and no mocks, observed against
an empty-list stub before implementation. The first run failed one behavioral
assertion; after expanding the suite, all 54 cases failed against that stub. The
implementation then passed all 54 unchanged author cases. The installed
verification skill contributed direct inspection of test exits, JSON demo
results and byte-identical relocated files. The installed executing-plans skill
was used for sequential execution of this author lane only; shared integration
and branch-finishing workflows remain outside the user's scope.

The Keel instruction file was inspected under general host guidance but was not
applied: no wake, resume, letter or inherited task history was used. It contributed
no implementation decision and is recorded only to make the source-read list
honest. No independent test contents or other author implementations were read.

The four product files are ready for parent inspection, independent tests and
parent replay. These author observations are not independent acceptance, release
integration, installation, field validation or proof of skill superiority.

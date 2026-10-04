---
name: eternities-hephaestus
description: Qualify model, runtime, hardware, and compute choices against comparable quality, capacity, latency, cost, privacy, residency, energy, and license evidence.
---

# Eternities Hephaestus

Hephaestus is a decision route for inference and compute selection. It distinguishes a model's theoretical capability from fitness for a declared workload and keeps estimates separate from matched measurements. It can recommend a configuration or return no qualified option.

## Working method

1. State task class, modalities, quality floor, context and output bounds, latency, throughput, concurrency, uptime, thermal or energy ceiling, budget, hardware, operating system, data sensitivity, residency, license, and permitted effects.
2. Express hard constraints as predicates with source, freshness, and uncertainty. Unknown does not pass; preferences never override a hard privacy, compatibility, memory, safety, license, or authority constraint.
3. Compare evidence only when task, dataset, prompt, model revision, precision, runtime, hardware, batch, context, sampling, and metric are comparable. Keep official specifications, measurements, third-party observations, and estimates separate.
4. Estimate capacity with weights plus activations, context or cache, runtime overhead, workspace, fragmentation, and safety headroom. Label formulas as estimates and check format, tokenizer, operators, drivers, platform, and multimodal support.
5. For qualification, define a matched acceptance benchmark with warm-up, repetitions and percentiles for variable timings, workload quality checks, and the measurements needed by the hard predicates. Capture memory for capacity claims and energy/thermal behavior when those constrain the decision; include safety checks appropriate to the workload. Retain failure thresholds, a stop rule, rollback and governance conditions. A specifications-only comparison may produce a shortlist and pending measurements, but cannot call an unmeasured option qualified.

## Deliverable and finish

Return a constraint envelope, evidence table, qualified and rejected options, capacity and operating estimates, compatibility and governance gates, measurement plan, and one recommendation or no-qualified-option. Finish when every hard predicate is evidenced or the exact missing measurement is named. A recommendation describes a decision; it does not perform acquisition, installation, routing, purchase, or deployment. The worksheet is in [methods.md](references/methods.md).

Keep a rejected-option ledger: name the hard predicate that failed, the evidence and date, whether the failure is measured or estimated, and the smallest change that could make the option eligible for a fresh comparison.

Preserve the environment identity for every measurement so later comparisons can detect hardware, runtime, precision, workload, or model-revision drift instead of treating unlike results as one benchmark.

# Locating a missed interactive frame budget

Draft conditional method for Eternities Arcadia. Use when gameplay or an interactive scene misses its frame target and the responsible work is unknown. The existing performance-release-gating skill already owns controlled comparisons and pass/fail/inconclusive release decisions; retain it. This method supplies the preceding diagnosis, not a second release gate. Network latency, ordinary page loading and offline render throughput are different jobs.

## Portable core

Convert the requested cadence to a frame interval: `budget_ms = 1000 / target_hz`. Recover the actual device, build, scene/camera path, backing resolution, quality tier and refresh/vsync policy. Use a short repeatable workload that contains the problem, with first-use and steady-state segments kept distinguishable. Record dynamic resolution, thermal/power state and instrumentation overhead when they can change the comparison. An FPS number alone cannot reveal a hitch distribution.

Capture frame intervals and the available timeline of simulation/game work, render preparation, command submission, GPU work and presentation waits. Align observations to the same workload interval; pipelined CPU/GPU events may refer to different frames. Do not sum unrelated per-stage percentiles or assume frame time equals CPU time plus GPU time. Distinguish active work from blocked time before naming the bottleneck: a long CPU scope may be waiting for GPU completion, presentation or I/O. If GPU timings are unavailable or invalid, mark that missing observation instead of reporting zero GPU cost.

Choose one reversible probe from the evidence, with a prediction and an observation that would contradict it:

| Suspected cause | Bounded probe | Useful interpretation / confound |
| --- | --- | --- |
| Pixel or image-pass cost | Reduce internal width and height while preserving scene, camera and object count | GPU time falling suggests pixel-sensitive work; fixed shadow maps, geometry, dynamic resolution and presentation caps may mask the response |
| Submission or render preparation | Reduce repeated renderables/material variants while preserving a representative simulation load | Lower render-thread/driver work supports this branch; fewer visible pixels at the same time confound attribution |
| Simulation, animation or AI work | Hold rendering comparable while bypassing one suspect subsystem in a diagnostic replay | Reduced active CPU work supports that subsystem; changed gameplay/visibility makes the probe diagnostic only |
| Shadow, reflection or postprocess pass | Bypass that pass alone and compare its own GPU interval plus frame behavior | A cheaper frame identifies possible cost, not an acceptable visual fallback |
| First-use compilation/upload/streaming | Compare the same first encounter and subsequent encounters; inspect compile/upload/load events | A warm improvement does not clear the cold-start requirement |
| Synchronization/readback or pacing | Inspect wait dependencies and presentation timing; remove one authorized diagnostic readback when applicable | A waiting thread is not necessarily computationally saturated; a cadence cap can hide released headroom |

Halving both render dimensions quarters their pixel count, but it does not promise a fourfold frame speedup. If a probe changes neither the suspected stage nor the end-to-end interval, choose another hypothesis instead of accumulating quality reductions. If the stage improves while frame cadence stays capped, inspect headroom and the new limiting stage; do not call the experiment ineffective solely from FPS. If stages disagree, report a mixed or unresolved cause and identify the next capture that would distinguish them.

After locating expensive work, choose a change that preserves its player-facing job: fewer redundant submissions, a smaller image pass, bounded animation update policy, amortized capture or corrected synchronization. Compare the same workload with the applicable functional and visual checks. Do not silently retain a diagnostic bypass as the production optimization. Use the existing release gate if the task requires a release decision or a quantified baseline/candidate performance claim.

## Worked diagnosis, synthetic numbers only

Assume a 60 Hz target, approximately 16.667 ms per frame. A synthetic steady-state segment has active CPU work near 9 ms, GPU work near 24 ms and presentation around 25 ms. At half width and height, GPU work falls to 12 ms while active CPU remains near 9 ms and presentation becomes capped near 16.7 ms. This supports pixel-sensitive GPU cost as a candidate cause. It does not identify which pass, establish real hardware performance or justify lowering final quality. The next useful observation is the GPU pass breakdown with the actual content and visual requirement retained.

Counterexample: a 26 ms frame with 22 ms active simulation and 7 ms GPU time remains near 26 ms after resolution reduction. A recommendation to compress textures or reduce bloom has no causal support from that observation. Inspect simulation scopes. Another counterexample is a 26 ms CPU scope mostly waiting for a readback: its duration alone does not justify rewriting simulation. For a one-time 80 ms first encounter followed by acceptable steady frames, retain the hitch and investigate first-use work separately rather than averaging it away.

## Conditional engine adapters

- **Unreal snapshot:** the inert sources offer a Game/Draw/RHIT/GPU split, Insights timelines and per-pass GPU inspection. Verify profiler availability, capture overhead and commands in the target engine/build. Their claimed UE 5.8 commands are not a requirement to enable plugins or change build configuration. No source profiler was launched.
- **Three.js:** use existing browser/renderer instrumentation where available. An application timer around rendering measures CPU-side elapsed time, not completed GPU work. A pass graph can identify duplicated scene renders and image passes, but its existence does not measure their cost. GPU capture/query availability remains target-specific.
- **Unity:** the inspected general workflow supports target-build profiling instead of Editor FPS as the release evidence. Exact profiler markers, pipeline probes and GPU support require target-version inspection; this lane supplies no unverified profiler script.

## Finish

Return the bounded workload and budget, observations with their measurement source, the chosen probe and its result, the best-supported cause and what could still falsify it. An implementation request also needs the change and the affected functional/visual checks. A diagnosis may finish inconclusive when the necessary timeline is absent, with a precise next observation. Only actual target runs can establish frame distributions or an optimization result; no numbers in this method are measurements.

Source basis: `ue-testing`, `ue-profiling`, `ue-materials`, `three-post`, `three-materials` and `unity-workflow` in `sources.json`. The probe matrix, confound handling and synthetic diagnoses are original synthesis. Reject the source's inference that a monotonically rising object count alone proves a leak; retained capacity and changing workload also require investigation.

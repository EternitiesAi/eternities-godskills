# Message-provenance path correction

The immutable independent REPAIR for `6260462` demonstrated that a container-name-only exception also ignored a same-named object nested inside instruction content. The parent reproduced this with a failing rejection regression before changing the source. No real capture was alleged to contain that synthetic shape.

The canonicalizer is restored to its prior behavior. During validated message processing, a copied **actual message-level** provenance object alone has its `create_time` removed. The original input is not mutated. Content and nested metadata remain fully compared. The real timestamp-positive control and direct/nested content-negative controls now all pass. The current portable reviewer controls only refresh their source hash; original archived controls and earlier reviews remain immutable.

This source repair does not change tasks, keys, skill bodies/resources, CLI arguments, schedule, timeout, output contract, model/provider request, or the stopped pre-acceptance attempt. It requires a fresh independent narrow delta review before a new operation. The claims remain factory-four, captured-preflight-only, and unknown served model; it is not a general adversarial-runner or executed-prefix attestation.

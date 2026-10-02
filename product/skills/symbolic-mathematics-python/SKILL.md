---
name: symbolic-mathematics-python
description: Use when Python-based symbolic derivation or transformation needs explicit domains, assumptions, units, branch handling, singularity review, and independent numeric checks.
---

# Symbolic mathematics in Python

Use this entrypoint to make a computer-algebra result inspectable and bounded. It is useful for derivation, simplification, solving, and transformation checks; symbolic output and numerical agreement are not automatically a formal proof.

## Choose the route

- **Source-grounded mathematical specification from cited prose — DRAFT:** Use before derivation when the requested artifact makes quantities or mathematical relations explicit with locators, units, domains, and unknowns. Follow [the source-grounded specification method](references/source-grounded-math-specification.md). This route does not solve or validate the source claim. Prose outlines and nonmathematical claim extraction, including policy and literature outlines, remain with Logos; scientific or causal claim appraisal remains with Athena. If the input already contains a declared equation or identity and the request is to solve, simplify, derive, or prove it, use the existing symbolic workflow below instead; that is an anti-trigger for this extraction method, not for this skill.
- **Symbolic derivation or transformation:** Use the existing workflow below when an expression or identity is already declared and the requested work is symbolic computation or its checks.

## State the mathematical domain

Write the expression or identity, variable domains, assumptions, units, branch conventions, parameter restrictions, and intended equality notion before asking a solver to simplify. Distinguish an identity on a domain from an equality that fails at a singularity or changes branch.

Encode assumptions explicitly and retain the unsimplified expression for comparison. Record whether a solver treats a variable as real, positive, integer, nonzero, or unconstrained. For dimensional work, annotate units through every term and do not let a dimensionless symbolic representation conceal a conversion.

## Derive and cross-check

1. Derive or transform in small steps so a lost condition can be located. Preserve side conditions, solution branches, inequalities, and excluded denominators.
2. Inspect singularities, discontinuities, branch cuts, absolute values, roots, logarithms, inverse trigonometric functions, and piecewise boundaries.
3. Use an independent route for validation: hand algebra, a different formulation, high-precision numerical evaluation, finite differences, or a direct implementation. Select samples on both ordinary and near-exceptional regions.
4. Compare symbolic and numeric results with declared precision and domain checks. A numeric pass at a few points does not test a pole, branch transition, or all parameter values.
5. If the solver returns a conditional or ambiguous result, preserve that form and report what additional assumptions would be needed. Do not simplify conditions away to obtain a prettier expression.

## Evidence and finish

Return the statement, assumptions, derivation steps or transformation log, exceptional regions, units check, independent examples, precision, and unresolved conditions. Finish when the symbolic result is accompanied by the domain under which it is valid and an independent cross-check. Formal proof or expert mathematical review remains a separate claim.

## Common failure modes

- Assuming variables are positive because sampled values were positive.
- Cancelling a factor that may be zero.
- Comparing principal branches as if they were globally interchangeable.
- Treating floating-point agreement as symbolic validity.
- Reporting a solver's empty condition set without checking its assumptions.

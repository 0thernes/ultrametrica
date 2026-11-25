# ADR-0001: Pure Lean 4.35.0 Formalization with Zero Mathlib Dependencies

- **Date:** 2026-11-21 (extended 2026-11-25 with `Spec`/`Challenge`/`Solution` 6-kernel comparator)
- **Status:** Accepted

## Context

Machine-checked mathematical claims in physics and discrete geometry frequently suffer from multi-gigabyte Mathlib cache downloads, toolchain fragility, opaque typeclass abstractions hiding definition mismatches, and single-kernel trust assumptions.

## Decision

Formalize all six core theorems (`120` exported declarations) directly in pure Lean 4 (`leanprover/lean4:v4.35.0`) with **zero Mathlib dependencies**, `autoImplicit = false`, `relaxedAutoImplicit = false`, zero `sorry`, zero `native_decide`, and zero custom axioms, paired with a statement-only `UltrametricaProofs/Spec.lean`, isolated `Challenge.lean`, and sorry-free `Solution.lean` checked by `lake comparator --paranoid` across 6 independent kernels.

## Alternatives Considered

1. **Full Mathlib4 (`Mathlib.Analysis.Normed`, `Padic`, `MeasureTheory`):** Rejected for the core repository because clean builds take minutes/gigabytes and complicate multi-kernel export (`nanoda`, `con-leche`, `con-ron`), though a separate optional Mathlib bridge remains possible in future work.
2. **Coq / Isabelle:** Rejected to keep a unified toolchain across all 0thernes research repositories.

## Consequences

- **Positive:** Clean builds complete in `< 10 seconds`; every definition in `Spec.lean` is human-auditable in 101 lines; all 58,743 exported declarations pass independent external checkers (`leanchecker-paranoid`, `con-leche`, `con-ron`, `nanoda`, `lean4lean`).
- **Trade-off:** Real-valued analytic continuum limits ($n \to \infty$ asymptotic convergence for $\alpha \ne 1$) are not formalized in Lean and remain explicitly outside the kernel boundary (verified numerically and statistically instead).

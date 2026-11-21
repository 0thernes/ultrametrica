# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`)** formal proof library verifying the core algebraic, ultrametric, symmetry, curvature, compacton-soliton, and linear-algebra stability theorems of **ULTRAMETRICA**.

- **Zero Mathlib dependency**: compiles from scratch in ~2–6 seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / custom axioms**: audited via standalone [`VerifyAxioms.lean`](VerifyAxioms.lean) (`lake env lean VerifyAxioms.lean`) and archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt).
- **Strict standard axiom allowlist**: all **36 audited declarations** depend strictly on a subset of `[propext, Classical.choice, Quot.sound]`, and 14 declarations depend on **no axioms at all**.

## Build & Audit

```bash
cd lean
lake clean
lake build
lake env lean VerifyAxioms.lean
```

## Module & Declaration Map (36 Audited Theorems)

| Module | Flagship Theorems | Count | Axioms Used |
|---|---|---:|---|
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | `ultrametric_isosceles_lt`, `ultrametric_two_longest_equal`, `pow_dvd_add`, `not_pow_dvd_add_of_dvd_left`, `monna_involution_p2_n6`..`p7_n2`, `complement_commutes_monna_p2_n6`..`p7_n2` | 12 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | `hilbert_sector_completeness`, `conjugate_sector_factor`, `conjugate_residue_mod_p`, `odd_prime_conjugate_sector_disjoint`, `even_prime_self_conjugate`, `odd_prime_doublet_bound` | 6 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | `btz_curvature_excess_identity`, `btz_flatter_than_ads_L3_L4`, `btz_critical_L5_p2`..`p5`, `btz_flatter_L5_for_p_ge_4`, `btz_more_negative_for_L_ge_6`, `gubser_massless_marginal`, `gubser_bf_bound_exact_square`, `gubser_bf_excess_nonneg`, `rt_odd_prime_horizon_dominance`, `rt_dyadic_criticality` | 12 | None or $\subseteq$ `[propext, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `horizon_edge_laplacian_psd`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_denominator_ne_zero` | 6 | `[propext]` or `[propext, Quot.sound]` |

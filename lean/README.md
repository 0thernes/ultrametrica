# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`)** formal proof library verifying the core algebraic, ultrametric, symmetry, curvature, compacton-soliton, and linear-algebra stability theorems of **ULTRAMETRICA**.

- **Zero Mathlib dependency**: compiles from scratch in ~2–18 seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `sorryAx`**: verified by `#print axioms` in [`UltrametricaProofs.lean`](UltrametricaProofs.lean) and archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt).
- **Zero custom axioms**: every declaration uses at most Lean's standard foundational axioms (`propext`, `Quot.sound`, `Classical.choice`), and several declarations depend on **no axioms at all**.

## Build & Verify

```bash
cd lean
lake clean
lake build
```

## Module & Declaration Map (24 Audited Theorems)

| Module | Flagship Theorems | Mathematical Content | Axioms Used |
|---|---|---|---|
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | `ultrametric_isosceles_lt`, `ultrametric_two_longest_equal`, `pow_dvd_add`, `not_pow_dvd_add_of_dvd_left`, `monna_involution_p2_n6`..`p7_n2`, `complement_commutes_monna_p2_n6`..`p7_n2` | Universal ultrametric isosceles triangle theorem; exact prime-power divisibility strong triangle law; exhaustive Monna-map involution $R_p^2 = I$ & digit-complement commutation $S R_p = R_p S$ certificates | None / `[propext, Quot.sound]` / `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | `hilbert_sector_completeness`, `conjugate_sector_factor`, `conjugate_residue_mod_p`, `odd_prime_conjugate_sector_disjoint`, `even_prime_self_conjugate`, `odd_prime_doublet_bound` | **Theorem I (Adelic Parity-Doubling Dichotomy)**: $1 + \sum_{s=0}^{n-1}(p-1)p^s = p^n$; exact valuation-preserving Fourier conjugacy $W_{s,m} \mapsto W_{s,p-m}$; strict disjointness $m \ne p - m$ for all odd $p \ge 3$ vs. self-conjugacy $1 = 2 - 1$ at $p = 2$ | None / `[propext, Quot.sound]` / `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | `btz_curvature_excess_identity`, `btz_flatter_than_ads_L3_L4`, `btz_critical_L5_p2`..`p5`, `btz_flatter_L5_for_p_ge_4`, `btz_more_negative_for_L_ge_6`, `gubser_bf_bound_exact_square`, `gubser_bf_excess_nonneg`, `rt_odd_prime_horizon_dominance` | **Theorem II (Tate-Curve BTZ Ollivier-Ricci Law & $L_c=5$ Trichotomy)**: exact cleared-denominator identity $(p+1)(p+2)(\kappa_{\text{BTZ}}-\kappa_{\text{AdS}}) = (p+1)\max(0,6-L)-4$; complete sign-inversion proof across all $p\ge 2, L\ge 3$; exact squared Gubser Breitenlohner-Freedman bound; RT horizon threshold | None / `[propext, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `horizon_edge_laplacian_psd`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_denominator_ne_zero` | **Theorems III & IV**: exact nonlinear compacton-soliton invariance for arbitrary $F(|\psi|^2)$; zero cross-talk on disjoint balls; Hermitian rank-1 gauge-coupled horizon edge positive-semidefiniteness; unconditional Sherman-Morrison non-singularity $1 + w q \ge 1$ | `[propext]` / `[propext, Quot.sound]` |

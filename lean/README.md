# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`)** formal proof library verifying the algebraic, ultrametric, symmetry, optimal-transport curvature, compacton-soliton, and complex Hermitian linear-algebra theorems of **ULTRAMETRICA (`v1.2.0`)**.

- **Zero Mathlib dependency**: clean-builds from scratch in ~2–3 seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / `native_decide` / `unsafe` / custom axioms**: audited via standalone [`VerifyAxioms.lean`](VerifyAxioms.lean) (`lake env lean VerifyAxioms.lean`) and archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt).
- **Strict standard axiom allowlist**: all **71 audited declarations** (`1,706` total lines across 6 `.lean` files) depend strictly on a subset of `[propext, Classical.choice, Quot.sound]`, with 7 declarations depending on **zero axioms at all**.

## Build & Audit

```bash
cd lean
lake clean
lake build
lake env lean VerifyAxioms.lean
```

## Module & Declaration Map (71 Audited Theorems)

| Module | Lines | Flagship Audited Theorems | Count | Axioms Used |
|---|---:|---|---:|---|
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | 303 | `ultrametric_isosceles_lt`, `ultrametric_two_longest_equal`, `pow_dvd_add`, `monna_involution_universal`, `complement_commutes_monna_universal`, `padic_ball_monna_contiguity`, + 8 concrete prime corollaries | 20 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | 358 | `hilbert_sector_completeness`, `subtreeShift_preserves_ultrametric_prefix`, `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `conjugate_residue_mod_p`, `odd_prime_conjugate_sector_disjoint`, `odd_prime_doublet_bound` | 15 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | 466 | First-principles Kantorovich primal-dual proofs (`ads_wasserstein_lower_bound`, `btz_dual_1lipschitz`, `btz_wasserstein_lower_bound`, `btz_primal_feasible`, `btz_primal_cost_exact`, `btz_kappa_from_wasserstein`), `btz_curvature_excess_identity`, complete $L_c=5$ trichotomy, `gubser_bf_excess_nonneg`, `rt_uniform_odd_prime_all_arcs`, `rt_cut_complement_symmetry` | 24 | None or $\subseteq$ `[propext, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | 481 | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_exact_identity`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | 12 | `[propext]` or `[propext, Quot.sound]` |

For the complete 1-to-1 claim-to-declaration map and explicit verification boundaries, see [`../docs/CLAIMS.md`](../docs/CLAIMS.md).

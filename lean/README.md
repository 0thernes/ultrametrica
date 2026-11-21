# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`)** formal proof library verifying the algebraic, ultrametric, symmetry, optimal-transport curvature, curved Gauss-Bonnet, compacton-soliton, and complex Hermitian linear-algebra theorems of **ULTRAMETRICA (`v1.3.0`)**.

- **Zero Mathlib dependency**: clean-builds from scratch in ~3 seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / `native_decide` / `unsafe` / custom axioms**: audited via standalone [`VerifyAxioms.lean`](VerifyAxioms.lean) (`lake env lean VerifyAxioms.lean`) and archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt).
- **Strict standard axiom allowlist**: all **101 audited declarations** (`2,267` total lines across 6 `.lean` files) depend strictly on a subset of `[propext, Classical.choice, Quot.sound]`, with 8 declarations depending on **zero axioms at all**.

## Build & Audit

```bash
cd lean
lake clean
lake build
lake env lean VerifyAxioms.lean
```

## Module & Declaration Map (101 Audited Theorems)

| Module | Lines | Flagship Audited Theorems | Count | Axioms Used |
|---|---:|---|---:|---|
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | 379 | `ultrametric_isosceles_lt`, `monna_involution_universal`, `monna_injective`, `monna_surjective`, `complement_commutes_monna_universal`, `padic_ball_monna_contiguity`, `padic_ball_cardinality`, concrete `bruhatTitsUltrametric` & `bruhatTits_leaves_isosceles`, + 8 prime corollaries | 26 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | 423 | `hilbert_sector_completeness`, `subtreeShift_preserves_ultrametric_prefix`, `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `odd_prime_conjugate_sector_disjoint`, universal modular picket-fence law (`picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`, `picket_fence_odd_prime_strictly_positive`, `picket_fence_dyadic_zero_gap`) | 23 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | 856 | Cycle-graph metric bridge (`btz_graph_metric_eq_classDist`), first-principles Kantorovich primal-dual proofs for pure AdS & BTZ ($L \ge 3$), $L_c=5$ trichotomy, monotonicity, Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, RT horizon bounds & complement symmetry, **Theorem V** curved Kantorovich primal-dual proofs (`curved_ads_gauss_bonnet_subcritical`, `curved_ads_supercritical_pinch_deficit`, `curved_ads_supercritical_strictly_negative`) | 40 | None or $\subseteq$ `[propext, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | 481 | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_exact_identity`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | 12 | `[propext]` or `[propext, Quot.sound]` |

For the complete 1-to-1 claim-to-declaration map and explicit verification boundaries, see [`../docs/CLAIMS.md`](../docs/CLAIMS.md).

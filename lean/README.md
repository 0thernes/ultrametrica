# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`, 6-Kernel Verified)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`)** formal proof library verifying the algebraic, ultrametric, symmetry, optimal-transport curvature, global multi-edge curved Gauss-Bonnet, universal holographic Ryu-Takayanagi Strong Subadditivity, compacton-soliton, and complex Hermitian linear-algebra theorems of **ULTRAMETRICA (`v1.4.0`)**.

- **Zero Mathlib dependency & Strict Options:** `autoImplicit = false` and `relaxedAutoImplicit = false` in [`lakefile.toml`](lakefile.toml); clean-builds from scratch in seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / `native_decide` / `unsafe` / `implemented_by` / `@[extern` / custom axioms** in `UltrametricaProofs.lean`, `UltrametricaProofs/*.lean`, and `Solution.lean` (`Challenge.lean` intentionally holds specification `sorry`s matched against sorry-free `Solution.lean`).
- **120 Audited Declarations + 8 Isolated Comparator Targets:** All **120 exported declarations** in [`VerifyAxioms.lean`](VerifyAxioms.lean) depend strictly on a subset of `[propext, Classical.choice, Quot.sound]` (archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt)).
- **6 Independent Kernels:** Verified locally across `Lean 4.35.0`, `leanchecker --fresh`, `leanchecker-paranoid --fresh`, `con-leche --verified`, `con-ron --verified`, and `nanoda_bin 0.4.19` (pruned 8-target export, `1,886` transitive declarations, strict `[propext, Quot.sound, Classical.choice]`), plus `lean4lean` via `bubblewrap`-sandboxed `lake comparator --config comparator.json --paranoid` in GitHub Actions CI.

## Build & Multi-Kernel Audit

```bash
cd lean
lake clean
lake build UltrametricaProofs Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
# On Linux with bubblewrap (enforced automatically in .github/workflows/ci.yml):
lake comparator --config comparator.json --paranoid
```

## Module & Declaration Map (`120` Audited Declarations + `8` Comparator Targets)

| Module | Flagship Audited Theorems | Count | Axioms Used |
|---|---|---:|---|
| [`UltrametricaProofs/Spec.lean`](UltrametricaProofs/Spec.lean) | Pure statement-only mathematical definitions (zero proofs, zero tactics) imported by `Challenge.lean` | — | Definitions only |
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | `ultrametric_isosceles_lt`, `monna_involution_universal`, `monna_injective`, `monna_surjective`, `complement_commutes_monna_universal`, `padic_ball_monna_contiguity`, `padic_ball_cardinality`, concrete `bruhatTitsUltrametric` & `bruhatTits_leaves_isosceles` | 26 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | `hilbert_sector_completeness`, `subtreeShift_preserves_ultrametric_prefix`, `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `odd_prime_conjugate_sector_disjoint`, universal modular picket-fence law (`picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`) | 23 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | Cycle-graph bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual pure AdS & BTZ ($L \ge 3$), $L_c=5$ trichotomy, Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, **Theorem V** curved Kantorovich Gauss-Bonnet, **Theorem V-Global** (`curved_gen_kappa_charge_decomp`, `global_multi_edge_vertex_charge_conservation`), **Theorem VI** (`rt_edge_cut_submodular`, `rt_cut_submodular`, `rt_strong_subadditivity`, `rt_subadditivity`) | 59 | None or $\subseteq$ `[propext, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_exact_identity`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | 12 | `[propext]` or `[propext, Quot.sound]` |
| [`Challenge.lean`](Challenge.lean) / [`Solution.lean`](Solution.lean) / [`comparator.json`](comparator.json) | All 8 isolated specification targets (`target_thm1_*`–`target_thm6_holographic_ssa` + decidable `target_nonvacuity_witnesses`) | 8 | Strictly `[propext, Quot.sound, Classical.choice]` across 6 kernels |

For the line-by-line statement-fidelity & non-vacuity audit, see [`../docs/statement-fidelity.md`](../docs/statement-fidelity.md) and [`../CLAIMS.md`](../CLAIMS.md).

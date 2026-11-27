# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`, Palomar `module`, 6-Kernel Verified)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`, Palomar `module` headers, all 11 `.lean` files strictly `< 1,000` lines)** formal proof library verifying the algebraic, ultrametric, symmetry, first-principles optimal-transport curvature (both BTZ and arbitrary-degree multi-edge inhomogeneous curved AdS with explicit entry non-negativity), global multi-edge curved Gauss-Bonnet, universal holographic Ryu-Takayanagi Strong Subadditivity, compacton-soliton, complex Hermitian linear-algebra, and adversarial false-variant refutation theorems of **ULTRAMETRICA (`v1.6.0`)**.

- **Zero Mathlib dependency & Strict Options:** `autoImplicit = false` and `relaxedAutoImplicit = false` in [`lakefile.toml`](lakefile.toml); every file begins with `module` (`public import` / `@[expose] public`); clean-builds from scratch in seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / `native_decide` / `unsafe` / `implemented_by` / `@[extern` / custom axioms** in `UltrametricaProofs.lean`, `UltrametricaProofs/*.lean`, and `Solution.lean` (`Challenge.lean` intentionally holds specification `sorry`s matched against sorry-free `Solution.lean`).
- **Honest 4-Bucket Accounting (`148` Audited Declarations — Zero Double-Counting):** All **148 exported declarations** in [`VerifyAxioms.lean`](VerifyAxioms.lean) depend strictly on a subset of `[propext, Classical.choice, Quot.sound]` (archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt)):
  1. **104** core mathematical theorems & corollaries across six proof modules;
  2. **29** zero-Mathlib infrastructure / helper lemmas (`revBase`, `RatQ`, `finSum`, `hermitianDot`);
  3. **5** adversarial false-variant refutations (`AdversarialTests.lean`);
  4. **10** isolated Palomar comparator target bindings (`Solution.lean` ↔ `Challenge.lean` — standalone re-verifications from pure `Spec.lean`, never double-counted as extra discoveries).
- **6 Independent Kernels & Interactive Blueprint:** Verified locally via `Lean 4.35.0` and `leanchecker --fresh`, and on every push in Linux CI across all 6 kernels (`lean4`, `leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin`) via `bubblewrap`-sandboxed `lake check --paranoid` and `lake comparator --config comparator.json --paranoid`. Explore the live dependency DAG at [https://0thernes.github.io/ultrametrica/web/blueprint.html](https://0thernes.github.io/ultrametrica/web/blueprint.html).

## Build & Multi-Kernel Audit

```bash
cd lean
lake clean
lake build UltrametricaProofs Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
# On Linux with bubblewrap (enforced automatically in .github/workflows/ci.yml):
lake check --paranoid
lake comparator --config comparator.json --paranoid
```

## Module & Declaration Map (`148` Audited Declarations: `138` Library + `10` Isolated Comparator Bindings)

| Module | Flagship Audited Theorems | Lines | Count | Axioms Used |
|---|---|---:|---:|---|
| [`UltrametricaProofs/Spec.lean`](UltrametricaProofs/Spec.lean) | Pure statement-only mathematical definitions (`revBase`, `picketVal`, `btzTransportCost`, `finSum`, `genBridgeTransportCost`, `rtCutCap`, `CInt`, `CVec`; zero proofs) imported by `Challenge.lean` | 136 | — | Definitions only |
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | `ultrametric_isosceles_lt`, `monna_involution_universal`, `monna_injective`, `monna_surjective`, `complement_commutes_monna_universal`, `padic_ball_monna_contiguity`, `padic_ball_cardinality`, concrete `bruhatTitsUltrametric` & `bruhatTits_leaves_isosceles` | 384 | 26 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | `hilbert_sector_completeness`, `subtreeShift_preserves_ultrametric_prefix`, `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `odd_prime_conjugate_sector_disjoint`, quantified `even_prime_self_conjugate`, universal modular picket-fence law | 430 | 23 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | Cycle-graph bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual pure AdS & BTZ ($L \ge 3$), $L_c=5$ trichotomy, Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, RT horizon bounds & complement symmetry, single-edge **Theorem V** curved Gauss-Bonnet & supercritical pinch deficit | 860 | 39 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/MultiEdgeHolography.lean`](UltrametricaProofs/MultiEdgeHolography.lean) | Zero-Mathlib `RatQ` & `finSum`, **Theorem V-Global** simultaneous multi-edge charge conservation & first-principles arbitrary-degree multi-edge Kantorovich primal-dual duality (with kernel-verified plan entry non-negativity), **Theorem VI** (`rt_cut_submodular`, `rt_strong_subadditivity`, `rt_subadditivity`) | 953 | 33 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_exact_identity`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | 468 | 12 | `[propext]` or `[propext, Quot.sound]` |
| [`UltrametricaProofs/AdversarialTests.lean`](UltrametricaProofs/AdversarialTests.lean) | 5 kernel-checked false-variant negations (`adv_dyadic_breaks_odd_doublet_protection`, `adv_btz_L5_not_universally_flatter`, `adv_supercritical_pinch_breaks_conservation`, `adv_overlapping_modes_violate_zero_crosstalk`, `adv_rt_ssa_reverse_inequality_false`) | 71 | 5 | None or `[propext, Quot.sound]` |
| [`Challenge.lean`](Challenge.lean) / [`Solution.lean`](Solution.lean) / [`comparator.json`](comparator.json) | All 10 isolated specification target bindings (incl. tight primal-dual $W_1$ existence in Targets 3 & 7, full $L$-dim Sherman-Morrison in Target 5, and 8/8 non-vacuity witnesses in Target 10) | 214 / 630 | 10 | Strictly `[propext, Quot.sound, Classical.choice]` across 6 kernels |

For the line-by-line statement-fidelity, 4-bucket classification & non-vacuity audit, see [`../docs/statement-fidelity.md`](../docs/statement-fidelity.md) and [`../CLAIMS.md`](../CLAIMS.md).

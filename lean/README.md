# ULTRAMETRICA — Lean 4 Machine-Checked Proof Suite (`v4.35.0`, Palomar `module`, 6-Kernel Verified)

This directory contains a **zero-dependency, pure Lean 4 (`leanprover/lean4:v4.35.0`, Palomar `module` headers, all 13 `.lean` files strictly `< 1,000` lines)** formal proof library verifying the algebraic, ultrametric, symmetry, first-principles optimal-transport curvature (both BTZ and arbitrary-degree multi-edge inhomogeneous curved AdS with explicit entry non-negativity), actual finite-graph edge-sum curved Gauss-Bonnet conservation (`FiniteGraphGaussBonnet.lean`), discrete radial ultrametric / Vladimirov convolution operator & Kozyrev-Haar wavelet eigenfunctions + $[D_K, J] = 0$ parity (`VladimirovOperator.lean`), universal holographic Ryu-Takayanagi Strong Subadditivity, compacton-soliton, complex Hermitian linear-algebra, and adversarial false-variant refutation theorems of **ULTRAMETRICA (`v1.7.0`)**.

- **Zero Mathlib dependency & Strict Options:** `autoImplicit = false` and `relaxedAutoImplicit = false` in [`lakefile.toml`](lakefile.toml); every file begins with `module` (`public import` / `@[expose] public`); clean-builds from scratch in seconds on any machine with Lean `v4.35.0`.
- **Zero `sorry` / `admit` / `native_decide` / `unsafe` / `implemented_by` / `@[extern` / custom axioms** in `UltrametricaProofs.lean`, `UltrametricaProofs/*.lean`, and `Solution.lean` (`Challenge.lean` intentionally holds specification `sorry`s matched against sorry-free `Solution.lean`).
- **Honest 4-Bucket Accounting (`202` Audited Declarations — Zero Double-Counting):** All **202 exported declarations** in [`VerifyAxioms.lean`](VerifyAxioms.lean) depend strictly on a subset of `[propext, Classical.choice, Quot.sound]` (archived in [`../results/lean4-audit.txt`](../results/lean4-audit.txt)):
  1. **127** core mathematical theorems & corollaries across **8 proof modules**;
  2. **56** zero-Mathlib infrastructure / helper lemmas (`revBase`, `RatQ`, `finSum`, `padicVal*`, `hermitianDot`);
  3. **7** adversarial false-variant refutations (`AdversarialTests.lean`);
  4. **12** isolated Palomar comparator target bindings (`Solution.lean` ↔ `Challenge.lean` — standalone re-verifications from pure `Spec.lean`, never double-counted as extra discoveries).
- **6 Independent Kernels, Live Negative Tamper Gate & Interactive Blueprint:** Verified locally via `Lean 4.35.0`, `leanchecker --fresh`, and `python scripts/test_lean_negative.py` (confirming injected `sorry` and weakened `Challenge.lean` targets are actively rejected), and on every push in Linux CI across all 6 kernels (`lean4`, `leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin`) via `bubblewrap`-sandboxed `lake check --paranoid`, `lake comparator --config comparator.json --paranoid`, and `python3 scripts/test_lean_negative.py --with-comparator`. Explore the live dependency DAG at [https://0thernes.github.io/ultrametrica/web/blueprint.html](https://0thernes.github.io/ultrametrica/web/blueprint.html).

## Build, Multi-Kernel Audit & Negative Tamper Gate

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
cd ..
python scripts/test_lean_negative.py --with-comparator
```

## Module & Declaration Map (`202` Audited Declarations: `190` Library + `12` Isolated Comparator Bindings)

| Module | Flagship Audited Theorems | Lines | Count | Axioms Used |
|---|---|---:|---:|---|
| [`UltrametricaProofs/Spec.lean`](UltrametricaProofs/Spec.lean) | Pure statement-only mathematical definitions (`revBase`, `picketVal`, `btzTransportCost`, `finSum`, `genBridgeTransportCost`, `RatQ`, `WeightedEdge`, `padicDistVal`, `ultrametricOp`, `kozyrevHaar`, `vecRev`, `rtCutCap`, `CInt`, `CVec`; zero proofs) imported by `Challenge.lean` | 205 | — | Definitions only |
| [`UltrametricaProofs/Basic.lean`](UltrametricaProofs/Basic.lean) | `ultrametric_isosceles_lt`, `monna_involution_universal`, `monna_injective`, `monna_surjective`, `complement_commutes_monna_universal`, `padic_ball_monna_contiguity`, `padic_ball_cardinality`, concrete `bruhatTitsUltrametric` & `bruhatTits_leaves_isosceles` | 384 | 26 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdelicSymmetry.lean`](UltrametricaProofs/AdelicSymmetry.lean) | `hilbert_sector_completeness`, `subtreeShift_preserves_ultrametric_prefix`, `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `odd_prime_conjugate_sector_disjoint`, quantified `even_prime_self_conjugate`, universal modular picket-fence law | 430 | 23 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/HolographyCurvature.lean`](UltrametricaProofs/HolographyCurvature.lean) | Cycle-graph bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual pure AdS & BTZ ($L \ge 3$), $L_c=5$ trichotomy, Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, RT horizon bounds & complement symmetry, single-edge **Theorem V** curved Gauss-Bonnet & supercritical pinch deficit | 863 | 39 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/MultiEdgeHolography.lean`](UltrametricaProofs/MultiEdgeHolography.lean) | Zero-Mathlib `RatQ` & `finSum`, **Theorem V-Global** simultaneous multi-edge charge conservation & first-principles arbitrary-degree multi-edge Kantorovich primal-dual duality (with kernel-verified plan entry non-negativity), **Theorem VI** (`rt_cut_submodular`, `rt_strong_subadditivity`, `rt_subadditivity`) | 955 | 33 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/FiniteGraphGaussBonnet.lean`](UltrametricaProofs/FiniteGraphGaussBonnet.lean) | **NEW (`v1.7.0`, closes F70):** Exact finite-graph edge-sum curved Gauss-Bonnet conservation by direct double-counting induction over arbitrary `List (WeightedEdge n)` on `Fin n` (`finite_graph_half_charge_double_count`, `finite_graph_curved_gauss_bonnet_sum`, `finite_graph_subcritical_gauss_bonnet_conserved`, `finite_graph_curved_eq_flat_subcritical`) | 464 | 24 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/SolitonAndSolver.lean`](UltrametricaProofs/SolitonAndSolver.lean) | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one`, `sherman_morrison_exact_identity`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | 470 | 12 | `[propext]` or `[propext, Quot.sound]` |
| [`UltrametricaProofs/VladimirovOperator.lean`](UltrametricaProofs/VladimirovOperator.lean) | **NEW (`v1.7.0`, closes F71):** Exact finite-level $p$-adic valuation (`padicDistVal_strong_tri`, `padicDistVal_isosceles_eq`, `padicDistVal_complement`), actual discrete radial ultrametric/Vladimirov operator `ultrametricOp`, actual discrete Kozyrev-Haar wavelets (`kozyrevHaar_zero_mean`, `kozyrevHaar_vladimirov_eigenfunction`), and `[D_K, J] = 0` parity preservation (`ultrametricOp_commutes_vecRev`, `j_commuting_preserves_parity`) | 874 | 26 | None or $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| [`UltrametricaProofs/AdversarialTests.lean`](UltrametricaProofs/AdversarialTests.lean) | 7 kernel-checked false-variant negations across Theorems I–VII (incl. supercritical finite-graph conservation violation & non-zero-mean wavelet eigenfunction breakdown) | 117 | 7 | None or `[propext, Quot.sound]` |
| [`Challenge.lean`](Challenge.lean) / [`Solution.lean`](Solution.lean) / [`comparator.json`](comparator.json) | All 12 isolated specification target bindings (incl. Targets 11 & 12 for finite-graph Gauss-Bonnet & discrete Vladimirov/Kozyrev, plus 10/10 non-vacuity witnesses in Target 10) | 278 / 856 | 12 | Strictly `[propext, Quot.sound, Classical.choice]` across 6 kernels |

For the line-by-line statement-fidelity, 4-bucket classification & non-vacuity audit, see [`../docs/statement-fidelity.md`](../docs/statement-fidelity.md) and [`../CLAIMS.md`](../CLAIMS.md).

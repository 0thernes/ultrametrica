# ULTRAMETRICA

> **A zero-dependency, real-time laboratory for a discrete $p$-adic AdS/CFT (Bruhat-Tits tree) holography model: Tate-curve BTZ quotients with horizon flux, adelic parity symmetries, Ollivier-Ricci curvature and Gauss-Bonnet charge identities, graph-cut strong subadditivity, 48 kHz prime-power AudioWorklet sonification, and 148 audited zero-Mathlib Lean 4 (`v4.35.0`, Palomar `module`) declarations about the discrete model.** All 148 declarations are kernel-checked by Lean (`lake build`, `leanchecker`, and Ubuntu CI `lake check --paranoid`); the 10 isolated comparator targets in [`lean/comparator.json`](lean/comparator.json) (and their dependency closure) are also checked across 6 independent kernels via `lake comparator --paranoid` in Ubuntu CI. No physical, continuum, or quantum-gravity statement is proved, and no open problem is retired.

> **Statement-audit alignment (`2026-11-26`, integrated in `v1.6.0`):** Following the independent 2026-11-26 statement audit ([`ERRATA.md`](ERRATA.md), [audit log](https://github.com/0thernes/0thernes-research-archive/blob/main/docs/reviews/2026-11-26-statement-audit.md)), `"Quantum Gravity"` and `"Unconditional"` wording have been withdrawn across code, paper, and docs, every headline claim below separates what Lean proves from what rests on exact-rational, numerical, or paper-level checks, and `v1.6.0` directly resolved the formal issues flagged in that audit (adding kernel-verified primal entry non-negativity to `gen_bridge_primal_sub/sup_optimal`, quantifying `even_prime_self_conjugate`, removing `rt_odd_prime_horizon_dominance`, strengthening `Challenge.lean` Targets 1/3/5/7/10, and updating `paper/main.tex` and Lean docstrings).

[![CI Verification](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml/badge.svg)](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml)
[![Live Observatory](https://img.shields.io/badge/Live_Observatory-GitHub_Pages-38bdf8)](https://0thernes.github.io/ultrametrica/)
[![Lean Proof Blueprint](https://img.shields.io/badge/Lean_Blueprint-Interactive_DAG-10b981)](https://0thernes.github.io/ultrametrica/web/blueprint.html)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0006--8168--9648-A6CE39.svg)](https://orcid.org/0009-0006-8168-9648)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(148_Audited,_6--Kernel_Comparator)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Real Source Mutants](https://img.shields.io/badge/Real_Source_Mutants-8%2F8_Killed-10b981)](test/mutants.mjs)
[![License: Cosmogonic Non-Commercial](https://img.shields.io/badge/License-Cosmogonic_Non--Commercial-0ea5e9)](LICENSE)

**Author:** Alexander Stephen Donahue (`Independent Researcher, Spokane, WA, USA` · project handle [`0thernes`](https://0thernes.art) · `0_0@0thernes.art` · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.6.0` · **Status:** `active` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [`LICENSE`](LICENSE) and [`LEGAL.md`](LEGAL.md))  
**Live Interactive WebGL2 + 48 kHz AudioWorklet Observatory:** **[https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)** · **Interactive Lean 4 Proof Blueprint:** **[https://0thernes.github.io/ultrametrica/web/blueprint.html](https://0thernes.github.io/ultrametrica/web/blueprint.html)**

![ULTRAMETRICA Live WebGL2 Bruhat-Tits AdS & Rotating Kerr-BTZ Observatory](docs/media/ultrametrica-observatory.png)

---

## 5-Second Independent Proof Verification (`#print axioms` & Multi-Kernel Audit)

Verify all **148 audited pure Lean 4 (`v4.35.0`, Palomar `module`) declarations** across 6 proof modules (`< 1,000` lines each, zero Mathlib, `autoImplicit = false`, no `sorry` outside the statement-only `Challenge.lean`, zero `native_decide`) — transparently accounted with **zero double-counting** as **104 core theorems & corollaries**, **29 zero-Mathlib helper lemmas**, **5 adversarial false-variant refutations** (`AdversarialTests.lean`), and **10 isolated `Spec`/`Challenge`/`Solution` comparator bindings** (standalone re-verifications of the headline targets from pure `Spec.lean`, never double-counted as separate mathematical discoveries). Seven small `CInt` helper lemmas (`add_smul`, `add_zero_left`, `add_zero_right`, `int_sq_nonneg`, `normSq_nonneg`, `normSq_zero`, `smul_zero`) are not listed separately in `VerifyAxioms.lean` and are transitively checked via the audited theorems invoking them:

```bash
cd lean && lake build UltrametricaProofs Challenge Solution && lake env lean VerifyAxioms.lean
# On Linux with bubblewrap (also enforced on every push in GitHub Actions CI):
lake check --paranoid && lake comparator --config comparator.json --paranoid
```

Verbatim kernel output (character-checked against [`results/lean4-audit.txt`](results/lean4-audit.txt) by [`scripts/check_readme_axioms.py`](scripts/check_readme_axioms.py)):

```text
'Ultrametrica.monna_involution_universal' depends on axioms: [propext, Classical.choice, Quot.sound]
'Ultrametrica.odd_prime_conjugate_sector_disjoint' depends on axioms: [propext, Quot.sound]
'Ultrametrica.picket_fence_even_gap' depends on axioms: [propext, Quot.sound]
'Ultrametrica.btz_kappa_from_wasserstein' depends on axioms: [propext, Quot.sound]
'Ultrametrica.gen_bridge_wasserstein_lower_bound_sub' depends on axioms: [propext, Quot.sound]
'Ultrametrica.gen_bridge_primal_sub_optimal' depends on axioms: [propext, Classical.choice, Quot.sound]
'Ultrametrica.global_multi_edge_vertex_charge_conservation' depends on axioms: [propext, Quot.sound]
'Ultrametrica.rt_strong_subadditivity' depends on axioms: [propext, Quot.sound]
'Ultrametrica.multi_ball_kozyrev_soliton_list' depends on axioms: [propext]
'Ultrametrica.sherman_morrison_exact_identity' depends on axioms: [propext, Quot.sound]
'Ultrametrica.Adversarial.adv_rt_ssa_reverse_inequality_false' does not depend on any axioms
'Ultrametrica.ComparatorTarget.target_thm5_kantorovich_dual' depends on axioms: [propext, Classical.choice, Quot.sound]
'Ultrametrica.ComparatorTarget.target_adversarial_refutations' depends on axioms: [propext, Quot.sound]
```

All 148 declarations are kernel-checked by Lean (`lake build`, `leanchecker --fresh`), and Ubuntu GitHub Actions CI additionally enforces `lake check --paranoid` on the full package plus 6-kernel `lake comparator --config comparator.json --paranoid` (`lean4`, `leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin` inside a Linux `bubblewrap` sandbox) across the **10 isolated comparator targets and their dependency closure**. See [`docs/statement-fidelity.md`](docs/statement-fidelity.md) and the live **[Interactive Proof Blueprint](https://0thernes.github.io/ultrametrica/web/blueprint.html)**.

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen AMS-LaTeX Publication Preprint PDF** (5 vector figures, zero warnings; standalone arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[CLAIMS.md](CLAIMS.md)** | **1-to-1 Claim & Falsification Ledger** (`kernel-checked`, `exact-rational`, `pre-registered statistical`, `numerical_approximation`, `prior work` + *What Would Prove Us Wrong*) |
| **[LIMITATIONS.md](LIMITATIONS.md)** | Honest scope boundaries, literal-vs-metaphor table, finite-$N$ bounds & non-claims |
| **[DEVIATIONS.md](DEVIATIONS.md)** | Append-only pre-registration deviation & non-pseudoreplicated matrix-level sensitivity ledger (Playbook Gold #18) |
| **[docs/MEGA_ATLAS_CROSSCHECK.md](docs/MEGA_ATLAS_CROSSCHECK.md)** | Honest cross-check against all `1,900` open problems in `0thernes/unsolved-problems-mega-atlas` (**`0/1,900` full solutions**; discrete sub-results on `SUB-032`) |
| **[docs/preregistration.md](docs/preregistration.md)** | Git-sealed preregistration (`c171b1b`) for confirmatory 20-seed Experiment I ([`results/stats-eval.json`](results/stats-eval.json)) |
| **[docs/statement-fidelity.md](docs/statement-fidelity.md)** | Line-by-line Lean 4 statement-fidelity, non-vacuity (`8/8` targets) & 6-kernel audit matrix |
| **[docs/LITERATURE_SEARCH.md](docs/LITERATURE_SEARCH.md)** | Dated prior-art audit & live Crossref DOI / retraction verification log (`18/18` DOIs HTTP 200, `0` retractions) |
| **[docs/reviews/2026-11-26-hardening-cycles-v160.md](docs/reviews/2026-11-26-hardening-cycles-v160.md)** | `v1.6.0` 3-Cycle forensic audit dossier (`F37`–`F65` across all 10 classes) + prior [`v1.4`–`v1.5` dossier](docs/reviews/2026-11-25-hardening-cycles.md) |
| **[REPLICATION.md](REPLICATION.md)** | Clean-clone reproduction commands, tolerances & dated replication log |
| **[docs/architecture.md](docs/architecture.md)** | System architecture with Mermaid diagram + [`docs/adr/`](docs/adr/README.md) (ADR-0001..0005) |
| **[docs/benchmarks.md](docs/benchmarks.md)** | Hardware-tagged performance budgets (`0.749 ms` coupled BTZ frame, `495.9×` FFT speedup) |
| **[docs/threat-model.md](docs/threat-model.md)** | STRIDE threat model mapped 1-to-1 to [`test/server.mjs`](test/server.mjs), [`test/fuzz.mjs`](test/fuzz.mjs), [`test/concurrency.mjs`](test/concurrency.mjs) & CI security gates |
| **[SUMMARY.md](SUMMARY.md)** · **[ERRATA.md](ERRATA.md)** · **[INDEX.md](INDEX.md)** | Executive summary, correction/withdrawal ledger, and complete repository index |

---

## Six Core Results: What Lean Proves and What Is Checked Otherwise

Each result below separates its kernel-checked Lean 4 part (concerning the repository's own discrete definitions) from the exact-rational (`scripts/verify_exact.py`), numerical (`32` Node suites, `8/8` real source mutants, `1,000+` Python oracle queries), or pre-registered statistical checks. Row-by-row detail is in [`CLAIMS.md`](CLAIMS.md) and [`docs/statement-fidelity.md`](docs/statement-fidelity.md).

1. **Theorem I & Prop. 4.2 — Monna digit reversal, valuation-residue sectors & modular picket-fence law** ([`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean), [`docs/preregistration.md`](docs/preregistration.md)):
   *Lean:* universal base-$p$ Monna digit-reversal involution, bijectivity, and ball contiguity ($p \ge 2, x < p^n$; formalizing Monna 1970); subtree-shift ultrametric prefix preservation; sector-index separation $m \ne p - m$ for odd $p$, $1 \le m < p$, and quantified $\forall m, 1 \le m < 2 \to m = 2 - m$ at $p = 2$; monotonicity and alternating gaps $p - 2m, 2m$ of the closed-form folded-frequency sequence `picketSeq`.
   *Not in Lean:* $H_\theta$ and $D_p^\alpha$ are not defined in Lean. Block diagonalization of $H_\theta$ into $1 + n(p-1)$ sectors $W_{s,m}$ (`leak <= 1.8e-14` up to $N = 625$), odd-prime doublet counts vs. $p = 2$ lifting, and the link between `picketSeq` and eigenvalues are verified via exact-rational and floating-point checks. Pre-registered Experiment I (`20` seeds vs. GUE/GOE controls; sensitivity extensions logged in [`DEVIATIONS.md`](DEVIATIONS.md)) confirms all **4/4 hypotheses** at primary `p_holm = 0.0004`, Mann-Whitney $p \le 4.8\times 10^{-7}$, non-pseudoreplicated matrix-level Wilcoxon `p_holm = 7.63e-6` (`20/20` seeds each, 95% bootstrap CIs for all 3 effect sizes excluding `0`), locking sectors near $r_0(p,m) = \min(2m, p-2m)/\max(2m, p-2m)$ ($W_{0,1} \approx 2/3$ vs. sibling $W_{0,2} \approx 1/4$ at $p=5, N=625$).
2. **Theorem II — Tate-curve BTZ Ollivier-Ricci law & $L_c = 5$ trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   *Lean:* for the hand-coded 3-class reduction of horizon neighborhoods (`opp`, `back`, `child`, masses $M, M, pM$; class distances checked against cycle offsets by `btz_graph_metric_eq_classDist`), every non-negative coupling costs at least $M(3p + 2 - \max(0, 6-L))$ and an explicit feasible non-negative primal plan attains equality (both sides frozen in `Challenge.lean` Target 3), yielding $\kappa_{\mathrm{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ for all $p \ge 2, L \ge 3$ in the reduced model.
   *Not in Lean:* the symmetry reduction from full neighbor-set couplings to 3-class couplings is a paper-level argument, cross-checked with zero rounding error across `45` full-graph exact `Fraction` horizons (`verify_exact.py`).
3. **Theorem III — Disjoint Kozyrev packets & pointwise nonlinearity splitting** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   *Lean:* over $\mathbb{Z}[i]$, for any finite list of pairwise-disjoint constant-modulus packets $\psi_r$ and any $F : \mathbb{Z} \to \mathbb{Z}$, $F(|\sum_r \psi_r|^2)\sum_r \psi_r = \sum_r F(c_r)\psi_r$ pointwise; `kozyrev_exact_nonlinear_soliton` takes an abstract operator $D$ with an assumed eigenfunction property.
   *Not in Lean:* $D_p^\alpha$, Kozyrev wavelets, and PDE time evolution are not defined in Lean; radiation-free compacton-soliton dynamics (`0.00%` leakage up to $g = 500$) and $\alpha$-scaled multi-scale self-trapping are paper arguments checked numerically (Exp C & F).
4. **Theorem IV — Positive-definite Rank-1 Kerr-BTZ bulk solver, flux parity & BF stability margin** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   *Lean:* $w_{L-1} u u^\dagger \succeq 0$ quadratic expansion, the integer inequality $1 \le 1 + wq$ under explicit hypotheses $w \ge 0, q \ge 0$ (`sherman_morrison_denominator_ge_one`; holds when $T \succ 0$), an abstract arbitrary-dimension $L$ cleared-denominator complex Hermitian Sherman-Morrison identity (frozen in `Challenge.lean` Target 5), and edge-level flux parity $E(-\Omega) = E(\Omega), J(-\Omega) = -J(\Omega)$.
   *Not in Lean:* the $O(V)$ Schur-complement solver, positivity of $T$, and BF stability down to $\Delta = 0.5001, \Omega = \pi$ (`5.38e-15` residual) are checked via exact $\mathbb{Q}(i)$ Python verification (residual $= 0$) and numerical suites (Exp D & H).
5. **Theorems V & V-Global — Single-edge & multi-edge curved AdS discrete Gauss-Bonnet charge identities** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean), [`MultiEdgeHolography.lean`](lean/UltrametricaProofs/MultiEdgeHolography.lean)):
   *Lean:* for the reduced arbitrary-degree bridge-edge transport cost model (`genBridgeTransportCost`), universal subcritical and supercritical Kantorovich lower bounds hold and explicit **kernel-verified non-negative** feasible primal plans attain exact equality in BOTH regimes (closed in `v1.6.0` and frozen in `Challenge.lean` Target 7); `curved_gen_kappa_charge_decomp` splits curvature into vertex half-charges minus deficit; and `global_multi_edge_vertex_charge_conservation` proves per-vertex conservation $\sum -(p-1)w_e/W_u = -(p-1)$ over arbitrary positive-sum integer weight lists.
   *Not in Lean:* no Lean theorem sums curvature over the edges of an explicit finite tree; the global zero-excess / negative-deficit sum ($-2\sum \max(0, w_e/W_u + w_e/W_v - 1)$) is a paper-level assembly cross-checked over `69` single/multi-edge exact `Fraction` plans and `1,000` random JS trees (`< 1e-11`).
6. **Theorem VI — Graph-cut strong subadditivity** ([`MultiEdgeHolography.lean`](lean/UltrametricaProofs/MultiEdgeHolography.lean)):
   *Lean:* on arbitrary finite `Nat`-weighted edge lists and `Bool` vertex sets, for disjoint boundary regions $A, C$, $S(A \cup B \cup C) + S(B) \le \mathrm{cap}(W_{AB}) + \mathrm{cap}(W_{BC})$ for all homologous cuts $W_{AB}, W_{BC}$, under the explicit hypotheses that $S(A \cup B \cup C)$ and $S(B)$ lower-bound homologous cut capacities. Discrete formalization of Headrick & Takayanagi (Phys. Rev. D 76, 106013, 2007; no priority claimed), checked over `4,352` exhaustive brute-force partitions and `1,000` random JS graphs.

---

## Quickstart

Requires **Node.js $\ge 20$** (zero `npm install` needed — zero external runtime dependencies). Optional toolchains: Python `3.11+` (stdlib only), Lean `v4.35.0`, Tectonic `0.15+`.

```bash
git clone https://github.com/0thernes/ultrametrica.git
cd ultrametrica
npm run verify:all
```

## Usage

```bash
# 1. Run all 32 Node test suites (10 theorems, 8/8 real source mutants, 3,400+ properties, 1,000 fuzz, 3 concurrency/AudioWorklet race, server EIO, golden)
npm run verify:all

# 2. Run all 3 standalone engine examples (see examples/README.md)
npm run examples

# 3. Run independent textbook Python oracle (1,000+ cases), README/blueprint/citation guards & exact-rational audit
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
python scripts/check_citations.py
python scripts/check_blueprint.py
python scripts/verify_exact.py --check-checksums

# 4. Reproduce Exp A-H discovery benchmarks, perf benchmarks & pre-registered Experiment I
npm run discover && npm run bench && npm run stats

# 5. Launch the hardened local WebGL2 + 48 kHz AudioWorklet Observatory (health: GET /healthz)
PORT=4173 node server.mjs
# Open http://127.0.0.1:4173 (or visit https://0thernes.github.io/ultrametrica/)
```

Or run the entire verification, Lean 4, and LaTeX reproduction pipeline with [`justfile`](justfile):

```bash
just reproduce
```

---

## Limitations

See [`LIMITATIONS.md`](LIMITATIONS.md) for the complete scope boundary and literal-vs-metaphor table:

- **No empirical physics claim:** All theorems are strictly mathematical and computational on finite $p$-adic groups $\mathbb{Z}_p / p^n\mathbb{Z}_p$ and finite weighted Bruhat-Tits / Tate-curve graphs.
- **Zero full Mega-Atlas solutions (`0 / 1,900`):** ULTRAMETRICA does not solve the continuum limit or full adelic unification of `SUB-032` ([`docs/MEGA_ATLAS_CROSSCHECK.md`](docs/MEGA_ATLAS_CROSSCHECK.md)).
- **Not peer-reviewed:** Manuscripts are independent preprints; Lean proofs certify logical validity of formalized statements within the stated kernel boundary ([`docs/statement-fidelity.md`](docs/statement-fidelity.md)), while floating-point engine evaluations are explicitly tagged `numerical_approximation`.
- **Finite-$N$ bounds:** `PadicSpace` caps $N = p^n \le 65{,}536$; Theorem V-Global applies to strictly interior vertices of full degree $p + 1$; $n \to \infty$ analytic convergence for $\alpha \ne 1$ is verified up to $N = 625$ rather than proved in Lean.

---

## Legal & Licensing

Copyright © 2026 **Alexander Stephen Donahue (`0thernes`)** `<0_0@0thernes.art>` (Independent Researcher, Spokane, WA, USA; ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).  
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([`LICENSE`](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [`LEGAL.md`](LEGAL.md) for AI-tool disclosure, export-control self-screen (15 CFR § 734.8), ownership, and [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md) for the OSI licensing trade-off.

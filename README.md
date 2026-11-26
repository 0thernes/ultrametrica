# ULTRAMETRICA

> **A zero-dependency, real-time laboratory for a discrete $p$-adic AdS/CFT (Bruhat-Tits tree) holography model: Tate-curve BTZ quotients with horizon flux, adelic parity symmetries, Ollivier-Ricci curvature and Gauss-Bonnet charge identities, graph-cut strong subadditivity, 48 kHz prime-power AudioWorklet sonification, and 149 zero-Mathlib Lean 4 (`v4.35.0`, Palomar `module`) declarations about the discrete model.** The Lean declarations are kernel-checked by Lean (`lake build`, `leanchecker`); the 10 comparator targets in [`lean/comparator.json`](lean/comparator.json) were also accepted by 6 independent kernels in Ubuntu CI. No physical, continuum or quantum-gravity statement is proved, and no open problem is retired.

> **Statement audit (2026-11-26).** An independent statement audit found that several headline results below are only partly inside the Lean kernel: Lean does not define the Vladimirov operator $D_p^\alpha$, Kozyrev wavelets, the hybrid Hamiltonian $H_\theta$, time evolution, or the $O(V)$ bulk solver, and the global (tree-level) Gauss-Bonnet sum is not formalized. Each item below now says which part is kernel-checked and which part rests on exact-rational or numerical checks. See [`ERRATA.md`](ERRATA.md) and the [audit log](https://github.com/0thernes/0thernes-research-archive/blob/main/docs/reviews/2026-11-26-statement-audit.md).

[![CI Verification](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml/badge.svg)](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml)
[![Live Observatory](https://img.shields.io/badge/Live_Observatory-GitHub_Pages-38bdf8)](https://0thernes.github.io/ultrametrica/)
[![Lean Proof Blueprint](https://img.shields.io/badge/Lean_Blueprint-Interactive_DAG-10b981)](https://0thernes.github.io/ultrametrica/web/blueprint.html)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0006--8168--9648-A6CE39.svg)](https://orcid.org/0009-0006-8168-9648)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(149_Decls,_6--Kernel_Comparator)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Planted Mutants](https://img.shields.io/badge/Planted_Mutants-8%2F8_Killed-10b981)](test/mutants.mjs)
[![License: Cosmogonic Non-Commercial](https://img.shields.io/badge/License-Cosmogonic_Non--Commercial-0ea5e9)](LICENSE)

**Author:** Alexander Stephen Donahue (`Independent Researcher, Spokane, WA, USA` · project handle [`0thernes`](https://0thernes.art) · `0_0@0thernes.art` · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.5.0` · **Status:** `active` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [`LICENSE`](LICENSE) and [`LEGAL.md`](LEGAL.md))  
**Live Interactive WebGL2 + 48 kHz AudioWorklet Observatory:** **[https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)** · **Interactive Lean 4 Proof Blueprint:** **[https://0thernes.github.io/ultrametrica/web/blueprint.html](https://0thernes.github.io/ultrametrica/web/blueprint.html)**

![ULTRAMETRICA Live WebGL2 Bruhat-Tits AdS & Rotating Kerr-BTZ Observatory](docs/media/ultrametrica-observatory.png)

---

## 5-Second Independent Proof Verification (`#print axioms` & Multi-Kernel Audit)

Verify the **149 audited Lean 4 (`v4.35.0`, Palomar `module`) declarations** (`139` core theorems across 5 modules incl. `AdversarialTests.lean` + `10` isolated `Spec`/`Challenge`/`Solution` targets; zero Mathlib, `autoImplicit = false`, no `sorry` outside the statement-only `Challenge.lean`, zero `native_decide`) in seconds. The count includes literal or definitional identities used as sanity witnesses (for example `even_prime_self_conjugate : (1 : Nat) = 2 - 1` and `btz_critical_L5_p2`, proved by `decide`), and 7 public helper lemmas (`add_smul`, `add_zero_left`, `add_zero_right`, `int_sq_nonneg`, `normSq_nonneg`, `normSq_zero`, `smul_zero`) are not listed by name in `VerifyAxioms.lean`.

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
'Ultrametrica.gen_bridge_primal_sub_optimal' depends on axioms: [propext, Quot.sound]
'Ultrametrica.global_multi_edge_vertex_charge_conservation' depends on axioms: [propext, Quot.sound]
'Ultrametrica.rt_strong_subadditivity' depends on axioms: [propext, Quot.sound]
'Ultrametrica.multi_ball_kozyrev_soliton_list' depends on axioms: [propext]
'Ultrametrica.sherman_morrison_exact_identity' depends on axioms: [propext, Quot.sound]
'Ultrametrica.Adversarial.adv_rt_ssa_reverse_inequality_false' does not depend on any axioms
'Ultrametrica.ComparatorTarget.target_thm5_kantorovich_dual' depends on axioms: [propext, Classical.choice, Quot.sound]
'Ultrametrica.ComparatorTarget.target_adversarial_refutations' depends on axioms: [propext, Quot.sound]
```

All declarations are kernel-checked by Lean (`lake build`, `leanchecker --fresh`). In Ubuntu GitHub Actions CI (run [`45747436539`](https://github.com/0thernes/ultrametrica/actions/runs/45747436539) at `v1.5.0`), `lake check --paranoid` also ran, and `lake comparator --config comparator.json --paranoid` (`bubblewrap` sandbox) accepted the 10 comparator targets and their dependency closure with 6 independent kernels (`lean4`, `leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin`). The comparator step needs Linux `bubblewrap` and was not re-run in the 2026-11-26 audit. See [`docs/statement-fidelity.md`](docs/statement-fidelity.md) and the live **[Interactive Proof Blueprint](https://0thernes.github.io/ultrametrica/web/blueprint.html)**.

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen AMS-LaTeX Publication Preprint PDF** (5 vector figures, zero warnings; standalone arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[CLAIMS.md](CLAIMS.md)** | **1-to-1 Claim & Falsification Ledger** (`kernel-checked`, `exact-rational`, `pre-registered statistical`, `numerical`, `prior work` + *What Would Prove Us Wrong*) |
| **[LIMITATIONS.md](LIMITATIONS.md)** | Honest scope boundaries, literal-vs-metaphor table, finite-$N$ bounds & non-claims |
| **[docs/MEGA_ATLAS_CROSSCHECK.md](docs/MEGA_ATLAS_CROSSCHECK.md)** | Honest cross-check against all `1,900` open problems in `0thernes/unsolved-problems-mega-atlas` (**`0/1,900` full solutions**; discrete sub-results on `SUB-032`) |
| **[docs/preregistration.md](docs/preregistration.md)** | Git-sealed preregistration (`c171b1b`) for confirmatory 20-seed Experiment I ([`results/stats-eval.json`](results/stats-eval.json)) |
| **[docs/statement-fidelity.md](docs/statement-fidelity.md)** | Line-by-line Lean 4 statement-fidelity, non-vacuity & 6-kernel audit matrix (10 comparator targets) |
| **[docs/LITERATURE_SEARCH.md](docs/LITERATURE_SEARCH.md)** | Dated prior-art audit & live Crossref DOI / retraction verification log (`18/18` DOIs HTTP 200, `0` retractions) |
| **[docs/reviews/2026-11-25-hardening-cycles.md](docs/reviews/2026-11-25-hardening-cycles.md)** | 3-Cycle deep hardening & red-team dossier (`F01`–`F36` classified into the exact 10 classes) |
| **[REPLICATION.md](REPLICATION.md)** | Clean-clone reproduction commands, tolerances & dated replication log |
| **[docs/architecture.md](docs/architecture.md)** | System architecture with Mermaid diagram + [`docs/adr/`](docs/adr/README.md) (ADR-0001..0005) |
| **[docs/benchmarks.md](docs/benchmarks.md)** | Hardware-tagged performance budgets (`0.731 ms` coupled BTZ frame, `445.4×` FFT speedup) |
| **[docs/threat-model.md](docs/threat-model.md)** | STRIDE threat model mapped 1-to-1 to [`test/server.mjs`](test/server.mjs) & CI security gates |
| **[SUMMARY.md](SUMMARY.md)** · **[ERRATA.md](ERRATA.md)** · **[INDEX.md](INDEX.md)** | Executive summary, correction/withdrawal ledger, and complete repository index |

---

## Six Core Results: What Lean Proves and What Is Checked Otherwise

Each result has a kernel-checked Lean part and, in most cases, a part that rests on exact-rational (`scripts/verify_exact.py`), numerical or pre-registered statistical checks. The Lean statements concern the repository's own discrete definitions. Row-by-row detail is in [`CLAIMS.md`](CLAIMS.md) and [`docs/statement-fidelity.md`](docs/statement-fidelity.md).

1. **Theorem I & Prop. 4.2 — Monna digit reversal, valuation-residue sectors and the picket-fence law** ([`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean), [`docs/preregistration.md`](docs/preregistration.md)).
   *Lean:* base-$p$ Monna digit reversal $R_p$ is an involution and maps $p$-adic balls to contiguous blocks ($p \ge 2$, $x < p^n$); the subtree shift preserves ultrametric prefixes; $m \ne p - m$ for odd $p$ and $1 \le m < p$; the closed-form folded-frequency sequence has alternating gaps $p - 2m$ and $2m$. The $p = 2$ lemma `even_prime_self_conjugate` is the literal identity $1 = 2 - 1$.
   *Not in Lean:* $H_\theta$ and $D_p^\alpha$ are not defined in Lean. The block diagonalization of $H_\theta$ into $1 + n(p-1)$ sectors $W_{s,m}$ (`leak <= 1.8e-14` up to $N = 625$), the doublet counts for odd $p$ and for $p = 2$, and the link between the picket-fence sequence and eigenvalues are exact-rational and numerical checks. Pre-registered Experiment I (`20` seeds vs. GUE/GOE controls) confirmed all **4/4 hypotheses** at `p_holm = 0.0004` (`20/20` seeds each), with $W_{0,1} \approx 2/3$ and $W_{0,2} \approx 1/4$ at $p = 5, N = 625$, against the ratio $r_0(p,m) = \min(2m, p-2m)/\max(2m, p-2m)$.
2. **Theorem II — Tate-curve BTZ Ollivier-Ricci law and $L_c = 5$ trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)).
   *Lean:* for a hand-coded 3-class reduction of the horizon neighbourhoods (classes `opp`, `back`, `child` with masses $M, M, pM$; the class distance table is checked against cycle-distance offsets by `btz_graph_metric_eq_classDist`), every non-negative coupling costs at least $M(3p + 2 - \max(0, 6-L))$ and an explicit non-negative plan attains it, for all $p \ge 2, L \ge 3$. This gives $\kappa_{\mathrm{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ for the reduced model.
   *Not in Lean:* the reduction from couplings on the full neighbour sets to the 3-class coupling is a paper-level symmetry argument. `45` exact `Fraction` horizons on the full graph agree with the formula (zero rounding error).
3. **Theorem III — Disjoint Kozyrev packets and the nonlinear term** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)).
   *Lean:* over $\mathbb{Z}[i]$, for disjoint constant-modulus packets $\psi_r$ and any $F : \mathbb{Z} \to \mathbb{Z}$, $F(|\sum_r \psi_r|^2)\sum_r \psi_r = \sum_r F(c_r)\psi_r$ pointwise. `kozyrev_exact_nonlinear_soliton` takes an abstract operator $D$ and assumes $\psi$ is an eigenfunction of it.
   *Not in Lean:* $D_p^\alpha$, Kozyrev wavelets and time evolution are not defined in Lean, so the eigenfunction property of Kozyrev wavelets is assumed there, not proved. That disjoint $K$-ball superpositions evolve as non-radiating solitons of $i\partial_t\psi = (D_p^\alpha + F(|\psi|^2))\psi$ is a paper-level argument checked numerically (`0.00%` leakage up to $g = 500$).
4. **Theorem IV — Rank-1 Kerr-BTZ bulk solver, flux parity and BF margin** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)).
   *Lean:* the integer inequality $1 \le 1 + wq$ for $w, q \ge 0$ (`sherman_morrison_denominator_ge_one`; $q \ge 0$ is a hypothesis, which holds when $T \succ 0$); a rank-1 Sherman-Morrison identity for an abstract linear $T$ with assumed $Ty = b$, $Tz = u$; and edge-level flux parity identities.
   *Not in Lean:* the $O(V)$ Schur-complement solver, positivity of $T$, and BF stability down to $\Delta = 0.5001, \Omega = \pi$ are numerical checks; the exact $\mathbb{Q}(i)$ solve with residual $0$ is an exact-rational Python check.
5. **Theorem V & Theorem V-Global — Single-edge and multi-edge curved Gauss-Bonnet identities** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)).
   *Lean:* for a hand-coded bridge-edge transport cost model (`genBridgeTransportCost`), lower bounds on the transport cost hold in the subcritical and supercritical regimes and explicit plans with the stated marginals reach them (the non-negativity of the subcritical plan is not stated in Lean); the curvature formula splits into vertex half-charges minus a pinch deficit by unfolding definitions (`curved_gen_kappa_charge_decomp`); and at each vertex the half-charges $-(p-1)w_e/W_u$ sum to $-(p-1)$ for any integer weight list with positive sum (`global_multi_edge_vertex_charge_conservation`).
   *Not in Lean:* no Lean theorem sums curvature over the edges of a finite tree. The global statement (zero total excess when $w_e/W_u + w_e/W_v \le 1$ on all edges, deficit $-2\sum(w_e/W_u + w_e/W_v - 1)$ otherwise) is a paper-level assembly, checked on `69` single/multi-edge exact `Fraction` plans and `1,000` random JS trees (`< 1e-11`).
6. **Theorem VI — Graph-cut strong subadditivity** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)).
   *Lean:* for finite edge lists with `Nat` weights and `Bool` vertex sets, and for disjoint boundary regions $A, C$, $S(A \cup B \cup C) + S(B) \le \mathrm{cap}(W_{AB}) + \mathrm{cap}(W_{BC})$ for any homologous cuts $W_{AB}, W_{BC}$, when $S(A \cup B \cup C)$ and $S(B)$ are lower bounds for the corresponding homologous cut capacities. This is a discrete form of the argument of Headrick and Takayanagi (Phys. Rev. D 76, 106013, 2007, arXiv:0704.3719); no priority is claimed. Checked on `4,352` exhaustive brute-force partitions and `1,000` random JS graphs.

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
# 1. Run all 27 Node test suites (10 theorems, 8 killed mutants, 3,400+ properties/stress, server EIO, golden)
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
- **Not peer-reviewed:** Manuscripts are independent preprints; Lean proofs certify logical validity of formalized statements within the stated kernel boundary ([`docs/statement-fidelity.md`](docs/statement-fidelity.md)).
- **Finite-$N$ bounds:** `PadicSpace` caps $N = p^n \le 65{,}536$; Theorem V-Global applies to strictly interior vertices of full degree $p + 1$; $n \to \infty$ analytic convergence for $\alpha \ne 1$ is verified up to $N = 625$ rather than proved in Lean.
- **Lean scope:** the Lean suite proves invariants of the repository's own discrete definitions. The spectral, soliton-dynamics, solver-accuracy and global Gauss-Bonnet statements are only partly kernel-checked (see the list above and [`LIMITATIONS.md`](LIMITATIONS.md) Section 3). Monna digit reversal (Monna 1970) and graph-cut strong subadditivity (Headrick and Takayanagi 2007) are known; the Lean files formalize them for this model.

---

## Legal & Licensing

Copyright © 2026 **Alexander Stephen Donahue (`0thernes`)** `<0_0@0thernes.art>` (Independent Researcher, Spokane, WA, USA; ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).  
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([`LICENSE`](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [`LEGAL.md`](LEGAL.md) for AI-tool disclosure, ownership, and [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md) for the OSI licensing trade-off.

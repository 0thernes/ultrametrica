# ULTRAMETRICA

> **Zero-dependency real-time $p$-adic AdS/CFT Holographic Quantum Gravity, Rotating Kerr-BTZ Black Holes, Adelic Parity-Doubling Symmetries, Global Multi-Edge Curved Gauss-Bonnet Conservation, Universal Holographic RT Strong Subadditivity, 48 kHz Prime-Power AudioWorklet DSP, and 120 Pure Lean 4 (`v4.35.0`) Proofs Verified Across Independent Kernels.**

[![CI Verification](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml/badge.svg)](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml)
[![Live Observatory](https://img.shields.io/badge/Live_Observatory-GitHub_Pages-38bdf8)](https://0thernes.github.io/ultrametrica/)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0006--8168--9648-A6CE39.svg)](https://orcid.org/0009-0006-8168-9648)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(120_Decls,_6--Kernel_Comparator)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Planted Mutants](https://img.shields.io/badge/Planted_Mutants-8%2F8_Killed-10b981)](test/mutants.mjs)
[![License: Cosmogonic Non-Commercial](https://img.shields.io/badge/License-Cosmogonic_Non--Commercial-0ea5e9)](LICENSE)

**Author:** Alexander Stephen Donahue (`Independent Researcher, Spokane, WA, USA` · project handle [`0thernes`](https://0thernes.art) · `0_0@0thernes.art` · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.4.1` · **Status:** `active` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [`LICENSE`](LICENSE) and [`LEGAL.md`](LEGAL.md))  
**Live Interactive WebGL2 + 48 kHz AudioWorklet Observatory:** **[https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)**

![ULTRAMETRICA Live WebGL2 Bruhat-Tits AdS & Rotating Kerr-BTZ Observatory](docs/media/ultrametrica-observatory.png)

---

## 5-Second Independent Proof Verification (`#print axioms` & Multi-Kernel Audit)

Verify all **120 pure Lean 4 (`v4.35.0`) declarations** (zero Mathlib, `autoImplicit = false`, zero `sorry`, zero `native_decide`) and isolated `Spec`/`Challenge`/`Solution` targets in seconds:

```bash
cd lean && lake build UltrametricaProofs Challenge Solution && lake env lean VerifyAxioms.lean
# On Linux with bubblewrap (also enforced on every push in GitHub Actions CI):
lake comparator --config comparator.json --paranoid
```

Verbatim kernel output (character-checked against [`results/lean4-audit.txt`](results/lean4-audit.txt) by [`scripts/check_readme_axioms.py`](scripts/check_readme_axioms.py)):

```text
'Ultrametrica.monna_involution_universal' depends on axioms: [propext, Classical.choice, Quot.sound]
'Ultrametrica.odd_prime_conjugate_sector_disjoint' depends on axioms: [propext, Quot.sound]
'Ultrametrica.picket_fence_even_gap' depends on axioms: [propext, Quot.sound]
'Ultrametrica.btz_kappa_from_wasserstein' depends on axioms: [propext, Quot.sound]
'Ultrametrica.curved_ads_gauss_bonnet_subcritical' depends on axioms: [propext, Quot.sound]
'Ultrametrica.global_multi_edge_vertex_charge_conservation' depends on axioms: [propext, Quot.sound]
'Ultrametrica.rt_strong_subadditivity' depends on axioms: [propext, Quot.sound]
'Ultrametrica.multi_ball_kozyrev_soliton_list' depends on axioms: [propext]
'Ultrametrica.sherman_morrison_exact_identity' depends on axioms: [propext, Quot.sound]
```

Independent external kernels verified on pruned 8-target export (`1,886` transitive declarations) & full `Solution`: `leanchecker --fresh`, `leanchecker-paranoid --fresh`, `con-leche --verified`, `con-ron --verified`, `nanoda_bin 0.4.19` (strict `[propext, Quot.sound, Classical.choice]`), plus `lean4lean` via `bubblewrap`-sandboxed `lake comparator --paranoid` in CI. See [`docs/statement-fidelity.md`](docs/statement-fidelity.md).

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen AMS-LaTeX Publication Preprint PDF** (5 vector figures, zero warnings; standalone arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[CLAIMS.md](CLAIMS.md)** | **1-to-1 Claim & Falsification Ledger** (`kernel-checked`, `exact-rational`, `pre-registered statistical`, `numerical`, `prior work` + *What Would Prove Us Wrong*) |
| **[LIMITATIONS.md](LIMITATIONS.md)** | Honest scope boundaries, literal-vs-metaphor table, finite-$N$ bounds & non-claims |
| **[docs/MEGA_ATLAS_CROSSCHECK.md](docs/MEGA_ATLAS_CROSSCHECK.md)** | Honest cross-check against all `1,900` open problems in `0thernes/unsolved-problems-mega-atlas` (**`0/1,900` full solutions**; discrete sub-results on `SUB-032`) |
| **[docs/preregistration.md](docs/preregistration.md)** | Git-sealed preregistration (`c171b1b`) for confirmatory 20-seed Experiment I ([`results/stats-eval.json`](results/stats-eval.json)) |
| **[docs/statement-fidelity.md](docs/statement-fidelity.md)** | Line-by-line Lean 4 statement-fidelity, non-vacuity & 6-kernel audit matrix |
| **[docs/reviews/2026-11-25-hardening-cycles.md](docs/reviews/2026-11-25-hardening-cycles.md)** | 3-Cycle deep hardening & red-team dossier (all findings classified into the exact 10 classes) |
| **[REPLICATION.md](REPLICATION.md)** | Clean-clone reproduction commands, tolerances & dated replication log |
| **[docs/architecture.md](docs/architecture.md)** | System architecture with Mermaid diagram + [`docs/adr/`](docs/adr/README.md) (ADR-0001..0005) |
| **[docs/benchmarks.md](docs/benchmarks.md)** | Hardware-tagged performance budgets (`0.388 ms` coupled BTZ frame, `319.9×` FFT speedup) |
| **[docs/threat-model.md](docs/threat-model.md)** | STRIDE threat model mapped 1-to-1 to [`test/server.mjs`](test/server.mjs) & CI security gates |
| **[SUMMARY.md](SUMMARY.md)** · **[ERRATA.md](ERRATA.md)** · **[INDEX.md](INDEX.md)** | Executive summary, correction/withdrawal ledger, and complete repository index |

---

## Six Core Verified Theorems (120 Pure Lean 4 Declarations + Exact-Rational & 26 Node Suites)

1. **Theorem I & Prop. 4.2 — Adelic Parity-Doubling, Valuation-Residue Sectors & Pre-Registered GOE/GUE Falsification** ([`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean), [`docs/preregistration.md`](docs/preregistration.md)):
   Universal Monna involution $R_p$, ball contiguity, and Bruhat-Tits subtree shift isometry block-diagonalize $H_\theta$ identically into $1 + n(p-1)$ sectors $W_{s,m}$ (`leak <= 1.8e-14` up to $N = 625$), protecting 100% of excited levels in exact doublets for odd $p \ge 3$ while lifting all doublets at $p = 2$. Pre-registered Experiment I (`20` seeds vs. GUE/GOE controls) confirms all **4/4 hypotheses** at `p_holm = 0.0004` (`20/20` seeds each), locking sectors to $r_0(p,m) = \min(2m, p-2m)/\max(2m, p-2m)$ ($W_{0,1} \approx 2/3$ vs. sibling $W_{0,2} \approx 1/4$ inside the same $p=5, N=625$ Hamiltonian).
2. **Theorem II — Cycle-Metric-Bridged Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   Proved end-to-end in Lean 4 from the literal $L$-cycle graph metric through Kantorovich primal-dual optimality for all $p \ge 2, L \ge 3$: $\kappa_{\mathrm{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ (`45` exact `Fraction` horizons, zero rounding error).
3. **Theorem III — Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaled Self-Trapping** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   Any finite list of $K$ pairwise-disjoint Kozyrev wavelets is an exact radiation-free nonlinear soliton for arbitrary local $F(|\psi|^2)$ (`0.00%` leakage up to $g = 500$).
4. **Theorem IV — Unconditional Rank-1 Kerr-BTZ Bulk Solver, Flux Parity & BF Stability Margin** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   $w_{L-1} u u^\dagger \succeq 0$ guarantees $\mathrm{den} \ge 1 > 0$, exact arbitrary-dimension complex Hermitian Sherman-Morrison solve (exact $\mathbb{Q}(i)$ residual $= 0$), exact flux parity $E(-\Omega) = E(\Omega)$ and $J(-\Omega) = -J(\Omega)$, and BF stability down to $\Delta = 0.5001, \Omega = \pi$.
5. **Theorem V & Theorem V-Global — Single-Edge and Global Multi-Edge Curved AdS Discrete Gauss-Bonnet Conservation** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   For arbitrary simultaneous positive conductances $w_e > 0$ on strictly interior bridge edges of $T_p$, vertex curvature half-charges $-(p-1)w_e/W_u$ sum identically to $-(p-1)$ at every interior vertex, yielding exact zero global excess whenever $w_e/W_u + w_e/W_v \le 1$ on all edges and exact negative deficit $-2\sum(w_e/W_u + w_e/W_v - 1)$ otherwise (`69` single/multi-edge exact `Fraction` plans + `1,000` random JS trees `< 1e-11`).
6. **Theorem VI — Universal Holographic Ryu-Takayanagi Strong Subadditivity** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   Proved in Lean 4 on arbitrary finite non-negative weighted graphs (pure AdS trees, curved BTZ black holes, higher-genus quotients): $S(A \cup B \cup C) + S(B) \le S(A \cup B) + S(B \cup C)$ for all disjoint boundary regions $A, C$ (`4,352` exhaustive brute-force partitions + `1,000` random JS graphs).

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
# 1. Run all 26 Node test suites (10 theorems, 8 killed mutants, 3,200+ properties, server EIO, golden)
npm run verify:all

# 2. Run all 3 standalone engine examples (see examples/README.md)
npm run examples

# 3. Run independent textbook Python oracle (1,000+ cases), README axiom check & exact-rational audit
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
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

---

## Legal & Licensing

Copyright © 2026 **Alexander Stephen Donahue (`0thernes`)** `<0_0@0thernes.art>` (Independent Researcher, Spokane, WA, USA; ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).  
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([`LICENSE`](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [`LEGAL.md`](LEGAL.md) for AI-tool disclosure, ownership, and [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md) for the OSI licensing trade-off.

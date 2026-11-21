# ULTRAMETRICA

> **Zero-dependency real-time $p$-adic AdS/CFT Holographic Quantum Gravity, Rotating Kerr-BTZ Black Holes, Adelic Parity-Doubling Symmetries, 48 kHz Prime-Power AudioWorklet DSP, and 71 Pure Lean 4 (`v4.35.0`) Machine-Checked Proofs.**

[![CI Verification](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml/badge.svg)](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml)
[![Live Observatory](https://img.shields.io/badge/Live_Observatory-GitHub_Pages-38bdf8)](https://0thernes.github.io/ultrametrica/)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0006--8168--9648-A6CE39.svg)](https://orcid.org/0009-0006-8168-9648)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(71_Theorems,_0_sorry)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Planted Mutants](https://img.shields.io/badge/Planted_Mutants-6%2F6_Killed-10b981)](test/mutants.mjs)
[![License: 0thernes Non-Commercial](https://img.shields.io/badge/License-0thernes_Non--Commercial-0ea5e9)](LICENSE)

**Author:** Alexander Stephen Donahue ([0thernes LLC](https://0thernes.art), Spokane, WA, USA · `0_0@0thernes.art` · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.2.0` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [LICENSE](LICENSE) and [LEGAL.md](LEGAL.md))  
**Live Interactive WebGL2 + 48 kHz AudioWorklet Observatory:** **[https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)**

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen 13-page AMS-LaTeX Publication PDF** (4 vector figures, zero warnings; standalone arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[docs/CLAIMS.md](docs/CLAIMS.md)** | **1-to-1 Claim-to-Theorem & Evidence Ledger** (separating Tier-A 71 Lean theorems, Tier-B exact-rational checks, Tier-C numerical/mutant tests, and Tier-D prior work & non-claims) |
| **[INDEX.md](INDEX.md)** | Complete Master Index & Table of Contents (all files, theorems, equations & benchmarks) |
| **[SUMMARY.md](SUMMARY.md)** | Standalone 2-page Executive Summary Paper & Novelty Verdict |
| **[paper/WHITE_PAPER.md](paper/WHITE_PAPER.md)** | Full Markdown Research White Paper (LaTeX source: [`paper/main.tex`](paper/main.tex) + [`paper/refs.bib`](paper/refs.bib)) |
| **[docs/MASTER_REPORT.md](docs/MASTER_REPORT.md)** | Deep-Dive Technical, Mathematical, Scientific, Computational, Functional & Operational Master Report |
| **[lean/README.md](lean/README.md)** | Pure Lean 4 (`v4.35.0`) formal proof library (**71 audited theorems**, `1,706` lines, [`VerifyAxioms.lean`](lean/VerifyAxioms.lean), zero `sorryAx`, zero `native_decide`, zero Mathlib) |
| **[VERIFICATION.md](VERIFICATION.md)** | Provable / Falsifiable / Verifiable / Authenticated protocol & [`CHECKSUMS.sha256`](CHECKSUMS.sha256) manifest |
| **[GLOSSARY.md](GLOSSARY.md)** | Comprehensive 45+ term mathematical, holographic & acoustic glossary |
| **[LEGAL.md](LEGAL.md)** | Ownership, non-commercial reservation, solo + AI-tool disclosure & formal verification boundaries |

---

## What ULTRAMETRICA Is

In Euclidean space ($\mathbb{R}$), distance obeys $|x + y| \le |x| + |y|$. In a **$p$-adic universe** ($\mathbb{Q}_p$, $p \in \{2, 3, 5, 7\}$), distance obeys the **strong (ultrametric) triangle inequality**:
$$|x + y|_p \le \max(|x|_p, |y|_p)$$

Every triangle is isosceles, every point inside a ball is its center, compactly supported Kozyrev wavelets are exact stationary eigenstates of a non-local pseudo-differential operator ($D_p^\alpha$) — even under arbitrary local nonlinearities — and the holographic gravitational dual of $\mathbb{Z}_p$ is the **Bruhat-Tits tree** $T_p$, whose cyclic Tate-curve quotients $T_p / p^{h\mathbb{Z}}$ act as discrete **BTZ black holes**.

**ULTRAMETRICA** couples all of these structures live at 60 FPS with zero approximations in its core linear/topological solvers (`Bulk KG Residual ~ 1e-16`, `||psi||^2 - 1 ~ 1e-15`), renders the living 3D hyperbolic spacetime in custom WebGL2 GLSL 300 es shaders (with shareable URL permalinks and PNG snapshot capture), runs a synchronized **Euclidean $\mathbb{R}$ Twin** side-by-side at matched kinetic energy, and sonifies exact prime-power Vladimirov harmonic shells ($3^x$ Bohlen-Pierce tritaves, $5^x$ pentaves, $7^x$ heptaves) in a lock-free 48 kHz `AudioWorklet`.

---

## Four Core Verified Theorems (71 Pure Lean 4 Proofs + Exact-Rational & Mutant Audits)

1. **Theorem I — Adelic Parity-Doubling Dichotomy, Recursive Valuation-Residue Decomposition & Modular Picket-Fence Locking** ([`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean), [White Paper §4](paper/WHITE_PAPER.md#4-the-monna-conjugated-adelic-hybrid-hamiltonian--parity-doubling-dichotomy-theorem-i)):
   Universal Monna involution (`monna_involution_universal`), ball contiguity (`padic_ball_monna_contiguity`), and Bruhat-Tits subtree cyclic-shift ultrametric isometry (`subtreeShift_preserves_ultrametric_prefix`) force the non-commuting hybrid $H_\theta = \theta R_p D_p^\alpha R_p + (1-\theta)(-\Delta_{\mathbb{R}})^{\alpha/2}$ to block-diagonalize **identically** into $1 + n(p-1)$ Fourier valuation-residue sectors $W_{s,m}$ (`crossLeak < 1.8e-14` up to $N = 625$). Complex conjugation maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$, protecting **100% of excited states in exact doublets ($\le (p^n+1)/2$ distinct levels)** for every odd prime $p \ge 3$ while lifting all doublets at $p = 2$. Single-sector complex Hermitian diagonalization up to $N = 625$ ($\dim W_{0,m} = 125$, Experiment E) **falsifies** GOE/GUE quantum-chaos thermalization: each sector remains locked near the modular picket-fence constant $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$ ($W_{0,1} \approx 2/3$ vs. $W_{0,2} \approx 1/4$ in the same $p=5$ Hamiltonian).
2. **Theorem II — First-Principles Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean), [White Paper §6](paper/WHITE_PAPER.md#6-unified-tate-curve-btz-ollivier-ricci-curvature-law--l_c--5-trichotomy-theorem-ii)):
   Proved end-to-end inside Lean 4 from first-principles Kantorovich primal-dual 1-Wasserstein optimality (`btz_dual_1lipschitz`, `btz_wasserstein_lower_bound`, `btz_primal_cost_exact`) over all rational bipartite transport plans for all $p \ge 2, L \ge 3$: $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ and $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$ (verified via exact `fractions.Fraction` optimal transport across 45 $(p, L)$ horizons with zero rounding error).
3. **Theorem III — Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaled Self-Trapping** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean), [White Paper §3](paper/WHITE_PAPER.md#3-kozyrev-wavelets--multi-ball-nonlinear-compacton-soliton-invariance-theorem-iii)):
   Any finite list of $K$ pairwise-disjoint Kozyrev wavelets (`multi_ball_kozyrev_soliton_list`) is an exact radiation-free nonlinear soliton for **arbitrary** local $F(|\psi|^2)$ ($0.00$ leakage up to $g = 500$), whereas overlapping multi-scale packets exhibit a tunneling peak whose amplitude decays monotonically with $\alpha \in [0.6, 1.4]$ (Experiment F) before collapsing into universal large-$g$ macroscopic self-trapping.
4. **Theorem IV — Unconditional Positive-Definite Rank-1 Kerr-BTZ Bulk Solver & Flux Parity Laws** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean), [White Paper §5](paper/WHITE_PAPER.md#5-bruhat-tits-ads--rotating-kerr-btz-bulk-klein-gordon-solver-theorem-iv)):
   Decomposing the gauge-coupled horizon wrap edge as $w_{L-1} u u^\dagger \succeq 0$ guarantees denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ unconditionally, satisfies the exact arbitrary-dimension complex Hermitian Sherman-Morrison algebraic identity (`sherman_morrison_exact_identity`), achieves $10^{-16}$–$10^{-17}$ PDE residuals in $O(V)$ time, and obeys exact Kerr parity laws $E(-\Omega) = E(\Omega)$ and $J(-\Omega) = -J(\Omega)$ (`kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd`).

> **Scientific Honesty Note:** Foundational $p$-adic quantum mechanics, Kozyrev wavelets, $p$-adic AdS/CFT, dynamic edge-length gravity, and Ollivier-Ricci curvature on trees belong to the cited literature ([docs/CLAIMS.md](docs/CLAIMS.md)). ULTRAMETRICA claims **zero** empirical discovery of new physical laws of nature; its original contributions are strictly mathematical, formal, and computational.

---

## Quickstart & Full 6-Layer Verification

Requires **Node.js $\ge 20$** (and optionally **Python 3.12+** / **Lean 4 `v4.35.0`** / **Tectonic** to re-check exact rational, kernel proof, and PDF layers). Zero `npm install` needed.

```bash
# 1. Run all 9 executable mathematical & physical theorems + 6 planted negative mutants (6/6 killed)
npm run verify:all

# 2. Run independent exact-rational (Fraction & Q(i)), metadata & SHA-256 manifest audit
python scripts/verify_exact.py --check-checksums
sha256sum -c CHECKSUMS.sha256

# 3. Reproduce all 6 discovery benchmark datasets (Exp A-F -> results/discovery-benchmarks.json)
npm run discover

# 4. Clean-build Lean 4 library & audit all 71 declarations (0 sorryAx, 0 native_decide, 0 Mathlib)
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# 5. Rebuild 4 vector figures, zero-warning 13-page PDF & standalone-verified arXiv bundle
python scripts/generate_figures.py && python scripts/package_dist.py

# 6. Launch the interactive WebGL2 + 48 kHz AudioWorklet Observatory locally
npm start
# Open http://localhost:4173 (or set PORT=4174) — or use https://0thernes.github.io/ultrametrica/
```

---

## Six Built-In Interactive Experiments

1. **Kozyrev Wavelet Trap (`1`)**: Watch `BALL LEAKAGE: 0.000000%` hold forever in $\mathbb{Q}_p$ while the synchronized Euclidean $\mathbb{R}$ twin at identical energy explodes across the circle.
2. **Kerr-BTZ Black Hole (`2`)**: Opens a rotating Tate-curve horizon ring $T_p / p^{h\mathbb{Z}}$ with live frame-dragging current $J(\Omega)$ and Gubser-Marcolli gravitational edge-length waves.
3. **Ultrametric Teleportation (`3`)**: Multi-scale nonlinear self-interaction breaks soliton trapping and cascades discontinuously through Bruhat-Tits bulk geodesics into cousin balls.
4. **Adelic Reality Fracture (`4`)**: Morph $\theta \in [0, 1]$ between $\mathbb{R}$ and $\mathbb{Q}_p$ to observe simultaneous continuous Euclidean diffraction and discontinuous $p$-adic tunneling.
5. **RT Horizon Phase Transition (`5`)**: Sweep boundary region $|A|/N$ to watch the exact golden $O(V)$ Ryu-Takayanagi minimal cut jump onto the BTZ black hole horizon.
6. **ER=EPR Wormhole Surgery (`6`)**: Click any bulk strut in `Wormhole` tool mode to pinch $a_e$, spike Ollivier-Ricci curvature crimson, and sever holographic entanglement bridges.

---

## Legal & Licensing

Copyright © 2026 **0thernes (0thernes LLC)** `<0_0@0thernes.art>`.  
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([LICENSE](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [LEGAL.md](LEGAL.md) for authorship, solo + AI-tool disclosure, and formal verification boundaries.

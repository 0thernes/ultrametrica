# ULTRAMETRICA

> **Zero-dependency real-time $p$-adic AdS/CFT Holographic Quantum Gravity, Rotating Kerr-BTZ Black Holes, Adelic Parity-Doubling Symmetries, 48 kHz Prime-Power AudioWorklet DSP, and Pure Lean 4 (`v4.35.0`) Machine-Checked Proofs.**

[![License: 0thernes Non-Commercial](https://img.shields.io/badge/License-0thernes_Non--Commercial-0ea5e9)](LICENSE)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(36_Theorems,_0_sorry)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Node Tests](https://img.shields.io/badge/Verified_Theorems-9%2F9_Passed-10b981)](test/verify.mjs)
[![PDF Manuscript](https://img.shields.io/badge/AMS--LaTeX_PDF-Zero_Warnings-38bdf8)](dist/Donahue_2026_Ultrametrica.pdf)

**Author:** Alexander Stephen Donahue ([0thernes LLC](https://0thernes.art), Spokane, WA, USA · `0_0@0thernes.art` · ORCID [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.1.0` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [LICENSE](LICENSE) and [LEGAL.md](LEGAL.md))

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen AMS-LaTeX Publication PDF** (11 pages, 3 vector figures, zero warnings; arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[INDEX.md](INDEX.md)** | Complete Master Index & Table of Contents (all files, theorems, equations & benchmarks) |
| **[SUMMARY.md](SUMMARY.md)** | Standalone 2-page Executive Summary Paper & Novelty Verdict |
| **[paper/WHITE_PAPER.md](paper/WHITE_PAPER.md)** | Full Markdown Research White Paper (LaTeX source: [`paper/main.tex`](paper/main.tex) + [`paper/refs.bib`](paper/refs.bib)) |
| **[docs/MASTER_REPORT.md](docs/MASTER_REPORT.md)** | Deep-Dive Technical, Mathematical, Scientific, Computational, Functional & Operational Master Report |
| **[lean/README.md](lean/README.md)** | Pure Lean 4 (`v4.35.0`) formal proof library (**36 audited theorems**, [`VerifyAxioms.lean`](lean/VerifyAxioms.lean), zero `sorryAx`, zero Mathlib) |
| **[VERIFICATION.md](VERIFICATION.md)** | Provable / Falsifiable / Verifiable / Authenticated protocol & SHA-256 digests |
| **[GLOSSARY.md](GLOSSARY.md)** | Comprehensive 45+ term mathematical, holographic & acoustic glossary |
| **[LEGAL.md](LEGAL.md)** | Ownership, non-commercial reservation, AI disclosure & formal verification boundaries |

---

## What ULTRAMETRICA Is

In Euclidean space ($\mathbb{R}$), distance obeys $|x + y| \le |x| + |y|$. In a **$p$-adic universe** ($\mathbb{Q}_p$, $p \in \{2, 3, 5, 7\}$), distance obeys the **strong (ultrametric) triangle inequality**:
$$|x + y|_p \le \max(|x|_p, |y|_p)$$

Every triangle is isosceles, every point inside a ball is its center, compactly supported Kozyrev wavelets are exact stationary eigenstates of a non-local pseudo-differential operator ($D_p^\alpha$) — even under arbitrary local nonlinearities — and the holographic gravitational dual of $\mathbb{Z}_p$ is the **Bruhat-Tits tree** $T_p$, whose cyclic Tate-curve quotients $T_p / p^{h\mathbb{Z}}$ act as discrete **BTZ black holes**.

**ULTRAMETRICA** couples all of these structures live at 60 FPS with zero approximations in its core linear/topological solvers (`Bulk KG Residual ~ 1e-16`, `||psi||^2 - 1 ~ 1e-15`), renders the living 3D hyperbolic spacetime in custom WebGL2 GLSL 300 es shaders, runs a synchronized **Euclidean $\mathbb{R}$ Twin** side-by-side at matched kinetic energy, and sonifies exact prime-power Vladimirov harmonic shells ($3^x$ Bohlen-Pierce tritaves, $5^x$ pentaves, $7^x$ heptaves) in a lock-free 48 kHz `AudioWorklet`.

---

## Four Core Verified Theorems (Machine-Checked in Lean 4 + Numerically Verified)

1. **Theorem I — Adelic Parity-Doubling Dichotomy & Recursive Valuation-Residue Decomposition** ([`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean), [White Paper §4](paper/WHITE_PAPER.md#4-the-monna-conjugated-adelic-hybrid-hamiltonian--parity-doubling-dichotomy-theorem-i)):
   The non-commuting Monna-conjugated Adelic hybrid Hamiltonian $H_\theta = \theta R_p D_p^\alpha R_p + (1-\theta)(-\Delta_{\mathbb{R}})^{\alpha/2}$ block-diagonalizes **identically** into $1 + n(p-1)$ Fourier valuation-residue sectors $W_{s,m}$ (`maxCrossSectorBlockLeak < 3.2e-14`). Complex conjugation maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$, forcing **100% of excited eigenvalues into exact doublets ($\le (p^n+1)/2$ distinct levels)** for every odd prime $p \ge 3$, while uniquely shattering all doublets into $2^n$ simple levels at $p = 2$.
2. **Theorem II — Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean), [White Paper §6](paper/WHITE_PAPER.md#6-unified-tate-curve-btz-ollivier-ricci-curvature-law--l_c--5-trichotomy-theorem-ii)):
   Every uniform BTZ horizon edge obeys $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ (verified against exact bipartite SPFA Wasserstein transport to $\le 2.22 \times 10^{-16}$), giving exact curvature excess $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$: Planck-scale horizons ($L \in \{3, 4\}$) are strictly flatter than pure AdS; $L_c = 5$ exhibits an exact trichotomy ($p=2$ negative, $p=3$ exact zero, $p \ge 4$ positive); and macroscopic horizons ($L \ge 6$) are strictly more negatively curved by $-4/((p+1)(p+2))$.
3. **Theorem III — Multi-Ball Kozyrev Compacton-Soliton Invariance & Self-Trapping Resonance** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean), [White Paper §3](paper/WHITE_PAPER.md#3-kozyrev-wavelets--multi-ball-nonlinear-compacton-soliton-invariance-theorem-iii)):
   Disjoint-ball Kozyrev wavelet superpositions are exact radiation-free nonlinear solitons for **arbitrary** local nonlinearity $F(|\psi|^2)$ ($0.00$ leakage up to $g = 500$), while overlapping multi-scale packets exhibit a resonant tunneling peak followed by macroscopic nonlinear self-trapping.
4. **Theorem IV — Unconditional Positive-Definite Rank-1 Kerr-BTZ Bulk Solver** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean), [White Paper §5](paper/WHITE_PAPER.md#5-bruhat-tits-ads--rotating-kerr-btz-bulk-klein-gordon-solver-theorem-iv)):
   Decomposing the gauge-coupled horizon wrap edge as $w_{L-1} u u^\dagger \succeq 0$ guarantees $T \succ 0$ and Sherman-Morrison denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ unconditionally for all weights and Kerr fluxes $\Omega$, achieving $O(V)$ exact solutions to $10^{-16}$–$10^{-17}$ residual.

> **Scientific Honesty Note:** Foundational $p$-adic quantum mechanics, Kozyrev wavelets, $p$-adic AdS/CFT, dynamic edge-length gravity, and Ollivier-Ricci curvature on trees belong to the cited literature ([White Paper §11 & §13](paper/WHITE_PAPER.md#11-honest-novelty-assessment-established-literature-vs-original-contributions)). ULTRAMETRICA claims **zero** empirical discovery of new physical laws of nature; its original contributions are strictly mathematical, formal, and computational.

---

## Quickstart & Full Verification

Requires **Node.js $\ge 20$** (and optionally **Lean 4 `v4.35.0`** to re-check kernel proofs). Zero `npm install` needed.

```bash
# 1. Run all 9 executable mathematical & physical theorem suites
npm test

# 2. Run independent exact-rational (fractions.Fraction & Q(i)) falsifier
python scripts/verify_exact.py

# 3. Reproduce all 4 discovery benchmark datasets (results/discovery-benchmarks.json)
npm run discover

# 4. Machine-check all 36 Lean 4 theorems & audit axioms (zero sorryAx)
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# 5. Launch the interactive WebGL2 + 48 kHz AudioWorklet Observatory
npm start
# Open http://localhost:4173 (or set PORT=4174)
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
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([LICENSE](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [LEGAL.md](LEGAL.md) for authorship, AI tool disclosure, and formal verification boundaries.

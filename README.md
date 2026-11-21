# ULTRAMETRICA

> **Zero-dependency real-time $p$-adic AdS/CFT Holographic Quantum Gravity, Rotating Kerr-BTZ Black Holes, Adelic Parity-Doubling Symmetries, Curved Discrete Gauss-Bonnet Conservation, 48 kHz Prime-Power AudioWorklet DSP, and 101 Pure Lean 4 (`v4.35.0`) Machine-Checked Proofs.**

[![CI Verification](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml/badge.svg)](https://github.com/0thernes/ultrametrica/actions/workflows/ci.yml)
[![Live Observatory](https://img.shields.io/badge/Live_Observatory-GitHub_Pages-38bdf8)](https://0thernes.github.io/ultrametrica/)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0006--8168--9648-A6CE39.svg)](https://orcid.org/0009-0006-8168-9648)
[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0_(101_Theorems,_0_sorry)-10b981)](lean/README.md)
[![Exact Rational Audit](https://img.shields.io/badge/Exact_Rational_Falsifier-Python_Fraction_PASS-10b981)](scripts/verify_exact.py)
[![Planted Mutants](https://img.shields.io/badge/Planted_Mutants-8%2F8_Killed-10b981)](test/mutants.mjs)
[![License: 0thernes Non-Commercial](https://img.shields.io/badge/License-0thernes_Non--Commercial-0ea5e9)](LICENSE)

**Author:** Alexander Stephen Donahue ([0thernes LLC](https://0thernes.art), Spokane, WA, USA · `0_0@0thernes.art` · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Release:** `v1.3.0` (Research Preprint & Interactive Laboratory — Non-Commercial Research & Play; see [LICENSE](LICENSE) and [LEGAL.md](LEGAL.md))  
**Live Interactive WebGL2 + 48 kHz AudioWorklet Observatory:** **[https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)**

---

## Navigation

| Document | Description |
|---|---|
| **[dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)** | **Frozen 15-page AMS-LaTeX Publication PDF** (5 vector figures, zero warnings; standalone arXiv bundle: [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) |
| **[docs/AUDIT_AND_CONTRAST_ANALYSIS.md](docs/AUDIT_AND_CONTRAST_ANALYSIS.md)** | **Multi-Layer Adversarial Audit & Contrast Comparative Analysis** (substrates, spectrums, gradients/margins, taxonomies, adjacents & complete 16-bug / 3-Lean-hole register) |
| **[docs/CLAIMS.md](docs/CLAIMS.md)** | **1-to-1 Claim-to-Theorem & Evidence Ledger** (Tier-A 101 Lean theorems, Tier-B exact-rational checks, Tier-C numerical/mutant tests, Tier-D prior work & non-claims) |
| **[INDEX.md](INDEX.md)** | Complete Master Index & Table of Contents (all files, theorems, equations & benchmarks) |
| **[SUMMARY.md](SUMMARY.md)** | Standalone Executive Summary Paper & Novelty Verdict |
| **[paper/WHITE_PAPER.md](paper/WHITE_PAPER.md)** | Full Markdown Research White Paper (LaTeX source: [`paper/main.tex`](paper/main.tex) + [`paper/refs.bib`](paper/refs.bib)) |
| **[docs/MASTER_REPORT.md](docs/MASTER_REPORT.md)** | Deep-Dive Technical, Mathematical, Scientific, Computational, Functional & Operational Master Report |
| **[lean/README.md](lean/README.md)** | Pure Lean 4 (`v4.35.0`) formal proof library (**101 audited theorems**, `2,267` lines, [`VerifyAxioms.lean`](lean/VerifyAxioms.lean), zero `sorryAx`, zero `native_decide`, zero Mathlib) |
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

## Five Core Verified Theorems (101 Pure Lean 4 Proofs + Exact-Rational & 8/8 Mutant Audits)

1. **Theorem I — Adelic Parity-Doubling Dichotomy, Recursive Valuation-Residue Decomposition & $\alpha$-Invariant Modular Picket-Fence Locking** ([`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean)):
   Universal Monna bijectivity (`monna_involution_universal`, `monna_injective`, `monna_surjective`), ball contiguity (`padic_ball_monna_contiguity`), and Bruhat-Tits subtree shift isometry (`subtreeShift_preserves_ultrametric_prefix`) block-diagonalize $H_\theta$ identically into $1 + n(p-1)$ sectors $W_{s,m}$ (off-block leak $\le 4.5 \times 10^{-13}$ up to $N = 625$), protecting **100% of excited states in exact doublets** for odd $p \ge 3$ while lifting all doublets at $p = 2$. Single-sector complex Hermitian diagonalization across $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ (Experiments E & G) **falsifies** GOE/GUE thermalization: even under quadratic Schrödinger dispersion ($\alpha = 2.0$), every sector stays locked near the formally proved modular picket-fence constant $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$ ($W_{0,1} \approx 2/3$ vs. $W_{0,2} \approx 1/4$ inside the same $p=5$ Hamiltonian).
2. **Theorem II — Cycle-Metric-Bridged Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   Proved end-to-end inside Lean 4 from the literal $L$-cycle graph metric (`btz_graph_metric_eq_classDist`) through Kantorovich primal-dual 1-Wasserstein optimality for all $p \ge 2, L \ge 3$: $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ and $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$ (verified over 45 exact `fractions.Fraction` horizons with zero rounding error).
3. **Theorem III — Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaled Self-Trapping** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   Any finite list of $K$ pairwise-disjoint Kozyrev wavelets (`multi_ball_kozyrev_soliton_list`) is an exact radiation-free nonlinear soliton for **arbitrary** local $F(|\psi|^2)$ (`0.00%` leakage up to $g = 500$), whereas overlapping multi-scale packets show monotonic $\alpha$-decaying tunneling peaks (`1.470% -> 0.087%`) and universal large-$g$ self-trapping.
4. **Theorem IV — Unconditional Rank-1 Kerr-BTZ Bulk Solver, Flux Parity & BF Stability Margin** ([`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean)):
   Decomposing the gauge-coupled horizon wrap edge as $w_{L-1} u u^\dagger \succeq 0$ guarantees $\mathrm{den} \ge 1 > 0$, satisfies the exact arbitrary-dimension complex Hermitian Sherman-Morrison identity (`sherman_morrison_exact_identity`), obeys exact Kerr parity $E(-\Omega) = E(\Omega)$ and $J(-\Omega) = -J(\Omega)$, and remains stable down to $\Delta = 0.5001$ under curved gravity and $\Omega = \pi$ (residual $\le 5.38 \times 10^{-15}$).
5. **Theorem V — Non-Perturbative Curved AdS Discrete Gauss-Bonnet Curvature Conservation & Supercritical Pinch Deficit** ([`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean)):
   Proved from first-principles curved Kantorovich duality in Lean 4 (`curved_ads_gauss_bonnet_subcritical`, `curved_ads_supercritical_pinch_deficit`) and verified over 60 exact `fractions.Fraction` plans: any finite interior stretch ($a_e \ge 1$) or subcritical pinch ($a_e \ge 1/p$, $\sigma_e \ge -\ln p$) conserves integrated Ollivier-Ricci curvature identically ($\sum_{e'}(\kappa_{e'} - \kappa_{\mathrm{AdS}}) \equiv 0$), while pinching past $\sigma_e < -\ln p$ induces the exact negative curvature deficit $-2(e^{-\sigma_e} - p)/(e^{-\sigma_e} + p) < 0$.

> **Scientific Honesty Note:** Foundational $p$-adic quantum mechanics, Kozyrev wavelets, $p$-adic AdS/CFT, dynamic edge-length gravity, and Ollivier-Ricci curvature on trees belong to the cited literature ([docs/CLAIMS.md](docs/CLAIMS.md)). ULTRAMETRICA claims **zero** empirical discovery of new physical laws of nature; its original contributions are strictly mathematical, formal, and computational.

---

## Quickstart & Full 6-Layer Verification

Requires **Node.js $\ge 20$** (and optionally **Python 3.12+** / **Lean 4 `v4.35.0`** / **Tectonic** to re-check exact rational, kernel proof, and PDF layers). Zero `npm install` needed.

```bash
# 1. Run all 10 executable mathematical & physical theorems + 8 planted negative mutants (8/8 killed)
npm run verify:all

# 2. Run independent exact-rational (Fraction & Q(i)), metadata & SHA-256 manifest audit
python scripts/verify_exact.py --check-checksums
sha256sum -c CHECKSUMS.sha256

# 3. Reproduce all 8 discovery benchmark datasets (Exp A-H -> results/discovery-benchmarks.json)
npm run discover

# 4. Clean-build Lean 4 library & audit all 101 declarations (0 sorryAx, 0 native_decide, 0 Mathlib)
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# 5. Rebuild 5 vector figures, zero-warning 15-page PDF & standalone-verified arXiv bundle
python scripts/generate_figures.py && python scripts/package_dist.py

# 6. Launch the hardened interactive WebGL2 + 48 kHz AudioWorklet Observatory locally
npm start
# Open http://localhost:4173 (or set PORT=4174) — or use https://0thernes.github.io/ultrametrica/
```

---

## Six Built-In Interactive Experiments

1. **Kozyrev Wavelet Trap (`1`)**: Watch `BALL LEAKAGE: 0.000000%` hold forever in $\mathbb{Q}_p$ while the synchronized Euclidean $\mathbb{R}$ twin at identical energy explodes across the circle.
2. **Kerr-BTZ Black Hole (`2`)**: Opens a rotating Tate-curve horizon ring $T_p / p^{h\mathbb{Z}}$ with live frame-dragging current $J(\Omega)$ and Gubser-Marcolli gravitational edge-length waves.
3. **Ultrametric Teleportation (`3`)**: Multi-scale nonlinear self-interaction breaks soliton trapping and cascades discontinuously through Bruhat-Tits bulk geodesics into cousin balls.
4. **Adelic Reality Fracture (`4`)**: Morph $\theta \in [0, 1]$ between $\mathbb{R}$ and $\mathbb{Q}_p$ (now up to quadratic $\alpha = 2.00$) to observe simultaneous continuous Euclidean diffraction and discontinuous $p$-adic tunneling.
5. **RT Horizon Phase Transition (`5`)**: Sweep boundary region $|A|/N$ to watch the exact golden $O(V)$ Ryu-Takayanagi minimal cut jump onto the BTZ black hole horizon.
6. **ER=EPR Wormhole Surgery (`6`)**: Click any bulk strut in `Wormhole` tool mode to stretch/pinch $a_e$ across the Theorem V critical margin $\sigma_e^* = -\ln p$, watch local Ollivier-Ricci curvature redistribute, and sever holographic entanglement bridges.

---

## Legal & Licensing

Copyright © 2026 **0thernes (0thernes LLC)** `<0_0@0thernes.art>`.  
Licensed under the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** ([LICENSE](LICENSE)). Study, verify, fork, and build upon it freely for non-commercial research and play with attribution intact; **all commercial rights are reserved**. See [LEGAL.md](LEGAL.md) for authorship, solo + AI-tool disclosure, and formal verification boundaries.

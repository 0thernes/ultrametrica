# Executive Summary Paper — ULTRAMETRICA (v1.1.0)

**Author:** Alexander Stephen Donahue (0thernes LLC, Spokane, WA, USA · `0_0@0thernes.art` · ORCID [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648))  
**Frozen PDF:** [dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf) · **Markdown Manuscript:** [paper/WHITE_PAPER.md](paper/WHITE_PAPER.md) · **Master Report:** [docs/MASTER_REPORT.md](docs/MASTER_REPORT.md) · **Lean 4 Audit:** [results/lean4-audit.txt](results/lean4-audit.txt)

---

## 1. One-Paragraph Overview

**ULTRAMETRICA** is a zero-dependency, machine-verified mathematical-physics laboratory coupling exact discrete $p$-adic quantum dynamics on $\mathbb{Z}_p / p^n\mathbb{Z}_p$ ($p \in \{2, 3, 5, 7\}$) to curved holographic bulk gravity on the Bruhat-Tits tree $T_p$ and its rotating Tate-curve BTZ black hole quotients $T_p / p^{h\mathbb{Z}}$. Every simulation frame solves the bulk Klein-Gordon equation to $\sim 10^{-16}$ residual in $O(V)$ exact time, evolves nonlinear boundary quantum waves via 4th-order Yoshida symplectic Radix-$p$ Pontryagin FFTs ($\sim 10^{-15}$ norm drift) alongside a synchronized Euclidean $\mathbb{R}$ twin, computes exact Ollivier-Ricci discrete curvature and exact $O(V)$ Ryu-Takayanagi minimal cuts, renders the living 3D hyperbolic manifold in WebGL2, and synthesizes non-octave prime-power Vladimirov harmonic shells ($3^x$ tritaves, $5^x$ pentaves, $7^x$ heptaves) in a 48 kHz `AudioWorklet`.

## 2. Core Question: Did We Discover New Physics or New Math?

**Honest Verdict:**
- **New Experimental Physics of Nature?** **No.** ULTRAMETRICA is a mathematical-physics and computational study, not an empirical laboratory measurement. Foundational $p$-adic quantum mechanics (Vladimirov-Volovich-Zelenov 1994), Kozyrev wavelets (2002), $p$-adic AdS/CFT & Tate-curve BTZ quotients (Gubser et al. 2016/2017; Heydeman-Marcolli-Saberi-Stoica 2016), and Ollivier-Ricci curvature (2009) are established frontier literature and credited in full.
- **New Exact Mathematical & Algorithmic Results?** **Yes — four sharp, provable, falsifiable theorems** emerged directly from our exact computational experiments and were formally machine-checked in **Lean 4 (`v4.35.0`, 24 declarations, zero `sorryAx`, zero custom axioms)**:
  1. **Adelic Parity-Doubling Dichotomy & Recursive Valuation-Residue Decomposition (Theorem I):** Despite strong non-commutativity $[R_p D_p^\alpha R_p, (-\Delta_{\mathbb{R}})^{\alpha/2}] \ne 0$, the Monna-conjugated Adelic hybrid Hamiltonian $H_\theta$ **exactly block-diagonalizes** in the discrete Fourier basis into $1 + n(p-1)$ valuation-residue sectors $W_{s,m}$ (verified off-block leak $< 3.2 \times 10^{-14}$). Complex conjugation pairs $W_{s,m} \leftrightarrow W_{s,p-m}$, forcing **100% of excited states into exact symmetry-protected doublets ($\le (p^n+1)/2$ distinct levels)** for every odd prime $p \ge 3$, while uniquely shattering all doublets into $2^n$ simple levels at $p = 2$.
  2. **Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Critical Trichotomy (Theorem II):** Exact non-lazy horizon curvature obeys $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ across all $p \ge 2, L \ge 3$ (verified against exact SPFA Wasserstein transport to $10^{-16}$), yielding $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$. Ultra-small Planck-scale horizons ($L \in \{3, 4\}$, plus $L = 5$ for $p \ge 4$) are strictly *flatter* than pure AdS; $p = 3, L = 5$ gives exact cancellation ($\kappa_{\text{BTZ}} = \kappa_{\text{AdS}} = -1$); and macroscopic horizons ($L \ge 6$) are strictly *more negatively curved* by $-4/((p+1)(p+2))$. *(Notably, writing the Lean 4 proof directly caught a factor-of-2 mental algebra error and exposed the exact $L=5$ trichotomy!)*
  3. **Multi-Ball Kozyrev Compacton-Soliton Invariance & Macroscopic Self-Trapping Resonance (Theorem III):** Disjoint Kozyrev wavelet superpositions are exact radiation-free nonlinear solitons for *any* local nonlinearity $F(|\psi|^2)$ ($0.00$ leakage up to $g = 500$), whereas overlapping multi-scale packets exhibit a non-monotonic tunneling peak ($0.37\%$ at $g = 60$) followed by macroscopic nonlinear self-trapping ($0.00\%$ at $g = 500$).
  4. **Unconditionally Non-Singular $O(V)$ Kerr-BTZ Rank-1 Bulk Solver (Theorem IV):** Extracting a gauge-coupled horizon wrap edge as $w_{L-1} u u^\dagger$ guarantees $T \succ 0$ and Sherman-Morrison denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ unconditionally for all weights and Kerr fluxes $\Omega$, achieving $10^{-16}$–$10^{-17}$ PDE residuals at 60 FPS.

## 3. Verification Status Snapshot

| Verification Layer | Tool / Artifact | Result |
|---|---|---|
| **Formal Kernel Proofs** | Lean 4 `v4.35.0` ([lean/VerifyAxioms.lean](lean/VerifyAxioms.lean), [results/lean4-audit.txt](results/lean4-audit.txt)) | **36/36 declarations verified**, `0` errors, `0` warnings, `0` `sorryAx` |
| **Exact-Rational Falsifier** | `python scripts/verify_exact.py` (`fractions.Fraction` & $\mathbb{Q}(i)$) | **7,033 Adelic pairs + 45 BTZ horizons + exact $\mathbb{Q}(i)$ solve PASS** |
| **Executable Theorem Suite** | `npm test` ([test/verify.mjs](test/verify.mjs)) | **9/9 theorems passed** ($10^{-11}$–$10^{-16}$ tolerances) |
| **AMS-LaTeX PDF & arXiv Bundle** | Tectonic `0.17.0` ([dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf)) | **Zero warnings**, standalone `arxiv_submission.tar.gz` verified |
| **Reproducible Discovery Benchmarks** | `npm run discover` ([results/discovery-benchmarks.json](results/discovery-benchmarks.json)) | **4/4 experiments archived** (exact Jacobi spectra, SPFA curvature, soliton sweep, AB flux parity) |
| **Live WebGL2 + Browser Check** | `http://localhost:4174` | **0 console errors**, `||psi||^2 - 1 = 2.44e-15`, `Bulk KG Resid = 6.94e-17` |

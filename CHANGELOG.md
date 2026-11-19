# Changelog

All notable releases, mathematical proofs, verification suites, and engine changes in **ULTRAMETRICA** are documented here.

## [1.0.0] — 2026-11-18

### Added
- **Exact $p$-adic Harmonic Analysis Engine** (`src/engine/padic.js`): zero-dependency native Radix-$p$ Cooley-Tukey Pontryagin FFT ($p \in \{2, 3, 5, 7\}$), exact Vladimirov operator $D_p^\alpha$, exact orthonormal Kozyrev wavelet generator, $O(N)$ Fast Kozyrev Wavelet Transform, and 3-point ultrametric isosceles & Gromov-product prover.
- **4th-Order Yoshida Symplectic Nonlinear Quantum Engine** (`src/engine/quantum.js`): nonlinear $p$-adic Gross-Pitaevskii solver, non-commuting Monna-conjugated Adelic hybrid morph ($\theta \in [0, 1]$), and synchronized Archimedean $\mathbb{R}$ twin at calibrated RMS spectral scale.
- **Exact $O(V)$ Holographic Bulk Gravity & Rotating Kerr-BTZ Engine** (`src/engine/holography.js`): Bruhat-Tits tree $T_p$ and Tate-curve BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$, exact $O(V)$ Schur-complement + Hermitian rank-1 Sherman-Morrison complex Klein-Gordon solver, Gubser-Heydeman-Jepsen-Marcolli dynamic edge-length Einstein gravity backreaction, exact Ollivier-Ricci curvature (Kantorovich tree theorem + exact SPFA bipartite Wasserstein transport on horizon cycles), and exact $O(V)$ Tree/Cycle DP Ryu-Takayanagi minimal cut.
- **Interactive WebGL2 3D Hyperbolic Bulk Observatory & 48 kHz AudioWorklet** (`src/web/`): 6 curated experiments, 4 live physics shader modes, raycast picking for Kozyrev wavelet injection / ER=EPR wormhole surgery / RT painting / 3-point probing, Reality Split oscilloscope, Vladimirov shell spectrum, and non-octave prime-power AudioWorklet DSP synthesis.
- **Machine-Checked Lean 4 Formal Proof Suite** (`lean/`, Lean 4 v4.35.0): 4 proof modules (`Basic.lean`, `AdelicSymmetry.lean`, `HolographyCurvature.lean`, `SolitonAndSolver.lean`), 24 flagship audited theorems, zero `sorryAx`, zero custom axioms, zero Mathlib dependency.
- **Automated 9-Theorem Numerical Proof Suite & Discovery Benchmarks** (`test/verify.mjs`, `scripts/discover.mjs`, `results/discovery-benchmarks.json`, `results/lean4-audit.txt`).
- **Complete Research & Governance Documentation**: Professional White Paper (`paper/WHITE_PAPER.md`), Executive Summary Paper (`SUMMARY.md`), Deep-Dive Master Report (`docs/MASTER_REPORT.md`), Master Index (`INDEX.md`), Glossary (`GLOSSARY.md`), Verification & Falsification Protocol (`VERIFICATION.md`), 0thernes Non-Commercial `LICENSE`, `LEGAL.md`, `CITATION.cff`, `NOTICE`, and GitHub issue/CI templates.

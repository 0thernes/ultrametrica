# ULTRAMETRICA — Master Index & Table of Contents

Complete navigational map of every manuscript, formal Lean 4 proof, engine module, benchmark artifact, test suite, and legal/governance record in `0thernes/ultrametrica` (`v1.0.0`).

---

## 1. Research Manuscripts & Technical Reports

| Document | Purpose | Audience |
|---|---|---|
| [`README.md`](README.md) | Flagship repository overview, quickstart, architecture, and live observatory guide | All readers |
| [`SUMMARY.md`](SUMMARY.md) | Standalone 2-page Executive Summary Paper & Novelty Verdict | Physicists, mathematicians, reviewers |
| [`paper/WHITE_PAPER.md`](paper/WHITE_PAPER.md) | Full 13-section Research White Paper with formal proofs, experimental tables, novelty audit & 18 primary citations | Academic & independent researchers |
| [`docs/MASTER_REPORT.md`](docs/MASTER_REPORT.md) | Deep-dive technical, mathematical, scientific, computational, functional & operational Master Report | Engineers, theorists, auditors |
| [`VERIFICATION.md`](VERIFICATION.md) | Provable / Falsifiable / Verifiable / Authenticated protocol & SHA-256 checksums | Independent verifiers |
| [`GLOSSARY.md`](GLOSSARY.md) | Comprehensive 45+ term mathematical, holographic & acoustic glossary | All readers |

## 2. Formal Lean 4 Proofs (`lean/`, Lean `v4.35.0`)

| File | Declarations & Scope | Audit Status |
|---|---|---|
| [`lean/README.md`](lean/README.md) | Proof architecture, build instructions & 24-theorem axiom table | — |
| [`lean/UltrametricaProofs.lean`](lean/UltrametricaProofs.lean) | Root verification module + `#print axioms` audit for all 24 flagship theorems | Verified (`0` `sorryAx`) |
| [`lean/UltrametricaProofs/Basic.lean`](lean/UltrametricaProofs/Basic.lean) | Ultrametric isosceles triangle theorem, prime-power strong triangle inequality, Monna involution $R_p^2 = I$, digit-complement commutation | Verified |
| [`lean/UltrametricaProofs/AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | **Theorem I**: Exact Hilbert-space completeness $1 + \sum (p-1)p^s = p^n$, valuation-preserving Fourier conjugacy, odd-prime doublet protection vs. $p=2$ self-conjugacy | Verified |
| [`lean/UltrametricaProofs/HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | **Theorem II**: Exact cleared-denominator BTZ Ollivier-Ricci excess $(p+1)\max(0,6-L)-4$, complete $L \in \{3,4,5,\ge 6\}$ trichotomy, Gubser BF squared bound, RT horizon dominance | Verified |
| [`lean/UltrametricaProofs/SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | **Theorems III & IV**: Exact multi-ball Kozyrev compacton-soliton invariance, zero cross-talk on disjoint balls, Hermitian horizon-edge PSD decomposition, unconditional Sherman-Morrison $1 + wq \ge 1$ | Verified |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Captured clean-build Lean 4 kernel output & axiom audit transcript | Authenticated |

## 3. Mathematical Engine & Interactive Observatory (`src/`)

| File | Subsystem | Complexity |
|---|---|---|
| [`src/engine/padic.js`](src/engine/padic.js) | Exact $p$-adic arithmetic, base-$p$ Monna map, native Radix-$p$ Pontryagin FFT, Vladimirov $D_p^\alpha$, Kozyrev wavelets, $O(N)$ Fast Kozyrev Transform, ultrametric triangle prover | $O(p N \log_p N)$ / $O(p N)$ |
| [`src/engine/holography.js`](src/engine/holography.js) | Bruhat-Tits tree $T_p$ & rotating Kerr-BTZ Tate curve $T_p/p^{h\mathbb{Z}}$, exact $O(V)$ Schur + Sherman-Morrison Klein-Gordon solver, dynamic edge-length Einstein gravity, exact Ollivier-Ricci curvature (Kantorovich + SPFA), exact $O(V)$ Ryu-Takayanagi DP | Exact $O(V)$ |
| [`src/engine/quantum.js`](src/engine/quantum.js) | 4th-order Yoshida symplectic nonlinear $p$-adic Gross-Pitaevskii solver, Adelic hybrid morph $\theta$, synchronized Archimedean $\mathbb{R}$ twin, live diagnostics | $O(p N \log_p N)$ |
| [`src/engine/simulation.js`](src/engine/simulation.js) | Master coupled holographic orchestrator & 6 curated alien-physics experiments | 60 FPS real-time |
| [`src/web/renderer3d.js`](src/web/renderer3d.js) | Custom GLSL 300 es 3D hyperbolic Poincaré-bowl & rotating Kerr event-horizon WebGL2 renderer + exact 3D raycast picking | $O(V + E)$ |
| [`src/web/panels2d.js`](src/web/panels2d.js) | High-DPI Reality Split ($\mathbb{Q}_p$ vs. $\mathbb{R}$), Vladimirov Shell Spectrum, and Ultrametric Isosceles Prover canvases | 60 FPS |
| [`src/web/audio-worklet.js`](src/web/audio-worklet.js) | Lock-free 48 kHz `AudioWorkletProcessor` synthesizing prime-power harmonic ladders ($2^x, 3^x, 5^x, 7^x$) | $O(n)$ / sample |
| [`src/web/audio.js`](src/web/audio.js) | WebAudio controller, prime-scale frequency mapping & stereo delay network | — |
| [`src/web/index.html`](src/web/index.html), [`styles.css`](src/web/styles.css), [`app.js`](src/web/app.js) | Dark-obsidian scientific observatory UI & interactive tool controller | — |
| [`server.mjs`](server.mjs) | Zero-dependency local HTTP server (`PORT` configurable, default `4173`) | — |

## 4. Automated Verification, Benchmarks & Results

| File | Description |
|---|---|
| [`test/verify.mjs`](test/verify.mjs) | 9 automated mathematical & physical theorems (`npm test`) |
| [`scripts/discover.mjs`](scripts/discover.mjs) | 4 reproducible discovery experiments (`npm run discover`) |
| [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) | Archived exact Jacobi spectra, SPFA BTZ curvatures, soliton leakage curves & AB flux parity data |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Archived clean Lean 4 `lake build` & `#print axioms` output |

## 5. Legal, Governance, Citation & GitHub Infrastructure

| File | Description |
|---|---|
| [`LICENSE`](LICENSE) | 0thernes COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY |
| [`LEGAL.md`](LEGAL.md) | Ownership, non-commercial reservation, AI disclosure, attribution & proof boundaries |
| [`NOTICE`](NOTICE) | Zero third-party runtime dependency statement & external toolchain notices |
| [`CITATION.cff`](CITATION.cff) | CFF 1.2.0 academic citation metadata |
| [`VERSION`](VERSION) & [`CHANGELOG.md`](CHANGELOG.md) | Semantic release version (`1.0.0`) and history |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Bug report, research proposal, and dedicated **Proof Challenge / Falsification** templates |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Automated CI verifying `npm test`, `npm run discover`, and Lean 4 `lake build` (zero `sorryAx`) |
| [`.github/SECURITY.md`](.github/SECURITY.md), [`CONTRIBUTING.md`](.github/CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) | Security disclosure policy, contribution standards, and research conduct |

## 6. Cross-Reference Index of Main Theorems

| Theorem | Short Name | White Paper | Lean 4 Proof | Executable Test |
|---|---|---|---|---|
| **Theorem I** | Adelic Parity-Doubling Dichotomy & Recursive Valuation-Residue Decomposition | [Section 4](paper/WHITE_PAPER.md#4-the-monna-conjugated-adelic-hybrid-hamiltonian--parity-doubling-dichotomy-theorem-i) | [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | `Theorem 9` & `Exp A` |
| **Theorem II** | Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy | [Section 6](paper/WHITE_PAPER.md#6-unified-tate-curve-btz-ollivier-ricci-curvature-law--l_c--5-trichotomy-theorem-ii) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | `Theorem 7`, `Theorem 9` & `Exp B` |
| **Theorem III** | Exact Multi-Ball Kozyrev Compacton-Soliton Invariance & Self-Trapping | [Section 3](paper/WHITE_PAPER.md#3-kozyrev-wavelets--multi-ball-nonlinear-compacton-soliton-invariance-theorem-iii) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 2`, `Theorem 4` & `Exp C` |
| **Theorem IV** | Unconditional Positive-Definite Rank-1 Kerr-BTZ Bulk Solver | [Section 5](paper/WHITE_PAPER.md#5-bruhat-tits-ads--rotating-kerr-btz-bulk-klein-gordon-solver-theorem-iv) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 5`, `Theorem 6` & `Exp D` |

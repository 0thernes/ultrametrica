# ULTRAMETRICA — Master Index & Table of Contents (`v1.2.0`)

Complete navigational map of every manuscript, formal Lean 4 proof, claim ledger, engine module, benchmark artifact, mutant test suite, and legal/governance record in `0thernes/ultrametrica` (`v1.2.0`).

---

## 1. Research Manuscripts, Claim Ledger & Technical Reports

| Document | Purpose | Audience |
|---|---|---|
| [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf) | **Frozen 13-page AMS-LaTeX White Paper PDF** (zero warnings, 4 vector figures) & standalone [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz) | Academic & independent researchers |
| [`docs/CLAIMS.md`](docs/CLAIMS.md) | **1-to-1 Claim-to-Theorem & Epistemic Boundary Ledger** (Tier A–D evidence mapping) | Formal auditors & reviewers |
| [`paper/main.tex`](paper/main.tex) & [`paper/refs.bib`](paper/refs.bib) | Publication-grade AMS-LaTeX manuscript source & 18 BibTeX primary citations | arXiv / LaTeX builders |
| [`README.md`](README.md) | Flagship repository overview, quickstart, live GitHub Pages link & 6-layer verification | All readers |
| [`SUMMARY.md`](SUMMARY.md) | Standalone 2-page Executive Summary Paper & Novelty Verdict | Physicists, mathematicians, reviewers |
| [`paper/WHITE_PAPER.md`](paper/WHITE_PAPER.md) | Full 13-section Markdown White Paper with proofs, tables, novelty audit & 18 citations | GitHub readers |
| [`docs/MASTER_REPORT.md`](docs/MASTER_REPORT.md) | Deep-dive technical, mathematical, scientific, computational, functional & operational Master Report | Engineers, theorists, auditors |
| [`VERIFICATION.md`](VERIFICATION.md) | Provable / Falsifiable / Verifiable / Authenticated protocol & SHA-256 verification | Independent verifiers |
| [`CHECKSUMS.sha256`](CHECKSUMS.sha256) | Bit-exact SHA-256 cryptographic manifest across all 53 tracked files | Automated CI & archivists |
| [`GLOSSARY.md`](GLOSSARY.md) | Comprehensive 45+ term mathematical, holographic & acoustic glossary | All readers |

## 2. Formal Lean 4 Proofs (`lean/`, Pure Lean `v4.35.0`, 71 Audited Theorems, 1,706 Lines)

| File | Declarations & Scope | Audit Status |
|---|---|---|
| [`lean/README.md`](lean/README.md) | Proof architecture, build instructions & 71-theorem axiom table | — |
| [`lean/UltrametricaProofs.lean`](lean/UltrametricaProofs.lean) | Clean root library module importing all 4 proof libraries | Verified (`0` `sorry`) |
| [`lean/VerifyAxioms.lean`](lean/VerifyAxioms.lean) | Standalone `#print axioms` audit script for all 71 exported declarations | Verified (`0` `sorryAx`, `0` `native_decide`) |
| [`lean/UltrametricaProofs/Basic.lean`](lean/UltrametricaProofs/Basic.lean) | Ultrametric isosceles theorem, strong divisibility inequality, **universal** Monna involution $R_p^2 = I$, **universal** complement commutation, **universal** $p$-adic ball contiguity (`20` decls) | Verified |
| [`lean/UltrametricaProofs/AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | **Theorem I**: Hilbert completeness, **universal** Bruhat-Tits subtree cyclic-shift ultrametric isometry, Fourier periodicity & phase separation, conjugate sector pairing & odd-prime doublet protection (`15` decls) | Verified |
| [`lean/UltrametricaProofs/HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | **Theorem II**: **First-principles Kantorovich primal-dual** 1-Wasserstein proofs for pure AdS & BTZ ($L \ge 3$), exact excess $(p+1)\max(0,6-L)-4$, complete $L_c=5$ trichotomy, Gubser BF bound, generalized RT horizon arc bounds & complement symmetry $S(A) = S(A^c)$ (`24` decls) | Verified |
| [`lean/UltrametricaProofs/SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | **Theorems III & IV**: Arbitrary $K$-ball disjoint Kozyrev compacton-soliton invariance, Hermitian edge PSD & expansion, unconditional Sherman-Morrison denominator $\ge 1$, **arbitrary-dimension complex Sherman-Morrison identity**, exact Kerr flux parity laws (`12` decls) | Verified |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Captured clean-build Lean 4 kernel output & 71-declaration axiom audit transcript | Authenticated |

## 3. Mathematical Engine & Interactive Observatory (`src/`)

| File | Subsystem | Complexity |
|---|---|---|
| [`src/engine/padic.js`](src/engine/padic.js) | Exact $p$-adic arithmetic, base-$p$ Monna map, native Radix-$p$ Pontryagin FFT, Vladimirov $D_p^\alpha$, Kozyrev wavelets, $O(N)$ Fast Kozyrev Transform, ultrametric triangle prover | $O(p N \log_p N)$ / $O(p N)$ |
| [`src/engine/holography.js`](src/engine/holography.js) | Bruhat-Tits tree $T_p$ & rotating Kerr-BTZ Tate curve $T_p/p^{h\mathbb{Z}}$, exact $O(V)$ Schur + Sherman-Morrison Klein-Gordon solver, dynamic edge-length Einstein gravity, exact Ollivier-Ricci curvature, exact $O(V)$ Ryu-Takayanagi DP | Exact $O(V)$ |
| [`src/engine/quantum.js`](src/engine/quantum.js) | 4th-order Yoshida symplectic nonlinear $p$-adic Gross-Pitaevskii solver, Adelic hybrid morph $\theta$, synchronized Archimedean $\mathbb{R}$ twin, live diagnostics | $O(p N \log_p N)$ |
| [`src/engine/simulation.js`](src/engine/simulation.js) | Master coupled holographic orchestrator & 6 curated alien-physics experiments | 60 FPS real-time |
| [`src/web/renderer3d.js`](src/web/renderer3d.js) | Custom GLSL 300 es 3D hyperbolic Poincaré-bowl & rotating Kerr event-horizon WebGL2 renderer, exact 3D raycast picking, PNG snapshot export & WebGL2 fallback | $O(V + E)$ |
| [`src/web/panels2d.js`](src/web/panels2d.js) | High-DPI Reality Split ($\mathbb{Q}_p$ vs. $\mathbb{R}$), Vladimirov Shell Spectrum, and Ultrametric Isosceles Prover canvases | 60 FPS |
| [`src/web/audio-worklet.js`](src/web/audio-worklet.js) & [`audio.js`](src/web/audio.js) | Lock-free 48 kHz `AudioWorkletProcessor` synthesizing prime-power harmonic ladders ($2^x, 3^x, 5^x, 7^x$) | $O(n)$ / sample |
| [`src/web/index.html`](src/web/index.html), [`styles.css`](src/web/styles.css), [`app.js`](src/web/app.js) | Dark-obsidian observatory UI, URL query-string permalinks, Share/Snapshot buttons & `?` Formal Audit modal | — |
| [`server.mjs`](server.mjs) | Zero-dependency local HTTP server (`PORT` configurable, default `4173`; redirects `/` $\to$ `/web/`) | — |

## 4. Automated Verification, Mutants, Benchmarks & Packaging

| File | Description |
|---|---|
| [`test/verify.mjs`](test/verify.mjs) | 9 automated mathematical & physical theorems (`npm test`) |
| [`test/mutants.mjs`](test/mutants.mjs) | 6 planted negative-mutant falsification checks (`npm run falsify`, 6/6 killed) |
| [`scripts/discover.mjs`](scripts/discover.mjs) | 6 reproducible discovery experiments Exp A–F (`npm run discover`, up to $N=625$) |
| [`scripts/verify_exact.py`](scripts/verify_exact.py) | Independent zero-dependency exact `int`/`Fraction`/$\mathbb{Q}(i)$ falsifier, metadata check & `CHECKSUMS.sha256` auditor |
| [`scripts/generate_figures.py`](scripts/generate_figures.py) | Compiles 4 cropped PGFPlots vector PDFs (`paper/figures/fig{1..4}_*.pdf`) via Tectonic |
| [`scripts/package_dist.py`](scripts/package_dist.py) | Builds zero-warning release PDF & verifies standalone compilation of `dist/arxiv_submission.tar.gz` |
| [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) | Archived benchmark datasets (Exp A–F) |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Archived clean Lean 4 `VerifyAxioms.lean` 71-declaration transcript |

## 5. Legal, Governance, Citation & GitHub Infrastructure

| File | Description |
|---|---|
| [`LICENSE`](LICENSE) | 0thernes COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY |
| [`LEGAL.md`](LEGAL.md) | Ownership, non-commercial reservation, solo + AI disclosure, attribution & proof boundaries |
| [`NOTICE`](NOTICE) | Zero third-party runtime dependency statement & external toolchain notices |
| [`CITATION.cff`](CITATION.cff) | CFF 1.2.0 academic citation metadata (`v1.2.0`, ORCID `0009-0006-8168-9648`) |
| [`VERSION`](VERSION) & [`CHANGELOG.md`](CHANGELOG.md) | Semantic release version (`1.2.0`) and release history |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Bug report, research proposal, and dedicated **Proof Challenge / Falsification** templates |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | 4-job automated CI (Node 9 theorems + 6 mutants + Exp A–F, Python exact + `sha256sum`, Lean 4 71-theorem build, Tectonic zero-warning PDF + standalone arXiv check) |
| [`.github/workflows/pages.yml`](.github/workflows/pages.yml) | Automated static GitHub Pages deployment to `https://0thernes.github.io/ultrametrica/` |
| [`.github/SECURITY.md`](.github/SECURITY.md), [`CONTRIBUTING.md`](.github/CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) | Security disclosure policy, contribution standards, and research conduct |

## 6. Cross-Reference Index of Main Theorems

| Theorem | Short Name | Claims Ledger | Lean 4 Proof | Executable & Mutant Tests |
|---|---|---|---|---|
| **Theorem I** | Adelic Parity-Doubling, Subtree Isometry & Modular Picket-Fence Locking | [`docs/CLAIMS.md`](docs/CLAIMS.md#a2-theorem-i--adelic-parity-doubling-dichotomy--subtree-isometry-adelicsymmetrylean-15-declarations) | [`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | `Theorem 9`, `Mutant M1`, `Exp A`, `Exp E` |
| **Theorem II** | First-Principles Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy | [`docs/CLAIMS.md`](docs/CLAIMS.md#a3-theorem-ii--first-principles-optimal-transport-curvature-bf-bound--rt-theorems-holographycurvaturelean-24-declarations) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | `Theorem 7`, `Theorem 9`, `Mutant M3`, `Exp B`, `verify_exact.py` |
| **Theorem III** | Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaling | [`docs/CLAIMS.md`](docs/CLAIMS.md#a4-theorems-iii--iv--multi-ball-solitons-exact-complex-sherman-morrison--kerr-parity-solitonandsolverlean-12-declarations) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 2`, `Theorem 4`, `Mutant M5`, `Exp C`, `Exp F` |
| **Theorem IV** | Unconditional Rank-1 Kerr-BTZ Bulk Solver & Flux Parity Laws | [`docs/CLAIMS.md`](docs/CLAIMS.md#a4-theorems-iii--iv--multi-ball-solitons-exact-complex-sherman-morrison--kerr-parity-solitonandsolverlean-12-declarations) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 5`, `Theorem 6`, `Mutant M2`, `Mutant M4`, `Exp D`, `verify_exact.py` |

# ULTRAMETRICA — Master Index & Table of Contents (`v1.5.0`)

Complete navigational map of every manuscript, formal Lean 4 proof (`149` audited declarations = `139` core theorems across 5 Palomar modules + `10` isolated 6-kernel comparator targets), interactive proof blueprint (`src/web/blueprint.html`), live Crossref DOI audit (`docs/LITERATURE_SEARCH.md`), 3-cycle hardening dossier (`F01`–`F36`), Mega-Atlas cross-check (`0/1,900`), pre-registered statistical audit, claim ledger, engine module, benchmark artifact, runnable example, and governance record in `0thernes/ultrametrica` (`v1.5.0`).

---

## 1. Research Manuscripts, Claim Ledger & Audit Reports

| Document | Purpose | Audience |
|---|---|---|
| [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf) | **Frozen 15-page AMS-LaTeX White Paper PDF** (zero warnings, 5 vector figures) & standalone [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz) | Academic & independent researchers |
| [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](docs/AUDIT_AND_CONTRAST_ANALYSIS.md) | **Multi-Layer Adversarial Audit & Contrast Comparative Analysis** (substrates, spectrums, gradients/margins, taxonomies, adjacents & 16-issue register) | Reviewers, auditors & theorists |
| [`docs/CLAIMS.md`](docs/CLAIMS.md) | **1-to-1 Claim-to-Theorem & Epistemic Boundary Ledger** (Tier A–D evidence mapping for all 101 Lean declarations) | Formal auditors & reviewers |
| [`paper/main.tex`](paper/main.tex) & [`paper/refs.bib`](paper/refs.bib) | Publication-grade AMS-LaTeX manuscript source & 18 BibTeX primary citations | arXiv / LaTeX builders |
| [`README.md`](README.md) | Flagship repository overview, quickstart, live GitHub Pages link & 6-layer verification | All readers |
| [`SUMMARY.md`](SUMMARY.md) | Standalone Executive Summary Paper & Novelty Verdict | Physicists, mathematicians, reviewers |
| [`paper/WHITE_PAPER.md`](paper/WHITE_PAPER.md) | Full 13-section Markdown White Paper synchronized with `paper/main.tex` (`v1.3.0`) | GitHub readers |
| [`docs/MASTER_REPORT.md`](docs/MASTER_REPORT.md) | Deep-dive technical, mathematical, scientific, computational, functional & operational Master Report | Engineers, theorists, auditors |
| [`VERIFICATION.md`](VERIFICATION.md) | Provable / Falsifiable / Verifiable / Authenticated protocol & SHA-256 verification | Independent verifiers |
| [`CHECKSUMS.sha256`](CHECKSUMS.sha256) | Bit-exact SHA-256 cryptographic manifest across all 55 tracked files | Automated CI & archivists |
| [`GLOSSARY.md`](GLOSSARY.md) | Comprehensive 45+ term mathematical, holographic & acoustic glossary | All readers |

## 2. Formal Lean 4 Proofs (`lean/`, Pure Lean `v4.35.0`, 101 Audited Theorems, 2,267 Lines)

| File | Declarations & Scope | Audit Status |
|---|---|---|
| [`lean/README.md`](lean/README.md) | Proof architecture, build instructions & 101-theorem axiom table | — |
| [`lean/UltrametricaProofs.lean`](lean/UltrametricaProofs.lean) | Clean root library module importing all 4 proof libraries | Verified (`0` `sorry`) |
| [`lean/VerifyAxioms.lean`](lean/VerifyAxioms.lean) | Standalone `#print axioms` audit script for all 101 exported declarations | Verified (`0` `sorryAx`, `0` `native_decide`) |
| [`lean/UltrametricaProofs/Basic.lean`](lean/UltrametricaProofs/Basic.lean) | Ultrametric isosceles theorem, strong divisibility, **universal** Monna involution/bijectivity, complement commutation, ball contiguity/cardinality, concrete `bruhatTitsUltrametric` (`26` decls) | Verified |
| [`lean/UltrametricaProofs/AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | **Theorem I & Prop. 4.2**: Hilbert completeness, **universal** Bruhat-Tits subtree shift isometry, Fourier periodicity/phase separation, conjugate pairing, odd-prime doublets, **universal modular picket-fence law** (`23` decls) | Verified |
| [`lean/UltrametricaProofs/HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | **Theorems II & V**: Cycle-graph metric bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual proofs for pure AdS, uniform BTZ ($L \ge 3$), and **curved AdS Gauss-Bonnet / supercritical pinch deficit**, $L_c=5$ trichotomy, monotonicity, Euler $\chi = 1, 0$, BF bound & shadow duality, RT horizon bounds & complement symmetry (`40` decls) | Verified |
| [`lean/UltrametricaProofs/SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | **Theorems III & IV**: Arbitrary $K$-ball disjoint Kozyrev compacton-solitons, Hermitian edge PSD & expansion, Sherman-Morrison denominator inequality $1 \le 1 + wq$ for $w, q \ge 0$ (hypotheses), arbitrary-dimension complex Hermitian Sherman-Morrison identity, exact Kerr flux parity laws (`12` decls) | Verified |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Captured clean-build Lean 4 kernel output & 101-declaration axiom audit transcript | Authenticated |

## 3. Mathematical Engine & Interactive Observatory (`src/`)

| File | Subsystem | Complexity |
|---|---|---|
| [`src/engine/padic.js`](src/engine/padic.js) | Exact $p$-adic arithmetic, base-$p$ Monna map, native Radix-$p$ Pontryagin FFT, Vladimirov $D_p^\alpha$, Kozyrev wavelets, $O(N)$ Fast Kozyrev Transform, ultrametric triangle prover | $O(p N \log_p N)$ / $O(p N)$ |
| [`src/engine/holography.js`](src/engine/holography.js) | Bruhat-Tits tree $T_p$ & rotating Kerr-BTZ Tate curve $T_p/p^{h\mathbb{Z}}$, exact $O(V)$ Schur + Sherman-Morrison Klein-Gordon solver, symmetric Jacobi dynamic gravity, zero-GC exact Ollivier-Ricci & Ryu-Takayanagi DP | Exact $O(V)$ |
| [`src/engine/quantum.js`](src/engine/quantum.js) | 4th-order Yoshida symplectic nonlinear $p$-adic Gross-Pitaevskii solver, Adelic hybrid morph $\theta$, synchronized Archimedean $\mathbb{R}$ twin, live diagnostics | $O(p N \log_p N)$ |
| [`src/engine/simulation.js`](src/engine/simulation.js) | Master coupled holographic orchestrator & 6 curated alien-physics experiments | 60 FPS real-time |
| [`src/web/renderer3d.js`](src/web/renderer3d.js) | Custom GLSL 300 es 3D hyperbolic Poincaré-bowl & rotating Kerr event-horizon WebGL2 renderer with cached uniform locations, zero-GC staging, context-loss recovery & PNG snapshot | $O(V + E)$ |
| [`src/web/panels2d.js`](src/web/panels2d.js) | High-DPI Reality Split ($\mathbb{Q}_p$ vs. $\mathbb{R}$), Vladimirov Shell Spectrum, and collision-free Ultrametric Isosceles Prover canvases | 60 FPS |
| [`src/web/audio-worklet.js`](src/web/audio-worklet.js) & [`audio.js`](src/web/audio.js) | Lock-free 48 kHz `AudioWorkletProcessor` with unified prime-power ladders ($2^x, 3^x, 5^x, 7^x$) & click-free smoothed BTZ drone crossfading | $O(n)$ / sample |
| [`src/web/index.html`](src/web/index.html), [`styles.css`](src/web/styles.css), [`app.js`](src/web/app.js) | Zero-clipping `1280×800` dark-obsidian observatory UI, full URL query-string permalinks, Share/Snapshot buttons & `?` Formal Audit modal | — |
| [`server.mjs`](server.mjs) | Hardened zero-dependency local HTTP server (`GET`/`HEAD` only, traversal/null-byte protection, `nosniff`/`CORP`/`Referrer-Policy` headers) | — |

## 4. Automated Verification, Mutants, Benchmarks & Packaging

| File | Description |
|---|---|
| [`test/verify.mjs`](test/verify.mjs) | 10 automated mathematical & physical theorems (`npm test`) |
| [`test/mutants.mjs`](test/mutants.mjs) | 8 planted negative-mutant falsification checks (`npm run falsify`, 8/8 killed) |
| [`scripts/discover.mjs`](scripts/discover.mjs) | 8 reproducible discovery experiments Exp A–H (`npm run discover`, up to $N=625$) |
| [`scripts/verify_exact.py`](scripts/verify_exact.py) | Independent zero-dependency exact `int`/`Fraction`/$\mathbb{Q}(i)$ falsifier (Theorems I–V), metadata check & 55-file `CHECKSUMS.sha256` auditor |
| [`scripts/generate_figures.py`](scripts/generate_figures.py) | Compiles 5 cropped PGFPlots vector PDFs (`paper/figures/fig{1..5}_*.pdf`) via Tectonic |
| [`scripts/package_dist.py`](scripts/package_dist.py) | Builds zero-warning 15-page release PDF & verifies standalone compilation of `dist/arxiv_submission.tar.gz` |
| [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) | Archived benchmark datasets (Exp A–H) |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Archived clean Lean 4 `VerifyAxioms.lean` 101-declaration transcript |

## 5. Legal, Governance, Citation & GitHub Infrastructure

| File | Description |
|---|---|
| [`LICENSE`](LICENSE) | 0thernes COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY |
| [`LEGAL.md`](LEGAL.md) | Ownership, non-commercial reservation, solo + AI disclosure, attribution & proof boundaries |
| [`NOTICE`](NOTICE) | Zero third-party runtime dependency statement & external toolchain notices |
| [`CITATION.cff`](CITATION.cff) | CFF 1.2.0 academic citation metadata (`v1.3.0`, ORCID `0009-0006-8168-9648`) |
| [`VERSION`](VERSION) & [`CHANGELOG.md`](CHANGELOG.md) | Semantic release version (`1.3.0`) and release history |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | Bug report, research proposal, and dedicated **Proof Challenge / Falsification** templates |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | 4-job automated CI (Node 10 theorems + 8 mutants + Exp A–H, Python exact + `sha256sum`, Lean 4 101-theorem build, Tectonic zero-warning PDF + standalone arXiv check) |
| [`.github/workflows/pages.yml`](.github/workflows/pages.yml) | Automated static GitHub Pages deployment to `https://0thernes.github.io/ultrametrica/` |
| [`.github/SECURITY.md`](.github/SECURITY.md), [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md), [`.github/CODE_OF_CONDUCT.md`](.github/CODE_OF_CONDUCT.md) | Security disclosure policy, contribution standards, and research conduct |

## 6. Cross-Reference Index of Main Theorems

| Theorem | Short Name | Claims Ledger | Lean 4 Proof | Executable & Mutant Tests |
|---|---|---|---|---|
| **Theorem I** | Adelic Parity-Doubling, Subtree Isometry & $\alpha$-Invariant Modular Picket-Fence Locking | [`docs/CLAIMS.md`](docs/CLAIMS.md#a2-theorem-i--proposition-42--adelic-parity-doubling-subtree-isometry--picket-fence-law-adelicsymmetrylean-23-declarations) | [`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | `Theorem 9`, `Mutant M1`, `Exp A`, `Exp E`, `Exp G` |
| **Theorem II** | Cycle-Metric-Bridged Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy | [`docs/CLAIMS.md`](docs/CLAIMS.md#a3-theorems-ii--v--optimal-transport-curvature-cycle-bridge-euler-chi-bf-bound-rt--curved-gauss-bonnet-holographycurvaturelean-40-declarations) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | `Theorem 7`, `Theorem 9`, `Mutant M3`, `Exp B`, `verify_exact.py` |
| **Theorem III** | Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaling | [`docs/CLAIMS.md`](docs/CLAIMS.md#a4-theorems-iii--iv--multi-ball-solitons-exact-complex-sherman-morrison--kerr-parity-solitonandsolverlean-12-declarations) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 2`, `Theorem 4`, `Mutant M5`, `Exp C`, `Exp F` |
| **Theorem IV** | Rank-1 Kerr-BTZ Bulk Solver, Flux Parity & BF Margin | [`docs/CLAIMS.md`](docs/CLAIMS.md#a4-theorems-iii--iv--multi-ball-solitons-exact-complex-sherman-morrison--kerr-parity-solitonandsolverlean-12-declarations) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 5`, `Theorem 6`, `Theorem 10`, `Mutant M2`, `Mutant M4`, `Exp D`, `Exp H2`, `verify_exact.py` |
| **Theorem V** | Non-Perturbative Curved AdS Discrete Gauss-Bonnet Conservation & Supercritical Pinch Deficit | [`docs/CLAIMS.md`](docs/CLAIMS.md#a3-theorems-ii--v--optimal-transport-curvature-cycle-bridge-euler-chi-bf-bound-rt--curved-gauss-bonnet-holographycurvaturelean-40-declarations) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | `Theorem 10`, `Mutant M8`, `Exp H1`, `verify_exact.py` (60 curved plans) |

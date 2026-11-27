# ULTRAMETRICA — Master Index & Table of Contents (`v1.6.0`)

Complete navigational map of every manuscript, formal Lean 4 proof (`148` audited declarations = `104` core theorems + `29` zero-Mathlib helper lemmas + `5` adversarial false-variant refutations across six Palomar proof modules + `10` isolated 6-kernel comparator bindings; all 11 `.lean` files `< 1,000` lines), interactive proof blueprint (`src/web/blueprint.html`), live Crossref DOI audit (`docs/LITERATURE_SEARCH.md`), 3-cycle hardening dossiers (`F01`–`F36` & `F37`–`F65`), Mega-Atlas cross-check (`0/1,900`), pre-registered statistical audit + deviations (`DEVIATIONS.md`), claim ledger, engine module, verification suite (`32/32` Node tests incl. true source mutation, B15 fuzzing & B19 concurrency), benchmark artifact, runnable example, and governance record in `0thernes/ultrametrica` (`v1.6.0`).

---

## 1. Research Manuscripts, Claim Ledgers & Audit Reports

| Document | Purpose | Audience |
|---|---|---|
| [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf) | **Frozen AMS-LaTeX White Paper PDF** (zero warnings, 5 vector figures, `21/21` refs) & standalone [`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz) | Academic & independent researchers |
| [`paper/main.tex`](paper/main.tex) & [`paper/refs.bib`](paper/refs.bib) | Publication-grade AMS-LaTeX manuscript source & 21 BibTeX primary citations (`18/18` live Crossref DOIs HTTP 200, `0` retractions) | arXiv / LaTeX builders |
| [`README.md`](README.md) | Flagship repository overview, quickstart, verbatim 5-second `#print axioms` block, live observatory & 8-layer verification | All readers |
| [`SUMMARY.md`](SUMMARY.md) | Standalone Executive Summary Paper & Honest Novelty Verdict (`v1.6.0`) | Physicists, mathematicians, reviewers |
| [`CLAIMS.md`](CLAIMS.md) & [`docs/CLAIMS.md`](docs/CLAIMS.md) | **1-to-1 Claim-to-Theorem & Epistemic Boundary Ledgers** (honest 4-bucket mapping across all 148 Lean declarations & Exp A–I) | Formal auditors & reviewers |
| [`LIMITATIONS.md`](LIMITATIONS.md) | Honest scope boundaries, literal-vs-metaphor table, finite-$N$ ceiling & non-claims | Skeptical reviewers |
| [`DEVIATIONS.md`](DEVIATIONS.md) | Transparent pre-registration deviation log separating confirmatory vs. exploratory Experiment I statistics | Methodologists & statisticians |
| [`docs/preregistration.md`](docs/preregistration.md) | Git-sealed (`c171b1b`) confirmatory Experiment I preregistration & §3 deviation record | Statisticians & replicators |
| [`docs/MEGA_ATLAS_CROSSCHECK.md`](docs/MEGA_ATLAS_CROSSCHECK.md) | Exhaustive audit of all `1,900` problems in `0thernes/unsolved-problems-mega-atlas` (`0/1,900` full solutions; discrete sub-results on `SUB-032`) | Researchers & reviewers |
| [`docs/LITERATURE_SEARCH.md`](docs/LITERATURE_SEARCH.md) | Dated prior-art anti-rediscovery log & live Crossref DOI/retraction audit (`18/18` HTTP 200, `0` retractions) | Peer reviewers |
| [`docs/statement-fidelity.md`](docs/statement-fidelity.md) | Line-by-line Lean 4 statement fidelity, 4-bucket accounting & 8/8 non-vacuity audit | Formal verification auditors |
| [`docs/reviews/2026-11-26-hardening-cycles-v160.md`](docs/reviews/2026-11-26-hardening-cycles-v160.md) | `v1.6.0` 3-cycle hardening dossier (`F37`–`F65` across all 10 Build Standard classes) | Auditors & maintainers |
| [`docs/reviews/2026-11-25-hardening-cycles.md`](docs/reviews/2026-11-25-hardening-cycles.md) | `v1.4.0`–`v1.5.0` hardening dossier (`F01`–`F36`) | Auditors & maintainers |
| [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](docs/AUDIT_AND_CONTRAST_ANALYSIS.md) | Multi-layer adversarial audit & contrast comparative analysis (substrates, spectrums, gradients/margins, taxonomies & `BUG-1`..`BUG-16`) | Reviewers & theorists |
| [`paper/WHITE_PAPER.md`](paper/WHITE_PAPER.md) | Full Markdown White Paper synchronized with `paper/main.tex` (`v1.6.0`) | GitHub readers |
| [`docs/MASTER_REPORT.md`](docs/MASTER_REPORT.md) | Deep-dive technical, mathematical, computational, functional & operational Master Report (with `v1.6.0` status banner) | Engineers & theorists |
| [`VERIFICATION.md`](VERIFICATION.md) & [`REPLICATION.md`](REPLICATION.md) | 8-layer verification protocol, clean-clone reproduction commands & dated replication log | Independent verifiers |
| [`CHECKSUMS.sha256`](CHECKSUMS.sha256) & [`data/MANIFEST.sha256`](data/MANIFEST.sha256) | Bit-exact SHA-256 cryptographic manifests verified automatically in CI | Automated CI & archivists |
| [`GLOSSARY.md`](GLOSSARY.md) & [`docs/faq.md`](docs/faq.md) | 45+ term mathematical/holographic/acoustic glossary & skeptical-reviewer FAQ | All readers |

## 2. Formal Lean 4 Proofs (`lean/`, Pure Lean `v4.35.0`, Palomar `module`, All 11 Files `< 1,000` Lines)

**Honest 4-Bucket Accounting (`148` Audited Declarations):** `104` core theorems & corollaries + `29` zero-Mathlib helper lemmas + `5` adversarial false-variant refutations + `10` isolated Palomar comparator bindings (`Challenge.lean` ↔ `Solution.lean`, never double-counted as extra discoveries).

| File | Declarations & Scope | Audit Status |
|---|---|---|
| [`lean/README.md`](lean/README.md) | Proof architecture, build instructions & 6-kernel comparator guide | — |
| [`lean/UltrametricaProofs.lean`](lean/UltrametricaProofs.lean) | Clean root library module importing all 6 proof modules (`Spec` + 6 proof libraries) | Verified (`0` `sorry`) |
| [`lean/VerifyAxioms.lean`](lean/VerifyAxioms.lean) | Standalone `#print axioms` audit script for all 148 exported declarations | Verified (`0` `sorryAx`, `0` `native_decide`) |
| [`lean/UltrametricaProofs/Spec.lean`](lean/UltrametricaProofs/Spec.lean) | Pure statement-only mathematical definitions (`0` proofs) imported by `Challenge.lean` | Definitions only (`136` lines) |
| [`lean/UltrametricaProofs/Basic.lean`](lean/UltrametricaProofs/Basic.lean) | Ultrametric isosceles theorem, strong divisibility, universal Monna involution/bijectivity, complement commutation, ball contiguity/cardinality, concrete `bruhatTitsUltrametric` (`26` decls) | Verified (`384` lines) |
| [`lean/UltrametricaProofs/AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | **Theorem I & Prop. 4.2**: Hilbert completeness, universal Bruhat-Tits subtree shift isometry, Fourier periodicity/phase separation, conjugate pairing, odd-prime doublets, universal modular picket-fence law (`23` decls) | Verified (`430` lines) |
| [`lean/UltrametricaProofs/HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | **Theorems II & V (Single-Edge)**: Cycle-graph metric bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual proofs for pure AdS, uniform BTZ ($L \ge 3$), and single-edge curved AdS Gauss-Bonnet / supercritical pinch deficit, $L_c=5$ trichotomy, monotonicity, Euler $\chi = 1, 0$, BF bound & shadow duality, RT horizon bounds & complement symmetry (`39` decls) | Verified (`860` lines) |
| [`lean/UltrametricaProofs/MultiEdgeHolography.lean`](lean/UltrametricaProofs/MultiEdgeHolography.lean) | **Theorems V-Global & VI**: Zero-Mathlib `RatQ` & `finSum`, simultaneous multi-edge vertex half-charge conservation, first-principles arbitrary-degree multi-edge Kantorovich primal-dual duality (with explicit entry non-negativity proofs), and universal discrete holographic RT Strong Subadditivity (`33` decls) | Verified (`953` lines) |
| [`lean/UltrametricaProofs/SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | **Theorems III & IV**: Arbitrary $K$-packet disjoint $\mathbb{Z}[i]$ nonlinearity splitting, Hermitian edge PSD & expansion, Sherman-Morrison denominator $\ge 1$ (under $w, q \ge 0$), abstract arbitrary-dimension complex Hermitian Sherman-Morrison identity, edge-level Kerr flux parity laws (`12` decls) | Verified (`468` lines) |
| [`lean/UltrametricaProofs/AdversarialTests.lean`](lean/UltrametricaProofs/AdversarialTests.lean) | 5 kernel-checked explicit false-variant refutations (`¬ (...)`) proving theorem sharpness (`5` decls) | Verified (`71` lines) |
| [`lean/Challenge.lean`](lean/Challenge.lean) / [`lean/Solution.lean`](lean/Solution.lean) / [`lean/comparator.json`](lean/comparator.json) | 10 isolated specification target bindings (incl. tight primal-dual $W_1$, full $L$-dim Sherman-Morrison, and 8/8 concrete non-vacuity witnesses) audited across 6 kernels | Verified (`214` / `630` lines) |
| [`results/lean4-audit.txt`](results/lean4-audit.txt) | Captured clean-build Lean 4 kernel output & 148-declaration axiom audit transcript | Authenticated |

## 3. Mathematical Engine & Interactive Observatory (`src/`)

| File | Subsystem | Complexity |
|---|---|---|
| [`src/engine/padic.js`](src/engine/padic.js) | Exact $p$-adic arithmetic, base-$p$ Monna map, native Radix-$p$ Pontryagin FFT, Vladimirov $D_p^\alpha$, Kozyrev wavelets, $O(N)$ Fast Kozyrev Transform, ultrametric triangle prover (strict JSDoc typed) | $O(p N \log_p N)$ / $O(p N)$ |
| [`src/engine/holography.js`](src/engine/holography.js) | Bruhat-Tits tree $T_p$ & rotating Kerr-BTZ Tate curve $T_p/p^{h\mathbb{Z}}$, exact $O(V)$ Schur + Sherman-Morrison Klein-Gordon solver, symmetric Jacobi dynamic gravity, zero-GC exact Johnson-Dijkstra Ollivier-Ricci & Ryu-Takayanagi DP | Exact $O(V)$ |
| [`src/engine/quantum.js`](src/engine/quantum.js) | 4th-order Yoshida symplectic nonlinear $p$-adic Gross-Pitaevskii solver, Adelic hybrid morph $\theta$, synchronized Archimedean $\mathbb{R}$ twin, live diagnostics | $O(p N \log_p N)$ |
| [`src/engine/simulation.js`](src/engine/simulation.js) | Master coupled holographic orchestrator & 6 curated alien-physics experiments | 60 FPS real-time |
| [`src/web/renderer3d.js`](src/web/renderer3d.js) | Custom GLSL 300 es 3D hyperbolic Poincaré-bowl & rotating Kerr event-horizon WebGL2 renderer with cached uniform locations, zero-GC staging, context-loss recovery & PNG snapshot | $O(V + E)$ |
| [`src/web/panels2d.js`](src/web/panels2d.js) | High-DPI Reality Split ($\mathbb{Q}_p$ vs. $\mathbb{R}$), Vladimirov Shell Spectrum, and collision-free Ultrametric Isosceles Prover canvases | 60 FPS |
| [`src/web/audio-worklet.js`](src/web/audio-worklet.js) & [`audio.js`](src/web/audio.js) | Lock-free 48 kHz `AudioWorkletProcessor` with $O(1)$ log-space prime-power ladders ($2^x, 3^x, 5^x, 7^x$) & click-free smoothed BTZ drone crossfading | $O(n)$ / sample |
| [`src/web/index.html`](src/web/index.html), [`styles.css`](src/web/styles.css), [`app.js`](src/web/app.js) | Responsive WCAG 2.2 AA dark-obsidian observatory UI, full URL query-string permalinks, Share/Snapshot buttons & `?` Formal Audit modal | — |
| [`src/web/blueprint.html`](src/web/blueprint.html), [`blueprint.css`](src/web/blueprint.css), [`blueprint.js`](src/web/blueprint.js) | Interactive strict-CSP Lean 4 Proof Blueprint & Dependency DAG (`https://0thernes.github.io/ultrametrica/web/blueprint.html`) | — |
| [`server.mjs`](server.mjs) | Hardened zero-dependency local HTTP server (`GET`/`HEAD` only, `realpath` symlink confinement, control-char/traversal/protocol-relative guards, strict CSP, `/healthz`, structured JSON logs) | — |

## 4. Automated Verification, Mutants, Fuzzing, Benchmarks & Packaging

| File | Description |
|---|---|
| [`test/verify.mjs`](test/verify.mjs) | 10 automated mathematical & physical theorems (`npm test`) |
| [`test/mutants.mjs`](test/mutants.mjs) | **True source-code mutation suite** (`npm run falsify`, temp-copy patches real `src/engine/*.js`, `8/8` killed by unmodified `test/verify.mjs`) |
| [`test/properties.mjs`](test/properties.mjs) | 3,400+ seeded property, metamorphic, curved-BTZ Dijkstra stress & negative-input checks |
| [`test/server.mjs`](test/server.mjs) | HTTP contract, strict CSP headers, `/healthz`, symlink/traversal & disk `EIO` failure injection |
| [`test/golden.mjs`](test/golden.mjs) | 12-digit deterministic golden regression check (`test/golden/baseline-snapshot.json`) |
| [`test/fuzz.mjs`](test/fuzz.mjs) | Deterministic B15 fuzzer: 500 hostile HTTP URLs + 500 hostile engine/audio inputs (caught real infinite-loop bug `F65`) |
| [`test/concurrency.mjs`](test/concurrency.mjs) | B19 concurrency & async stress: 100 parallel HTTP requests, 40-op `EIO` storm & 200-block AudioWorklet VM test |
| [`reference/padic_oracle.py`](reference/padic_oracle.py) | Independent textbook Python differential oracle (`1,000+` queries, max diff `1.23e-12`) |
| [`scripts/discover.mjs`](scripts/discover.mjs) & [`stats_eval.mjs`](scripts/stats_eval.mjs) & [`bench.mjs`](scripts/bench.mjs) | Reproducible Exp A–H (`results/discovery-benchmarks.json`), pre-registered Exp I (`results/stats-eval.json`), and hardware perf budgets (`results/perf-benchmarks.json`) |
| [`scripts/verify_exact.py`](scripts/verify_exact.py) | Independent zero-dependency exact `int`/`Fraction`/$\mathbb{Q}(i)$ falsifier (Theorems I–VI), metadata/legal audit & SHA-256 manifest verifier |
| [`scripts/check_citations.py`](scripts/check_citations.py), [`check_blueprint.py`](scripts/check_blueprint.py), [`check_readme_axioms.py`](scripts/check_readme_axioms.py) | Live Crossref DOI/retraction checker (`18/18` DOIs), blueprint declaration guard (`54/54`), and verbatim README `#print axioms` guard |
| [`scripts/generate_figures.py`](scripts/generate_figures.py) & [`package_dist.py`](scripts/package_dist.py) | Compiles 5 cropped PGFPlots vector PDFs, zero-warning AMS-LaTeX PDF, & verifies standalone `dist/arxiv_submission.tar.gz` |
| [`examples/01..03`](examples/README.md) | 3 runnable end-to-end engine examples (`npm run examples`) |

## 5. Legal, Governance, Architecture & GitHub Infrastructure

| File | Description |
|---|---|
| [`LICENSE`](LICENSE) & [`LEGAL.md`](LEGAL.md) & [`NOTICE`](NOTICE) | 0thernes COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY, AI disclosure, 15 CFR § 734.8 export-control self-screen, provenance policy & zero-dependency notice |
| [`CITATION.cff`](CITATION.cff), [`formalization.yaml`](formalization.yaml), [`repo.yaml`](repo.yaml) | CFF 1.2.0 citation metadata, Lean formalization manifest & 90-item Build Standard `v1.2.0` tracking manifest |
| [`VERSION`](VERSION), [`CHANGELOG.md`](CHANGELOG.md), [`ERRATA.md`](ERRATA.md), [`ROADMAP.md`](ROADMAP.md), [`UPGRADING.md`](UPGRADING.md) | Semantic release version (`1.6.0`), changelog, correction ledger, roadmap & upgrade guide |
| [`AGENTS.md`](AGENTS.md), [`llms.txt`](llms.txt), [`llms-full.txt`](llms-full.txt), [`justfile`](justfile) | Agent instructions, LLM context bundles & task runner |
| [`docs/architecture.md`](docs/architecture.md), [`benchmarks.md`](docs/benchmarks.md), [`configuration.md`](docs/configuration.md), [`operations.md`](docs/operations.md), [`threat-model.md`](docs/threat-model.md), [`run-log.md`](docs/run-log.md), [`docs/adr/`](docs/adr/) | Engineering architecture, performance budgets, configuration, operations/rollback, STRIDE threat model, append-only run log & ADRs `0001`–`0005` |
| [`.github/workflows/`](.github/workflows/) & [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) | 3-OS CI + 6-kernel `bubblewrap` Lean + zero-warning Tectonic PDF, GitHub Pages, SLSA Release, and 10-class/falsification issue forms |

## 6. Cross-Reference Index of Main Theorems

| Theorem | Short Name | Claims Ledger | Lean 4 Proof | Executable & Mutant Tests |
|---|---|---|---|---|
| **Theorem I** | Adelic Parity-Doubling, Subtree Isometry & $\alpha$-Invariant Modular Picket-Fence Locking | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`Basic.lean`](lean/UltrametricaProofs/Basic.lean), [`AdelicSymmetry.lean`](lean/UltrametricaProofs/AdelicSymmetry.lean) | `Theorem 9`, `Mutant M1`, `Exp A`, `Exp E`, `Exp G`, `Exp I` |
| **Theorem II** | Cycle-Metric-Bridged Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean) | `Theorem 7`, `Theorem 9`, `Mutant M3`, `Mutant M8`, `Exp B`, `verify_exact.py` |
| **Theorem III** | Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaling | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 2`, `Theorem 4`, `Mutant M5`, `Exp C`, `Exp F` |
| **Theorem IV** | Positive-Definite Rank-1 Kerr-BTZ Bulk Solver ($\mathrm{den} \ge 1$ for $T \succ 0$), Flux Parity & BF Margin | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`SolitonAndSolver.lean`](lean/UltrametricaProofs/SolitonAndSolver.lean) | `Theorem 5`, `Theorem 6`, `Theorem 10`, `Mutant M2`, `Mutant M4`, `Exp D`, `Exp H2`, `verify_exact.py` |
| **Theorems V & V-Global** | Non-Perturbative Single-Edge & Simultaneous Multi-Edge Curved AdS Gauss-Bonnet Conservation & Supercritical Pinch Deficit | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`HolographyCurvature.lean`](lean/UltrametricaProofs/HolographyCurvature.lean), [`MultiEdgeHolography.lean`](lean/UltrametricaProofs/MultiEdgeHolography.lean) | `Theorem 10`, `Mutant M7`, `properties.mjs` (`1,000` multi-edge cases), `Exp H1`, `verify_exact.py` (`69` curved plans) |
| **Theorem VI** | Universal Discrete Holographic Ryu-Takayanagi Strong Subadditivity | [`CLAIMS.md`](CLAIMS.md) / [`docs/CLAIMS.md`](docs/CLAIMS.md) | [`MultiEdgeHolography.lean`](lean/UltrametricaProofs/MultiEdgeHolography.lean) | `Theorem 8`, `Mutant M6`, `properties.mjs` (`1,000` SSA graphs), `verify_exact.py` (`4,352` exhaustive partitions) |

# Changelog

All notable releases, mathematical proofs, verification suites, and engine changes in **ULTRAMETRICA** are documented here.

## [Unreleased]

- Future genus-$g \ge 2$ Mumford-Schottky wormhole curvature generalization and finite multi-prime adelic product lattice ($\mathbb{A}_{\mathbb{Q}}$ truncation) planned for `v1.5.0+` (see [`ROADMAP.md`](ROADMAP.md)).

## [1.4.0] — 2026-11-25

### Added
- **New Formal Theorem V-Global (Arbitrary Simultaneous Multi-Edge Curved AdS Gauss-Bonnet):** Proved in `lean/UltrametricaProofs/HolographyCurvature.lean` (`curved_gen_kappa_charge_decomp`, `global_multi_edge_vertex_charge_conservation`) that every interior vertex's curvature half-charges $-(p-1)w_e/W_u$ sum identically to $-(p-1)$ regardless of arbitrary positive conductances $w_e > 0$, generalizing Theorem V to simultaneous multi-edge perturbations (verified across `9` multi-edge exact `Fraction` trees and `1,000` random JS trees to `< 1e-11`).
- **New Formal Theorem VI (Universal Holographic Ryu-Takayanagi Strong Subadditivity):** Proved discrete graph-theoretic Strong Subadditivity $S(A \cup B \cup C) + S(B) \le S(A \cup B) + S(B \cup C)$ on arbitrary finite weighted graphs (`rt_edge_cut_submodular`, `rt_cut_submodular`, `rt_strong_subadditivity`, `rt_subadditivity`), independently verified across `4,352` exhaustive brute-force partitions and `1,000` random AdS/BTZ graphs.
- **Multi-Kernel Lean 4.35.0 Verification (`120` Audited Declarations + Isolated `Spec`/`Challenge`/`Solution` Comparator):** Enabled `autoImplicit = false` / `relaxedAutoImplicit = false`, added statement-only `UltrametricaProofs/Spec.lean`, `Challenge.lean`, `Solution.lean`, `comparator.json`, `formalization.yaml`, `docs/statement-fidelity.md`, and `scripts/check_readme_axioms.py`; verified across `Lean 4.35.0`, `leanchecker`, `leanchecker-paranoid`, `con-leche`, `con-ron`, `nanoda_bin 0.4.19`, plus `lean4lean` via `bubblewrap`-sandboxed `lake comparator --paranoid` in GitHub Actions CI.
- **Pre-Registered Confirmatory Experiment I (`docs/preregistration.md` git-sealed at `c171b1b` -> `scripts/stats_eval.mjs` -> `results/stats-eval.json`):** Confirmed all `4/4` hypotheses rejecting Wigner-Dyson GOE/GUE thermalization against 20-seed controls at `p_holm = 0.0004` (`20/20` seeds each, 10,000-resample bootstrap CIs, Cliff's $\delta$, Cohen's $d$).
- **Unsolved-Problems Mega-Atlas Honest Cross-Check (`docs/MEGA_ATLAS_CROSSCHECK.md`):** Audited all `1,900` problems in `0thernes/unsolved-problems-mega-atlas` (`0/1,900` full solutions; discrete sub-results on `SUB-032` and negative-result falsification on `ANL-065`/`QM-016`).
- **Expanded Verification Suites (`26/26` Node Tests + Independent Python Oracle + Perf Benchmarks):** Added `test/properties.mjs` (`3,200+` property, metamorphic, determinism, and negative-input checks), `test/server.mjs` (HTTP contract, CSP security headers, `/healthz`, and disk `EIO` failure injection), `test/golden.mjs`, `reference/padic_oracle.py` (`1,000+` textbook differential checks), `scripts/bench.mjs` (`0.388 ms` coupled BTZ frame, `319.9×` FFT speedup at $N=625$), and `examples/01..03`.
- **Full Build Standard `v1.2.0` (90-Item) & Playbook `v1.3` Compliance:** Added `package-lock.json`, `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`/`llms.txt`/`llms-full.txt`, `justfile`, `repo.yaml`, root `CLAIMS.md`, `LIMITATIONS.md`, `REPLICATION.md`, `ROADMAP.md`, `UPGRADING.md`, `ERRATA.md`, `SUPPORT.md`, `.editorconfig`, `.env.example`, `.nvmrc`, `.python-version`, `pyproject.toml`, `jsconfig.json`, `docs/{architecture,benchmarks,configuration,operations,threat-model,faq,glossary,statement-fidelity,run-log}.md`, `docs/adr/0001..0005`, `docs/reviews/2026-11-25-hardening-cycles.md`, `data/MANIFEST.sha256`, `.github/labels.tsv`, 10-class issue forms, cross-platform CI matrix (`ubuntu-24.04`, `macos-latest`, `windows-latest`), and `.github/workflows/release.yml` with `SHA256SUMS` + SLSA attestation.
- **WCAG 2.2 AA Observatory Accessibility:** Added `<label for>`, `aria-pressed`, `role="group"`, `role="img"`, `aria-live="polite"`, `:focus-visible`, and `prefers-reduced-motion` support across `src/web/`.

### Fixed
- **Affiliation metadata (`F01`):** Standardized affiliation from unformed `"0thernes LLC"` to `"Independent Researcher, Spokane, WA, USA"` matching ORCID `0009-0006-8168-9648` (logged in `ERRATA.md`).
- **Engine input validation (`F02`, `F04`, `F05`):** Rejected negative `horizonDepth`, invalid primes/depths, non-finite parameters, unknown experiment IDs, and negative `dt` loudly; extended URL `delta` lower bound to `0.5001`.
- **Server error-path header bug (`F14`):** Fixed `server.mjs` calling `res.writeHead(200)` before `await fsImpl.readFile()` (caught by B21 EIO failure injection); added `/healthz`, strict CSP, structured JSON logging, and fail-fast `parsePort`.
- **Lean static audit (`F09`):** Replaced non-nested block-comment regex with proper nested-comment/string-literal lexer scanning `UltrametricaProofs` and `Solution.lean`.
- **WebGL2 & DOM hardening (`F10`–`F13`):** Added `webglcontextrestored` recovery, eliminated `innerHTML` in `app.js`, unified `rawPow`, and clarified `3-Pt mode` copy.

## [1.3.0] — 2026-11-21

### Added
- **New Formal Theorem V (Non-Perturbative Curved AdS Discrete Gauss-Bonnet Curvature Conservation & Supercritical Pinch Deficit):** Discovered during curved-gradient auditing and proved from first-principles curved Kantorovich duality in `HolographyCurvature.lean`, verified with zero rounding error across **60 curved `Fraction` transport plans** in `scripts/verify_exact.py`, and matched to `7.77e-16`–`5.33e-15` in **Experiment H**: any finite interior stretch ($a_e \ge 1$) or subcritical pinch ($\sigma_e \ge -\ln p$) conserves integrated Ollivier-Ricci curvature identically ($\sum(\kappa_{e'} - \kappa_{\mathrm{AdS}}) \equiv 0$), while pinching past $\sigma_e^* = -\ln p$ triggers the exact negative deficit $-2(e^{-\sigma_e}-p)/(e^{-\sigma_e}+p) < 0$.
- **Lean 4 Proof Suite Expanded to `101` Audited Declarations (`2,267` Lines, Zero Mathlib, Zero `sorryAx`, Zero `native_decide`, Zero Warnings):**
  - `Basic.lean` (`26` decls): Added `padic_ball_cardinality`, `monna_injective`, `monna_surjective`, concrete Bruhat-Tits leaf metric `treeHopDist` / `bruhatTitsUltrametric`, and `bruhatTits_leaves_isosceles`.
  - `AdelicSymmetry.lean` (`23` decls): Universally proved **Proposition 4.2 (Modular Picket-Fence Law)** (`picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`, `picket_fence_gap_sum`, `picket_fence_odd_prime_strictly_positive`, `picket_fence_dyadic_zero_gap`).
  - `HolographyCurvature.lean` (`40` decls): Closed the cycle-graph metric bridge (`cycleDist`, `btzGraphDist`, `btz_graph_metric_eq_classDist`), proved BTZ monotonicity (`btz_curvature_monotone_in_L`), Gubser shadow duality (`gubser_shadow_duality`), exact Euler characteristics ($\chi(T_p) = 1$, $\chi(\text{BTZ}) = 0$), and full first-principles curved Kantorovich duality + Gauss-Bonnet theorems for Theorem V.
- **Experiments G & H + Figure 5 (`scripts/discover.mjs`, `scripts/generate_figures.py`):**
  - **Experiment G:** Sweeps $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ up to $N = 625$ ($\dim W_{0,m} = 125$), demonstrating universal $\alpha$-invariance of modular picket-fence locking even under quadratic Schrödinger dispersion ($\alpha = 2.0$, off-diagonal mixing `0.272–0.401`).
  - **Experiment H:** Verifies Theorem V across $p \in \{2, 3, 5\}$ and audits the Breitenlohner-Freedman tachyonic margin down to $\Delta = 0.5001$ under curved gravity ($\sigma_e \in [-1.5, +1.5]$) and maximal Kerr flux ($\Omega = \pi$, worst residual `5.38e-15`, min Schur pivot `0.8637`).
- **Comprehensive Multi-Layer Adversarial Audit & Contrast Comparative Report (`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`)** covering all 7 layers, 8 substrates, dispersion/acoustic spectrums, curvature & BF margins, verification taxonomy, and the full 16-issue / 3-Lean-hole register.
- **Expanded Verification & Mutation Gates:** `test/verify.mjs` (`10/10` theorems) and `test/mutants.mjs` (`8/8` planted negative mutants killed, adding M7 Gauss-Seidel gravity asymmetry and M8 Theorem V supercritical pinch breakdown).

### Fixed (16-Issue Adversarial Audit)
- `BUG-1`: Fixed `ultrametric_tunneling` `w3` index at `p = 7, n = 3` so initial superposition stays strictly inside depth-1 ball `b1` (`0.00%` initial leakage across all primes `{2,3,5,7}`).
- `BUG-2`: Fixed `wormhole_surgery` silent no-op under BTZ `keepTopology` mode by pinching `horizonEdges[0]`.
- `BUG-3`: Replaced in-place Gauss-Seidel loop in `BruhatTitsBulk.stepGravity` with preallocated `_sigmaSnap` symmetric Jacobi update (`< 1e-15` sibling symmetry).
- `BUG-4`: Added exponential smoothing (`smoothBtzMix`, `smoothGain`) and `Number.isFinite` sanitization to `audio-worklet.js`, and passed canonical `shellFreqs` from `audio.js`.
- `BUG-5, BUG-6, BUG-7`: Eliminated `1280px` `.topbar` horizontal clipping, `UltrametricTrianglePanel` header text overlap, and `1280×800` left `.sidebar` bottom telemetry clipping.
- `BUG-8, BUG-9`: Raised `sldAlpha` max to `2.00` (quadratic Schrödinger dispersion) and added `grav`/`dyn` serialization & hydration to URL permalinks.
- `BUG-10, BUG-12`: Cached WebGL2 uniform locations once in `renderer3d.js`, fixed parallel-ray fallback in `pickAtClient`, added `webglcontextlost` handler, and preallocated scratch TypedArrays in `holography.js` (`computeOllivierRicci` & `computeRyuTakayanagi`) and `renderer3d.js`.
- `BUG-14`: Hardened `server.mjs` (`GET`/`HEAD` only, safe `decodeURIComponent`, null-byte/backslash/traversal guards, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Cross-Origin-Resource-Policy`).
- `BUG-15, BUG-11`: Fully synchronized `paper/WHITE_PAPER.md` Sections 2–12 and the `?` observatory modal with `paper/main.tex` (`v1.3.0`, 15 pages, 5 figures, zero LaTeX warnings).
- `BUG-16`: Fixed `UltrametricaSimulation` constructor calling `loadExperiment('kozyrev_trap')` without `{ keepTopology: true }`, which previously overwrote non-zero constructor `horizonDepth`.

## [1.2.0] — 2026-11-21

### Added
- **Universal & First-Principles Lean 4 Proof Suite Expansion (`36 -> 71` Audited Declarations, `1,706` Lines, Pure Lean 4.35.0 Core, Zero Mathlib, Zero `native_decide`, Zero `sorry`):**
  - `Basic.lean` (`20` decls): Proved **universal** base-$p$ Monna involution (`monna_involution_universal`), **universal** complement commutation (`complement_commutes_monna_universal`), and the **fundamental $p$-adic ball contiguity theorem** (`padic_ball_monna_contiguity`) for all $p \ge 2, n \in \mathbb{N}, x < p^n$.
  - `AdelicSymmetry.lean` (`15` decls): Proved **universal Bruhat-Tits subtree cyclic-shift ultrametric isometry** (`subtreeShift_preserves_ultrametric_prefix`), Fourier ball periodicity (`fourier_ball_periodicity`), and exact sector eigenvalue phase separation (`fourier_shift_phase_congruence`).
  - `HolographyCurvature.lean` (`24` decls): Added **first-principles Kantorovich primal-dual 1-Wasserstein optimality proofs** over all rational bipartite transport plans for BOTH pure AdS (`ads_wasserstein_lower_bound`, `ads_primal_cost_exact`, `ads_kappa_from_wasserstein`) and uniform Tate-curve BTZ horizons (`btz_dual_1lipschitz`, `btz_wasserstein_lower_bound`, `btz_primal_feasible`, `btz_primal_cost_exact`, `btz_kappa_from_wasserstein`) for all $p \ge 2, L \ge 3$, plus generalized Ryu-Takayanagi horizon arc thresholds (`rt_uniform_odd_prime_all_arcs`, `rt_uniform_dyadic_two_arcs`) and universal pure-state complement symmetry $S(A) = S(A^c)$ (`rt_cut_complement_symmetry`).
  - `SolitonAndSolver.lean` (`12` decls): Generalized Theorem III to arbitrary finite $K$-ball lists (`multi_ball_kozyrev_soliton_list`), proved the full arbitrary-dimension complex Hermitian Rank-1 Sherman-Morrison algebraic identity (`sherman_morrison_exact_identity`), and proved exact rotating Kerr-BTZ flux parity laws $E(-\Omega) = E(\Omega)$ & $J(-\Omega) = -J(\Omega)$ (`kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd`).
- **Resolution of Open Research Frontiers #1 & #2 (`scripts/discover.mjs` Experiments E & F + Figure 4):**
  - **Experiment E:** Exact single-sector complex Hermitian Jacobi diagonalization inside $W_{0,m}$ up to $N = 625$ ($\dim W_{0,m} = 125$, cross-validated to $2.13 \times 10^{-14}$). **Falsifies** Wigner-Dyson GOE/GUE thermalization and establishes the exact **modular picket-fence spacing law** $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$, verified via $W_{0,1}$ ($0.6263 \approx 2/3$) vs. sibling sector $W_{0,2}$ ($0.2612 \approx 1/4$) inside the exact same $p=5, N=625$ Hamiltonian.
  - **Experiment F:** Parametric $\alpha$-scaling of multi-scale resonant self-trapping across $\alpha \in [0.6, 1.4]$ ($\mathbb{Q}_3, N=243$) and $p \in \{2, 3, 5\}$.
- **Planted Negative-Mutant Falsification Suite (`test/mutants.mjs`, `npm run falsify`):** 6 deliberate mathematical/algorithmic defects (M1–M6) planted into isolated engine instances — **6/6 mutants killed**.
- **Public Live GitHub Pages Observatory & UX Upgrades (`.github/workflows/pages.yml`, `src/web/`):** Relative ES-module asset paths, URL query-string state permalinks + Share button, PNG Snapshot capture ("Shot"), graceful WebGL2 fallback notice, and `?` Reference & Formal Proof Audit modal (`https://0thernes.github.io/ultrametrica/`).
- **Institutional Provenance & Integrity Artifacts:** Complete 1-to-1 claim-to-theorem ledger (`docs/CLAIMS.md`), root `CHECKSUMS.sha256` manifest (verified automatically in CI via `sha256sum -c CHECKSUMS.sha256` and `scripts/verify_exact.py --check-checksums`), and updated 13-page zero-warning AMS-LaTeX PDF (`dist/Donahue_2026_Ultrametrica.pdf`) with 4 vector figures + standalone `dist/arxiv_submission.tar.gz`.

### Fixed
- Aligned `CITATION.cff` author metadata strictly to sole human author Alexander Stephen Donahue (`0thernes LLC, Spokane, WA, USA`, ORCID `0009-0006-8168-9648`) and eliminated all cross-document version/count drift across `LEGAL.md`, `SUMMARY.md`, and `INDEX.md`.
- Aligned Git release tag `v1.2.0` identically with `main` commit SHA and `0thernes-research-archive` submodule pin.

## [1.1.0] — 2026-11-21

### Added
- **Publication-Grade AMS-LaTeX White Paper & Vector Figures** (`paper/main.tex`, `paper/refs.bib`, `scripts/generate_figures.py`, `paper/figures/*.pdf`): compiled via Tectonic `0.17.0` with zero warnings, zero overfull/underfull hboxes, and zero undefined references; packaged into frozen release PDF (`dist/Donahue_2026_Ultrametrica.pdf`) and standalone-verified arXiv bundle (`dist/arxiv_submission.tar.gz`) via `scripts/package_dist.py`.
- **Standalone Lean 4 Axiom Auditor** (`lean/VerifyAxioms.lean`): audits all **36 exported declarations** across all four modules (`Basic`, `AdelicSymmetry`, `HolographyCurvature`, `SolitonAndSolver`) strictly within `[propext, Classical.choice, Quot.sound]` (14 declarations depend on zero axioms; archived in `results/lean4-audit.txt`).
- **Independent Zero-Dependency Exact-Rational Python Falsifier** (`scripts/verify_exact.py`): verifies 7,033 conjugate Adelic frequency pairs across primes up to 19, exact `fractions.Fraction` bipartite 1-Wasserstein optimal transport across 45 $(p, L)$ BTZ horizons with zero rounding error, and exact $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison Kerr-BTZ solves with zero residual.
- **4-Job Verification CI** (`.github/workflows/ci.yml`): verifies Node 9-theorem suite, Python exact-rational falsifier, Lean 4 `lake build` + `VerifyAxioms.lean` strict axiom allowlist + zero `sorry`/`admit`/`axiom` grep, and Tectonic zero-warning AMS-LaTeX PDF build.

## [1.0.0] — 2026-11-18

### Added
- **Exact $p$-adic Harmonic Analysis Engine** (`src/engine/padic.js`), **4th-Order Yoshida Symplectic Quantum Engine** (`src/engine/quantum.js`), **Exact $O(V)$ Holographic Bulk Gravity & Rotating Kerr-BTZ Engine** (`src/engine/holography.js`), **Interactive WebGL2 3D Observatory & 48 kHz AudioWorklet** (`src/web/`), initial **Lean 4** library, **9-Theorem Numerical Suite**, and full research & legal documentation.

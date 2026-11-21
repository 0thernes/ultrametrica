# Changelog

All notable releases, mathematical proofs, verification suites, and engine changes in **ULTRAMETRICA** are documented here.

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

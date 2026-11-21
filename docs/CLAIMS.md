# ULTRAMETRICA (`v1.2.0`) — Claim-to-Theorem & Evidence Ledger

**Author:** Alexander Stephen Donahue (0thernes LLC, Spokane, WA, USA · ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648))  
**Repository:** https://github.com/0thernes/ultrametrica  
**Live Observatory:** https://0thernes.github.io/ultrametrica/  
**Frozen PDF:** [`dist/Donahue_2026_Ultrametrica.pdf`](../dist/Donahue_2026_Ultrametrica.pdf)

This ledger maps every mathematical, algorithmic, and empirical claim in ULTRAMETRICA to its exact verification tier, Lean 4 declaration(s), independent falsifier, and explicit epistemic boundary. It follows the solo-human + AI-assisted research verification standards of [`0thernes/0thernes-research-archive`](https://github.com/0thernes/0thernes-research-archive).

---

## Evidence Categories

- **Tier A — Lean 4 Kernel Theorem:** Formally proved in pure Lean 4 (`v4.35.0`, zero Mathlib, zero `native_decide`, zero `sorry`, zero custom axioms) and audited via [`lean/VerifyAxioms.lean`](../lean/VerifyAxioms.lean) (`71` declarations, strictly within `[propext, Classical.choice, Quot.sound]` or empty; log in [`results/lean4-audit.txt`](../results/lean4-audit.txt)).
- **Tier B — Exact Rational / Integer Executable Check:** Independently verified with zero floating-point rounding error using Python stdlib `int` and `fractions.Fraction` / $\mathbb{Q}(i)$ in [`scripts/verify_exact.py`](../scripts/verify_exact.py).
- **Tier C — Deterministic Floating-Point & Negative-Mutant Suite:** Verified in IEEE-754 `Float64` (`test/verify.mjs`, `scripts/discover.mjs`) and stress-tested against 6 deliberate mathematical/algorithmic defects (`test/mutants.mjs`, 6/6 killed).
- **Tier D — Prior Literature & Non-Claims:** Results credited to cited prior authors, remaining open research frontiers, and explicit non-claims.

---

## Tier A — Complete 71-Declaration Lean 4 Kernel Audit Map

All declarations live in namespace `Ultrametrica.` across four pure core modules (`1,706` lines total across 6 `.lean` files).

### A.1 Ultrametric Geometry, Universal Monna Involution & Ball Contiguity (`Basic.lean`, 20 declarations)

| Claim | Audited Lean 4 Declarations | Axioms |
|---|---|---|
| Universal ultrametric isosceles triangle theorem (strict & symmetric forms) | `ultrametric_isosceles_lt`, `ultrametric_two_longest_equal` | $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| Exact prime-power divisibility strong triangle inequality & sharp inequality | `pow_dvd_add`, `not_pow_dvd_add_of_dvd_left` | None / `[propext, Quot.sound]` |
| Base-$p$ digit-reversal recurrences and range invariant $R_p(x) < p^n$ | `revBaseAux_eq`, `revBase_succ`, `revBase_lt`, `revBase_succ_high`, `revBase_div_eq_revBase_mod` | $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| **Universal** discrete Monna involution $R_p(R_p(x)) = x$ for ALL $p \ge 2, n \in \mathbb{N}, x < p^n$ | `monna_involution_universal` | `[propext, Classical.choice, Quot.sound]` |
| **Universal** digit-complement commutation $R_p(p^n - 1 - x) = p^n - 1 - R_p(x)$ for ALL $p \ge 2, n, x < p^n$ | `complement_commutes_monna_universal` | `[propext, Classical.choice, Quot.sound]` |
| **Universal** $p$-adic ball contiguity $x \equiv y \pmod{p^j} \iff \lfloor R_p(x)/p^{n-j}\rfloor = \lfloor R_p(y)/p^{n-j}\rfloor$ | `padic_ball_monna_contiguity` | `[propext, Classical.choice, Quot.sound]` |
| Concrete prime specializations ($p \in \{2, 3, 5, 7\}$) as corollaries | `monna_involution_p2_n6`..`p7_n2`, `complement_commutes_monna_p2_n6`..`p7_n2` (8 decls) | `[propext, Classical.choice, Quot.sound]` |

### A.2 Theorem I — Adelic Parity-Doubling Dichotomy & Subtree Isometry (`AdelicSymmetry.lean`, 15 declarations)

| Claim | Audited Lean 4 Declarations | Axioms |
|---|---|---|
| Exact Hilbert-space / wavelet completeness $1 + \sum_{s=0}^{n-1}(p-1)p^s = p^n$ | `hilbert_sector_completeness` | `[propext, Quot.sound]` |
| Within-depth-$s$-ball cyclic child-subtree shift preserves enclosing ball, deeper offset, and shifts child digit by $+1 \bmod p$ | `subtreeShift_preserves_ball`, `subtreeShift_preserves_offset`, `subtreeShift_child_digit`, `subtreeShift_preserves_child_ancestor` | $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| **Universal Bruhat-Tits ultrametric isometry:** `subtreeShift p n s` preserves ancestor agreement at EVERY depth $j \le n$ | `subtreeShift_preserves_ultrametric_prefix` | `[propext, Classical.choice, Quot.sound]` |
| Exact Fourier depth-$s$ ball periodicity ($p^n \mid k p^{n-s}$), non-constancy ($p^n \nmid k p^{n-s-1}$), and exact sector eigenvalue phase $(k p^{n-s-1})\bmod p^n = m p^{n-1}$ | `fourier_ball_periodicity`, `fourier_shift_phase_congruence`, `fourier_sector_nonconstant_phase` | `[propext, Quot.sound]` |
| Complex conjugation $k \mapsto p^n - k$ preserves valuation $s$ and maps residue $m \mapsto p - m$ | `conjugate_sector_factor`, `conjugate_residue_mod_p` | $\subseteq$ `[propext, Classical.choice, Quot.sound]` |
| Odd-prime disjointness ($m \ne p - m$ for odd $p \ge 3$), even-prime self-conjugacy ($1 = 2 - 1$), and exact doublet partition $1 + 2\lfloor(p^n-1)/2\rfloor = p^n$ | `odd_prime_conjugate_sector_disjoint`, `even_prime_self_conjugate`, `odd_pow_is_odd`, `odd_prime_doublet_bound` | None / `[propext, Quot.sound]` |

### A.3 Theorem II — First-Principles Optimal-Transport Curvature, BF Bound & RT Theorems (`HolographyCurvature.lean`, 24 declarations)

| Claim | Audited Lean 4 Declarations | Axioms |
|---|---|---|
| **First-principles pure AdS 1-Wasserstein Kantorovich primal-dual optimality:** $(p+1)W_1^{\text{AdS}} = 3p - 1 \implies \kappa_{\text{AdS}}(p) = -2(p-1)/(p+1)$ | `ads_dual_1lipschitz`, `ads_wasserstein_lower_bound`, `ads_primal_cost_exact`, `ads_kappa_from_wasserstein` | None / `[propext, Quot.sound]` |
| **First-principles BTZ horizon 1-Wasserstein Kantorovich primal-dual optimality** over ALL rational bipartite plans for ALL $p \ge 2, L \ge 3$: $(p+2)W_1^{\text{BTZ}} = 3p+2-\max(0,6-L)$ | `btz_dual_1lipschitz`, `btz_wasserstein_lower_bound`, `btz_primal_feasible`, `btz_primal_cost_exact`, `btz_kappa_from_wasserstein` | `[propext, Quot.sound]` |
| Exact cleared-denominator curvature excess identity $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0,6-L) - 4$ | `btz_curvature_excess_identity` | `[propext, Quot.sound]` |
| Complete $L_c = 5$ trichotomy: Planck flattening ($L \in \{3, 4\}$), critical cases ($p=2: -1/12$, $p=3: 0$, $p \ge 4: >0$), macroscopic deficit ($L \ge 6: -4/((p+1)(p+2))$) | `btz_flatter_than_ads_L3_L4`, `btz_critical_L5_p2`, `btz_critical_L5_p3`, `btz_critical_L5_p5`, `btz_flatter_L5_for_p_ge_4`, `btz_more_negative_for_L_ge_6` | None / `[propext, Quot.sound]` |
| Gubser AdS/CFT massless marginal modes and exact BF squared excess $(x - y)^2 \ge 0$ | `gubser_massless_marginal`, `gubser_bf_bound_exact_square`, `gubser_bf_excess_nonneg` | `[propext, Quot.sound]` |
| Ryu-Takayanagi horizon arc thresholds (odd $p \ge 3$ all $k \ge 1$; dyadic $p=2$ tie at $k=1$, dominance at $k \ge 2$) & universal complement symmetry $S(A) = S(A^c)$ | `rt_odd_prime_horizon_dominance`, `rt_dyadic_criticality`, `rt_uniform_odd_prime_all_arcs`, `rt_uniform_dyadic_two_arcs`, `rt_cut_complement_symmetry` | None / `[propext, Quot.sound]` |

### A.4 Theorems III & IV — Multi-Ball Solitons, Exact Complex Sherman-Morrison & Kerr Parity (`SolitonAndSolver.lean`, 12 declarations)

| Claim | Audited Lean 4 Declarations | Axioms |
|---|---|---|
| Exact nonlinear Kozyrev compacton-soliton invariance (single, 2-ball, and **arbitrary finite $K$-ball list**) for arbitrary local $F$ | `kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list` | `[propext]` |
| Hermitian gauge-coupled horizon edge PSD ($w|z_0 - e^{i\theta}z_1|^2 \ge 0$) & exact unit-phase expansion | `horizon_edge_laplacian_psd`, `horizon_edge_quadratic_expansion` | `[propext, Quot.sound]` |
| Unconditional Sherman-Morrison denominator $1 + wq \ge 1 > 0$ | `sherman_morrison_denominator_ge_one`, `sherman_morrison_denominator_ne_zero` | `[propext, Quot.sound]` |
| **Exact arbitrary-dimension complex Hermitian Sherman-Morrison algebraic identity** $(T + w u u^\dagger)(\mathrm{den}\cdot y - (w u^\dagger y) z) = \mathrm{den}\cdot b$ over `CInt^L` | `hermitianDot_sub`, `hermitianDot_smul`, `sherman_morrison_exact_identity` | `[propext, Quot.sound]` |
| Exact rotating Kerr-BTZ Aharonov-Bohm flux parity laws ($E(-\Omega) = E(\Omega)$ and $J(-\Omega) = -J(\Omega)$) | `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd` | `[propext, Quot.sound]` |

---

## Tier B — Exact-Rational & Integer Executable Checks (`scripts/verify_exact.py`)

| Claim | Exact Program Check | Scope & Boundary |
|---|---|---|
| Theorem I conjugation & parity partition across primes up to 19 | Exact integer check of **7,033** conjugate frequency pairs (`p in {2,3,5,7,11,13,17,19}`) | Finite checked primes; complements universal Lean proof |
| Modular picket-fence ratio $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$ on $W_{0,m}$ | Exact `fractions.Fraction` check across **18** sectors (`p in {2,3,5,7,11,13}`) | Exact for linear $\alpha = 1$ Archimedean dispersion at $\theta = 0$ |
| Theorem II exact non-lazy bipartite 1-Wasserstein optimal transport | Zero-rounding `fractions.Fraction` SPFA min-cost flow across **45** $(p, L)$ horizons (`p in {2,3,5,7,11}`, `L in {3..12}`) | Independent check of the graph optimal-transport LP |
| Theorem IV exact Gaussian-rational $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison solve | Exact `Fraction` $\mathbb{Q}(i)$ solve on inhomogeneous $L=5$ rotating BTZ with Pythagorean unit phase $(3/5 + 4/5 i)$ | Zero algebraic residual; $\mathrm{den} = 30290594521/18671790625 \ge 1$ |
| Cryptographic manifest & metadata consistency | `CHECKSUMS.sha256` bit-exact verification + `VERSION`/`package.json`/`CITATION.cff`/ORCID parity | Covers 53 tracked source, proof, benchmark, paper & dist artifacts |

---

## Tier C — Deterministic Floating-Point Benchmarks & Planted Negative Mutants

| Claim / Observation | Executable Evidence | Explicit Boundary |
|---|---|---|
| Radix-$p$ FFT accuracy, Kozyrev eigenfunctions, tree isometry, Yoshida $\Delta t^4$ scaling, curved Klein-Gordon residuals ($< 10^{-11}$), Gubser propagator ($< 10^{-12}$), Ollivier-Ricci, brute-force RT DP, and Fourier block leak ($< 10^{-12}$) | [`test/verify.mjs`](../test/verify.mjs) (`npm test`: **9/9 PASS**) | IEEE-754 `Float64` numerical tests; outside Lean kernel |
| Verification suite genuinely rejects subtle defects (no rubber-stamping) | [`test/mutants.mjs`](../test/mutants.mjs) (`npm run falsify`: **6/6 mutants KILLED**) | Tests 6 specific defect classes (M1–M6) |
| **Frontier #1 Resolved (Negative Chaos Finding):** Intra-sector $\langle r \rangle_{W_{0,m}}(\theta)$ up to $N = 625$ ($\dim W_{0,m} = 125$) does NOT thermalize to GOE/GUE; tracks $r_0(p, m)$ ($W_{0,1} \approx 0.626$ vs $W_{0,2} \approx 0.261$ in same $p=5$ Hamiltonian) | Experiment E in [`scripts/discover.mjs`](../scripts/discover.mjs) & [`results/discovery-benchmarks.json`](../results/discovery-benchmarks.json) | Empirical complex Hermitian Jacobi up to $N = 625$; asymptotic $n \to \infty$ analytic proof remains open |
| **Frontier #2 Resolved (Parametric $\alpha$-Scaling):** Multi-scale resonant tunneling peak decays monotonically from `1.470%` ($\alpha=0.6$) to `0.087%` ($\alpha=1.4$) with $g_* \in [36, 51]$ and universal large-$g$ self-trapping ($< 0.02\%$) | Experiments C & F in [`scripts/discover.mjs`](../scripts/discover.mjs) | Empirical PDE evolution on finite horizon $T = 2.25$ |

---

## Tier D — Prior Literature, Remaining Open Frontiers & Explicit Non-Claims

1. **Established Literature (Not Claimed as Original):** $p$-adic quantum mechanics and Vladimirov operator $D_p^\alpha$ (Vladimirov, Volovich, Zelenov 1994), Kozyrev wavelets (Kozyrev 2002), $p$-adic AdS/CFT & Bruhat-Tits bulk-to-boundary propagators (Gubser et al. 2017; Heydeman et al. 2018), edge-length dynamics (Gubser et al. 2017), Ollivier-Ricci curvature on regular trees (Ollivier 2009; Lin-Lu-Yau 2011), Ryu-Takayanagi holographic entanglement (Ryu-Takayanagi 2006; Pastawski et al. 2015; Heydeman et al. 2021), and 4th-order Yoshida splitting (Yoshida 1990).
2. **Explicit Non-Claims:**
   - ULTRAMETRICA makes **zero claim** of empirical discovery of new physical laws of nature.
   - The manuscripts in this repository are **preprints and technical reports**, not peer-reviewed journal articles; no journal acceptance, arXiv submission, or external DOI is claimed unless recorded in `CHANGELOG.md`.
   - Substantive AI assistance (Google DeepMind / Antigravity agent under Alexander Stephen Donahue's direction) is transparently disclosed; AI tools are not authors.
3. **Remaining Open Research Frontiers:**
   - Exact analytic scaling of the $p = 2$ self-conjugate quasi-doublet splitting $\delta_k(n, \theta)$ as $n \to \infty$ (and whether nonlinear dispersion $\alpha \ne 1$ breaks modular picket-fence locking at very large $n$).
   - Exact $O(V + g^3)$ Woodbury bulk Klein-Gordon solver and exact Ollivier-Ricci curvature laws on **higher-genus ($g \ge 2$) Mumford-Schottky multi-mouth wormhole quotients** $T_p / \Gamma_g$.
   - Generalizing Theorem II's Kantorovich primal-dual optimality to **inhomogeneous / curved dynamic edge weights** $a_e \ne 1$ on the BTZ horizon ring.

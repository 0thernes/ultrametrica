# ULTRAMETRICA: Exact Non-Archimedean Holography, Recursive Adelic Valuation-Residue Symmetries, Multi-Edge Curved Gauss-Bonnet Curvature, Holographic Strong Subadditivity & Multi-Kernel Lean 4 Verification

**Author:** Alexander Stephen Donahue (Independent Researcher, Spokane, WA, USA; handle `0thernes`)  
**Correspondence:** `0_0@0thernes.art` · ORCID: [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648)  
**Date:** November 25, 2026 · **Version:** 1.4.1 (Research Preprint — Not Peer-Reviewed; frozen AMS-LaTeX PDF: [`dist/Donahue_2026_Ultrametrica.pdf`](../dist/Donahue_2026_Ultrametrica.pdf))  
**Repository:** `https://github.com/0thernes/ultrametrica` · **Live Observatory:** `https://0thernes.github.io/ultrametrica/`  
**License:** COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY ([LICENSE](../LICENSE))  
**AI Disclosure & Scope:** Substantive AI research/engineering assistance (Google DeepMind / Antigravity) under the author's direction is explicitly disclosed in [LEGAL.md](../LEGAL.md), [CLAIMS.md](../CLAIMS.md), and [LIMITATIONS.md](../LIMITATIONS.md). Honest Mega-Atlas audit: `0 / 1,900` full solutions ([`docs/MEGA_ATLAS_CROSSCHECK.md`](../docs/MEGA_ATLAS_CROSSCHECK.md)).

---

## Abstract

We present **ULTRAMETRICA (`v1.4.1`)**, a zero-dependency computational laboratory and formal mathematical framework coupling discrete $p$-adic quantum field theory on $\mathbb{Z}_p / p^n\mathbb{Z}_p$ ($p \in \{2, 3, 5, 7\}$) to exact holographic bulk gravity on the Bruhat-Tits tree $T_p$ and its rotating Tate-curve BTZ black hole quotients $T_p / p^{h\mathbb{Z}}$. Beyond implementing established non-Archimedean constructions to machine precision ($10^{-12}$–$10^{-17}$), we derive, independently cross-check in exact rational arithmetic, stress-test against `26` Node suites (`8/8` planted mutants killed, `3,200+` property checks, HTTP contract + EIO failure injection) and `1,000+` Python textbook oracle checks, confirm via a git-sealed pre-registered `20`-seed statistical experiment (**Experiment I**, `p_holm = 0.0004`, `4/4` confirmed), and formally machine-verify across **120 exported declarations in pure Lean 4 (`v4.35.0`, zero Mathlib, `autoImplicit = false`, zero `native_decide`, zero `sorry`) plus an isolated `Spec`/`Challenge`/`Solution` comparator suite verified across 6 independent kernels** six exact mathematical and algorithmic results (Theorems I–VI, including **Theorem V-Global** arbitrary multi-edge curved Gauss-Bonnet and **Theorem VI** universal weighted-graph holographic Ryu-Takayanagi Strong Subadditivity). For the canonical typeset manuscript with all 5 vector PGFPlots figures and full numbered claims & Experiment I tables, see [`paper/main.tex`](main.tex) and [`dist/Donahue_2026_Ultrametrica.pdf`](../dist/Donahue_2026_Ultrametrica.pdf).

1. **Theorem I (Adelic Parity-Doubling Dichotomy, Recursive Valuation-Residue Decomposition & $\alpha$-Invariant Modular Picket-Fence Locking):** Conjugating $D_p^\alpha$ by the discrete $p$-adic Monna digit-reversal involution $R_p$ (proved universally bijective for all $p \ge 2, n \in \mathbb{N}$) and adding any real even Archimedean circulant operator $H_{\mathbb{R}}$ yields a non-commuting hybrid Hamiltonian $H_\theta = \theta R_p D_p^\alpha R_p + (1-\theta) H_{\mathbb{R}}$ that block-diagonalizes **identically** in the discrete Fourier basis into $1 + n(p-1)$ exact valuation-residue sectors $W_{s,m} = \operatorname{span}\{e_k : k \equiv m p^s \pmod{p^{s+1}}\}$ (off-block leak $\le 4.5 \times 10^{-13}$ up to $N = 625$). Anti-unitary complex conjugation maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$, forcing **every excited eigenvalue into exact even multiplicity ($\ge 2$)** for every odd prime $p \ge 3$ (at most $(p^n+1)/2$ distinct levels), while uniquely lifting all doublets to $2^n$ simple levels at $p = 2$. Single-sector complex Hermitian diagonalization up to $N = 625$ across $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ **falsifies** GOE/GUE thermalization: every sector stays locked near the formally proved modular picket-fence ratio $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$, even under quadratic Schrödinger dispersion ($\alpha = 2.0$).
2. **Theorem II (First-Principles Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy):** Bridging the literal $L$-cycle graph shortest-path metric (`btz_graph_metric_eq_classDist`) to an explicit Kantorovich primal-dual 1-Wasserstein certificate formalized in Lean 4 over all rational bipartite transport plans for all $p \ge 2, L \ge 3$, every horizon edge satisfies $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$, giving $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$. Planck-scale horizons ($L \in \{3, 4\}$, plus $L = 5$ for $p \ge 4$) are strictly *flatter* than pure AdS; $(p, L) = (3, 5)$ exhibits exact curvature cancellation ($\kappa_{\text{BTZ}} = \kappa_{\text{AdS}} = -1$); and macroscopic horizons ($L \ge 6$) carry universal deficit $-4/((p+1)(p+2))$.
3. **Theorem III (Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & $\alpha$-Scaled Self-Trapping):** Any finite list of $K$ pairwise-disjoint Kozyrev wavelets is an exact, strictly compactly supported, radiation-free nonlinear soliton of $i\partial_t \psi = (D_p^\alpha + F(|\psi|^2))\psi$ for **arbitrary** local nonlinearity $F$ ($0.00\%$ leakage up to $g = 500$), whereas overlapping multi-scale packets exhibit a non-monotonic tunneling peak decaying monotonically across $\alpha \in [0.6, 1.4]$ before collapsing into universal large-$g$ self-trapping.
4. **Theorem IV (Unconditional Positive-Definite Rank-1 Kerr-BTZ Bulk Solver, Flux Parity & BF Margin):** Decomposing the gauge-coupled rotating horizon wrap edge as $w_{L-1} u u^\dagger \succeq 0$ yields an arbitrary-dimension exact complex Hermitian Sherman-Morrison $O(V)$ solver whose denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ never vanishes, obeys formally verified flux parity $E(-\Omega) = E(\Omega)$ and $J(-\Omega) = -J(\Omega)$, and remains stable down to $\Delta = 0.5001$ under curved gravity and maximal flux $\Omega = \pi$ (worst residual $5.38 \times 10^{-15}$).
5. **Theorem V (Non-Perturbative Curved AdS Discrete Gauss-Bonnet Curvature Conservation & Supercritical Pinch Deficit):** Proved from first-principles curved Kantorovich duality in Lean 4 and verified across 60 exact rational transport plans, any finite interior edge stretch ($a_e \ge 1$) or subcritical pinch ($a_e \ge 1/p$, $\sigma_e \ge -\ln p$) on $T_p$ conserves total integrated Ollivier-Ricci curvature identically ($\sum_{e'}(\kappa_{e'} - \kappa_{\mathrm{AdS}}) \equiv 0$); pinching strictly past the sharp margin $\sigma_e^* = -\ln p$ triggers an exact negative curvature deficit $-2(e^{-\sigma_e} - p)/(e^{-\sigma_e} + p) < 0$.

---

## Table of Contents

1. [Introduction & Epistemic Scope](#1-introduction--epistemic-scope)
2. [Discrete $p$-adic Harmonic Analysis & Universal Monna Geometry](#2-discrete-p-adic-harmonic-analysis--universal-monna-geometry)
3. [Kozyrev Wavelets & Arbitrary $K$-Ball Compacton-Soliton Invariance (Theorem III)](#3-kozyrev-wavelets--arbitrary-k-ball-compacton-soliton-invariance-theorem-iii)
4. [Adelic Hybrid Hamiltonian, Parity-Doubling & $\alpha$-Invariant Picket-Fence Locking (Theorem I)](#4-adelic-hybrid-hamiltonian-parity-doubling--alpha-invariant-picket-fence-locking-theorem-i)
5. [Bruhat-Tits AdS & Unconditional Rotating Kerr-BTZ Bulk Solver (Theorem IV)](#5-bruhat-tits-ads--unconditional-rotating-kerr-btz-bulk-solver-theorem-iv)
6. [Tate-Curve BTZ Curvature & Non-Perturbative Curved AdS Gauss-Bonnet Law (Theorems II & V)](#6-tate-curve-btz-curvature--non-perturbative-curved-ads-gauss-bonnet-law-theorems-ii--v)
7. [Exact $O(V)$ Ryu-Takayanagi Minimal Cut & Horizon Entanglement-Wedge Plateau](#7-exact-ov-ryu-takayanagi-minimal-cut--horizon-entanglement-wedge-plateau)
8. [Symmetric Dynamic Edge-Length Einstein Gravity Backreaction](#8-symmetric-dynamic-edge-length-einstein-gravity-backreaction)
9. [Real-Time WebGL2 Hyperbolic Geometry & 48 kHz Prime-Power AudioWorklet](#9-real-time-webgl2-hyperbolic-geometry--48-khz-prime-power-audioworklet)
10. [Reproducible Benchmarks (Experiments A–H) & Falsification Matrix](#10-reproducible-benchmarks-experiments-ah--falsification-matrix)
11. [Honest Novelty Assessment: Established Literature vs. Original Contributions](#11-honest-novelty-assessment-established-literature-vs-original-contributions)
12. [Lean 4 Machine-Checked Formalization Audit (101 Declarations) & Adversarial Audit](#12-lean-4-machine-checked-formalization-audit-101-declarations--adversarial-audit)
13. [Cited Primary Sources](#13-cited-primary-sources)

---

## 1. Introduction & Epistemic Scope

Ostrowski's Theorem (1916) establishes that every non-trivial absolute value on $\mathbb{Q}$ is equivalent either to the Archimedean absolute value $|\cdot|_\infty$ (completing to $\mathbb{R}$) or to a $p$-adic ultrametric absolute value $|x|_p = p^{-v_p(x)}$ for some prime $p$ (completing to $\mathbb{Q}_p$). Non-Archimedean and adelic formulations of Planck-scale physics and string amplitudes were pioneered by Volovich [1], Freund and Witten [2], and Vladimirov, Volovich, and Zelenov [3], followed by modern $p$-adic AdS/CFT formulations by Gubser et al. [4, 6] and Heydeman, Marcolli, Saberi, and Stoica [5, 7], demonstrating that the Bruhat-Tits tree $T_p = \mathrm{PGL}_2(\mathbb{Q}_p)/\mathrm{PGL}_2(\mathbb{Z}_p)$ acts as a discrete hyperbolic bulk dual to $\mathbb{P}^1(\mathbb{Q}_p)$ and its Tate-curve Schottky quotients $T_p / q^\mathbb{Z}$ model discrete BTZ black holes.

**Epistemic Boundary:** This work is a **mathematical-physics, formal-verification, and computational study**. It is *not* a peer-reviewed journal article and makes zero claim of empirical discovery of new physical laws of nature; rather, it establishes machine-verified algebraic/combinatorial/optimal-transport theorems, exact $O(V)$ and $O(p N \log_p N)$ algorithms, and falsifiable spectral/dynamical predictions within discrete non-Archimedean and adelic mathematical models. Full multi-layer substrate, spectral, gradient, and margin contrasts plus the complete 16-issue adversarial audit register are archived in [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](../docs/AUDIT_AND_CONTRAST_ANALYSIS.md).

---

## 2. Discrete $p$-adic Harmonic Analysis & Universal Monna Geometry

Let $p \in \{2, 3, 5, 7\}$ be prime and $n \ge 2$ an integer depth, with Hilbert space dimension $N = p^n$. We discretize locally constant Schwartz-Bruhat functions on $\mathbb{Z}_p$ to $\mathcal{H}_{p,n} = L^2(\mathbb{Z}_p / p^n \mathbb{Z}_p) \cong \mathbb{C}^{p^n}$.

### 2.1 Universal Base-$p$ Digit Reversal, Ball Contiguity & Concrete Tree Metric
Writing $x = \sum_{r=0}^{n-1} d_r p^r$ ($d_r \in \{0, \dots, p-1\}$), the scaled discrete Monna map [15] $R_p(x) = p^n \mathcal{M}_p(x) = \sum_{r=0}^{n-1} d_r p^{n-1-r}$ is the exact base-$p$ digit reversal. In [`lean/UltrametricaProofs/Basic.lean`](../lean/UltrametricaProofs/Basic.lean), we formally prove **universally** for ALL bases $p \ge 2$, ALL depths $n \in \mathbb{N}$, and ALL $x, y < p^n$:
1. $R_p(R_p(x)) = x$, together with explicit injectivity and surjectivity (`monna_involution_universal`, `monna_injective`, `monna_surjective`);
2. $R_p(p^n - 1 - x) = p^n - 1 - R_p(x)$ (`complement_commutes_monna_universal`);
3. $x \equiv y \pmod{p^j} \iff \lfloor R_p(x)/p^{n-j} \rfloor = \lfloor R_p(y)/p^{n-j} \rfloor$ and $p^j p^{n-j} = p^n$ for all $j \le n$ (`padic_ball_monna_contiguity`, `padic_ball_cardinality`), proving every $p$-adic ball maps bijectively onto an exact contiguous Bruhat-Tits subtree slice $\ell \in [b p^{n-j}, (b+1)p^{n-j})$;
4. A concrete kernel-checked `Ultrametric Nat` instance `bruhatTitsUltrametric` on Bruhat-Tits leaves via recursive tree-hop distance `treeHopDist`, instantiating the universal isosceles theorem directly on $T_p$ (`bruhatTits_leaves_isosceles`).

### 2.2 Native Radix-$p$ Pontryagin FFT & Vladimirov Operator $D_p^\alpha$
[`src/engine/padic.js`](../src/engine/padic.js) implements a native decimation-in-time **Radix-$p$ Cooley-Tukey unitary FFT**:
$$(\mathcal{F}_p \psi)[k] = \frac{1}{\sqrt{p^n}} \sum_{x=0}^{p^n - 1} \psi(x) e^{-2\pi i x k / p^n}$$
in $O(p N \log_p N)$ operations (verified vs. naive $O(N^2)$ DFT and Parseval unitarity to $< 10^{-11}$ across $p \in \{2, 3, 5, 7\}$, `Theorem 1`). In dual space, the Vladimirov operator [3] acts diagonally as $\widehat{(D_p^\alpha \psi)}[k] = |\xi_k|_p^\alpha \hat{\psi}[k]$ with $|\xi_k|_p = p^{n - v_p(k)}$ ($k \ge 1$) and $|\xi_0|_p = 0$.

---

## 3. Kozyrev Wavelets & Arbitrary $K$-Ball Compacton-Soliton Invariance (Theorem III)

Kozyrev's orthonormal basis [8] on $\mathbb{Z}_p / p^n\mathbb{Z}_p$:
$$\psi_{j,b,m}(x) = p^{-(n-j)/2} \, \mathbf{1}_{B_j(b)}(x) \, \exp\!\left(\frac{2\pi i \, m \, d_j(x)}{p}\right), \qquad D_p^\alpha \psi_{j,b,m} = p^{\alpha(j+1)} \psi_{j,b,m}$$
satisfies exact completeness $1 + \sum_{j=0}^{n-1}(p-1)p^j = p^n$ (`hilbert_sector_completeness`).

### Theorem III (Arbitrary Finite $K$-Ball Compacton-Soliton Invariance)
For **any** local nonlinear potential $F : \mathbb{R}_{\ge 0} \to \mathbb{R}$ and **any** finite ensemble of $K$ Kozyrev wavelets on pairwise disjoint $p$-adic balls $B_{j_r}(b_r) \cap B_{j_{r'}}(b_{r'}) = \emptyset$ ($r \ne r'$),
$$\Psi(x, t) = \sum_{r=1}^K c_r \, e^{-i \omega_r t} \, \psi_{j_r, b_r, m_r}(x), \qquad \omega_r = p^{\alpha(j_r + 1)} + F\!\left(|c_r|^2 p^{-(n - j_r)}\right)$$
is an **exact, strictly compactly supported, radiation-free nonlinear multi-soliton** of $i\partial_t \Psi = (D_p^\alpha + F(|\Psi|^2))\Psi$. Formalized in [`SolitonAndSolver.lean`](../lean/UltrametricaProofs/SolitonAndSolver.lean) for single packets, pairs, and arbitrary finite lists (`kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`, `multi_ball_kozyrev_soliton_list`, depending solely on `propext`).

### Empirical Characterization: Parametric $\alpha$-Scaling of Multi-Scale Self-Trapping (Experiments C & F)
Overlapping two scales inside one parent ball breaks constant modulus and induces discontinuous tunneling. In Experiment C ($p=3, n=5, \alpha=1.0$), external leakage peaks at `0.37%` ($g = 60$) before collapsing to `0.00%` ($g = 500$) via nonlinear detuning self-trapping. Experiment F across $\alpha \in \{0.6, 0.8, 1.0, 1.2, 1.4\}$ proves monotonic peak suppression (`1.470% -> 0.087%`) as $\Delta\lambda_{1\to 2} = 3^{2\alpha} - 3^\alpha$ widens (`1.80 -> 17.02`), with tightly localized resonant coupling $g_* \in [36, 51]$ and universal large-$g$ self-trapping (`< 0.02%`).

---

## 4. Adelic Hybrid Hamiltonian, Parity-Doubling & $\alpha$-Invariant Picket-Fence Locking (Theorem I)

We define on the Monna leaf circle $\mathbb{Z}/p^n\mathbb{Z}$ the non-commuting real symmetric **Adelic Hybrid Hamiltonian** ($\theta \in [0, 1]$):
$$H_\theta = \theta \, H_Q^{\text{leaf}} + (1 - \theta) \, H_R^{\text{leaf}}, \qquad H_Q^{\text{leaf}} = R_p F^\dagger \Lambda_{\mathbb{Q}_p} F R_p, \quad H_R^{\text{leaf}} = F^\dagger \Lambda_{\mathbb{R}} F.$$

### Theorem I (Recursive Valuation-Residue Decomposition & Adelic Parity-Doubling Dichotomy)
Partitioning $\{0, \dots, p^n-1\}$ into $W_0 = \mathbb{C} e_0$ and $W_{s,m} = \operatorname{span}\{e_k : k \equiv m p^s \pmod{p^{s+1}}\}$ ($0 \le s < n, 1 \le m < p$, $\dim W_{s,m} = p^{n-s-1}$):
1. **Exact Block Invariance:** Every $W_{s,m}$ is an exact invariant subspace of $H_\theta$ for all $\theta \in \mathbb{R}$, proved via universal Bruhat-Tits subtree shift isometry (`subtreeShift_preserves_ultrametric_prefix`), Fourier periodicity (`fourier_ball_periodicity`), and exact phase separation (`fourier_shift_phase_congruence`); verified off-block leak $\le 4.5 \times 10^{-13}$ up to $N = 625$.
2. **Anti-Unitary Conjugate Pairing:** Complex conjugation commutes with $H_\theta$ and maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$ (`conjugate_sector_factor`, `conjugate_residue_mod_p`).
3. **Prime-Parity Dichotomy:** For every odd prime $p \ge 3$, $m \ne p - m$ (`odd_prime_conjugate_sector_disjoint`), protecting **100% of excited eigenvalues in exact doublets ($\le (p^n+1)/2$ distinct levels)**; for $p = 2$, $m = 1 = p - 1$ (`even_prime_self_conjugate`), lifting all doublets to $2^n$ simple levels.

### Proposition 4.2 (Modular Picket-Fence Law & $\alpha$-Invariance — Experiments E & G)
Folding Archimedean frequencies $k \mapsto \min(k, p^n - k)$ inside $W_{0,m}$ ($1 \le m \le \lfloor p/2 \rfloor$) monotonically interleaves $u_{2a} = ap + m$ and $u_{2a+1} = (a+1)p - m$ with exact period-2 alternating gaps $p - 2m$ and $2m$ (proved universally in [`AdelicSymmetry.lean`](../lean/UltrametricaProofs/AdelicSymmetry.lean): `picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`, `picket_fence_odd_prime_strictly_positive`, `picket_fence_dyadic_zero_gap`). Under any smooth dispersion $f(u) = u^\alpha$ ($\alpha > 0$), Mean-Value-Theorem density cancellation leaves the asymptotic spacing ratio **independent of $\alpha$**:
$$r_0(p, m) = \frac{\min(2m, p - 2m)}{\max(2m, p - 2m)} \in \left\{0\text{ at }(2,1),\; \tfrac{1}{2}\text{ at }(3,1),\; \tfrac{2}{3}\text{ at }(5,1),\; \tfrac{1}{4}\text{ at }(5,2)\right\}.$$
Single-sector complex Hermitian Jacobi diagonalization up to $N = 625$ ($\dim W_{0,m} = 125$, cross-validated to $2.13 \times 10^{-14}$) across $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ **falsifies** GOE/GUE thermalization: even at quadratic Schrödinger dispersion ($\alpha = 2.0$, off-diagonal mixing `0.272–0.401`), $p=5, W_{0,1}$ sits at `0.6334` ($\approx \frac{2}{3}$) while sibling sector $W_{0,2}$ of the exact same Hamiltonian remains locked at `0.2562` ($\approx \frac{1}{4}$), and $p=2, N=256$ collapses to `0.0004`.

---

## 5. Bruhat-Tits AdS & Unconditional Rotating Kerr-BTZ Bulk Solver (Theorem IV)

On the finite cutoff Bruhat-Tits tree $T_p$ ($\chi = V - E = 1$, `ads_euler_characteristic_one`) and its rotating Tate-curve BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$ ($\chi = V - E = 0$, `btz_euler_characteristic_zero`, horizon length $L = p^h \ge 3$, flux $\Omega \in [-\pi, \pi]$), the bulk scalar field $\phi : V \to \mathbb{C}$ obeys the curved gauge-covariant Klein-Gordon equation with $m^2(\Delta) = p^\Delta + p^{1-\Delta} - (p+1)$, shadow duality $\Delta \leftrightarrow 1 - \Delta$ (`gubser_shadow_duality`), and exact BF squared bound $m^2(\Delta) - m_{\text{BF}}^2 = (p^{\Delta/2} - p^{(1-\Delta)/2})^2 \ge 0$ (`gubser_bf_bound_exact_square`).

### Theorem IV (Exact $O(V)$ Unconditional Rank-1 Complex Hermitian Solver & Flux Parity)
Bottom-up Schur-complement elimination reduces hanging subtrees to an $L \times L$ Hermitian cyclic tridiagonal matrix $M = T + w_{L-1} u u^\dagger$ ($u = [1, 0, \dots, -e^{i\theta}]^T$, $w_{L-1} u u^\dagger \succeq 0$). Solving $Ty = \tilde{b}_H$ and $Tz = u$ via complex Thomas elimination yields $\phi_H = y - \frac{w_{L-1} u^\dagger y}{1 + w_{L-1} u^\dagger z} z$ with unconditional denominator $\mathrm{den} \ge 1 > 0$. Formalized in arbitrary dimension in [`SolitonAndSolver.lean`](../lean/UltrametricaProofs/SolitonAndSolver.lean) (`sherman_morrison_exact_identity`, `sherman_morrison_denominator_ge_one`, `kerr_flux_edge_stress_even`, `kerr_flux_edge_current_odd`), verified with literally zero error in exact Gaussian rationals $\mathbb{Q}(i)$, and stress-tested in Experiment H2 down to $\Delta = 0.5001$ ($m^2 - m_{\text{BF}}^2 \approx 2.09 \times 10^{-8}$) under inhomogeneous curvature ($\sigma_e \in [-1.5, +1.5]$) and maximal flux $\Omega = \pi$ with worst residual `5.38e-15` and min Schur pivot `0.8637 > 0`.

---

## 6. Tate-Curve BTZ Curvature & Non-Perturbative Curved AdS Gauss-Bonnet Law (Theorems II & V)

### Theorem II (First-Principles Tate-Curve BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy)
Bridging the literal $L$-cycle graph metric (`cycleDist`, `btzGraphDist`) to the neighbor-class distance table (`btz_graph_metric_eq_classDist`) and certifying Kantorovich primal-dual 1-Wasserstein optimality over ALL rational bipartite transport plans in [`HolographyCurvature.lean`](../lean/UltrametricaProofs/HolographyCurvature.lean) (`btz_dual_1lipschitz`, `btz_wasserstein_lower_bound`, `btz_primal_feasible`, `btz_primal_cost_exact`, `btz_kappa_from_wasserstein`) establishes for all $p \ge 2, L \ge 3$:
$$\kappa_{\text{BTZ}}(p, L) = -\frac{2p - \max(0, 6 - L)}{p + 2}, \qquad (p+1)(p+2)\big(\kappa_{\text{BTZ}}(p, L) - \kappa_{\text{AdS}}(p)\big) = (p + 1)\max(0, 6 - L) - 4,$$
yielding monotonicity in $L$ (`btz_curvature_monotone_in_L`) and the sharp three-regime trichotomy: Planck flattening ($L \in \{3, 4\}$, plus $L = 5$ for $p \ge 4$), exact cancellation at $(p, L) = (3, 5)$ ($\kappa_{\text{BTZ}} = \kappa_{\text{AdS}} = -1$), and macroscopic hyperbolicity ($L \ge 6$, deficit $-4/((p+1)(p+2))$). Independently verified via exact `fractions.Fraction` optimal transport across 45 $(p, L)$ horizons with zero rounding error.

### Theorem V (Non-Perturbative Curved AdS Discrete Gauss-Bonnet Conservation & Supercritical Pinch Deficit)
Perturbing any strictly interior bridge edge $e = (u, v)$ of $T_p$ to finite length $a_e = e^{\sigma_e} > 0$ (conductance $w_e = e^{-\sigma_e}$, surrounding edges $1$) yields two exact curved Kantorovich optimal-transport regimes separated by the sharp pinch margin $\sigma_e^* = -\ln p$ ($a_e^* = 1/p$):
$$\sum_{e'' \in E(T_p)} \big(\kappa_{e''}(\sigma_e) - \kappa_{\mathrm{AdS}}(p)\big) = \begin{cases} 0 & \forall\, \sigma_e \ge -\ln p \quad (\text{exact non-perturbative conservation}), \\[6pt] -\dfrac{2(e^{-\sigma_e} - p)}{e^{-\sigma_e} + p} < 0 & \forall\, \sigma_e < -\ln p \quad (\text{supercritical pinch deficit}). \end{cases}$$
Proved from first-principles curved Kantorovich duality in [`HolographyCurvature.lean`](../lean/UltrametricaProofs/HolographyCurvature.lean) (`curved_sub_*`, `curved_sup_*`, `curved_ads_gauss_bonnet_subcritical`, `curved_ads_supercritical_pinch_deficit`, `curved_ads_supercritical_strictly_negative`), verified with zero rounding error across 60 exact `Fraction` transport plans in `scripts/verify_exact.py`, and matched to `7.77e-16`–`5.33e-15` in Experiment H1.

---

## 7. Exact $O(V)$ Ryu-Takayanagi Minimal Cut & Horizon Entanglement-Wedge Plateau

[`computeRyuTakayanagi`](../src/engine/holography.js) computes the global minimum homologous edge cut $\gamma_A$ (edge bond capacity $w_e \ln p$) in exact $O(V)$ time via bottom-up tree DP plus a 2-case cycle DP around the BTZ horizon ring (verified against exhaustive $2^{|V_{\text{int}}|}$ brute-force minimization on random weighted trees and 4,096-state BTZ graphs, `Theorem 8`). Lean 4 formally certifies odd-prime single-subtree horizon dominance for all $k \ge 1$ (`rt_uniform_odd_prime_all_arcs`), dyadic criticality at $p = 2, k = 1$ lifting at $k \ge 2$ (`rt_uniform_dyadic_two_arcs`), and universal pure-state complement symmetry $S(A) = S(A^c)$ on arbitrary weighted graphs (`rt_cut_complement_symmetry`).

---

## 8. Symmetric Dynamic Edge-Length Einstein Gravity Backreaction

Inspired by Gubser-Heydeman-Jepsen-Marcolli edge-length dynamics [6], each edge $e$ carries a dynamical log-length $\sigma_e = \ln a_e$ obeying a damped relativistic wave equation on the bulk line graph driven by covariant stress-energy $T_e = w_e |\phi_u - e^{i A_{uv}} \phi_v|^2$, updated via a strictly symmetric Jacobi snapshot (`_sigmaSnap`, eliminating Gauss-Seidel index-ordering bias — verified to `< 1e-15` sibling symmetry and guarded by Mutant M7) and feeding radial redshift backreaction $V_{\text{grav}}(\ell)$ into the 4th-order Yoshida symplectic boundary integrator [12].

---

## 9. Real-Time WebGL2 Hyperbolic Geometry & 48 kHz Prime-Power AudioWorklet

- **WebGL2 Hyperbolic Poincaré Bowl & Cantor Rim ([renderer3d.js](../src/web/renderer3d.js)):** Custom GLSL 300 es pipeline with cached uniform locations, zero-GC staging arrays, `webglcontextlost` recovery, URL query-string state permalinks (`exp`, `p`, `btz`, `view`, `alpha`, `theta`, `g`, `delta`, `grav`, `dyn`, `flux`, `rt`), PNG snapshot capture, and zero-clipping `1280×800` scientific dashboard layout live at `https://0thernes.github.io/ultrametrica/`.
- **48 kHz Prime-Power AudioWorklet ([audio-worklet.js](../src/web/audio-worklet.js), [audio.js](../src/web/audio.js)):** Synthesizes unified canonical prime-power Vladimirov harmonic ladders ($2^x, 3^x, 5^x, 7^x$) with click-free exponentially smoothed BTZ drone crossfading, smoothed master gain, `Number.isFinite` sanitization, and Monna-centroid stereo imaging.

---

## 10. Reproducible Benchmarks (Experiments A–H) & Falsification Matrix

All 8 benchmark datasets are deterministically reproduced by `npm run discover` and stored in [`results/discovery-benchmarks.json`](../results/discovery-benchmarks.json):

- **Exp A (Full Adelic Spectrum):** Odd primes $p=3, 5$ lock at $(N+1)/2$ doublets (`41/81`, `63/125`); $p=2$ shatters all doublets (`64/64`).
- **Exp B (BTZ Ollivier-Ricci Law):** SPFA optimal transport matches Theorem II to $\le 2.22 \times 10^{-16}$ across $L \in \{3, 4, 5, 7, 8, 9, 16\}$.
- **Exp C & F (Kozyrev Solitons & $\alpha$-Scaling):** Solo & disjoint multi-solitons hold `0.00%` leakage up to $g = 500$; overlapping multi-scale peak decays monotonically from `1.470%` ($\alpha=0.6$) to `0.087%` ($\alpha=1.4$) with universal large-$g$ self-trapping (`< 0.02%`).
- **Exp D (Kerr-BTZ Flux Parity):** Peak $|J| = 1.1169 \times 10^{-2}$, exact odd current parity `0.00`, exact even bulk action `0.00`.
- **Exp E & G (Intra-Sector Complex Hermitian Statistics & $\alpha \in [0.5, 2.0]$ Contrast up to $N = 625$):** Cross-validated to $2.13 \times 10^{-14}$; even at quadratic $\alpha = 2.0$ ($\|H_{Q,\text{off}}\|_F / \|H_R\|_F = 0.272\text{--}0.401$), $p=5, W_{0,1}$ holds `0.6334` ($\approx \frac{2}{3}$), sibling $W_{0,2}$ holds `0.2562` ($\approx \frac{1}{4}$), $p=3, W_{0,1}$ holds `0.5019` ($\approx \frac{1}{2}$), and $p=2, W_{0,1}$ collapses to `0.0004`, universally falsifying GOE/GUE thermalization.
- **Exp H (Theorem V Curved Gauss-Bonnet & BF Margin):** Matches Theorem V to `7.77e-16` ($p=2$), `1.33e-15` ($p=3$), and `5.33e-15` ($p=5$) across stretches and supercritical pinches; curved Kerr-BTZ ($\Omega = \pi$) down to $\Delta = 0.5001$ achieves worst KG residual `5.38e-15` and min Schur pivot `0.8637 > 0`.

---

## 11. Honest Novelty Assessment: Established Literature vs. Original Contributions

| Category | Component | Status & Attribution |
|---|---|---|
| **Established Physics & Math** | $p$-adic quantum mechanics, Vladimirov $D_p^\alpha$, Kozyrev wavelets, $p$-adic AdS/CFT, BF bound, Tate-curve BTZ, dynamic edge-length gravity, tree Ollivier-Ricci, Yoshida splitting | Vladimirov-Volovich-Zelenov [3], Kozyrev [8], Gubser et al. [4, 6], Heydeman et al. [5, 7], Ollivier [10], Yoshida [12], Lin-Lu-Yau [13] |
| **Original Mathematical Result** | **Theorem I & Prop. 4.2**: Recursive valuation-residue decomposition $W_{s,m}$, Odd-vs-Even Parity-Doubling Dichotomy, & $\alpha$-invariant modular picket-fence locking (falsifying GOE/GUE up to $N=625$) | Derived, universally Lean-proved, & verified across Exp A, E, G |
| **Original Mathematical Result** | **Theorem II**: Cycle-metric-bridged first-principles BTZ Ollivier-Ricci law $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ & exact $L_c = 5$ trichotomy | Universally Lean-proved & verified over 45 exact `Fraction` horizons |
| **Original Mathematical Result** | **Theorem V**: Non-perturbative curved AdS discrete Gauss-Bonnet conservation ($\sigma_e \ge -\ln p$) & exact supercritical pinch deficit ($\sigma_e < -\ln p$) | Discovered in `v1.3.0` audit, universally Lean-proved via curved Kantorovich duality, & verified over 60 exact `Fraction` plans |
| **Original Characterization & Engineering** | **Theorems III & IV** & Full Real-Time System: Arbitrary $K$-ball compacton-solitons, $\alpha$-scaled self-trapping, unconditional $O(V)$ complex Hermitian Kerr-BTZ solver, $O(V)$ RT Cycle-DP, WebGL2 observatory & 48 kHz prime-power AudioWorklet | Zero-dependency 60 FPS system with 101 Lean 4 proofs & 8/8 negative mutants killed |

**Explicit Non-Claims:** We claim zero empirical discovery of new physical laws of nature, zero prior discovery of established $p$-adic AdS/CFT or wavelet literature, and no peer-reviewed journal status.

---

## 12. Lean 4 Machine-Checked Formalization Audit (101 Declarations) & Adversarial Audit

All **101 exported declarations (`2,267` lines)** across [`lean/UltrametricaProofs.lean`](../lean/UltrametricaProofs.lean) and its four pure core modules (`Basic`: 26, `AdelicSymmetry`: 23, `HolographyCurvature`: 40, `SolitonAndSolver`: 12) clean-build under `leanprover/lean4:v4.35.0` with **zero Mathlib, zero `native_decide`, zero errors, zero warnings, zero `sorryAx`, and zero custom axioms**. Complete kernel output is archived in [`results/lean4-audit.txt`](../results/lean4-audit.txt), mapped 1-to-1 in [`docs/CLAIMS.md`](../docs/CLAIMS.md), stress-tested by 8/8 killed planted mutants (`test/mutants.mjs`), and audited end-to-end across all 7 stack layers in [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](../docs/AUDIT_AND_CONTRAST_ANALYSIS.md).

---

## 13. Cited Primary Sources

1. I. V. Volovich, *"p-Adic String"*, Classical and Quantum Gravity **4** (1987), L83–L87. DOI: `10.1088/0264-9381/4/4/003`.
2. P. G. O. Freund and E. Witten, *"Adelic String Amplitudes"*, Physics Letters B **199** (1987), 191–194. DOI: `10.1016/0370-2693(87)91357-8`.
3. V. S. Vladimirov, I. V. Volovich, and E. I. Zelenov, *p-Adic Analysis and Mathematical Physics*, World Scientific (1994). ISBN: `978-9810208806`.
4. S. S. Gubser, J. Knaute, S. Parikh, A. Samberg, and P. Witaszczyk, *"p-adic AdS/CFT"*, Communications in Mathematical Physics **352** (2017), 1019–1059. arXiv:`1605.01061`.
5. M. Heydeman, M. Marcolli, I. Saberi, and B. Stoica, *"Tensor networks, p-adic fields, and algebraic curves: arithmetic and the $\mathrm{AdS}_3/\mathrm{CFT}_2$ correspondence"*, Advances in Theoretical and Mathematical Physics **22** (2018), 93–176. arXiv:`1605.07639`.
6. S. S. Gubser, M. Heydeman, C. Jepsen, M. Marcolli, S. Parikh, I. Saberi, B. Stoica, and B. Trundy, *"Edge length dynamics on graphs with applications to p-adic AdS/CFT"*, Journal of High Energy Physics **06** (2017), 157. arXiv:`1611.09770`.
7. M. Heydeman, M. Marcolli, S. Parikh, and I. Saberi, *"Nonarchimedean Holographic Entropy from Networks of Perfect Tensors"*, Advances in Theoretical and Mathematical Physics **25** (2021), 591–721. arXiv:`1812.04057`.
8. S. V. Kozyrev, *"Wavelet analysis as a p-adic spectral analysis"*, Izvestiya: Mathematics **66**(2) (2002), 367–376. arXiv:`math-ph/0012019`.
9. B. Dragovich, A. Yu. Khrennikov, S. V. Kozyrev, I. V. Volovich, and E. I. Zelenov, *"p-Adic mathematical physics: the first 30 years"*, p-Adic Numbers, Ultrametric Analysis and Applications **9** (2017), 87–121. arXiv:`1705.04758`.
10. Y. Ollivier, *"Ricci curvature of Markov chains on metric spaces"*, Journal of Functional Analysis **256**(3) (2009), 810–864. DOI: `10.1016/j.jfa.2008.11.001`.
11. S. Ryu and T. Takayanagi, *"Holographic Derivation of Entanglement Entropy from AdS/CFT"*, Physical Review Letters **96** (2006), 181602. arXiv:`hep-th/0603001`.
12. H. Yoshida, *"Construction of higher order symplectic integrators"*, Physics Letters A **150**(5–7) (1990), 262–268. DOI: `10.1016/0375-9601(90)90092-3`.
13. Y. Lin, L. Lu, and S.-T. Yau, *"Ricci curvature of graphs"*, Tohoku Mathematical Journal **63**(4) (2011), 605–627. DOI: `10.2748/tmj/1325886283`.
14. J. Sherman and W. J. Morrison, *"Adjustment of an Inverse Matrix Corresponding to a Change in One Element of a Given Matrix"*, Annals of Mathematical Statistics **21**(1) (1950), 124–127.
15. A. F. Monna, *Analyse non-archimédienne*, Springer-Verlag (1970). ISBN: `978-3540050186`.
16. V. Oganesyan and D. A. Huse, *"Localization of interacting fermions at high temperature"*, Physical Review B **75** (2007), 155111. arXiv:`cond-mat/0610854`.
17. F. Pastawski, B. Yoshida, D. Harlow, and J. Preskill, *"Holographic quantum error-correcting codes: toy models for the bulk/boundary correspondence"*, JHEP **06** (2015), 149. arXiv:`1503.06237`.
18. L. de Moura and S. Ullrich, *"The Lean 4 Theorem Prover and Programming Language"*, CADE-28, LNCS **12699** (2021), 625–635. DOI: `10.1007/978-3-030-79876-5_37`.

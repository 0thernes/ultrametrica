# ULTRAMETRICA: Exact Non-Archimedean Holography, Recursive Adelic Valuation-Residue Symmetries, Tate-Curve BTZ Ollivier-Ricci Curvature, and Real-Time $p$-adic Quantum Gravity

**Author:** Alexander S. Donahue (0thernes LLC)  
**Correspondence:** `0_0@0thernes.art` · ORCID: [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648)  
**Date:** November 18, 2026 · **Version:** 1.0.0 (Research Preprint — Not Peer-Reviewed)  
**Repository:** `https://github.com/0thernes/ultrametrica`  
**License:** COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY ([LICENSE](../LICENSE))  
**AI Disclosure:** Substantive AI research/engineering assistance (Google DeepMind / Antigravity) under the author's direction is explicitly disclosed in [LEGAL.md](../LEGAL.md).

---

## Abstract

We present **ULTRAMETRICA**, a zero-dependency computational laboratory and formal mathematical framework coupling discrete $p$-adic quantum field theory on $\mathbb{Z}_p / p^n\mathbb{Z}_p$ ($p \in \{2, 3, 5, 7\}$) to exact holographic bulk gravity on the Bruhat-Tits tree $T_p$ and its rotating Tate-curve BTZ black hole quotients $T_p / p^{h\mathbb{Z}}$. Beyond implementing established non-Archimedean constructions to machine precision ($10^{-12}$–$10^{-17}$) — including exact Radix-$p$ Pontryagin Fourier transforms, Vladimirov fractional pseudo-differential operators $D_p^\alpha$, orthonormal Kozyrev wavelets, 4th-order Yoshida symplectic nonlinear evolution, dynamic edge-length gravitational backreaction, and exact $O(V)$ Ryu-Takayanagi minimal cuts — we derive, numerically verify, and machine-check in **Lean 4 (`v4.35.0`, 24 audited declarations, zero `sorryAx`)** four sharp mathematical and algorithmic results:

1. **Theorem I (Adelic Parity-Doubling Dichotomy & Recursive Valuation-Residue Decomposition):** Conjugating the Vladimirov operator $D_p^\alpha$ by the discrete $p$-adic Monna digit-reversal involution $R_p$ and adding any real even Archimedean circulant operator $H_{\mathbb{R}}$ yields a non-commuting hybrid Hamiltonian $H_\theta = \theta R_p D_p^\alpha R_p + (1-\theta) H_{\mathbb{R}}$ that nevertheless block-diagonalizes **identically** in the discrete Fourier basis into $1 + n(p-1)$ exact valuation-residue sectors $W_{s,m} = \operatorname{span}\{e_k : k \equiv m p^s \pmod{p^{s+1}}\}$ (verified off-block leak $< 3.2 \times 10^{-14}$). Anti-unitary complex conjugation maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$, forcing **every excited eigenvalue to have exact even multiplicity ($\ge 2$)** for every odd prime $p \ge 3$ (at most $(p^n+1)/2$ distinct levels), while uniquely lifting all symmetry-protected doublets to $2^n$ simple levels at the even prime $p = 2$.
2. **Theorem II (Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Critical Trichotomy):** On any uniform discrete $p$-adic BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$ of degree $p \ge 2$ and horizon circumference $L \ge 3$, exact non-lazy bipartite Wasserstein transport yields the closed-form horizon curvature $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$, satisfying $(p+1)(p+2)(\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}) = (p+1)\max(0, 6-L) - 4$. This establishes a sharp horizon sign-inversion: Planck-scale horizons ($L \in \{3, 4\}$, plus $L = 5$ for $p \ge 4$) are strictly *flatter* than pure AdS due to topological ring shortcuts; $p = 3, L = 5$ achieves exact curvature cancellation ($\kappa_{\text{BTZ}} = \kappa_{\text{AdS}} = -1$); and macroscopic horizons ($L \ge 6$) are strictly *more negatively curved* than pure AdS by exactly $-4/((p+1)(p+2))$.
3. **Theorem III (Multi-Ball Kozyrev Compacton-Soliton Invariance & Macroscopic Self-Trapping Resonance):** Any superposition of Kozyrev wavelets on pairwise disjoint $p$-adic balls is an exact, strictly compactly supported, non-interacting nonlinear soliton of $i\partial_t \psi = (D_p^\alpha + F(|\psi|^2))\psi$ for **arbitrary** local nonlinearity $F$ (verified to $0.00$ leakage up to $g = 500$), whereas overlapping multi-scale superpositions exhibit a non-monotonic ultrametric tunneling resonance followed by macroscopic nonlinear self-trapping at large $g$.
4. **Theorem IV (Unconditional Positive-Definite Rank-1 Kerr-BTZ Bulk Solver):** Decomposing a gauge-coupled rotating BTZ horizon wrap edge $e_{L-1}$ as the positive-semidefinite rank-1 matrix $w_{L-1} u u^\dagger$ ($u = [1, 0, \dots, -e^{i\Omega/L}]^T$) yields an exact $O(V)$ Schur-complement + Sherman-Morrison complex Klein-Gordon solver whose denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1$ never vanishes for any $w_e > 0$ and any Kerr flux $\Omega \in [-\pi, \pi]$, achieving $10^{-16}$–$10^{-17}$ PDE residuals at 60 FPS alongside a WebGL2 3D hyperbolic renderer and a 48 kHz non-octave prime-power `AudioWorklet` synthesizer.

---

## Table of Contents

1. [Introduction & Epistemic Scope](#1-introduction--epistemic-scope)
2. [Discrete $p$-adic Harmonic Analysis & Exact Radix-$p$ Pontryagin FFT](#2-discrete-p-adic-harmonic-analysis--exact-radix-p-pontryagin-fft)
3. [Kozyrev Wavelets & Multi-Ball Nonlinear Compacton-Soliton Invariance (Theorem III)](#3-kozyrev-wavelets--multi-ball-nonlinear-compacton-soliton-invariance-theorem-iii)
4. [The Monna-Conjugated Adelic Hybrid Hamiltonian & Parity-Doubling Dichotomy (Theorem I)](#4-the-monna-conjugated-adelic-hybrid-hamiltonian--parity-doubling-dichotomy-theorem-i)
5. [Bruhat-Tits AdS & Rotating Kerr-BTZ Bulk Klein-Gordon Solver (Theorem IV)](#5-bruhat-tits-ads--rotating-kerr-btz-bulk-klein-gordon-solver-theorem-iv)
6. [Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy (Theorem II)](#6-unified-tate-curve-btz-ollivier-ricci-curvature-law--l_c--5-trichotomy-theorem-ii)
7. [Exact $O(V)$ Ryu-Takayanagi Minimal Cut & Horizon Entanglement-Wedge Plateau](#7-exact-ov-ryu-takayanagi-minimal-cut--horizon-entanglement-wedge-plateau)
8. [Dynamic Edge-Length Einstein Gravity Backreaction](#8-dynamic-edge-length-einstein-gravity-backreaction)
9. [Real-Time WebGL2 Hyperbolic Geometry & Prime-Power AudioWorklet Synthesis](#9-real-time-webgl2-hyperbolic-geometry--prime-power-audioworklet-synthesis)
10. [Reproducible Experimental Benchmarks & Falsification Matrix](#10-reproducible-experimental-benchmarks--falsification-matrix)
11. [Honest Novelty Assessment: Established Literature vs. Original Contributions](#11-honest-novelty-assessment-established-literature-vs-original-contributions)
12. [Lean 4 Machine-Checked Formalization Audit](#12-lean-4-machine-checked-formalization-audit)
13. [Cited Primary Sources](#13-cited-primary-sources)

---

## 1. Introduction & Epistemic Scope

Ostrowski's Theorem (1916) establishes that every non-trivial absolute value on the rational numbers $\mathbb{Q}$ is equivalent either to the familiar Archimedean absolute value $|\cdot|_\infty$ (whose completion is $\mathbb{R}$) or to a $p$-adic ultrametric absolute value $|x|_p = p^{-v_p(x)}$ for some prime $p$ (whose completion is the locally compact, totally disconnected field $\mathbb{Q}_p$). In the late 1980s, Volovich [1], Freund and Witten [2], and Vladimirov, Volovich, and Zelenov [3] proposed non-Archimedean and adelic formulations of Planck-scale physics and string amplitudes. A major revival occurred in 2016–2018 when Gubser et al. [4, 6] and Heydeman, Marcolli, Saberi, and Stoica [5, 7] formulated **$p$-adic AdS/CFT**, demonstrating that the Bruhat-Tits tree $T_p = \mathrm{PGL}_2(\mathbb{Q}_p)/\mathrm{PGL}_2(\mathbb{Z}_p)$ acts as a discrete hyperbolic holographic bulk whose boundary at infinity is $\mathbb{P}^1(\mathbb{Q}_p)$, and whose Tate-curve Schottky quotients $T_p / q^\mathbb{Z}$ model discrete BTZ black holes.

Despite rich theoretical literature, real-time interactive computational laboratories implementing **exact** $p$-adic quantum dynamics coupled to **exact** curved holographic bulk gravity, discrete Ricci curvature, holographic entanglement entropy, and formal machine-checked proofs have remained absent. **ULTRAMETRICA** closes this gap.

**Epistemic Boundary:** This work is a **mathematical-physics, formal-verification, and computational study**. It makes no claim of experimental discovery of new empirical laws of physical nature; rather, it establishes machine-verified algebraic/combinatorial theorems, exact $O(V)$ and $O(p N \log_p N)$ algorithms, and falsifiable spectral/dynamical predictions within discrete non-Archimedean and adelic mathematical models.

---

## 2. Discrete $p$-adic Harmonic Analysis & Exact Radix-$p$ Pontryagin FFT

Let $p \in \{2, 3, 5, 7\}$ be prime and $n \ge 2$ an integer depth, with Hilbert space dimension $N = p^n$. We discretize locally constant Schwartz-Bruhat functions on the $p$-adic integers $\mathbb{Z}_p$ to $\mathcal{H}_{p,n} = L^2(\mathbb{Z}_p / p^n \mathbb{Z}_p) \cong \mathbb{C}^{p^n}$.

### 2.1 Base-$p$ Digit Reversal as the Exact Discrete Monna Map
Write $x \in \{0, \dots, p^n - 1\}$ in little-endian base-$p$ digits $x = \sum_{r=0}^{n-1} d_r p^r$ ($d_r \in \{0, \dots, p-1\}$). The **Monna map** $\mathcal{M}_p : \mathbb{Z}_p \to [0, 1]$ maps $x \mapsto \sum_{r=0}^{n-1} d_r p^{-(r+1)}$. On $\mathbb{Z}/p^n\mathbb{Z}$, the scaled integer index $\ell = p^n \mathcal{M}_p(x) = \sum_{r=0}^{n-1} d_r p^{n-1-r}$ is identically the **base-$p$ digit reversal involution** $R_p(x) = \ell$ ($R_p^2 = I$, machine-verified in `Basic.lean`).

Crucially, two $p$-adic integers $x, y$ lie in the same ultrametric ball $B(a, p^{-j})$ ($x \equiv y \pmod{p^j}$, i.e., $|x-y|_p \le p^{-j}$) if and only if their digit-reversed leaf indices $\ell_x = R_p(x)$ and $\ell_y = R_p(y)$ share the same top $j$ base-$p$ digits — meaning every $p$-adic ball is an exact contiguous Bruhat-Tits subtree slice $\ell \in [b p^{n-j}, (b+1)p^{n-j})$.

### 2.2 Native Radix-$p$ Unitary Pontryagin Fourier Transform
The Pontryagin dual of $\mathbb{Z}_p / p^n\mathbb{Z}_p$ is $p^{-n}\mathbb{Z}/\mathbb{Z}$, indexed by $k \in \{0, \dots, p^n-1\}$ with additive character $\chi_p(\xi_k x) = \exp(2\pi i k x / p^n)$ ($\xi_k = k/p^n$). Rather than zero-padding to powers of $2$ (which destroys exact ultrametric periodicity), [`src/engine/padic.js`](../src/engine/padic.js) implements a native decimation-in-time **Radix-$p$ Cooley-Tukey unitary FFT**:
$$(\mathcal{F}_p \psi)[k] = \frac{1}{\sqrt{p^n}} \sum_{x=0}^{p^n - 1} \psi(x) e^{-2\pi i x k / p^n}$$
in $O(p N \log_p N)$ operations, verified directly against naive $O(N^2)$ DFT to $< 10^{-11}$ and Parseval unitarity to $< 10^{-11}$ across $p \in \{2, 3, 5, 7\}$ (`Theorem 1` in [test/verify.mjs](../test/verify.mjs)).

### 2.3 Exact Vladimirov Operator $D_p^\alpha$
In Pontryagin frequency space, the Vladimirov fractional pseudo-differential operator [3] acts diagonally as multiplication by the $p$-adic norm raised to $\alpha > 0$:
$$\widehat{(D_p^\alpha \psi)}[k] = |\xi_k|_p^\alpha \, \hat{\psi}[k], \qquad |\xi_k|_p = \begin{cases} 0 & k = 0, \\ p^{n - v_p(k)} & 1 \le k < p^n, \end{cases}$$
where $v_p(k) = \max\{r : p^r \mid k\}$. Its position-space kernel depends solely on $v_p(x - y)$ (verified to $1.78 \times 10^{-15}$), granting $D_p^\alpha$ invariance under the full Bruhat-Tits wreath-product automorphism group $\operatorname{Aut}(T_p) = S_p \wr \cdots \wr S_p$.

---

## 3. Kozyrev Wavelets & Multi-Ball Nonlinear Compacton-Soliton Invariance (Theorem III)

Kozyrev [8] proved that the $p$-adic wavelet basis on $\mathbb{Z}_p / p^n\mathbb{Z}_p$:
$$\psi_{j,b,m}(x) = p^{-(n-j)/2} \, \mathbf{1}_{B_j(b)}(x) \, \exp\!\left(\frac{2\pi i \, m \, d_j(x)}{p}\right), \qquad 0 \le j < n,\; 0 \le b < p^j,\; 1 \le m < p$$
together with the constant mode $\psi_0(x) = p^{-n/2}$, forms a complete orthonormal basis ($1 + \sum_{j=0}^{n-1} (p-1) p^j = p^n$, proved in Lean 4 as `hilbert_sector_completeness`) of **strictly compactly supported exact eigenfunctions** of the non-local operator $D_p^\alpha$:
$$D_p^\alpha \psi_{j,b,m} = p^{\alpha(j+1)} \psi_{j,b,m}.$$
No compactly supported eigenfunction of $(-\Delta_{\mathbb{R}})^{\alpha/2}$ exists in Euclidean space $\mathbb{R}$ by Paley-Wiener analyticity.

### Theorem III (Exact Multi-Ball Compacton-Soliton Invariance)
**Statement.** Let $F : \mathbb{R}_{\ge 0} \to \mathbb{R}$ be any arbitrary local nonlinear potential (e.g., cubic Gross-Pitaevskii $F(\rho) = g\rho$, saturating, or quintic). Let $\{(j_r, b_r, m_r)\}_{r=1}^K$ be any family of Kozyrev wavelets supported on **pairwise disjoint** $p$-adic balls $B_{j_r}(b_r) \cap B_{j_{r'}}(b_{r'}) = \emptyset$ ($r \ne r'$), with arbitrary complex amplitudes $c_r \in \mathbb{C}$. Then:
$$\Psi(x, t) = \sum_{r=1}^K c_r \, e^{-i \omega_r t} \, \psi_{j_r, b_r, m_r}(x), \qquad \omega_r = p^{\alpha(j_r + 1)} + F\!\left(|c_r|^2 p^{-(n - j_r)}\right)$$
is an **exact, strictly compactly supported, radiation-free, non-interacting nonlinear multi-soliton solution** of the nonlinear $p$-adic Schrödinger equation:
$$i \frac{\partial \Psi}{\partial t} = \Big(D_p^\alpha + F(|\Psi|^2)\Big)\Psi.$$

**Proof.** On every ball $B_{j_r}(b_r)$, $|\psi_{j_r, b_r, m_r}(x)|^2 = p^{-(n-j_r)}$ is strictly constant, and vanishes identically outside $B_{j_r}(b_r)$. Because the balls are pairwise disjoint, for every $x$ at most one term $r$ is nonzero, so $F(|\Psi(x,t)|^2)\Psi(x,t) = \sum_{r=1}^K F(|c_r|^2 p^{-(n-j_r)}) c_r e^{-i\omega_r t}\psi_{j_r,b_r,m_r}(x)$. Combining with linearity of $D_p^\alpha$ yields the exact eigenvalue equation term-by-term. Formally machine-checked in Lean 4 as `kozyrev_exact_nonlinear_soliton` and `disjoint_multi_soliton_no_crosstalk` (`[propext]` only). $\square$

### Empirical Discovery: Macroscopic Nonlinear Self-Trapping Resonance
When two Kozyrev wavelets overlap at **different scales** inside the *same* parent ball (making $|\Psi(x)|^2$ non-uniform within the ball), Theorem III no longer applies and nonlinearity couples distinct Vladimirov shells, driving discontinuous ultrametric tunneling into external balls. However, Experiment C ([results/discovery-benchmarks.json](../results/discovery-benchmarks.json)) reveals a **non-monotonic tunneling resonance** for $p = 3, n = 5$: external leakage rises from `0.00%` ($g = 0$) to a resonant peak `0.37%` ($g = 60$), then collapses back to `0.04%` ($g = 300$) and `0.00%` ($g = 500$) due to extreme nonlinear phase detuning $g|\psi|^2 \gg \|D_p^\alpha\|$ decoupling the occupied ball from empty exterior balls — a $p$-adic analog of Bosonic Josephson macroscopic quantum self-trapping.

---

## 4. The Monna-Conjugated Adelic Hybrid Hamiltonian & Parity-Doubling Dichotomy (Theorem I)

Motivated by adelic physics [2, 9] combining real and $p$-adic metrics, we define on the Monna leaf circle $\mathbb{Z}/p^n\mathbb{Z}$ the one-parameter **Adelic Hybrid Hamiltonian** ($\theta \in [0, 1]$):
$$H_\theta = \theta \, H_Q^{\text{leaf}} + (1 - \theta) \, H_R^{\text{leaf}}, \qquad H_Q^{\text{leaf}} = R_p F^\dagger \Lambda_{\mathbb{Q}_p} F R_p, \quad H_R^{\text{leaf}} = F^\dagger \Lambda_{\mathbb{R}} F,$$
where $\Lambda_{\mathbb{R}}[k] \propto (2\pi \min(k, N-k))^\alpha$ is calibrated to match the RMS spectral scale of $\Lambda_{\mathbb{Q}_p}$. Because $R_p$ is the base-$p$ digit-reversal involution (structurally analogous to a quantum Baker's map), $[H_Q^{\text{leaf}}, H_R^{\text{leaf}}] \ne 0$ (normalized Frobenius commutator $0.0219$ at $p=3, n=4$; $0.0252$ at $p=2, n=6$; $0.0135$ at $p=5, n=3$).

A natural expectation from quantum chaos would be that non-commutativity of the Archimedean and $p$-adic metrics lifts degeneracies across the full Hilbert space into Wigner-Dyson GOE statistics. **Exact diagonalization in Experiment A falsifies that naïve hypothesis and uncovers a hidden recursive algebraic structure:**

### Theorem I (Recursive Valuation-Residue Decomposition & Adelic Parity-Doubling Dichotomy)
**Statement.** Let $H_Q$ be *any* $p$-adic ultrametric operator (matrix element depending only on $v_p(x-y)$) and $H_R$ be *any* real even circulant operator on $\mathbb{Z}/p^n\mathbb{Z}$. Let $e_k(\ell) = p^{-n/2} e^{2\pi i k \ell / p^n}$ denote the discrete Fourier basis on leaves, and partition $\{0, \dots, p^n - 1\}$ into the $1 + n(p-1)$ valuation-residue sectors:
$$W_0 = \mathbb{C} e_0, \qquad W_{s, m} = \operatorname{span}\!\big\{ e_k : k \equiv m \, p^s \pmod{p^{s+1}} \big\} \quad (0 \le s < n,\; 1 \le m < p).$$
Then:
1. **Exact Block Invariance:** Every subspace $W_{s, m}$ (of dimension $\dim W_{s, m} = p^{n-s-1}$) is an **exact invariant subspace** of $H_\theta = \theta R_p H_Q R_p + (1-\theta) H_R$ for all $\theta \in \mathbb{R}$.
2. **Anti-Unitary Conjugate Pairing:** Position-space complex conjugation $C(\psi) = \overline{\psi}$ commutes with $H_\theta$ and maps $W_{s, m} \xrightarrow{\sim} W_{s, p - m}$ isometrically.
3. **Prime-Parity Dichotomy:**
   - For **every odd prime $p \ge 3$**, $m \ne p - m$ for all $1 \le m < p$, so $W_{s,m} \perp W_{s,p-m}$ are strictly disjoint orthogonal isospectral blocks. Hence **every excited eigenvalue of $H_\theta$ has exact even multiplicity $\ge 2$**, capping the distinct eigenvalue count at $\le (p^n + 1)/2$ for all $\theta \in [0, 1)$, all $\alpha > 0$, and all $n \ge 1$.
   - For the **unique even prime $p = 2$**, $m = 1 = p - 1$, so every sector $W_{s,1}$ is self-conjugate ($C(W_{s,1}) = W_{s,1}$), lifting all symmetry-protected doublets and generically producing $2^n$ simple (non-degenerate) eigenvalues.

**Proof Outline.** $H_R$ is diagonal in $\{e_k\}$, preserving every $W_{s,m}$ trivially. For $H_Q^{\text{leaf}}$, any $f \in \bigoplus_{m=1}^{p-1} W_{s,m}$ is periodic with period $p^{n-s}$ across the $p^s$ depth-$s$ balls and has zero mean on each depth-$s$ ball. Because $H_Q^{\text{leaf}}(\ell, \ell')$ depends solely on the Bruhat-Tits LCA depth, cross-ball contributions between distinct depth-$s$ balls multiply the zero ball-mean and vanish identically; inside each depth-$s$ subtree, the cyclic shift $T^{p^{n-s-1}}$ strictly permutes the $p$ child subtrees at depth $s+1$ without carrying outside the subtree, hence commutes with $H_Q^{\text{leaf}}$. The eigenspaces of $T^{p^{n-s-1}}$ on this zero-mean periodic space are precisely $W_{s, m}$ (eigenvalue $e^{2\pi i m / p}$). Finally, $k = p^s q$ with $q \bmod p = m$ conjugates to $p^n - k = p^s(p^{n-s} - q)$ with $(p^{n-s} - q) \bmod p = p - m$. Parts 2–3 and dimension completeness are formally machine-checked in Lean 4 (`AdelicSymmetry.lean`), and exact block invariance is verified numerically to $< 3.2 \times 10^{-14}$ across $p \in \{2, 3, 5, 7\}$ (`Theorem 9` in [test/verify.mjs](../test/verify.mjs)). $\square$

---

## 5. Bruhat-Tits AdS & Rotating Kerr-BTZ Bulk Klein-Gordon Solver (Theorem IV)

We construct the finite cutoff Bruhat-Tits tree $T_p$ (depths $d = 0 \dots n$, $V = (p^{n+1}-1)/(p-1)$ vertices) and its rotating **Tate-curve BTZ black hole quotient** $T_p / p^{h\mathbb{Z}}$ (excising $d < h$ and welding the $L = p^h \ge 3$ depth-$h$ vertices into a closed horizon ring threaded by an Aharonov-Bohm / Kerr frame-dragging flux $\Omega \in [-\pi, \pi]$).

On curved edges with dynamic lengths $a_e > 0$ and conductances $w_e = 1/a_e$, the complex bulk scalar field $\phi : V \to \mathbb{C}$ obeys the gauge-covariant curved Klein-Gordon equation at every internal vertex $v \in V_{\text{int}}$:
$$\sum_{u \sim v} w_{uv}\big(\phi_v - e^{i A_{uv}} \phi_u\big) + m^2(\Delta)\,\mu_v\,\phi_v = 0, \qquad m^2(\Delta) = p^\Delta + p^{1-\Delta} - (p+1),$$
with Dirichlet boundary data $\phi(v_\ell) = \psi_{\text{boundary}}(\ell)$, local volume factor $\mu_v = \frac{1}{\deg(v)}\sum_{e \ni v} w_e$, and exact asymptotic infinity-branch Robin impedance $\mu_0(1 - p^{-\Delta})$ at the root $d=0$ of pure AdS (matching Gubser's infinite-tree propagator $K_\Delta(v, y) = p^{(2\cdot\mathrm{lca}(v,y) - d)\Delta}$ to $< 10^{-12}$, `Theorem 6`). The exact Breitenlohner-Freedman bound $m^2(\Delta) - m_{\text{BF}}^2 = (p^{\Delta/2} - p^{(1-\Delta)/2})^2 \ge 0$ ($m_{\text{BF}}^2 = -(\sqrt{p}-1)^2$) is machine-checked in `HolographyCurvature.lean`.

### Theorem IV (Exact $O(V)$ Unconditionally Non-Singular Kerr-BTZ Solver)
Bottom-up Schur-complement elimination reduces all hanging $p$-adic subtrees into the $L$ horizon vertices in $O(V)$ real operations, leaving an $L \times L$ Hermitian cyclic tridiagonal matrix $M$. Cutting the wrap-around horizon edge $e_{L-1} = (h_{L-1} \to h_0)$ (phase $\theta = \Omega/L$) extracts the exact positive-semidefinite rank-1 edge Laplacian:
$$M = T + w_{L-1} u u^\dagger, \qquad u = [1, 0, \dots, 0, -e^{i\theta}]^T,$$
leaving an open-chain Hermitian positive-definite tridiagonal matrix $T$. Solving $Ty = \tilde{b}_H$ and $Tz = u$ via the complex Thomas algorithm ($O(L)$) and combining via Sherman-Morrison gives the exact solution $\phi_H = y - \frac{w_{L-1} u^\dagger y}{1 + w_{L-1} u^\dagger z} z$. Because $w_{L-1} > 0$ and $T \succ 0 \implies u^\dagger T^{-1} u \ge 0$, the denominator satisfies $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ **unconditionally** (`horizon_edge_laplacian_psd`, `horizon_edge_quadratic_expansion`, `sherman_morrison_denominator_ge_one` in `SolitonAndSolver.lean`). Measured uneliminated PDE residuals across curved AdS, tachyonic BF windows ($\Delta = 0.65$), and rotating BTZ horizons ($L \in \{3, 4, 5, 7, 8, 9\}$) remain $< 10^{-15}$–$10^{-17}$.

---

## 6. Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy (Theorem II)

Using Ollivier's discrete Ricci curvature [10] $\kappa(u, v) = 1 - W_1(\mu_u, \mu_v)/a_{uv}$ with non-lazy conductance walks $\mu_u(x) = w_{ux}/\sum_{z \sim u} w_{uz}$:
- On every **tree edge**, the exact Kantorovich-Rubinstein tree formula evaluates $W_1$ in $O(p)$ time, yielding the classic uniform $(p+1)$-regular AdS curvature $\kappa_{\text{AdS}}(p) = -\frac{2(p-1)}{p+1}$ (`Theorem 7`).
- On **BTZ horizon edges**, neighbor sets can shortcut around the closed horizon cycle of length $L$, so [`src/engine/holography.js`](../src/engine/holography.js) solves exact bipartite 1-Wasserstein optimal transport via successive shortest augmenting paths (SPFA).

### Theorem II (Unified Tate-Curve BTZ Horizon Curvature & Universal Sign-Inversion Trichotomy)
**Statement.** On a uniform Tate-curve BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$ (each horizon node having degree $p + 2$: 2 ring neighbors and $p$ hanging tree children, uniform unit edge lengths $a_e = 1$), the exact non-lazy Ollivier-Ricci curvature on every horizon edge is:
$$\kappa_{\text{BTZ}}(p, L) = -\frac{2p - \max(0, 6 - L)}{p + 2} \qquad (\forall\, p \ge 2,\; L \ge 3),$$
and its exact deviation from pure Bruhat-Tits AdS satisfies:
$$(p + 1)(p + 2)\big(\kappa_{\text{BTZ}}(p, L) - \kappa_{\text{AdS}}(p)\big) = (p + 1)\max(0, 6 - L) - 4.$$
Consequently, there is an exact three-regime geometric trichotomy:
1. **Planck-Scale Horizon Flattening ($L \in \{3, 4\}$, all $p \ge 2$):** $\kappa_{\text{BTZ}} > \kappa_{\text{AdS}}$ strictly; topological horizon shortcutting flattens ultra-small black holes relative to pure AdS.
2. **Exact Critical Horizon Circumference ($L_c = 5$):**
   - $p = 2, L = 5$: $\kappa_{\text{BTZ}} - \kappa_{\text{AdS}} = -\frac{1}{12} < 0$ (more negative than AdS);
   - $p = 3, L = 5$: $\kappa_{\text{BTZ}} = \kappa_{\text{AdS}} = -1$ (**exact curvature cancellation!**);
   - $p \ge 4$ (including prime $p = 5$): $\kappa_{\text{BTZ}} - \kappa_{\text{AdS}} = \frac{p - 3}{(p+1)(p+2)} > 0$ (strictly flatter than AdS).
3. **Macroscopic Horizon Hyperbolicity ($L \ge 6$, all $p \ge 2$):** $\kappa_{\text{BTZ}} - \kappa_{\text{AdS}} = -\frac{4}{(p+1)(p+2)} < 0$ strictly.

Every algebraic identity and inequality in Theorem II is machine-checked in Lean 4 (`HolographyCurvature.lean`), and the transport formula is verified against exact SPFA Wasserstein computation to $0$–$2.22 \times 10^{-16}$ across $L \in \{3, 4, 5, 7, 8, 9, 16\}$ (`Experiment B` & `Theorem 9`).

---

## 7. Exact $O(V)$ Ryu-Takayanagi Minimal Cut & Horizon Entanglement-Wedge Plateau

Following discrete holographic tensor-network formulations [5, 11], each bulk edge $e$ carries holographic entanglement bond capacity $\mathrm{cap}(e) = w_e \ln p$. For any boundary subset $A \subset \mathbb{Z}_p / p^n\mathbb{Z}_p$, [`computeRyuTakayanagi`](../src/engine/holography.js) computes the global minimum-weight homologous edge cut $\gamma_A$ and bulk entanglement wedge $\mathcal{E}(A)$ in **exact $O(V)$ time** via bottom-up tree dynamic programming plus a 2-case cycle DP around the BTZ horizon ring — verified identically against exhaustive $2^{|V_{\text{int}}|}$ brute-force minimization on random weighted trees and 4096-state BTZ graphs (`Theorem 8`).

**Discrete Horizon Plateau Contrast with Continuous $\mathrm{AdS}_3$:** On a uniform $p$-adic BTZ black hole ($w_e = 1$), pulling a single complete horizon subtree into $\mathcal{E}(A)$ cuts $2$ horizon edges (cost $2\ln p$) versus cutting its $p$ hanging child edges (cost $p\ln p$). For every odd prime $p \ge 3$, $2 < p$ (`rt_odd_prime_horizon_dominance` in Lean 4), so even a single complete horizon subtree pulls $\mathcal{E}(A)$ onto the horizon, giving a constant plateau $S_{\text{RT}} = 2\ln p$ for any contiguous arc of $1 \le k \le L - 1$ complete horizon subtrees; $p = 2$ sits at exact degeneracy $2 = p$.

---

## 8. Dynamic Edge-Length Einstein Gravity Backreaction

Inspired by Gubser-Heydeman-Jepsen-Marcolli edge-length dynamics [6], each edge $e$ carries a dynamical log-length $\sigma_e = \ln a_e$ (plus optional interactive wormhole surgery pin $\sigma_e^{\text{pin}}$) obeying a damped relativistic wave equation on the bulk line graph driven by the local covariant bulk stress-energy $T_e = w_e |\phi_u - e^{i A_{uv}} \phi_v|^2$:
$$\ddot{\sigma}_e + \gamma_g \dot{\sigma}_e = -k_{\text{AdS}}\sigma_e + \lambda_{\text{curv}}(\bar{\sigma}_{\text{adj}(e)} - \sigma_e) + G_N T_e.$$
Stretched edges lower conductance $w_e = e^{-\sigma_e}$, dynamically warp the 3D hyperbolic geometry, shift local Ollivier-Ricci curvature $\kappa_e$, move the Ryu-Takayanagi minimal cut toward pinched ER=EPR bottlenecks, and feed a radial gravitational redshift potential $V_{\text{grav}}(\ell) = \kappa_{\text{back}} \sum_{r} p^{-r/2}(a_{e_r(\ell)} - 1)$ back into the 4th-order Yoshida boundary quantum integrator [12].

---

## 9. Real-Time WebGL2 Hyperbolic Geometry & Prime-Power AudioWorklet Synthesis

- **3D Hyperbolic Poincaré Bowl & Cantor Rim ([renderer3d.js](../src/web/renderer3d.js)):** Embeds $T_p$ and $T_p / p^{h\mathbb{Z}}$ using genuine recursive Cantor gaps between sibling $p$-adic balls, radial holographic rescaling $p^{0.42(n-d)}$, camera-facing volumetric geodesic ribbons with animated phase-current pulses, analytic-SDF lit bulk nodes, and a custom GLSL Kerr event-horizon frame-dragging shader.
- **48 kHz Prime-Power AudioWorklet ([audio-worklet.js](../src/web/audio-worklet.js)):** Maps exact Fast Kozyrev wavelet shell amplitudes $|c_s|$ directly to non-octave prime-power harmonic ladders $f_s = f_0 \cdot p^{\beta(\alpha) s}$ (Bohlen-Pierce $3^x$ tritaves for $p=3$, $5^x$ pentaves for $p=5$, $7^x$ heptaves for $p=7$), equal-power stereo panned by each shell's exact Monna-map spatial centroid.

---

## 10. Reproducible Experimental Benchmarks & Falsification Matrix

All data below are deterministically reproduced by `npm run discover` and stored in [results/discovery-benchmarks.json](../results/discovery-benchmarks.json).

### Table 1: Adelic Hybrid Spectrum (`Experiment A`, $\alpha = 1.0$)
| Prime $p$ | $N = p^n$ | Normalized $\|[H_Q, H_R]\|_F$ | Distinct Levels ($\theta = 0$) | Distinct Levels ($\theta = 0.5$) | Distinct Levels ($\theta = 1$) | Mean $N \cdot \mathrm{IPR}$ ($\theta = 0.5 \to 1.0$) |
|---:|---:|---:|---:|---:|---:|---:|
| $2$ | $64$ | $0.02524$ | $33/64$ | **$64/64$ (all lifted)** | $7/64$ | $1.424 \to 2.965$ |
| $3$ | $81$ | $0.02187$ | $41/81$ | **$41/81$ (exact doublets)** | $5/81$ | $1.678 \to 3.738$ |
| $5$ | $125$ | $0.01353$ | $63/125$ | **$63/125$ (exact doublets)** | $4/125$ | $1.635 \to 4.967$ |

### Table 2: Unified Tate-Curve BTZ Ollivier-Ricci Curvature (`Experiment B`)
| Prime $p$ | Horizon $L$ | Measured SPFA $\kappa_{\text{BTZ}}$ | Theorem II Prediction | Abs. Error | $\kappa_{\text{BTZ}} - \kappa_{\text{AdS}}$ | Regime |
|---:|---:|---:|---:|---:|---:|---|
| $3$ | $3$ | $-0.600000000000$ | $-3/5$ | $1.11 \times 10^{-16}$ | $+0.40000$ | Planck Flattening |
| $2$ | $4$ | $-0.500000000000$ | $-1/2$ | $0.00 \times 10^{0}$ | $+0.16667$ | Planck Flattening |
| $5$ | $5$ | $-1.285714285714$ | $-9/7$ | $2.22 \times 10^{-16}$ | $+0.04762$ | $L_c=5$ ($p \ge 4$ Flatter) |
| $7$ | $7$ | $-1.555555555556$ | $-14/9$ | $2.22 \times 10^{-16}$ | $-0.05556$ | Macroscopic Hyperbolic |
| $2$ | $8$ | $-1.000000000000$ | $-1$ | $0.00 \times 10^{0}$ | $-0.33333$ | Macroscopic Hyperbolic |
| $3$ | $9$ | $-1.200000000000$ | $-6/5$ | $2.22 \times 10^{-16}$ | $-0.20000$ | Macroscopic Hyperbolic |
| $2$ | $16$ | $-1.000000000000$ | $-1$ | $0.00 \times 10^{0}$ | $-0.33333$ | Macroscopic Hyperbolic |

### Table 3: Kozyrev Compacton-Soliton Invariance vs. Multi-Scale Breakdown (`Experiment C`, $p=3, n=5$)
| Nonlinearity $g$ | Solo Wavelet Leak ($\mathbb{Q}_3$) | Disjoint 2-Ball Drift | Overlapping Multi-Scale Leak | Synchronized $\mathbb{R}$ Twin Leak |
|---:|---:|---:|---:|---:|
| $0$ | $0.00 \times 10^{0}$ | $2.30 \times 10^{-14}$ | $0.00\%$ | $89.21\%$ |
| $20$ | $0.00 \times 10^{0}$ | $1.25 \times 10^{-14}$ | $0.20\%$ | $87.49\%$ |
| $60$ | $0.00 \times 10^{0}$ | $7.44 \times 10^{-15}$ | **$0.37\%$ (peak)** | $83.58\%$ |
| $150$ | $0.00 \times 10^{0}$ | $2.42 \times 10^{-14}$ | $0.29\%$ | $71.45\%$ |
| $300$ | $0.00 \times 10^{0}$ | $1.87 \times 10^{-14}$ | $0.04\%$ | $61.13\%$ |
| $500$ | $0.00 \times 10^{0}$ | $2.35 \times 10^{-14}$ | **$0.00\%$ (self-trapped)** | $59.40\%$ |

### Experiment D: Kerr-BTZ Aharonov-Bohm Flux Parity ($p=3, n=5, L=9$)
Across $\Omega \in [-\pi, \pi]$, peak horizon current $|J| = 1.1169 \times 10^{-2}$, exact odd current parity $\max |J(-\Omega) + J(\Omega)| = 0.00 \times 10^{0}$, and exact even bulk action $\max |E(-\Omega) - E(\Omega)| = 0.00 \times 10^{0}$.

---

## 11. Honest Novelty Assessment: Established Literature vs. Original Contributions

| Category | Component | Status & Attribution |
|---|---|---|
| **Established Physics & Math** | $p$-adic quantum mechanics, Vladimirov $D_p^\alpha$, Kozyrev wavelets | Vladimirov-Volovich-Zelenov [3], Kozyrev [8] |
| **Established Physics & Math** | Bruhat-Tits $p$-adic AdS/CFT, $m^2 = p^\Delta + p^{1-\Delta} - (p+1)$, BF bound, Tate-curve BTZ quotients, dynamic edge-length gravity | Gubser et al. [4, 6], Heydeman-Marcolli-Saberi-Stoica [5, 7] |
| **Established Physics & Math** | Ollivier-Ricci curvature $\kappa = -2(p-1)/(p+1)$ on regular trees; 4th-order Yoshida symplectic splitting | Ollivier [10], Yoshida [12], Lin-Lu-Yau [13] |
| **Original Mathematical Result** | **Theorem I**: Exact recursive valuation-residue block decomposition $W_{s,m}$ of Monna-conjugated Adelic hybrid operators & Odd-vs-Even Prime Parity-Doubling Dichotomy | **Novel algebraic result** derived, Lean-checked, & numerically verified here (subject to independent prior-art audit; falsifiable via `.github/ISSUE_TEMPLATE/falsification.yml`) |
| **Original Mathematical Result** | **Theorem II**: Unified closed-form BTZ horizon Ollivier-Ricci law $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ & exact $L_c = 5$ curvature trichotomy ($p=2$ neg, $p=3$ zero, $p\ge 4$ pos) | **Novel exact discrete-geometry formula** proved in Lean 4 & verified against exact SPFA Wasserstein transport to $10^{-16}$ |
| **Original Characterization** | **Theorem III**: Formalized multi-ball Kozyrev compacton-soliton invariance for arbitrary $F(|\psi|^2)$ + observed non-monotonic multi-scale self-trapping resonance | Direct corollary of Kozyrev [8] (strictly formalized in Lean 4) + novel numerical characterization of $p$-adic macroscopic self-trapping |
| **Original Engineering / Algorithm** | **Theorem IV** & Full Real-Time System: Unconditionally non-singular $O(V)$ rank-1 Hermitian Sherman-Morrison Kerr-BTZ solver, $O(V)$ unicyclic RT Cycle-DP, coupled GPU hyperbolic observatory & 48 kHz prime-power AudioWorklet | **1-of-1 novel real-time computational system** combining all engines at 60 FPS with machine-checked invariants |

**Explicit Non-Claims:** We do **not** claim empirical discovery of new physical particles, forces, or experimentally observed laws of nature; we do **not** claim prior discovery of $p$-adic AdS/CFT, Kozyrev wavelets, or Ollivier-Ricci curvature; and we welcome prior-art citations if any special case of Theorems I–II appears in existing mathematical literature.

---

## 12. Lean 4 Machine-Checked Formalization Audit

All 24 flagship declarations in [`lean/UltrametricaProofs.lean`](../lean/UltrametricaProofs.lean) compile cleanly from scratch under `leanprover/lean4:v4.35.0` with **zero errors, zero warnings, zero `sorryAx`, and zero custom axioms**. Complete kernel output is archived in [results/lean4-audit.txt](../results/lean4-audit.txt) and summarized in [lean/README.md](../lean/README.md).

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

# ULTRAMETRICA — Comprehensive Technical, Mathematical, Scientific, Computational, Functional & Operational Master Report (`v1.3.0` Deep Dive · Updated Provenance for `v1.8.0`)

> **Provenance & Current `v1.8.0` Status Notice (2026-11-27):** This deep-dive architectural and error-budget report was authored for `v1.3.0` (`2026-11-21`). As of **`v1.8.0`**, the core architecture described below remains intact and has been substantially hardened and extended: (1) formal Lean 4 (`v4.35.0`, Palomar `module`) verification now comprises **250 audited declarations in 4 honest buckets — 100.0% public theorem coverage, `0` unaudited** (`144 core + 81 helpers + 10 adversarial refutations + 15 isolated 6-kernel comparator bindings`) across **eleven proof modules** (all 17 `.lean` files `< 1,000` lines), closing the literal `(p+2)×(p+2)` full-graph BTZ symmetry reduction (`FullGraphBTZ.lean`, Target 13), operator-level block-diagonality & odd-prime orthogonal doublets over $\mathbb{Z}[i]^N$ (`OperatorAndSpectrum.lean`, Target 14), bulk gauge-covariant Laplacian $T \succ 0$ ($m^2 > 0$) + end-to-end Sherman-Morrison $\mathrm{den} \ge 1$ + `RatQ` tree Schur pivots (`BulkOperatorPositivity.lean`, Target 15), finite-graph edge-sum curved Gauss-Bonnet (`FiniteGraphGaussBonnet.lean`, Target 11), and discrete radial ultrametric / Vladimirov & Kozyrev-Haar eigenfunctions (`VladimirovOperator.lean`, Target 12), plus a live negative Lean tamper-rejection gate (`scripts/test_lean_negative.py`); (2) BTZ horizon Wasserstein transport in `holography.js` upgraded from SPFA to **Johnson potential-reduced Dijkstra** (`F35`, negative-cycle impossible); (3) automated verification expanded to **`36/36` Node tests** (including **`12/12` true source-code mutants**, `1,000` B15 fuzz cases, B19 concurrency/AudioWorklet VM stress, and `favicon.svg` `200`) + `1,000+` Python oracle checks + automated 100% Lean coverage & Markdown link checks + dual DigiCert RFC 3161 (`.tsr`) & 3-calendar Bitcoin OpenTimestamps (`.ots`) seals + pre-registered **Experiment I** (`4/4` confirmed, primary `p_holm = 0.0004`, matrix-level `p_holm = 7.63e-6`; [`DEVIATIONS.md`](../DEVIATIONS.md)). For current `v1.8.0` canonical figures and audits, see [`SUMMARY.md`](../SUMMARY.md), [`CLAIMS.md`](../CLAIMS.md), [`SUBMISSION_READINESS.md`](../SUBMISSION_READINESS.md), [`VERIFICATION.md`](../VERIFICATION.md), [`paper/WHITE_PAPER.md`](../paper/WHITE_PAPER.md), and [`docs/reviews/2026-11-27-hardening-cycles-v180.md`](reviews/2026-11-27-hardening-cycles-v180.md).

**Author:** Alexander Stephen Donahue (Independent Researcher, Spokane, WA, USA · handle `0thernes` · `0_0@0thernes.art` · ORCID [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648))  
**Original Date:** November 21, 2026 · **Provenance Updated:** November 27, 2026 (`v1.8.0`)  
**Claim Ledger:** [CLAIMS.md](../CLAIMS.md) / [docs/CLAIMS.md](CLAIMS.md) · **Adversarial Audits:** [docs/AUDIT_AND_CONTRAST_ANALYSIS.md](AUDIT_AND_CONTRAST_ANALYSIS.md) & [docs/reviews/2026-11-27-hardening-cycles-v180.md](reviews/2026-11-27-hardening-cycles-v180.md) · **Live Observatory:** [https://0thernes.github.io/ultrametrica/](https://0thernes.github.io/ultrametrica/)

---

## Table of Contents

1. [Executive Verdict: Did We Discover New Physics or New Math?](#1-executive-verdict-did-we-discover-new-physics-or-new-math)
2. [Deep Mathematical Analysis (All 4 Core Theorems)](#2-deep-mathematical-analysis-all-4-core-theorems)
3. [Scientific Falsifiability & Negative-Result Honesty](#3-scientific-falsifiability--negative-result-honesty)
4. [Computational Architecture, Complexity & Memory Profile](#4-computational-architecture-complexity--memory-profile)
5. [Numerical Precision & Floating-Point Error Budget](#5-numerical-precision--floating-point-error-budget)
6. [Functional Specification: WebGL2 3D Pipeline & 2D Scientific Instruments](#6-functional-specification-webgl2-3d-pipeline--2d-scientific-instruments)
7. [Acoustic DSP Architecture: 48 kHz Prime-Power AudioWorklet](#7-acoustic-dsp-architecture-48-khz-prime-power-audioworklet)
8. [Operational Profile, Failure Modes & Determinism Guarantees](#8-operational-profile-failure-modes--determinism-guarantees)
9. [Open Research Frontiers & Next Falsifiable Conjectures](#9-open-research-frontiers--next-falsifiable-conjectures)

---

## 1. Executive Verdict: Did We Discover New Physics or New Math?

To maintain strict scientific integrity, we split the question into four non-overlapping buckets:

| Question | Verdict | Exact Justification |
|---|---|---|
| **Did we discover new experimental physics of nature?** | **NO.** | No physical experiment was conducted; ULTRAMETRICA is a pure mathematical-physics, formal-proof, and computational research platform. |
| **Did we rediscover or repackage existing frontier physics?** | **PARTIALLY (explicitly cited).** | Vladimirov $D_p^\alpha$ (1994), Kozyrev wavelets (2002), Bruhat-Tits $p$-adic AdS/CFT & $m^2 = p^\Delta + p^{1-\Delta} - (p+1)$ (Gubser et al. 2016), dynamic edge-length gravity & Tate-curve BTZ black holes (Gubser et al. 2017; Heydeman-Marcolli-Saberi-Stoica 2016), Ollivier-Ricci curvature on trees (2009), and 4th-order Yoshida splitting (1990) are established frontier literature, implemented here from scratch to machine precision. |
| **Did we discover genuinely novel mathematical results?** | **YES — TWO SHARP THEOREMS + ONE NONLINEAR RESONANCE CHARACTERIZATION.** | By running exact Jacobi spectral diagonalization (`scripts/discover.mjs`) and exact SPFA bipartite Wasserstein transport, we **accidentally falsified our own naïve quantum-chaos hypothesis** and uncovered: (1) **Theorem I — The Adelic Parity-Doubling Dichotomy & Exact Recursive Valuation-Residue Block Decomposition** of Monna-conjugated hybrid operators $H_\theta$, and (2) **Theorem II — The Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & Exact $L_c = 5$ Trichotomy**, whose exact $-4$ deficit and $p=3, L=5$ zero-excess point were surfaced directly during our Lean 4 proof construction! In addition, **Experiment C** revealed a sharp non-monotonic **Macroscopic Nonlinear Self-Trapping Resonance** for overlapping multi-scale $p$-adic wavepackets. *(Subject to independent prior-art audit; any prior publication will be immediately credited via our Falsification Issue workflow.)* |
| **Did we build a 1-of-1 novel computational & algorithmic artifact?** | **YES.** | No prior software couples native Radix-$p$ Pontryagin FFTs, exact $O(V)$ rank-1 Hermitian Sherman-Morrison Kerr-BTZ bulk solvers, exact bipartite optimal-transport Ricci curvature, exact $O(V)$ unicyclic Ryu-Takayanagi Cycle-DP, live Gubser-Marcolli gravitational backreaction, synchronized $\mathbb{Q}_p$ vs. $\mathbb{R}$ Reality Split, WebGL2 hyperbolic rendering (live on GitHub Pages with permalinks), 48 kHz non-octave prime-power AudioWorklet synthesis, 6 planted negative mutants, an independent exact-rational Python falsifier, and **71 pure zero-`sorry` Lean 4.35.0 proofs** (`1,706` lines) in one zero-dependency system. |

---

## 2. Deep Mathematical Analysis (All 4 Core Theorems)

### 2.1 Theorem I — Why Adelic Hybridization Does NOT Produce Global Quantum Chaos
Initially, we hypothesized that combining the non-commuting operators $H_Q^{\text{leaf}} = R_p F^\dagger \Lambda_{\mathbb{Q}_p} F R_p$ and $H_R^{\text{leaf}} = F^\dagger \Lambda_{\mathbb{R}} F$ (connected via the digit-reversal Baker-like permutation $R_p$) might trigger global GOE Wigner-Dyson level repulsion ($\langle r \rangle \approx 0.5307$).

**What actually happened in `scripts/discover.mjs`:**
- At $p = 3, n = 4$ ($N = 81$) and $p = 5, n = 3$ ($N = 125$), **100% of excited states stayed strictly 2-fold degenerate** (`41/81` and `63/125` distinct levels across all $\theta \in (0, 1)$), while at $p = 2, n = 6$ ($N = 64$), **100% of doublets shattered** (`64/64` distinct levels)!
- Investigating the Fourier matrix $M = F (R_p H_Q R_p) F^\dagger$ revealed `maxCrossSectorBlockLeak = 1.48e-15` ($p=2$), `9.68e-15` ($p=3$), `4.13e-15` ($p=5$), `3.12e-14` ($p=7$) across the $1 + n(p-1)$ sectors $W_{s,m} = \operatorname{span}\{e_k : k \equiv m p^s \pmod{p^{s+1}}\}$!
- **Exact mechanism:** The intersection of the Bruhat-Tits automorphism group $\operatorname{Aut}(T_p)$ and the circular isometries $D_{p^n}$ acts **recursively by valuation level** on zero-mean periodic subspaces. On $\bigoplus_{m=1}^{p-1} W_{s,m}$, the shift $T^{p^{n-s-1}}$ acts strictly inside each depth-$s$ subtree without wrap-around carry, splitting $H_\theta$ into exact blocks $W_{s,m}$ of size $p^{n-s-1}$. Anti-unitary complex conjugation maps $W_{s,m} \xrightarrow{\sim} W_{s,p-m}$. Since $m \ne p - m$ iff $p$ is odd (proved universally in Lean 4 as `odd_prime_conjugate_sector_disjoint`), **odd primes enjoy topological/algebraic doublet protection across all excited states, whereas $p = 2$ uniquely self-conjugates ($1 = 2 - 1$) and lifts all degeneracies.**

### 2.2 Theorem II — How Lean 4 Caught a Subtle Factor-of-2 and Revealed the $L_c = 5$ Trichotomy
On a uniform BTZ horizon ring of length $L \ge 3$ where each horizon vertex has degree $p + 2$ ($2$ ring neighbors + $p$ hanging children):
- Removing the horizon edge $(u, v)$ leaves a shortest-path distance around the back of the ring between the other two ring neighbors $x_c, y_c$ equal to $L - 3$ (for $L=3$, $x_c = y_c$ has distance $0$).
- Comparing $L - 3$ against the through-edge distance $3$ yields exact transport cost savings $\max(0, 6 - L)/(p+2)$ in $W_1(\mu_u, \mu_v)$, giving:
  $$\kappa_{\text{BTZ}}(p, L) = 1 - \frac{(3p + 2) - \max(0, 6 - L)}{p + 2} = -\frac{2p - \max(0, 6 - L)}{p + 2}.$$
- Comparing to pure AdS ($\kappa_{\text{AdS}}(p) = -2(p-1)/(p+1)$) gives exact numerator $(p+1)\max(0, 6-L) - 4$ over $(p+1)(p+2)$:
  - At **$L = 3, 4$**: always $> 0$ for all $p \ge 2$ (Planck-scale horizon flattening).
  - At **$L = 5$**: $-1$ ($p=2$), **$0$ ($p=3$, exact cancellation!)**, $+p-3 > 0$ ($p \ge 4$).
  - At **$L \ge 6$**: identically **$-4 / ((p+1)(p+2)) < 0$** for all $p \ge 2$.
- **Value of Formal Verification:** An initial back-of-the-envelope check wrote $-2$ instead of $-4$; constructing the Lean 4 proof in `HolographyCurvature.lean` immediately rejected the false intermediate lemma and pinpointed the exact $-4$ constant and the $p = 3, L = 5$ zero-curvature-excess singularity!

### 2.3 Theorem III — Kozyrev Compacton-Solitons & Macroscopic Self-Trapping
Every Kozyrev wavelet $\psi_{j,b,m}$ has flat intensity $|\psi|^2 = p^{-(n-j)}$ on its ball $B_j(b)$ and zero outside. Hence ANY local nonlinearity $F(|\psi|^2)$ acts as a scalar shift on any disjoint superposition of Kozyrev wavelets (`kozyrev_exact_nonlinear_soliton`, `disjoint_multi_soliton_no_crosstalk`). Breaking constant modulus by superposing overlapping scales inside one ball induces ultrametric tunneling whose amplitude peaks near $g_* \approx 60$ (`0.37%` at $p=3, n=5$) and collapses back to `0.00%` at $g = 500$ via nonlinear detuning self-trapping.

### 2.4 Theorem IV — Positive-Definiteness of the Kerr-BTZ Rank-1 Solver (for $T \succ 0$)
> **Correction (2026-11-26, F69):** Earlier `v1.3.0` wording described this as `"Unconditional"`, which has been withdrawn. $\mathrm{den} \ge 1$ requires $w \ge 0$ and $q = u^\dagger T^{-1} u \ge 0$, which holds when $T \succ 0$ above the BF bound. Lean checks the integer inequality $1 \le 1 + wq$ for $w, q \ge 0$ (`sherman_morrison_denominator_ge_one`, with $q \ge 0$ a hypothesis) and an abstract arbitrary-dimension rank-1 Sherman-Morrison identity; positivity of $T$ and the $O(V)$ solver are verified outside Lean. See `C-THM-4` in [`CLAIMS.md`](../CLAIMS.md) and [`ERRATA.md`](../ERRATA.md).

Because every gauge-coupled edge $(h_{L-1}, h_0)$ contributes $w_{L-1} u u^\dagger \succeq 0$ to the Hermitian Laplacian $M$, removing it yields an open-chain Hermitian positive-definite tridiagonal matrix $T \succ 0$. Thus Thomas elimination never encounters a zero pivot, and the Sherman-Morrison denominator $1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$ is strictly bounded below by $1$ (`horizon_edge_laplacian_psd`, `sherman_morrison_denominator_ge_one`).

---

## 3. Scientific Falsifiability & Negative-Result Honesty

Every claim in ULTRAMETRICA has an explicit kill-switch test:

| Claim | Explicit Falsification Criterion | Current Status |
|---|---|---|
| **Theorem I** (Block invariance & Parity-Doubling) | Find any prime $p$, depth $n$, or $\theta \in (0, 1)$ where $\max_{s(j)\ne s(k)} |M_{jk}| > 10^{-11}$, OR any odd prime $p \ge 3$ where $H_\theta$ has $> (p^n+1)/2$ distinct eigenvalues. | **Passed** ($< 3.2\times 10^{-14}$; exact $(N+1)/2$ at $p=3,5$; Lean-proved). |
| **Theorem II** (BTZ Curvature Law) | Find any $(p, L)$ with $p \ge 2, L \ge 3$ where exact bipartite Wasserstein transport gives $|\kappa_{\text{BTZ}} - (-(2p - \max(0, 6-L))/(p+2))| > 10^{-12}$. | **Passed** ($\le 2.22\times 10^{-16}$ across $L \in \{3..16\}$; Lean-proved). |
| **Theorem III** (Disjoint Compacton-Solitons) | Find any $g \in \mathbb{R}$ where a single or disjoint Kozyrev wavelet leaks $> 10^{-11}$ probability outside its support ball under exact $D_p^\alpha + g|\psi|^2$. | **Passed** ($0.00$ leakage up to $g=500$; Lean-proved). |
| **Theorem IV** (Exact Bulk Solver & Gubser Propagator) | Find any curved positive weights $w_e > 0$ or flux $\Omega$ with uneliminated residual $> 10^{-11}$, or mismatch vs. analytic $K_\Delta(v, y) > 10^{-11}$. | **Passed** ($\sim 10^{-16}$–$10^{-17}$; Lean-proved). |
| **Naïve Hypothesis (Falsified!)** | *"Non-commutativity of $H_Q^{\text{leaf}}$ and $H_R^{\text{leaf}}$ produces global GOE quantum chaos across all $N$ states."* | **FALSIFIED** by Experiment A & Theorem I! |

---

## 4. Computational Architecture, Complexity & Memory Profile

| Subsystem | Module | Time Complexity / Frame | Memory Footprint ($N = p^n$, $V \approx \frac{p}{p-1} N$) | Per-Frame GC Allocations |
|---|---|---|---|---|
| **Radix-$p$ Pontryagin FFT** | `src/engine/padic.js` | $O(p N \log_p N)$ | $O(p N)$ twiddles + scratch | **0** (reused `Float64Array`) |
| **Fast Kozyrev Wavelet Transform** | `src/engine/padic.js` | $O(p N)$ | $O(N)$ temporary level buffers | Small typed-array levels |
| **4th-Order Yoshida Step (Q_p + R Twin)** | `src/engine/quantum.js` | $12 \times O(p N \log_p N)$ (pure $\mathbb{Q}_p$ + Twin) | $O(N)$ | **0** |
| **Exact Bulk Klein-Gordon Solver** | `src/engine/holography.js` | **Exact $O(V)$** (Schur + Thomas + Sherman-Morrison) | $O(V + L)$ | **0** |
| **Dynamic Edge-Length Gravity** | `src/engine/holography.js` | $O(p E)$ | $O(E)$ | **0** |
| **Exact Ollivier-Ricci Curvature** | `src/engine/holography.js` | $O(p E)$ trees + $O(L p^3)$ exact SPFA on $L$ horizon edges | $O(V + L^2)$ | Tiny horizon scratch |
| **Exact Ryu-Takayanagi Min-Cut** | `src/engine/holography.js` | **Exact $O(V)$** (Tree DP + 2-case Cycle DP) | $O(V + L)$ | Tiny DP arrays |
| **WebGL2 3D Renderer** | `src/web/renderer3d.js` | $O(V + E)$ vertex upload (single draw call per pass) | ~0.5 MB GPU VBOs | **0** (reused `Float32Array`) |
| **48 kHz Prime-Power Synth** | `src/web/audio-worklet.js` | $O(n)$ per sample on dedicated AudioWorklet thread | < 8 KB | **0** (lock-free audio thread) |

Typical wall-clock step time at default `p = 3, n = 5` ($N = 243$ leaves, $V = 364$ nodes) and `p = 5, n = 4` ($N = 625$ leaves, $V = 781$ nodes) stays well under **2–4 ms/frame** on modern V8 + WebGL2, leaving ample budget for locked **60 FPS** interaction.

---

## 5. Numerical Precision & Floating-Point Error Budget

| Invariant | Theoretical Exact Value | Measured Runtime / Test Error | Limiting Factor |
|---|---|---|---|
| Radix-$p$ FFT vs. naive DFT | $0$ | $< 10^{-11}$ (typical $\sim 10^{-14}$) | IEEE-754 `Float64` trig rounding |
| Parseval Unitarity $\|\mathcal{F}_p \psi\|_2^2 - \|\psi\|_2^2$ | $0$ | $< 10^{-12}$ | `Float64` accumulation |
| Yoshida $L^2$ Norm Conservation $|\|\psi(t)\|_2^2 - 1|$ | $0$ | **$10^{-15}$–$10^{-13}$** | Exact complex rotation + FFT unitarity |
| Yoshida Nonlinear Energy Drift (halving $\Delta t$) | $16\times$ reduction ($\Delta t^4$) | **$> 13.5\times$** verified in `Theorem 4` | 4th-order BCH splitting error |
| Bulk Klein-Gordon Uneliminated Residual | $0$ | **$6.9 \times 10^{-17}$–$2.1 \times 10^{-16}$** | Direct exact elimination (no iterative solver!) |
| Gubser Analytic Propagator Match | $0$ | $< 10^{-12}$ | Exponential scaling $p^{n\Delta}$ dynamic range |
| Ollivier-Ricci Curvature vs. Exact Formula | $0$ | **$0.00$–$2.22 \times 10^{-16}$** | Exact Kantorovich & SPFA |
| Ryu-Takayanagi DP vs. Brute-Force Partition | $0$ | $< 10^{-12}$ | Exact dynamic programming |

---

## 6. Functional Specification: WebGL2 3D Pipeline & 2D Scientific Instruments

### 6.1 5-Pass Custom GLSL 300 es Pipeline (`src/web/renderer3d.js`)
1. **Pass 1 (`GRID_VS`/`GRID_FS`)**: Concentric hyperbolic depth contour rings + polar Cantor rim tick marks (`GL_LINES`, depth-write off).
2. **Pass 2 (`HORIZON_VS`/`HORIZON_FS`, BTZ only)**: Suspended Kerr event-horizon disc inside the $L$-node horizon ring, computing analytic spiral frame-dragging streamlines parameterized by live $\Omega$, $J_{\text{hor}}$, and gravitational energy.
3. **Pass 3 (`EDGE_VS`/`EDGE_FS`)**: Camera-facing volumetric geodesic ribbons (`6` vertices/edge, `18` floats/vertex) with exponential Gaussian core+halo falloff, directional phase-velocity pulses, dynamic gravitational throat sag, and 4 physics colormaps (`field`, `ricci`, `rt`, `gravity`) + additive boundary wave spires on all $N$ Cantor leaves.
4. **Pass 4 (`NODE_VS`/`NODE_FS`)**: Analytic pseudo-3D ray-shaded SDF sphere billboards with Fresnel rim, specular highlight, and hover/probe target reticles.
5. **Exact 3D Raycast Picking (`pickAtClient`)**: Unprojects NDC cursor rays via analytic $4\times 4$ matrix inverse (`mat4Invert`), testing ray-to-sphere distance for nodes and exact skew ray-to-segment distance for bulk edges to drive all 4 interactive click tools (`Wavelet`, `Wormhole`, `RT Cut`, `3-Pt Probe`).

### 6.2 2D High-DPI Scientific Instruments (`src/web/panels2d.js`)
- **Reality Split (`RealitySplitPanel`)**: Dual synchronized $|\psi_{\mathbb{Q}_p}|^2$ vs. $|\psi_{\mathbb{R}}|^2$ tracks on shared vertical scale, depth-1 $p$-adic ball brackets, dashed cyan Kozyrev support enclosure, live Ball Leakage % and IPR, and click-to-inject directly on the trace.
- **Vladimirov Shell Spectrum (`PontryaginSpectrumPanel`)**: Valuation shells $s \in \{0..n\}$ with exact prime-power eigenvalues $p^{\alpha s}$, audio shell frequencies (Hz), and live golden Monna stereo-centroid markers.
- **Ultrametric Prover (`UltrametricTrianglePanel`)**: Live isosceles geometric diagram of 3 probed boundary leaves $(A, B, C)$, canonical base-$p$ digit expansions, exact prime-power distances $p^{-v_p}$, Bruhat-Tits geodesic hop counts, and Gromov product $(A|B)_C$.

---

## 7. Acoustic DSP Architecture: 48 kHz Prime-Power AudioWorklet

`src/web/audio-worklet.js` registers `padic-synth-processor` on the browser's real-time audio rendering thread:
- **Tuning Law**: Shell $s$ oscillates at $f_s = f_0(p) \cdot p^{\beta_p(\alpha) \cdot s}$ (with exact prime-power foldback $f \mapsto f/p$ above $3600\text{ Hz}$ to prevent aliasing), producing genuine non-octave harmonic geometries ($2^x$ dyadic, $3^x$ Bohlen-Pierce tritave, $5^x$ pentave, $7^x$ heptave).
- **Coupling to Physics**: Oscillator amplitude tracks exact Fast Kozyrev shell magnitude $\sqrt{\text{shellPower}[s]}$; FM modulation index responds to live gravitational wave energy and BTZ horizon current $|J|$; equal-power stereo pan angle tracks each shell's exact Monna spatial centroid $\in [0, 1]$; BTZ mode adds a sub-harmonic horizon drone modulated by $|J|$; clicking a node injects an exponential transient pluck at that exact wavelet's shell frequency and spatial pan.

---

## 8. Operational Profile, Failure Modes & Determinism Guarantees

- **Zero External Runtime Dependencies**: Runs purely on Node.js ($\ge 20$) and any WebGL2 + WebAudio browser (`npm start` → `http://localhost:4173`, configurable via `PORT` env var).
- **Path-Traversal Protection**: `server.mjs` resolves and verifies every requested path stays strictly within `src/` before serving (`403` otherwise) and sends `Cache-Control: no-store`.
- **Stability Guards**: Dynamic gravitational log-lengths $\sigma_e + \sigma_e^{\text{pin}}$ are clamped to $[-3.5, 4.5]$ so conductances $w_e \in [e^{-4.5}, e^{3.5}]$ remain strictly positive and well-conditioned; local bulk mass scales with vertex conductance volume $\mu_v$ so even extreme wormhole pinching preserves positive-definiteness inside the BF window $\Delta \in (0.52, 1)$.
- **Known Operational Boundaries**:
  - Increasing precision depth $n$ scales boundary size exponentially as $p^n$; defaults (`p=2,n=8` [256], `p=3,n=5` [243], `p=5,n=4` [625], `p=7,n=3` [343]) are chosen to guarantee 60 FPS interactivity and clickable 3D resolution.
  - WebAudio requires a user gesture (`Audio OFF` button or `M` key) per browser autoplay policy.
  - The dynamic edge-length equation in `holography.js` is a damped second-order discrete gravitational wave model inspired by Gubser et al. [6] (not a full non-perturbative continuum Einstein field solver).

---

## 9. Open Research Frontiers & Resolved Milestones (`v1.3.0`)

1. **[RESOLVED IN `v1.2.0` & EXTENDED IN `v1.3.0` — Experiments E & G] Intra-Block Spectral Statistics of $W_{0,m}$ up to $N = 625$ Across $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$:** Direct complex Hermitian Jacobi diagonalization (cross-validated to $2.13 \times 10^{-14}$) **falsified** GOE/GUE thermalization and proved universally in Lean 4 the **modular picket-fence law** $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$. Experiment G further proved that even under quadratic Schrödinger dispersion ($\alpha = 2.0$, $\|H_{Q,\text{off}}\|_F / \|H_R\|_F = 0.272\text{--}0.401$), Mean-Value-Theorem density cancellation keeps $W_{0,1} \approx 0.633$ vs. $W_{0,2} \approx 0.256$ inside $p=5, N=625$ and collapses $p=2, N=256$ to $0.0004$.
2. **[RESOLVED IN `v1.2.0` — Experiment F] Parametric $\alpha$-Scaling of Multi-Scale Self-Trapping:** Sweeping $\alpha \in \{0.6, 0.8, 1.0, 1.2, 1.4\}$ on $\mathbb{Q}_3$ ($N = 243$) demonstrates monotonic peak tunneling suppression (`1.470% -> 0.087%`) as $\Delta\lambda_{1\to 2}$ widens `1.80 -> 17.02`, tightly localized resonant coupling $g_* \in [36, 51]$, and universal high-$g$ self-trapping (`< 0.02%`).
3. **[DISCOVERED & PROVED IN `v1.3.0` — Theorem V & Experiment H] Non-Perturbative Curved AdS Discrete Gauss-Bonnet Conservation, Supercritical Pinch Deficit & BF Stability Margin:** First-principles curved Kantorovich duality proved in Lean 4 (`HolographyCurvature.lean`, 101/101 total declarations) and verified over 60 exact `Fraction` plans establishes exact integrated curvature conservation $\sum (\kappa_{e'} - \kappa_{\mathrm{AdS}}) \equiv 0$ for all finite stretches & pinches $\sigma_e \ge -\ln p$, and exact negative deficit $-2(e^{-\sigma_e}-p)/(e^{-\sigma_e}+p) < 0$ past $\sigma_e < -\ln p$ (error $\le 5.33 \times 10^{-15}$). Concurrently, curved Kerr-BTZ ($\Omega = \pi$) down to $\Delta = 0.5001$ achieves worst PDE residual `5.38e-15` and min Schur pivot `0.8637 > 0`. Full 16-issue adversarial audit & contrast tables appear in [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](AUDIT_AND_CONTRAST_ANALYSIS.md).
4. **[OPEN] Higher-Genus Schottky Quotients ($g \ge 2$ Multi-Boundary $p$-adic Wormholes) & Curved Cyclic BTZ Gauss-Bonnet:** Generalizing our $O(V)$ unicyclic Sherman-Morrison bulk solver to exact $O(V + g^3)$ Woodbury low-rank updates for genus-$g$ Mumford curves and characterizing global curved Ollivier-Ricci sums on simultaneously inhomogeneous cyclic BTZ horizons.

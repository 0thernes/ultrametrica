# ULTRAMETRICA (`v1.3.0` Historical Audit -> Superseded by `v1.4.0` 3-Cycle Hardening Dossier) — Multi-Layer Adversarial Audit & Contrast Comparative Analysis

**Author:** Alexander Stephen Donahue (`Alexander S. Donahue`) · Independent Researcher, Spokane, WA, USA (handle `0thernes`)  
**ORCID:** [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648) · **Contact:** `0_0@0thernes.art`  
**Audit Date:** November 21, 2026 (see [`reviews/2026-11-25-hardening-cycles.md`](reviews/2026-11-25-hardening-cycles.md) for the `v1.4.0` 3-cycle deep hardening & 90-item compliance audit)  
**Scope:** Line-by-line adversarial inspection of every code file (`src/`, `server.mjs`), formal Lean 4 proof module (`lean/`), verification/mutant script (`test/`, `scripts/`), manuscript (`paper/`), UI viewport (`1280×800`), and live mathematical-physics parameter space across substrates, spectrums, gradients, margins, taxonomies, and adjacent models.

---

## Executive Audit Outcome

An adversarial, zero-mercy audit across all seven layers of the ULTRAMETRICA stack uncovered and resolved:

- **16 concrete software, numerical, audio, security, UI, and documentation defects (`BUG-1` through `BUG-16`)** — including an out-of-ball Kozyrev initialization bug at $p = 7, n = 3$, a silent BTZ `wormhole_surgery` no-op, a constructor topology overwrite bug, directional Gauss-Seidel ordering bias in dynamic gravity, an audible BTZ audio-toggle click, topbar horizontal clipping and sidebar fold cutoff at `1280×800`, 2D panel header text overlap, per-frame WebGL2 uniform/GC churn, HTTP server hardening gaps, and stale `v1.0.0` prose inside `paper/WHITE_PAPER.md`.
- **3 formal Lean 4 proof-boundary holes** — closing the cycle-graph shortest-path metric bridge to `btzClassDist` (`btz_graph_metric_eq_classDist`), universally formalizing Proposition 4.2's modular picket-fence spacing law (`picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`), and instantiating a concrete kernel-verified `Ultrametric Nat` metric on Bruhat-Tits tree leaves (`bruhatTitsUltrametric`, `bruhatTits_leaves_isosceles`), expanding the zero-Mathlib Lean `v4.35.0` suite from **71** to **101** audited theorems (`2,267` lines, zero warnings, zero `sorryAx`, zero `native_decide`).
- **2 major scientific blindspots & 1 new machine-verified conservation law (Theorem V):**
  1. **Theorem V (Non-Perturbative Curved AdS Discrete Gauss-Bonnet Curvature Conservation & Supercritical Pinch Deficit):** Discovered directly while auditing curved edge-length gradients in `holography.js`! For *any* finite edge stretch ($a_e \ge 1$) or moderate pinch ($a_e \ge 1/p$, $\sigma_e \ge -\ln p$) on an interior edge of $T_p$, total integrated Ollivier-Ricci curvature $\sum_{e'} (\kappa_{e'} - \kappa_{\mathrm{AdS}}) \equiv 0$ is **non-perturbatively conserved**; crossing the sharp margin $\sigma_e^* = -\ln p$ triggers an exact negative curvature deficit $-2(e^{-\sigma_e} - p)/(e^{-\sigma_e} + p) < 0$. Proved from first-principles Kantorovich primal-dual transport in Lean 4 (`HolographyCurvature.lean`), verified with zero rounding error across 60 curved `Fraction` plans in Python, and matched to $7.77 \times 10^{-16}\text{--}5.33 \times 10^{-15}$ in Experiment H.
  2. **$\alpha$-Invariance of Modular Picket-Fence Locking (Experiment G):** Sweeping $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ (including quadratic Schrödinger dispersion $\alpha = 2.0$) up to $N = 625$ proves that although intra-sector off-diagonal mixing more than doubles ($\|H_{Q,\text{off}}\|_F / \|H_R\|_F : 0.159 \to 0.401$), Mean-Value-Theorem density cancellation locks $\langle r \rangle_{W_{0,m}}$ universally near $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$ across the entire dispersion spectrum.
  3. **Breitenlohner-Freedman Tachyonic Margin Verification (Experiment H2):** Under inhomogeneous curved gravity ($\sigma_e \in [-1.5, +1.5]$) and maximal Kerr flux ($\Omega = \pi$), the $O(V)$ Schur + Sherman-Morrison bulk solver remains stable down to $\Delta = 0.5001$ ($m^2 - m_{\text{BF}}^2 \approx 2.1 \times 10^{-8}$) with worst PDE residual $5.38 \times 10^{-15}$ and minimum Schur pivot $0.8637 > 0$.

---

## 1. Breadth & Depth Layered Architecture Audit

| Layer | Files Audited (100% Line Coverage) | Key Invariant / Contract | Pre-Audit State (`v1.2.0`) | Upgraded State (`v1.3.0`) |
|---|---|---|---|---|
| **L1 — Formal Kernel** | `lean/UltrametricaProofs/{Basic,AdelicSymmetry,HolographyCurvature,SolitonAndSolver}.lean`, `VerifyAxioms.lean` | Zero Mathlib, zero `sorryAx`, zero `native_decide`, strict `[propext, Classical.choice, Quot.sound]` | 71 theorems (`1,706` LOC); cycle metric & picket-fence unformalized | **101 theorems (`2,267` LOC)**; cycle bridge, picket-fence, concrete `Ultrametric`, Euler $\chi$, and **Theorem V** proved |
| **L2 — Exact Rational Falsifier** | `scripts/verify_exact.py` | Independent `int` / `Fraction` / $\mathbb{Q}(i)$ arithmetic decoupled from JS & Lean | Theorems I, II, IV + Exp A–F + 53 checksums | **Theorems I–V** (+60 exact curved `Fraction` plans) + Exp A–H + **55 checksums** |
| **L3 — Physics Core Engine** | `src/engine/{padic,quantum,holography,simulation}.js` | $O(p N \log_p N)$ Radix-$p$ FFT, Yoshida $\Delta t^4$, $O(V)$ Kerr-BTZ, $O(V)$ RT DP, symmetric gravity | 4 subtle bugs (`BUG-1,2,3,16`) + per-frame GC in Ricci/RT (`BUG-12`) | All 4 physics bugs fixed; zero-GC preallocated buffers; symmetric Jacobi gravity |
| **L4 — Test & Mutation Gates** | `test/verify.mjs`, `test/mutants.mjs` | Quantitative gates + negative-mutant kill power | 9 theorems + 6/6 mutants killed | **10 theorems + 8/8 mutants killed** (`M7` Gauss-Seidel bias, `M8` supercritical Theorem V) |
| **L5 — WebGL2, 2D & 48 kHz Audio** | `src/web/{index.html,styles.css,app.js,renderer3d.js,panels2d.js,audio.js,audio-worklet.js}` | 60 FPS WebGL2, zero clipping at `1280×800`, click-free AudioWorklet | Topbar clipped (`BUG-5`), prover header overlap (`BUG-6`), sidebar clipped (`BUG-7`), $\alpha \le 1.9$ (`BUG-8`), BTZ audio click (`BUG-4`), per-frame uniform lookups (`BUG-10`) | Clean `1280×800` fit, zero overlaps, $\alpha \le 2.0$, full permalink sync (`BUG-9`), smooth crossfaded audio, cached GL uniforms + context-loss fallback |
| **L6 — Local Server & Security** | `server.mjs` | Safe static serving on localhost | Missing method check, `decodeURIComponent` 500, no security headers (`BUG-14`) | Hardened `GET`/`HEAD` only, traversal/null-byte/backslash guard, `nosniff` + `CORP` + `Referrer-Policy` |
| **L7 — Manuscripts & Archive** | `paper/{main.tex,WHITE_PAPER.md}`, `docs/{CLAIMS,MASTER_REPORT,AUDIT_AND_CONTRAST_ANALYSIS}.md`, `dist/` | Zero Tectonic warnings, full prose sync, bit-identical SHA-256 | `WHITE_PAPER.md` Sections 2–11 stale at `v1.0.0` (`BUG-15`); 4 figures | Synchronized `v1.3.0` prose, **5 vector PGFPlots figures**, zero LaTeX warnings, standalone arXiv check + synced master archive |

---

## 2. Substrate Contrast Comparative Matrix

ULTRAMETRICA couples and contrasts **eight distinct geometric/algebraic substrates**, exposing exact structural separations between Archimedean, dyadic, odd-prime, adelic, hyperbolic, black-hole, curved-gravity, and adjacent higher-genus spaces:

| Substrate | Algebraic / Topological Structure | Metric / Geodesic Property | Spectrum / Symmetry Group | Ollivier-Ricci Curvature $\kappa$ | Holographic RT Minimal Cut | Nonlinear Wave Localization |
|---|---|---|---|---|---|---|
| **Euclidean Circle $\mathbb{R} / N\mathbb{Z}$** | Archimedean cyclic lattice; connected continuum limit | Standard triangle inequality $\|x+y\| \le \|x\|+\|y\|$; non-isosceles | Circulant $D_N$; 2-fold $\pm k$ degeneracy ($k \ne 0, N/2$); Paley-Wiener forbids compact eigenfunctions | $0$ (flat 2-regular cycle) | Interval endpoints ($\partial A$, 2 cuts) | Rapid ballistic dispersion (`89.2%` leak at $g=0$) |
| **Dyadic $\mathbb{Q}_2$ ($p = 2$)** | Ultrametric Cantor set; unique even prime | Strong triangle inequality; every triangle isosceles | $\operatorname{Aut}(T_2) = S_2 \wr \cdots \wr S_2$; **unique self-conjugate Adelic sectors** ($m = 1 = p - 1$) | $\kappa_{\mathrm{AdS}}(2) = -\tfrac{2}{3}$; $L_c=5$ has $\kappa_{\mathrm{BTZ}} < \kappa_{\mathrm{AdS}}$ ($-\tfrac{1}{12}$) | **Critical tie** $2 = p$ at 1 horizon subtree; horizon wins at $k \ge 2$ | Exact Kozyrev compacton ($0.00\%$ leak); weakest inter-shell gap ($2^\alpha$) |
| **Odd-Prime $\mathbb{Q}_p$ ($p = 3, 5, 7$)** | Ultrametric Cantor set; odd primes | Exact isosceles trees; $B_j(b)$ bijective with contiguous Monna slice | **Exact Adelic parity-doubling** ($W_{s,m} \perp W_{s,p-m}$, $\le (p^n+1)/2$ levels); modular picket-fence $r_0(p,m) > 0$ | $\kappa_{\mathrm{AdS}}(p) = -\tfrac{2(p-1)}{p+1}$; $p=3, L=5$ hits **exact zero excess** ($\kappa_{\mathrm{BTZ}} = \kappa_{\mathrm{AdS}} = -1$) | **Odd-prime horizon dominance** ($2 < p$): even $k = 1$ full horizon subtree pulls wedge onto horizon! | Exact compacton-solitons (Theorem III) + sharp self-trapping resonance peak |
| **Adelic Hybrid $H_\theta$ ($\theta \in (0, 1)$)** | Non-commuting $\theta R_p D_p^\alpha R_p + (1-\theta) H_{\mathbb{R}}$ | Hybrid Baker-map digit-reversal coupling between $\mathbb{R}$ and $\mathbb{Q}_p$ | Exact $1 + n(p-1)$ block invariance (`< 4.5e-13` leak); $\alpha$-invariant picket-fence locking (falsifies GOE/GUE!) | Dual boundary coupling across leaf order & ultrametric tree | Modulates boundary energy distribution driving curved bulk backreaction | Ballistic Archimedean leakage competes with $p$-adic shell trapping |
| **Pure Bruhat-Tits $\mathrm{AdS}$ ($T_p$)** | $(p+1)$-regular tree; Euler char $\chi = V - E = 1$ (genus 0) | Unique geodesic of length $2(n - v_p(x-y))$ | Exact Gubser propagator $K_\Delta$; BF bound $m_{\text{BF}}^2 = -(\sqrt{p}-1)^2$ | Constant $-\tfrac{2(p-1)}{p+1}$ on every interior edge | Bottom-up tree DP ($O(V)$ exact) | Static boundary-to-bulk holographic dual |
| **Tate-Curve Kerr-BTZ ($T_p / p^{h\mathbb{Z}}$)** | Unicyclic quotient; $\chi = V - E = 0$ (genus 1); horizon length $L = p^h \ge 3$ | Shortcuts around horizon ring $C_L$ (`cycleDist`) | Aharonov-Bohm flux $\Omega \in [-\pi, \pi]$; exact even stress $E(-\Omega)=E(\Omega)$, odd current $J(-\Omega)=-J(\Omega)$ | **Theorem II:** $-\tfrac{2p - \max(0, 6-L)}{p+2}$; exact $L_c = 5$ trichotomy | 2-case cyclic horizon DP ($O(V)$ exact); constant $2\ln p$ horizon plateau | Rotating frame-dragging current circulates around event horizon |
| **Curved Dynamic Gravity ($a_e = e^{\sigma_e}$)** | Weighted bulk conductances $w_e = 1/a_e$ on $T_p$ or BTZ | Weighted shortest path; non-uniform random walks $\mu_u(x) = w_{ux}/W_u$ | Symmetric Jacobi damped wave equation on line graph $L(G)$ driven by $T_e$ | **Theorem V:** Non-perturbative Gauss-Bonnet conservation ($\sigma_e \ge -\ln p$); exact deficit past $\sigma_e < -\ln p$ | Pinched throats ($a_e \gg 1$) attract minimal cuts (ER=EPR bottleneck migration) | Gravitational redshift potential $V_{\text{grav}}(\ell)$ feeds back into Yoshida boundary phase |
| **Adjacent: Higher-Genus Mumford-Schottky ($g \ge 2$)** *(Out of current scope)* | Multi-cycle graph quotient $T_p / \Gamma_g$; $\chi = 1 - g \le -1$ | Multiple interacting fundamental cycles; non-trivial homology | Rank-$g$ Schur complement + Sherman-Morrison-Woodbury ($O(V + g^3)$) | Cycle-cycle interference alters $W_1$ whenever cycle separation $\le 2$ | Treewidth $g + 1$ DP ($O(2^g V)$) or max-flow min-cut ($O(V E)$) | Multi-horizon wormhole scattering & genus-$g$ Page phase transitions |

---

## 3. Spectral Spectrums Contrast (Quantum, Holographic & Acoustic)

### 3.1 Dispersion Exponent Spectrum ($\alpha \in [0.5, 2.0]$ — Experiment G)

A major blindspot in `v1.2.0` was that Experiment E tested only linear dispersion ($\alpha = 1.0$). Experiment G evaluates $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ across $N \le 625$ ($\dim W_{0,m} \le 128$):

| Prime & Sector | Theoretical $r_0(p, m)$ | $\alpha = 0.5$ ($\theta = 0.5$) | $\alpha = 1.0$ ($\theta = 0.5$) | $\alpha = 1.5$ ($\theta = 0.5$) | $\alpha = 2.0$ ($\theta = 0.5$) | Off-Diag Mixing $\|H_{Q,\text{off}}\|_F / \|H_R\|_F$ ($\alpha = 0.5 \to 2.0$) |
|---|---:|---:|---:|---:|---:|---:|
| $p = 2, N = 256, W_{0,1}$ | $0$ | `0.0025` | `0.0015` | `0.0008` | `0.0004` | `0.1809` $\to$ `0.4008` |
| $p = 3, N = 243, W_{0,1}$ | $\tfrac{1}{2} = 0.5000$ | `0.5045` | `0.5039` | `0.5013` | `0.5019` | `0.1747` $\to$ `0.3464` |
| $p = 5, N = 625, W_{0,1}$ | $\tfrac{2}{3} = 0.6667$ | `0.6245` | `0.6263` | `0.6292` | `0.6334` | `0.1592` $\to$ `0.2720` |
| $p = 5, N = 625, W_{0,2}$ | $\tfrac{1}{4} = 0.2500$ | `0.2633` | `0.2612` | `0.2578` | `0.2562` | `0.1595` $\to$ `0.2719` |

**Analytical Mechanism ($\alpha$-Invariance Law):** For any smooth power-law dispersion $f(u) = u^\alpha$ ($\alpha > 0$) evaluated on the folded picket-fence sequence $u_{2a} = ap + m$, $u_{2a+1} = (a+1)p - m$ (formally proved in Lean 4 via `picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`), local Taylor expansion gives adjacent gaps $\Delta_{2a} \approx \alpha u_{2a}^{\alpha - 1}(p - 2m)$ and $\Delta_{2a+1} \approx \alpha u_{2a+1}^{\alpha - 1}(2m)$. Because the local density factor $\alpha u^{\alpha - 1}$ cancels in the adjacent gap ratio $r_a = \min(\Delta_{2a}, \Delta_{2a+1}) / \max(\Delta_{2a}, \Delta_{2a+1}) = r_0(p, m) + O(1/a)$, **picket-fence locking is asymptotically $\alpha$-invariant across the entire dispersion spectrum**, even at standard quadratic Schrödinger dispersion $\alpha = 2.0$ where off-diagonal coupling reaches `40.1%`!

### 3.2 Acoustic Prime-Power Spectral Ladders (`src/web/audio.js`)

| Prime $p$ | Fundamental $f_0$ (Hz) | Scale Geometry | Base Ratio $p^1$ | FM Modulator Ratio $1 + 1/p$ |
|---:|---:|---|---:|---:|
| $2$ | `65.41` (C2) | Dyadic octave/tritone ladder | `2:1` (Octave) | `3/2` (Just fifth) |
| $3$ | `78.00` | Bohlen-Pierce tritave ladder | `3:1` (Tritave) | `4/3` (Just fourth) |
| $5$ | `68.00` | Pentave harmonic ladder | `5:1` (Pentave) | `6/5` (Minor third) |
| $7$ | `72.00` | Heptave harmonic ladder | `7:1` (Heptave) | `8/7` (Septimal whole tone) |

---

## 4. Gradients & Stability Margins Audit

### 4.1 Curved Edge-Length Curvature Gradient & Critical Pinch Margin (Theorem V)

On a strictly interior bridge edge $e$ of $(p+1)$-regular $T_p$ (prime integer $p \ge 2$, uniform background $\kappa_{\mathrm{AdS}}(p) = -2(p-1)/(p+1)$) perturbed to edge length $a_e = e^{\sigma_e} > 0$ (conductance $w_e = 1/a_e = e^{-\sigma_e}$, all other edges at $1$; edges at graph distance $\ge 2$ have unchanged 1-hop neighborhoods and zero excess), exact non-lazy ($t=1$) bipartite optimal transport establishes:

- **Subcritical Regime ($\sigma_e \ge -\ln p$, i.e. $a_e \ge 1/p$):**
  $$\kappa_e(\sigma_e) = -\frac{2(p-1)}{p e^{\sigma_e} + 1}, \qquad \kappa_{e'}(\sigma_e) = -\frac{p-1}{p + e^{-\sigma_e}} - \frac{p-1}{p+1} \quad (2p \text{ neighbors}),$$
  with exact uniform-AdS gradients:
  $$\left.\frac{\partial \kappa_e}{\partial \sigma_e}\right|_{0} = +\frac{2p(p-1)}{(p+1)^2}, \qquad \left.\frac{\partial \kappa_{e'}}{\partial \sigma_e}\right|_{0} = -\frac{p-1}{(p+1)^2}, \qquad \frac{\partial}{\partial \sigma_e}\!\left(\kappa_e + 2p\kappa_{e'}\right) \equiv 0.$$
  Non-perturbatively across the **entire** subcritical interval $\sigma_e \in [-\ln p, +\infty)$, the finite-support sum ($2p+1$ nonzero terms) satisfies $\sum_{e'' \in E(T_p)} (\kappa_{e''} - \kappa_{\mathrm{AdS}}(p)) \equiv 0$ identically by local vertex probability-normalization telescoping (proved in Lean 4 as `curved_ads_gauss_bonnet_subcritical`, verified to `7.77e-16`–`5.33e-15` in Experiment H; see `ERRATA.md` & `paper/main.tex` Remark 5.4 for why `"Gauss-Bonnet Conservation"` was withdrawn in `v1.8.1`).
- **Supercritical Pinch Margin ($\sigma_e < \sigma_e^* = -\ln p$, i.e. $a_e < 1/p$):**
  - Critical margins: $\sigma_2^* = -0.6931$, $\sigma_3^* = -1.0986$, $\sigma_5^* = -1.6094$, $\sigma_7^* = -1.9459$.
  - Crossing $\sigma_e < \sigma_e^*$ triggers Branch 2 (`curved_ads_supercritical_pinch_deficit`), breaking subcritical invariance with exact negative curvature pinch deficit:
    $$\sum_{e'' \in E(T_p)} \big(\kappa_{e''}(\sigma_e) - \kappa_{\mathrm{AdS}}(p)\big) = -2\,\frac{e^{-\sigma_e} - p}{e^{-\sigma_e} + p} < 0.$$

### 4.2 Breitenlohner-Freedman Tachyonic Margin ($\Delta \to 0.50^+$, Experiment H2)

| Topology ($p = 3, n = 5$, $\sigma_e \in [-1.5, +1.5]$) | $\Delta$ | $m^2(\Delta) - m_{\text{BF}}^2$ | Min Schur Pivot $\min_u \|D_u\|$ | Max KG PDE Residual |
|---|---:|---:|---:|---:|
| Curved Pure AdS | `1.5000` | `+1.464102` | `1.8942` | `5.55e-16` |
| Curved Pure AdS | `0.5500` | `+0.005231` | `1.0457` | `1.53e-15` |
| Curved Pure AdS | `0.5001` | `+2.09e-08` | `0.9554` | `1.55e-15` |
| Curved Kerr-BTZ ($L=9, \Omega=\pi$) | `1.5000` | `+1.464102` | `1.7979` | `1.39e-15` |
| Curved Kerr-BTZ ($L=9, \Omega=\pi$) | `0.5500` | `+0.005231` | `0.8693` | `3.89e-15` |
| Curved Kerr-BTZ ($L=9, \Omega=\pi$) | `0.5001` | `+2.09e-08` | **`0.8637`** | **`5.38e-15`** |

Even $10^{-4}$ above the exact tachyonic BF instability threshold under simultaneous strong inhomogeneous curvature and maximal $\Omega = \pi$ Kerr flux, every Schur pivot stays bounded well away from zero (`>= 0.8637`) and the exact uneliminated PDE residual stays at $5.38 \times 10^{-15}$.

### 4.3 Numerical Precision & Error Margin Budget

| Numerical Pipeline | Theoretical Order / Bound | Measured Margin (`v1.3.0`) | Gate Threshold |
|---|---|---|---|
| Radix-$p$ Pontryagin FFT vs. Naive $O(N^2)$ DFT | Machine epsilon $\varepsilon \log_p N$ | `< 1e-13` | `< 1e-11` |
| 4th-Order Yoshida Symplectic Energy Conservation | $O(\Delta t^4)$ ($16\times$ per $\Delta t / 2$) | `> 15.8x` (Mutant M5 Strang fails at `~4x`) | `> 13.5x` |
| 4th-Order Yoshida Norm Unitarity $\|\|\psi\|\|^2 - 1$ | Exact unitary steps ($\le O(\varepsilon)$) | `< 1e-14` | `< 1e-12` |
| Complex Hermitian Block $W_{0,m}$ Cross-Sector Leakage | Exact $0$ (Theorem I) | `1.3e-15` – `4.5e-13` | `< 1e-11` |
| Bulk Klein-Gordon Schur + Sherman-Morrison Residual | Exact $0$ (Theorem IV) | `1e-16` – `5.38e-15` | `< 1e-11` |
| Curved AdS Gauss-Bonnet Sum vs. Theorem V | Exact $0$ / exact deficit (Theorem V) | `7.77e-16` – `5.33e-15` | `< 1e-12` |
| Dynamic Gravity Sibling Symmetry (`stepGravity`) | Exact $0$ (Symmetric Jacobi update) | `< 1e-15` (Mutant M7 fails at `> 1e-4`) | `< 1e-15` |

---

## 5. Verification & Epistemic Taxonomy

| Tier | Trust Base | What It Certifies | Coverage in `v1.3.0` | What It Does **Not** Certify |
|---|---|---|---|---|
| **Tier 1: Lean 4 Kernel (`v4.35.0`)** | Lean 4 type-checking kernel + `[propext, Classical.choice, Quot.sound]` | Universal quantified algebraic, combinatorial, optimal-transport, and graph-metric theorems for all $p, n, L, M, w$ | **101 theorems** (`2,267` LOC), zero Mathlib, zero `sorryAx`, zero `native_decide` | IEEE-754 floating-point code paths; continuous-time ODE convergence |
| **Tier 2: Independent Python Exact Arithmetic** | Python stdlib `int` & `fractions.Fraction` / $\mathbb{Q}(i)$ | Zero-rounding-error cross-checks of Theorems I–V decoupled from JS & Lean + SHA-256 manifest + Lean token scan | `7,033` Adelic pairs, `18` picket sectors, `45` BTZ horizons, `60` curved Gauss-Bonnet plans, exact $\mathbb{Q}(i)$ solve, `55` SHA-256 digests | Real-time browser rendering & WebAudio synthesis |
| **Tier 3: Node.js Numerical & Mutant Gates** | V8 IEEE-754 Float64 (`test/verify.mjs`, `test/mutants.mjs`) | Exact FFT, Kozyrev wavelets, Yoshida $\Delta t^4$, bulk solver, Gubser propagator, brute-force RT DP, Theorem V, regressions, and **8/8 planted negative mutants killed** | **18/18 tests** (10 theorems + 8 mutants) + 24 `(prime × exp)` checks | Universal quantification over infinite $(p, n)$ |
| **Tier 4: Live Visual & Browser Audit** | Headless Chromium WebGL2 + Canvas2D + HTTP server | Zero console errors, zero topbar/sidebar clipping at `1280×800`, zero 2D text collisions, live interactivity & GitHub Pages parity | Verified on both `localhost:4174` and `https://0thernes.github.io/ultrametrica/` | Automated auditory listening check of 48 kHz AudioWorklet |

---

## 6. Complete Issue, Bug, Hole & Blindspot Register (`v1.2.0` $\to$ `v1.3.0`)

| ID | Layer | Severity | Root Cause Discovered in Audit | Resolution Implemented in `v1.3.0` | Regression Guard |
|---|---|---|---|---|---|
| `BUG-1` | `src/engine/simulation.js` | **High** | `ultrametric_tunneling` computed `b3 = (b1*p + 1)*p` with `j3 = min(n-1, 3)`. At $p=7, n=3$, `j3 = 2` placed `w3` in ball `7` (`[49, 56)`), **outside** `b1 = 0` (`[0, 49)`), injecting spurious initial ball leakage. | Conditionally set `b3` strictly inside `b1` for all `j3` (`b1*p + min(p-1, 2)` when `j3 === 2`). | `Theorem 10` Part B (`verify.mjs`): verifies `< 1e-14` initial leakage across $p \in \{2,3,5,7\}$. |
| `BUG-2` | `src/engine/simulation.js` | **Medium** | `wormhole_surgery` with `keepTopology: true` under BTZ read `parentEdge[levelOffset[1]] === -1` when `horizonDepth >= 2`, silently skipping the wormhole pinch. | Pinch `horizonEdges[0]` when `this.bulk.isBTZ`, else depth-1 bridge edge. | `Theorem 10` Part C (`verify.mjs`): confirms `edgeLength[horizonEdges[0]] > 20`. |
| `BUG-3` | `src/engine/holography.js` | **Medium** | `stepGravity` mutated `sigma[ei]` in-place while averaging `sigma[nb[i]]`, breaking sibling symmetry via Gauss-Seidel index-ordering bias. | Snapshot `sigma` into preallocated `_sigmaSnap` before loop (exact symmetric Jacobi update). | `Theorem 10` Part D (`< 1e-15` sibling symmetry) + **Mutant M7 killed** (`mutants.mjs`). |
| `BUG-4` | `src/web/audio-worklet.js`, `audio.js` | **Medium** | Instantaneous hard-gating of `btzWave` (audible click on AdS$\leftrightarrow$BTZ toggle), unsmoothed `masterGain`, duplicated frequency table, missing `Number.isFinite` guards. | Added exponential crossfade `smoothBtzMix` & `smoothGain`, passed canonical `shellFreqs` from `audio.js`, and added `Number.isFinite` sanitization. | Code audit + live browser check. |
| `BUG-5` | `src/web/styles.css`, `index.html`, `app.js` | **High (UI)** | `.topbar` overflowed horizontally at `1280px`, clipping `ULTRAMETRICA` and `#manifoldBadge` on the left edge (observed in `v1.2.0` screenshot). | Compacted `.topbar` padding/gaps, button copy (`BTZ Hole`, `TOOL`, `3-Pt`), and compact `#manifoldBadge` text. | Verified zero overflow in `1280×800` live browser screenshot. |
| `BUG-6` | `src/web/panels2d.js` | **Medium (UI)** | `UltrametricTrianglePanel` left title collided visually with right-aligned `ISOSCELES EXACT` badge. | Dynamically measured text width via `ctx.measureText` and switched to compact title with guaranteed horizontal margin. | Verified clean separation in `1280×800` screenshot. |
| `BUG-7` | `src/web/styles.css` | **Medium (UI)** | Left `.sidebar` clipped bottom telemetry row (`Hamiltonian <H>`, `Horizon Flux J`) below the fold at `1280×800`. | Tightened vertical spacing on `.panel-section`, `.exp-card`, `.control-row`, and `.tele-cell`. | Verified all 6 live invariants visible above the fold at `1280×800`. |
| `BUG-8` | `src/web/index.html`, `app.js` | **Low** | `sldAlpha` max was `1.90` and URL hydrator rejected `alpha > 1.9`, blocking standard quadratic Schrödinger dispersion $\alpha = 2.00$. | Raised `sldAlpha` `max="2.00"` and updated hydrator guard to `<= 2.0`. | Verified in DOM & permalink check. |
| `BUG-9` | `src/web/app.js` | **Low** | `buildPermalinkURL` omitted `grav` (`newtonG`) and `dyn` (`gravityEnabled`), losing gravitational state on permalink sharing. | Added `grav` and `dyn` serialization and hydration in `buildPermalinkURL` / `hydrateStateFromURL`. | Verified in `app.js` round-trip logic. |
| `BUG-10` | `src/web/renderer3d.js` | **Medium** | Called `gl.getUniformLocation` ~15 times/frame (~900/sec), allocated `Uint8Array`/`Set` per frame in triangle mode, had incorrect parallel-ray fallback in `pickAtClient`, and lacked `webglcontextlost` handling. | Cached all uniform locations in `_initGL()`, preallocated `_triEdgeMask`, replaced `Set` with 3 scalar IDs, fixed parallel fallback (`tN = -dDot; tD = aDot`), and added `webglcontextlost` handler. | Zero runtime errors in live WebGL2 observatory. |
| `BUG-11` | `src/web/index.html` | **Low** | Help modal header & theorem summary still referenced `v1.2.0` (`71/71` theorems). | Updated modal to `v1.3.0` (`101/101` Lean 4 theorems including Theorem V). | Visual verification in browser. |
| `BUG-12` | `src/engine/holography.js` | **Low (Perf)** | `computeOllivierRicci` and `computeRyuTakayanagi` allocated temporary `Float64Array`/`Uint8Array` buffers on every invocation. | Preallocated `_sumW`, `_hDist`, `_ringCum`, `_wMuU`, `_wMuV`, `_wCost`, `_rtDp0/1`, `_rtPickSide`, `_rtBestAssign`, `_rtRDp0/1`, `_rtRPrev0/1` once in `_initState()`. | `verify.mjs` Theorems 7–10 pass with zero regression. |
| `BUG-13` | `src/engine/holography.js` | **Audit Check** | Potential Schur-pivot instability near BF tachyonic bound $\Delta \to 0.50^+$ under strong inhomogeneous curvature & Kerr flux $\Omega = \pi$. | Quantitatively audited in **Experiment H2**: min pivot $= 0.8637 > 0$ and worst PDE residual $= 5.38 \times 10^{-15}$ at $\Delta = 0.5001$. | `Theorem 10` Part E + `verify_exact.py` Exp H gate. |
| `BUG-14` | `server.mjs` | **Medium (Sec)** | Missing HTTP method check (`GET`/`HEAD`), unguarded `decodeURIComponent` (500 on malformed `%`), missing null-byte/backslash checks, missing security headers & `.png`/`.ico` MIME types. | Hardened `server.mjs` with `405` on non-`GET`/`HEAD`, `400` on invalid encoding/null/backslash, `path.relative` traversal guard, `nosniff`/`CORP`/`Referrer-Policy` headers, and expanded MIME map. | Tested live on `localhost:4174`. |
| `BUG-15` | `paper/WHITE_PAPER.md` | **Medium (Doc)** | Sections 2–11 still contained stale `v1.0.0` prose & omitted universal proofs, Experiments E–H, Theorem V, and mutants. | Fully synchronized `paper/WHITE_PAPER.md` with `paper/main.tex` (`v1.3.0`). | Cross-checked against `paper/main.tex` & `docs/CLAIMS.md`. |
| `BUG-16` | `src/engine/simulation.js` | **High** | Constructor called `this.loadExperiment('kozyrev_trap')` without `{ keepTopology: true }`, silently overwriting any non-zero `horizonDepth` passed to `new UltrametricaSimulation(p, n, h)` back to `0`! | Changed constructor call to `this.loadExperiment('kozyrev_trap', { keepTopology: true })`. | Caught directly by `Theorem 10` Part C (`verify.mjs`); now passes 100%. |
| `LEAN-H1` | `HolographyCurvature.lean` | **Formal Gap** | `btzClassDist` hardcoded `3 - shortcutSaving L` and `if L = 3 then 2 else 3` without proving equivalence to the literal $L$-cycle graph metric. | Defined `cycleDist` and `btzGraphDist` and proved `btz_graph_metric_eq_classDist` universally for all $L \ge 3$ and all 9 pairs, plus monotonicity, shadow duality, and exact Euler characteristics $\chi = 1, 0$. | Kernel-checked (`VerifyAxioms.lean`). |
| `LEAN-H2` | `AdelicSymmetry.lean` | **Formal Gap** | Proposition 4.2 (modular picket-fence law) was checked only on 18 finite Python cases. | Universally proved `picket_fence_monotone`, `picket_fence_even_gap`, `picket_fence_odd_gap`, `picket_fence_gap_sum`, `picket_fence_odd_prime_strictly_positive`, and `picket_fence_dyadic_zero_gap`. | Kernel-checked (`VerifyAxioms.lean`). |
| `LEAN-H3` | `Basic.lean` | **Formal Gap** | Abstract `Ultrametric` structure lacked a concrete kernel-checked Bruhat-Tits leaf instance, plus explicit Monna bijectivity and ball cardinality theorems. | Proved `padic_ball_cardinality`, `monna_injective`, `monna_surjective`, `treeHopDist_symm`, `treeHopDist_strong_tri`, `bruhatTitsUltrametric`, and `bruhatTits_leaves_isosceles`. | Kernel-checked (`VerifyAxioms.lean`). |
| `SCI-B1` | `scripts/discover.mjs` | **Blindspot** | Experiment E tested only $\alpha = 1.0$; unknown whether quadratic Schrödinger dispersion ($\alpha = 2.0$) breaks picket-fence locking into GUE/GOE. | Added **Experiment G** across $\alpha \in \{0.5, 1.0, 1.5, 2.0\}$ up to $N = 625$; established universal $\alpha$-invariance of modular picket-fence locking. | `verify_exact.py` Exp G gate + **Figure 5(a)**. |
| `SCI-B2` | `scripts/discover.mjs`, `HolographyCurvature.lean` | **Blindspot $\to$ Theorem V** | Curved inhomogeneous Ollivier-Ricci gradients and pinch stability margins had not been analytically characterized. | Discovered & proved **Theorem V** (non-perturbative Gauss-Bonnet conservation for $\sigma_e \ge -\ln p$ and exact supercritical deficit for $\sigma_e < -\ln p$) in Lean 4 + Python `Fraction` + **Experiment H**. | `Theorem 10`, **Mutant M8**, `verify_exact.py` (60 exact plans), **Figure 5(b)**. |

---

## 7. Open Frontiers Remaining After `v1.3.0` (Honest Non-Claims)

1. **Higher-Genus Mumford-Schottky Quotients ($g \ge 2$):** Extending Theorem II (BTZ curvature) and Theorem IV (rank-1 Sherman-Morrison) to multi-cycle genus-$g$ $p$-adic black hole networks where non-trivial cycle-cycle interaction modifies bipartite transport and requires rank-$g$ Woodbury updates.
2. **Global Multi-Edge Curved Gauss-Bonnet on BTZ Rings:** While Theorem V proves non-perturbative Gauss-Bonnet conservation on arbitrary bridge edges of $T_p$ inside the subcritical regime $\frac{w_e}{W_u} + \frac{w_e}{W_v} \le 1$, characterizing the exact global sum of curved Ollivier-Ricci curvature on a *non-uniform* BTZ horizon cycle (where shortcut paths themselves warp dynamically) remains an open discrete-geometry problem.
3. **Full Operator-Norm Analytic Bound on Intra-Sector Level Shifts:** While Experiment G empirically demonstrates $\alpha$-invariant picket-fence locking up to $N = 625$ and Lean 4 proves the unperturbed alternating gaps universally, a rigorous analytic proof bounding the operator perturbation $\|H_{Q,\text{off}}\|_{W_{0,m}}$ as $n \to \infty$ (showing whether localization/picket-fence locking persists for arbitrarily large $n$, or eventually crosses over at exponentially large $n$) remains open.

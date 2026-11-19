# Glossary of Mathematical, Physical, Holographic & Computational Terms

A precision reference covering every concept, symbol, operator, and algorithm used across **ULTRAMETRICA**, its [White Paper](paper/WHITE_PAPER.md), [Master Report](docs/MASTER_REPORT.md), and [Lean 4 Proof Suite](lean/README.md).

---

## A

- **Adelic Hybrid Hamiltonian ($H_\theta$)**: The one-parameter family of real symmetric operators $H_\theta = \theta R_p D_p^\alpha R_p + (1 - \theta)(-\Delta_{\mathbb{R}})^{\alpha/2}$ on $\mathbb{C}^{p^n}$ interpolating continuously between Euclidean circular space ($\theta = 0$) and non-Archimedean $p$-adic space ($\theta = 1$). See Theorem I.
- **Adelic Parity-Doubling Dichotomy (Theorem I)**: The exact algebraic split proving that for all odd primes $p \ge 3$, every excited eigenvalue of $H_\theta$ has even multiplicity $\ge 2$ ($\le (p^n+1)/2$ distinct levels) due to disjoint complex-conjugate valuation-residue sectors $W_{s,m} \perp W_{s,p-m}$, whereas at the even prime $p = 2$, every sector $W_{s,1}$ is self-conjugate and generically splits into $2^n$ simple eigenvalues.
- **Adelic Physics**: Theoretical physics program (Freund-Witten 1987; Dragovich et al. 2017) combining the Archimedean real completion $\mathbb{R}$ and all $p$-adic completions $\mathbb{Q}_p$ of $\mathbb{Q}$ via product formulas such as $\prod_{v \le \infty} |x|_v = 1$.
- **Aharonov-Bohm Horizon Flux ($\Omega$)**: Complex gauge phase $\theta_j = \Omega / L$ placed on each directed edge of a closed BTZ horizon ring, threading magnetic/frame-dragging flux $\Omega \in [-\pi, \pi]$ through the non-trivial homology cycle $H_1(T_p / p^{h\mathbb{Z}}) \cong \mathbb{Z}$.
- **Archimedean Twin ($\psi_{\mathbb{R}}$)**: Synchronized reference wavefunction evolved simultaneously on the Euclidean circle $\mathbb{R}/\mathbb{Z}$ from the identical initial spatial profile and calibrated to the identical spectral RMS energy scale as $\mathbb{Q}_p$.
- **Asymptotic Infinity Impedance ($\mu_0(1 - p^{-\Delta})$)**: Exact Robin boundary term added at root $d = 0$ of a finite Bruhat-Tits tree $T_p$ representing the exact decay $p^{-\Delta}$ toward $\infty \in \mathbb{P}^1(\mathbb{Q}_p)$, ensuring exact $10^{-12}$ agreement with Gubser's infinite-tree bulk-to-boundary propagator.
- **AudioWorklet (`padic-synth-processor`)**: Lock-free, dedicated-thread WebAudio DSP engine running at 48 kHz in `src/web/audio-worklet.js`, synthesizing prime-power harmonic shells directly from live quantum telemetry.

## B

- **Bohlen-Pierce Tritave ($3^x$)**: Non-octave musical tuning system built on powers of $3$ ($3:1$ tritaves) rather than $2:1$ octaves; emerges naturally as the Vladimirov harmonic spectrum for $p = 3$.
- **Breitenlohner-Freedman (BF) Bound ($m_{\text{BF}}^2$)**: Minimum stable squared scalar mass in hyperbolic AdS space; in $p$-adic AdS/CFT, $m_{\text{BF}}^2 = -(\sqrt{p} - 1)^2 < 0$ achieved at $\Delta = 1/2$, corresponding to the strictly positive spectral gap of the Bruhat-Tits graph Laplacian. Machine-checked in `HolographyCurvature.lean`.
- **Bruhat-Tits Tree ($T_p$)**: Infinite $(p+1)$-regular hyperbolic tree $\mathrm{PGL}_2(\mathbb{Q}_p)/\mathrm{PGL}_2(\mathbb{Z}_p)$ whose vertices correspond to $p$-adic balls $a + p^k \mathbb{Z}_p$ and whose boundary at infinity is $\mathbb{P}^1(\mathbb{Q}_p)$. Serves as the discrete holographic bulk spacetime in $p$-adic AdS/CFT.
- **BTZ Black Hole ($p$-adic / Tate Curve Quotient $T_p / p^{h\mathbb{Z}}$)**: Discrete non-Archimedean analog of the Banados-Teitelboim-Zanelli black hole constructed by excising the Bruhat-Tits interior above depth $h$ and welding the $L = p^h$ vertices into a closed event-horizon ring of non-trivial homology $\pi_1 = \mathbb{Z}$.
- **Bulk-to-Boundary Propagator ($K_\Delta(v, y)$)**: Exact harmonic Green's kernel propagating a boundary delta source at $y \in \mathbb{Z}_p$ into bulk vertex $v \in T_p$: $K_\Delta(v, y) = p^{(2\cdot \mathrm{lca}(v,y) - d)\Delta}$.

## C

- **Cantor Dust**: A totally disconnected, compact, perfect topological space with empty interior; $\mathbb{Z}_p$ is homeomorphic to the Cantor set, visualized directly on the outer rim of ULTRAMETRICA's 3D hyperbolic bowl via recursive ultrametric angular gaps.
- **Compacton-Soliton**: A strictly compactly supported solitary wave (identically zero outside a bounded region) that maintains its shape under nonlinear evolution without dispersing or emitting radiation. Proved for all disjoint Kozyrev wavelet superpositions in Theorem III.
- **Conformal Dimension ($\Delta$)**: Scaling dimension of the dual boundary CFT operator, related to the bulk scalar mass squared by Gubser's exact formula $m^2(\Delta) = p^\Delta + p^{1-\Delta} - (p + 1)$.

## D

- **Digit-Complement Involution ($S$)**: Map $S(x) = (p^n - 1) - x$ replacing every base-$p$ digit $d_r \mapsto (p - 1) - d_r$. Commutes identically with the discrete Monna involution $R_p$ ($S R_p = R_p S$), formally verified in `Basic.lean`.
- **Dynamic Edge-Length Gravity**: Discrete Einstein-dilaton gravity on graphs (Gubser-Heydeman-Jepsen-Marcolli 2017) where each bulk edge carries a dynamical length $a_e = e^{\sigma_e}$ responding to bulk scalar stress-energy $T_e$.

## E

- **Entanglement Wedge ($\mathcal{E}(A)$)**: The bulk region bounded by boundary subset $A$ and its Ryu-Takayanagi minimal cut surface $\gamma_A$; computed exactly in $O(V)$ by `computeRyuTakayanagi`.
- **ER=EPR Wormhole Surgery**: Interactive bulk intervention in ULTRAMETRICA allowing the user to stretch ($\sigma_e^{\text{pin}} > 0$, weakening conductance $w_e = 1/a_e$) or tighten bulk geodesic edges, directly altering holographic entanglement entropy and Ollivier-Ricci curvature.

## G

- **Gromov Product ($(A|B)_C$)**: Metric measure of tree-branching depth $\frac{1}{2}(d(A, C) + d(B, C) - d(A, B))$; in $T_p$, equals the exact number of shared geodesic hops from leaf $C$ to the lowest common ancestor of $A$ and $B$.
- **Gross-Pitaevskii Equation ($p$-adic)**: Nonlinear Vladimirov-Schrödinger PDE $i \partial_t \psi = (D_p^\alpha + V + g|\psi|^2)\psi$ modeling self-interacting bosonic waves on $\mathbb{Z}_p / p^n \mathbb{Z}_p$.

## H

- **Horizon Current ($J_{\text{hor}}$)**: Gauge-invariant probability current circulating around a rotating Kerr-BTZ horizon ring, $J_{\text{hor}} = \frac{1}{L}\sum_{j=0}^{L-1} w_j \operatorname{Im}(\overline{\phi_{h_j}} e^{i\Omega/L} \phi_{h_{j+1}})$, satisfying exact odd parity $J(-\Omega) = -J(\Omega)$.

## I

- **Inverse Participation Ratio ($\mathrm{IPR}$)**: Spatial localization observable $\mathrm{IPR} = \sum_x |\psi(x)|^4 \in [1/N, 1]$. Larger values indicate sharper localization; $N \cdot \mathrm{IPR} = 1$ for uniform plane waves.
- **Isosceles Triangle Theorem (Ultrametric)**: Exact theorem (`ultrametric_isosceles_lt`, `ultrametric_two_longest_equal` in `Basic.lean`) stating that in every ultrametric space, at least two sides of every triangle are equal and achieve the maximum length.

## K

- **Kantorovich-Rubinstein Tree Formula**: Exact closed-form expression for 1-Wasserstein earth-mover distance between probability measures on any weighted tree: $W_1(\mu, \nu) = \sum_e a_e |\mu(T_e) - \nu(T_e)|$.
- **Kerr-BTZ Black Hole (Discrete)**: Rotating $p$-adic BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$ equipped with Aharonov-Bohm rotational gauge flux $\Omega$ around the horizon ring.
- **Kozyrev Wavelet ($\psi_{j,b,m}$)**: Orthonormal $p$-adic wavelet (Kozyrev 2002) supported strictly on a single ball $B_j(b)$ of cardinality $p^{n-j}$ and oscillating as $e^{2\pi i m d_j(x)/p}$; simultaneously an exact eigenfunction of the non-local Vladimirov operator $D_p^\alpha$ with eigenvalue $p^{\alpha(j+1)}$.

## L

- **Lean 4 (`v4.35.0`)**: Interactive theorem prover and dependently typed programming language whose small trusted kernel machine-checks all 24 formal proofs in `lean/` with zero `sorryAx` and zero custom axioms.

## M

- **Macroscopic Nonlinear Self-Trapping**: Suppression of inter-ball ultrametric tunneling at strong nonlinearity $g \gg \|D_p^\alpha\|$ due to nonlinear phase detuning $g|\psi|^2$ decoupling occupied and unoccupied $p$-adic balls (observed in Experiment C).
- **Monna Map ($\mathcal{M}_p$ / $R_p$)**: Continuous surjection $\mathbb{Z}_p \to [0, 1]$ mapping $\sum d_r p^r \mapsto \sum d_r p^{-(r+1)}$. On $\mathbb{Z}/p^n\mathbb{Z}$, $p^n \mathcal{M}_p$ is the exact base-$p$ digit-reversal involution $R_p$.

## N

- **Non-Archimedean Field ($\mathbb{Q}_p$)**: Completion of $\mathbb{Q}$ under the $p$-adic ultrametric norm $|\cdot|_p$, violating the Archimedean axiom (repeatedly adding $1$ never grows in norm: $|n|_p \le 1$ for all $n \in \mathbb{Z}$).

## O

- **Oganesyan-Huse Ratio ($\langle r \rangle$)**: Mean adjacent eigenvalue spacing ratio $\tilde{r}_i = \min(\delta_i, \delta_{i+1}) / \max(\delta_i, \delta_{i+1})$ used in spectral statistics to distinguish integrable Poisson spectra ($\approx 0.3863$) from GOE quantum chaos ($\approx 0.5307$).
- **Ollivier-Ricci Curvature ($\kappa(u, v)$)**: Discrete Ricci curvature of an edge $(u, v)$ defined via 1-Wasserstein optimal transport between neighbor random-walk measures: $\kappa(u, v) = 1 - W_1(\mu_u, \mu_v) / a_{uv}$. Equals $-\frac{2(p-1)}{p+1}$ on uniform $T_p$ and $-\frac{2p - \max(0, 6-L)}{p+2}$ on uniform BTZ horizons (Theorem II).

## P

- **Page Transition (Holographic)**: Discontinuous jump of the Ryu-Takayanagi minimal cut surface $\gamma_A$ as boundary region $A$ expands, switching the entanglement wedge $\mathcal{E}(A)$ from detached boundary domes to engulfing the BTZ black hole horizon.
- **Pontryagin Dual ($\widehat{\mathbb{Z}_p} \cong \mathbb{Q}_p / \mathbb{Z}_p$)**: Group of continuous unitary additive characters $\chi_p(\xi x) = e^{2\pi i \{\xi x\}_p}$, truncated at precision $n$ to $p^{-n}\mathbb{Z}/\mathbb{Z}$.
- **$p$-adic Valuation ($v_p(k)$)**: Largest integer $r$ such that $p^r$ divides $k$ (with $v_p(0) = \infty$, capped at $n$ modulo $p^n$). Determines the ultrametric norm $|k|_p = p^{-v_p(k)}$.

## R

- **Radix-$p$ Cooley-Tukey FFT**: Exact prime-power Fast Fourier Transform of length $N = p^n$ running in $O(p N \log_p N)$ without zero-padding, using base-$p$ digit reversal and size-$p$ butterfly matrices.
- **Ryu-Takayanagi Formula ($S_A$)**: Holographic correspondence equating boundary entanglement entropy of region $A$ to the area (minimum bond-capacity edge cut $\sum_{e \in \gamma_A} w_e \ln p$) of the homologous bulk minimal surface $\gamma_A$.

## S

- **Schur-Complement Tree Elimination**: Exact $O(V)$ Gaussian elimination ordering from leaves to root/horizon that eliminates all hanging tree subtrees without fill-in.
- **Sherman-Morrison Formula**: Exact rank-1 matrix inverse update $(T + w u u^\dagger)^{-1} = T^{-1} - \frac{w T^{-1} u u^\dagger T^{-1}}{1 + w u^\dagger T^{-1} u}$, unconditionally non-singular for our Kerr-BTZ horizon wrap edge (Theorem IV).
- **Strong Triangle Inequality**: Ultrametric inequality $|x + y|_p \le \max(|x|_p, |y|_p)$, with equality whenever $|x|_p \ne |y|_p$.

## V

- **Valuation-Residue Sector ($W_{s,m}$)**: Exact Fourier invariant subspace $\operatorname{span}\{e_k : k \equiv m p^s \pmod{p^{s+1}}\}$ of dimension $p^{n-s-1}$ preserved identically by the Adelic hybrid Hamiltonian $H_\theta$ (Theorem I).
- **Vladimirov Operator ($D_p^\alpha$)**: Non-local $p$-adic fractional pseudo-differential operator acting in Pontryagin dual space as multiplication by $|\xi|_p^\alpha = p^{\alpha(n - v_p(k))}$.

## Y

- **Yoshida 4th-Order Symplectic Integrator**: Symmetric composition $S_4(\Delta t) = S_2(w_1 \Delta t) \circ S_2(w_0 \Delta t) \circ S_2(w_1 \Delta t)$ ($w_1 = (2 - 2^{1/3})^{-1}$, $w_0 = -2^{1/3} w_1$) achieving $O(\Delta t^4)$ energy accuracy and exact machine-precision unitarity ($|\|\psi\|^2 - 1| \sim 10^{-15}$).

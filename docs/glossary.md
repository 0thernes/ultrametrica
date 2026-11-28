# Glossary (`docs/glossary.md`)

> Alphabetized technical, mathematical, and verification glossary (`A44`). Complements the root [`GLOSSARY.md`](../GLOSSARY.md).

- **Adelic Hybrid Hamiltonian ($H_\theta$):** One-parameter real symmetric operator $\theta R_p D_p^\alpha R_p + (1-\theta) H_{\mathbb{R}}$ coupling Monna-conjugated $p$-adic Vladimirov dispersion with circular Archimedean dispersion on $\mathbb{Z}/p^n\mathbb{Z}$.
- **Aharonov-Bohm Horizon Flux ($\Omega$):** Directed $U(1)$ gauge phase $\theta = \Omega/L$ threaded around the $L$-cycle BTZ horizon ring, producing complex Hermitian hopping $-w_e e^{\pm i\theta}$.
- **Blindspot (Finding Class 10/10):** An unexamined assumption, missing axis, or untested invariant class that previous reviews failed to inspect at all.
- **Breitenlohner-Freedman (BF) Bound ($m_{\mathrm{BF}}^2$):** Discrete AdS stability threshold $m_{\mathrm{BF}}^2 = -(\sqrt{p} - 1)^2$ achieved at $\Delta = 1/2$, with exact squared excess $m^2(\Delta) - m_{\mathrm{BF}}^2 = (p^{\Delta/2} - p^{(1-\Delta)/2})^2 \ge 0$.
- **Bruhat-Tits Tree ($T_p$):** Infinite $(p+1)$-regular acyclic graph serving as the discrete hyperbolic bulk dual to $\mathbb{P}^1(\mathbb{Q}_p)$, truncated in simulation to depth $n$ with $N = p^n$ leaves.
- **Bug (Finding Class 1/10):** Incorrect executable code behavior (e.g., `F02` negative `horizonDepth` coercion, `F14` `ERR_HTTP_HEADERS_SENT` in `server.mjs`).
- **Concern (Finding Class 5/10):** A risk or sensitivity that does not currently fail tests but merits monitoring or explicit bounding (e.g., sub-millisecond JIT variance in benchmarks).
- **Conflict (Finding Class 7/10):** A direct contradiction between two documents, specs, versions, or standards.
- **Dilemma (Finding Class 6/10):** A genuine trade-off with no free lunch requiring an explicit recorded owner decision (e.g., Non-Commercial Cosmogonic License vs. OSI license for Mathlib/JOSS).
- **Error (Finding Class 2/10):** A factual, mathematical, build, or runtime failure (e.g., compiler type error, wrong sign, or stale version number).
- **Gap (Finding Class 8/10):** A missing required artifact, test category, or checklist item (e.g., missing lockfile `B02` or missing `Challenge.lean` comparator setup).
- **Hole (Finding Class 9/10):** A structural weakness in a verification or security check that could allow a false positive or bypass (e.g., `F09` non-nested Lean comment regex).
- **Issue (Finding Class 3/10):** An operational, UX, accessibility, or maintainability defect (e.g., missing WCAG `<label for>` or `aria-pressed`).
- **Kantorovich Duality:** Primal-dual equivalence for 1-Wasserstein optimal transport $W_1(\mu_u, \mu_v) = \sup_{\|\phi\|_{\mathrm{Lip}} \le 1} (\langle \phi, \mu_u\rangle - \langle \phi, \mu_v\rangle)$, formalized over exact integers/rationals in `HolographyCurvature.lean`.
- **Kozyrev Wavelet ($\psi_{j,b,m}$):** Orthonormal compactly supported eigenfunction of $D_p^\alpha$ supported strictly on a single $p$-adic ball $B_j(b)$ with eigenvalue $p^{\alpha(j+1)}$ and exact nonlinear soliton invariance (Theorem III).
- **Modular Picket-Fence Law ($r_0(p,m)$):** Exact alternating spacing-ratio ceiling $\min(2m, p-2m)/\max(2m, p-2m)$ inside valuation-residue sector $W_{0,m}$ (Proposition 4.2), falsifying Wigner-Dyson GOE/GUE thermalization.
- **Monna Involution ($R_p$):** Base-$p$ digit-reversal permutation on $\{0,\dots,p^n-1\}$ mapping $p$-adic balls bijectively to contiguous leaf intervals.
- **Ollivier-Ricci Curvature ($\kappa_e$):** Discrete edge curvature $\kappa(u, v) = 1 - W_1(\mu_u, \mu_v)/a_{uv}$ for non-lazy conductance walks $\mu_u(x) = w_{ux} / W_u$.
- **Problem (Finding Class 4/10):** A high-level credibility, governance, or scientific-framing flaw (e.g., unformed `"0thernes LLC"` entity claim).
- **Ryu-Takayanagi (RT) Cut & Strong Subadditivity (SSA):** Exact global minimum homologous edge cut capacity $S(A) = \min_{W \sim A} \sum_{e \in \partial W} c_e$, universally obeying $S(A \cup B \cup C) + S(B) \le S(A \cup B) + S(B \cup C)$ (Theorem VI).
- **Supercritical Pinch Deficit:** Exact negative breakdown $-2\sum_{e: w_e/W_u + w_e/W_v > 1} (\frac{w_e}{W_u} + \frac{w_e}{W_v} - 1)$ of subcritical bridge Ollivier-Ricci metric-invariance when a strictly interior edge is pinched past $w_e/W_u + w_e/W_v > 1$ (single-edge threshold $\sigma_e^* = -\ln p$ for prime integer $p \ge 2$, conductance $w_e = 1/a_e = e^{-\sigma_e}$, Theorems V & V-Global).
- **Tate-Curve BTZ Quotient ($T_p / p^{h\mathbb{Z}}$):** Discrete genus-1 black hole graph formed by identifying depths $< h$ into a closed horizon ring of circumference $L = p^h \ge 3$ with Euler characteristic $\chi = 0$.
- **Vladimirov Operator ($D_p^\alpha$):** Non-local $p$-adic fractional pseudo-differential operator diagonalized by the Pontryagin Fourier transform with eigenvalues $|\xi_k|_p^\alpha$.
- **Yoshida 4th-Order Integrator:** Symmetric 3-stage symplectic operator splitting achieving $O(\Delta t^4)$ energy error and machine-precision $L^2$ norm conservation.

# Limitations, Scope Boundaries & Threats to Validity

> Build Standard `B41` & Playbook Section 5 compliance. Every limitation below is stated plainly so reviewers, students, and automated audits can immediately see where ULTRAMETRICA's (`v1.7.0`) guarantees stop. See also [`SUBMISSION_READINESS.md`](SUBMISSION_READINESS.md).

## 1. What ULTRAMETRICA Does NOT Claim

1. **No Empirical Physics Discovery:** ULTRAMETRICA is a mathematical-physics, formal-verification, and computational laboratory. It makes **no claim** of experimental discovery of new physical laws of nature, quantum gravity measurements, or astrophysical black hole observations. Earlier releases described the project as a `"Quantum Gravity Engine"` or `"Holographic Quantum Gravity"`; following the 2026-11-26 statement audit, that wording has been completely withdrawn across all source code, CSS comments (`F68`), paper, and documentation because all formal and computational evidence concerns a discrete $p$-adic (Bruhat-Tits tree) holography model only.
2. **Zero Full Solutions to Unsolved Mega-Atlas Problems (`0 / 1,900`):** A full cross-check against all `1,900` open problems in [`0thernes/unsolved-problems-mega-atlas`](https://github.com/0thernes/unsolved-problems-mega-atlas) confirms that ULTRAMETRICA solves **zero** open problems completely (see [`docs/MEGA_ATLAS_CROSSCHECK.md`](docs/MEGA_ATLAS_CROSSCHECK.md)). It provides exact discrete finite-cutoff sub-results related to `SUB-032` ($p$-adic AdS/CFT) and a negative-result falsification of naive GOE/GUE thermalization in Monna-conjugated adelic hybrids (`ANL-065`/`QM-016`), while leaving continuum limits ($n \to \infty$), full adelic unification over $\mathbb{A}_{\mathbb{Q}}$, and $p$-adic quantum chaos open.
3. **Not Peer-Reviewed:** The accompanying white paper (`dist/Donahue_2026_Ultrametrica.pdf`) and markdown reports are independent research preprints. Machine-checked Lean 4 proofs certify logical validity of the formalized statements within the Lean 4 kernel (with the 12 isolated comparator targets and their dependency closure also checked across 5 additional independent kernels plus a live negative tamper-rejection gate in Ubuntu CI), not mathematical novelty, physical applicability, or external journal endorsement.
4. **No Physical Reality Claim for Metaphorical Labels:** Interactive UI and acoustic terms use physics-inspired terminology that must be distinguished strictly from formal theorems (see Section 2).

---

## 2. Literal Mathematical Objects vs. Metaphorical / Pedagogical Labels

| Term Used in Observatory / Docs | Literal Mathematical Definition in ULTRAMETRICA | What It Is **NOT** |
|---|---|---|
| **$p$-adic AdS/CFT bulk** | Finite cutoff $(p+1)$-regular Bruhat-Tits tree $T_p$ of depth $n$ with discrete Klein-Gordon operator and Gubser mass $m^2(\Delta) = p^\Delta + p^{1-\Delta} - (p+1)$ | Not a UV-complete continuum string theory or full 4D Lorentzian quantum gravity |
| **Rotating Kerr-BTZ black hole** | Discrete Schottky/Tate-curve quotient $T_p / p^{h\mathbb{Z}}$ ($L = p^h \ge 3$) with $U(1)$ Aharonov-Bohm horizon flux $\Omega$ | Not an exact discrete solution of 3+1D vacuum Einstein equations with an ergosphere |
| **Dynamic edge-length gravity** | Damped second-order wave equation on tree edges $\ddot{\sigma}_e + \gamma \dot{\sigma}_e = c^2 \Delta_{\mathrm{line}} \sigma_e - \kappa T_e$ inspired by Gubser et al. (2017) (`numerical_approximation`) | Not a diffeomorphism-invariant canonical quantization of general relativity |
| **Ryu-Takayanagi entropy** | Exact global minimum homologous edge cut $\sum_{e \in \gamma_A} w_e \ln p$ on a finite weighted graph | Not a von Neumann entropy computed from an explicit infinite-dimensional CFT state |
| **Reality Split / Euclidean twin** | Side-by-side comparison of Vladimirov $D_p^\alpha$ evolution against circular Archimedean $(2\pi\min(k,N-k))^\alpha$ evolution on the same grid $\mathbb{Z}/p^n\mathbb{Z}$ | Not a multiverse or physical spacetime splitting claim |
| **Prime-power acoustics (AudioWorklet)** | Sonification mapping Vladimirov shells $p^{\alpha(j+1)}$ and horizon flux to audible sine oscillators ($2^x, 3^x, 5^x, 7^x$) | Not physical acoustic waves in a $p$-adic medium |

---

## 3. Formal-Verification Boundary (What Lean 4 Does vs. Does Not Prove in `v1.7.0`)

- **Inside the Lean 4 Kernel (`202` Audited Declarations across 8 Proof Modules, all 13 `.lean` files `< 1,000` lines):** Transparently partitioned into **127 core theorems & corollaries**, **56 zero-Mathlib helper lemmas**, **7 adversarial false-variant refutations** (`AdversarialTests.lean`), and **12 isolated comparator target bindings** (never double-counted as extra discoveries) — all checked by Lean (`lake build`, `leanchecker`, and Ubuntu CI `lake check --paranoid`), with the **12 comparator targets in `lean/comparator.json` and their dependency closure** verified across 6 independent kernels (`lean4`, `leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin`) via `lake comparator --paranoid` plus a live negative tamper-rejection gate (`scripts/test_lean_negative.py`) in Ubuntu CI:
  - Universal base-$p$ Monna digit reversal (involution, bijectivity, complement commutation, ball contiguity), concrete `bruhatTitsUltrametric`, subtree-shift prefix preservation, sector-index parity lemmas, and monotonicity/alternating gaps of `picketSeq`.
  - **Closed in `v1.7.0` (`VladimirovOperator.lean`, Target 12):** Exact finite-level $p$-adic valuation `padicDistVal` on $\mathbb{Z}/p^n\mathbb{Z}$ (strong triangle inequality, sharp isosceles law, complement invariance), the **actual discrete radial ultrametric / Vladimirov convolution operator** `ultrametricOp p n K`, **actual discrete Kozyrev-Haar wavelets** `kozyrevHaar` (zero mean + exact scale-only eigenfunction identity for all $p \ge 2, n, j < n, c < p^n$, radial kernel $K$, and zero-sum $a : \mathrm{Fin}\,p \to \mathbb{Z}$, extending to complex characters by $\mathbb{C}$-linearity), and exact complement-involution commutation $[D_K, J] = 0$ + even/odd $J$-parity preservation.
  - Kantorovich primal-dual lower bounds and explicit **kernel-verified non-negative** attaining plans for both the 3-class BTZ cost model and the arbitrary-degree inhomogeneous bridge-edge cost model.
  - **Closed in `v1.7.0` (`FiniteGraphGaussBonnet.lean`, Target 11):** Direct double-counting induction **over an arbitrary finite undirected weighted edge list `E : List (WeightedEdge n)` on `Fin n`** proving $\sum_{e \in E} \kappa_e = -(p - 1) n - \sum_{e \in E} \mathrm{def}_e$ identically in exact `RatQ` (and metric-independent invariance across any two subcritical conductance assignments on `Fin n`).
  - Pointwise nonlinearity splitting over $\mathbb{Z}[i]$ for arbitrary finite lists of disjoint constant-modulus packets, the integer inequality $1 \le 1 + wq$ under explicit hypotheses $w, q \ge 0$, abstract arbitrary-dimension $L$ rank-1 Hermitian Sherman-Morrison identity, edge-level flux parity identities, universal graph-cut strong subadditivity on arbitrary finite `Nat`-weighted graphs, `7` adversarial false-variant refutations, and `10/10` concrete non-vacuity witnesses.
- **Helper lemmas & sanity witnesses:** Seven small `CInt` helper lemmas (`add_smul`, `add_zero_left`, `add_zero_right`, `int_sq_nonneg`, `normSq_nonneg`, `normSq_zero`, `smul_zero`) are transitively checked through audited theorems invoking them.
- **Still NOT formalized in Lean (explicitly outside the kernel):**
  1. Full complex Fourier-basis hybrid Hamiltonian $H_\theta = \theta R_p D_p^\alpha R_p + (1-\theta)H_{\mathbb{R}}$ block diagonalization and doublet counting (paper proof cross-checked by exact arithmetic & float64 up to $N = 625$).
  2. Continuum PDE time evolution $i\partial_t \psi = (D_p^\alpha + F(|\psi|^2))\psi$ (numerical Yoshida integrator in Exp C & F).
  3. The $O(V)$ floating-point Schur-complement bulk solver, positivity of $T$ above the BF bound, and BF stability down to $\Delta = 0.5001$ (verified via exact $\mathbb{Q}(i)$ solve in `verify_exact.py` and Exp D/H).
  4. The symmetry reduction from couplings on full $(p+2)$-neighbor BTZ sets to the 3-class reduced model (paper-level argument cross-checked on the full graph via 45 exact `Fraction` solves).
  5. Note on `FiniteGraphGaussBonnet.lean`: `finite_graph_curved_gauss_bonnet_sum` sums the bridge-edge curvature formula `curvedGenKappaQ` over arbitrary finite weighted edge lists `E : List (WeightedEdge n)` on `Fin n`; connecting `curvedGenKappaQ` to edge-by-edge $W_1$ requires each edge to be a bridge of a $(p+1)$-regular tree (e.g., strictly interior edges of $T_p$).
- **Known prior results:** Base-$p$ Monna properties (Monna 1970), Kozyrev wavelet eigenfunctions (Kozyrev 2002), and discrete graph-cut strong subadditivity (Headrick & Takayanagi 2007) are established literature formalized cleanly here with zero priority claimed.
- **Outside the Lean 4 Kernel (`numerical_approximation` — IEEE-754 float64):**
  - IEEE-754 float64 Radix-$p$ FFT accuracy, Yoshida $\Delta t^4$ time integration, and Jacobi eigensolver convergence (`test/verify.mjs`, `test/mutants.mjs` 10/10 real source mutants, `test/properties.mjs`, `reference/padic_oracle.py`).
  - Asymptotic $n \to \infty$ analytic proof of $\langle r\rangle_{W_{0,m}} \to r_0(p,m)$ for general $\alpha > 0$ (verified numerically up to $N = 625$ and statistically in pre-registered Experiment I + [`DEVIATIONS.md`](DEVIATIONS.md)).
  - WebGL2 rendering, AudioWorklet DSP audio output, and HTTP network transport (`test/server.mjs`, `test/fuzz.mjs`, `test/concurrency.mjs` + live Chromium QA).

---

## 4. Computational, Finite-$N$, and Platform Constraints

1. **Finite-Cutoff Tree Boundary Effect:** Theorem V / V-Global holds on strictly interior edges whose endpoints both have full $(p+1)$-regular degree. On a finite cutoff tree of depth $n$, strictly interior perturbations require `n >= 4` and `2 <= depth(u), depth(v) <= n - 2`.
2. **Dimension Cap ($N \le 65{,}536$):** `PadicSpace` caps $N = p^n \le 65{,}536$ to prevent OOM and quadratic $O(N^2)$ visual stalls; `vladimirovSpectrum` and `archimedeanSpectrum` reject float64-overflowing exponents (`F76`).
3. **Real-Time Browser & Audio Requirements:** Live 3D rendering requires WebGL2 (graceful fallback displayed otherwise); AudioWorklet requires a user gesture and a secure context (`https://` or `localhost`/`127.0.0.1`).
4. **Windows vs. Linux `lake comparator` Sandboxing:** `lake comparator --paranoid` enforces `bubblewrap` (`bwrap`) Linux user-namespace sandboxing on Linux (executed natively in Ubuntu GitHub Actions CI, alongside `scripts/test_lean_negative.py --with-comparator`).
5. **Non-Commercial License Constraint:** `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` is source-available non-commercial (not OSI-approved open source). Downstream commercial reuse, Mathlib upstreaming, or JOSS submission requires an explicit licensing decision by the author.

# Limitations, Scope Boundaries & Threats to Validity

> Build Standard `B41` & Playbook Section 5 compliance. Every limitation below is stated plainly so reviewers, students, and automated audits can immediately see where ULTRAMETRICA's guarantees stop.

## 1. What ULTRAMETRICA Does NOT Claim

1. **No Empirical Physics Discovery:** ULTRAMETRICA is a mathematical-physics, formal-verification, and computational laboratory. It makes **no claim** of experimental discovery of new physical laws of nature, quantum gravity measurements, or astrophysical black hole observations.
2. **Zero Full Solutions to Unsolved Mega-Atlas Problems (`0 / 1,900`):** A full cross-check against all `1,900` open problems in [`0thernes/unsolved-problems-mega-atlas`](https://github.com/0thernes/unsolved-problems-mega-atlas) confirms that ULTRAMETRICA solves **zero** open problems completely (see [`docs/MEGA_ATLAS_CROSSCHECK.md`](docs/MEGA_ATLAS_CROSSCHECK.md)). It provides exact discrete finite-cutoff sub-results related to `SUB-032` ($p$-adic AdS/CFT) and a negative-result falsification of naive GOE/GUE thermalization in Monna-conjugated adelic hybrids (`ANL-065`/`QM-016`), while leaving continuum limits ($n \to \infty$), full adelic unification over $\mathbb{A}_{\mathbb{Q}}$, and $p$-adic quantum chaos open.
3. **Not Peer-Reviewed:** The accompanying white paper (`dist/Donahue_2026_Ultrametrica.pdf`) and markdown reports are independent research preprints. Machine-checked Lean 4 proofs certify logical validity of formalized statements within the Lean 4 kernel (and 5 independent external kernels), not mathematical novelty, physical applicability, or external journal endorsement.
4. **No Physical Reality Claim for Metaphorical Labels:** Interactive UI and acoustic terms use physics-inspired terminology that must be distinguished strictly from formal theorems (see Section 2).

---

## 2. Literal Mathematical Objects vs. Metaphorical / Pedagogical Labels

| Term Used in Observatory / Docs | Literal Mathematical Definition in ULTRAMETRICA | What It Is **NOT** |
|---|---|---|
| **$p$-adic AdS/CFT bulk** | Finite cutoff $(p+1)$-regular Bruhat-Tits tree $T_p$ of depth $n$ with discrete Klein-Gordon operator and Gubser mass $m^2(\Delta) = p^\Delta + p^{1-\Delta} - (p+1)$ | Not a UV-complete continuum string theory or full 4D Lorentzian quantum gravity |
| **Rotating Kerr-BTZ black hole** | Discrete Schottky/Tate-curve quotient $T_p / p^{h\mathbb{Z}}$ ($L = p^h \ge 3$) with $U(1)$ Aharonov-Bohm horizon flux $\Omega$ | Not an exact discrete solution of 3+1D vacuum Einstein equations with an ergosphere |
| **Dynamic edge-length gravity** | Damped second-order wave equation on tree edges $\ddot{\sigma}_e + \gamma \dot{\sigma}_e = c^2 \Delta_{\mathrm{line}} \sigma_e - \kappa T_e$ inspired by Gubser et al. (2017) | Not a diffeomorphism-invariant canonical quantization of general relativity |
| **Ryu-Takayanagi entropy** | Exact global minimum homologous edge cut $\sum_{e \in \gamma_A} w_e \ln p$ on a finite weighted graph | Not a von Neumann entropy computed from an explicit infinite-dimensional CFT state |
| **Reality Split / Euclidean twin** | Side-by-side comparison of Vladimirov $D_p^\alpha$ evolution against circular Archimedean $(2\pi\min(k,N-k))^\alpha$ evolution on the same grid $\mathbb{Z}/p^n\mathbb{Z}$ | Not a multiverse or physical spacetime splitting claim |
| **Prime-power acoustics (AudioWorklet)** | Sonification mapping Vladimirov shells $p^{\alpha(j+1)}$ and horizon flux to audible sine oscillators ($3^x$ tritaves, $5^x$ pentaves, $7^x$ heptaves) | Not physical acoustic waves in a $p$-adic medium |

---

## 3. Formal-Verification Boundary (What Lean 4 Does vs. Does Not Prove)

- **Inside the Lean 4 Kernel (+ 6-Kernel Comparator):** All 120 exported declarations in `lean/UltrametricaProofs/` and all 8 specification targets in `lean/Challenge.lean` / `lean/Solution.lean` — covering universal base-$p$ Monna involution, ball contiguity, subtree-shift ultrametric isometry, sector completeness, prime-parity dichotomy, modular picket-fence spacing gaps, literal $L$-cycle Kantorovich primal-dual BTZ Ollivier-Ricci curvature ($L_c = 5$ trichotomy), curved AdS single-edge & global multi-edge Gauss-Bonnet charge decomposition, arbitrary $K$-ball compacton-soliton invariance, arbitrary-dimension complex Hermitian Sherman-Morrison algebra & flux parity, and universal discrete Ryu-Takayanagi Strong Subadditivity.
- **Outside the Lean 4 Kernel:**
  - IEEE-754 double-precision floating-point Radix-$p$ FFT accuracy, Yoshida $\Delta t^4$ time integration, and Jacobi eigensolver convergence (`test/verify.mjs`, `test/properties.mjs`, `reference/padic_oracle.py`).
  - Asymptotic $n \to \infty$ analytic proof of $\langle r\rangle_{W_{0,m}} \to r_0(p,m)$ for general $\alpha > 0$ (verified numerically up to $N = 625$ in Experiments E, G, and pre-registered Experiment I, not formally proved in the $n \to \infty$ limit).
  - WebGL2 rendering, AudioWorklet DSP audio output, and HTTP network transport (`test/server.mjs` + browser QA).

---

## 4. Computational, Finite-$N$, and Platform Constraints

1. **Finite-Cutoff Tree Boundary Effect:** Theorem V / V-Global holds on strictly interior edges whose endpoints both have full $(p+1)$-regular degree. On a finite cutoff tree of depth $n$, the root has degree $p$ and leaves have degree $1$, so strictly interior perturbations require `n >= 4` and `2 <= depth(u), depth(v) <= n - 2`.
2. **Dimension Cap ($N \le 65{,}536$):** `PadicSpace` caps $N = p^n \le 65{,}536$ to prevent browser/Node OOM and quadratic $O(N^2)$ visual panel stalls. Interactive WebGL2 presets operate comfortably at $N \le 343$.
3. **Real-Time Browser & Audio Requirements:** Live 3D rendering requires WebGL2 (a graceful fallback message is displayed if unavailable); AudioWorklet requires a user gesture and a secure context (`https://` or `localhost`/`127.0.0.1`).
4. **Windows vs. Linux `lake comparator` Sandboxing:** `lake comparator --paranoid` enforces `bubblewrap` (`bwrap`) Linux user-namespace sandboxing on Linux (executed natively in Ubuntu GitHub Actions CI). On Windows hosts, local verification runs `leanchecker --fresh`, `leanchecker-paranoid --fresh`, `lean4lean --fresh`, and `lake comparator --paranoid --inadvisably-no-sandbox` over exported NDJSON files; full sandboxed comparator assurance comes from the clean Ubuntu CI runner.
5. **Non-Commercial License Constraint:** `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` is source-available non-commercial (not OSI-approved open source). Downstream commercial reuse, Mathlib upstreaming, or JOSS submission would require an explicit licensing grant or dual-licensing decision by the author.

# Verification, Falsifiability & Authentication Protocol

**ULTRAMETRICA (v1.0.0)** is engineered to be **Provable**, **Falsifiable**, **Verifiable**, and **Authenticated** across three independent layers: (1) pure Lean 4 kernel proofs, (2) zero-dependency deterministic Node.js theorem & discovery suites, and (3) live real-time WebGL2 invariant telemetry.

---

## 1. Independent One-Command Reproduction

```bash
# Layer 1 — Run all 9 executable mathematical & physical theorem suites
npm test

# Layer 2 — Reproduce all 4 discovery benchmark tables (writes results/discovery-benchmarks.json)
npm run discover

# Layer 3 — Clean-build all 24 Lean 4 (v4.35.0) formal proofs & print kernel axiom audit
cd lean && lake clean && lake build

# Layer 4 — Launch live interactive WebGL2 + AudioWorklet observatory
npm start
# Open http://localhost:4173
```

---

## 2. Explicit Proof Boundaries (What Each Layer Proves)

| Layer | Trusted Computing Base | What Is Proved | Explicit Boundary (Not Covered Here) |
|---|---|---|---|
| **Lean 4 (`lean/`)** | Lean `v4.35.0` kernel + standard axioms (`propext`, `Quot.sound`, `Classical.choice` max; `0` `sorryAx`, `0` custom axioms) | Exact algebraic, ultrametric, combinatorial, rational-curvature, compacton-soliton, and Hermitian PSD/Sherman-Morrison non-singularity theorems (24 audited declarations) | Floating-point FFT/PDE conservation, continuous $\mathbb{R}$ diagonalization, GPU shaders, and AudioWorklet DSP |
| **Executable Suite (`test/verify.mjs`)** | Node.js IEEE-754 `Float64` (`node:test`) | 9 numerical theorems covering FFT exactness vs. naive DFT, Kozyrev eigenfunctions, strong triangle + tree isometry, Yoshida $\Delta t^4$ scaling, bulk KG residual $< 10^{-11}$, Gubser analytic propagator $< 10^{-12}$, Ollivier-Ricci curvature, brute-force RT DP match, Adelic Fourier block leak $< 10^{-12}$, and unified BTZ curvature law | Finite tested parameter sets ($p \in \{2,3,5,7\}$); not formal universal quantification |
| **Discovery Benchmarks (`scripts/discover.mjs`)** | Deterministic Jacobi symmetric eigensolver + SPFA optimal transport + Yoshida integrator | Reproducible quantitative tables in [results/discovery-benchmarks.json](results/discovery-benchmarks.json) | Empirical numerical measurements up to $N = 125$ (exact dense spectrum) and $N = 243$ (time evolution) |
| **Live Observatory (`src/web/`)** | WebGL2 + WebAudio browser runtime | Real-time display of live uneliminated bulk residual (`~1e-16`), norm drift (`~1e-15`), Ricci curvature, RT entropy, and Reality Split leakage | Visual/acoustic presentation layer |

---

## 3. Falsification Protocol (How to Break Any Claim)

We explicitly invite counterexamples and prior-literature challenges via our [Falsification Issue Template](.github/ISSUE_TEMPLATE/falsification.yml). Any single item below falsifies the corresponding claim:

1. **To falsify Theorem I (Adelic Parity-Doubling & Block Decomposition):** Produce any prime $p$, depth $n$, exponent $\alpha > 0$, or $\theta \in (0, 1)$ where (a) the Fourier-basis Monna-conjugated Vladimirov matrix has any cross-sector entry $|M_{jk}| > 10^{-11}$ between distinct $(v_p(k), (k/p^v)\bmod p)$ sectors, OR (b) an odd prime $p \ge 3$ produces $> (p^n + 1)/2$ distinct eigenvalues of $H_\theta$.
2. **To falsify Theorem II (Unified BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy):** Produce any $p \ge 2, L \ge 3$ uniform Tate-curve BTZ graph where exact non-lazy 1-Wasserstein optimal transport differs from $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$ by $> 10^{-12}$.
3. **To falsify Theorem III (Multi-Ball Kozyrev Compacton-Solitons):** Produce any local nonlinearity $F(|\psi|^2)$ and disjoint-ball Kozyrev wavelet superposition that radiates $> 10^{-11}$ probability outside its initial support under $D_p^\alpha + F(|\psi|^2)$.
4. **To falsify Theorem IV (Kerr-BTZ Bulk Solver):** Produce any curved positive edge weights $w_e > 0$ and horizon flux $\Omega \in [-\pi, \pi]$ (with $\Delta \ge 0.52$) where the $O(V)$ Schur + Sherman-Morrison solver divides by zero or produces an uneliminated Klein-Gordon residual $> 10^{-11}$.
5. **To challenge formal soundness:** Detect `sorryAx` or any non-standard axiom in `cd lean && lake clean && lake build`, or reproduce a compilation failure under `leanprover/lean4:v4.35.0`.

---

## 4. Authenticated Cryptographic Digests (SHA-256, Release `v1.0.0`)

Verify artifact integrity locally via `sha256sum` (Linux/macOS) or `Get-FileHash <file> -Algorithm SHA256` (Windows PowerShell):

```text
2384eedc1a7d37e8b92cbe6eb7ff55851db96dec962af246b6bffb4edc710b49  src/engine/padic.js
5b5bd8c2b7c69e9f0799866beec710bc3865dfe1426f722b209e48a2bf31eedb  src/engine/holography.js
20530145dc0429a0459b94c11b7ed6d7e16fd46fe1360621954871c01c2da5ec  src/engine/quantum.js
f89eed6699967925a50f45bc042784e4f9fe186ef23da48b7394cb9ff6f8321c  src/engine/simulation.js
f3731d0dffb2b67471105e6def981a769d2c1ba495c70b8fc2e18965f92ffd8b  test/verify.mjs
cdb2f7d1200392fb6e7142cc97c15b1042a5e293226882286cc91de622e4349b  scripts/discover.mjs
4ba44950e63868ce39c9f09d2fc41b66d0c7409d9f171f5fd9f53714cc0f3def  lean/UltrametricaProofs.lean
a04973d451e368bc54d5018892c0247a9c3821adad460192c93dce02bfa52434  lean/UltrametricaProofs/Basic.lean
8bed479e2057f3f331185c83e2d7fcdcf6944090784cc084ba8f9a4f12ad5daf  lean/UltrametricaProofs/AdelicSymmetry.lean
b7844e1b0f186dad23f08f38c141dcff8e707d5bf3386f58e8437e731aa9f96a  lean/UltrametricaProofs/HolographyCurvature.lean
e85f1e7b0323fd94ea1a2fdea308e875768fbc4a4fa461de613f9e26ed2d22e2  lean/UltrametricaProofs/SolitonAndSolver.lean
9e0de078526b6f6c050147a27161a6386adcebd6fcd07881b5e77ae735196b6e  results/lean4-audit.txt
118be23908bdf40f90fddb50f45e2e9ef414b3b7e71a968d77a771309b688ca8  results/discovery-benchmarks.json
93f604e6f5356805d0b8b51344de7d5e35718c8389bc68cdea62e3c5f0aed935  LICENSE
```

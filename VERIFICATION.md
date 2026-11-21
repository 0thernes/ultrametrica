# Verification, Falsifiability & Authentication Protocol

**ULTRAMETRICA (v1.1.0)** is engineered to be **Provable**, **Falsifiable**, **Verifiable**, and **Authenticated** across four independent layers: (1) pure Lean 4 (`v4.35.0`) kernel proofs (`36` audited declarations), (2) zero-dependency exact-rational Python (`fractions.Fraction` & $\mathbb{Q}(i)$) falsification, (3) deterministic Node.js 9-theorem & discovery suites, and (4) zero-warning AMS-LaTeX PDF + standalone arXiv build & live WebGL2 telemetry.

---

## 1. Independent One-Command Reproduction

```bash
# Layer 1 — Run all 9 executable mathematical & physical theorem suites
npm test

# Layer 2 — Run independent exact-rational (fractions.Fraction & Q(i)) falsifier
python scripts/verify_exact.py

# Layer 3 — Reproduce all 4 discovery benchmark tables (writes results/discovery-benchmarks.json)
npm run discover

# Layer 4 — Clean-build Lean 4 library & audit all 36 declarations via VerifyAxioms.lean
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# Layer 5 — Regenerate vector figures, zero-warning AMS-LaTeX PDF, & standalone arXiv tarball
python scripts/generate_figures.py
python scripts/package_dist.py

# Layer 6 — Launch live interactive WebGL2 + 48 kHz AudioWorklet observatory
npm start
# Open http://localhost:4173 (or set PORT=4174)
```

---

## 2. Explicit Proof Boundaries (What Each Layer Proves)

| Layer | Trusted Computing Base | What Is Proved | Explicit Boundary (Not Covered Here) |
|---|---|---|---|
| **Lean 4 (`lean/`)** | Lean `v4.35.0` kernel + standard axioms (`propext`, `Classical.choice`, `Quot.sound` max; `0` `sorryAx`, `0` custom axioms) | Exact algebraic, ultrametric, combinatorial, rational-curvature, compacton-soliton, and Hermitian PSD/Sherman-Morrison non-singularity theorems (**36 audited declarations** in [`lean/VerifyAxioms.lean`](lean/VerifyAxioms.lean)) | Floating-point FFT/PDE conservation, continuous $\mathbb{R}$ diagonalization, GPU shaders, and AudioWorklet DSP |
| **Exact-Rational Falsifier (`scripts/verify_exact.py`)** | Python 3 stdlib exact arbitrary-precision `int` & `fractions.Fraction` | 7,033 conjugate Adelic pairs ($p \le 19$); exact zero-rounding 1-Wasserstein optimal transport across 45 $(p, L)$ BTZ horizons; exact $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison solve; benchmark & Lean audit cross-check | Finite tested primes & horizons; complements Lean universal proofs |
| **Executable Suite (`test/verify.mjs`)** | Node.js IEEE-754 `Float64` (`node:test`) | 9 numerical theorems covering FFT exactness vs. naive DFT, Kozyrev eigenfunctions, strong triangle + tree isometry, Yoshida $\Delta t^4$ scaling, bulk KG residual $< 10^{-11}$, Gubser analytic propagator $< 10^{-12}$, Ollivier-Ricci curvature, brute-force RT DP match, Adelic Fourier block leak $< 10^{-12}$, and unified BTZ curvature law | Finite tested parameter sets ($p \in \{2,3,5,7\}$); not formal universal quantification |
| **Discovery Benchmarks (`scripts/discover.mjs`)** | Deterministic Jacobi symmetric eigensolver + SPFA optimal transport + Yoshida integrator | Reproducible quantitative tables in [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) | Empirical numerical measurements up to $N = 125$ (exact dense spectrum) and $N = 243$ (time evolution) |
| **Manuscript & Live Observatory** | Tectonic `0.17.0` + WebGL2 + WebAudio | Zero-warning AMS-LaTeX PDF ([`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf)) + standalone arXiv bundle ([`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) + live invariants (`~1e-16` residual, `~1e-15` norm drift) | Presentation & visualization layers |

---

## 3. Falsification Protocol (How to Break Any Claim)

We explicitly invite counterexamples and prior-literature challenges via our [Falsification Issue Template](.github/ISSUE_TEMPLATE/falsification.yml). Any single item below falsifies the corresponding claim:

1. **To falsify Theorem I (Adelic Parity-Doubling & Block Decomposition):** Produce any prime $p$, depth $n$, exponent $\alpha > 0$, or $\theta \in (0, 1)$ where (a) the Fourier-basis Monna-conjugated Vladimirov matrix has any cross-sector entry $|M_{jk}| > 10^{-11}$ between distinct $(v_p(k), (k/p^v)\bmod p)$ sectors, OR (b) an odd prime $p \ge 3$ produces $> (p^n + 1)/2$ distinct eigenvalues of $H_\theta$.
2. **To falsify Theorem II (Unified BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy):** Produce any $p \ge 2, L \ge 3$ uniform Tate-curve BTZ graph where exact non-lazy 1-Wasserstein optimal transport differs from $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$.
3. **To falsify Theorem III (Multi-Ball Kozyrev Compacton-Solitons):** Produce any local nonlinearity $F(|\psi|^2)$ and disjoint-ball Kozyrev wavelet superposition that radiates $> 10^{-11}$ probability outside its initial support under $D_p^\alpha + F(|\psi|^2)$.
4. **To falsify Theorem IV (Kerr-BTZ Bulk Solver):** Produce any curved positive edge weights $w_e > 0$ and horizon flux $\Omega \in [-\pi, \pi]$ (with $\Delta \ge 0.52$) where the $O(V)$ Schur + Sherman-Morrison solver divides by zero or produces an uneliminated Klein-Gordon residual $> 10^{-11}$.
5. **To challenge formal soundness:** Detect `sorryAx` or any axiom outside `[propext, Classical.choice, Quot.sound]` in `cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean`.

---

## 4. Authenticated Cryptographic Digests (SHA-256, Release `v1.1.0`)

Verify artifact integrity locally via `sha256sum` (Linux/macOS) or `Get-FileHash -LiteralPath <file> -Algorithm SHA256` (Windows PowerShell):

```text
2384eedc1a7d37e8b92cbe6eb7ff55851db96dec962af246b6bffb4edc710b49  src/engine/padic.js
5b5bd8c2b7c69e9f0799866beec710bc3865dfe1426f722b209e48a2bf31eedb  src/engine/holography.js
20530145dc0429a0459b94c11b7ed6d7e16fd46fe1360621954871c01c2da5ec  src/engine/quantum.js
f89eed6699967925a50f45bc042784e4f9fe186ef23da48b7394cb9ff6f8321c  src/engine/simulation.js
f3731d0dffb2b67471105e6def981a769d2c1ba495c70b8fc2e18965f92ffd8b  test/verify.mjs
cdb2f7d1200392fb6e7142cc97c15b1042a5e293226882286cc91de622e4349b  scripts/discover.mjs
099f439e9d6a36d64c012118105dae9530301ccca25626c394d476b284ec20ce  scripts/verify_exact.py
14b7d0f783f7dcbd50206b3ae099fec37825140abfdaaa8c82e05c2cc710f797  scripts/generate_figures.py
4413ce4318c3f175be968b24519d571f6d91befeef3265c4c4530d71783669ea  scripts/package_dist.py
6f3c84fa920192331cc9595f31ddae39dcdd9c4dafc270c59c63639091d37dbc  lean/UltrametricaProofs.lean
dab5acf023693bc752a0b4f95d3df1b32f32f1c8e1bee1a547163f3ef99835e8  lean/VerifyAxioms.lean
a04973d451e368bc54d5018892c0247a9c3821adad460192c93dce02bfa52434  lean/UltrametricaProofs/Basic.lean
8bed479e2057f3f331185c83e2d7fcdcf6944090784cc084ba8f9a4f12ad5daf  lean/UltrametricaProofs/AdelicSymmetry.lean
b7844e1b0f186dad23f08f38c141dcff8e707d5bf3386f58e8437e731aa9f96a  lean/UltrametricaProofs/HolographyCurvature.lean
e85f1e7b0323fd94ea1a2fdea308e875768fbc4a4fa461de613f9e26ed2d22e2  lean/UltrametricaProofs/SolitonAndSolver.lean
94ca9e61cad75001802a311c254949ebf279815e62edcacf3655f0909a9794b2  paper/main.tex
ed9a6de6d1ac78637b9edfcfbc729bfc31f8e221cd93f3b102e3dbc5c0f3bcee  paper/refs.bib
43258869c2f907eae0d787cf1370ddf41ec1b738cb0371ccb0c385b46cc66185  paper/WHITE_PAPER.md
7ce392ff2c772c6714d67737fc0c1d14e19a2a891193b71cb65de2f6aefb653c  dist/Donahue_2026_Ultrametrica.pdf
d53caf2d51ca5434ca072b70d9de4acda2e06d43f90c36676096c02dd371a269  dist/arxiv_submission.tar.gz
79210c8239e7538150c97ef8f929df052fecbfa25dcc7541b74bfcb74021eb29  results/lean4-audit.txt
118be23908bdf40f90fddb50f45e2e9ef414b3b7e71a968d77a771309b688ca8  results/discovery-benchmarks.json
93f604e6f5356805d0b8b51344de7d5e35718c8389bc68cdea62e3c5f0aed935  LICENSE
```

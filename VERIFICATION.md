# Verification, Falsifiability & Authentication Protocol (`v1.4.1`)

**ULTRAMETRICA (`v1.4.1`)** is engineered to be **Provable**, **Falsifiable**, **Verifiable**, and **Authenticated** across seven independent layers: (1) pure Lean 4 (`v4.35.0`, `autoImplicit = false`) kernel proofs (**120 audited declarations** + **8 isolated `Spec`/`Challenge`/`Solution` targets** verified across `Lean 4.35.0`, `leanchecker`, `leanchecker-paranoid`, `con-leche`, `con-ron`, `nanoda_bin 0.4.19`, plus `lean4lean` inside Linux `bubblewrap` `lake comparator --paranoid` in CI), (2) zero-dependency exact-rational Python (`int`, `fractions.Fraction`, $\mathbb{Q}(i)$, and exhaustive brute-force) falsification across Theorems I–VI + independent textbook differential oracle (`reference/padic_oracle.py`), (3) deterministic Node.js `26`-test suite (`10` theorems, `8/8` planted negative mutants killed, `3,200+` seeded property/metamorphic/negative tests, HTTP contract + disk `EIO` failure injection, golden snapshot) + `3` runnable examples, (4) git-sealed pre-registered confirmatory Experiment I (`docs/preregistration.md`, `c171b1b` -> `4/4` confirmed at `p_holm = 0.0004`) + hardware-tagged performance budgets (`scripts/bench.mjs`), (5) zero-warning AMS-LaTeX PDF (5 vector figures) + standalone arXiv bundle, (6) bit-exact cryptographic manifests (`CHECKSUMS.sha256` & `data/MANIFEST.sha256` + SLSA release provenance), and (7) verbatim README `#print axioms` check (`scripts/check_readme_axioms.py`).

---

## 1. Independent One-Command Reproduction

```bash
# Layer 1 — Run all 10 executable theorems + 8 planted negative mutants (8/8 killed)
npm run verify:all

# Layer 2 — Run independent exact-rational falsifier (Theorems I-V), metadata audit & SHA-256 verification
python scripts/verify_exact.py --check-checksums
sha256sum -c CHECKSUMS.sha256

# Layer 3 — Reproduce all 8 discovery benchmark datasets (Exp A-H -> results/discovery-benchmarks.json)
npm run discover

# Layer 4 — Clean-build Lean 4 library & audit all 101 declarations via VerifyAxioms.lean
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# Layer 5 — Regenerate 5 vector figures, zero-warning 15-page PDF, & standalone arXiv tarball
python scripts/generate_figures.py
python scripts/package_dist.py

# Layer 6 — Launch hardened live interactive WebGL2 + 48 kHz AudioWorklet observatory
npm start
# Open http://localhost:4173 (or set PORT=4174) — or visit https://0thernes.github.io/ultrametrica/
```

---

## 2. Explicit Proof Boundaries (What Each Layer Proves)

For the complete 1-to-1 declaration map, see [`docs/CLAIMS.md`](docs/CLAIMS.md) and [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](docs/AUDIT_AND_CONTRAST_ANALYSIS.md).

| Layer | Trusted Computing Base | What Is Proved | Explicit Boundary (Not Covered Here) |
|---|---|---|---|
| **Lean 4 (`lean/`)** | Lean `v4.35.0` kernel + standard axioms (`propext`, `Classical.choice`, `Quot.sound` max; `0` `sorryAx`, `0` `native_decide`, `0` custom axioms) | **101 audited universal & first-principles theorems** (`2,267` lines): universal Monna bijectivity & ball contiguity, concrete `bruhatTitsUltrametric`, subtree cyclic-shift isometry, universal modular picket-fence law, cycle-graph metric bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual proofs for pure AdS, BTZ ($L \ge 3$), and **Theorem V curved AdS Gauss-Bonnet / supercritical pinch deficit**, Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, RT bounds & complement symmetry, arbitrary $K$-ball solitons, arbitrary-dimension complex Hermitian Sherman-Morrison & Kerr flux parity | Floating-point FFT/PDE conservation, dense Jacobi diagonalization, GPU shaders, and AudioWorklet DSP |
| **Exact-Rational Falsifier (`scripts/verify_exact.py`)** | Python 3 stdlib exact arbitrary-precision `int` & `fractions.Fraction` | 7,033 conjugate Adelic pairs ($p \le 19$); 18 picket-fence sectors; 45 exact zero-rounding BTZ optimal-transport horizons; **60 exact zero-rounding curved AdS Gauss-Bonnet plans**; exact $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison solve; Lean source token scan; version/ORCID parity & 55-file SHA-256 manifest | Finite tested primes, horizons & weights; complements Lean universal proofs |
| **Executable Suite (`test/verify.mjs`)** | Node.js IEEE-754 `Float64` (`node:test`) | **10 numerical theorems** covering FFT vs. naive DFT, Kozyrev eigenfunctions, strong triangle + tree isometry, Yoshida $\Delta t^4$ scaling, bulk KG residual $< 10^{-11}$, Gubser propagator $< 10^{-12}$, Ollivier-Ricci, brute-force RT DP match, Adelic Fourier block leak, unified BTZ curvature, **Theorem V curved Gauss-Bonnet, symmetric Jacobi gravity, BF tachyonic margin ($\Delta = 0.501$), & audit regressions** | Finite tested parameter sets ($p \in \{2,3,5,7\}$); not formal universal quantification |
| **Planted Negative Mutants (`test/mutants.mjs`)** | Isolated defective engine instances (`node:test`) | **8/8 deliberate defects KILLED** (M1 corrupted Monna table, M2 dropped root Robin impedance, M3 false BTZ deficit `-2`, M4 flipped Kerr gauge phase, M5 2nd-order Strang downgrade, M6 horizon-blind RT cut, **M7 in-place Gauss-Seidel asymmetric gravity, M8 naive zero-deficit extrapolation past $\sigma_e < -\ln p$**) | Proves tests reject 8 targeted defect classes; does not exhaust all possible bugs |
| **Discovery Benchmarks (`scripts/discover.mjs`)** | Deterministic real & complex Hermitian Jacobi + SPFA + Yoshida | **8 reproducible datasets (Exp A–H)** in [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) up to $N = 625$ ($\dim W_{0,m} = 125$) across $\alpha \in [0.5, 2.0]$ and $\Delta \to 0.5001$ | Finite-$N$ empirical measurements; asymptotic $n \to \infty$ operator-norm bound remains open |
| **Manuscript & Live Observatory** | Tectonic `0.17.0` + WebGL2 + WebAudio | Zero-warning 15-page AMS-LaTeX PDF (5 vector figures, [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf)) + standalone arXiv bundle ([`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) + live GitHub Pages observatory (`https://0thernes.github.io/ultrametrica/`) | Presentation & visualization layers |

---

## 3. Falsification Protocol (How to Break Any Claim)

We explicitly invite counterexamples and prior-literature challenges via our [Falsification Issue Template](.github/ISSUE_TEMPLATE/falsification.yml). Any single item below falsifies the corresponding claim:

1. **To falsify Theorem I / $\alpha$-Invariant Modular Picket-Fence Law:** Produce any prime $p$, depth $n$, exponent $\alpha > 0$, or $\theta \in (0, 1)$ where (a) the Fourier-basis Monna-conjugated Vladimirov matrix has any cross-sector entry $|M_{jk}| > 10^{-11}$ between distinct $(v_p(k), (k/p^v)\bmod p)$ sectors, OR (b) an odd prime $p \ge 3$ produces $> (p^n + 1)/2$ distinct eigenvalues of $H_\theta$.
2. **To falsify Theorem II (Unified BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy):** Produce any $p \ge 2, L \ge 3$ uniform Tate-curve BTZ graph where exact non-lazy 1-Wasserstein optimal transport differs from $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$.
3. **To falsify Theorem III (Arbitrary $K$-Ball Kozyrev Compacton-Solitons):** Produce any local nonlinearity $F(|\psi|^2)$ and pairwise-disjoint Kozyrev wavelet superposition that radiates $> 10^{-11}$ probability outside its initial support under $D_p^\alpha + F(|\psi|^2)$.
4. **To falsify Theorem IV (Kerr-BTZ Bulk Solver & Parity):** Produce any curved positive edge weights $w_e > 0$ and horizon flux $\Omega \in [-\pi, \pi]$ (with $\Delta \ge 0.5001$) where the $O(V)$ Schur + Sherman-Morrison solver divides by zero or produces an uneliminated Klein-Gordon residual $> 10^{-11}$.
5. **To falsify Theorem V (Curved AdS Discrete Gauss-Bonnet Conservation & Supercritical Pinch Deficit):** Produce any prime $p \ge 2$ and finite interior edge log-length $\sigma_e = \ln a_e$ on $T_p$ whose total curvature excess $\sum_{e'}(\kappa_{e'} - \kappa_{\mathrm{AdS}})$ differs from $0$ (for $\sigma_e \ge -\ln p$) or $-2(e^{-\sigma_e}-p)/(e^{-\sigma_e}+p)$ (for $\sigma_e < -\ln p$).
6. **To challenge formal soundness:** Detect `sorryAx`, `native_decide`, or any axiom outside `[propext, Classical.choice, Quot.sound]` in `cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean`.

---

## 4. Authenticated Cryptographic Manifest (`CHECKSUMS.sha256`, Release `v1.3.0`)

All **55 tracked source, proof, benchmark, audit, manuscript, figure, and distribution files** are cryptographically hashed in the root manifest [`CHECKSUMS.sha256`](CHECKSUMS.sha256) and automatically verified in GitHub Actions CI (`sha256sum -c CHECKSUMS.sha256` and `python scripts/verify_exact.py --check-checksums`).

Frozen distribution digests for Release `v1.3.0`:

```text
d56f2ec54d3d04fecc885c1d010fd2045a12c4c05f3bacc444a452be263f1395  dist/Donahue_2026_Ultrametrica.pdf
aae1420e8947c69fd3511e8c6bc2419cabc1528b44b99f48b591bbd6931dca55  dist/arxiv_submission.tar.gz
```

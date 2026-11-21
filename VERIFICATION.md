# Verification, Falsifiability & Authentication Protocol (`v1.2.0`)

**ULTRAMETRICA (`v1.2.0`)** is engineered to be **Provable**, **Falsifiable**, **Verifiable**, and **Authenticated** across six independent layers: (1) pure Lean 4 (`v4.35.0`) kernel proofs (**71 audited declarations**, `1,706` lines, zero Mathlib, zero `native_decide`, zero `sorry`), (2) zero-dependency exact-rational Python (`fractions.Fraction` & $\mathbb{Q}(i)$) falsification, (3) deterministic Node.js 9-theorem & 6-experiment suites, (4) 6 planted negative-mutant kill-switch checks, (5) zero-warning 13-page AMS-LaTeX PDF + standalone arXiv bundle, and (6) bit-exact cryptographic manifest verification via [`CHECKSUMS.sha256`](CHECKSUMS.sha256).

---

## 1. Independent One-Command Reproduction

```bash
# Layer 1 — Run all 9 executable theorems + 6 planted negative mutants (6/6 killed)
npm run verify:all

# Layer 2 — Run independent exact-rational falsifier, metadata audit & SHA-256 verification
python scripts/verify_exact.py --check-checksums
sha256sum -c CHECKSUMS.sha256

# Layer 3 — Reproduce all 6 discovery benchmark datasets (Exp A-F -> results/discovery-benchmarks.json)
npm run discover

# Layer 4 — Clean-build Lean 4 library & audit all 71 declarations via VerifyAxioms.lean
cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean && cd ..

# Layer 5 — Regenerate 4 vector figures, zero-warning 13-page PDF, & standalone arXiv tarball
python scripts/generate_figures.py
python scripts/package_dist.py

# Layer 6 — Launch live interactive WebGL2 + 48 kHz AudioWorklet observatory
npm start
# Open http://localhost:4173 (or set PORT=4174) — or visit https://0thernes.github.io/ultrametrica/
```

---

## 2. Explicit Proof Boundaries (What Each Layer Proves)

For the complete 1-to-1 declaration map, see [`docs/CLAIMS.md`](docs/CLAIMS.md).

| Layer | Trusted Computing Base | What Is Proved | Explicit Boundary (Not Covered Here) |
|---|---|---|---|
| **Lean 4 (`lean/`)** | Lean `v4.35.0` kernel + standard axioms (`propext`, `Classical.choice`, `Quot.sound` max; `0` `sorryAx`, `0` `native_decide`, `0` custom axioms) | **71 audited universal & first-principles theorems** (`1,706` lines): universal Monna involution & ball contiguity, subtree cyclic-shift ultrametric isometry, first-principles Kantorovich primal-dual optimal transport for AdS & BTZ ($L \ge 3$), $L_c=5$ trichotomy, Gubser BF bound, generalized RT horizon bounds & complement symmetry, arbitrary $K$-ball compacton-solitons, arbitrary-dimension complex Hermitian Sherman-Morrison identity & Kerr flux parity | Floating-point FFT/PDE conservation, dense Jacobi diagonalization, GPU shaders, and AudioWorklet DSP |
| **Exact-Rational Falsifier (`scripts/verify_exact.py`)** | Python 3 stdlib exact arbitrary-precision `int` & `fractions.Fraction` | 7,033 conjugate Adelic pairs ($p \le 19$); 18 modular picket-fence sectors; exact zero-rounding 1-Wasserstein optimal transport across 45 $(p, L)$ BTZ horizons; exact $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison solve; Lean source token scan; version/ORCID parity & 53-file SHA-256 manifest | Finite tested primes & horizons; complements Lean universal proofs |
| **Executable Suite (`test/verify.mjs`)** | Node.js IEEE-754 `Float64` (`node:test`) | 9 numerical theorems covering FFT exactness vs. naive DFT, Kozyrev eigenfunctions, strong triangle + tree isometry, Yoshida $\Delta t^4$ scaling, bulk KG residual $< 10^{-11}$, Gubser analytic propagator $< 10^{-12}$, Ollivier-Ricci curvature, brute-force RT DP match, Adelic Fourier block leak $< 10^{-12}$, and unified BTZ curvature law | Finite tested parameter sets ($p \in \{2,3,5,7\}$); not formal universal quantification |
| **Planted Negative Mutants (`test/mutants.mjs`)** | Isolated defective engine instances (`node:test`) | **6/6 deliberate defects KILLED** (M1 corrupted Monna table, M2 dropped root Robin impedance, M3 false BTZ deficit `-2`, M4 flipped Kerr gauge phase, M5 2nd-order Strang downgrade, M6 horizon-blind RT cut) | Proves tests reject targeted mathematical defects; does not exhaust all possible bugs |
| **Discovery Benchmarks (`scripts/discover.mjs`)** | Deterministic real & complex Hermitian Jacobi eigensolvers + SPFA + Yoshida | 6 reproducible datasets (Exp A–F) in [`results/discovery-benchmarks.json`](results/discovery-benchmarks.json) up to $N = 625$ ($\dim W_{0,m} = 125$) | Finite-$N$ empirical measurements; asymptotic $n \to \infty$ analytic theory remains open |
| **Manuscript & Live Observatory** | Tectonic `0.17.0` + WebGL2 + WebAudio | Zero-warning 13-page AMS-LaTeX PDF ([`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf)) + standalone arXiv bundle ([`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) + live GitHub Pages observatory (`https://0thernes.github.io/ultrametrica/`) | Presentation & visualization layers |

---

## 3. Falsification Protocol (How to Break Any Claim)

We explicitly invite counterexamples and prior-literature challenges via our [Falsification Issue Template](.github/ISSUE_TEMPLATE/falsification.yml). Any single item below falsifies the corresponding claim:

1. **To falsify Theorem I / Modular Picket-Fence Law:** Produce any prime $p$, depth $n$, exponent $\alpha > 0$, or $\theta \in (0, 1)$ where (a) the Fourier-basis Monna-conjugated Vladimirov matrix has any cross-sector entry $|M_{jk}| > 10^{-11}$ between distinct $(v_p(k), (k/p^v)\bmod p)$ sectors, OR (b) an odd prime $p \ge 3$ produces $> (p^n + 1)/2$ distinct eigenvalues of $H_\theta$.
2. **To falsify Theorem II (Unified BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy):** Produce any $p \ge 2, L \ge 3$ uniform Tate-curve BTZ graph where exact non-lazy 1-Wasserstein optimal transport differs from $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$.
3. **To falsify Theorem III (Arbitrary $K$-Ball Kozyrev Compacton-Solitons):** Produce any local nonlinearity $F(|\psi|^2)$ and pairwise-disjoint Kozyrev wavelet superposition that radiates $> 10^{-11}$ probability outside its initial support under $D_p^\alpha + F(|\psi|^2)$.
4. **To falsify Theorem IV (Kerr-BTZ Bulk Solver & Parity):** Produce any curved positive edge weights $w_e > 0$ and horizon flux $\Omega \in [-\pi, \pi]$ (with $\Delta \ge 0.52$) where the $O(V)$ Schur + Sherman-Morrison solver divides by zero or produces an uneliminated Klein-Gordon residual $> 10^{-11}$.
5. **To challenge formal soundness:** Detect `sorryAx`, `native_decide`, or any axiom outside `[propext, Classical.choice, Quot.sound]` in `cd lean && lake clean && lake build && lake env lean VerifyAxioms.lean`.

---

## 4. Authenticated Cryptographic Manifest (`CHECKSUMS.sha256`, Release `v1.2.0`)

All **53 tracked source, proof, benchmark, manuscript, figure, and distribution files** are cryptographically hashed in the root manifest [`CHECKSUMS.sha256`](CHECKSUMS.sha256) and automatically verified in GitHub Actions CI (`sha256sum -c CHECKSUMS.sha256` and `python scripts/verify_exact.py --check-checksums`).

Frozen distribution digests for Release `v1.2.0`:

```text
2a6f73a8ace4b30b2feebea64acd94be1c75e5b663e739d12aae57cec26e8b5e  dist/Donahue_2026_Ultrametrica.pdf
9d361cae2f948b5a72451f925d73d9155b50faddc9466645eb5deb9599623a22  dist/arxiv_submission.tar.gz
```

# Verification, Falsifiability & Authentication Protocol (`v1.6.0`)

**ULTRAMETRICA (`v1.6.0`)** is engineered to be **Provable**, **Falsifiable**, **Verifiable**, and **Authenticated** across eight independent layers: (1) pure Lean 4 (`v4.35.0`, Palomar `module`, `autoImplicit = false`, all 11 `.lean` files `< 1,000` lines) kernel proofs (**148 audited declarations** = `104` core theorems & corollaries + `29` zero-Mathlib helper lemmas + `5` adversarial false-variant refutations across six proof modules + `10` isolated `Spec`/`Challenge`/`Solution` comparator bindings verified via `leanchecker`, `lake check --paranoid`, and 6-kernel `lake comparator --paranoid` inside Linux `bubblewrap` CI), (2) zero-dependency exact-rational Python (`int`, `fractions.Fraction`, $\mathbb{Q}(i)$, and exhaustive brute-force) falsification across Theorems I–VI + independent textbook differential oracle (`reference/padic_oracle.py`), (3) deterministic Node.js `32`-test suite (`10` theorems, **`8/8` true source-code mutants killed** via temp-copy patching of real `src/engine/*.js`, `3,400+` seeded property/metamorphic/curved-BTZ Dijkstra stress/negative tests, **`1,000` deterministic B15 HTTP & engine/audio fuzz cases**, **B19 concurrency + AudioWorklet VM stress**, HTTP contract + `realpath` symlink confinement + disk `EIO` failure injection, golden snapshot) + `3` runnable examples, (4) git-sealed pre-registered confirmatory Experiment I (`docs/preregistration.md`, `c171b1b` -> `4/4` confirmed at primary `p_holm = 0.0004`, Mann-Whitney $U$ `p <= 4.8e-7`, 95% bootstrap CIs for $\Delta\langle r\rangle$, Cliff's $\delta$, and Cohen's $d$, plus non-pseudoreplicated matrix-level sensitivity `p_holm = 7.63e-6`; exploratory deviations logged in `DEVIATIONS.md`) + hardware-tagged performance budgets (`scripts/bench.mjs`), (5) zero-warning AMS-LaTeX PDF (5 vector figures, `21/21` refs) + standalone arXiv bundle + live Crossref DOI/retraction audit (`scripts/check_citations.py --live`), (6) strict static analysis (`tsc --noEmit`, `ruff`, `mypy`: `0` errors), (7) bit-exact cryptographic manifests (`CHECKSUMS.sha256` & `data/MANIFEST.sha256` + SLSA release provenance), and (8) verbatim README `#print axioms` & interactive Proof Blueprint guards (`scripts/check_readme_axioms.py`, `scripts/check_blueprint.py`).

---

## 1. Independent One-Command Reproduction

```bash
# Layer 1 — All 32 Node tests (10 theorems + 8 true source mutants + properties + server + golden + fuzz + concurrency)
npm run verify:all

# Layer 2 — All 3 runnable examples, independent textbook oracle, README axiom guard, live DOIs, blueprint & SHA-256
npm run examples
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
python scripts/check_citations.py --live
python scripts/check_blueprint.py
python scripts/verify_exact.py --check-checksums
sha256sum -c CHECKSUMS.sha256

# Layer 3 — Reproduce all 9 discovery/statistical/hardware benchmark datasets (Exp A-I & perf)
npm run discover
npm run stats
npm run bench

# Layer 4 — Clean-build pure Lean 4.35.0 library & audit all 148 declarations via VerifyAxioms.lean + leanchecker
cd lean
lake clean && lake build UltrametricaProofs Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
# On Linux with bubblewrap (enforced in .github/workflows/ci.yml):
lake check --paranoid
lake comparator --config comparator.json --paranoid
cd ..

# Layer 5 — Regenerate 5 vector figures, zero-warning AMS-LaTeX PDF, & standalone arXiv tarball
python scripts/generate_figures.py
python scripts/package_dist.py

# Layer 6 — Launch hardened live interactive WebGL2 + 48 kHz AudioWorklet observatory
npm start
# Open http://127.0.0.1:4173 (or visit https://0thernes.github.io/ultrametrica/)
```

---

## 2. Explicit Proof Boundaries (What Each Layer Proves)

For the complete 1-to-1 declaration map, see [`CLAIMS.md`](CLAIMS.md), [`docs/CLAIMS.md`](docs/CLAIMS.md), and [`docs/statement-fidelity.md`](docs/statement-fidelity.md).

| Layer | Trusted Computing Base | What Is Proved | Explicit Boundary (Not Covered Here) |
|---|---|---|---|
| **Lean 4 (`lean/`)** | Lean `v4.35.0` + 5 independent external kernels (`leanchecker`, `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin`) + standard axioms (`propext`, `Classical.choice`, `Quot.sound` max; `0` `sorryAx`, `0` `native_decide`, `0` custom axioms) | **148 audited declarations** across 6 proof modules (`Basic`: 26, `AdelicSymmetry`: 23, `HolographyCurvature`: 39, `MultiEdgeHolography`: 33, `SolitonAndSolver`: 12, `AdversarialTests`: 5) + `10` isolated comparator bindings (`104 core + 29 helpers + 5 adv + 10 isolated bindings`): universal Monna bijectivity & ball contiguity, concrete `bruhatTitsUltrametric`, subtree cyclic-shift isometry, universal modular picket-fence law, cycle-graph metric bridge (`btz_graph_metric_eq_classDist`), Kantorovich primal-dual proofs for pure AdS, BTZ ($L \ge 3$), single-edge Theorem V, and **arbitrary-degree simultaneous multi-edge Theorem V-Global** (with explicit entry non-negativity), Euler $\chi = 1, 0$, Gubser BF bound & shadow duality, **Theorem VI universal holographic RT Strong Subadditivity**, arbitrary $K$-ball solitons, arbitrary-dimension complex Hermitian Sherman-Morrison & Kerr flux parity, 5 adversarial sharpness negations, and 8/8 non-vacuity witnesses | Floating-point FFT/PDE conservation, dense Jacobi diagonalization, GPU shaders, and AudioWorklet DSP |
| **Exact-Rational Falsifier (`scripts/verify_exact.py`)** | Python 3 stdlib exact arbitrary-precision `int` & `fractions.Fraction` | 7,033 conjugate Adelic pairs ($p \le 19$); 18 picket-fence sectors; 45 exact zero-rounding BTZ optimal-transport horizons; 60 single-edge + 9 simultaneous multi-edge curved AdS Gauss-Bonnet plans; 4,352 exhaustive brute-force RT SSA partitions; exact $\mathbb{Q}(i)$ Rank-1 Sherman-Morrison solve; nested-comment-safe Lean source scan; Experiment I & perf checks; CFF/LICENSE/ORCID/affiliation parity & cryptographic SHA-256 manifests | Finite tested primes, horizons & weights; complements Lean universal proofs |
| **Executable Suite (`test/verify.mjs`, `properties.mjs`, `server.mjs`, `golden.mjs`, `fuzz.mjs`, `concurrency.mjs`)** | Node.js IEEE-754 `Float64` (`node:test`) | **32 tests** covering 10 numerical theorems, 3,400+ seeded property/metamorphic/curved-BTZ Dijkstra stress/negative cases, 1,000 deterministic HTTP & engine/audio fuzz cases (caught real infinite-loop bug `F65`), parallel HTTP + `EIO` + AudioWorklet VM concurrency storm, `realpath` symlink confinement, CSP/header contract, and 12-digit golden snapshot | Finite tested parameter sets ($p \in \{2,3,5,7\}$); not formal universal quantification |
| **True Source-Code Mutants (`test/mutants.mjs`)** | Temp-copied `src/` + unmodified `test/verify.mjs` (`node --test`) | **8/8 real source mutations KILLED** across production lines in `src/engine/{padic,holography,quantum}.js` (M1 Monna reversal, M2 root Robin impedance, M3 BTZ horizon distance, M4 Kerr gauge phase sign, M5 Yoshida `w0` coefficient, M6 BTZ RT horizon skip, M7 asymmetric gravity update, M8 Dijkstra reduced-cost clamping) | Proves `test/verify.mjs` rejects 8 targeted real-code defects; does not exhaust all possible bugs |
| **Discovery & Pre-Registered Benchmarks (`scripts/discover.mjs`, `stats_eval.mjs`, `bench.mjs`)** | Deterministic real & complex Hermitian Jacobi + Johnson Dijkstra + Yoshida + seeded Mulberry32 | **9 reproducible datasets (Exp A–I)** + hardware-tagged perf budgets (`results/discovery-benchmarks.json`, `results/stats-eval.json`, `results/perf-benchmarks.json`) up to $N = 625$ ($\dim W_{0,m} = 125$), $\alpha \in [0.5, 2.0]$, $\Delta \to 0.5001$, and 20-seed GUE/GOE controls | Finite-$N$ empirical measurements; asymptotic $n \to \infty$ operator-norm bound remains open |
| **Manuscript & Live Observatory** | Tectonic `0.17.0` + WebGL2 + WebAudio | Zero-warning AMS-LaTeX PDF (5 vector figures, `21/21` refs, [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf)) + standalone arXiv bundle ([`dist/arxiv_submission.tar.gz`](dist/arxiv_submission.tar.gz)) + live GitHub Pages observatory & Proof Blueprint | Presentation & visualization layers |

---

## 3. Falsification Protocol (How to Break Any Claim)

We explicitly invite counterexamples and prior-literature challenges via our [Falsification Issue Template](.github/ISSUE_TEMPLATE/falsification.yml). Any single item below falsifies the corresponding claim:

1. **To falsify Theorem I / $\alpha$-Invariant Modular Picket-Fence Law:** Produce any prime $p$, depth $n$, exponent $\alpha > 0$, or $\theta \in (0, 1)$ where (a) the Fourier-basis Monna-conjugated Vladimirov matrix has any cross-sector entry $|M_{jk}| > 10^{-11}$ between distinct $(v_p(k), (k/p^v)\bmod p)$ sectors, OR (b) an odd prime $p \ge 3$ produces $> (p^n + 1)/2$ distinct eigenvalues of $H_\theta$.
2. **To falsify Theorem II (Unified BTZ Ollivier-Ricci Law & $L_c = 5$ Trichotomy):** Produce any $p \ge 2, L \ge 3$ uniform Tate-curve BTZ graph where exact non-lazy 1-Wasserstein optimal transport differs from $\kappa_{\text{BTZ}}(p, L) = -(2p - \max(0, 6-L))/(p+2)$.
3. **To falsify Theorem III (Arbitrary $K$-Ball Kozyrev Compacton-Solitons):** Produce any local nonlinearity $F(|\psi|^2)$ and pairwise-disjoint Kozyrev wavelet superposition that radiates $> 10^{-11}$ probability outside its initial support under $D_p^\alpha + F(|\psi|^2)$.
4. **To falsify Theorem IV (Kerr-BTZ Bulk Solver & Parity):** Produce any curved positive edge weights $w_e > 0$ and horizon flux $\Omega \in [-\pi, \pi]$ (with $\Delta \ge 0.5001$) where the $O(V)$ Schur + Sherman-Morrison solver divides by zero or produces an uneliminated Klein-Gordon residual $> 10^{-11}$.
5. **To falsify Theorems V & V-Global (Curved AdS Discrete Gauss-Bonnet Conservation & Supercritical Pinch Deficit):** Produce any prime $p \ge 2$ and finite interior edge weights $w_e > 0$ on $T_p$ whose total curvature excess $\sum_{e'}(\kappa_{e'} - \kappa_{\mathrm{AdS}})$ differs from $-2 \sum_{e'} \max(0, w_{e'}/W_u + w_{e'}/W_v - 1)$.
6. **To falsify Theorem VI (Universal Discrete Holographic RT Strong Subadditivity):** Produce any finite non-negatively weighted graph and pairwise-disjoint boundary regions $(A, B, C)$ where $S(A \cup B \cup C) + S(B) > S(A \cup B) + S(B \cup C)$.
7. **To challenge formal soundness:** Detect `sorryAx`, `native_decide`, or any axiom outside `[propext, Classical.choice, Quot.sound]` in `cd lean && lake clean && lake build UltrametricaProofs Challenge Solution && lake env lean VerifyAxioms.lean && lake comparator --config comparator.json --paranoid`.

---

## 4. Authenticated Cryptographic Manifests (`CHECKSUMS.sha256` & `data/MANIFEST.sha256`)

All tracked source, proof, benchmark, audit, manuscript, figure, and distribution files are cryptographically hashed in the root manifest [`CHECKSUMS.sha256`](CHECKSUMS.sha256) and [`data/MANIFEST.sha256`](data/MANIFEST.sha256), and automatically verified on every push in GitHub Actions CI (`sha256sum -c CHECKSUMS.sha256` and `python scripts/verify_exact.py --check-checksums`), alongside SLSA build-provenance attestations on every tagged GitHub Release.

# Independent Replication Protocol & Log

> Build Standard `B43` & `B44`. Every quantitative result, theorem proof, benchmark figure, and PDF in ULTRAMETRICA can be reproduced end-to-end from a fresh clone with zero paid APIs, zero external runtime npm packages, and zero Mathlib downloads.

## 1. Environment & Resource Requirements

| Component | Minimum Requirement | Tested Reference | Typical Runtime |
|---|---|---|---|
| **Node.js** | `>= 20.x` (tested on `22.x` & `25.x`) | Node `v22` (CI) / `v25.8.2` (Win11) | `< 1 s` (all 26 tests), `~6 s` (`discover` + `bench` + `stats`) |
| **Python** | `>= 3.11` (standard library ONLY — zero `pip` packages) | Python `3.13` | `~2 s` (`padic_oracle.py` + `verify_exact.py`) |
| **Lean 4** | Exact toolchain pinned in [`lean/lean-toolchain`](lean/lean-toolchain) (`leanprover/lean4:v4.35.0`) | Lean `v4.35.0` (0 Mathlib) | `~15 s` clean build + 6-kernel comparator |
| **Tectonic** | `>= 0.15.0` (for optional PDF & vector figure rebuild) | Tectonic `0.17.0` | `~25 s` (5 figures + main PDF + arXiv check) |
| **Hardware** | Any 64-bit x86_64 or arm64 CPU, `>= 2 GB` RAM, `>= 500 MB` free disk | Intel Core Ultra 9 275HX / GitHub Actions runners | Total full stack `< 60 s` |

---

## 2. Clean-Clone Reproduction Steps

```bash
git clone https://github.com/0thernes/ultrametrica.git
cd ultrametrica

# 1. All 26 Node test suites (10 theorems + 8 killed mutants + 3,200+ properties + server contract/EIO + golden)
npm run verify:all

# 2. All 3 runnable examples
npm run examples

# 3. Independent Python textbook oracle (1,000+ cases) + README axiom guard + exact-rational falsifier & SHA-256 check
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
python scripts/verify_exact.py --check-checksums

# 4. Regenerate discovery benchmarks, hardware benchmarks, and pre-registered Experiment I statistics
npm run discover
npm run bench
npm run stats

# 5. Pure Lean 4.35.0 clean build, 120-decl axiom audit, leanchecker, and 6-kernel comparator (Linux with bwrap)
cd lean
lake clean
lake build UltrametricaProofs Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
lake comparator --config comparator.json --paranoid
cd ..

# 6. Rebuild vector figures, zero-warning AMS-LaTeX PDF, and verify standalone arXiv tarball
python scripts/generate_figures.py
python scripts/package_dist.py
```

---

## 3. Expected Tolerances & Exactness Criteria

- **Lean 4 Proofs & 6-Kernel Comparator:** Exact (`0` errors, `0` warnings in `UltrametricaProofs` & `Solution`, `120` declarations strictly in `[propext, Classical.choice, Quot.sound]`, all `8/8` targets pass `lake comparator --paranoid`).
- **Python Exact-Rational Falsifier (`verify_exact.py`):** Exact (`0` rounding error — arbitrary-precision `int` & `fractions.Fraction`).
- **Deterministic Golden Snapshot (`test/golden.mjs`):** Exact match to `12` decimal digits (`test/golden/baseline-snapshot.json`).
- **Pre-Registered Experiment I (`scripts/stats_eval.mjs`):** Deterministic seeded PRNG (`seeds 1001..1020`, `10,000` permutation/bootstrap resamples) — `4/4` hypotheses confirmed at `p_holm = 0.0004` identically across platforms (`|Δ⟨r⟩|` exact to `< 1e-12`).
- **IEEE-754 Engine & Differential Oracle (`test/verify.mjs`, `test/properties.mjs`, `reference/padic_oracle.py`):** Relative/absolute tolerance `< 1e-11` (actual measured errors `1e-15`–`1.23e-12`).
- **Performance Benchmarks (`scripts/bench.mjs`):** Wall-clock timings depend on host CPU clock and thermal state; verify speedup monotonicity (Radix-$p$ FFT strictly faster than naive DFT at $N \ge 9$, coupled frame step `< 16.67 ms` on modern desktop CPUs) and exact correctness checksums.

---

## 4. Replication Log

Every clean-environment reproduction (local or independent CI runner) is recorded chronologically below.

| Date | Replicator / Runner | Commit / Tag | Environment | Verdict | Notes |
|---|---|---|---|---|---|
| 2026-11-21 | Author + GitHub Actions CI (`ubuntu-latest`) | `v1.1.0` (`27d1eb2`) | Node 22, Python 3.12, Lean `v4.35.0`, Tectonic `0.15` | PASS | 9/9 theorems, 36 Lean decls, zero-warning PDF |
| 2026-11-21 | Author + GitHub Actions CI (`ubuntu-latest`) | `v1.2.0` (`a3a3dc1`) | Node 22, Python 3.12, Lean `v4.35.0`, Tectonic `0.15` | PASS | 9/9 theorems, 6/6 mutants, 71 Lean decls, GitHub Pages live |
| 2026-11-21 | Author + GitHub Actions CI (`ubuntu-latest`) | `v1.3.0` (`e42e6af`) | Node 22, Python 3.12, Lean `v4.35.0`, Tectonic `0.15` | PASS | 10/10 theorems, 8/8 mutants, 101 Lean decls, 60 curved Fraction plans |
| 2026-11-25 | Author (Windows 11 local workstation) | `v1.4.0` | Intel Core Ultra 9 275HX, Node `v25.8.2`, Python `3.13`, Lean `v4.35.0`, Tectonic `0.17.0` | PASS | 26/26 Node tests, 3,200+ properties, 1,000+ Python oracle queries, 120 Lean decls + external kernels, Exp I 4/4 (`p_holm=0.0004`), zero-warning PDF |
| 2026-11-25 | GitHub Actions Clean Matrix (`ubuntu-24.04`, `macos-latest`, `windows-latest`) | `v1.4.0` | Clean GitHub-hosted runners + `bubblewrap` 6-kernel `lake comparator --paranoid` | PASS (`#45726457779`) | Independent clean-clone verification across 3 operating systems + sandboxed 6-kernel Lean verification (Rekor `4114476726`) |
| 2026-11-25 | Author Local + GitHub Actions Clean Matrix (`ubuntu-24.04`, `macos-latest`, `windows-latest`) | `v1.4.1` | Intel Core Ultra 9 275HX + 3-OS GitHub runners + `bubblewrap` 6-kernel comparator | PASS | Zero-warning PDF (`19` pages, `21/21` refs), `0` `ruff` / `0` `mypy` warnings, responsive live observatory QA, `26/26` Node + `1,000+` Python + `120` Lean decls |

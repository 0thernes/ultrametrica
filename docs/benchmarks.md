# Performance Benchmarks & Latency Budgets (`docs/benchmarks.md`)

> Build Standard `A37`, `B26`, and `B27`. Every number below is reproduced directly by `npm run bench` (`scripts/bench.mjs`), archived in [`results/perf-benchmarks.json`](../results/perf-benchmarks.json), and paired with a live correctness checksum so timing can never pass on broken math.

## 1. Hardware & Runtime Provenance

- **CPU:** Intel Core Ultra 9 275HX (24 logical cores)
- **OS / Architecture:** `win32-x64`
- **Runtime:** Node.js `v25.8.2` (zero external dependencies)
- **Methodology:** Warm-up iterations discarded before timing; `10–15` timed outer runs per kernel reporting **median**, **IQR** (interquartile range), **min**, **max**, and an algebraic/numerical **correctness checksum**.

---

## 2. Explicit Performance Budgets (`v1.5.0`)

| Kernel / Operation | Hard Budget | Measured Median (`v1.5.0`) | IQR | Margin | Status |
|---|---|---|---|---|---|
| Coupled BTZ Frame Step (`p=3, n=5, L=9`, Yoshida + Bulk KG + Dijkstra Ricci + Gravity) | `< 16.67 ms` (60 FPS) | **`0.7307 ms`** | `0.1875 ms` | **22.8× faster than budget** | PASS |
| Full Bulk KG + Dijkstra Ricci + Exact RT (`p=5, n=4, N=625`, BTZ $L=5$) | `< 10.00 ms` | **`0.1584 ms`** | `0.0851 ms` | **63.1× faster than budget** | PASS |
| Native Radix-$p$ Pontryagin FFT (`p=5, n=4, N=625`, single transform) | `< 1.00 ms` | **`0.0229 ms`** (`0.2287 ms / 10`) | `0.0094 ms` | **43.7× faster than budget** | PASS |

---

## 3. Algorithmic Speedup: Native Radix-$p$ FFT vs. Textbook $O(N^2)$ DFT

| Dimension $(p, n, N)$ | Radix-$p$ FFT (per call) | Naive $O(N^2)$ DFT (per call) | Speedup | Max Error Checksum |
|---|---|---|---|---|
| `p=3, n=2, N=9` | `0.000221 ms` (`0.0442 ms / 200`) | `0.001815 ms` (`0.0363 ms / 20`) | **`8.21×`** | `maxErr = 1.02e-15` |
| `p=3, n=5, N=243` | `0.009925 ms` (`0.1985 ms / 20`) | `1.5268 ms` (`3.0536 ms / 2`) | **`153.83×`** | `maxErr = 1.12e-14` |
| `p=5, n=4, N=625` | `0.02287 ms` (`0.2287 ms / 10`) | `10.1856 ms` (`10.1856 ms / 1`) | **`445.37×`** | `maxErr = 1.07e-14` |

### Honest Caveats & Small-$N$ / Variance Disclosure (`B27`)

- **Tiny-$N$ overhead:** For trivial sizes like $N = 2$ or $N = 3$, loop overhead and twiddle-table indexing make naive summation competitive; Radix-$p$ wins decisively starting at $N \ge 9$ (`8.21×` at $N=9$, `445.37×` at $N=625$).
- **Thermal & JIT variance:** `min`/`max` ranges on sub-millisecond workloads (e.g. `0.5450 ms`–`1.2867 ms` on `coupled_btz_frame_step`) reflect V8 tier-up and OS scheduling jitter across laptop power states; we therefore report median + IQR rather than cherry-picked minimums.
- **Quadratic visual/spectral ceiling:** Interactive WebGL2 presets stay below $N \le 343$ because the 2D ultrametric matrix/oscilloscope rendering and exact Jacobi diagonalization (in `scripts/discover.mjs`) scale as $O(N^2)$–$O(N^3)$, whereas the core FFT/bulk/RT engine scales as $O(p N \log_p N)$ and $O(V)$.

---

## 4. Historical Performance Tracking (`B26`)

| Release | Key Optimization | Coupled BTZ Frame (`p=3, n=5, L=9`) | Bulk KG+Ricci+RT (`N=625`) | Radix-$p$ FFT (`N=625`) Speedup |
|---|---|---|---|---|
| `v1.0.0` | Initial zero-dependency Radix-$p$ FFT & $O(V)$ Schur + Sherman-Morrison solver | Uninstrumented | Uninstrumented | Uninstrumented |
| `v1.3.0` | Cached WebGL2 uniform locations, preallocated scratch TypedArrays in `computeOllivierRicci` / `computeRyuTakayanagi` / `stepGravity` (`_sigmaSnap`) | `< 1 ms` (60 FPS verified in browser) | — | — |
| `v1.4.0` | Formal hardware-tagged median/IQR harness (`scripts/bench.mjs`) + strict input bounds | `0.3882 ms` (IQR `0.1318 ms`) | `0.2223 ms` (SPFA) | `319.89×` (`maxErr=1.07e-14`) |
| `v1.5.0` | Replaced BTZ horizon SPFA with Johnson potential-reduced Dijkstra (`F35`, negative-cycle impossible) + strict JSDoc typed engine | **`0.7307 ms`** (IQR `0.1875 ms`, `kgRes=1.20e-16`) | **`0.1584 ms`** (IQR `0.0851 ms`, `kgRes=1.78e-15`) | **`445.37×`** (`maxErr=1.07e-14`) |

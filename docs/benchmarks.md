# Performance Benchmarks & Latency Budgets (`docs/benchmarks.md`)

> Build Standard `A37`, `B26`, and `B27`. Every number below is reproduced directly by `npm run bench` (`scripts/bench.mjs`), archived in [`results/perf-benchmarks.json`](../results/perf-benchmarks.json), and paired with a live correctness checksum so timing can never pass on broken math.

## 1. Hardware & Runtime Provenance

- **CPU:** Intel Core Ultra 9 275HX (24 logical cores)
- **OS / Architecture:** `win32-x64`
- **Runtime:** Node.js `v25.8.2` (zero external dependencies)
- **Methodology:** Warm-up iterations discarded before timing; `10–15` timed outer runs per kernel reporting **median**, **IQR** (interquartile range), **min**, **max**, and an algebraic/numerical **correctness checksum**.

---

## 2. Explicit Performance Budgets (`v1.6.0`)

| Kernel / Operation | Hard Budget | Measured Median (`v1.6.0`) | IQR | Margin | Status |
|---|---|---|---|---|---|
| Coupled BTZ Frame Step (`p=3, n=5, L=9`, Yoshida + Bulk KG + Dijkstra Ricci + Gravity) | `< 16.67 ms` (60 FPS) | **`0.7485 ms`** | `0.4404 ms` | **22.3× faster than budget** | PASS |
| Full Bulk KG + Dijkstra Ricci + Exact RT (`p=5, n=4, N=625`, BTZ $L=5$) | `< 10.00 ms` | **`0.1236 ms`** | `0.0369 ms` | **80.9× faster than budget** | PASS |
| Native Radix-$p$ Pontryagin FFT (`p=5, n=4, N=625`, single transform) | `< 1.00 ms` | **`0.0287 ms`** (`0.2867 ms / 10`) | `0.0022 ms` | **34.9× faster than budget** | PASS |

---

## 3. Algorithmic Speedup: Native Radix-$p$ FFT vs. Textbook $O(N^2)$ DFT

| Dimension $(p, n, N)$ | Radix-$p$ FFT (per call) | Naive $O(N^2)$ DFT (per call) | Speedup | Max Error Checksum |
|---|---|---|---|---|
| `p=3, n=2, N=9` | `0.000260 ms` (`0.0520 ms / 200`) | `0.001780 ms` (`0.0356 ms / 20`) | **`6.85×`** | `maxErr = 1.02e-15` |
| `p=3, n=5, N=243` | `0.010535 ms` (`0.2107 ms / 20`) | `1.79125 ms` (`3.5825 ms / 2`) | **`170.03×`** | `maxErr = 1.12e-14` |
| `p=5, n=4, N=625` | `0.02867 ms` (`0.2867 ms / 10`) | `14.2165 ms` (`14.2165 ms / 1`) | **`495.87×`** | `maxErr = 1.07e-14` |

### Honest Caveats & Small-$N$ / Variance Disclosure (`B27`)

- **Tiny-$N$ overhead:** For trivial sizes like $N = 2$ or $N = 3$, loop overhead and twiddle-table indexing make naive summation competitive; Radix-$p$ wins decisively starting at $N \ge 9$ (`6.85×` at $N=9$, `495.87×` at $N=625$).
- **Thermal & JIT variance:** `min`/`max` ranges on sub-millisecond workloads (e.g. `0.5517 ms`–`1.9367 ms` on `coupled_btz_frame_step`) reflect V8 tier-up and OS scheduling jitter across laptop power states; we therefore report median + IQR rather than cherry-picked minimums.
- **Quadratic visual/spectral ceiling:** Interactive WebGL2 presets stay below $N \le 343$ because the 2D ultrametric matrix/oscilloscope rendering and exact Jacobi diagonalization (in `scripts/discover.mjs`) scale as $O(N^2)$–$O(N^3)$, whereas the core FFT/bulk/RT engine scales as $O(p N \log_p N)$ and $O(V)$.

---

## 4. Historical Performance Tracking (`B26`)

| Release | Key Optimization | Coupled BTZ Frame (`p=3, n=5, L=9`) | Bulk KG+Ricci+RT (`N=625`) | Radix-$p$ FFT (`N=625`) Speedup |
|---|---|---|---|---|
| `v1.0.0` | Initial zero-dependency Radix-$p$ FFT & $O(V)$ Schur + Sherman-Morrison solver | Uninstrumented | Uninstrumented | Uninstrumented |
| `v1.3.0` | Cached WebGL2 uniform locations, preallocated scratch TypedArrays in `computeOllivierRicci` / `computeRyuTakayanagi` / `stepGravity` (`_sigmaSnap`) | `< 1 ms` (60 FPS verified in browser) | — | — |
| `v1.4.0` | Formal hardware-tagged median/IQR harness (`scripts/bench.mjs`) + strict input bounds | `0.3882 ms` (IQR `0.1318 ms`) | `0.2223 ms` (SPFA) | `319.89×` (`maxErr=1.07e-14`) |
| `v1.5.0` | Replaced BTZ horizon SPFA with Johnson potential-reduced Dijkstra (`F35`, negative-cycle impossible) + strict JSDoc typed engine | `0.7307 ms` (IQR `0.1875 ms`, `kgRes=1.20e-16`) | `0.1584 ms` (IQR `0.0851 ms`, `kgRes=1.78e-15`) | `445.37×` (`maxErr=1.07e-14`) |
| `v1.6.0` | Added engine defense-in-depth guards (`F41`–`F44`), removed constructor double-allocation (`F42`), and replaced audio foldback loop with $O(1)$ log-space folding (`F65`) | **`0.7485 ms`** (IQR `0.4404 ms`, `kgRes=1.20e-16`) | **`0.1236 ms`** (IQR `0.0369 ms`, `kgRes=1.78e-15`) | **`495.87×`** (`maxErr=1.07e-14`) |

# Performance Benchmarks & Latency Budgets (`docs/benchmarks.md`)

> Build Standard `A37`, `B26`, and `B27`. Every number below is reproduced directly by `npm run bench` (`scripts/bench.mjs`), archived in [`results/perf-benchmarks.json`](../results/perf-benchmarks.json), and paired with a live correctness checksum so timing can never pass on broken math.

## 1. Hardware & Runtime Provenance

- **CPU:** Intel Core Ultra 9 275HX (24 logical cores)
- **OS / Architecture:** `win32-x64`
- **Runtime:** Node.js `v25.8.2` (zero external dependencies)
- **Methodology:** Warm-up iterations discarded before timing; `10–15` timed outer runs per kernel reporting **median**, **IQR** (interquartile range), **min**, **max**, and an algebraic/numerical **correctness checksum**.

---

## 2. Explicit Performance Budgets

| Kernel / Operation | Hard Budget | Measured Median (`v1.4.0`) | IQR | Margin | Status |
|---|---|---|---|---|---|
| Coupled BTZ Frame Step (`p=3, n=5, L=9`, Yoshida + Bulk KG + Ricci + Gravity) | `< 16.67 ms` (60 FPS) | **`0.3882 ms`** | `0.1318 ms` | **42× faster than budget** | PASS |
| Full Bulk KG + SPFA Ricci + Exact RT (`p=5, n=4, N=625`, BTZ $L=5$) | `< 10.00 ms` | **`0.2223 ms`** | `0.1284 ms` | **45× faster than budget** | PASS |
| Native Radix-$p$ Pontryagin FFT (`p=5, n=4, N=625`, single transform) | `< 1.00 ms` | **`0.0183 ms`** (`0.1829 ms / 10`) | `0.0012 ms` | **54× faster than budget** | PASS |

---

## 3. Algorithmic Speedup: Native Radix-$p$ FFT vs. Textbook $O(N^2)$ DFT

| Dimension $(p, n, N)$ | Radix-$p$ FFT (per call) | Naive $O(N^2)$ DFT (per call) | Speedup | Max Error Checksum |
|---|---|---|---|---|
| `p=3, n=2, N=9` | `0.000144 ms` (`0.0288 ms / 200`) | `0.001000 ms` (`0.0200 ms / 20`) | **`6.94×`** | `maxErr = 1.02e-15` |
| `p=3, n=5, N=243` | `0.007525 ms` (`0.1505 ms / 20`) | `0.9249 ms` (`1.8497 ms / 2`) | **`122.90×`** | `maxErr = 1.12e-14` |
| `p=5, n=4, N=625` | `0.01829 ms` (`0.1829 ms / 10`) | `5.8508 ms` (`5.8508 ms / 1`) | **`319.89×`** | `maxErr = 1.07e-14` |

### Honest Caveats & Small-$N$ / Variance Disclosure (`B27`)

- **Tiny-$N$ overhead:** For trivial sizes like $N = 2$ or $N = 3$, loop overhead and twiddle-table indexing make naive summation competitive; Radix-$p$ wins decisively starting at $N \ge 9$ (`6.94×` at $N=9$, `319.89×` at $N=625$).
- **Thermal & JIT variance:** `min`/`max` ranges on sub-millisecond workloads (e.g. `0.3407 ms`–`0.7412 ms` on `coupled_btz_frame_step`) reflect V8 tier-up and OS scheduling jitter; we therefore report median + IQR rather than cherry-picked minimums.
- **Quadratic visual/spectral ceiling:** Interactive WebGL2 presets stay below $N \le 343$ because the 2D ultrametric matrix/oscilloscope rendering and exact Jacobi diagonalization (in `scripts/discover.mjs`) scale as $O(N^2)$–$O(N^3)$, whereas the core FFT/bulk/RT engine scales as $O(p N \log_p N)$ and $O(V)$.

---

## 4. Historical Performance Tracking (`B26`)

| Release | Key Optimization | Coupled BTZ Frame (`p=3, n=5, L=9`) | Radix-$p$ FFT (`N=625`) Speedup |
|---|---|---|---|
| `v1.0.0` | Initial zero-dependency Radix-$p$ FFT & $O(V)$ Schur + Sherman-Morrison solver | Uninstrumented | Uninstrumented |
| `v1.3.0` | Cached WebGL2 uniform locations, preallocated scratch TypedArrays in `computeOllivierRicci` / `computeRyuTakayanagi` / `stepGravity` (`_sigmaSnap`) | `< 1 ms` (60 FPS verified in browser) | — |
| `v1.4.0` | Added formal hardware-tagged median/IQR harness (`scripts/bench.mjs`) + strict input bounds | **`0.3882 ms`** (IQR `0.1318 ms`, `kgRes=1.20e-16`) | **`319.89×`** (`maxErr=1.07e-14`) |

# Runnable Examples (`examples/`)

Every example below uses the exact zero-dependency `src/engine/` ES modules, asserts its mathematical invariants loudly, and is smoke-tested in CI on Ubuntu, macOS, and Windows.

| Script | Theorem / Phenomenon Demonstrated | Run Command |
|---|---|---|
| [`01_kozyrev_compacton.mjs`](01_kozyrev_compacton.mjs) | **Theorem III** — Exact radiation-free nonlinear Kozyrev compacton-soliton ($< 10^{-12}$ leakage at $g = 80$) contrasted against dispersive Euclidean $\mathbb{R}$ twin explosion | `node examples/01_kozyrev_compacton.mjs` |
| [`02_btz_curvature_and_rt.mjs`](02_btz_curvature_and_rt.mjs) | **Theorem II & Theorem VI** — Exact Tate-curve BTZ Ollivier-Ricci curvature ($L_c = 5$ trichotomy & macroscopic deficit) plus Holographic Ryu-Takayanagi Strong Subadditivity $S(ABC) + S(B) \le S(AB) + S(BC)$ | `node examples/02_btz_curvature_and_rt.mjs` |
| [`03_global_gauss_bonnet.mjs`](03_global_gauss_bonnet.mjs) | **Theorem V-Global** — Simultaneous multi-edge curved AdS Gauss-Bonnet conservation ($\equiv 0$ when $w_e/W_u + w_e/W_v \le 1$) and exact negative supercritical pinch deficit sum | `node examples/03_global_gauss_bonnet.mjs` |

Run all examples together:

```bash
npm run examples
```

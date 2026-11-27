# Upgrading Guide

## Upgrading `v1.5.0` → `v1.6.0`

### Behavioral, API & Security Improvements
1. **Engine Defense-in-Depth Validation (`F41`–`F44`):** `PadicSpace.{digits,formatPadic,monna,diffValuation,distance,kozyrevTransform}`, `PadicQuantumEngine.{setPotentialLeaf,setState,injectKozyrevWavelet,step}`, `BruhatTitsBulk.{computeRyuTakayanagi,solveBulkField,setHorizonFlux}`, and `UltrametricaSimulation.{step,setRTRegionBall,setRTRegionFraction,toggleRTRegionAtLeaf,injectAtNode,pushTriangleProbeLeaf}` now strictly reject non-integer indices, mismatched array lengths, non-finite values (`NaN`/`Infinity`), and singular pivots (`< 1e-30`) with explicit `RangeError`/`TypeError`.
2. **Audio Prime-Power Foldback (`F65`):** `primePowerFreq` in `src/web/audio.js` and `src/web/audio-worklet.js` now enforces finite positive bounds (`p >= 2`, `n in [1, 32]`, `alpha in (0, 100]` / `<= 10.0`) and uses $O(1)$ log-space folding instead of a `while` loop, preventing infinite hangs on overflowing inputs.
3. **Hardened `server.mjs` (`F47`):** Rejects protocol-relative `//` URLs and ASCII control characters `[\x00-\x1f\x7f\\]` with HTTP `400`, enforces `fsImpl.realpath` symlink-escape confinement (`403`), and reads `/healthz` version directly from `VERSION`.
4. **URL Permalink Hydration (`F38`):** `?btz=1` is now applied before loading `?exp=...` with `{ keepTopology: true }`, preserving BTZ topology on presets such as `?exp=wormhole_surgery&btz=1`.
5. **Lean 4 Module Split (`F51`):** Multi-edge Gauss-Bonnet, first-principles inhomogeneous Kantorovich duality (with new primal entry non-negativity clauses), and Theorem VI RT Strong Subadditivity now live in `lean/UltrametricaProofs/MultiEdgeHolography.lean` (still re-exported automatically by `import UltrametricaProofs`). The trivial 1-liner `rt_odd_prime_horizon_dominance` was removed (`F50`).
6. **Expanded Verification Suite (`32/32` Node tests):** `npm run verify:all` now includes true source-code mutation testing (`test/mutants.mjs`), deterministic B15 fuzzing (`test/fuzz.mjs`), and B19 concurrency/AudioWorklet VM testing (`test/concurrency.mjs`).

## Upgrading `v1.4.0` → `v1.5.0`

1. **Curved BTZ Ollivier-Ricci Transport (`F35`):** `exactWassersteinBipartite` in `src/engine/holography.js` replaced SPFA with **Johnson potential-reduced Dijkstra** (`rc >= 0`), eliminating floating-point negative-cycle `RangeError` crashes under extreme curved BTZ wormhole surgery.
2. **Palomar `module` Headers (`F29`):** All Lean 4.35.0 source files upgraded to Palomar `module` headers (`public import`, `@[expose] public`) verified by `lake check --paranoid` + 6-kernel `lake comparator --paranoid`.
3. **Interactive Blueprint & Live Citations:** Added `src/web/blueprint.{html,css,js}`, `scripts/check_blueprint.py`, and `scripts/check_citations.py --live`.

## Upgrading `v1.3.0` → `v1.4.0`

### Breaking / Behavioral Changes (Engine Input Validation)

To satisfy Build Standard `B06` / `B20` (loud rejection of invalid public inputs), public constructors and numerical entry points in `src/engine/` now throw `RangeError` or `TypeError` instead of silently coercing invalid inputs:

1. **`PadicSpace(p, n)`:** Throws `RangeError` if `p` is not a prime integer $\ge 2$, if `n < 2` is not an integer, or if $p^n > 65536$.
2. **`BruhatTitsBulk(space, horizonDepth)`:** Throws `TypeError` if `space` is not a `PadicSpace`, and throws `RangeError` if `horizonDepth` is negative, non-integer, or `>= space.n` (previously negative `horizonDepth` was silently coerced via bitwise `| 0` — fixed bug `F02`).
3. **`PadicQuantumEngine(space, alpha)` / `setState` / `step`:** Rejects non-finite or non-positive `alpha`, mismatched or zero-norm state vectors, non-finite `dt`, and invalid `substeps < 1`.
4. **`UltrametricaSimulation.loadExperiment(id)`:** Throws `RangeError` on unknown experiment IDs instead of falling through silently.
5. **`server.mjs` (`PORT` env var):** Validates `PORT` strictly as an integer in `[0, 65535]` at startup (`parsePort`), exiting immediately with `RangeError` on malformed values. Also adds `GET /healthz` and a strict `Content-Security-Policy` header.

### New Verification Artifacts & Commands

- `npm run verify:all` now runs all **5 Node test suites** (`verify.mjs`, `mutants.mjs`, `properties.mjs`, `server.mjs`, `golden.mjs` — 26 tests total).
- `lean/lakefile.toml` enables `autoImplicit = false` and `relaxedAutoImplicit = false`, and adds `Challenge` and `Solution` libraries alongside `UltrametricaProofs` for 6-kernel `lake comparator --paranoid` checking.
- Author affiliation metadata has been standardized from `"0thernes LLC"` (an unformed entity) to `"Independent Researcher, Spokane, WA, USA"` matching ORCID `0009-0006-8168-9648`.

## Upgrading `v1.2.0` → `v1.3.0`

- `BruhatTitsBulk.stepGravity` switched from in-place Gauss-Seidel to symmetric Jacobi edge updates (`_sigmaSnap`), preserving `< 1e-15` sibling symmetry on $T_p$.
- `UltrametricaSimulation` constructor preserves non-zero `horizonDepth` when loading the initial experiment.
- URL permalinks gained `grav` and `dyn` query parameters and raised `alpha` max to `2.00`.

## Upgrading `v1.1.0` → `v1.2.0`

- `src/web/` paths switched from absolute `/web/` to relative ES-module paths for GitHub Pages subpath hosting.
- `CITATION.cff` and `LEGAL.md` aligned authorship strictly to Alexander Stephen Donahue (ORCID `0009-0006-8168-9648`) with transparent AI-assistance disclosure.

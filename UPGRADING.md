# Upgrading Guide

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

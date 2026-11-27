# Upgrading Guide

## Upgrading `v1.7.0` → `v1.8.0`

### New Formal Modules, 100% Public Coverage, UI/Engine Hardening & Node-24-Clean CI
1. **Three New Zero-Mathlib Lean 4.35.0 Modules + 100.0% Public Theorem Coverage (`F87`–`F90`):**
   - `lean/UltrametricaProofs/FullGraphBTZ.lean` (`6` decls, Target 13, `F88`) proving the literal `(p+2)×(p+2)` full-graph-to-3-class BTZ optimal-transport symmetry reduction and existential non-negative attaining plan.
   - `lean/UltrametricaProofs/OperatorAndSpectrum.lean` (`21` decls, Target 14, `F89`) proving operator-level block-diagonality of symmetry-commuting operators and odd-prime orthogonal doublet multiplicity $\ge 2$ over $\mathbb{Z}[i]^N$.
   - `lean/UltrametricaProofs/BulkOperatorPositivity.lean` (`8` decls, Target 15, `F90`) proving strict positive definiteness $T \succ 0$ of the gauge-covariant bulk graph Laplacian ($m^2 > 0$), end-to-end Sherman-Morrison $\mathrm{den} \ge 1$ discharge, and exact `RatQ` tree Schur-complement pivot positivity & elimination.
   - All `250/250` public theorems across all 11 proof modules + `Solution.lean` (`15` isolated comparator targets bridged cleanly via `SolutionBridge.lean`) are audited in `VerifyAxioms.lean` and enforced automatically by `scripts/verify_exact.py` (`0` unaudited public theorems; all 17 `.lean` files `< 1,000` lines). Note that `lake build` now includes `SolutionBridge`: `lake build UltrametricaProofs SolutionBridge Challenge Solution`.
2. **Engine Validation & Zero-GC Guards (`F93`, `F94`):**
   - `UltrametricaSimulation` (`src/engine/simulation.js`) adds prime-aware `_defaultBtzDepth(p, n)`, reuses a preallocated `_rtScratch` `Uint8Array`, and rejects non-finite `backreactionStrength`/`newtonG` in `step()`.
   - `PadicQuantumEngine` (`src/engine/quantum.js`) validates `space instanceof PadicSpace` in its constructor (`TypeError`) and checks finiteness inside `computeDiagnostics()`.
3. **Favicon (`F86`) & 7 Browser UI / Canvas / WebAudio Fixes (`F96`):**
   - Added `src/web/favicon.svg` (linked in `index.html` and `blueprint.html`, verified HTTP `200` in `test/server.mjs`), eliminating browser `/favicon.ico` 404s.
   - Fixed paused 2D-canvas click HUD sync, URL hydration diagnostics, unchecked Dynamic Gravity resetting geometry (`sim.bulk.resetGravity()`), explicit `p=2` Alt+Click `charM` clamping, keyboard shortcut guards for `TEXTAREA`/`SELECT`/`isContentEditable`/open `#helpModal`, 2D canvas `ctx` null guards in `panels2d.js`, and half-initialized `AudioContext` cleanup on `addModule()` failure in `audio.js`.
4. **Expanded Mutation Suite (`12/12`), Automated Link Check (`F91`) & Node-24-Clean CI (`F97`):**
   - `test/mutants.mjs` adds production mutants `M11` & `M12` in `src/engine/padic.js` -> **`36/36` Node tests PASS**.
   - `scripts/verify_exact.py` now checks all internal Markdown links across the repository (`0` broken links) and 100.0% public Lean theorem audit coverage; all 3 GitHub Actions workflows upgraded to Node-24-clean actions (`checkout@v5`, `setup-node@v5`, `setup-python@v6`, `upload-artifact@v5`, `upload-pages-artifact@v4`).

## Upgrading `v1.6.0` → `v1.7.0`

### New Formal Modules, Verification Gates & Behavioral Guards
1. **Two New Zero-Mathlib Lean 4.35.0 Modules (`F70`, `F71`):**
   - `lean/UltrametricaProofs/FiniteGraphGaussBonnet.lean` (`24` decls, Target 11) proving direct finite-graph edge-sum curved Gauss-Bonnet conservation over arbitrary `List (WeightedEdge n)` on `Fin n`.
   - `lean/UltrametricaProofs/VladimirovOperator.lean` (`26` decls, Target 12) proving exact finite-level valuation ultrametricity, first-principles discrete Vladimirov / radial ultrametric operator `ultrametricOp`, actual discrete Kozyrev-Haar eigenfunctions `kozyrevHaar`, and `[D_K, J] = 0` parity preservation.
   - Both are re-exported automatically by `import UltrametricaProofs` (`202` total audited declarations across 8 proof modules + 12 isolated comparator targets).
2. **Engine Overflow, Pivot & Buffer Guards (`F75`–`F77`):**
   - `PadicSpace.vladimirovSpectrum(alpha)` and `archimedeanSpectrum(alpha)` now throw `RangeError` if any eigenvalue overflows IEEE-754 `Float64` to `Infinity`; `applyVladimirov` reuses preallocated scratch buffers.
   - `BruhatTitsBulk.solveBulkField` now checks `!Number.isFinite(D[c]) || Math.abs(D[c]) < 1e-15` during tree Schur-complement elimination and pure-AdS root inversion.
   - `BruhatTitsBulk.computeBoundaryPotential(outLeafPotential, strength)` now validates `outLeafPotential.length >= this.N` and `Number.isFinite(strength)`.
3. **Hardened `server.mjs` (`F79`) & Observatory Paused-HUD Reactivity (`F78`):**
   - `server.mjs` now rejects raw ASCII control characters and oversized `> 4096`-byte request targets with HTTP `400 Bad Request`.
   - Interactive sliders and 3D raycast clicks in `src/web/app.js` now recompute quantum diagnostics and refresh HUD telemetry immediately even when `sim.paused === true`.
4. **Live Negative Lean Tamper Gate, Dual Timestamps & Deterministic arXiv Tarball (`F72`, `F73`, `F81`):**
   - Added `scripts/test_lean_negative.py` (verifies injected `sorry` and weakened `Challenge.lean` rejection), `scripts/stamp_manifest.py` (DigiCert RFC 3161 `.tsr` + 3-calendar Bitcoin `.ots`), `SUBMISSION_READINESS.md`, `results/citation-audit.json`, and bit-identical normalized `dist/arxiv_submission.tar.gz`.
   - Expanded true source-code mutants in `test/mutants.mjs` from `8/8` to **`10/10`** (`34/34` Node tests).

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

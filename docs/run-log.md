# Append-Only Execution & Verification Run Log (`docs/run-log.md`)

> Build Standard `B40`. Chronological, append-only record of major verification runs, pre-registered experiments, Lean audits, and release freezes. Never delete or rewrite prior entries.

---

### 2026-11-18 — `v1.0.0` Initial Release
- Built zero-dependency `src/engine/{padic,holography,quantum,simulation}.js`, WebGL2 observatory, 48 kHz AudioWorklet, initial Lean 4 library, and 9-theorem Node suite (`9/9` pass).

### 2026-11-21 — `v1.1.0` AMS-LaTeX Paper, 36-Decl Lean Audit & Exact Python Falsifier
- Added `paper/main.tex` (Tectonic `0.17.0`, zero warnings), 36-declaration `VerifyAxioms.lean`, `scripts/verify_exact.py`, and 4-job GitHub Actions CI (`27d1eb2`).

### 2026-11-21 — `v1.2.0` Universal Proofs, Open Frontiers E–F, Mutants & GitHub Pages
- Expanded Lean 4 proofs to `71` declarations (universal Monna involution, first-principles Kantorovich BTZ Ollivier-Ricci, arbitrary $K$-ball solitons); resolved Open Frontiers #1–#2 (Exp E–F); added `test/mutants.mjs` (`6/6` killed); deployed live GitHub Pages (`a3a3dc1`).

### 2026-11-21 — `v1.3.0` Theorem V (Curved AdS Gauss-Bonnet), Exp G–H & 16-Issue Audit
- Discovered and proved Theorem V in `HolographyCurvature.lean` (`101` declarations); added Exp G–H & Figure 5; completed 16-issue multi-layer adversarial audit (`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`); killed `8/8` mutants (`e42e6af`); registered `0TH-BUILD-003` in `0thernes-research-archive`.

### 2026-11-25 — `v1.4.0` Pre-Registration Seal (`c171b1b`)
- Committed git-sealed [`docs/preregistration.md`](preregistration.md) at commit `c171b1b268b92931a44bfe0f601c6c9ffb2baeb8` *prior* to running `scripts/stats_eval.mjs` (Build Standard `B32`).

### 2026-11-25 — `v1.4.0` Cycle 1 Hardening Run (Engine, Server, 6-Kernel Lean & Tests)
- Audited all `1,900` open problems in `0thernes/unsolved-problems-mega-atlas` -> logged honest `0/1,900` full solutions verdict in [`docs/MEGA_ATLAS_CROSSCHECK.md`](MEGA_ATLAS_CROSSCHECK.md).
- Hardened `src/engine/*.js`, `src/web/*` (WCAG 2.2 AA), and `server.mjs` (`/healthz`, CSP, fail-fast `parsePort`, fixed `ERR_HTTP_HEADERS_SENT` bug caught by B21 EIO failure injection).
- Proved **Theorem V-Global** (arbitrary multi-edge curved AdS Gauss-Bonnet) and **Theorem VI** (universal holographic Ryu-Takayanagi Strong Subadditivity) in pure Lean `v4.35.0` (`120` declarations, `autoImplicit = false`, zero warnings/errors).
- Built isolated `Spec.lean` / `Challenge.lean` / `Solution.lean` / `comparator.json` and passed 5 independent local kernels (`Lean 4.35.0`, `leanchecker --fresh`, `leanchecker-paranoid --fresh`, `con-leche --verified`, `con-ron --verified`, `nanoda_bin 0.4.19` strict allowlist on all 1,886 pruned target declarations).
- Executed `npm run verify:all` (`26/26` pass in `360 ms`), `reference/padic_oracle.py` (`1,000` queries + `40` full DFTs, `max_err = 1.23e-12`), `scripts/stats_eval.mjs` (Exp I: `4/4` confirmed at `p_holm = 0.0004`), and `scripts/bench.mjs` (`0.3882 ms` coupled BTZ frame, `319.89x` FFT speedup at $N=625$).

### 2026-11-25 — `v1.4.0` Cycles 2 & 3 Compliance, White Paper & Release Freeze
- Completed full 90-item Build Standard `v1.2.0` (`Audit-Repo.ps1`: 100% applicable pass) and Playbook `v1.3` upgrades (affiliation correction removing unformed `"0thernes LLC"`, statement-fidelity audit, citation/DOI checks, verbatim README `#print axioms` check, zero-warning AMS-LaTeX PDF + standalone arXiv tarball, browser QA screenshot & social preview, cross-platform + 6-kernel `bubblewrap` CI, release `v1.4.0` + `0thernes-research-archive` sync).

### 2026-11-25 — `v1.4.1` Post-Release Visual PDF, Static-Analysis & Live Browser QA Polish
- Conducted page-by-page visual inspection of the rendered PDF, CI report-only linter logs, and live public GitHub Pages browser QA (`https://0thernes.github.io/ultrametrica/web/`).
- Resolved `F23`–`F28`: eliminated `--paranoid` en-dash ligatures, added `\usepackage[section]{placeins}` + `\FloatBarrier` so Section 8 floats never spill into Section 9, restored `\cite{deMouraUllrich2021}` (`21/21` references), replaced `\usepackage{xurl}` with punctuation-only URL breaks, cleared all `20` `ruff` warnings and `1` `mypy` error (both exit `0`), split `ruff`/`mypy` CI steps, added explicit `120 Declarations` to `?` modal + responsive `<= 1240px` / `<= 1020px` / `<= 760px` CSS rules, refreshed `docs/media/ultrametrica-observatory.png`, and shipped immutable patch release `v1.4.1` + `0TH-BUILD-003` archive sync.

### 2026-11-26 — `v1.5.0` Live Browser Crash Fix, First-Principles Multi-Edge Kantorovich Duality, Palomar Modules, Blueprint & Live DOI Audit
- Live interactive browser stress sweep caught critical curved-BTZ SPFA negative-cycle crash (`F35`, `RangeError: Invalid array length` at `holography.js:92` on `ER=EPR Wormhole Surgery` + `BTZ Hole`); replaced SPFA with Johnson potential-reduced Dijkstra (`rc >= 0`, cycle-impossible) and added 200-trial curved-BTZ stress tests (`27/27` Node tests PASS).
- Upgraded all 10 Lean 4.35.0 files to Palomar Registry `module` headers (`F29`), proved 14 first-principles arbitrary-degree arbitrary-weight multi-edge Kantorovich primal-dual duality theorems in `HolographyCurvature.lean` (`F30`), added 5 kernel-checked adversarial false-variant negations in `AdversarialTests.lean`, expanded `Challenge`/`Solution` to 10 isolated comparator targets (`149` audited declarations total, 0 `sorry`/warnings), and added `lake check --paranoid` + 6-kernel `lake comparator --paranoid` in CI.
- Built interactive strict-CSP Lean 4 Proof Blueprint (`src/web/blueprint.{html,css,js}`) verified by `scripts/check_blueprint.py` (`54/54` decls + `10/10` targets), created `scripts/check_citations.py` (`--live` verified `21/21` BibTeX↔LaTeX, `18/18` live Crossref DOIs HTTP 200, `0` retractions; fixed `Kozyrev2002` title) + `docs/LITERATURE_SEARCH.md`, achieved `0` errors under strict `tsc --noEmit -p jsconfig.json` across `src/engine/*.js`, froze `v1.5.0` benchmarks (`0.7307 ms` frame, `445.37×` FFT speedup), recompiled zero-warning PDF + arXiv bundle, and synced `0TH-BUILD-003`.

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

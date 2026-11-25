# AGENTS.md — ULTRAMETRICA Engineering & Scientific Verification Guide

> Canonical agent instruction entry point (`A32` of Build Standard `v1.2.0`). `CLAUDE.md`, `GEMINI.md`, and `.cursor/rules/build-standard.mdc` reference this file.

## 1. Project Identity & Scope

- **Project:** **ULTRAMETRICA** (`0thernes/ultrametrica`, `v1.4.0`) — zero-dependency real-time $p$-adic AdS/CFT holographic quantum gravity, rotating Tate-curve Kerr-BTZ black hole, Kozyrev wavelet, 48 kHz prime-power AudioWorklet, and pure Lean 4 (`v4.35.0`) formal verification laboratory.
- **Author & Affiliation:** Alexander Stephen Donahue (`Alexander S. Donahue`), ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648), **Independent Researcher, Spokane, WA, USA** (`0_0@0thernes.art`, `https://0thernes.art`, `https://github.com/0thernes`). Never assert `"0thernes LLC"` as a legal entity.
- **License:** `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` ([`LICENSE`](LICENSE)). Keep attribution intact; see [`LEGAL.md`](LEGAL.md) and [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md).

## 2. Hard Rules (Non-Negotiable — Build Standard R1–R8)

- **R1 — Solo Dev Ergonomics:** Never install git hooks, branch protection, commit/tag signing, or blocking lint/SAST/SBOM CI gates. Lint/type/secret checks in CI must remain **report-only** (`continue-on-error: true`).
- **R2 — Direct to `main`:** Commit and push directly to `main`. Zero PRs, zero feature branches, zero `.github/pull_request_template.md`.
- **R3 — Tests Block; Linters Report:** Functional, mutant, property, contract, golden, oracle, Lean 4 kernel/comparator, and Tectonic zero-warning PDF checks fail CI on broken invariants; style/static linters report without blocking.
- **R4 — No Banned Files:** Never add Dependabot, Renovate, PR templates, Copilot instructions, `FUNDING.yml`, or `CODEOWNERS`.
- **R5 — Ten-Class Finding Taxonomy:** Every audit or review finding MUST be tagged with one of the exact 10 classes: `bug`, `error`, `issue`, `problem`, `concern`, `dilemma`, `conflict`, `gap`, `hole`, `blindspot`.
- **R6 — Never Fabricate:** Never invent measurements, p-values, citations/DOIs, peer-review claims, or badges. Distinguish strictly between `kernel-checked`, `exact-rational`, `numerical`, `pre-registered statistical`, and `prior work` tiers.
- **R7 — Lean 4 Kernel Integrity:** Zero `sorry`, `admit`, `axiom`, `native_decide`, `unsafe`, `implemented_by`, or `@[extern` in `lean/UltrametricaProofs.lean`, `lean/UltrametricaProofs/*.lean`, and `lean/Solution.lean` (`lean/Challenge.lean` intentionally holds specification `sorry`s matched by `lake comparator --paranoid`). All audited axioms strictly inside `[propext, Classical.choice, Quot.sound]`.
- **R8 — Preserve Author License & Identity:** Keep `LICENSE` and canonical ORCID `0009-0006-8168-9648` synchronized everywhere.

## 3. Repository Map

| Path | Responsibility |
|---|---|
| `src/engine/` | Pure zero-dependency ES modules (`padic.js`, `holography.js`, `quantum.js`, `simulation.js`) |
| `src/web/` | WebGL2 3D observatory (`renderer3d.js`), 2D panels (`panels2d.js`), 48 kHz AudioWorklet (`audio*.js`), WCAG 2.2 AA UI (`index.html`, `styles.css`, `app.js`) |
| `server.mjs` | Hardened static server with `/healthz`, strict CSP, fail-fast `PORT` validation, structured JSON logging |
| `lean/` | Pure Lean `v4.35.0` formalization (0 Mathlib): `UltrametricaProofs/{Spec,Basic,AdelicSymmetry,HolographyCurvature,SolitonAndSolver}.lean`, `VerifyAxioms.lean` (120 decls), `Challenge.lean`, `Solution.lean`, `comparator.json` |
| `test/` | `verify.mjs` (10 theorems), `mutants.mjs` (8 killed mutants), `properties.mjs` (3,200+ property/metamorphic/negative cases), `server.mjs` (HTTP contract + EIO failure injection), `golden.mjs` |
| `reference/` | Independent textbook Python oracle (`padic_oracle.py`) |
| `scripts/` | `verify_exact.py`, `check_readme_axioms.py`, `discover.mjs`, `bench.mjs`, `stats_eval.mjs`, `generate_figures.py`, `package_dist.py`, `Audit-Repo.ps1`, `audit-repo.sh` |
| `paper/` & `dist/` | AMS-LaTeX white paper (`main.tex`, `refs.bib`, `WHITE_PAPER.md`), 5 PGFPlots vector figures, frozen `dist/Donahue_2026_Ultrametrica.pdf` & `dist/arxiv_submission.tar.gz` |
| `docs/` | `CLAIMS.md`, `MASTER_REPORT.md`, `AUDIT_AND_CONTRAST_ANALYSIS.md`, `MEGA_ATLAS_CROSSCHECK.md`, `preregistration.md`, `statement-fidelity.md`, `architecture.md`, `adr/`, `benchmarks.md`, `threat-model.md`, `configuration.md`, `operations.md`, `faq.md`, `glossary.md`, `run-log.md`, `reviews/` |

## 4. Exact Verification Commands

```bash
# 1. All Node test suites (26 tests: 10 theorems + 8 mutants + properties + server + golden)
npm run verify:all

# 2. Runnable examples + benchmarks + pre-registered statistics + discovery
npm run examples
npm run bench
npm run stats
npm run discover

# 3. Independent Python differential oracle & exact-rational falsifier + checksums
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
python scripts/verify_exact.py --check-checksums

# 4. Lean 4.35.0 full build, 120-declaration axiom audit, leanchecker & 6-kernel comparator
cd lean
lake clean && lake build UltrametricaProofs Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
lake comparator --config comparator.json --paranoid   # Ubuntu/Linux with bubblewrap

# 5. White paper figures, zero-warning PDF, and standalone arXiv check
python scripts/generate_figures.py
python scripts/package_dist.py

# 6. Build Standard v1.2.0 90-item repo audit
pwsh -NoProfile -File scripts/Audit-Repo.ps1 -Path .   # Windows
bash scripts/audit-repo.sh .                           # Linux/macOS
```

## 5. Known Technical Traps

1. **PowerShell Bracket Paths:** On Windows dev machines with literal brackets in parent paths (e.g. `Z:\[Vibe Coded (AI)]\...`), always use `-LiteralPath` in PowerShell file cmdlets.
2. **LF Line Endings & SHA-256:** `CHECKSUMS.sha256` and `data/MANIFEST.sha256` hash exact bytes; preserve Unix `LF` (`\n`) endings on all text files (enforced by `.editorconfig` and `.gitattributes`).
3. **HTTP Keep-Alive & `headersSent`:** In `server.mjs`, always `await fsImpl.readFile(...)` *before* calling `res.writeHead(200, ...)` on `GET`, and close keep-alive sockets in tests via `agent: false` + `server.closeAllConnections?.()`.
4. **Finite-Cutoff Boundary Edges on $T_p$:** Theorem V / V-Global holds on strictly interior edges whose endpoints both have full degree $p + 1$; finite cutoff trees have root degree $p$ (depth $0$) and leaf degree $1$ (depth $n$), so interior perturbations require `nodeDepth[u] >= 2 && nodeDepth[v] <= n - 2` (`n >= 4`).
5. **Pre-Registration Discipline:** Never edit `docs/preregistration.md` retroactively after running `scripts/stats_eval.mjs`; commit any new experiment preregistration *before* execution.

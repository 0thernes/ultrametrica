# AGENTS.md — ULTRAMETRICA Engineering & Scientific Verification Guide

> Canonical agent instruction entry point (`A32` of Build Standard `v1.2.0`). `CLAUDE.md`, `GEMINI.md`, and `.cursor/rules/build-standard.mdc` reference this file.

## 1. Project Identity & Scope

- **Project:** **ULTRAMETRICA** (`0thernes/ultrametrica`, `v1.8.0`) — zero-dependency real-time discrete $p$-adic AdS/CFT (Bruhat-Tits tree) holography laboratory featuring rotating Tate-curve Kerr-BTZ black hole quotients, Kozyrev wavelets, 48 kHz prime-power AudioWorklet sonification, and pure Lean 4 (`v4.35.0`) checked discrete model invariants.
- **Author & Affiliation:** Alexander Stephen Donahue (`Alexander S. Donahue`), ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648), **Independent Researcher, Spokane, WA, USA** (`0_0@0thernes.art`, `https://0thernes.art`, `https://github.com/0thernes`). Never assert `"0thernes LLC"` as a legal entity.
- **License:** `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` ([`LICENSE`](LICENSE)). Keep attribution intact; see [`LEGAL.md`](LEGAL.md) and [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md).

## 2. Hard Rules (Non-Negotiable — Build Standard R1–R8)

- **R1 — Solo Dev Ergonomics:** Never install git hooks, branch protection, commit/tag signing, or blocking lint/SAST/SBOM CI gates. Lint/type/secret checks in CI must remain **report-only** (`continue-on-error: true`).
- **R2 — Direct to `main`:** Commit and push directly to `main`. Zero PRs, zero feature branches, zero `.github/pull_request_template.md`.
- **R3 — Tests Block; Linters Report:** Functional, true source-code mutant, property, fuzz, concurrency, contract, golden, oracle, Lean 4 kernel/comparator, and Tectonic zero-warning PDF checks fail CI on broken invariants; style/static linters report without blocking.
- **R4 — No Banned Files:** Never add Dependabot, Renovate, PR templates, Copilot instructions, `FUNDING.yml`, or `CODEOWNERS`.
- **R5 — Ten-Class Finding Taxonomy:** Every audit or review finding MUST be tagged with one of the exact 10 classes: `bug`, `error`, `issue`, `problem`, `concern`, `dilemma`, `conflict`, `gap`, `hole`, `blindspot`.
- **R6 — Never Fabricate:** Never invent measurements, p-values, citations/DOIs, peer-review claims, or badges. Distinguish strictly between `kernel-checked`, `exact-rational`, `numerical`, `pre-registered statistical`, and `prior work` tiers; report Lean declarations honestly in four buckets (`144 core + 81 helpers + 10 adv + 15 isolated bindings = 250`, 100.0% public theorem coverage) without double-counting comparator bindings.
- **R7 — Lean 4 Kernel Integrity:** Zero `sorry`, `admit`, `axiom`, `native_decide`, `unsafe`, `implemented_by`, or `@[extern` in `lean/UltrametricaProofs.lean`, `lean/UltrametricaProofs/*.lean`, `lean/SolutionBridge.lean`, and `lean/Solution.lean` (`lean/Challenge.lean` intentionally holds specification `sorry`s matched by `lake comparator --paranoid` with zero `_proof_` constants in target signatures). All audited axioms strictly inside `[propext, Classical.choice, Quot.sound]`, 100.0% public theorem coverage (`0` unaudited). Keep every `.lean` file `< 1,000` lines.
- **R8 — Preserve Author License & Identity:** Keep `LICENSE` and canonical ORCID `0009-0006-8168-9648` synchronized everywhere.

## 3. Repository Map

| Path | Responsibility |
|---|---|
| `src/engine/` | Pure zero-dependency strict-JSDoc ES modules (`padic.js`, `holography.js`, `quantum.js`, `simulation.js`) |
| `src/web/` | WebGL2 3D observatory (`renderer3d.js`), 2D panels (`panels2d.js`), 48 kHz AudioWorklet (`audio*.js`), WCAG 2.2 AA UI (`index.html`, `styles.css`, `app.js`, `favicon.svg`), interactive Proof Blueprint (`blueprint.{html,css,js}`) |
| `server.mjs` | Hardened static server with `/healthz`, `realpath` symlink confinement, strict CSP, fail-fast `PORT` validation, single-source `VERSION`, structured JSON logging |
| `lean/` | Pure Lean `v4.35.0` formalization (Palomar `module`, 0 Mathlib, all 17 `.lean` files `< 1,000` lines, 100.0% public theorem coverage): `UltrametricaProofs/{Spec,Basic,AdelicSymmetry,OperatorAndSpectrum,HolographyCurvature,FullGraphBTZ,MultiEdgeHolography,FiniteGraphGaussBonnet,SolitonAndSolver,BulkOperatorPositivity,VladimirovOperator,AdversarialTests}.lean`, `VerifyAxioms.lean` (`250` audited decls), `Challenge.lean`, `SolutionBridge.lean`, `Solution.lean`, `comparator.json` (`15` targets) |
| `test/` | `verify.mjs` (10 theorems), `mutants.mjs` (**12** true source-code killed mutants), `properties.mjs` (3,400+ property/metamorphic/curved-BTZ Dijkstra stress/`F93`–`F94` cases), `server.mjs` (HTTP contract/`favicon.svg`/`realpath` + EIO), `golden.mjs`, `fuzz.mjs` (1,000 B15 fuzz cases), `concurrency.mjs` (B19 HTTP + AudioWorklet VM storm) |
| `reference/` | Independent textbook Python oracle (`padic_oracle.py`) |
| `scripts/` | `verify_exact.py`, `check_readme_axioms.py`, `check_citations.py`, `check_blueprint.py`, `test_lean_negative.py`, `stamp_manifest.py`, `build_llms_full.py`, `discover.mjs`, `bench.mjs`, `stats_eval.mjs`, `generate_figures.py`, `package_dist.py`, `Audit-Repo.ps1`, `audit-repo.sh` |
| `paper/` & `dist/` | AMS-LaTeX white paper (`main.tex`, `refs.bib`, `WHITE_PAPER.md`), 5 PGFPlots vector figures, frozen `dist/Donahue_2026_Ultrametrica.pdf` & bit-identical deterministic `dist/arxiv_submission.tar.gz` |
| `docs/` & root | `CLAIMS.md`, `LIMITATIONS.md`, `SUBMISSION_READINESS.md`, `DEVIATIONS.md`, `REPLICATION.md`, `ERRATA.md`, `docs/{CLAIMS,MASTER_REPORT,AUDIT_AND_CONTRAST_ANALYSIS,MEGA_ATLAS_CROSSCHECK,LITERATURE_SEARCH,preregistration,statement-fidelity,architecture,benchmarks,threat-model,configuration,operations,faq,glossary,run-log}.md`, `docs/adr/`, `docs/reviews/` |

## 4. Exact Verification Commands

```bash
# 1. All 36 Node test suites (theorems + 12/12 true source mutants + properties + server/favicon + golden + fuzz + concurrency)
npm run verify:all

# 2. Runnable examples + benchmarks + pre-registered statistics + discovery
npm run examples
npm run bench
npm run stats
npm run discover

# 3. Independent Python differential oracle, axiom/DOI/blueprint/timestamp guards & exact-rational falsifier + checksums + 100% Lean coverage + Markdown link check
python reference/padic_oracle.py
python scripts/check_readme_axioms.py
python scripts/check_citations.py --live
python scripts/check_blueprint.py
python scripts/stamp_manifest.py --verify
python scripts/verify_exact.py --check-checksums

# 4. Lean 4.35.0 full build, 250-declaration axiom audit, leanchecker, 15-target 6-kernel comparator & live negative tamper gate
cd lean
lake clean && lake build UltrametricaProofs SolutionBridge Challenge Solution
lake env lean VerifyAxioms.lean
lake env leanchecker --fresh UltrametricaProofs
lake env leanchecker --fresh Solution
lake check --paranoid                                  # Ubuntu/Linux with bubblewrap
lake comparator --config comparator.json --paranoid    # Ubuntu/Linux with bubblewrap
cd ..
python scripts/test_lean_negative.py                   # Live negative tamper-rejection gate (--with-comparator on Linux)

# 5. White paper figures, zero-warning PDF, and standalone arXiv check
python scripts/generate_figures.py
python scripts/package_dist.py

# 6. Build Standard v1.2.0 90-item repo audit
pwsh -NoProfile -File scripts/Audit-Repo.ps1 -Path .   # Windows
bash scripts/audit-repo.sh .                           # Linux/macOS
```

## 5. Known Technical Traps

1. **PowerShell Bracket Paths:** On Windows dev machines with literal brackets in parent paths (e.g. `Z:\[Vibe Coded (AI)]\...`), always use `-LiteralPath` in PowerShell file cmdlets.
2. **LF Line Endings & SHA-256:** `CHECKSUMS.sha256` and `data/MANIFEST.sha256` hash exact bytes; preserve Unix `LF` (`\n`) endings and zero UTF-8 BOM on all text files (enforced by `.editorconfig` and `.gitattributes`).
3. **HTTP Keep-Alive, `headersSent` & `realpath`:** In `server.mjs`, always verify `realpath` confinement and `await fsImpl.readFile(...)` *before* calling `res.writeHead(200, ...)` on `GET`, and close keep-alive sockets in tests via `agent: false` + `server.closeAllConnections?.()`.
4. **Child `node --test` Inside `node --test`:** When spawning child `node --test` processes from a test file (as in `test/mutants.mjs`), always delete `NODE_TEST_CONTEXT` from the child environment or Node will silently skip reporting test failures.
5. **Palomar 6-Kernel Comparator `_proof_` Subterms (`F85`):** Never embed `by` proof tactics inside target **type signatures** in `Challenge.lean` or `Solution.lean` — doing so synthesizes distinct `Challenge._proof_k` vs. `Solution._proof_k` constants that fail `lake comparator`. Use pure term proofs or hypotheses in target types.
6. **Finite-Cutoff Boundary Edges on $T_p$:** Theorem V / V-Global holds on strictly interior edges whose endpoints both have full degree $p + 1$; finite cutoff trees have root degree $p$ (depth $0$) and leaf degree $1$ (depth $n$), so interior perturbations require `nodeDepth[u] >= 2 && nodeDepth[v] <= n - 2` (`n >= 4`).
7. **Pre-Registration Discipline:** Never edit historical committed sections of `docs/preregistration.md` retroactively; log any exploratory post-registration extensions transparently in `DEVIATIONS.md` and `docs/preregistration.md` §3.

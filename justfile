# ULTRAMETRICA (v1.4.1) — Canonical Task Runner (`justfile`, Build Standard A31/A36/B01)
set shell := ["bash", "-euo", "pipefail", "-c"]
set windows-shell := ["pwsh", "-NoProfile", "-Command"]

default:
    @just --list

# Verify toolchain versions (zero external runtime dependencies to install)
setup:
    node --version
    python --version

# Run all 26 Node tests (10 theorems + 8 killed mutants + 3,200+ properties + server contract/EIO + golden)
test:
    npm run verify:all

# Run planted negative-mutant falsification suite
falsify:
    npm run falsify

# Run property-based, metamorphic, determinism & negative-input suite
properties:
    npm run properties

# Run all 3 runnable examples
examples:
    npm run examples

# Run hardware-tagged performance benchmarks -> results/perf-benchmarks.json
bench:
    npm run bench

# Run pre-registered Experiment I statistical evaluation -> results/stats-eval.json
stats:
    npm run stats

# Run all 8 reproducible physics discovery benchmarks -> results/discovery-benchmarks.json
discover:
    npm run discover

# Independent textbook Python differential oracle + exact-rational falsifier + checksums
oracle:
    python reference/padic_oracle.py
    python scripts/check_readme_axioms.py
    python scripts/verify_exact.py --check-checksums

# Report-only syntax & static checks (non-blocking per Hard Rules R1/R3)
lint:
    node --check server.mjs src/engine/padic.js src/engine/holography.js src/engine/quantum.js src/engine/simulation.js src/web/app.js src/web/renderer3d.js src/web/panels2d.js src/web/audio.js src/web/audio-worklet.js
    python -m py_compile scripts/verify_exact.py scripts/check_readme_axioms.py scripts/generate_figures.py scripts/package_dist.py scripts/build_llms_full.py reference/padic_oracle.py

# Build & audit pure Lean 4.35.0 proofs (120 decls + leanchecker + 6-kernel comparator on Linux)
lean:
    cd lean && lake build UltrametricaProofs Challenge Solution && lake env lean VerifyAxioms.lean && lake env leanchecker --fresh UltrametricaProofs && lake env leanchecker --fresh Solution

# Rebuild vector figures, zero-warning AMS-LaTeX PDF, and standalone-verified arXiv tarball
paper:
    python scripts/generate_figures.py
    python scripts/package_dist.py

# One-command full deterministic reproduction (Build Standard B01)
reproduce: test examples oracle discover bench stats lean paper
    python scripts/verify_exact.py --check-checksums

# Run local hardened WebGL2 observatory server (GET /healthz + http://127.0.0.1:4173)
serve:
    node server.mjs

# Run Build Standard v1.2.0 90-item repo audit
audit:
    bash scripts/audit-repo.sh .

# Build offline llms-full.txt bundle
llms:
    python scripts/build_llms_full.py

# Deploy note: GitHub Pages deploys automatically from main via .github/workflows/pages.yml
deploy:
    git push origin main

# Rollback release/deployment safely to a prior verified tag (Build Standard A36)
rollback tag="v1.3.0":
    @echo "Inspecting target tag {{tag}} before rollback..."
    git show --stat {{tag}}
    @echo "To roll back main cleanly while preserving history, run: git revert --no-commit {{tag}}..HEAD && git commit -m 'revert: rollback to {{tag}}' && git push origin main"

# Remove temporary build caches (never deletes tracked dist/ or results/)
clean:
    rm -rf paper/build lean/.lake/challenge.ndjson lean/.lake/solution.ndjson

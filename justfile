# ULTRAMETRICA (v1.7.0) — Canonical Task Runner (`justfile`, Build Standard A31/A36/B01)
set shell := ["bash", "-euo", "pipefail", "-c"]
set windows-shell := ["pwsh", "-NoProfile", "-Command"]

default:
    @just --list

# Verify toolchain versions (zero external runtime dependencies to install)
setup:
    node --version
    python --version

# Run all 34 Node tests (10 theorems + 10 real source mutants + 3,400+ properties + 1,000 fuzz + 3 concurrency/race + server + golden)
test:
    npm run verify:all

# Run real source-code mutation testing suite (10/10 production mutants killed)
falsify:
    npm run falsify

# Run property-based, metamorphic, determinism & negative-input suite
properties:
    npm run properties

# Run deterministic HTTP + engine fuzzing suite (B15)
fuzz:
    npm run fuzz

# Run concurrent HTTP burst + AudioWorklet race suite (B19)
concurrency:
    npm run concurrency

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

# Independent textbook Python differential oracle + blueprint/citation/timestamp guards + exact-rational falsifier + checksums
oracle:
    python reference/padic_oracle.py
    python scripts/check_readme_axioms.py
    python scripts/check_citations.py
    python scripts/check_blueprint.py
    python scripts/stamp_manifest.py --verify
    python scripts/verify_exact.py --check-checksums

# Report-only syntax & static checks (non-blocking per Hard Rules R1/R3)
lint:
    node --check server.mjs src/engine/padic.js src/engine/holography.js src/engine/quantum.js src/engine/simulation.js src/web/app.js src/web/blueprint.js src/web/renderer3d.js src/web/panels2d.js src/web/audio.js src/web/audio-worklet.js
    npx --yes -p typescript tsc --noEmit -p jsconfig.json
    python -m py_compile scripts/verify_exact.py scripts/check_readme_axioms.py scripts/check_citations.py scripts/check_blueprint.py scripts/test_lean_negative.py scripts/stamp_manifest.py scripts/generate_figures.py scripts/package_dist.py scripts/build_llms_full.py reference/padic_oracle.py

# Build & audit pure Lean 4.35.0 proofs (202 audited decls: 127 core + 56 helpers + 7 adversarial + 12 isolated comparator targets)
lean:
    cd lean && lake build UltrametricaProofs Challenge Solution && lake env lean VerifyAxioms.lean && lake env leanchecker --fresh UltrametricaProofs && lake env leanchecker --fresh Solution

# Run live negative Lean tamper-rejection gate (verifies sorry & weakened target rejection)
lean-negative:
    python scripts/test_lean_negative.py

# Mint dual DigiCert RFC 3161 (.tsr) + 3-calendar Bitcoin OpenTimestamps (.ots) over CHECKSUMS.sha256
stamp:
    python scripts/stamp_manifest.py

# Rebuild vector figures, zero-warning AMS-LaTeX PDF, and deterministic standalone-verified arXiv tarball
paper:
    python scripts/generate_figures.py
    python scripts/package_dist.py

# One-command full deterministic reproduction (Build Standard B01)
reproduce: test examples oracle discover bench stats lean lean-negative paper
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
rollback tag="v1.6.0":
    @echo "Inspecting target tag {{tag}} before rollback..."
    git show --stat {{tag}}
    @echo "To roll back main cleanly while preserving history, run: git revert --no-commit {{tag}}..HEAD && git commit -m 'revert: rollback to {{tag}}' && git push origin main"

# Remove temporary build caches (never deletes tracked dist/ or results/)
clean:
    rm -rf paper/build lean/.lake/challenge.ndjson lean/.lake/solution.ndjson

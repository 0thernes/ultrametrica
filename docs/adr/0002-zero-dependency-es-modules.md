# ADR-0002: Zero-Dependency ES Modules & Python Standard Library Oracles

- **Date:** 2026-11-18 (reaffirmed 2026-11-25)
- **Status:** Accepted

## Context

Scientific web laboratories often accumulate hundreds of npm packages (Three.js, bundlers, React toolchains) and Python binary wheels (NumPy, SciPy), causing supply-chain vulnerabilities, bit-rot within months, and opaque floating-point backends.

## Decision

Implement the entire physics engine (`src/engine/`), WebGL2 GLSL 300 es renderer (`src/web/renderer3d.js`), 48 kHz AudioWorklet DSP (`src/web/audio-worklet.js`), HTTP server (`server.mjs`), test suites (`test/`), and Python exact-rational / differential oracles (`scripts/verify_exact.py`, `reference/padic_oracle.py`) with **zero external runtime dependencies** (only Node.js built-ins, browser WebGL2/WebAudio APIs, and Python standard library `fractions.Fraction`).

## Alternatives Considered

1. **Three.js + Vite + NumPy/SciPy:** Rejected due to build-step fragility, supply-chain surface, and floating-point-only SciPy LP solvers (whereas Python `fractions.Fraction` provides exact zero-rounding-error optimal transport).

## Consequences

- **Positive:** Zero `node_modules` attack surface (`package-lock.json` locks 0 external packages), instant GitHub Pages deployment directly from `src/`, decades-long Software Heritage reproducibility, and exact rational verification.
- **Trade-off:** Custom WebGL2 matrix math, Jacobi eigensolver, and PGFPlots figure generation must be maintained in-repo (offset by comprehensive mutant, property, and differential-oracle tests).

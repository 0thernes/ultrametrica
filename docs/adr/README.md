# Architecture Decision Records (`docs/adr/`)

> Build Standard `A21`. Immutable log of major architectural, mathematical, formal-verification, and licensing decisions made in **ULTRAMETRICA**, including rejected alternatives and honest trade-offs.

| ADR | Date | Status | Decision |
|---|---|---|---|
| [ADR-0001](0001-zero-mathlib-lean4.md) | 2026-11-21 | Accepted | Pure Lean 4 (`v4.35.0`) core formalization with zero Mathlib dependencies + isolated `Spec`/`Challenge`/`Solution` 6-kernel comparator |
| [ADR-0002](0002-zero-dependency-es-modules.md) | 2026-11-18 | Accepted | Zero-dependency ES modules (`src/engine/`, `src/web/`, `server.mjs`) and Python stdlib-only oracles |
| [ADR-0003](0003-rank1-sherman-morrison-kerr-btz.md) | 2026-11-18 | Accepted | Exact $O(V)$ bottom-up Schur complement + Rank-1 edge-Laplacian Sherman-Morrison Kerr-BTZ bulk solver |
| [ADR-0004](0004-jacobi-gravity-update.md) | 2026-11-21 | Accepted | Symmetric Jacobi (`_sigmaSnap`) edge-length gravity update replacing in-place Gauss-Seidel |
| [ADR-0005](0005-cosmogonic-noncommercial-license.md) | 2026-11-25 | Accepted (`dilemma` logged) | Retain `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` with explicit OSI/Mathlib/JOSS trade-off record |

# ADR-0004: Symmetric Jacobi Edge-Length Gravity Update (`_sigmaSnap`)

- **Date:** 2026-11-21
- **Status:** Accepted

## Context

During the `v1.3.0` multi-layer adversarial audit (`BUG-3`), `BruhatTitsBulk.stepGravity` updated edge log-lengths $\sigma_e$ in-place in index order (Gauss-Seidel sweep). Because edge `i` read already-mutated values of earlier sibling edges `j < i` on the Bruhat-Tits tree $T_p$, identical symmetric boundary stress-energy broke exact sibling permutation symmetry $\mathrm{Aut}(T_p)$ by $O(10^{-4})$ after a few frames.

## Decision

Snapshot `this._sigmaSnap.set(this.sigma)` into a preallocated `Float64Array` at the start of every `stepGravity` call so all line-graph Laplacian neighbor averages read strictly from time-level $t$ (symmetric Jacobi update), and lock the invariant with planted negative mutant **M7** in `test/mutants.mjs`.

## Consequences

- **Positive:** Restores exact Bruhat-Tits sibling symmetry to $< 10^{-15}$ with zero per-frame garbage-collection allocations (`_sigmaSnap` allocated once per `BruhatTitsBulk`).
- **Trade-off:** Negligible memory overhead (`8 * numEdges` bytes, `< 8 KB` at $N = 625$).

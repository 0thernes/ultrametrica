# ADR-0003: Exact $O(V)$ Schur Complement + Rank-1 Sherman-Morrison Kerr-BTZ Bulk Solver

- **Date:** 2026-11-18
- **Status:** Accepted

## Context

Solving the gauge-covariant bulk Klein-Gordon equation on a rotating Tate-curve BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$ couples hanging $p$-adic subtrees to a closed complex-Hermitian cyclic tridiagonal horizon ring threaded by Aharonov-Bohm flux $\Omega$. Dense Gaussian elimination scales as $O(V^3)$ (prohibitive at 60 FPS), while naive Sherman-Morrison splitting of a cyclic matrix can suffer near-zero pivot cancellation if the wrap-around rank-1 update is indefinite.

## Decision

Eliminate all hanging subtrees bottom-up into the $L$ horizon vertices via exact $O(V)$ Schur complements, then extract the wrap-around horizon edge $e_{L-1}$ as the strictly positive semi-definite rank-1 edge Laplacian $w_{L-1} u u^\dagger \succeq 0$ ($u = [1, 0, \dots, 0, -e^{i\theta}]^T$), solving the open-chain Hermitian tridiagonal system $T$ twice via Thomas elimination and applying the exact Sherman-Morrison formula with denominator $\mathrm{den} = 1 + w_{L-1} u^\dagger T^{-1} u \ge 1 > 0$.

## Consequences

- **Positive:** Guaranteed $O(V)$ runtime (`0.22 ms` for $N = 625$ BTZ), the integer inequality $1 \le 1 + wq$ for $w, q \ge 0$ (`sherman_morrison_denominator_ge_one`, with $q \ge 0$ a hypothesis; positivity of $T$ and the solver are not in Lean), exact $\mathbb{Q}(i)$ zero-residual verification, and machine-precision stability (`5.38e-15`) all the way down to the Breitenlohner-Freedman bound $\Delta = 0.5001$ under maximal flux $\Omega = \pi$.
- **Trade-off:** Requires strict adherence to the BF stability regime ($T \succ 0$) so that $u^\dagger T^{-1} u \ge 0$; entering the tachyonic regime $\Delta < 0.5$ is guarded against in UI/engine bounds.

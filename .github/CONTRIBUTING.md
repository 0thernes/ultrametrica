# Contributing to ULTRAMETRICA

Contributions, independent proof audits, falsification tests, and prior-literature citations are welcomed for non-commercial research under [LICENSE](../LICENSE) and [LEGAL.md](../LEGAL.md).

## Scientific & Engineering Standards

1. **Zero Cosmetic Physics**: Every visual or acoustic channel must be driven directly by an exact mathematical observable (bulk field $\phi_v$, Ollivier-Ricci curvature $\kappa_e$, Ryu-Takayanagi cut $\gamma_A$, Kozyrev wavelet shell power, or metric strain $a_e$).
2. **Zero External Runtime Dependencies**: Core simulation (`src/engine/`), renderer (`src/web/`), and verification (`test/`) must remain pure ES modules with zero `npm` dependencies.
3. **Mandatory Verification**: Before opening a pull request, run:
   ```bash
   npm test
   npm run discover
   cd lean && lake build
   ```
   All 9 automated numerical theorem suites must pass and `lake build` must succeed with **zero `sorry`**, **zero custom axioms**, and **zero compiler warnings**.
4. **Licensing Agreement**: By submitting a contribution, you agree that your contribution may be distributed under the repository's [COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY](../LICENSE).

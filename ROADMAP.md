# Roadmap

Current release: **`v1.4.1`** (2026-11-25, status: `active`).

## Completed Milestones

- **`v1.0.0` (2026-11-18):** Zero-dependency Radix-$p$ Pontryagin FFT, Vladimirov operator $D_p^\alpha$, Kozyrev wavelets, 4th-order Yoshida symplectic engine, $O(V)$ Schur + Rank-1 Sherman-Morrison Kerr-BTZ bulk solver, WebGL2 observatory, 48 kHz AudioWorklet, initial Lean 4 proofs.
- **`v1.1.0` (2026-11-21):** Publication-grade zero-warning AMS-LaTeX white paper + Tectonic vector figures + standalone arXiv tarball, 36-declaration Lean 4 axiom auditor, independent Python exact-rational falsifier (`verify_exact.py`), 4-job GitHub Actions CI.
- **`v1.2.0` (2026-11-21):** 71 universal Lean 4 declarations (first-principles Kantorovich primal-dual BTZ Ollivier-Ricci law, universal Monna involution, arbitrary $K$-ball solitons), resolution of Open Frontiers #1–#2 (Experiments E–F), 6 planted negative mutants, public GitHub Pages observatory, `docs/CLAIMS.md`, `CHECKSUMS.sha256`.
- **`v1.3.0` (2026-11-21):** Theorem V (Curved AdS discrete Gauss-Bonnet conservation & supercritical pinch deficit), 101 Lean 4 declarations, Experiments G–H & Figure 5, 16-issue multi-layer adversarial audit (`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`), 8/8 killed mutants.
- **`v1.4.0` (2026-11-25):** Theorem V-Global (arbitrary multi-edge curved AdS Gauss-Bonnet), Theorem VI (universal holographic Ryu-Takayanagi Strong Subadditivity), 120 audited Lean 4 declarations + isolated `Spec`/`Challenge`/`Solution` 6-kernel `lake comparator --paranoid`, pre-registered confirmatory Experiment I (20-seed GUE/GOE rejection at $p_{\mathrm{Holm}} = 0.0004$), `unsolved-problems-mega-atlas` cross-check (`0/1,900` full solutions; discrete sub-results on `SUB-032`), 3,200+ property/metamorphic/contract/golden/oracle tests, WCAG 2.2 AA UI, Build Standard `v1.2.0` 90-item compliance, and Playbook `v1.3` white-paper overhaul.

## Planned Future Work (Not Yet Implemented)

1. **`v1.5.0` — Continuum-Limit Bridge & Higher-Genus Schottky Quotients (`SUB-032`):**
   - Extend exact Ollivier-Ricci transport from genus-1 Tate-curve BTZ quotients ($T_p / p^{h\mathbb{Z}}$) to genus-$g \ge 2$ Mumford-Schottky multiboundary wormholes.
   - Formalize the $n \to \infty$ analytic convergence of intra-sector spacing ratios $\langle r\rangle_{W_{0,m}} \to r_0(p, m)$ in Lean 4 using explicit asymptotic rational bounds (still zero Mathlib or optional separate Mathlib bridge package).
2. **`v1.6.0` — Multi-Prime Adelic Product Lattice ($\mathbb{A}_{\mathbb{Q}}$ Truncation):**
   - Couple finite tensor products $\bigotimes_{p \in S} L^2(\mathbb{Z}_p / p^{n_p}\mathbb{Z}_p) \otimes L^2(\mathbb{R})$ across small prime sets $S = \{2, 3, 5\}$ to test adelic product-formula invariants beyond single-prime hybrids.
3. **Open Licensing Decision (`dilemma`):**
   - Evaluate whether a future release should dual-license the Lean 4 proof modules under Apache-2.0 / CC-BY-4.0 if submitting formal proofs to Mathlib or software papers to OSI-requiring venues (see [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md)).

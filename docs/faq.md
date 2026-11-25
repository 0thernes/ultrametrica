# Frequently Asked Questions (`docs/faq.md`)

> Build Standard `A44`. Direct, non-evasive answers to skeptical questions from mathematicians, physicists, and reviewers.

### 1. Did ULTRAMETRICA solve any open problems from `0thernes/unsolved-problems-mega-atlas`?
**No — `0 / 1,900` full solutions.** A systematic audit of all `1,900` entries in `unsolved-problems-mega-atlas` is archived in [`docs/MEGA_ATLAS_CROSSCHECK.md`](MEGA_ATLAS_CROSSCHECK.md). ULTRAMETRICA contributes formally verified discrete finite-cutoff sub-results related to **`SUB-032`** ($p$-adic AdS/CFT) and an empirical/formal negative result falsifying naive GOE/GUE thermalization in Monna-conjugated adelic hybrids (`ANL-065`/`QM-016`), while leaving continuum limits ($n \to \infty$) and full adelic unification over $\mathbb{A}_{\mathbb{Q}}$ strictly open.

### 2. Why did you avoid Mathlib in the Lean 4 proofs?
Zero Mathlib yields three huge practical advantages for independent verification: (1) a clean build finishes in **~5 seconds** instead of downloading gigabytes of `.olean` caches; (2) every definition in [`lean/UltrametricaProofs/Spec.lean`](../lean/UltrametricaProofs/Spec.lean) is 100% transparent and readable in 101 lines without navigating deep typeclass hierarchies; and (3) `lake comparator --paranoid` can verify `Solution.lean` against `Challenge.lean` across **6 independent Lean kernels** (`Lean 4.35.0`, `leanchecker-paranoid`, `lean4lean`, `nanoda`, `con-leche`, `con-ron`) with zero external dependency bloat. See [`docs/adr/0001-zero-mathlib-lean4.md`](adr/0001-zero-mathlib-lean4.md).

### 3. How do I know the Lean 4 proofs aren't vacuous, using `sorry`, or proving watered-down statements?
Three independent defenses prevent proof gaming:
1. **Verbatim 5-second axiom check:** Run `cd lean && lake env lean VerifyAxioms.lean` — every single one of the **120** declarations uses only `[propext, Classical.choice, Quot.sound]` (zero `sorryAx`, zero `Lean.ofReduceBool`/`native_decide`, zero custom axioms).
2. **Isolated 6-kernel comparator (`Challenge.lean` vs. `Solution.lean`):** `Challenge.lean` imports *only* `Spec.lean` (definitions only, zero proofs) and includes explicit concrete non-vacuity witnesses (`target_nonvacuity_witnesses`), matched identically against sorry-free `Solution.lean`.
3. **Line-by-line Statement Fidelity Audit:** [`docs/statement-fidelity.md`](statement-fidelity.md) maps every Lean theorem literally to the textbook/paper mathematical statement and states every hypothesis explicitly.

### 4. Does ULTRAMETRICA claim to have discovered new experimental physics?
**No.** All six theorems (Theorems I–VI) are strictly mathematical and computational results on finite $p$-adic groups $\mathbb{Z}_p / p^n\mathbb{Z}_p$ and finite weighted Bruhat-Tits / Tate-curve graphs. See [`LIMITATIONS.md`](../LIMITATIONS.md) for the complete literal-vs-metaphor table.

### 5. Why is the intra-sector spacing ratio $\langle r\rangle$ at $p=5, W_{0,1}$ (`~0.626`) close to GUE (`0.5996`) — didn't you just see GUE chaos?
**No — and our pre-registered Experiment I (`results/stats-eval.json`) decisively falsifies that interpretation.** Inside the *exact same* $p=5, N=625$ Hamiltonian $H_\theta$, sibling sector $W_{0,2}$ locks simultaneously at $\langle r\rangle = 0.2612 \approx 1/4$ (far below even Poisson `0.3863`!), while $W_{0,1}$ sits strictly *above* GUE at $\approx 2/3$ (`p_holm = 0.0004`, Cliff's $\delta = -0.8035$ against 20-seed GUE controls in $W_{0,2}$ and $+0.2686$ against 20-seed GOE controls in $W_{0,1}$, plus $p=2, W_{0,1} \approx 0.0015$, Cliff's $\delta = -0.9980$). Both values come from the exact formally proved **modular picket-fence law** $r_0(p, m) = \min(2m, p-2m)/\max(2m, p-2m)$ (Proposition 4.2).

### 6. Why isn't this MIT or Apache-2.0 licensed?
The author retains commercial rights under `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` ([`LICENSE`](../LICENSE)), while granting broad royalty-free permission for personal, educational, academic, and independent non-commercial research, study, verification, and modification. The trade-off with OSI-requiring venues (e.g., JOSS or Mathlib upstreaming) is recorded explicitly in [`docs/adr/0005-cosmogonic-noncommercial-license.md`](adr/0005-cosmogonic-noncommercial-license.md).

### 7. Why does `README.md` say "Independent Researcher" instead of "0thernes LLC"?
Because no LLC legal entity has been formally registered, we corrected all authorship metadata in `v1.4.0` to match the author's live ORCID record (`Independent Researcher, Spokane, WA, USA`, ORCID `0009-0006-8168-9648`), keeping `0thernes` strictly as the project/publisher handle. See [`ERRATA.md`](../ERRATA.md).

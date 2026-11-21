# Legal Notice, Licensing, Authorship & Verification Boundaries

## Ownership & License

**ULTRAMETRICA** is owned by **0thernes LLC** (`Copyright (c) 2026 0thernes (0thernes LLC) <0_0@0thernes.art>`).

This repository and every file inside it (source code, shaders, DSP processors, Lean 4 formal proofs, white paper, summary paper, master report, claim ledger, benchmark artifacts, and documentation) are governed by the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** in [LICENSE](LICENSE).

- **Non-commercial research, study, verification, reproduction, and modification** are broadly permitted with attribution intact.
- **All commercial rights are strictly reserved by 0thernes LLC.** Any commercial use, paid hosting, ad-supported deployment, or incorporation into a for-profit product requires prior written permission from `0_0@0thernes.art`.
- This is a proprietary, source-available, non-commercial license; it is not an OSI-approved open-source license.
- **Patent & Trademark Reservation**: One or more inventions or computational architectures embodied in this repository may be the subject of pending or future patent applications. No patent or trademark license is granted beyond what is strictly necessary for permitted non-commercial uses under Section 1 of [LICENSE](LICENSE).

## Authorship, Affiliation & AI Tool Disclosure

This repository and its accompanying papers credit **Alexander Stephen Donahue** (`Alexander S. Donahue`), affiliated with **0thernes LLC**, Spokane, WA, USA (`0_0@0thernes.art`, ORCID: [0009-0006-8168-9648](https://orcid.org/0009-0006-8168-9648)).

**Funding & Independence**:
> This research was self-funded by the author. The author is the sole operator of 0thernes LLC, with which this project is affiliated. No legal nonprofit, charitable, tax-exempt, university, or accredited-laboratory status is asserted here.

**AI Tool Disclosure**:
In accordance with transparent scientific authorship standards, this work explicitly discloses substantive AI engineering and research assistance (Google DeepMind / Antigravity agent under the author's direction) in mathematical derivation, software implementation, numerical discovery experiments, Lean 4 formalization, verification testing, and technical writing. AI systems are disclosed as tools and are **not** listed as authors. Automated tests and machine-checked Lean 4 builds verify specific formal and numerical claims within their stated scope; they do not substitute for independent peer review or human editorial accountability for external publication venues.

## Attribution & Scientific Scope Boundaries

1. **Established Literature**: Foundational $p$-adic quantum mechanics, the Vladimirov operator $D_p^\alpha$, Kozyrev wavelets, $p$-adic AdS/CFT on the Bruhat-Tits tree, dynamic edge-length gravity, Tate-curve BTZ quotients, Ollivier-Ricci curvature on regular trees, and Yoshida symplectic integrators are credited to their original authors in [paper/WHITE_PAPER.md](paper/WHITE_PAPER.md) (Section 13) and [paper/refs.bib](paper/refs.bib). ULTRAMETRICA does **not** claim prior discovery of any established result in that literature.
2. **Original Contributions & Exact Boundaries**: The novel analytical theorems, numerical findings, and exact algorithmic constructions introduced in this repository — specifically the **Adelic Parity-Doubling Dichotomy, Recursive Valuation-Residue Decomposition & Modular Picket-Fence Locking (Theorem I)**, the **First-Principles Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law & $L_c = 5$ Trichotomy (Theorem II)**, the **Arbitrary $K$-Ball Kozyrev Compacton-Soliton Invariance & Self-Trapping Scaling (Theorem III)**, and the **Unconditionally Non-Singular Rank-1 Edge-Laplacian Kerr-BTZ Solver & Flux Parity Laws (Theorem IV)** — are strictly mathematical and computational results. **No claim of experimental discovery of new physical laws of nature is made.**
3. **Formal Proof Boundary**: The Lean 4 formalization in [lean/](lean/) (compiled under `leanprover/lean4:v4.35.0` with zero Mathlib, zero `native_decide`, zero `sorryAx`, and zero custom axioms, audited in [results/lean4-audit.txt](results/lean4-audit.txt)) formally verifies the **71 exported declarations** (`1,706` lines) mapped 1-to-1 in [docs/CLAIMS.md](docs/CLAIMS.md). Independent exact-rational checks (`scripts/verify_exact.py`), IEEE-754 numerical tests (`test/verify.mjs`), planted negative mutants (`test/mutants.mjs`), and real-time GPU rendering lie outside the Lean 4 kernel boundary and are clearly separated in [docs/CLAIMS.md](docs/CLAIMS.md) and [VERIFICATION.md](VERIFICATION.md).

## Publication Status

The manuscripts in [dist/Donahue_2026_Ultrametrica.pdf](dist/Donahue_2026_Ultrametrica.pdf), [paper/WHITE_PAPER.md](paper/WHITE_PAPER.md), [SUMMARY.md](SUMMARY.md), and [docs/MASTER_REPORT.md](docs/MASTER_REPORT.md) are **research preprints and technical engineering reports**, not peer-reviewed journal articles. Consult [CHANGELOG.md](CHANGELOG.md), [CHECKSUMS.sha256](CHECKSUMS.sha256), and [VERSION](VERSION) for release history and cryptographic provenance.

# Legal Notice, Licensing, Authorship & Verification Boundaries

## Ownership & License

**ULTRAMETRICA** (`v1.5.0`) is authored and owned by **Alexander Stephen Donahue** (`Copyright (c) 2026 Alexander Stephen Donahue (0thernes) <0_0@0thernes.art>`). `0thernes` is the author's independent project and research handle (`https://0thernes.art`, `https://github.com/0thernes`); no LLC, nonprofit, university, or corporate legal entity is asserted here.

This repository and every file inside it (source code, shaders, DSP processors, Lean 4 formal proofs, white paper, summary paper, master report, claim ledger, benchmark artifacts, and documentation) are governed by the **COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY** in [`LICENSE`](LICENSE).

- **Non-commercial research, study, verification, reproduction, and modification** are broadly permitted with attribution intact.
- **All commercial rights are strictly reserved by Alexander Stephen Donahue (0thernes).** Any commercial use, paid hosting, ad-supported deployment, or incorporation into a for-profit product requires prior written permission from `0_0@0thernes.art`.
- **OSI Trade-Off (`dilemma`):** This is a proprietary, source-available, non-commercial license; it is **not** an OSI-approved open-source license. The trade-off with OSI-requiring venues (e.g., JOSS or Mathlib4 upstreaming) is recorded explicitly in [`docs/adr/0005-cosmogonic-noncommercial-license.md`](docs/adr/0005-cosmogonic-noncommercial-license.md).
- **Patent & Trademark Reservation:** One or more inventions or computational architectures embodied in this repository may be the subject of pending or future patent applications. No patent or trademark license is granted beyond what is strictly necessary for permitted non-commercial uses under Section 1 of [`LICENSE`](LICENSE).

## Authorship, Affiliation & AI Tool Disclosure

This repository and its accompanying papers credit **Alexander Stephen Donahue** (`Alexander S. Donahue`), **Independent Researcher, Spokane, WA, USA** (`0_0@0thernes.art`, ORCID: [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).

**Funding & Independence:**
> This research was self-funded by the author (Independent Researcher, Spokane, WA, USA, publishing under the `0thernes` handle). No corporate, LLC, nonprofit, charitable, tax-exempt, university, or accredited-laboratory affiliation is asserted here.

**AI Tool Disclosure:**
In accordance with transparent scientific authorship standards, this work explicitly discloses substantive AI engineering and research assistance (Google DeepMind / Antigravity agent under the author's direction) in mathematical derivation, software implementation, numerical discovery experiments, Lean 4 formalization, verification testing, and technical writing. AI systems are disclosed as tools and are **not** listed as authors. Automated tests and machine-checked Lean 4 builds verify specific formal and numerical claims within their stated scope; they do not substitute for independent peer review or human editorial accountability for external publication venues.

## Attribution & Scientific Scope Boundaries

1. **Established Literature:** Foundational $p$-adic quantum mechanics, the Vladimirov operator $D_p^\alpha$, Kozyrev wavelets, $p$-adic AdS/CFT on the Bruhat-Tits tree, dynamic edge-length gravity, Tate-curve BTZ quotients, Ollivier-Ricci curvature on regular trees, holographic Ryu-Takayanagi strong subadditivity (Headrick & Takayanagi 2007), and Yoshida symplectic integrators are credited to their original authors in [`paper/main.tex`](paper/main.tex) and [`paper/refs.bib`](paper/refs.bib). ULTRAMETRICA does **not** claim prior discovery of any established result in that literature.
2. **Original Contributions & Exact Boundaries:** The analytical theorems, formalizations, pre-registered statistical falsifications, and exact algorithmic constructions in this repository — **Theorems I–VI** (including **Theorem V-Global** and **Theorem VI** formalized in `v1.4.0`) — are strictly mathematical and computational results. **No claim of experimental discovery of new physical laws of nature or full solutions to open problems in `unsolved-problems-mega-atlas` (`0/1,900` full solutions) is made.** See [`LIMITATIONS.md`](LIMITATIONS.md) and [`docs/MEGA_ATLAS_CROSSCHECK.md`](docs/MEGA_ATLAS_CROSSCHECK.md).
3. **Formal Proof Boundary:** The pure Lean 4 (`v4.35.0`, Palomar `module`) formalization in [`lean/`](lean/) (zero Mathlib, zero `native_decide`, zero `sorryAx`, zero custom axioms, `autoImplicit = false`) formally verifies **149 exported declarations** (`139` core theorems across 5 modules in `UltrametricaProofs/` + `10` isolated specification targets in `Challenge.lean` / `Solution.lean`) audited across independent external kernels (`leanchecker`, `lake check --paranoid`, and 6-kernel `lake comparator --paranoid` with `lean4lean`, `con-leche`, `con-ron`, `nanoda_bin` inside Linux `bubblewrap` CI), archived in [`results/lean4-audit.txt`](results/lean4-audit.txt) and mapped 1-to-1 in [`CLAIMS.md`](CLAIMS.md) and [`docs/statement-fidelity.md`](docs/statement-fidelity.md).

## Publication Status

The manuscripts in [`dist/Donahue_2026_Ultrametrica.pdf`](dist/Donahue_2026_Ultrametrica.pdf), [`paper/WHITE_PAPER.md`](paper/WHITE_PAPER.md), [`SUMMARY.md`](SUMMARY.md), and [`docs/MASTER_REPORT.md`](docs/MASTER_REPORT.md) are **research preprints and technical engineering reports**, not peer-reviewed journal articles. Consult [`CHANGELOG.md`](CHANGELOG.md), [`ERRATA.md`](ERRATA.md), [`CHECKSUMS.sha256`](CHECKSUMS.sha256), and [`VERSION`](VERSION) for release history and cryptographic provenance.

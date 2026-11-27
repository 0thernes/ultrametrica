# Dated Literature & Prior-Art Search Log (`docs/LITERATURE_SEARCH.md`)

> Independent AI Research Playbook (`v1.3`) Gold Standard Item #15 & Pass 4 (Anti-Rediscovery Protocol).
> Before asserting novelty or originality for any theorem in **ULTRAMETRICA**, we explicitly search prior literature across arXiv, Crossref/DOI registries, zbMATH/MathSciNet topics, and OEIS-adjacent constructions, crediting established results and scoping our original contributions strictly as *"to our knowledge, not previously formalized in Lean 4 or proved in this exact form."*

---

## 1. Search Audit Log

| Date (PT) | Query / Domain | Databases Checked | Key Prior Art Found & Credited | Novelty Boundary Verdict |
|---|---|---|---|---|
| 2026-11-18 – 2026-11-25 | `$p$-adic AdS/CFT`, `Bruhat-Tits tree`, `Tate curve BTZ`, `edge length dynamics` | arXiv (`hep-th`, `math-ph`), Crossref | Gubser et al. (CMP 2017, `arXiv:1605.01061`), Heydeman–Marcolli–Saberi–Stoica (ATMP 2018, `arXiv:1605.07639`; ATMP 2021, `arXiv:1812.04057`), Gubser–Heydeman–Jepsen–Marcolli et al. (JHEP 2017, `arXiv:1611.09770`). | Bulk Klein–Gordon equation, BF bound, Tate-curve BTZ topology, and dynamic edge-length equations are **credited** to Gubser/Heydeman/Marcolli. Our additions are: (a) exact $O(V)$ complex Rank-1 Sherman–Morrison Kerr-BTZ solver (`Theorem IV`), (b) unified BTZ horizon Ollivier–Ricci law (`Theorem II`), and (c) multi-edge curved AdS Gauss–Bonnet conservation (`Theorems V & V-Global`). |
| 2026-11-21 – 2026-11-25 | `Ollivier-Ricci curvature`, `unicyclic graphs`, `regular trees`, `weighted trees`, `Lin-Lu-Yau` | arXiv (`math.CO`, `math.MG`), Crossref, Google Scholar | Ollivier (JFA 2009), Lin–Lu–Yau (Tohoku Math. J. 2011), Cushing–Liu–Münch / Jost–Liu graph Ricci literature on cycles and trees. | Uniform $(p+1)$-regular tree curvature $\kappa_{\mathrm{AdS}}(p) = -2(p-1)/(p+1)$ is classical (Ollivier 2009 / Lin–Lu–Yau 2011) and credited. Closed-form non-lazy Tate-curve BTZ horizon law $\kappa_{\mathrm{BTZ}}(p,L) = -(2p - \max(0, 6-L))/(p+2)$ with the $L_c = 5$ trichotomy (`Theorem II`) and exact non-perturbative multi-edge inhomogeneous curved bridge Gauss–Bonnet conservation (`Theorems V & V-Global`) are, to our knowledge, first formalized from first-principles Kantorovich primal–dual transport in Lean 4 here. |
| 2026-11-18 – 2026-11-25 | `Kozyrev wavelets`, `nonlinear p-adic Schrödinger`, `Vladimirov operator` | arXiv (`math-ph`), Crossref | Vladimirov–Volovich–Zelenov (1994), Kozyrev (Izv. Math. 2002, `math-ph/0012019`), Dragovich et al. (2017, `arXiv:1705.04758`). | Linear Kozyrev orthonormal wavelet eigenbasis is **credited** to Kozyrev (2002). Extension to arbitrary finite $K$-ball disjoint compacton-soliton invariance under arbitrary local nonlinearities (`Theorem III`) is a clean consequence formalized in Lean 4; overlapping multi-scale resonant tunneling & self-trapping (`Exp C & F`) are reported strictly as empirical finite-cutoff benchmarks. |
| 2026-11-21 – 2026-11-25 | `Monna map`, `base-p digit reversal`, `adelic Hamiltonian`, `level spacing ratio` | arXiv (`math-ph`, `cond-mat.stat-mech`), Crossref | Monna (1970), Freund–Witten (PLB 1987), Oganesyan–Huse (PRB 2007), Atas et al. (PRL 2013), Holm (1979). | Monna map and level-spacing benchmarks (GOE `0.5307`, GUE `0.5996`) are **credited**. Valuation-residue block decomposition $W_{s,m}$, prime-parity dichotomy ($p = 2$ vs. odd $p \ge 3$), modular picket-fence locking $r_0(p,m) = \min(2m, p-2m)/\max(2m, p-2m)$ (`Theorem I` & `Proposition 4.2`), and pre-registered 20-seed falsification of GOE/GUE thermalization (`Exp I`) are original scoped results. |
| 2026-11-25 | `Holographic Ryu-Takayanagi strong subadditivity`, `graph min-cut submodularity` | arXiv (`hep-th`), Crossref | Ryu–Takayanagi (PRL 2006), Headrick–Takayanagi (PRD 2007, `arXiv:0704.3719`), Pastawski–Yoshida–Harlow–Preskill (JHEP 2015, `arXiv:1503.06237`). | Holographic SSA is a famous established theorem (Headrick–Takayanagi 2007) and cut-function submodularity is classical combinatorial optimization; **Theorem VI** is explicitly presented as a **zero-Mathlib Lean 4 machine-verified formalization** of the discrete graph-theoretic theorem, NOT a claim of discovering SSA. |
| 2026-11-25 | `0thernes/unsolved-problems-mega-atlas` (`1,900` open problems) | Direct repository scan (`f838db1d7d`) | All `1,900` entries scanned (`docs/MEGA_ATLAS_CROSSCHECK.md`). | **`0 / 1,900` full solutions claimed.** Scoped discrete sub-results adjacent to `SUB-032` ($p$-adic AdS/CFT). |

---

## 2. Live Crossref DOI & Retraction Audit Summary

Verified live via `python scripts/check_citations.py --live` (using balanced-brace BibTeX parsing) against `https://api.crossref.org/works/<doi>` on `2026-11-26`:

- **BibTeX ↔ LaTeX 1-to-1 coverage:** `21 / 21` entries cited in `paper/main.tex` (zero uncited orphans, zero missing keys).
- **Crossref DOI resolution:** `18 / 18` DOIs resolved HTTP `200`, `18 / 18` publication years matched, **`0 / 18` retractions** flagged in Crossref `update-to` / `updated-by` metadata.
- **Public URL availability:** `5 / 5` live endpoints verified HTTP `200` (GitHub repository, ORCID `0009-0006-8168-9648`, Live Observatory, Interactive Proof Blueprint `blueprint.html`, and Master Research Archive).
- **Non-DOI references:** `2` classic monographs with verified ISBNs (`Vladimirov1994`, `Monna1970`) and `1` JSTOR landmark paper (`Holm1979`, `https://www.jstor.org/stable/4615733`).
- **Correction caught by live Crossref check (`F36`):** Corrected `Kozyrev2002` title in `paper/refs.bib` from `"Wavelet analysis as a $p$-adic spectral analysis"` to the exact published Izvestiya Mathematics English title `"Wavelet theory as $p$-adic spectral analysis"`.

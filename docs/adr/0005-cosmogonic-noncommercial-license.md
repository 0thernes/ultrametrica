# ADR-0005: Retention of COSMOGONIC Non-Commercial License & Open OSI Trade-Off (`dilemma`)

- **Date:** 2026-11-25
- **Status:** Accepted (explicit `dilemma` recorded per Build Standard R5/R8 & Playbook Finding 4)

## Context

The repository author publishes under the `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` ([`LICENSE`](../../LICENSE)), which grants broad worldwide royalty-free permission for all non-commercial research, study, verification, modification, and sharing while reserving commercial rights. Meanwhile, the Independent AI Research Playbook (`v1.3`, Finding 4) notes that OSI-approved licenses (e.g., Apache-2.0 / MIT for code and Lean proofs, CC-BY-4.0 for papers) are required for certain downstream venues such as JOSS, direct Mathlib4 upstreaming, or institutional software reuse.

## Decision

Retain the author's `COSMOGONIC LICENSE — NON-COMMERCIAL RESEARCH & PLAY` across ULTRAMETRICA (Hard Rule R8), updating only the copyright holder entity string from the unformed `"0thernes LLC"` to `"Alexander Stephen Donahue (0thernes)"` so legal authorship matches ORCID `0009-0006-8168-9648`. Document the trade-off explicitly in [`LEGAL.md`](../../LEGAL.md), [`LIMITATIONS.md`](../../LIMITATIONS.md), [`formalization.yaml`](../../formalization.yaml), and [`docs/reviews/2026-11-25-hardening-cycles.md`](../reviews/2026-11-25-hardening-cycles.md).

## Consequences

- **Positive:** Preserves the author's explicit IP and non-commercial stewardship without restricting independent academic verification, replication, or teaching.
- **Trade-off (`dilemma`):** Non-OSI status prevents direct upstream merging into Apache-2.0 Mathlib4 or submission to OSI-only journals (e.g. JOSS) unless the author elects to dual-license specific modules in a future release.

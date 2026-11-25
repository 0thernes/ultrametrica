# ULTRAMETRICA (`v1.4.0`) — Claim Ledger (Mirror of Root `CLAIMS.md`)

> Canonical ledger lives at [`../CLAIMS.md`](../CLAIMS.md) (Build Standard `B04`/`B42`). Author: Alexander Stephen Donahue (`Independent Researcher, Spokane, WA, USA`, ORCID [`0009-0006-8168-9648`](https://orcid.org/0009-0006-8168-9648)).

See [`../CLAIMS.md`](../CLAIMS.md) for the complete 1-to-1 table mapping every claim (`C-THM-1A` through `C-PRIOR`) to its verification tier (`kernel-checked`, `exact-rational`, `pre-registered statistical`, `numerical`, `prior work`), reproducible command, Lean 4 / test symbol, verified `2026-11-25` measurement, and explicit **What Would Prove Us Wrong** falsification condition.

Quick summary of `v1.4.0` verified metrics:
- **Lean 4 (`v4.35.0`, zero Mathlib, `autoImplicit = false`):** `120` audited declarations in `UltrametricaProofs/` + `8/8` isolated comparator targets in `Challenge.lean` / `Solution.lean` (`0` `sorry`, `0` `native_decide`, strictly `[propext, Classical.choice, Quot.sound]`), verified across `leanchecker`, `leanchecker-paranoid`, `con-leche`, `con-ron`, `nanoda_bin`, and 6-kernel `bubblewrap` `lake comparator --paranoid` in CI.
- **Exact-Rational Oracle (`scripts/verify_exact.py`):** `7,033` Adelic pairs, `18` picket-fence sectors, `45` BTZ `Fraction` horizons, exact $\mathbb{Q}(i)$ Kerr-BTZ solve, `60` single-edge + `9` simultaneous multi-edge curved AdS `Fraction` trees (Theorem V-Global), and `4,352` exhaustive brute-force RT SSA partitions (Theorem VI) — zero rounding error.
- **Pre-Registered Experiment I (`docs/preregistration.md`, commit `c171b1b`):** `4/4` hypotheses confirmed against 20-seed GUE/GOE controls at `p_holm = 0.0004` (`20/20` seeds each).
- **Executable Tests:** `26/26` Node tests (`10` theorems, `8/8` mutants killed, `3,200+` property/metamorphic/negative cases, HTTP contract + EIO failure injection, golden snapshot) + `1,000+` Python differential oracle checks (`max_err = 1.23e-12`).
- **Mega-Atlas Cross-Check (`docs/MEGA_ATLAS_CROSSCHECK.md`):** Honestly verified `0 / 1,900` full solutions; exact discrete sub-results on `SUB-032` and negative-result falsification on `ANL-065`/`QM-016`.

# Errata & Correction Ledger

This file records every post-publication correction, mathematical refinement, metadata fix, and retraction/withdrawal notice for **ULTRAMETRICA**, in accordance with transparent independent scientific publishing standards.

## Correction & Withdrawal Policy

1. **Silent Edits Prohibited:** Once a version tag (`vX.Y.Z`) and its frozen PDF (`dist/Donahue_2026_Ultrametrica.pdf`) and SHA-256 manifest (`CHECKSUMS.sha256`) are published, any discovered error in a theorem statement, proof, numerical table, or attribution is logged here with its exact commit SHA, affected version(s), severity, and corrective version.
2. **Material Error / Withdrawal Trigger:** If any core theorem (Theorems I–VI) is found to be mathematically false or vacuously formalized, we will immediately publish a prominent notice at the top of `README.md`, `ERRATA.md`, and `CLAIMS.md`, issue a corrective release, and update the master archive (`0thernes/0thernes-research-archive`, entry `0TH-BUILD-003`).
3. **Reporting Errors:** Open a Falsification Report via [`.github/ISSUE_TEMPLATE/falsification.yml`](.github/ISSUE_TEMPLATE/falsification.yml) or email `0_0@0thernes.art`.

---

## Recorded Corrections

| Date | Affected Versions | Class | Summary & Resolution | Fixed In |
|---|---|---|---|---|
| 2026-11-25 | `v1.0.0`–`v1.3.0` | `problem` | **Affiliation metadata correction:** Prior releases listed `"0thernes LLC"` as author affiliation. Because no LLC legal entity has been formally registered, affiliation has been corrected across all manuscripts, `CITATION.cff`, `LICENSE`, `LEGAL.md`, and UI modals to `"Independent Researcher, Spokane, WA, USA"` (matching ORCID `0009-0006-8168-9648`), retaining `0thernes` strictly as the project/publisher handle. | `v1.4.0` |
| 2026-11-25 | `v1.0.0`–`v1.3.0` | `bug` | **Engine input guard (`F02`):** `BruhatTitsBulk` previously coerced negative `horizonDepth` via bitwise `| 0` instead of throwing `RangeError`. Hardened all public boundaries in `src/engine/*.js`. | `v1.4.0` |
| 2026-11-25 | `v1.3.0` | `bug` | **Server error-path header bug (`F14`):** `server.mjs` wrote HTTP `200` headers before `await fsImpl.readFile()`, causing `ERR_HTTP_HEADERS_SENT` if disk I/O failed mid-request (exposed by `test/server.mjs` B21 EIO failure injection). Fixed to read file before `writeHead(200)` and guard `res.headersSent`. | `v1.4.0` |
| 2026-11-25 | `v1.1.0`–`v1.3.0` | `hole` | **Lean static audit regex (`F09`):** `scripts/verify_exact.py` previously used a non-nested regex for Lean block comments `/- ... -/`, which could misparse nested comments. Replaced with a proper nested-comment/string-literal lexer scanning `UltrametricaProofs.lean`, `UltrametricaProofs/*.lean`, and `Solution.lean`. | `v1.4.0` |
| 2026-11-21 | `v1.0.0`–`v1.2.0` | `bug` | **16-issue adversarial audit fixes (`BUG-1`..`BUG-16`):** Fixed `ultrametric_tunneling` `w3` index at `p=7, n=3`, `wormhole_surgery` BTZ no-op, Gauss-Seidel sibling asymmetry in `stepGravity`, AudioWorklet zipper smoothing, UI clipping, and `UltrametricaSimulation` constructor topology reset. Documented in [`docs/AUDIT_AND_CONTRAST_ANALYSIS.md`](docs/AUDIT_AND_CONTRAST_ANALYSIS.md). | `v1.3.0` |

*No mathematical errors or falsifications have been found in Theorems I–VI (`120` kernel-checked Lean 4 declarations).*

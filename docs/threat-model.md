# Security Threat Model (`docs/threat-model.md`)

> Build Standard `B36`. STRIDE threat analysis covering ULTRAMETRICA's local HTTP server (`server.mjs`), browser observatory (`src/web/`), mathematical engine (`src/engine/`), and verification toolchain (`lean/`, `scripts/`).

## 1. Trust Boundaries & Attack Surface

| Surface | Exposure | Trust Level | Key Assets |
|---|---|---|---|
| **Local HTTP Server (`server.mjs`)** | Loopback (`127.0.0.1:4173` default) or user-configured LAN `HOST` | Untrusted HTTP request lines / paths / headers | Local filesystem outside `src/`, process availability |
| **Browser Observatory (`src/web/`)** | Public static site (`https://0thernes.github.io/ultrametrica/`) | Untrusted URL query string (`?exp=...&p=...`) | Browser origin integrity, XSS prevention, GPU/Audio stability |
| **Mathematical Engine (`src/engine/`)** | Imported ES modules | Untrusted caller arguments (`p`, `n`, `horizonDepth`, `alpha`) | Memory safety (no unbounded allocation / NaN poisoning) |
| **Lean 4 Proofs (`lean/`)** | Public repo / external evaluator | Untrusted proof files (`Solution.lean`) | Logical soundness against `Challenge.lean` specification |

---

## 2. STRIDE Threat Matrix & Mitigations

| Category | Specific Threat | Severity | Concrete Mitigation | Automated Verification |
|---|---|---|---|---|
| **Spoofing** | Forged theorem provenance or tampered release PDF/benchmarks | High | Cryptographic `CHECKSUMS.sha256` & `data/MANIFEST.sha256`, `actions/attest-build-provenance@v2` SLSA release attestation, exact ORCID `0009-0006-8168-9648`, verbatim README `#print axioms` check | `scripts/verify_exact.py --check-checksums`, `scripts/check_readme_axioms.py`, `.github/workflows/release.yml` |
| **Tampering** | Path traversal (`../../etc/passwd`, `%2e%2e%2f`, backslash `..\`, null bytes `%00`) on `server.mjs` | High | Strict `decodeURIComponent` guard, reject `\0` and `\` (`400`), canonical `path.resolve` + `path.relative` prefix check (`403`), reject non-files/directories (`403`) | [`test/server.mjs`](../test/server.mjs) (B09/B36 suite) |
| **Tampering** | DOM-based XSS via crafted URL permalink parameters or injected UI markup | High | Strict `Content-Security-Policy` (`default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'`), zero `innerHTML` usage in `src/web/app.js` (uses `textContent` / safe DOM nodes), strict numeric clamping & allowlist checks on URL query params | [`test/server.mjs`](../test/server.mjs) (`SECURITY_HEADERS`), `src/web/app.js` audit (`F13`) |
| **Tampering** | Proof-checking bypass in Lean 4 (hidden `sorry`, `native_decide`, `@[extern`, custom `axiom`, definition mismatch) | Critical | Isolated `Spec.lean` + `Challenge.lean` vs. `Solution.lean` checked via **6 independent kernels** (`lake comparator --paranoid` inside Linux `bubblewrap` sandbox) + nested-comment-safe static scanner (`F09`) + `VerifyAxioms.lean` allowlist | `.github/workflows/ci.yml` (`lean4-six-kernel-audit`), `scripts/verify_exact.py` |
| **Repudiation** | Silent modification of preregistered statistical hypotheses or post-hoc editing of published results | Medium | Git-sealed [`docs/preregistration.md`](preregistration.md) (`c171b1b`) committed *before* running `scripts/stats_eval.mjs`, append-only [`docs/run-log.md`](run-log.md), and [`ERRATA.md`](../ERRATA.md) | `results/stats-eval.json` (`preregCommit`), git commit history |
| **Information Disclosure** | Accidental leakage of host stack traces or filesystem structure via HTTP responses | Medium | `server.mjs` returns minimal generic plain-text bodies (`Bad Request`, `Forbidden`, `Not Found`, `Internal Server Error`) on all error codes; full stack traces go strictly to structured server-side `stderr` logs | [`test/server.mjs`](../test/server.mjs) (B21 EIO test) |
| **Information Disclosure** | Accidental commit of API keys or tokens | Medium | Zero external API keys required; report-only `gitleaks` secret scan runs on every push in CI | `.github/workflows/ci.yml` (`report-only-static`) |
| **Denial of Service** | Memory exhaustion via giant `PadicSpace(p, n)` ($p^n \gg 10^6$), negative `horizonDepth`, or non-finite `dt`/`alpha` | Medium | `PadicSpace` caps $N = p^n \le 65{,}536$; all public engine constructors/methods validate finiteness, positivity, and integer bounds loudly (`RangeError`/`TypeError`) | [`test/properties.mjs`](../test/properties.mjs) (`B06`/`B20` negative suite) |
| **Denial of Service** | Unhandled `ERR_HTTP_HEADERS_SENT` crash or hung socket on disk I/O error in `server.mjs` | Medium | `server.mjs` reads file bytes *before* calling `res.writeHead(200, ...)`, guards `res.headersSent` in `catch`, and survives injected `EIO` faults cleanly | [`test/server.mjs`](../test/server.mjs) (B21 EIO failure injection) |
| **Elevation of Privilege** | Unsupported HTTP verbs (`POST`/`PUT`/`DELETE`) or browser plugin/frame embedding | Low | Strict `GET`/`HEAD` allowlist (`405` + `Allow: GET, HEAD`), `X-Content-Type-Options: nosniff`, `Cross-Origin-Resource-Policy: same-origin`, `frame-ancestors 'none'` | [`test/server.mjs`](../test/server.mjs) |

## 3. Out-of-Scope Threats

ULTRAMETRICA is a static client-side scientific observatory and local research server with no user accounts, no authentication database, and no PII collection (`personal_data: false`). It is not designed to be exposed directly to the public internet without TLS termination (public deployment uses GitHub Pages HTTPS).

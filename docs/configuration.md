# Configuration Reference (`docs/configuration.md`)

> Build Standard `A33`. Every environment variable, URL query parameter, and build-time option in ULTRAMETRICA (`v1.7.0`) has explicit defaults, strict bounds validation, and zero hidden magic values.

## 1. Local Observatory Server (`server.mjs`)

See also [`.env.example`](../.env.example).

| Variable | Default | Valid Values | Failure Behavior |
|---|---|---|---|
| `HOST` | `127.0.0.1` | Any valid local bind IP / hostname (`127.0.0.1`, `::1`, `0.0.0.0`) | Node `net` bind error at startup |
| `PORT` | `4173` | Integer in `[0, 65535]` (`0` selects an ephemeral OS port) | **Fail-fast** `RangeError` via `parsePort()` before binding |
| `LOG_FORMAT` | *(unset — human startup banner)* | `json` (NDJSON structured logs to stdout/stderr) | Unset falls back to human-readable banner; errors always emit JSON to `stderr` |

### Health Probe Endpoint (`A34`)

`GET /healthz` returns HTTP `200` with `Cache-Control: no-store` (reading `version` directly from root `VERSION` — single version source `A08`):

```json
{
  "status": "ok",
  "service": "ultrametrica",
  "version": "1.7.0",
  "uptime_s": 12.345
}
```

---

## 2. Browser Observatory URL Permalink Parameters (`src/web/app.js`)

The live observatory (`https://0thernes.github.io/ultrametrica/web/` or `http://127.0.0.1:4173/web/`) supports reproducible state permalinks serialized by `buildPermalinkURL()` and hydrated in deterministic topology-preserving order (`p`/`btz` applied before `exp`, fixing `F38`) by `hydrateStateFromURL()`:

| Query Key | Type & Bounds | Default | Description |
|---|---|---|---|
| `exp` | Experiment preset ID in `EXPERIMENTS` | `kozyrev_trap` | Active preset (`kozyrev_trap`, `btz_black_hole`, `ultrametric_tunneling`, `adelic_fracture`, `page_transition`, `wormhole_surgery`) |
| `p` | Prime in `{2, 3, 5, 7}` | `3` | $p$-adic prime (selects default interactive depth $n \in \{8, 5, 4, 3\}$) |
| `btz` | `'0'` or `'1'` | `'0'` | Topology toggle (`0` = pure Bruhat-Tits AdS $T_p$, `1` = Tate-curve BTZ black hole quotient $T_p / p^{h\mathbb{Z}}$; preserved when paired with `exp`) |
| `view` | `'field'`, `'ricci'`, `'rt'`, `'gravity'` | `'field'` | Active 3D WebGL2 colormap shader mode |
| `alpha` | Float in `[0.25, 2.00]` | `1.00` | Vladimirov / Archimedean dispersion exponent $\alpha$ |
| `theta` | Float in `[0, 1]` | `1.00` | Adelic morph parameter $\theta$ ($0 = \mathbb{R}$, $1 = \mathbb{Q}_p$) |
| `g` | Float in `[-180, 200]` | `0.0` | Gross-Pitaevskii nonlinearity strength $g$ |
| `delta` | Float in `[0.5001, 2.40]` | `1.50` | Gubser conformal dimension $\Delta$ (above BF bound $\Delta = 0.5$) |
| `grav` | Float in `[0, 3.50]` | `0.00` | Dynamic edge-length gravitational backreaction coupling |
| `dyn` | `'0'` or `'1'` | `'0'` | Toggle live symmetric Jacobi dynamic edge-length metric evolution |
| `flux` | Float in `[-\pi, \pi]` (BTZ only) | `0.00` | Rotating Kerr-BTZ Aharonov-Bohm horizon flux $\Omega$ (radians) |
| `rt` | Float in `[0.03, 0.97]` | `0.33` | Ryu-Takayanagi boundary entanglement region fraction |

---

## 3. Lean 4 Verification Configuration (`lean/`)

- **`lean/lean-toolchain`:** Pins exact compiler version `leanprover/lean4:v4.35.0`.
- **`lean/lakefile.toml`:** Sets `autoImplicit = false` and `relaxedAutoImplicit = false` globally across `UltrametricaProofs`, `Challenge`, and `Solution` (all Palomar `module` files).
- **`lean/comparator.json`:** Pins all **12** isolated target bindings in `Ultrametrica.ComparatorTarget` and permitted axioms strictly to `["propext", "Quot.sound", "Classical.choice"]`.

## 4. Test & Script Flags

- `node test/golden.mjs --update-golden` — intentionally refreshes `test/golden/baseline-snapshot.json` (never run implicitly by `npm test`).
- `python scripts/verify_exact.py --write-checksums` — regenerates `CHECKSUMS.sha256` and `data/MANIFEST.sha256`.
- `python scripts/verify_exact.py --check-checksums` — strictly enforces 100% SHA-256 digest match (used in CI).
- `python scripts/stamp_manifest.py` / `--verify` — mints or verifies dual DigiCert RFC 3161 `.tsr` and 3-calendar Bitcoin OpenTimestamps `.ots` proofs over `CHECKSUMS.sha256`.
- `python scripts/test_lean_negative.py` (`--with-comparator` on Linux CI) — live negative tamper-rejection test proving injected `sorry` and weakened `Challenge.lean` targets are caught and rejected.
- `python scripts/check_citations.py --live --write-report` — runs live Crossref DOI, title Jaccard, author surname, retraction, and public URL checks, writing `results/citation-audit.json`.

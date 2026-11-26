# Configuration Reference (`docs/configuration.md`)

> Build Standard `A33`. Every environment variable, URL query parameter, and build-time option in ULTRAMETRICA has explicit defaults, strict bounds validation, and zero hidden magic values.

## 1. Local Observatory Server (`server.mjs`)

See also [`.env.example`](../.env.example).

| Variable | Default | Valid Values | Failure Behavior |
|---|---|---|---|
| `HOST` | `127.0.0.1` | Any valid local bind IP / hostname (`127.0.0.1`, `::1`, `0.0.0.0`) | Node `net` bind error at startup |
| `PORT` | `4173` | Integer in `[0, 65535]` (`0` selects an ephemeral OS port) | **Fail-fast** `RangeError` via `parsePort()` before binding |
| `LOG_FORMAT` | *(unset — human startup banner)* | `json` (NDJSON structured logs to stdout/stderr) | Unset falls back to human-readable banner; errors always emit JSON to `stderr` |

### Health Probe Endpoint (`A34`)

`GET /healthz` returns HTTP `200` with `Cache-Control: no-store`:

```json
{
  "status": "ok",
  "service": "ultrametrica",
  "version": "1.5.0",
  "uptime_s": 12.345
}
```

---

## 2. Browser Observatory URL Permalink Parameters (`src/web/app.js`)

The live observatory (`https://0thernes.github.io/ultrametrica/` or `http://127.0.0.1:4173/web/`) supports reproducible state permalinks:

| Query Key | Type & Bounds | Default | Description |
|---|---|---|---|
| `exp` | Experiment preset ID in `EXPERIMENTS` | `kozyrev_trap` | Active simulation preset (`kozyrev_trap`, `btz_black_hole`, `kerr_btz_flux`, `adelic_morph`, `ultrametric_tunneling`, `wormhole_surgery`, `entanglement_wedge`, `bulk_holography`, `quantum_shock`) |
| `p` | Prime in `{2, 3, 5, 7}` | `3` | $p$-adic prime |
| `n` | Integer (`2 <= n`, $p^n \le 65536$, UI range `3..6` depending on $p$) | `5` | $p$-adic precision depth |
| `h` | Integer `0 <= h < n` | `0` | BTZ horizon depth (`0` = pure Bruhat-Tits AdS, `>= 1` = BTZ horizon of length $L = p^h$) |
| `alpha` | Float in `[0.25, 2.00]` | `1.00` | Vladimirov / Archimedean dispersion exponent $\alpha$ |
| `delta` | Float in `[0.5001, 4.00]` | `1.50` | Gubser conformal dimension $\Delta$ (above BF bound $\Delta = 0.5$) |
| `g` | Float in `[0, 500]` | `0` | Gross-Pitaevskii nonlinearity strength $g$ |
| `theta` | Float in `[0, 1]` | `1.0` | Adelic morph parameter $\theta$ ($0 = \mathbb{R}$, $1 = \mathbb{Q}_p$) |
| `omega` | Float in `[-3.14159, 3.14159]` | `0` | Kerr-BTZ Aharonov-Bohm horizon flux $\Omega$ |
| `grav` | Float in `[0, 3]` | `0` | Dynamic edge-length gravitational backreaction coupling |
| `dyn` | `0` or `1` | `0` | Toggle live dynamic edge-length metric evolution |

---

## 3. Lean 4 Verification Configuration (`lean/`)

- **`lean/lean-toolchain`:** Pins exact compiler version `leanprover/lean4:v4.35.0`.
- **`lean/lakefile.toml`:** Sets `autoImplicit = false` and `relaxedAutoImplicit = false` globally across `UltrametricaProofs`, `Challenge`, and `Solution`.
- **`lean/comparator.json`:** Pins the 8 target theorems in `Ultrametrica.ComparatorTarget` and permitted axioms strictly to `["propext", "Quot.sound", "Classical.choice"]`.

## 4. Test & Script Flags

- `node test/golden.mjs --update-golden` — intentionally refreshes `test/golden/baseline-snapshot.json` (never run implicitly by `npm test`).
- `python scripts/verify_exact.py --write-checksums` — regenerates `CHECKSUMS.sha256` and `data/MANIFEST.sha256`.
- `python scripts/verify_exact.py --check-checksums` — strictly enforces 100% SHA-256 digest match (used in CI).

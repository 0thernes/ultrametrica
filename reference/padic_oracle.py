#!/usr/bin/env python3
"""
ULTRAMETRICA — Textbook Reference Implementation Oracle (Build Standard B11 & B12).

Intentionally written with plain, unoptimized, textbook-direct loops in pure Python
so correctness is visually transparent. Used as an independent differential test oracle
against the optimized JavaScript engine (`src/engine/*.js`) over 1,000+ random inputs.
"""

from __future__ import annotations

import cmath
import json
import math
import random
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def ref_monna_rev(p: int, n: int, x: int) -> int:
    """Textbook base-p digit reversal of x in [0, p^n)."""
    r = 0
    v = x
    for _ in range(n):
        r = r * p + (v % p)
        v //= p
    return r


def ref_valuation(p: int, n: int, k: int) -> int:
    """Textbook p-adic valuation v_p(k) capped at n for k=0."""
    if k % (p**n) == 0:
        return n
    v = 0
    m = k % (p**n)
    while m % p == 0:
        m //= p
        v += 1
    return v


def ref_naive_dft(vec: list[complex], inverse: bool = False) -> list[complex]:
    """Textbook O(N^2) unitary Pontryagin DFT."""
    N = len(vec)
    sign = 1.0 if inverse else -1.0
    scale = 1.0 / math.sqrt(N)
    out = []
    for k in range(N):
        acc = 0j
        for x, val in enumerate(vec):
            acc += val * cmath.exp(sign * 2j * math.pi * ((x * k) % N) / N)
        out.append(acc * scale)
    return out


def ref_vladimirov_apply(p: int, n: int, alpha: float, vec: list[complex]) -> list[complex]:
    """Textbook Vladimirov operator D_p^alpha = F^{-1} diag(|xi_k|_p^alpha) F."""
    N = p**n
    freq = ref_naive_dft(vec, inverse=False)
    for k in range(N):
        if k == 0:
            freq[k] = 0j
        else:
            freq[k] *= p ** (alpha * (n - ref_valuation(p, n, k)))
    return ref_naive_dft(freq, inverse=True)


def run_differential_check(cases: int = 1000, seed: int = 20261125) -> None:
    """Run >= 1,000 differential trials comparing Python textbook oracle against JS engine."""
    rng = random.Random(seed)
    # 1. Generate 1,000 random Monna + valuation + distance queries and 40 full DFT/Vladimirov vectors
    queries = []
    for i in range(cases):
        p, n = [(2, 4), (3, 3), (5, 2), (7, 2)][i % 4]
        N = p**n
        a = rng.randrange(N)
        b = rng.randrange(N)
        queries.append((p, n, a, b))

    vec_cases = []
    for p, n, alpha in [(2, 4, 0.9), (3, 3, 1.25), (5, 2, 0.75), (7, 2, 1.5)]:
        N = p**n
        for _ in range(10):
            vec = [complex(rng.uniform(-1, 1), rng.uniform(-1, 1)) for _ in range(N)]
            vec_cases.append((p, n, alpha, vec))

    # Ask Node.js engine to evaluate the identical inputs
    js_driver = r"""
import { PadicSpace } from './src/engine/padic.js';
const payload = JSON.parse(await new Promise((res) => {
  let d = ''; process.stdin.on('data', (c) => d += c); process.stdin.on('end', () => res(d));
}));
const cache = new Map();
const getSpace = (p, n) => {
  const k = `${p}_${n}`;
  if (!cache.has(k)) cache.set(k, new PadicSpace(p, n));
  return cache.get(k);
};
const qOut = payload.queries.map(([p, n, a, b]) => {
  const s = getSpace(p, n);
  return [s.revTable[a], s.diffValuation(a, b), s.distance(a, b)];
});
const vOut = payload.vecCases.map(([p, n, alpha, re, im]) => {
  const s = getSpace(p, n);
  const oRe = new Float64Array(s.N);
  const oIm = new Float64Array(s.N);
  s.applyVladimirov(Float64Array.from(re), Float64Array.from(im), alpha, oRe, oIm);
  return [Array.from(oRe), Array.from(oIm)];
});
process.stdout.write(JSON.stringify({ qOut, vOut }));
"""
    inp = json.dumps({
        "queries": queries,
        "vecCases": [[p, n, alpha, [z.real for z in vec], [z.imag for z in vec]] for p, n, alpha, vec in vec_cases],
    })
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", js_driver],
        input=inp,
        text=True,
        capture_output=True,
        cwd=ROOT,
        check=True,
    )
    js_res = json.loads(proc.stdout)

    # Compare all 1,000 arithmetic/ultrametric queries identically
    for idx, ((p, n, a, b), (js_rev, js_val, js_dist)) in enumerate(zip(queries, js_res["qOut"], strict=True)):
        exp_rev = ref_monna_rev(p, n, a)
        exp_val = ref_valuation(p, n, (a - b) % (p**n))
        exp_dist = 0.0 if a == b else p ** (-exp_val)
        assert js_rev == exp_rev, f"Monna mismatch at trial {idx}: {js_rev} != {exp_rev}"
        assert js_val == exp_val, f"Valuation mismatch at trial {idx}: {js_val} != {exp_val}"
        assert abs(js_dist - exp_dist) < 1e-15, f"Distance mismatch at trial {idx}: {js_dist} != {exp_dist}"

    # Compare all 40 full complex Vladimirov operator outputs against textbook O(N^2) DFT
    max_err = 0.0
    for _idx, ((p, n, alpha, vec), (js_re, js_im)) in enumerate(zip(vec_cases, js_res["vOut"], strict=True)):
        ref_out = ref_vladimirov_apply(p, n, alpha, vec)
        for z_ref, r_js, i_js in zip(ref_out, js_re, js_im, strict=True):
            err = abs(z_ref - complex(r_js, i_js))
            if err > max_err:
                max_err = err
    assert max_err < 1e-9, f"Differential Vladimirov mismatch: max_err={max_err}"
    print(
        f"[PASS] Differential Oracle (B11/B12): {cases} random Monna/ultrametric queries (0 mismatches) "
        f"+ {len(vec_cases)} full Vladimirov O(N^2) DFT cross-checks (max_err={max_err:.2e})."
    )


if __name__ == "__main__":
    run_differential_check()

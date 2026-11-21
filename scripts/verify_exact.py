#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.3.0) — Independent Zero-Dependency Exact-Rational Falsifier,
Metadata Consistency Checker & SHA-256 Manifest Auditor.

Completely decoupled from both the JavaScript simulation engine and Lean 4 proofs.
Uses Python standard library exact arbitrary-precision arithmetic (int & fractions.Fraction)
to independently verify or falsify Theorems I-V, the Experiment E/G modular picket-fence law,
all 101 Lean 4 declarations, cross-document version/ORCID consistency, and CHECKSUMS.sha256.

Usage:
  python scripts/verify_exact.py                  # Run all exact checks + verify CHECKSUMS.sha256 if present
  python scripts/verify_exact.py --write-checksums # Regenerate CHECKSUMS.sha256 after finalizing artifacts
  python scripts/verify_exact.py --check-checksums # Require CHECKSUMS.sha256 to exist and match 100%
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from collections import deque
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CANONICAL_ORCID = "0009-0006-8168-9648"

MANIFEST_FILES = [
    "LICENSE",
    "LEGAL.md",
    "NOTICE",
    "VERSION",
    "package.json",
    "CITATION.cff",
    "README.md",
    "SUMMARY.md",
    "INDEX.md",
    "GLOSSARY.md",
    "VERIFICATION.md",
    "CHANGELOG.md",
    "server.mjs",
    "docs/CLAIMS.md",
    "docs/MASTER_REPORT.md",
    "docs/AUDIT_AND_CONTRAST_ANALYSIS.md",
    "src/engine/padic.js",
    "src/engine/holography.js",
    "src/engine/quantum.js",
    "src/engine/simulation.js",
    "src/web/index.html",
    "src/web/styles.css",
    "src/web/app.js",
    "src/web/renderer3d.js",
    "src/web/panels2d.js",
    "src/web/audio.js",
    "src/web/audio-worklet.js",
    "test/verify.mjs",
    "test/mutants.mjs",
    "scripts/discover.mjs",
    "scripts/verify_exact.py",
    "scripts/generate_figures.py",
    "scripts/package_dist.py",
    "lean/lean-toolchain",
    "lean/lakefile.toml",
    "lean/lake-manifest.json",
    "lean/README.md",
    "lean/UltrametricaProofs.lean",
    "lean/VerifyAxioms.lean",
    "lean/UltrametricaProofs/Basic.lean",
    "lean/UltrametricaProofs/AdelicSymmetry.lean",
    "lean/UltrametricaProofs/HolographyCurvature.lean",
    "lean/UltrametricaProofs/SolitonAndSolver.lean",
    "results/lean4-audit.txt",
    "results/discovery-benchmarks.json",
    "paper/main.tex",
    "paper/refs.bib",
    "paper/WHITE_PAPER.md",
    "paper/figures/fig1_btz_curvature.pdf",
    "paper/figures/fig2_adelic_spectrum.pdf",
    "paper/figures/fig3_soliton_resonance.pdf",
    "paper/figures/fig4_intrablock_and_scaling.pdf",
    "paper/figures/fig5_spectrum_and_gaussbonnet.pdf",
    "dist/Donahue_2026_Ultrametrica.pdf",
    "dist/arxiv_submission.tar.gz",
]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def exact_wasserstein_bipartite(
    mu_u: list[Fraction],
    mu_v: list[Fraction],
    cost: list[list[Fraction]],
) -> Fraction:
    """Exact 1-Wasserstein optimal transport over fractions.Fraction via SPFA augmenting paths."""
    m = len(mu_u)
    k = len(mu_v)
    assert sum(mu_u) == Fraction(1), f"mu_u does not sum to 1: {sum(mu_u)}"
    assert sum(mu_v) == Fraction(1), f"mu_v does not sum to 1: {sum(mu_v)}"

    src = 0
    sink = 1 + m + k
    n_verts = sink + 1
    adj: list[list[list]] = [[] for _ in range(n_verts)]

    def add_edge(u: int, v: int, cap: Fraction, c: Fraction) -> None:
        fwd = [v, len(adj[v]), cap, c]
        bwd = [u, len(adj[u]), Fraction(0), -c]
        adj[u].append(fwd)
        adj[v].append(bwd)

    for i in range(m):
        if mu_u[i] > 0:
            add_edge(src, 1 + i, mu_u[i], Fraction(0))
    for j in range(k):
        if mu_v[j] > 0:
            add_edge(1 + m + j, sink, mu_v[j], Fraction(0))
    for i in range(m):
        for j in range(k):
            add_edge(1 + i, 1 + m + j, Fraction(1), cost[i][j])

    flow = Fraction(0)
    total_cost = Fraction(0)
    one = Fraction(1)

    while flow < one:
        dist: list[Fraction | None] = [None] * n_verts
        prev_v = [-1] * n_verts
        prev_e = [-1] * n_verts
        in_q = [False] * n_verts

        dist[src] = Fraction(0)
        q = deque([src])
        in_q[src] = True

        while q:
            u = q.popleft()
            in_q[u] = False
            du = dist[u]
            assert du is not None
            for ei, e in enumerate(adj[u]):
                to, _rev, cap, c = e
                if cap > 0:
                    nd = du + c
                    if dist[to] is None or nd < dist[to]:
                        dist[to] = nd
                        prev_v[to] = u
                        prev_e[to] = ei
                        if not in_q[to]:
                            in_q[to] = True
                            q.append(to)

        assert dist[sink] is not None, "Failed to find augmenting path in exact transport"
        push = one - flow
        v = sink
        while v != src:
            u = prev_v[v]
            e = adj[u][prev_e[v]]
            if e[2] < push:
                push = e[2]
            v = u

        v = sink
        while v != src:
            u = prev_v[v]
            e = adj[u][prev_e[v]]
            e[2] -= push
            adj[v][e[1]][2] += push
            v = u

        flow += push
        total_cost += push * dist[sink]

    assert flow == one
    return total_cost


def verify_theorem_1_adelic_symmetry() -> None:
    """
    Exact integer verification of Theorem I + Experiment E modular picket-fence law
    across primes p in {2,3,5,7,11,13,17,19}.
    """
    primes = [2, 3, 5, 7, 11, 13, 17, 19]
    checked_pairs = 0
    for p in primes:
        max_n = 5 if p <= 5 else (3 if p <= 11 else 2)
        for n in range(1, max_n + 1):
            N = p**n
            sector_sum = sum((p - 1) * (p**s) for s in range(n))
            assert 1 + sector_sum == N, f"Completeness failed for p={p}, n={n}"

            for k in range(1, N):
                s = 0
                q = k
                while q % p == 0:
                    q //= p
                    s += 1
                m = q % p
                assert 1 <= m < p

                kc = N - k
                sc = 0
                qc = kc
                while qc % p == 0:
                    qc //= p
                    sc += 1
                mc = qc % p

                assert sc == s
                assert mc == p - m
                if p % 2 == 1:
                    assert m != mc
                else:
                    assert m == mc == 1
                checked_pairs += 1

    # Verify exact modular picket-fence spacing ratio r_0(p, m) = min(2m, p-2m)/max(2m, p-2m)
    # on W_{0, m} for linear Archimedean dispersion min(k, N - k)
    picket_checked = 0
    for p in (2, 3, 5, 7, 11, 13):
        n = 4 if p <= 5 else 2
        N = p**n
        for m in range(1, p // 2 + 1):
            vals = sorted(min(b * p + m, N - (b * p + m)) for b in range(N // p))
            spacings = [vals[i + 1] - vals[i] for i in range(len(vals) - 1)]
            ratios = [
                Fraction(min(spacings[i], spacings[i + 1]), max(spacings[i], spacings[i + 1]))
                for i in range(len(spacings) - 1)
                if max(spacings[i], spacings[i + 1]) > 0
            ]
            expected = Fraction(min(2 * m, p - 2 * m), max(2 * m, p - 2 * m))
            # Interior alternating ratios equal expected identically
            assert all(r == expected for r in ratios), (
                f"Picket-fence mismatch for p={p}, m={m}: got {set(ratios)}, expected {expected}"
            )
            picket_checked += 1

    print(
        f"[PASS] Theorem I + Picket-Fence Law (Exact Integer/Fraction): verified "
        f"{checked_pairs:,} conjugate pairs + {picket_checked} exact modular picket-fence sectors."
    )


def verify_theorem_2_btz_ollivier_ricci_exact() -> None:
    """Exact rational (fractions.Fraction, zero float) verification of Theorem II across 45 (p, L) horizons."""
    primes = [2, 3, 5, 7, 11]
    lengths = [3, 4, 5, 6, 7, 8, 9, 10, 12]
    cases_checked = 0

    for p in primes:
        d = p + 2
        mu_u = [Fraction(1, d)] * d
        mu_v = [Fraction(1, d)] * d
        kappa_ads = Fraction(-2 * (p - 1), p + 1)

        for L in lengths:
            def ring_dist(a: int, b: int) -> int:
                cw = (b - a) % L
                return min(cw, L - cw)

            u_nbs = [(1, 0), (L - 1, 0)] + [(0, 1) for _ in range(p)]
            v_nbs = [(0, 0), (2 % L, 0)] + [(1, 1) for _ in range(p)]

            cost: list[list[Fraction]] = []
            for hu, eu in u_nbs:
                row: list[Fraction] = []
                for hv, ev in v_nbs:
                    if eu == 0 and ev == 0 and hu == hv:
                        row.append(Fraction(0))
                    else:
                        row.append(Fraction(eu + ring_dist(hu, hv) + ev))
                cost.append(row)

            w1 = exact_wasserstein_bipartite(mu_u, mu_v, cost)
            kappa_exact = Fraction(1) - w1
            kappa_law = Fraction(-(2 * p - max(0, 6 - L)), p + 2)
            assert kappa_exact == kappa_law, (
                f"FALSIFIED Theorem II at p={p}, L={L}: exact={kappa_exact}, law={kappa_law}"
            )

            excess_exact = kappa_exact - kappa_ads
            excess_law = Fraction((p + 1) * max(0, 6 - L) - 4, (p + 1) * (p + 2))
            assert excess_exact == excess_law

            if L in (3, 4):
                assert excess_exact > 0
            elif L == 5:
                if p == 2:
                    assert excess_exact == Fraction(-1, 12)
                elif p == 3:
                    assert excess_exact == Fraction(0)
                else:
                    assert excess_exact > 0
            else:
                assert excess_exact == Fraction(-4, (p + 1) * (p + 2))
            cases_checked += 1

    print(f"[PASS] Theorem II (Exact Fraction Optimal Transport): verified {cases_checked} (p, L) BTZ horizons with ZERO rounding error.")


def verify_theorem_3_and_4_exact() -> None:
    """Exact Gaussian-rational Q(i) verification of Rank-1 Sherman-Morrison Kerr-BTZ solve."""
    def c_add(a, b): return (a[0] + b[0], a[1] + b[1])
    def c_sub(a, b): return (a[0] - b[0], a[1] - b[1])
    def c_mul(a, b): return (a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0])
    def c_conj(a): return (a[0], -a[1])
    def c_div(a, b):
        den = b[0] * b[0] + b[1] * b[1]
        assert den > 0
        return ((a[0] * b[0] + a[1] * b[1]) / den, (a[1] * b[0] - a[0] * b[1]) / den)

    ph = (Fraction(3, 5), Fraction(4, 5))
    ph_bar = c_conj(ph)
    assert ph[0] ** 2 + ph[1] ** 2 == Fraction(1)

    L = 5
    diag_base = [Fraction(7, 2), Fraction(4), Fraction(11, 3), Fraction(5), Fraction(9, 2)]
    weights = [Fraction(1, 2), Fraction(3, 4), Fraction(2, 3), Fraction(5, 6), Fraction(7, 5)]
    w_wrap = weights[L - 1]
    rhs = [(Fraction(i + 1, 3), Fraction(-i, 4)) for i in range(L)]

    zero = (Fraction(0), Fraction(0))
    M = [[zero for _ in range(L)] for _ in range(L)]
    for i in range(L):
        M[i][i] = (diag_base[i] + weights[i] + weights[(i - 1) % L], Fraction(0))
    for i in range(L - 1):
        w = weights[i]
        M[i][i + 1] = (-w * ph[0], -w * ph[1])
        M[i + 1][i] = (-w * ph_bar[0], -w * ph_bar[1])
    M[0][L - 1] = (-w_wrap * ph_bar[0], -w_wrap * ph_bar[1])
    M[L - 1][0] = (-w_wrap * ph[0], -w_wrap * ph[1])

    def solve_tridiag_exact(d_list, b_list):
        c = [zero] * L
        d = [zero] * L
        inv0 = c_div((Fraction(1), Fraction(0)), (d_list[0], Fraction(0)))
        sup0 = (-weights[0] * ph[0], -weights[0] * ph[1])
        c[0] = c_mul(sup0, inv0)
        d[0] = c_mul(b_list[0], inv0)
        for i in range(1, L):
            sub_i = (-weights[i - 1] * ph_bar[0], -weights[i - 1] * ph_bar[1])
            den = c_sub((d_list[i], Fraction(0)), c_mul(sub_i, c[i - 1]))
            if i < L - 1:
                sup_i = (-weights[i] * ph[0], -weights[i] * ph[1])
                c[i] = c_div(sup_i, den)
            num = c_sub(b_list[i], c_mul(sub_i, d[i - 1]))
            d[i] = c_div(num, den)
        x = [zero] * L
        x[L - 1] = d[L - 1]
        for i in range(L - 2, -1, -1):
            x[i] = c_sub(d[i], c_mul(c[i], x[i + 1]))
        return x

    t_diag = [M[i][i][0] for i in range(L)]
    t_diag[0] -= w_wrap
    t_diag[L - 1] -= w_wrap
    u_vec = [(Fraction(1), Fraction(0))] + [zero] * (L - 2) + [(-ph[0], -ph[1])]

    y = solve_tridiag_exact(t_diag, rhs)
    z = solve_tridiag_exact(t_diag, u_vec)

    vy = c_mul((w_wrap, Fraction(0)), c_sub(y[0], c_mul(ph_bar, y[L - 1])))
    vz = c_mul((w_wrap, Fraction(0)), c_sub(z[0], c_mul(ph_bar, z[L - 1])))
    den_sm = c_add((Fraction(1), Fraction(0)), vz)

    assert den_sm[1] == Fraction(0), f"Non-real Hermitian denominator: {den_sm}"
    assert den_sm[0] >= Fraction(1), f"Sherman-Morrison denominator < 1: {den_sm}"

    coeff = c_div(vy, den_sm)
    phi = [c_sub(y[i], c_mul(coeff, z[i])) for i in range(L)]

    for i in range(L):
        acc = zero
        for j in range(L):
            acc = c_add(acc, c_mul(M[i][j], phi[j]))
        assert acc == rhs[i], f"Exact Q(i) residual nonzero at row {i}: {acc} != {rhs[i]}"

    print(f"[PASS] Theorem IV (Exact Q(i) Sherman-Morrison): M*phi == rhs with ZERO error, denom = {den_sm[0]} >= 1.")


def verify_theorem_5_curved_gauss_bonnet_exact() -> None:
    """
    Independent exact-rational (fractions.Fraction, zero float) optimal-transport verification
    of Theorem V (Non-Perturbative Curved AdS Gauss-Bonnet Conservation & Supercritical Pinch Deficit)
    across 60 (p, w) pairs spanning both stretches (w < 1), subcritical pinches (1 <= w <= p),
    and supercritical pinches (w > p).
    """
    primes = [2, 3, 5, 7, 11]
    conductances = [
        Fraction(1, 10), Fraction(1, 3), Fraction(1, 2), Fraction(1),
        Fraction(3, 2), Fraction(2), Fraction(3), Fraction(5),
        Fraction(7), Fraction(9), Fraction(12), Fraction(20),
    ]
    checked = 0
    for p in primes:
        kappa_ads = Fraction(-2 * (p - 1), p + 1)
        for w in conductances:
            a_e = Fraction(1, w)
            W_u = Fraction(p) + w
            # Exact bipartite optimal transport on perturbed edge e (degree p+1 at both ends)
            mu = [w / W_u] + [Fraction(1) / W_u] * p
            cost = []
            for i in range(p + 1):
                row = []
                for j in range(p + 1):
                    if i == 0 and j == 0:
                        row.append(a_e)
                    elif i == 0 or j == 0:
                        row.append(Fraction(1))
                    else:
                        row.append(Fraction(2) + a_e)
                cost.append(row)
            w1_e = exact_wasserstein_bipartite(mu, mu, cost)
            kappa_e = Fraction(1) - w1_e / a_e

            # Exact bipartite optimal transport on an adjacent edge e' = (u, z) (a_{e'} = 1, w_{e'} = 1)
            # N(u) has conductance w on perturbed edge, 1 on e', and (p-1) ones on other edges
            # N(z) has uniform conductance 1 on all (p+1) edges
            mu_u_adj = [Fraction(1) / W_u, w / W_u] + [Fraction(1) / W_u] * (p - 1)
            mu_z_adj = [Fraction(1, p + 1)] * (p + 1)
            # Lengths from u: e' (1), perturbed edge (a_e), other edges (1)
            len_u = [Fraction(0), a_e] + [Fraction(1)] * (p - 1)
            cost_adj = []
            for i in range(p + 1):
                row = []
                for j in range(p + 1):
                    if i == 0 and j == 0:
                        row.append(Fraction(1))  # z to u
                    elif i == 0:
                        row.append(Fraction(1))  # z to child of z
                    elif j == 0:
                        row.append(len_u[i])     # neighbor of u to u
                    else:
                        row.append(len_u[i] + Fraction(1) + Fraction(1))  # across e'
                cost_adj.append(row)
            w1_adj = exact_wasserstein_bipartite(mu_u_adj, mu_z_adj, cost_adj)
            kappa_adj = Fraction(1) - w1_adj

            total_excess = (kappa_e - kappa_ads) + 2 * p * (kappa_adj - kappa_ads)
            expected = Fraction(0) if w <= p else Fraction(-2) * (w - p) / (w + p)
            assert total_excess == expected, (
                f"FALSIFIED Theorem V at p={p}, w={w}: got {total_excess}, expected {expected}"
            )
            checked += 1

    print(f"[PASS] Theorem V (Exact Fraction Curved Gauss-Bonnet): verified {checked} curved (p, w) transport plans with ZERO rounding error.")


def verify_archived_benchmarks_and_lean_audit() -> None:
    bench_path = ROOT / "results" / "discovery-benchmarks.json"
    data = json.loads(bench_path.read_text(encoding="utf-8"))

    # Exp A
    for exp in data["experimentA_adelicHybridSpectrum"]:
        p = exp["p"]
        N = exp["N"]
        mid = next(r for r in exp["sweep"] if abs(r["theta"] - 0.5) < 1e-9)
        if p % 2 == 1:
            assert mid["distinctLevels"] == (N + 1) // 2
        else:
            assert mid["distinctLevels"] == N

    # Exp B
    for row in data["experimentB_btzOllivierRicciLaw"]:
        p, L = row["p"], row["L"]
        exact = float(Fraction(-(2 * p - max(0, 6 - L)), p + 2))
        assert abs(row["measured"] - exact) < 1e-12

    # Exp C
    c_rows = {r["g"]: r for r in data["experimentC_kozyrevCompactonSolitons"]}
    for g, r in c_rows.items():
        assert r["soloLeakage"] < 1e-12, f"Solo compacton leaked at g={g}"
        assert r["disjointBallADrift"] < 1e-12, f"Disjoint multi-soliton drifted at g={g}"
    assert c_rows[60]["multiScaleLeakage"] > c_rows[0]["multiScaleLeakage"]
    assert c_rows[60]["multiScaleLeakage"] > c_rows[500]["multiScaleLeakage"]

    # Exp D
    d = data["experimentD_kerrBtzAharonovBohmFlux"]
    assert d["maxParityErrJ"] < 1e-14
    assert d["maxParityErrE"] < 1e-14

    # Exp E (Frontier #1 resolution: intra-block W_{0,m} up to N = 625)
    exp_e = data["experimentE_intraBlockSpectralStats"]
    assert exp_e["crossValidation_p3_n4_maxEigErr"] < 1e-12
    by_key = {(c["p"], c["n"], c["m"]): c for c in exp_e["configs"]}
    for cfg in exp_e["configs"]:
        assert cfg["maxCrossSectorLeak"] < 1e-12
        assert cfg["maxHermErr"] < 1e-12
    # Smoking-gun GUE falsification check: W_{0,1} (~0.63) vs W_{0,2} (~0.26) in same p=5, N=625 H_theta
    assert abs(by_key[(5, 4, 1)]["meanR_at_0_5"] - 2 / 3) < 0.06
    assert abs(by_key[(5, 4, 2)]["meanR_at_0_5"] - 1 / 4) < 0.04
    assert by_key[(2, 8, 1)]["meanR_at_0_5"] < 0.01

    # Exp F (Frontier #2 resolution: parametric self-trapping scaling)
    exp_f = data["experimentF_selfTrappingScaling"]
    p3_alpha = [s for s in exp_f if s["p"] == 3 and s["n"] == 5]
    p3_alpha.sort(key=lambda s: s["alpha"])
    for i in range(len(p3_alpha) - 1):
        assert p3_alpha[i]["peakLeakage"] > p3_alpha[i + 1]["peakLeakage"], "Peak leakage must decrease with alpha"
    for s in exp_f:
        assert s["tailLeakage"] < s["peakLeakage"] * 0.1, f"Self-trapping tail failed for {s['p']},{s['alpha']}"

    # Exp G (Nonlinear dispersion alpha in {0.5, 1.0, 1.5, 2.0} intra-sector contrast)
    exp_g = data["experimentG_nonlinearDispersionContrast"]
    assert len(exp_g) == 16
    for row in exp_g:
        assert row["maxCrossSectorLeak"] < 1e-11
        assert row["maxHermErr"] < 1e-11
    g_p5_m1_a2 = next(r for r in exp_g if (r["p"], r["m"], r["alpha"]) == (5, 1, 2.0))
    g_p5_m2_a2 = next(r for r in exp_g if (r["p"], r["m"], r["alpha"]) == (5, 2, 2.0))
    assert abs(g_p5_m1_a2["meanR_hybrid05"] - 2 / 3) < 0.06
    assert abs(g_p5_m2_a2["meanR_hybrid05"] - 1 / 4) < 0.04

    # Exp H (Theorem V curved AdS Gauss-Bonnet & BF tachyonic stability margin)
    exp_h = data["experimentH_gaussBonnetAndBFMargin"]
    for c in exp_h["gaussBonnetCurves"]:
        assert c["maxErr"] < 1e-12, f"Theorem V benchmark error {c['maxErr']}"
    assert exp_h["worstBFResidual"] < 1e-12
    assert exp_h["minBFPivot"] > 0.5

    # Lean 4 source scan (zero sorry / admit / axiom / native_decide / unsafe in executable code)
    lean_files = [ROOT / "lean" / "UltrametricaProofs.lean"] + sorted((ROOT / "lean" / "UltrametricaProofs").glob("*.lean"))
    for lf in lean_files:
        txt = lf.read_text(encoding="utf-8")
        txt = re.sub(r"/-.*?-/", "", txt, flags=re.S)
        txt = re.sub(r"--[^\n]*", "", txt)
        m = re.search(r"\b(sorry|admit|axiom|native_decide|unsafe)\b", txt)
        assert m is None, f"Forbidden token '{m.group(1)}' in executable Lean code of {lf}"

    # Lean 4 audit transcript check
    audit_path = ROOT / "results" / "lean4-audit.txt"
    audit_text = audit_path.read_text(encoding="utf-8")
    audit_body = audit_text.split("====")[-1]
    assert "sorryAx" not in audit_body, "sorryAx found in Lean 4 audit!"
    assert "native_decide" not in audit_body, "native_decide axiom detected!"
    allowed = {"propext", "Classical.choice", "Quot.sound"}
    audited = 0
    for line in audit_text.splitlines():
        if "depends on axioms:" in line:
            audited += 1
            bracket = line.split("[", 1)[1].rsplit("]", 1)[0]
            used = {tok.strip() for tok in bracket.split(",") if tok.strip()}
            assert used.issubset(allowed), f"Forbidden axiom in line: {line}"
        elif "does not depend on any axioms" in line:
            audited += 1
    assert audited >= 101, f"Expected >= 101 audited Lean declarations, found {audited}"

    print(f"[PASS] Benchmark (Exp A-H) & Lean 4 Audit Cross-Check: 8 datasets + {audited} Lean declarations verified.")


def verify_metadata_consistency() -> None:
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    assert pkg["version"] == version, f"package.json version {pkg['version']} != VERSION {version}"

    cff = (ROOT / "CITATION.cff").read_text(encoding="utf-8")
    assert f'version: "{version}"' in cff, f"CITATION.cff missing version {version}"
    assert CANONICAL_ORCID in cff, "CITATION.cff missing canonical ORCID"

    for rel in ("README.md", "LEGAL.md", "paper/main.tex", "docs/CLAIMS.md"):
        p = ROOT / rel
        if p.exists():
            txt = p.read_text(encoding="utf-8")
            assert CANONICAL_ORCID in txt, f"{rel} missing canonical ORCID {CANONICAL_ORCID}"

    print(f"[PASS] Metadata & ORCID Consistency: VERSION={version}, ORCID={CANONICAL_ORCID} synchronized across repository.")


def write_checksums() -> None:
    lines = []
    for rel in MANIFEST_FILES:
        p = ROOT / rel
        if not p.exists():
            raise FileNotFoundError(f"Manifest file missing: {rel}")
        lines.append(f"{sha256_file(p)}  {rel}")
    out = ROOT / "CHECKSUMS.sha256"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print(f"[OK] Wrote CHECKSUMS.sha256 with {len(lines)} SHA-256 digests.")


def check_checksums(required: bool) -> None:
    manifest = ROOT / "CHECKSUMS.sha256"
    if not manifest.exists():
        if required:
            raise FileNotFoundError("CHECKSUMS.sha256 missing!")
        print("[SKIP] CHECKSUMS.sha256 not yet generated.")
        return
    checked = 0
    for line in manifest.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        expected_hash, rel = line.split("  ", 1)
        p = ROOT / rel
        assert p.exists(), f"Checksummed file missing: {rel}"
        actual = sha256_file(p)
        assert actual == expected_hash, f"SHA-256 mismatch for {rel}: expected {expected_hash}, got {actual}"
        checked += 1
    print(f"[PASS] Cryptographic SHA-256 Manifest: {checked}/{checked} files verified bit-identical.")


def main() -> None:
    parser = argparse.ArgumentParser(description="ULTRAMETRICA independent exact-rational falsifier & checksum auditor.")
    parser.add_argument("--write-checksums", action="store_true", help="Regenerate CHECKSUMS.sha256")
    parser.add_argument("--check-checksums", action="store_true", help="Require and verify CHECKSUMS.sha256")
    args = parser.parse_args()

    verify_theorem_1_adelic_symmetry()
    verify_theorem_2_btz_ollivier_ricci_exact()
    verify_theorem_3_and_4_exact()
    verify_theorem_5_curved_gauss_bonnet_exact()
    verify_archived_benchmarks_and_lean_audit()

    if args.write_checksums:
        verify_metadata_consistency()
        write_checksums()
        check_checksums(required=True)
    else:
        if args.check_checksums:
            verify_metadata_consistency()
            check_checksums(required=True)
        elif (ROOT / "CHECKSUMS.sha256").exists():
            check_checksums(required=False)

    print("\nALL INDEPENDENT EXACT-RATIONAL & AUDIT CHECKS PASSED.")


if __name__ == "__main__":
    main()

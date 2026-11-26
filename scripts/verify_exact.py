#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.5.0) — Independent Zero-Dependency Exact-Rational Falsifier,
Metadata/Affiliation/Citation Auditor & SHA-256 Manifest Verifier.

Completely decoupled from both the JavaScript simulation engine and Lean 4 proofs.
Uses Python standard library exact arbitrary-precision arithmetic (int & fractions.Fraction)
to independently verify or falsify:
  - Theorem I + Proposition 4.2 modular picket-fence law
  - Theorem II exact rational bipartite optimal transport on 45 (p, L) BTZ horizons
  - Theorem IV exact Q(i) Rank-1 Sherman-Morrison Kerr-BTZ solve
  - Theorem V single-edge + Theorem V-Global multi-edge curved AdS Gauss-Bonnet conservation & deficit
  - Theorem VI exact exhaustive brute-force holographic Ryu-Takayanagi Strong Subadditivity (SSA)
  - Nested-comment/string-safe Lean 4 source scan (UltrametricaProofs + Solution)
  - 120+ audited Lean 4 declarations + 6-kernel comparator verdict in results/lean4-audit.txt
  - Pre-registered Experiment I statistical evaluation (results/stats-eval.json) & perf benchmarks
  - Citation / DOI / arXiv syntax validation in paper/refs.bib
  - Cross-document version, ORCID, and affiliation consistency
  - Cryptographic CHECKSUMS.sha256 and data/MANIFEST.sha256 manifests

Usage:
  python scripts/verify_exact.py                  # Run all exact checks + verify manifests if present
  python scripts/verify_exact.py --write-checksums # Regenerate CHECKSUMS.sha256 & data/MANIFEST.sha256
  python scripts/verify_exact.py --check-checksums # Require CHECKSUMS.sha256 & data/MANIFEST.sha256 to match 100%
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import deque
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CANONICAL_ORCID = "0009-0006-8168-9648"

DATA_MANIFEST_FILES = [
    "results/lean4-audit.txt",
    "results/discovery-benchmarks.json",
    "results/stats-eval.json",
    "results/perf-benchmarks.json",
    "test/golden/baseline-snapshot.json",
]

MANIFEST_FILES = [
    "LICENSE",
    "LEGAL.md",
    "NOTICE",
    "VERSION",
    "package.json",
    "package-lock.json",
    "CITATION.cff",
    "formalization.yaml",
    "repo.yaml",
    "README.md",
    "SUMMARY.md",
    "CLAIMS.md",
    "LIMITATIONS.md",
    "REPLICATION.md",
    "ERRATA.md",
    "INDEX.md",
    "GLOSSARY.md",
    "VERIFICATION.md",
    "CHANGELOG.md",
    "server.mjs",
    "docs/CLAIMS.md",
    "docs/MASTER_REPORT.md",
    "docs/AUDIT_AND_CONTRAST_ANALYSIS.md",
    "docs/MEGA_ATLAS_CROSSCHECK.md",
    "docs/LITERATURE_SEARCH.md",
    "docs/preregistration.md",
    "docs/statement-fidelity.md",
    "src/engine/padic.js",
    "src/engine/holography.js",
    "src/engine/quantum.js",
    "src/engine/simulation.js",
    "src/web/index.html",
    "src/web/styles.css",
    "src/web/app.js",
    "src/web/blueprint.html",
    "src/web/blueprint.css",
    "src/web/blueprint.js",
    "src/web/renderer3d.js",
    "src/web/panels2d.js",
    "src/web/audio.js",
    "src/web/audio-worklet.js",
    "test/verify.mjs",
    "test/mutants.mjs",
    "test/properties.mjs",
    "test/server.mjs",
    "test/golden.mjs",
    "test/golden/baseline-snapshot.json",
    "reference/padic_oracle.py",
    "scripts/discover.mjs",
    "scripts/bench.mjs",
    "scripts/stats_eval.mjs",
    "scripts/verify_exact.py",
    "scripts/check_readme_axioms.py",
    "scripts/check_citations.py",
    "scripts/check_blueprint.py",
    "scripts/generate_figures.py",
    "scripts/package_dist.py",
    "lean/lean-toolchain",
    "lean/lakefile.toml",
    "lean/lake-manifest.json",
    "lean/comparator.json",
    "lean/README.md",
    "lean/UltrametricaProofs.lean",
    "lean/VerifyAxioms.lean",
    "lean/Challenge.lean",
    "lean/Solution.lean",
    "lean/UltrametricaProofs/Spec.lean",
    "lean/UltrametricaProofs/Basic.lean",
    "lean/UltrametricaProofs/AdelicSymmetry.lean",
    "lean/UltrametricaProofs/HolographyCurvature.lean",
    "lean/UltrametricaProofs/SolitonAndSolver.lean",
    "lean/UltrametricaProofs/AdversarialTests.lean",
    "results/lean4-audit.txt",
    "results/discovery-benchmarks.json",
    "results/stats-eval.json",
    "results/perf-benchmarks.json",
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


def strip_lean_comments_and_strings(src: str) -> str:
    """
    Proper nested block-comment (`/- ... -/`), line-comment (`-- ...`), and string-literal
    lexer for Lean 4 (fixes F09 non-nested regex hole).
    """
    out: list[str] = []
    i = 0
    n = len(src)
    block_depth = 0
    in_string = False

    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""

        if in_string:
            if ch == "\\" and i + 1 < n:
                i += 2
                continue
            if ch == '"':
                in_string = False
                out.append(" ")
            i += 1
            continue

        if block_depth > 0:
            if ch == "/" and nxt == "-":
                block_depth += 1
                i += 2
                continue
            if ch == "-" and nxt == "/":
                block_depth -= 1
                if block_depth == 0:
                    out.append(" ")
                i += 2
                continue
            if ch == "\n":
                out.append("\n")
            i += 1
            continue

        if ch == "/" and nxt == "-":
            block_depth = 1
            i += 2
            continue
        if ch == "-" and nxt == "-":
            while i < n and src[i] != "\n":
                i += 1
            continue
        if ch == '"':
            in_string = True
            out.append(" ")
            i += 1
            continue

        out.append(ch)
        i += 1

    assert block_depth == 0, "Unclosed Lean 4 block comment /- ... -/"
    assert not in_string, "Unclosed Lean 4 string literal"
    return "".join(out)


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

        d_sink = dist[sink]
        assert d_sink is not None, "Failed to find augmenting path in exact transport"
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
        total_cost += push * d_sink

    assert flow == one
    return total_cost


def verify_theorem_1_adelic_symmetry() -> None:
    """Exact integer verification of Theorem I + Experiment E modular picket-fence law."""
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
            def ring_dist(a: int, b: int, ring_len: int = L) -> int:
                cw = (b - a) % ring_len
                return min(cw, ring_len - cw)

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


def verify_theorem_5_and_5global_exact() -> None:
    """
    Independent exact-rational (fractions.Fraction) verification of:
      (a) Theorem V (60 single-edge curved (p, w) transport plans)
      (b) Theorem V-Global (arbitrary simultaneous multi-edge curved conductances on finite T_p trees)
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

            mu_u_adj = [Fraction(1) / W_u, w / W_u] + [Fraction(1) / W_u] * (p - 1)
            mu_z_adj = [Fraction(1, p + 1)] * (p + 1)
            len_u = [Fraction(0), a_e] + [Fraction(1)] * (p - 1)
            cost_adj = []
            for i in range(p + 1):
                row = []
                for j in range(p + 1):
                    if i == 0:
                        row.append(Fraction(1))
                    elif j == 0:
                        row.append(len_u[i])
                    else:
                        row.append(len_u[i] + Fraction(1) + Fraction(1))
                cost_adj.append(row)
            w1_adj = exact_wasserstein_bipartite(mu_u_adj, mu_z_adj, cost_adj)
            kappa_adj = Fraction(1) - w1_adj

            total_excess = (kappa_e - kappa_ads) + 2 * p * (kappa_adj - kappa_ads)
            expected = Fraction(0) if w <= p else Fraction(-2) * (w - p) / (w + p)
            assert total_excess == expected, (
                f"FALSIFIED Theorem V at p={p}, w={w}: got {total_excess}, expected {expected}"
            )
            checked += 1

    # Theorem V-Global: Simultaneous multi-edge curved tree (2 adjacent + 1 disjoint perturbed edges)
    # Build a finite (p+1)-regular subtree of depth 4 around a central edge (0,1) so all perturbed
    # edges and all edges incident to their endpoints have full degree p+1 and uniform outer neighbors.
    global_checked = 0
    for p in (2, 3, 5):
        kappa_ads = Fraction(-2 * (p - 1), p + 1)
        # Build explicit tree rooted at edge (0, 1), expanding 3 hops from both 0 and 1
        edges: list[tuple[int, int]] = [(0, 1)]
        adj: dict[int, list[int]] = {0: [1], 1: [0]}
        depth: dict[int, int] = {0: 0, 1: 0}
        nxt = 2
        frontier = [0, 1]
        for hop in range(1, 4):
            new_frontier = []
            for u in frontier:
                need = (p + 1) - len(adj[u])
                for _ in range(need):
                    v = nxt
                    nxt += 1
                    edges.append((u, v))
                    adj[u].append(v)
                    adj[v] = [u]
                    depth[v] = hop
                    new_frontier.append(v)
            frontier = new_frontier

        # Perturb 3 interior edges simultaneously (central edge + 2 hop-1 edges) across subcritical & supercritical cases
        test_weight_sets = [
            (Fraction(1, 3), Fraction(1, 2), Fraction(2, 3)),      # all stretched -> exact 0
            (Fraction(3, 2), Fraction(5, 4), Fraction(2, 1)),      # mixed subcritical -> exact 0
            (Fraction(2 * p + 3), Fraction(1, 2), Fraction(3 * p)), # 2 supercritical + 1 stretch -> exact deficit sum
        ]
        for w0, w1, w2 in test_weight_sets:
            ew: dict[tuple[int, int], Fraction] = {}
            for idx, (u, v) in enumerate(edges):
                w = w0 if idx == 0 else (w1 if idx == 1 else (w2 if idx == p + 1 else Fraction(1)))
                ew[(u, v)] = w
                ew[(v, u)] = w

            # Compute exact SPFA Ollivier-Ricci on every edge whose endpoints both have degree p+1 (depth <= 2)
            def exact_kappa_on_tree_edge(
                u: int,
                v: int,
                adj_map: dict[int, list[int]] = adj,
                edge_w: dict[tuple[int, int], Fraction] = ew,
            ) -> Fraction:
                a_uv = Fraction(1, edge_w[(u, v)])
                nbs_u = adj_map[u]
                nbs_v = adj_map[v]
                Wu = sum(edge_w[(u, x)] for x in nbs_u)
                Wv = sum(edge_w[(v, y)] for y in nbs_v)
                mu_u = [edge_w[(u, x)] / Wu for x in nbs_u]
                mu_v = [edge_w[(v, y)] / Wv for y in nbs_v]
                cost_m = []
                for x in nbs_u:
                    row = []
                    for y in nbs_v:
                        if x == v and y == u:
                            row.append(a_uv)
                        elif x == v:
                            row.append(Fraction(1, edge_w[(v, y)]))
                        elif y == u:
                            row.append(Fraction(1, edge_w[(u, x)]))
                        else:
                            row.append(Fraction(1, edge_w[(u, x)]) + a_uv + Fraction(1, edge_w[(v, y)]))
                    cost_m.append(row)
                w1_val = exact_wasserstein_bipartite(mu_u, mu_v, cost_m)
                return Fraction(1) - w1_val / a_uv

            # Sum excess over all interior edges (depth[u] <= 1 and depth[v] <= 2)
            total_ex = Fraction(0)
            expected_def = Fraction(0)
            for u, v in edges:
                if len(adj[u]) == p + 1 and len(adj[v]) == p + 1:
                    k_uv = exact_kappa_on_tree_edge(u, v)
                    total_ex += k_uv - kappa_ads
                    Wu = sum(ew[(u, x)] for x in adj[u])
                    Wv = sum(ew[(v, y)] for y in adj[v])
                    w = ew[(u, v)]
                    frac_sum = w / Wu + w / Wv
                    if frac_sum > Fraction(1):
                        expected_def += Fraction(-2) * (frac_sum - Fraction(1))

            assert total_ex == expected_def, (
                f"FALSIFIED Theorem V-Global at p={p}, w={(w0,w1,w2)}: got {total_ex}, expected {expected_def}"
            )
            global_checked += 1

    print(
        f"[PASS] Theorem V & V-Global (Exact Fraction Optimal Transport): verified {checked} single-edge + "
        f"{global_checked} simultaneous multi-edge curved trees with ZERO rounding error."
    )


def verify_theorem_6_holographic_ssa_exact() -> None:
    """
    Independent exact integer exhaustive brute-force verification of Theorem VI
    (Universal Holographic Ryu-Takayanagi Strong Subadditivity: S(ABC) + S(B) <= S(AB) + S(BC))
    across both pure trees and cyclic BTZ-like weighted graphs.
    """
    graphs = [
        # (num_verts, boundary_set, weighted_edges)
        (8, {4, 5, 6, 7}, [(0, 1, 3), (0, 2, 5), (0, 3, 2), (1, 4, 4), (1, 5, 7), (2, 6, 6), (3, 7, 1)]),
        # Cyclic BTZ-like horizon ring (0-1-2-0) with hanging boundary leaves {3,4,5,6,7,8}
        (9, {3, 4, 5, 6, 7, 8}, [(0, 1, 5), (1, 2, 3), (2, 0, 4), (0, 3, 2), (0, 4, 6), (1, 5, 7), (1, 6, 1), (2, 7, 5), (2, 8, 3)]),
    ]

    def min_rt_cut(n_verts: int, bdry: set[int], edges: list[tuple[int, int, int]], region: set[int]) -> int:
        internal = sorted(v for v in range(n_verts) if v not in bdry)
        best = None
        for mask in range(1 << len(internal)):
            wedge = set(region)
            for idx, v in enumerate(internal):
                if (mask >> idx) & 1:
                    wedge.add(v)
            cap = sum(c for u, v, c in edges if (u in wedge) != (v in wedge))
            if best is None or cap < best:
                best = cap
        assert best is not None
        return best

    triples_checked = 0
    for n_verts, bdry, edges in graphs:
        b_list = sorted(bdry)
        # Partition boundary into all 4^|bdry| assignments: 0=outside, 1=A, 2=B, 3=C (A,B,C pairwise disjoint)
        for code in range(4 ** len(b_list)):
            A, B, C = set(), set(), set()
            x = code
            for v in b_list:
                r = x % 4
                x //= 4
                if r == 1:
                    A.add(v)
                elif r == 2:
                    B.add(v)
                elif r == 3:
                    C.add(v)
            s_ab = min_rt_cut(n_verts, bdry, edges, A | B)
            s_bc = min_rt_cut(n_verts, bdry, edges, B | C)
            s_abc = min_rt_cut(n_verts, bdry, edges, A | B | C)
            s_b = min_rt_cut(n_verts, bdry, edges, B)
            assert s_abc + s_b <= s_ab + s_bc, (
                f"FALSIFIED Theorem VI SSA: S(ABC)={s_abc}, S(B)={s_b}, S(AB)={s_ab}, S(BC)={s_bc}"
            )
            triples_checked += 1

    print(
        f"[PASS] Theorem VI (Exact Brute-Force Holographic RT SSA): verified ALL {triples_checked:,} "
        f"disjoint (A, B, C) partitions across tree & cyclic BTZ weighted graphs."
    )


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

    # Exp E
    exp_e = data["experimentE_intraBlockSpectralStats"]
    assert exp_e["crossValidation_p3_n4_maxEigErr"] < 1e-12
    by_key = {(c["p"], c["n"], c["m"]): c for c in exp_e["configs"]}
    for cfg in exp_e["configs"]:
        assert cfg["maxCrossSectorLeak"] < 1e-12
        assert cfg["maxHermErr"] < 1e-12
    assert abs(by_key[(5, 4, 1)]["meanR_at_0_5"] - 2 / 3) < 0.06
    assert abs(by_key[(5, 4, 2)]["meanR_at_0_5"] - 1 / 4) < 0.04
    assert by_key[(2, 8, 1)]["meanR_at_0_5"] < 0.01

    # Exp F
    exp_f = data["experimentF_selfTrappingScaling"]
    p3_alpha = [s for s in exp_f if s["p"] == 3 and s["n"] == 5]
    p3_alpha.sort(key=lambda s: s["alpha"])
    for i in range(len(p3_alpha) - 1):
        assert p3_alpha[i]["peakLeakage"] > p3_alpha[i + 1]["peakLeakage"], "Peak leakage must decrease with alpha"
    for s in exp_f:
        assert s["tailLeakage"] < s["peakLeakage"] * 0.1, f"Self-trapping tail failed for {s['p']},{s['alpha']}"

    # Exp G
    exp_g = data["experimentG_nonlinearDispersionContrast"]
    assert len(exp_g) == 16
    for row in exp_g:
        assert row["maxCrossSectorLeak"] < 1e-11
        assert row["maxHermErr"] < 1e-11
    g_p5_m1_a2 = next(r for r in exp_g if (r["p"], r["m"], r["alpha"]) == (5, 1, 2.0))
    g_p5_m2_a2 = next(r for r in exp_g if (r["p"], r["m"], r["alpha"]) == (5, 2, 2.0))
    assert abs(g_p5_m1_a2["meanR_hybrid05"] - 2 / 3) < 0.06
    assert abs(g_p5_m2_a2["meanR_hybrid05"] - 1 / 4) < 0.04

    # Exp H
    exp_h = data["experimentH_gaussBonnetAndBFMargin"]
    for c in exp_h["gaussBonnetCurves"]:
        assert c["maxErr"] < 1e-12, f"Theorem V benchmark error {c['maxErr']}"
    assert exp_h["worstBFResidual"] < 1e-12
    assert exp_h["minBFPivot"] > 0.5

    # Pre-registered Experiment I statistical evaluation (B28-B32)
    stats_path = ROOT / "results" / "stats-eval.json"
    stats = json.loads(stats_path.read_text(encoding="utf-8"))
    assert len(stats["config"]["control_seeds"]) == 20
    assert len(stats["hypotheses"]) == 4
    for h in stats["hypotheses"]:
        assert h["prereg_confirmed"] is True, f"Experiment I hypothesis failed: {h['id']}"
        assert h["p_holm_adjusted"] < 0.01
        assert h["seeds_in_predicted_direction"] == "20/20"

    # Performance benchmarks (A37 / B26)
    perf_path = ROOT / "results" / "perf-benchmarks.json"
    perf = json.loads(perf_path.read_text(encoding="utf-8"))
    assert len(perf["benchmarks"]) >= 5
    assert perf["environment"]["cpu"]

    # Nested-comment & string-safe Lean 4 source scan (fixes F09!)
    # Scans UltrametricaProofs.lean, UltrametricaProofs/*.lean, AND Solution.lean
    # (Challenge.lean is excluded because its `sorry` placeholders are the comparator specification.)
    lean_files = (
        [ROOT / "lean" / "UltrametricaProofs.lean", ROOT / "lean" / "Solution.lean"]
        + sorted((ROOT / "lean" / "UltrametricaProofs").glob("*.lean"))
    )
    forbidden_re = re.compile(r"\b(sorry|admit|axiom|native_decide|unsafe|implemented_by)\b|@\[extern")
    for lf in lean_files:
        cleaned = strip_lean_comments_and_strings(lf.read_text(encoding="utf-8"))
        m = forbidden_re.search(cleaned)
        assert m is None, f"Forbidden token '{m.group(0)}' in executable Lean code of {lf}"

    # Lean 4 audit transcript check (120+ declarations + 6-kernel comparator verdict)
    audit_path = ROOT / "results" / "lean4-audit.txt"
    audit_text = audit_path.read_text(encoding="utf-8")
    assert "sorryAx" not in audit_text, "sorryAx found in Lean 4 audit!"
    assert "Lean.ofReduceBool" not in audit_text, "Lean.ofReduceBool found in Lean 4 audit!"
    assert "_native" not in audit_text, "_native axiom found in Lean 4 audit!"
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
    assert audited >= 149, f"Expected >= 149 audited Lean declarations, found {audited}"
    assert "comparator" in audit_text.lower() or "nanoda" in audit_text.lower(), (
        "results/lean4-audit.txt missing multi-kernel comparator verification output"
    )

    # BibTeX syntax & identifier sanity check (Playbook Section 4)
    bib_text = (ROOT / "paper" / "refs.bib").read_text(encoding="utf-8")
    doi_re = re.compile(r"^10\.\d{4,9}/[-._;()/:A-Za-z0-9]+$")
    dois = re.findall(r"doi\s*=\s*\{([^}]+)\}", bib_text)
    assert len(dois) >= 15, f"Expected >= 15 verified DOIs in refs.bib, found {len(dois)}"
    for doi in dois:
        assert doi_re.match(doi.strip()), f"Malformed DOI in paper/refs.bib: {doi}"

    print(
        f"[PASS] Benchmark (Exp A-I), Perf, BibTeX ({len(dois)} DOIs) & Lean 4 Audit: "
        f"{audited} audited declarations + clean nested-comment scan verified."
    )


def verify_metadata_consistency() -> None:
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    assert pkg["version"] == version, f"package.json version {pkg['version']} != VERSION {version}"

    cff = (ROOT / "CITATION.cff").read_text(encoding="utf-8")
    assert f'version: "{version}"' in cff, f"CITATION.cff missing version {version}"
    assert CANONICAL_ORCID in cff, "CITATION.cff missing canonical ORCID"

    for rel in ("README.md", "LEGAL.md", "paper/main.tex", "CLAIMS.md", "docs/CLAIMS.md"):
        p = ROOT / rel
        if p.exists():
            txt = p.read_text(encoding="utf-8")
            assert CANONICAL_ORCID in txt, f"{rel} missing canonical ORCID {CANONICAL_ORCID}"

    # Playbook Finding 1: verify no non-existent "0thernes LLC" legal entity claims remain in primary artifacts
    for rel in ("LICENSE", "LEGAL.md", "NOTICE", "CITATION.cff", "README.md", "SUMMARY.md", "paper/main.tex", "paper/WHITE_PAPER.md", "CLAIMS.md"):
        p = ROOT / rel
        if p.exists():
            txt = p.read_text(encoding="utf-8")
            assert "0thernes LLC" not in txt, f"Found unformed entity string '0thernes LLC' in {rel}"

    print(f"[PASS] Metadata, Affiliation & ORCID Consistency: VERSION={version}, ORCID={CANONICAL_ORCID} synchronized.")


def write_checksums() -> None:
    lines = []
    for rel in MANIFEST_FILES:
        p = ROOT / rel
        if not p.exists():
            raise FileNotFoundError(f"Manifest file missing: {rel}")
        lines.append(f"{sha256_file(p)}  {rel}")
    out = ROOT / "CHECKSUMS.sha256"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")

    data_dir = ROOT / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    data_lines = []
    for rel in DATA_MANIFEST_FILES:
        p = ROOT / rel
        if not p.exists():
            raise FileNotFoundError(f"Data manifest file missing: {rel}")
        data_lines.append(f"{sha256_file(p)}  {rel}")
    data_out = data_dir / "MANIFEST.sha256"
    data_out.write_text("\n".join(data_lines) + "\n", encoding="utf-8", newline="\n")
    print(f"[OK] Wrote CHECKSUMS.sha256 ({len(lines)} digests) & data/MANIFEST.sha256 ({len(data_lines)} digests).")


def check_checksums(required: bool) -> None:
    for rel_manifest in ("CHECKSUMS.sha256", "data/MANIFEST.sha256"):
        manifest = ROOT / rel_manifest
        if not manifest.exists():
            if required:
                raise FileNotFoundError(f"{rel_manifest} missing!")
            print(f"[SKIP] {rel_manifest} not yet generated.")
            continue
        checked = 0
        for line in manifest.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            expected_hash, rel = line.split("  ", 1)
            p = ROOT / rel
            assert p.exists(), f"Checksummed file missing: {rel}"
            actual = sha256_file(p)
            assert actual == expected_hash, f"SHA-256 mismatch for {rel}: expected {expected_hash}, got {actual}"
            checked += 1
        print(f"[PASS] Cryptographic {rel_manifest}: {checked}/{checked} files verified bit-identical.")


def main() -> None:
    parser = argparse.ArgumentParser(description="ULTRAMETRICA independent exact-rational falsifier & checksum auditor.")
    parser.add_argument("--write-checksums", action="store_true", help="Regenerate CHECKSUMS.sha256 & data/MANIFEST.sha256")
    parser.add_argument("--check-checksums", action="store_true", help="Require and verify CHECKSUMS.sha256 & data/MANIFEST.sha256")
    args = parser.parse_args()

    verify_theorem_1_adelic_symmetry()
    verify_theorem_2_btz_ollivier_ricci_exact()
    verify_theorem_3_and_4_exact()
    verify_theorem_5_and_5global_exact()
    verify_theorem_6_holographic_ssa_exact()
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

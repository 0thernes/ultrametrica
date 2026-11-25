/**
 * Example 02 — Tate-Curve BTZ Ollivier-Ricci Curvature (Theorem II) & Ryu-Takayanagi SSA (Theorem VI).
 *
 * Run: node examples/02_btz_curvature_and_rt.mjs
 */

import assert from 'node:assert/strict';
import { PadicSpace } from '../src/engine/padic.js';
import { BruhatTitsBulk } from '../src/engine/holography.js';

// 1. Exact L_c = 5 trichotomy and macroscopic deficit on uniform BTZ horizons
for (const [p, n, h] of [[3, 4, 1], [5, 3, 1], [3, 5, 2]]) {
  const bulk = new BruhatTitsBulk(new PadicSpace(p, n), h);
  const L = bulk.horizonLength;
  const measured = bulk.ricciCurvature[bulk.horizonEdges[0]];
  const theory = -(2 * p - Math.max(0, 6 - L)) / (p + 2);
  console.log(`BTZ (p=${p}, L=${L}): kappa_measured=${measured.toFixed(6)}, theory=${theory.toFixed(6)}, err=${Math.abs(measured - theory).toExponential(2)}`);
  assert.ok(Math.abs(measured - theory) < 1e-12);
}

// 2. Holographic Ryu-Takayanagi Strong Subadditivity S(ABC) + S(B) <= S(AB) + S(BC)
const bulk = new BruhatTitsBulk(new PadicSpace(3, 4), 2);
const makeRegion = (start, end) => {
  const r = new Uint8Array(bulk.N);
  for (let i = start; i < end; i++) r[i] = 1;
  return r;
};
const union = (x, y) => x.map((v, i) => (v || y[i] ? 1 : 0));

const A = makeRegion(0, 18);
const B = makeRegion(18, 42);
const C = makeRegion(42, 65);
const sAB = bulk.computeRyuTakayanagi(union(A, B)).entropy;
const sBC = bulk.computeRyuTakayanagi(union(B, C)).entropy;
const sABC = bulk.computeRyuTakayanagi(union(union(A, B), C)).entropy;
const sB = bulk.computeRyuTakayanagi(B).entropy;

console.log(`RT SSA on BTZ (p=3, L=9): S(ABC)+S(B) = ${(sABC + sB).toFixed(4)} <= S(AB)+S(BC) = ${(sAB + sBC).toFixed(4)}`);
assert.ok(sABC + sB <= sAB + sBC + 1e-12);

/**
 * Example 01 — Exact Kozyrev Compacton-Soliton Evolution (Theorem III) vs. Euclidean Twin.
 *
 * Run: node examples/01_kozyrev_compacton.mjs
 */

import assert from 'node:assert/strict';
import { PadicSpace } from '../src/engine/padic.js';
import { PadicQuantumEngine } from '../src/engine/quantum.js';

const space = new PadicSpace(3, 4); // Q_3, N = 81 leaves
const quantum = new PadicQuantumEngine(space);
quantum.setAlpha(1.0);
quantum.nonlinearity = 80.0; // Strong Gross-Pitaevskii self-interaction

// Prepare a single Kozyrev compacton wavelet supported strictly on depth-1 ball b = 0
const w = space.createKozyrevWavelet(1, 0, 1);
quantum.setState(w.re, w.im);

const probInBall0 = (re, im) => {
  let s = 0;
  for (let l = 0; l < space.N / 3; l++) s += re[l] * re[l] + im[l] * im[l];
  return s;
};

for (let step = 0; step < 200; step++) {
  quantum.step(0.01, 2);
}

const padicLeak = 1.0 - probInBall0(quantum.leafRe, quantum.leafIm);
const euclideanLeak = 1.0 - probInBall0(quantum.twinRe, quantum.twinIm);

console.log(`p=3, N=${space.N}, g=${quantum.nonlinearity}:`);
console.log(`  Q_3 Kozyrev compacton leakage : ${padicLeak.toExponential(3)} (exact 0 by Theorem III)`);
console.log(`  Euclidean R twin leakage      : ${(euclideanLeak * 100).toFixed(2)}% (dispersive explosion)`);

assert.ok(padicLeak < 1e-12, `Expected < 1e-12 leakage, got ${padicLeak}`);
assert.ok(euclideanLeak > 0.30, `Expected strong Euclidean dispersion, got ${euclideanLeak}`);

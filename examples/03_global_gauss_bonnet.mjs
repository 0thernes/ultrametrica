/**
 * Example 03 — Global Multi-Edge Curved AdS Gauss-Bonnet Conservation & Supercritical Deficit (Theorem V-Global).
 *
 * Run: node examples/03_global_gauss_bonnet.mjs
 */

import assert from 'node:assert/strict';
import { PadicSpace } from '../src/engine/padic.js';
import { BruhatTitsBulk } from '../src/engine/holography.js';

const p = 3;
const bulk = new BruhatTitsBulk(new PadicSpace(p, 5), 0);
const kappaAdS = (-2 * (p - 1)) / (p + 1);

const interior = [];
for (let ei = 0; ei < bulk.numEdges; ei++) {
  const e = bulk.edges[ei];
  if (bulk.nodeDepth[e.u] >= 2 && bulk.nodeDepth[e.v] <= 3) interior.push(ei);
}

// Case A: Simultaneous multi-edge stretches & subcritical pinches -> exact zero total excess
bulk.sigma[interior[0]] = 1.25;
bulk.sigma[interior[1]] = -0.60;
bulk.sigma[interior[2]] = 0.85;
bulk._syncWeights();
bulk.computeOllivierRicci();

let excessSub = 0;
for (let ei = 0; ei < bulk.numEdges; ei++) {
  const e = bulk.edges[ei];
  if (bulk.nodeDepth[e.u] >= 1 && !bulk.isLeaf[e.v]) excessSub += bulk.ricciCurvature[ei] - kappaAdS;
}
console.log(`Multi-edge subcritical curved AdS excess: ${excessSub.toExponential(3)} (exact 0 by Theorem V-Global)`);
assert.ok(Math.abs(excessSub) < 1e-12);

// Case B: Pinch two interior edges supercritically -> exact negative deficit sum
bulk.sigma[interior[1]] = -1.75;
bulk.sigma[interior[3]] = -1.95;
bulk._syncWeights();
bulk.computeOllivierRicci();

const W = new Float64Array(bulk.numNodes);
for (let ei = 0; ei < bulk.numEdges; ei++) {
  const e = bulk.edges[ei];
  const w = Math.exp(-bulk.sigma[ei]);
  W[e.u] += w;
  W[e.v] += w;
}

let excessSup = 0;
let predictedDeficit = 0;
for (let ei = 0; ei < bulk.numEdges; ei++) {
  const e = bulk.edges[ei];
  if (bulk.nodeDepth[e.u] >= 1 && !bulk.isLeaf[e.v]) {
    excessSup += bulk.ricciCurvature[ei] - kappaAdS;
    const w = Math.exp(-bulk.sigma[ei]);
    const frac = w / W[e.u] + w / W[e.v];
    if (frac > 1) predictedDeficit += -2 * (frac - 1);
  }
}

console.log(`Multi-edge supercritical excess=${excessSup.toFixed(10)}, predicted=${predictedDeficit.toFixed(10)}, err=${Math.abs(excessSup - predictedDeficit).toExponential(2)}`);
assert.ok(Math.abs(excessSup - predictedDeficit) < 1e-12);

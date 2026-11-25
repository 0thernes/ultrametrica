/**
 * ULTRAMETRICA (v1.4.0) — Golden Snapshot Regression Test (Build Standard B08).
 *
 * Pins deterministic numeric outputs across Monna maps, Vladimirov spectra,
 * BTZ Ollivier-Ricci curvature, curved AdS Gauss-Bonnet, and Ryu-Takayanagi cuts.
 * Updating test/golden/baseline-snapshot.json requires passing --update-golden explicitly.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PadicSpace } from '../src/engine/padic.js';
import { BruhatTitsBulk } from '../src/engine/holography.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOLDEN_PATH = path.resolve(__dirname, 'golden', 'baseline-snapshot.json');

export function buildCurrentSnapshot() {
  const s3 = new PadicSpace(3, 3);
  const monnaP3N3 = Array.from(s3.revTable);
  const vladP3N3A1 = Array.from(s3.vladimirovSpectrum(1.0));

  const btzCurvatures = {};
  for (const [p, n, h] of [[3, 4, 1], [2, 5, 2], [5, 3, 1], [7, 3, 1], [3, 5, 2]]) {
    const bulk = new BruhatTitsBulk(new PadicSpace(p, n), h);
    btzCurvatures[`p${p}_L${bulk.horizonLength}`] = Number(bulk.ricciCurvature[bulk.horizonEdges[0]].toFixed(12));
  }

  // Deterministic curved AdS Gauss-Bonnet single + 2-edge check
  const bGB = new BruhatTitsBulk(new PadicSpace(3, 5), 0);
  const kappaAdS = (-2 * (3 - 1)) / (3 + 1);
  const interiorEdges = [];
  for (let ei = 0; ei < bGB.numEdges; ei++) {
    const e = bGB.edges[ei];
    if (bGB.nodeDepth[e.u] >= 2 && bGB.nodeDepth[e.v] <= 3) interiorEdges.push(ei);
  }
  bGB.sigma[interiorEdges[0]] = 1.1;   // stretch
  bGB.sigma[interiorEdges[1]] = -1.8;  // supercritical pinch
  bGB._syncWeights();
  bGB.computeOllivierRicci();
  let gbExcess = 0;
  for (let ei = 0; ei < bGB.numEdges; ei++) {
    const e = bGB.edges[ei];
    if (bGB.nodeDepth[e.u] >= 1 && !bGB.isLeaf[e.v]) {
      gbExcess += bGB.ricciCurvature[ei] - kappaAdS;
    }
  }

  // Deterministic RT cut on p=3, n=4, BTZ h=2 (L=9) at 50% contiguous region
  const bRT = new BruhatTitsBulk(new PadicSpace(3, 4), 2);
  const reg = new Uint8Array(bRT.N);
  for (let l = 0; l < 41; l++) reg[l] = 1;
  const rt = bRT.computeRyuTakayanagi(reg);

  return {
    schema: 'ultrametrica-golden-v1',
    monnaP3N3,
    vladP3N3A1,
    btzCurvatures,
    curvedTwoEdgeGaussBonnetExcess: Number(gbExcess.toFixed(12)),
    btzRT_p3_n4_41leaves: {
      entropy: Number(rt.entropy.toFixed(12)),
      cutCount: rt.cutCount,
      touchesHorizon: rt.touchesHorizon,
    },
  };
}

if (process.argv.includes('--update-golden')) {
  fs.mkdirSync(path.dirname(GOLDEN_PATH), { recursive: true });
  fs.writeFileSync(GOLDEN_PATH, `${JSON.stringify(buildCurrentSnapshot(), null, 2)}\n`, 'utf8');
  console.log(`Updated golden snapshot: ${GOLDEN_PATH}`);
  process.exit(0);
}

test('B08 Golden Snapshot: Deterministic Monna, Vladimirov, BTZ Curvature, Multi-Edge Gauss-Bonnet & RT match pinned baseline', () => {
  assert.ok(fs.existsSync(GOLDEN_PATH), `Missing golden file: ${GOLDEN_PATH}`);
  const expected = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
  const actual = buildCurrentSnapshot();
  assert.deepEqual(actual, expected);
});

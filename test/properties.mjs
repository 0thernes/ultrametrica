/**
 * ULTRAMETRICA (v1.4.0) — Property-Based (B10), Negative Boundary (B06),
 * Metamorphic (B14), Determinism (B03), & Numeric Stability (B20) Test Suite.
 *
 * Uses a zero-dependency deterministic seeded `prop_check` harness running >= 1,000 cases
 * per core module to verify universal invariants beyond hand-picked examples.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import { PadicSpace } from '../src/engine/padic.js';
import { BruhatTitsBulk } from '../src/engine/holography.js';
import { PadicQuantumEngine } from '../src/engine/quantum.js';
import { UltrametricaSimulation } from '../src/engine/simulation.js';

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic seeded property-based test runner (`prop_check`).
 * Fails immediately with the exact failing trial index and seed for permanent regression pinning.
 */
export function prop_check(name, trials, seed, body) {
  const rng = mulberry32(seed);
  for (let i = 0; i < trials; i++) {
    try {
      body(rng, i);
    } catch (err) {
      err.message = `[prop_check:${name} failed at trial ${i}/${trials}, seed=${seed}] ${err.message}`;
      throw err;
    }
  }
}

test('B10 Property (PadicSpace, 1,200 cases): Ultrametric axioms, Monna involution, ball contiguity & FFT Parseval/linearity', () => {
  const spaces = [
    new PadicSpace(2, 5),
    new PadicSpace(3, 4),
    new PadicSpace(5, 3),
    new PadicSpace(7, 2),
  ];

  prop_check('padic_ultrametric_and_monna', 1200, 0x51a7c0de, (rng, trial) => {
    const s = spaces[trial % spaces.length];
    const a = Math.floor(rng() * s.N);
    const b = Math.floor(rng() * s.N);
    const c = Math.floor(rng() * s.N);

    // 1. Monna involution & complement commutation
    assert.equal(s.leafToPadic(s.padicToLeaf(a)), a);
    assert.equal(s.revTable[s.N - 1 - a], s.N - 1 - s.revTable[a]);

    // 2. Strong triangle inequality & universal isosceles property
    const tri = s.proveUltrametricTriangle(a, b, c);
    assert.equal(tri.strongTriangleHolds, true);
    assert.equal(tri.isIsosceles, true);
    assert.equal(s.leafDistance(a, b), s.leafDistance(b, a));
    assert.equal(s.leafDistance(a, a), 0);

    // 3. Ball contiguity: x == y (mod p^j) <=> floor(rev(x)/p^{n-j}) == floor(rev(y)/p^{n-j})
    const j = Math.floor(rng() * (s.n + 1));
    const pj = s.powP[j];
    const pnj = s.powP[s.n - j];
    const sameMod = (a % pj) === (b % pj);
    const sameSlice = Math.floor(s.revTable[a] / pnj) === Math.floor(s.revTable[b] / pnj);
    assert.equal(sameMod, sameSlice);
  });

  // FFT linearity & Parseval across 1,000 random complex vectors
  prop_check('radix_p_fft_linearity_parseval', 1000, 0xf177cafe, (rng, trial) => {
    const s = spaces[trial % spaces.length];
    const N = s.N;
    const aRe = new Float64Array(N);
    const aIm = new Float64Array(N);
    const bRe = new Float64Array(N);
    const bIm = new Float64Array(N);
    const cRe = new Float64Array(N);
    const cIm = new Float64Array(N);
    const faRe = new Float64Array(N), faIm = new Float64Array(N);
    const fbRe = new Float64Array(N), fbIm = new Float64Array(N);
    const fcRe = new Float64Array(N), fcIm = new Float64Array(N);
    const lam = rng() * 4 - 2;
    const mu = rng() * 4 - 2;
    let inNorm2 = 0;
    for (let i = 0; i < N; i++) {
      aRe[i] = rng() * 2 - 1; aIm[i] = rng() * 2 - 1;
      bRe[i] = rng() * 2 - 1; bIm[i] = rng() * 2 - 1;
      cRe[i] = lam * aRe[i] + mu * bRe[i];
      cIm[i] = lam * aIm[i] + mu * bIm[i];
      inNorm2 += cRe[i] ** 2 + cIm[i] ** 2;
    }
    s.fft(aRe, aIm, faRe, faIm);
    s.fft(bRe, bIm, fbRe, fbIm);
    s.fft(cRe, cIm, fcRe, fcIm);
    let outNorm2 = 0;
    for (let k = 0; k < N; k++) {
      const linErr = Math.hypot(fcRe[k] - (lam * faRe[k] + mu * fbRe[k]), fcIm[k] - (lam * faIm[k] + mu * fbIm[k]));
      assert.ok(linErr < 1e-10, `FFT linearity error ${linErr}`);
      outNorm2 += fcRe[k] ** 2 + fcIm[k] ** 2;
    }
    assert.ok(Math.abs(outNorm2 - inNorm2) < 1e-10, `Parseval mismatch ${Math.abs(outNorm2 - inNorm2)}`);
  });
});

test('B10 Property (BruhatTitsBulk, 1,000 cases): Global Multi-Edge Curved Gauss-Bonnet (Thm V-Global) & Holographic SSA (Thm VI)', () => {
  // 1. Global Multi-Edge Curved AdS Discrete Gauss-Bonnet across 1,000 random inhomogeneous multi-edge trees
  const treeConfigs = [
    [2, 6],
    [3, 5],
    [5, 4],
  ];
  const bulks = treeConfigs.map(([p, n]) => new BruhatTitsBulk(new PadicSpace(p, n), 0));

  prop_check('global_multi_edge_curved_gauss_bonnet', 1000, 0x6a055b00, (rng, trial) => {
    const bulk = bulks[trial % bulks.length];
    const p = bulk.p;
    const n = bulk.n;
    const kappaAdS = (-2 * (p - 1)) / (p + 1);

    // Perturb ALL strictly interior edges whose endpoints both have depth in [2, n - 2]
    // so EVERY edge touching any perturbed vertex has BOTH endpoints of full degree p + 1!
    bulk.sigma.fill(0);
    const mode = trial % 3; // 0: gentle subcritical stretches, 1: mixed subcritical, 2: strong supercritical pinches
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      const e = bulk.edges[ei];
      if (bulk.nodeDepth[e.u] >= 2 && bulk.nodeDepth[e.v] <= n - 2) {
        if (mode === 0) bulk.sigma[ei] = rng() * 2.4;             // pure stretches (guaranteed subcritical)
        else if (mode === 1) bulk.sigma[ei] = (rng() - 0.3) * 1.4; // moderate mixed
        else bulk.sigma[ei] = (rng() - 0.65) * 3.8;                // includes supercritical pinches!
      }
    }
    bulk._syncWeights();
    bulk.computeOllivierRicci();

    // Exact global prediction: sum_{e interior (deg u = deg v = p+1)} (kappa_e - kappa_AdS)
    // equals -2 * sum_{e supercritical} (w_e/W_u + w_e/W_v - 1)
    // when all perturbed edges stay strictly inside vertices whose neighbors are all degree p+1!
    const sumW = bulk._sumW;
    let measuredExcess = 0;
    let predictedDeficit = 0;
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      const e = bulk.edges[ei];
      if (bulk.nodeDepth[e.u] >= 1 && !bulk.isLeaf[e.v]) {
        measuredExcess += bulk.ricciCurvature[ei] - kappaAdS;
        const ratio = bulk.edgeWeight[ei] / sumW[e.u] + bulk.edgeWeight[ei] / sumW[e.v];
        if (ratio > 1.0) {
          predictedDeficit -= 2.0 * (ratio - 1.0);
        }
      }
    }
    const err = Math.abs(measuredExcess - predictedDeficit);
    assert.ok(
      err < 1e-11,
      `Global Multi-Edge Gauss-Bonnet mismatch (p=${p}, mode=${mode}): measured=${measuredExcess}, predicted=${predictedDeficit}, err=${err}`
    );
  });

  // 2. Universal Holographic Strong Subadditivity (SSA): S(AB) + S(BC) >= S(ABC) + S(B)
  //    AND Complement Symmetry S(A) == S(A^c) across 1,000 random weighted pure-AdS & BTZ graphs!
  const rtBulks = [
    new BruhatTitsBulk(new PadicSpace(2, 4), 0), // pure AdS
    new BruhatTitsBulk(new PadicSpace(3, 3), 0), // pure AdS
    new BruhatTitsBulk(new PadicSpace(2, 4), 2), // BTZ L=4
    new BruhatTitsBulk(new PadicSpace(3, 3), 1), // BTZ L=3
    new BruhatTitsBulk(new PadicSpace(5, 2), 1), // BTZ L=5
  ];

  prop_check('holographic_rt_ssa_and_symmetry', 1000, 0x55a01234, (rng, trial) => {
    const bulk = rtBulks[trial % rtBulks.length];
    const N = bulk.N;
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      bulk.sigma[ei] = (rng() - 0.5) * 2.6;
    }
    bulk._syncWeights();

    // Generate 3 disjoint boundary regions A, B, C (plus remainder D)
    const A = new Uint8Array(N);
    const B = new Uint8Array(N);
    const C = new Uint8Array(N);
    const AB = new Uint8Array(N);
    const BC = new Uint8Array(N);
    const ABC = new Uint8Array(N);
    const compAB = new Uint8Array(N);
    for (let l = 0; l < N; l++) {
      const bucket = Math.floor(rng() * 4);
      if (bucket === 0) A[l] = 1;
      else if (bucket === 1) B[l] = 1;
      else if (bucket === 2) C[l] = 1;
      AB[l] = A[l] | B[l];
      BC[l] = B[l] | C[l];
      ABC[l] = A[l] | B[l] | C[l];
      compAB[l] = 1 - AB[l];
    }

    const sAB = bulk.computeRyuTakayanagi(AB).entropy;
    const sBC = bulk.computeRyuTakayanagi(BC).entropy;
    const sABC = bulk.computeRyuTakayanagi(ABC).entropy;
    const sB = bulk.computeRyuTakayanagi(B).entropy;
    const sCompAB = bulk.computeRyuTakayanagi(compAB).entropy;

    // Theorem VI: Holographic Strong Subadditivity S(AB) + S(BC) >= S(ABC) + S(B)
    assert.ok(
      sAB + sBC + 1e-11 >= sABC + sB,
      `SSA VIOLATED: S(AB)+S(BC)=${sAB + sBC} < S(ABC)+S(B)=${sABC + sB}`
    );
    // Complement symmetry S(AB) == S((AB)^c)
    assert.ok(
      Math.abs(sAB - sCompAB) < 1e-11,
      `Complement symmetry violated: S(AB)=${sAB} != S(AB^c)=${sCompAB}`
    );
  });
});

test('B14 Metamorphic & B03 Determinism (PadicQuantumEngine, 1,000 steps / checks): U(1) gauge, time-reversibility & bit-exact determinism', () => {
  const space = new PadicSpace(3, 4);

  // 1. Metamorphic Relation 1: Global U(1) phase invariance psi -> e^{i*phi} psi leaves |psi(t)|^2 invariant
  prop_check('quantum_u1_phase_invariance', 200, 0x1111aaaa, (rng) => {
    const phi = rng() * 2 * Math.PI;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const re0 = new Float64Array(space.N);
    const im0 = new Float64Array(space.N);
    const re1 = new Float64Array(space.N);
    const im1 = new Float64Array(space.N);
    for (let i = 0; i < space.N; i++) {
      re0[i] = rng() * 2 - 1;
      im0[i] = rng() * 2 - 1;
      re1[i] = re0[i] * c - im0[i] * s;
      im1[i] = re0[i] * s + im0[i] * c;
    }
    const q0 = new PadicQuantumEngine(space);
    const q1 = new PadicQuantumEngine(space);
    q0.nonlinearity = 20.0; q1.nonlinearity = 20.0;
    q0.adelicMix = 0.65; q1.adelicMix = 0.65;
    q0.setState(re0, im0); q1.setState(re1, im1);
    q0.step(0.02, 2); q1.step(0.02, 2);
    for (let i = 0; i < space.N; i++) {
      const p0 = q0.psiRe[i] ** 2 + q0.psiIm[i] ** 2;
      const p1 = q1.psiRe[i] ** 2 + q1.psiIm[i] ** 2;
      assert.ok(Math.abs(p0 - p1) < 1e-12, `U(1) invariance failed: ${Math.abs(p0 - p1)}`);
    }
  });

  // 2. Metamorphic Relation 2: Exact Yoshida symplectic time-reversibility S_4(-dt) o S_4(+dt) = I
  prop_check('yoshida_time_reversibility', 200, 0x2222bbbb, (rng) => {
    const re0 = new Float64Array(space.N);
    const im0 = new Float64Array(space.N);
    for (let i = 0; i < space.N; i++) {
      re0[i] = rng() * 2 - 1;
      im0[i] = rng() * 2 - 1;
    }
    const q = new PadicQuantumEngine(space);
    q.nonlinearity = 15.0;
    q.adelicMix = 0.7;
    q.setState(re0, im0);
    const origRe = Float64Array.from(q.psiRe);
    const origIm = Float64Array.from(q.psiIm);
    q.step(0.015, 2);
    q.step(-0.015, 2);
    for (let i = 0; i < space.N; i++) {
      const err = Math.hypot(q.psiRe[i] - origRe[i], q.psiIm[i] - origIm[i]);
      assert.ok(err < 1e-12, `Time-reversibility failed: ${err}`);
    }
  });

  // 3. B03 Determinism Check: two independent runs produce bit-identical SHA-256 digests
  const runDigest = () => {
    const sim = new UltrametricaSimulation(3, 5, 2);
    sim.loadExperiment('btz_black_hole');
    for (let i = 0; i < 12; i++) sim.step(0.016);
    const h = crypto.createHash('sha256');
    h.update(Buffer.from(sim.quantum.psiRe.buffer));
    h.update(Buffer.from(sim.quantum.psiIm.buffer));
    h.update(Buffer.from(sim.bulk.phiRe.buffer));
    h.update(Buffer.from(sim.bulk.ricciCurvature.buffer));
    return h.digest('hex');
  };
  assert.equal(runDigest(), runDigest(), 'Simulation must be bit-for-bit deterministic');
});

test('B06 Negative Tests & B20 Numeric Edge-Value Guards: All invalid public inputs rejected loudly', () => {
  // PadicSpace constructor boundaries
  assert.throws(() => new PadicSpace(4, 3), RangeError);
  assert.throws(() => new PadicSpace(11, 2), RangeError);
  assert.throws(() => new PadicSpace(3, 1), RangeError);
  assert.throws(() => new PadicSpace(3, 2.5), RangeError);
  assert.throws(() => new PadicSpace(7, 8), RangeError); // exceeds 65536 safe cap

  const s = new PadicSpace(3, 4);
  assert.throws(() => s.leafToPadic(-1), RangeError);
  assert.throws(() => s.leafToPadic(s.N), RangeError);
  assert.throws(() => s.leafToPadic(1.5), RangeError);
  assert.throws(() => s.padicToLeaf(NaN), RangeError);
  assert.throws(() => s.vladimirovSpectrum(0), RangeError);
  assert.throws(() => s.vladimirovSpectrum(-1), RangeError);
  assert.throws(() => s.vladimirovSpectrum(NaN), RangeError);
  assert.throws(() => s.vladimirovSpectrum(Infinity), RangeError);
  assert.throws(() => s.vladimirovSpectrum(1000), RangeError); // F76 overflow guard
  assert.throws(() => s.archimedeanSpectrum(-0.5), RangeError);
  assert.throws(() => s.archimedeanSpectrum(1000), RangeError); // F76 overflow guard
  assert.throws(() => s.createKozyrevWavelet(-1, 0, 1), RangeError);
  assert.throws(() => s.createKozyrevWavelet(s.n, 0, 1), RangeError);
  assert.throws(() => s.createKozyrevWavelet(1.5, 0, 1), RangeError);
  assert.throws(() => s.createKozyrevWavelet(1, 0.5, 1), RangeError);
  assert.throws(() => s.fft(new Float64Array(4), new Float64Array(4), new Float64Array(4), new Float64Array(4)), RangeError);
  assert.throws(() => s.proveUltrametricTriangle(0, -1, 2), RangeError);

  // BruhatTitsBulk boundaries (including F02 regression: negative horizonDepth!)
  assert.throws(() => new BruhatTitsBulk(null, 0), TypeError);
  assert.throws(() => new BruhatTitsBulk(s, -1), RangeError);
  assert.throws(() => new BruhatTitsBulk(s, 1.5), RangeError);
  const b = new BruhatTitsBulk(s, 0);
  assert.throws(() => b.pinchEdge(0, NaN), RangeError);
  assert.throws(() => b.pinchEdge(0, Infinity), RangeError);
  assert.throws(() => b.solveBulkField(new Float64Array(3), new Float64Array(3)), RangeError);
  assert.throws(() => b.computeBoundaryPotential(new Float64Array(3), 1.0), RangeError); // F77 buffer length guard
  assert.throws(() => b.computeBoundaryPotential(new Float64Array(s.N), NaN), RangeError); // F77 non-finite strength
  assert.throws(() => b.computeBoundaryPotential(new Float64Array(s.N), Infinity), RangeError);
  assert.throws(() => b.shortestGeodesic(-1, 0), RangeError);
  assert.throws(() => b.shortestGeodesic(0, s.N), RangeError);

  // F75 regression: non-finite / singular Schur-complement pivot (corrupted NaN sigma -> D[c] = NaN) throws RangeError
  const bSing = new BruhatTitsBulk(new PadicSpace(3, 3), 0);
  bSing.sigma[0] = NaN;
  assert.throws(
    () => bSing.solveBulkField(new Float64Array(bSing.N), new Float64Array(bSing.N)),
    RangeError
  );

  // PadicQuantumEngine boundaries (including F94 constructor & computeDiagnostics guards)
  assert.throws(() => new PadicQuantumEngine(null), TypeError);
  const q = new PadicQuantumEngine(s);
  assert.throws(() => q.setAlpha(0), RangeError);
  assert.throws(() => q.setAlpha(-1), RangeError);
  assert.throws(() => q.setAlpha(NaN), RangeError);
  assert.throws(() => q.setState(new Float64Array(s.N), new Float64Array(s.N)), RangeError); // zero state
  assert.throws(() => q.setState(new Float64Array(3), new Float64Array(3)), RangeError);     // wrong length
  const nanVec = new Float64Array(s.N); nanVec[0] = NaN;
  assert.throws(() => q.setState(nanVec, new Float64Array(s.N)), RangeError);
  const unit = new Float64Array(s.N); unit[0] = 1;
  q.setState(unit, new Float64Array(s.N));
  assert.throws(() => q.step(NaN, 1), RangeError);
  assert.throws(() => q.step(Infinity, 1), RangeError);
  assert.throws(() => q.step(0.01, 0), RangeError);
  assert.throws(() => q.step(0.01, -2), RangeError);
  q.nonlinearity = NaN;
  assert.throws(() => q.computeDiagnostics(), RangeError);
  q.nonlinearity = 0;
  q.adelicMix = 1.5;
  assert.throws(() => q.computeDiagnostics(), RangeError);
  q.adelicMix = 1.0;

  // Simulation boundaries (including F93 custom-depth BTZ & step finiteness guards)
  const sim = new UltrametricaSimulation(3, 4, 0);
  assert.throws(() => sim.loadExperiment('nonexistent_experiment'), RangeError);
  sim.backreactionStrength = NaN;
  assert.throws(() => sim.step(0.01), RangeError);
  sim.backreactionStrength = 0;
  sim.newtonG = Infinity;
  assert.throws(() => sim.step(0.01), RangeError);
  sim.newtonG = 0;
  const simSmall = new UltrametricaSimulation(7, 2, 0);
  simSmall.setBTZEnabled(true);
  assert.equal(simSmall.bulk.isBTZ, true);
  assert.equal(simSmall.horizonDepth, 1);
});

test('B10/B20 Curved BTZ Horizon Optimal-Transport Stress (200 trials across p=2,3,5,7): Zero SPFA/Dijkstra negative-cycle crashes (F35)', () => {
  const cfgs = [
    [2, 5, 2],
    [3, 4, 1],
    [5, 3, 1],
    [7, 2, 1],
  ];
  const bulks = cfgs.map(([p, n, h]) => new BruhatTitsBulk(new PadicSpace(p, n), h));
  prop_check('curved_btz_wasserstein_stability', 200, 0xf350f350, (rng) => {
    const bulk = bulks[Math.floor(rng() * bulks.length)];
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      bulk.sigma[ei] = (rng() * 7.0) - 3.0; // extreme a_e in [e^-3, e^4] ~ [0.05, 54.6]
    }
    bulk._syncWeights();
    bulk.computeOllivierRicci();
    assert.ok(Number.isFinite(bulk.meanCurvature), `Non-finite meanCurvature=${bulk.meanCurvature}`);
    for (let j = 0; j < bulk.horizonEdges.length; j++) {
      const k = bulk.ricciCurvature[bulk.horizonEdges[j]];
      assert.ok(Number.isFinite(k) && k <= 1.0 + 1e-9, `Invalid horizon curvature k=${k}`);
    }
  });
});

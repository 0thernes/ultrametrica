import test from 'node:test';
import assert from 'node:assert/strict';

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

test('Theorem 1: Exact Radix-p Pontryagin FFT matches naive DFT & Parseval unitarity for p in {2,3,5,7}', () => {
  const cases = [
    [2, 5], // N = 32
    [3, 4], // N = 81
    [5, 3], // N = 125
    [7, 2], // N = 49
  ];
  const rng = mulberry32(1337);

  for (const [p, n] of cases) {
    const space = new PadicSpace(p, n);
    const N = space.N;
    const inRe = new Float64Array(N);
    const inIm = new Float64Array(N);
    let inNorm2 = 0;
    for (let x = 0; x < N; x++) {
      inRe[x] = rng() * 2 - 1;
      inIm[x] = rng() * 2 - 1;
      inNorm2 += inRe[x] ** 2 + inIm[x] ** 2;
    }

    const fftRe = new Float64Array(N);
    const fftIm = new Float64Array(N);
    space.fft(inRe, inIm, fftRe, fftIm);

    // Compare against O(N^2) naive unitary Pontryagin DFT
    const invSqrtN = 1 / Math.sqrt(N);
    let maxDftErr = 0;
    let outNorm2 = 0;
    for (let k = 0; k < N; k++) {
      let sRe = 0;
      let sIm = 0;
      for (let x = 0; x < N; x++) {
        const ang = (-2 * Math.PI * ((x * k) % N)) / N;
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        sRe += inRe[x] * c - inIm[x] * s;
        sIm += inRe[x] * s + inIm[x] * c;
      }
      sRe *= invSqrtN;
      sIm *= invSqrtN;
      maxDftErr = Math.max(maxDftErr, Math.hypot(fftRe[k] - sRe, fftIm[k] - sIm));
      outNorm2 += fftRe[k] ** 2 + fftIm[k] ** 2;
    }

    assert.ok(maxDftErr < 1e-11, `p=${p}, n=${n}: FFT vs naive DFT error ${maxDftErr}`);
    assert.ok(Math.abs(outNorm2 - inNorm2) < 1e-11, `p=${p}: Parseval drift ${Math.abs(outNorm2 - inNorm2)}`);

    // In-place inverse round-trip
    space.ifft(fftRe, fftIm, fftRe, fftIm);
    let maxRtErr = 0;
    for (let x = 0; x < N; x++) {
      maxRtErr = Math.max(maxRtErr, Math.hypot(fftRe[x] - inRe[x], fftIm[x] - inIm[x]));
    }
    assert.ok(maxRtErr < 1e-12, `p=${p}: IFFT(FFT(x)) round-trip error ${maxRtErr}`);
  }
});

test('Theorem 2: Kozyrev p-adic wavelets are strictly compact exact eigenfunctions of Vladimirov D_p^alpha', () => {
  const cases = [
    [2, 5, 0.85],
    [3, 4, 1.35],
    [5, 3, 0.73],
    [7, 2, 1.2],
  ];

  for (const [p, n, alpha] of cases) {
    const space = new PadicSpace(p, n);
    const N = space.N;
    const basis = [];

    // Constant mode (eigenvalue 0)
    const cRe = new Float64Array(N).fill(1 / Math.sqrt(N));
    const cIm = new Float64Array(N);
    basis.push({ re: cRe, im: cIm, lambda: 0 });

    const outRe = new Float64Array(N);
    const outIm = new Float64Array(N);

    for (let j = 0; j < n; j++) {
      const numBalls = p ** j;
      for (let b = 0; b < numBalls; b++) {
        for (let m = 1; m < p; m++) {
          const w = space.createKozyrevWavelet(j, b, m);
          const expectedLambda = p ** (alpha * (j + 1));

          // 1. Strict compact support outside [leafStart, leafEnd)
          for (let l = 0; l < N; l++) {
            if (l < w.leafStart || l >= w.leafEnd) {
              const x = space.leafToPadic(l);
              assert.equal(w.re[x], 0);
              assert.equal(w.im[x], 0);
            }
          }

          // 2. Exact Vladimirov eigenfunction D_p^alpha psi = p^{alpha*(j+1)} psi
          space.applyVladimirov(w.re, w.im, alpha, outRe, outIm);
          let maxEigErr = 0;
          for (let x = 0; x < N; x++) {
            const err = Math.hypot(outRe[x] - expectedLambda * w.re[x], outIm[x] - expectedLambda * w.im[x]);
            if (err > maxEigErr) maxEigErr = err;
          }
          assert.ok(
            maxEigErr < 1e-10 * Math.max(1, expectedLambda),
            `p=${p}, j=${j}, b=${b}, m=${m}: eigenfunction error ${maxEigErr}`
          );

          // 3. Fast Kozyrev Transform places 100% of energy in exact shell j+1
          const kt = space.kozyrevTransform(w.re, w.im);
          for (let s = 0; s <= n; s++) {
            const expectedPower = s === j + 1 ? 1.0 : 0.0;
            assert.ok(
              Math.abs(kt.shellPower[s] - expectedPower) < 1e-12,
              `p=${p}, j=${j}: Kozyrev transform shell ${s} got ${kt.shellPower[s]}, expected ${expectedPower}`
            );
          }

          if (basis.length < 64) {
            basis.push({ re: w.re, im: w.im, lambda: expectedLambda });
          }
        }
      }
    }

    // 4. Verify complete orthonormality <psi_a | psi_b> = delta_{ab}
    for (let a = 0; a < basis.length; a++) {
      for (let b = a; b < basis.length; b++) {
        let dotRe = 0;
        let dotIm = 0;
        for (let x = 0; x < N; x++) {
          dotRe += basis[a].re[x] * basis[b].re[x] + basis[a].im[x] * basis[b].im[x];
          dotIm += basis[a].re[x] * basis[b].im[x] - basis[a].im[x] * basis[b].re[x];
        }
        const expected = a === b ? 1 : 0;
        assert.ok(Math.hypot(dotRe - expected, dotIm) < 1e-12, `Orthonormality failure (${a}, ${b})`);
      }
    }
  }
});

test('Theorem 3: Strong triangle inequality, universal isosceles property, & Bruhat-Tits tree isometry', () => {
  const rng = mulberry32(4242);
  for (const [p, n] of [[2, 6], [3, 4], [5, 3], [7, 2]]) {
    const space = new PadicSpace(p, n);
    const bulk = new BruhatTitsBulk(space, 0);

    for (let trial = 0; trial < 300; trial++) {
      const a = Math.floor(rng() * space.N);
      const b = Math.floor(rng() * space.N);
      const c = Math.floor(rng() * space.N);
      const proof = space.proveUltrametricTriangle(a, b, c);
      assert.equal(proof.strongTriangleHolds, true);
      assert.equal(proof.isIsosceles, true);

      if (trial < 25) {
        const geo = bulk.shortestGeodesic(a, b);
        assert.equal(
          geo.hops,
          proof.treeHops.treeAB,
          `p=${p}: tree geodesic hops ${geo.hops} != ultrametric 2*(n - v_p) = ${proof.treeHops.treeAB}`
        );
      }
    }
  }
});

test('Theorem 4: 4th-order Yoshida conservation, dt^4 scaling, & Kozyrev Trap vs Archimedean explosion', () => {
  const space = new PadicSpace(3, 4); // N = 81
  const rng = mulberry32(99);
  const initRe = new Float64Array(space.N);
  const initIm = new Float64Array(space.N);
  const pot = new Float64Array(space.N);
  for (let i = 0; i < space.N; i++) {
    initRe[i] = rng() - 0.5;
    initIm[i] = rng() - 0.5;
    pot[i] = Math.sin(i * 0.37) * 1.5;
  }

  // Test 4th-order energy drift scaling: halving dt should reduce energy error by ~16x
  const runEnergyDrift = (dt, steps) => {
    const q = new PadicQuantumEngine(space);
    q.setAlpha(1.0);
    q.nonlinearity = 25.0;
    q.adelicMix = 1.0;
    q.setPotentialLeaf(pot);
    q.setState(initRe, initIm);
    const e0 = q.energyPadic;
    let maxDrift = 0;
    for (let s = 0; s < steps; s++) {
      q.step(dt, 1);
      maxDrift = Math.max(maxDrift, Math.abs(q.energyPadic - e0));
    }
    return { maxDrift, normDrift: q.normDriftPadic };
  };

  const coarse = runEnergyDrift(0.02, 50);
  const fine = runEnergyDrift(0.01, 100);
  assert.ok(coarse.normDrift < 1e-12, `Coarse norm drift ${coarse.normDrift}`);
  assert.ok(fine.normDrift < 1e-12, `Fine norm drift ${fine.normDrift}`);
  const orderRatio = coarse.maxDrift / Math.max(fine.maxDrift, 1e-16);
  assert.ok(
    orderRatio > 13.5,
    `Expected ~16x 4th-order Yoshida scaling ratio, got ${orderRatio.toFixed(2)} (coarse=${coarse.maxDrift}, fine=${fine.maxDrift})`
  );

  // Adelic hybrid unitarity check
  const qAdelic = new PadicQuantumEngine(space);
  qAdelic.nonlinearity = 30.0;
  qAdelic.adelicMix = 0.55;
  qAdelic.setPotentialLeaf(pot);
  qAdelic.setState(initRe, initIm);
  for (let s = 0; s < 80; s++) qAdelic.step(0.015, 1);
  assert.ok(qAdelic.normDriftPadic < 1e-12, `Adelic hybrid norm drift ${qAdelic.normDriftPadic}`);

  // Kozyrev Trap vs Archimedean R Twin experiment
  const sim = new UltrametricaSimulation(3, 5, 0);
  sim.loadExperiment('kozyrev_trap');
  for (let s = 0; s < 120; s++) sim.step(0.02);
  assert.ok(
    sim.quantum.leakagePadic < 1e-12,
    `Kozyrev wavelet leaked ${sim.quantum.leakagePadic} in linear Q_p (expected < 1e-12)!`
  );
  assert.ok(
    sim.quantum.leakageTwin > 0.45,
    `Archimedean R twin only leaked ${sim.quantum.leakageTwin} (expected > 0.45)!`
  );
});

test('Theorem 5: Exact O(V) Schur + Sherman-Morrison bulk Klein-Gordon solver on curved AdS & Rotating BTZ', () => {
  const rng = mulberry32(2026);
  const configs = [
    { p: 3, n: 5, h: 0, delta: 1.5, flux: 0 },       // Pure Bruhat-Tits AdS
    { p: 3, n: 5, h: 0, delta: 0.65, flux: 0 },      // Tachyonic BF window (m^2 < 0)!
    { p: 3, n: 4, h: 1, delta: 1.4, flux: 1.73 },    // BTZ L = 3 rotating triangle ring
    { p: 3, n: 5, h: 2, delta: 1.35, flux: 2.1 },    // BTZ L = 9 rotating ring
    { p: 2, n: 6, h: 2, delta: 1.6, flux: -1.4 },    // BTZ L = 4 rotating ring
    { p: 5, n: 3, h: 1, delta: 1.25, flux: 0.9 },    // BTZ L = 5 rotating ring
    { p: 7, n: 2, h: 1, delta: 1.5, flux: 2.4 },     // BTZ L = 7 rotating ring
  ];

  for (const cfg of configs) {
    const space = new PadicSpace(cfg.p, cfg.n);
    const bulk = new BruhatTitsBulk(space, cfg.h);
    bulk.delta = cfg.delta;
    bulk.horizonFlux = cfg.flux;

    // Random inhomogeneous gravitational curvature on every edge!
    for (let e = 0; e < bulk.numEdges; e++) {
      bulk.sigma[e] = (rng() - 0.5) * 2.2;
    }

    const bRe = new Float64Array(space.N);
    const bIm = new Float64Array(space.N);
    for (let l = 0; l < space.N; l++) {
      bRe[l] = rng() * 2 - 1;
      bIm[l] = rng() * 2 - 1;
    }

    bulk.solveBulkField(bRe, bIm);
    assert.ok(
      bulk.maxResidual < 1e-11,
      `Config ${JSON.stringify(cfg)}: bulk Klein-Gordon residual ${bulk.maxResidual} >= 1e-11`
    );
  }
});

test('Theorem 6: Pure AdS bulk solver matches Gubser exact analytic bulk-to-boundary propagator to 1e-12', () => {
  for (const [p, n, delta] of [[3, 4, 1.35], [2, 5, 1.6], [5, 3, 1.2]]) {
    const space = new PadicSpace(p, n);
    const bulk = new BruhatTitsBulk(space, 0);
    bulk.delta = delta;
    bulk.asymptoticRoot = true;

    // Exact analytic infinite-tree bulk-to-boundary propagator K_Delta(v, y)
    // sourced at boundary leaf yLeaf:
    //   K(v) = p^{d * Delta} if v is an ancestor of yLeaf (including yLeaf itself)
    //   K(v) = p^{-d * Delta} / R^{2 * Delta} where R = p^{-lcaDepth} is the ultrametric distance
    //        = p^{(2 * lcaDepth - d) * Delta}
    const yLeaf = Math.floor(space.N * 0.37);
    const analyticPhi = (u) => {
      const d = bulk.nodeDepth[u];
      const idx = bulk.nodeIndexInLevel[u];
      // Check how many top base-p digits match yLeaf
      const shift = space.powP[n - d];
      const yAncAtD = (yLeaf / shift) | 0;
      if (idx === yAncAtD) {
        return p ** (d * delta);
      }
      // Find lowest common ancestor depth lca < d
      let a = idx;
      let b = yAncAtD;
      let lca = d;
      while (a !== b) {
        a = (a / p) | 0;
        b = (b / p) | 0;
        lca--;
      }
      return p ** ((2 * lca - d) * delta);
    };

    // Set exact boundary values on depth-n leaves
    const bRe = new Float64Array(space.N);
    const bIm = new Float64Array(space.N);
    const scale = p ** (-n * delta); // normalize peak to 1
    for (let l = 0; l < space.N; l++) {
      bRe[l] = analyticPhi(bulk.leafNodes[l]) * scale;
    }

    bulk.solveBulkField(bRe, bIm);

    let maxPropErr = 0;
    for (let u = 0; u < bulk.numNodes; u++) {
      const exact = analyticPhi(u) * scale;
      maxPropErr = Math.max(maxPropErr, Math.abs(bulk.phiRe[u] - exact), Math.abs(bulk.phiIm[u]));
    }
    assert.ok(
      maxPropErr < 1e-12,
      `p=${p}, Delta=${delta}: Gubser propagator mismatch ${maxPropErr}`
    );
  }
});

test('Theorem 7: Exact Ollivier-Ricci curvature equals -2*(p-1)/(p+1) on pure Bruhat-Tits T_p & handles BTZ shortcuts', () => {
  for (const [p, n] of [[2, 5], [3, 4], [5, 3], [7, 3]]) {
    const space = new PadicSpace(p, n);
    const bulk = new BruhatTitsBulk(space, 0);
    const expected = (-2 * (p - 1)) / (p + 1);

    // Every internal edge between depth >= 1 and depth <= n-1 has both endpoints of degree p+1
    let checked = 0;
    for (let ei = 0; ei < bulk.numEdges; ei++) {
      const e = bulk.edges[ei];
      if (bulk.nodeDepth[e.u] >= 1 && !bulk.isLeaf[e.v]) {
        const diff = Math.abs(bulk.ricciCurvature[ei] - expected);
        assert.ok(
          diff < 1e-13,
          `p=${p}: edge ${ei} Ollivier-Ricci ${bulk.ricciCurvature[ei]} != ${expected}`
        );
        checked++;
      }
    }
    assert.ok(checked > 0);
  }

  // On a uniform BTZ triangle ring (p=3, h=1 -> L=3), each horizon vertex has degree 5 (2 ring + 3 children).
  // Exact optimal transport between mu_u (on {v, w, c1, c2, c3}) and mu_v (on {u, w, d1, d2, d3}):
  //   w -> w (1/5, cost 0), v -> d1 (1/5, cost 1), c1 -> u (1/5, cost 1),
  //   c2 -> d2 (1/5, cost 3), c3 -> d3 (1/5, cost 3) => W_1 = 8/5 = 1.6 => kappa = 1 - 1.6 = -0.6!
  const space3 = new PadicSpace(3, 3);
  const btz3 = new BruhatTitsBulk(space3, 1);
  for (let j = 0; j < 3; j++) {
    const ei = btz3.horizonEdges[j];
    assert.ok(
      Math.abs(btz3.ricciCurvature[ei] - -0.6) < 1e-12,
      `BTZ L=3 exact triangle-ring curvature expected -0.6, got ${btz3.ricciCurvature[ei]}`
    );
  }
});

test('Theorem 8: Exact O(V) Tree/Cycle DP Ryu-Takayanagi min-cut matches brute-force partition & Page transition', () => {
  const rng = mulberry32(777);

  const bruteForceMinCut = (bulk, regionA) => {
    const internal = [];
    for (let u = 0; u < bulk.numNodes; u++) {
      if (!bulk.isLeaf[u]) internal.push(u);
    }
    const K = internal.length;
    assert.ok(K <= 14, `Brute-force test too large: K=${K}`);

    const side = new Uint8Array(bulk.numNodes);
    for (let l = 0; l < bulk.N; l++) side[bulk.leafNodes[l]] = regionA[l];
    const lnP = Math.log(bulk.p);

    let best = Infinity;
    const totalMasks = 1 << K;
    for (let mask = 0; mask < totalMasks; mask++) {
      for (let i = 0; i < K; i++) {
        side[internal[i]] = (mask >> i) & 1;
      }
      let cut = 0;
      for (let ei = 0; ei < bulk.numEdges; ei++) {
        const e = bulk.edges[ei];
        if (side[e.u] !== side[e.v]) {
          cut += bulk.edgeWeight[ei] * lnP;
        }
      }
      if (cut < best) best = cut;
    }
    return best;
  };

  // Test 1: Pure AdS tree (p=2, n=3 -> 7 internal nodes) with random inhomogeneous weights
  const sTree = new PadicSpace(2, 3);
  const bTree = new BruhatTitsBulk(sTree, 0);
  for (let trial = 0; trial < 15; trial++) {
    for (let e = 0; e < bTree.numEdges; e++) bTree.sigma[e] = (rng() - 0.5) * 2.5;
    bTree._syncWeights();
    const reg = new Uint8Array(sTree.N);
    for (let l = 0; l < sTree.N; l++) reg[l] = rng() > 0.5 ? 1 : 0;
    const dpRes = bTree.computeRyuTakayanagi(reg);
    const bf = bruteForceMinCut(bTree, reg);
    assert.ok(Math.abs(dpRes.entropy - bf) < 1e-11, `Tree RT DP ${dpRes.entropy} != brute-force ${bf}`);
  }

  // Test 2: BTZ black hole unicyclic graph (p=2, n=4, h=2 -> L=4 ring, 12 internal nodes -> 4096 masks)
  const sBtz = new PadicSpace(2, 4);
  const bBtz = new BruhatTitsBulk(sBtz, 2);
  for (let trial = 0; trial < 15; trial++) {
    for (let e = 0; e < bBtz.numEdges; e++) bBtz.sigma[e] = (rng() - 0.5) * 2.5;
    bBtz._syncWeights();
    const reg = new Uint8Array(sBtz.N);
    for (let l = 0; l < sBtz.N; l++) reg[l] = rng() > 0.5 ? 1 : 0;
    const dpRes = bBtz.computeRyuTakayanagi(reg);
    const bf = bruteForceMinCut(bBtz, reg);
    assert.ok(Math.abs(dpRes.entropy - bf) < 1e-11, `BTZ RT DP ${dpRes.entropy} != brute-force ${bf}`);
  }

  // Test 3: Horizon entanglement-wedge Page phase transition on BTZ black hole (p=3, n=4, h=2 -> L=9)
  const sim = new UltrametricaSimulation(3, 4, 2);
  sim.loadExperiment('page_transition');
  assert.equal(sim.bulk.isBTZ, true);
  sim.setRTRegionFraction(0.05); // Strictly inside one subtree -> stays detached from BTZ horizon
  const smallTouches = sim.bulk.rtTouchesHorizon;
  sim.setRTRegionFraction(0.65); // Past Page threshold -> entanglement wedge engulfs BTZ horizon ring!
  const largeTouches = sim.bulk.rtTouchesHorizon;
  assert.equal(smallTouches, false, 'Small boundary region should not include BTZ horizon');
  assert.equal(largeTouches, true, 'Large boundary region past Page threshold must include BTZ horizon');
});

test('Theorem 9: Adelic Valuation-Residue Block Decomposition & Unified BTZ Ollivier-Ricci Curvature Law', () => {
  // Part A: Exact recursive valuation-residue sector invariance of Monna-conjugated Vladimirov operator
  // F * (R_p * D_p^alpha * R_p) * F^* has ZERO matrix elements between distinct (v_p(k), (k/p^v) mod p) sectors
  for (const [p, n] of [[2, 5], [3, 4], [5, 3], [7, 2]]) {
    const s = new PadicSpace(p, n);
    const N = s.N;
    const q = new PadicQuantumEngine(s);
    const sector = (k) => {
      if (k === 0) return '0:0';
      const v = s.valuationTable[k];
      const m = Math.floor(k / (p ** v)) % p;
      return `${v}:${m}`;
    };

    const eR = new Float64Array(N);
    const eI = new Float64Array(N);
    const fR = new Float64Array(N);
    const fI = new Float64Array(N);
    const oR = new Float64Array(N);
    const oI = new Float64Array(N);

    let maxCrossBlock = 0;
    for (let k = 0; k < N; k++) {
      const sk = sector(k);
      eR.fill(0); eI.fill(0); eR[k] = 1;
      s.ifft(eR, eI, oR, oI);
      for (let i = 0; i < N; i++) { eR[i] = oR[s.revTable[i]]; eI[i] = oI[s.revTable[i]]; }
      s.fft(eR, eI, fR, fI);
      for (let m = 0; m < N; m++) { fR[m] *= q.vladimirovSpec[m]; fI[m] *= q.vladimirovSpec[m]; }
      s.ifft(fR, fI, oR, oI);
      for (let i = 0; i < N; i++) { eR[i] = oR[s.revTable[i]]; eI[i] = oI[s.revTable[i]]; }
      s.fft(eR, eI, fR, fI);
      for (let j = 0; j < N; j++) {
        if (sector(j) !== sk) {
          const mag = Math.hypot(fR[j], fI[j]);
          if (mag > maxCrossBlock) maxCrossBlock = mag;
        }
      }
    }
    assert.ok(
      maxCrossBlock < 1e-12,
      `p=${p}, n=${n}: cross-sector block leak ${maxCrossBlock} >= 1e-12`
    );
  }

  // Part B: Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law across L in {3, 4, 5, 7, 8, 9, 16}
  for (const [p, n, h] of [[3, 4, 1], [2, 5, 2], [5, 3, 1], [7, 3, 1], [2, 6, 3], [3, 5, 2], [2, 6, 4]]) {
    const space = new PadicSpace(p, n);
    const bulk = new BruhatTitsBulk(space, h);
    const L = bulk.horizonLength;
    const expected = -(2 * p - Math.max(0, 6 - L)) / (p + 2);
    for (let j = 0; j < L; j++) {
      const got = bulk.ricciCurvature[bulk.horizonEdges[j]];
      assert.ok(
        Math.abs(got - expected) < 1e-12,
        `BTZ p=${p}, L=${L}: horizon kappa=${got} != unified law ${expected}`
      );
    }
  }
});

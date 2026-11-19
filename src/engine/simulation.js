/**
 * ULTRAMETRICA — Coupled p-adic Holographic Universe Orchestrator.
 *
 * Couples:
 *   - PadicSpace (exact arithmetic, Radix-p FFT, Vladimirov D_p^alpha, Kozyrev wavelets)
 *   - PadicQuantumEngine (4th-order Yoshida symplectic Q_p / Adelic + R Twin)
 *   - BruhatTitsBulk (exact O(V) Schur+Sherman-Morrison bulk solver, rotating BTZ Tate curve,
 *                     Gubser-Marcolli dynamic edge-length gravity, exact Ollivier-Ricci curvature,
 *                     exact O(V) Ryu-Takayanagi minimal cut & entanglement wedge)
 */

import { PadicSpace } from './padic.js';
import { BruhatTitsBulk } from './holography.js';
import { PadicQuantumEngine } from './quantum.js';

export const PRIME_DEFAULTS = {
  2: { n: 8, btzDepth: 3 }, // N = 256 leaves, L = 8 BTZ horizon
  3: { n: 5, btzDepth: 2 }, // N = 243 leaves, L = 9 BTZ horizon
  5: { n: 4, btzDepth: 1 }, // N = 625 leaves, L = 5 BTZ horizon
  7: { n: 3, btzDepth: 1 }, // N = 343 leaves, L = 7 BTZ horizon
};

export const EXPERIMENTS = [
  {
    id: 'kozyrev_trap',
    name: 'Kozyrev Wavelet Trap',
    subtitle: 'Exact compact eigenstate impossible in R',
    description:
      'Injects a single Kozyrev p-adic wavelet into pure linear Q_p and its synchronized Euclidean R twin at identical kinetic energy. In R, Heisenberg uncertainty shreds the packet instantly; in Q_p, it stays 100.000% trapped inside a single ultrametric ball forever with zero leakage.',
  },
  {
    id: 'btz_black_hole',
    name: 'Kerr-BTZ Black Hole',
    subtitle: 'Tate curve T_p / p^{hZ} with frame-dragging',
    description:
      'Excises the Bruhat-Tits interior behind a closed horizon ring with rotational Aharonov-Bohm flux Omega. Boundary wavepackets fall to the horizon, circulate around the non-trivial homology cycle, and warp spacetime via Gubser-Marcolli dynamic edge-length gravity.',
  },
  {
    id: 'ultrametric_tunneling',
    name: 'Ultrametric Teleportation',
    subtitle: 'Nonlinear Gross-Pitaevskii bulk cascade',
    description:
      'Strong self-interaction g breaks exact Kozyrev localization, driving discontinuous non-local quantum tunneling through Bruhat-Tits bulk geodesics into cousin p-adic balls while launching real gravitational strain ripples across the tree.',
  },
  {
    id: 'adelic_fracture',
    name: 'Adelic Reality Fracture',
    subtitle: 'Non-commuting R + Q_p hybrid physics',
    description:
      'Sets the Adelic morph parameter theta = 0.55, evolving under the non-commuting sum of Euclidean (-Delta)^{alpha/2} and p-adic Vladimirov D_p^alpha. Waves diffract continuously along local neighbors while simultaneously teleporting across ultrametric gaps.',
  },
  {
    id: 'page_transition',
    name: 'RT Horizon Phase Transition',
    subtitle: 'Exact Ryu-Takayanagi entanglement wedge',
    description:
      'Computes the exact O(V) holographic minimal cut separating boundary region A from its complement on a rotating BTZ black hole. Sweep the RT fraction past the Page threshold to watch the golden minimal surface snap across the event horizon.',
  },
  {
    id: 'wormhole_surgery',
    name: 'ER=EPR Wormhole Surgery',
    subtitle: 'Pinched bulk throat & Ricci curvature spike',
    description:
      'Severs a major Bruhat-Tits bulk bridge by stretching its gravitational edge length a_e by 24x. Ollivier-Ricci curvature spikes across the throat, the RT minimal cut snaps onto the bottleneck, and gravitational redshift alters boundary quantum dynamics.',
  },
];

export class UltrametricaSimulation {
  constructor(p = 3, n = null, horizonDepth = 0) {
    const def = PRIME_DEFAULTS[p] || PRIME_DEFAULTS[3];
    this.p = p;
    this.n = n ?? def.n;
    this.horizonDepth = horizonDepth;

    this.gravityEnabled = true;
    this.backreactionStrength = 0.85;
    this.newtonG = 1.4;
    this.timeScale = 1.0;
    this.paused = false;

    this.activeExperiment = 'kozyrev_trap';
    this.rtFraction = 0.38;
    this.triangleLeaves = [0, 0, 0];
    this.triangleProof = null;
    this.triangleGeodesics = [];

    this._initUniverse(this.p, this.n, this.horizonDepth);
    this.loadExperiment('kozyrev_trap');
  }

  _initUniverse(p, n, horizonDepth) {
    this.p = p;
    this.n = n;
    this.space = new PadicSpace(p, n);
    this.bulk = new BruhatTitsBulk(this.space, horizonDepth);
    this.horizonDepth = this.bulk.horizonDepth;
    this.quantum = new PadicQuantumEngine(this.space);
    this._potScratch = new Float64Array(this.space.N);

    // Default ultrametric triangle probe: 3 distinct leaves in 2 sibling balls + 1 distant ball
    const N = this.space.N;
    const step = Math.max(1, (N / (p * p)) | 0);
    this.triangleLeaves = [
      Math.min(N - 1, Math.floor(step * 0.2)),
      Math.min(N - 1, Math.floor(step * 1.4)),
      Math.min(N - 1, Math.floor(N * 0.62)),
    ];

    this.setRTRegionFraction(this.rtFraction);
    this.updateTriangleProof();
  }

  /** Rebuild the universe with a new prime p, depth n, or BTZ horizon depth h. */
  reconfigure({ p = this.p, n = null, horizonDepth = this.horizonDepth } = {}) {
    const def = PRIME_DEFAULTS[p] || PRIME_DEFAULTS[3];
    const targetN = n ?? def.n;
    const prevExp = this.activeExperiment;
    this._initUniverse(p, targetN, horizonDepth);

    // Preserve active physics flavor cleanly
    if (prevExp === 'btz_black_hole' || prevExp === 'page_transition') {
      this.loadExperiment(prevExp, { keepTopology: true });
    } else {
      this.loadExperiment(prevExp, { keepTopology: true });
    }
  }

  setBTZEnabled(enabled) {
    const def = PRIME_DEFAULTS[this.p] || PRIME_DEFAULTS[3];
    const targetH = enabled ? def.btzDepth : 0;
    if (targetH === this.horizonDepth) return;
    this.bulk = new BruhatTitsBulk(this.space, targetH);
    this.horizonDepth = this.bulk.horizonDepth;
    this.bulk.delta = 1.4;
    this.bulk.horizonFlux = enabled ? 1.85 : 0;
    this.setRTRegionFraction(this.rtFraction);
    this.syncBulkAndMetrics();
    this.updateTriangleProof();
  }

  /** Load one of the 6 curated alien physics experiments. */
  loadExperiment(id, { keepTopology = false } = {}) {
    this.activeExperiment = id;
    const def = PRIME_DEFAULTS[this.p] || PRIME_DEFAULTS[3];

    let targetH = this.horizonDepth;
    if (!keepTopology) {
      if (id === 'btz_black_hole' || id === 'page_transition') {
        targetH = def.btzDepth;
      } else {
        targetH = 0;
      }
      if (targetH !== this.horizonDepth) {
        this.bulk = new BruhatTitsBulk(this.space, targetH);
        this.horizonDepth = this.bulk.horizonDepth;
      }
    }

    this.bulk.resetGravity();
    this.quantum.potentialLeaf.fill(0);
    this.quantum.potentialPadic.fill(0);

    const p = this.p;
    const n = this.n;
    const jMid = Math.max(1, Math.min(n - 2, 2));
    const numBallsMid = p ** jMid;

    if (id === 'kozyrev_trap') {
      this.quantum.setAlpha(1.0);
      this.quantum.nonlinearity = 0.0;
      this.quantum.adelicMix = 1.0;
      this.gravityEnabled = false;
      this.backreactionStrength = 0.0;
      this.newtonG = 0.0;
      this.bulk.delta = 1.5;
      this.bulk.horizonFlux = 0.0;

      const ballIdx = Math.min(numBallsMid - 1, Math.max(1, Math.floor(numBallsMid * 0.25)));
      const w = this.space.createKozyrevWavelet(jMid, ballIdx, 1);
      this.quantum.setState(w.re, w.im, w.leafStart, w.leafEnd);
      this.setRTRegionBall(jMid, ballIdx);
    } else if (id === 'btz_black_hole') {
      this.quantum.setAlpha(1.05);
      this.quantum.nonlinearity = 65.0;
      this.quantum.adelicMix = 1.0;
      this.gravityEnabled = true;
      this.backreactionStrength = 0.95;
      this.newtonG = 2.1;
      this.bulk.delta = 1.2;
      this.bulk.horizonFlux = 1.95;

      // Chiral multi-scale boundary pulse with azimuthal winding phase around the BTZ horizon
      // so energy penetrates deep to the horizon ring and drives strong circulating horizon flux J!
      const L = this.bulk.horizonLength;
      const N = this.space.N;
      const rev = this.space.revTable;
      const re = new Float64Array(N);
      const im = new Float64Array(N);
      const sectorSize = (N / L) | 0;
      for (let l = 0; l < N; l++) {
        const sec = Math.min(L - 1, (l / sectorSize) | 0);
        const ang = (2 * Math.PI * sec) / L;
        // Localized multi-sector asymmetric envelope + chiral winding phase + fine wavelet ripple
        const env = 0.35 + 0.65 * Math.exp(-Math.pow(Math.sin(0.5 * (ang - 0.9)), 2) * 3.8);
        const fine = 1.0 + 0.45 * Math.cos((2 * Math.PI * (l % sectorSize)) / Math.max(1, sectorSize) * this.p);
        const amp = env * fine;
        const phase = ang * 1.0 + 0.55 * Math.sin(ang * 2.0);
        const x = rev[l];
        re[x] = amp * Math.cos(phase);
        im[x] = amp * Math.sin(phase);
      }
      this.quantum.setState(re, im, 0, Math.min(N, sectorSize * 2));
      this.setRTRegionFraction(0.42);
    } else if (id === 'ultrametric_tunneling') {
      this.quantum.setAlpha(1.0);
      this.quantum.nonlinearity = 165.0;
      this.quantum.adelicMix = 1.0;
      this.gravityEnabled = true;
      this.backreactionStrength = 1.4;
      this.newtonG = 1.9;
      this.bulk.delta = 1.3;
      this.bulk.horizonFlux = 0.0;

      // Multi-scale non-uniform superposition strictly inside ONE depth-1 p-adic ball
      // (non-uniform |psi|^2 breaks exact Kozyrev soliton trapping -> violent discontinuous tunneling!)
      const b1 = 0;
      const w1 = this.space.createKozyrevWavelet(1, b1, 1);
      const w2 = this.space.createKozyrevWavelet(Math.min(n - 1, 2), b1 * p + 1, Math.min(p - 1, 2));
      const w3 = this.space.createKozyrevWavelet(Math.min(n - 1, 3), (b1 * p + 1) * p + 0, 1);
      const re = new Float64Array(this.space.N);
      const im = new Float64Array(this.space.N);
      for (let i = 0; i < this.space.N; i++) {
        re[i] = 0.64 * w1.re[i] + 0.54 * w2.re[i] - 0.35 * w3.im[i];
        im[i] = 0.64 * w1.im[i] + 0.54 * w2.im[i] + 0.35 * w3.re[i];
      }
      this.quantum.setState(re, im, w1.leafStart, w1.leafEnd);
      this.setRTRegionBall(1, b1);
    } else if (id === 'adelic_fracture') {
      this.quantum.setAlpha(1.05);
      this.quantum.nonlinearity = 30.0;
      this.quantum.adelicMix = 0.55; // Non-commuting hybrid R + Q_p!
      this.gravityEnabled = true;
      this.backreactionStrength = 0.7;
      this.newtonG = 1.2;
      this.bulk.delta = 1.5;
      this.bulk.horizonFlux = 0.0;

      const ballIdx = Math.floor(numBallsMid * 0.4);
      const w = this.space.createKozyrevWavelet(jMid, ballIdx, 1);
      this.quantum.setState(w.re, w.im, w.leafStart, w.leafEnd);
      this.setRTRegionBall(jMid, ballIdx);
    } else if (id === 'page_transition') {
      this.quantum.setAlpha(1.0);
      this.quantum.nonlinearity = 40.0;
      this.quantum.adelicMix = 1.0;
      this.gravityEnabled = true;
      this.backreactionStrength = 0.6;
      this.newtonG = 1.1;
      this.bulk.delta = 1.4;
      this.bulk.horizonFlux = 1.35;

      const jA = Math.max(1, Math.min(n - 1, this.horizonDepth + 1));
      const w = this.space.createKozyrevWavelet(jA, 1, 1);
      this.quantum.setState(w.re, w.im, w.leafStart, w.leafEnd);
      // Set RT fraction right past the Page transition so horizon wraps immediately
      this.setRTRegionFraction(0.56);
    } else if (id === 'wormhole_surgery') {
      this.quantum.setAlpha(1.0);
      this.quantum.nonlinearity = 85.0;
      this.quantum.adelicMix = 1.0;
      this.gravityEnabled = true;
      this.backreactionStrength = 1.5;
      this.newtonG = 1.4;
      this.bulk.delta = 1.35;
      this.bulk.horizonFlux = 0.0;

      // Sever / pinch a depth-1 bulk bridge strongly (a_e -> e^3.2 ~ 24.5x!)
      const depth1Off = this.bulk.levelOffset[1];
      const targetNode = depth1Off + 0;
      const bridgeEdge = this.bulk.parentEdge[targetNode];
      if (bridgeEdge >= 0) {
        this.bulk.pinchEdge(bridgeEdge, 3.2);
      }

      const w1 = this.space.createKozyrevWavelet(1, 0, 1);
      const w2 = this.space.createKozyrevWavelet(jMid, Math.min(numBallsMid - 1, p), Math.min(p - 1, 2));
      const re = new Float64Array(this.space.N);
      const im = new Float64Array(this.space.N);
      for (let i = 0; i < this.space.N; i++) {
        re[i] = 0.78 * w1.re[i] + 0.62 * w2.re[i];
        im[i] = 0.78 * w1.im[i] + 0.62 * w2.im[i];
      }
      this.quantum.setState(re, im, w1.leafStart, w1.leafEnd);
      this.setRTRegionBall(1, 0);
    }

    this.syncBulkAndMetrics();
    this.updateTriangleProof();
  }

  /** Set Ryu-Takayanagi boundary region A to a single p-adic ball (j, ballIndex). */
  setRTRegionBall(j, ballIndex) {
    const N = this.space.N;
    const ballSize = this.space.powP[this.n - j];
    const start = ballIndex * ballSize;
    const end = Math.min(N, start + ballSize);
    const region = new Uint8Array(N);
    for (let l = start; l < end; l++) region[l] = 1;
    this.rtFraction = (end - start) / N;
    this.bulk.computeRyuTakayanagi(region);
  }

  /** Set Ryu-Takayanagi boundary region A to contiguous fraction f in [0, 1] of leaves. */
  setRTRegionFraction(frac) {
    const f = Math.max(0.02, Math.min(0.98, frac));
    this.rtFraction = f;
    const N = this.space.N;
    const count = Math.max(1, Math.min(N - 1, Math.round(f * N)));
    const region = new Uint8Array(N);
    for (let l = 0; l < count; l++) region[l] = 1;
    this.bulk.computeRyuTakayanagi(region);
  }

  /** Toggle a p-adic ball around clicked leaf in RT region A. */
  toggleRTRegionAtLeaf(leaf, scaleOffset = 2) {
    const j = Math.max(1, this.n - scaleOffset);
    const ballSize = this.space.powP[this.n - j];
    const b = (leaf / ballSize) | 0;
    const start = b * ballSize;
    const end = start + ballSize;
    const newVal = this.bulk.rtRegionA[leaf] ? 0 : 1;
    for (let l = start; l < end; l++) {
      this.bulk.rtRegionA[l] = newVal;
    }
    let count = 0;
    for (let l = 0; l < this.space.N; l++) count += this.bulk.rtRegionA[l];
    this.rtFraction = count / this.space.N;
    this.bulk.computeRyuTakayanagi(this.bulk.rtRegionA);
  }

  /** Inject a Kozyrev wavelet centered on any clicked bulk node or leaf! */
  injectAtNode(nodeId, characterM = 1, replace = false) {
    const depth = this.bulk.nodeDepth[nodeId];
    const idx = this.bulk.nodeIndexInLevel[nodeId];
    const j = Math.min(this.n - 1, Math.max(0, depth));
    const ballIndex = depth === this.n ? (idx / this.p) | 0 : idx;
    const w = this.quantum.injectKozyrevWavelet(j, ballIndex, characterM, 0.9, replace);
    this.syncBulkAndMetrics();
    return w;
  }

  /** Update the 3-point ultrametric triangle probe by cycling in a newly clicked leaf. */
  pushTriangleProbeLeaf(leaf) {
    this.triangleLeaves = [this.triangleLeaves[1], this.triangleLeaves[2], leaf];
    this.updateTriangleProof();
  }

  updateTriangleProof() {
    const [a, b, c] = this.triangleLeaves;
    this.triangleProof = this.space.proveUltrametricTriangle(a, b, c);
    this.triangleGeodesics = [
      this.bulk.shortestGeodesic(a, b),
      this.bulk.shortestGeodesic(b, c),
      this.bulk.shortestGeodesic(a, c),
    ];
  }

  /** Synchronize holographic bulk Klein-Gordon field, Ollivier-Ricci curvature, and RT cut. */
  syncBulkAndMetrics() {
    this.bulk.solveBulkField(this.quantum.leafRe, this.quantum.leafIm);
    this.bulk.computeOllivierRicci();
    this.bulk.computeRyuTakayanagi(this.bulk.rtRegionA);
  }

  /**
   * Advance the entire coupled holographic universe by dt seconds.
   */
  step(dt) {
    if (this.paused) return;
    const effDt = Math.min(dt, 0.035) * this.timeScale;
    if (effDt <= 0) return;

    // 1. Feed gravitational redshift potential from curved Bruhat-Tits bulk to boundary CFT
    if (this.gravityEnabled && this.backreactionStrength > 1e-6) {
      this.bulk.computeBoundaryPotential(this._potScratch, this.backreactionStrength * 4.5);
      this.quantum.setPotentialLeaf(this._potScratch);
    } else if (this.backreactionStrength > 1e-6) {
      // Even if dynamic gravity is off, user-pinched wormhole throats still exert static redshift!
      this.bulk.computeBoundaryPotential(this._potScratch, this.backreactionStrength * 4.5);
      this.quantum.setPotentialLeaf(this._potScratch);
    } else {
      this._potScratch.fill(0);
      this.quantum.setPotentialLeaf(this._potScratch);
    }

    // 2. Evolve boundary Q_p / Adelic state AND synchronized R Twin (4th-order Yoshida symplectic)
    const substeps = Math.abs(this.quantum.nonlinearity) > 60 ? 2 : 1;
    this.quantum.step(effDt, substeps);

    // 3. Solve exact bulk Klein-Gordon equation on curved Bruhat-Tits tree / rotating BTZ black hole
    this.bulk.solveBulkField(this.quantum.leafRe, this.quantum.leafIm);

    // 4. Advance Gubser-Heydeman-Jepsen-Marcolli dynamic edge-length gravity
    if (this.gravityEnabled && this.newtonG > 1e-6) {
      this.bulk.stepGravity(effDt, {
        newtonG: this.newtonG,
        stiffness: 2.2,
        coupling: 1.5,
        damping: 1.35,
      });
      // Re-solve bulk field on updated metric so residual stays ~1e-14 and curvature is exact
      this.bulk.solveBulkField(this.quantum.leafRe, this.quantum.leafIm);
    }

    // 5. Update exact Ollivier-Ricci curvature and Ryu-Takayanagi minimal cut
    this.bulk.computeOllivierRicci();
    this.bulk.computeRyuTakayanagi(this.bulk.rtRegionA);
  }
}

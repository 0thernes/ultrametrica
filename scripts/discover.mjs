/**
 * ULTRAMETRICA — Reproducible Scientific Discovery & Falsification Benchmark Suite (v1.8.0).
 *
 * Runs 8 exact quantitative experiments and writes reproducible JSON results to results/:
 *   Exp A: Full exact eigenspectrum & level-spacing statistics (<r>, IPR, commutator norm)
 *          of the non-commuting Monna-conjugated Adelic Hybrid Hamiltonian:
 *            H(theta) = theta * D_p^alpha + (1 - theta) * R_p * (-Delta_R)^{alpha/2} * R_p
 *   Exp B: Exhaustive numerical verification of the unified BTZ Ollivier-Ricci curvature law:
 *            kappa_BTZ(p, L) = -(2p - max(0, 6 - L)) / (p + 2)
 *          across p in {2, 3, 5, 7} and L in {3, 4, 5, 7, 8, 9, 16}.
 *   Exp C: Exact Nonlinear Kozyrev Compacton-Soliton Invariance vs. Multi-Scale Breakdown
 *          under the p-adic Gross-Pitaevskii equation across g in [0, 500].
 *   Exp D: Rotating Kerr-BTZ Aharonov-Bohm Horizon Flux Current J(Omega) & Energy Spectrum
 *          across Omega in [-pi, pi].
 *   Exp E: Large-N Single-Sector Complex Hermitian Intra-Block Spectral Statistics inside W_{0,m}
 *          (resolving Open Frontier #1 up to N = 625, dim(W_{0,m}) up to 128) via exact complex
 *          Hermitian Jacobi diagonalization.
 *   Exp F: Parametric Scaling of Multi-Scale Resonant Self-Trapping Peak g_*(p, alpha) vs.
 *          the Vladimirov Inter-Shell Eigenvalue Gap Delta_lambda = p^{2*alpha} - p^alpha.
 *   Exp G: Nonlinear Dispersion Spectrum alpha in {0.5, 1.0, 1.5, 2.0} Intra-Sector Contrast
 *          (testing quadratic Schrodinger dispersion alpha = 2.0 vs. linear picket-fence locking).
 *   Exp H: Theorem V Non-Perturbative Curved AdS Gauss-Bonnet Curvature Conservation,
 *          Supercritical Pinch Deficit (sigma_e < -ln p), & BF Tachyonic Stability Margin (Delta -> 0.5+).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PadicSpace } from '../src/engine/padic.js';
import { BruhatTitsBulk } from '../src/engine/holography.js';
import { PadicQuantumEngine } from '../src/engine/quantum.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.resolve(__dirname, '../results');

/**
 * Exact cyclic Jacobi symmetric eigensolver for dense real symmetric N x N matrix A.
 * Returns { eigenvalues (sorted ascending), eigenvectors (columns) }.
 */
function jacobiSymmetricEigen(Ain, N, maxSweeps = 80) {
  const A = new Float64Array(Ain);
  const V = new Float64Array(N * N);
  for (let i = 0; i < N; i++) V[i * N + i] = 1.0;

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let offNorm = 0;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const v = A[i * N + j];
        offNorm += v * v;
      }
    }
    if (Math.sqrt(offNorm) < 1e-12) break;

    for (let p = 0; p < N - 1; p++) {
      for (let q = p + 1; q < N; q++) {
        const apq = A[p * N + q];
        if (Math.abs(apq) < 1e-15) continue;

        const app = A[p * N + p];
        const aqq = A[q * N + q];
        const tau = (aqq - app) / (2.0 * apq);
        const t = tau >= 0 ? 1.0 / (tau + Math.hypot(1.0, tau)) : -1.0 / (-tau + Math.hypot(1.0, tau));
        const c = 1.0 / Math.hypot(1.0, t);
        const s = t * c;

        A[p * N + p] = app - t * apq;
        A[q * N + q] = aqq + t * apq;
        A[p * N + q] = 0;
        A[q * N + p] = 0;

        for (let r = 0; r < N; r++) {
          if (r !== p && r !== q) {
            const arp = A[r * N + p];
            const arq = A[r * N + q];
            const nrp = c * arp - s * arq;
            const nrq = s * arp + c * arq;
            A[r * N + p] = nrp;
            A[p * N + r] = nrp;
            A[r * N + q] = nrq;
            A[q * N + r] = nrq;
          }
          const vrp = V[r * N + p];
          const vrq = V[r * N + q];
          V[r * N + p] = c * vrp - s * vrq;
          V[r * N + q] = s * vrp + c * vrq;
        }
      }
    }
  }

  const evals = new Float64Array(N);
  for (let i = 0; i < N; i++) evals[i] = A[i * N + i];

  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => evals[a] - evals[b]);
  const sortedVals = new Float64Array(N);
  const sortedVecs = new Float64Array(N * N);
  for (let col = 0; col < N; col++) {
    const src = order[col];
    sortedVals[col] = evals[src];
    for (let row = 0; row < N; row++) {
      sortedVecs[row * N + col] = V[row * N + src];
    }
  }

  return { eigenvalues: sortedVals, eigenvectors: sortedVecs };
}

/**
 * Exact cyclic Jacobi eigensolver for dense complex Hermitian D x D matrix A = ARe + i AIm.
 * Uses unitary 2x2 Givens congruence G^H A G preserving exact trace and Frobenius norm.
 * Returns { eigenvalues (sorted ascending), traceErr, frobErr, sweeps }.
 */
function jacobiHermitianEigen(AReIn, AImIn, D, maxSweeps = 100) {
  const ARe = new Float64Array(AReIn);
  const AIm = new Float64Array(AImIn);

  let initTrace = 0;
  let initFrob2 = 0;
  for (let i = 0; i < D; i++) {
    initTrace += ARe[i * D + i];
    for (let j = 0; j < D; j++) {
      initFrob2 += ARe[i * D + j] ** 2 + AIm[i * D + j] ** 2;
    }
  }

  let sweeps = 0;
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    sweeps = sweep + 1;
    let offNorm2 = 0;
    for (let i = 0; i < D; i++) {
      for (let j = i + 1; j < D; j++) {
        const re = ARe[i * D + j];
        const im = AIm[i * D + j];
        offNorm2 += re * re + im * im;
      }
    }
    if (Math.sqrt(offNorm2) < 1e-12) break;

    for (let p = 0; p < D - 1; p++) {
      for (let q = p + 1; q < D; q++) {
        const rePQ = ARe[p * D + q];
        const imPQ = AIm[p * D + q];
        const r = Math.hypot(rePQ, imPQ);
        if (r < 1e-15) continue;

        const uRe = rePQ / r;
        const uIm = imPQ / r;
        const app = ARe[p * D + p];
        const aqq = ARe[q * D + q];
        const tau = (aqq - app) / (2.0 * r);
        const t = tau >= 0 ? 1.0 / (tau + Math.hypot(1.0, tau)) : -1.0 / (-tau + Math.hypot(1.0, tau));
        const c = 1.0 / Math.hypot(1.0, t);
        const s = t * c;

        ARe[p * D + p] = app - t * r;
        AIm[p * D + p] = 0;
        ARe[q * D + q] = aqq + t * r;
        AIm[q * D + q] = 0;
        ARe[p * D + q] = 0;
        AIm[p * D + q] = 0;
        ARe[q * D + p] = 0;
        AIm[q * D + p] = 0;

        for (let k = 0; k < D; k++) {
          if (k === p || k === q) continue;
          const xRe = ARe[k * D + p];
          const xIm = AIm[k * D + p];
          const yRe = ARe[k * D + q];
          const yIm = AIm[k * D + q];

          // x' = c * x - s * conj(u) * y
          // conj(u) * y = (uRe*yRe + uIm*yIm) + i*(uRe*yIm - uIm*yRe)
          const cuyRe = uRe * yRe + uIm * yIm;
          const cuyIm = uRe * yIm - uIm * yRe;
          const nxRe = c * xRe - s * cuyRe;
          const nxIm = c * xIm - s * cuyIm;

          // y' = s * u * x + c * y
          // u * x = (uRe*xRe - uIm*xIm) + i*(uRe*xIm + uIm*xRe)
          const uxRe = uRe * xRe - uIm * xIm;
          const uxIm = uRe * xIm + uIm * xRe;
          const nyRe = s * uxRe + c * yRe;
          const nyIm = s * uxIm + c * yIm;

          ARe[k * D + p] = nxRe;
          AIm[k * D + p] = nxIm;
          ARe[p * D + k] = nxRe;
          AIm[p * D + k] = -nxIm;

          ARe[k * D + q] = nyRe;
          AIm[k * D + q] = nyIm;
          ARe[q * D + k] = nyRe;
          AIm[q * D + k] = -nyIm;
        }
      }
    }
  }

  const evals = new Float64Array(D);
  let finTrace = 0;
  let finFrob2 = 0;
  for (let i = 0; i < D; i++) {
    evals[i] = ARe[i * D + i];
    finTrace += evals[i];
    finFrob2 += evals[i] * evals[i];
  }
  evals.sort();

  return {
    eigenvalues: evals,
    traceErr: Math.abs(finTrace - initTrace),
    frobErr: Math.abs(Math.sqrt(finFrob2) - Math.sqrt(initFrob2)),
    sweeps,
  };
}

/**
 * Build exact dense real symmetric matrix of:
 *   H_Q = F^* diag(lambda_Qp) F   (Vladimirov D_p^alpha in p-adic x basis)
 *   H_R = R_p F^* diag(lambda_R) F R_p  (Monna-conjugated Archimedean (-Delta_R)^{alpha/2} in x basis)
 */
function buildAdelicOperators(p, n, alpha = 1.0) {
  const space = new PadicSpace(p, n);
  const N = space.N;
  const q = new PadicQuantumEngine(space);
  q.setAlpha(alpha);

  const specQ = q.vladimirovSpec;
  const specR = q.archimedeanSpec;

  const HQ = new Float64Array(N * N);
  const HR = new Float64Array(N * N);
  const eRe = new Float64Array(N);
  const eIm = new Float64Array(N);
  const fRe = new Float64Array(N);
  const fIm = new Float64Array(N);
  const outRe = new Float64Array(N);
  const outIm = new Float64Array(N);

  for (let col = 0; col < N; col++) {
    eRe.fill(0); eIm.fill(0);
    eRe[col] = 1.0;
    space.fft(eRe, eIm, fRe, fIm);
    for (let k = 0; k < N; k++) { fRe[k] *= specQ[k]; fIm[k] *= specQ[k]; }
    space.ifft(fRe, fIm, outRe, outIm);
    for (let row = 0; row < N; row++) HQ[row * N + col] = outRe[row];
  }

  const rev = space.revTable;
  for (let col = 0; col < N; col++) {
    eRe.fill(0); eIm.fill(0);
    eRe[rev[col]] = 1.0;
    space.fft(eRe, eIm, fRe, fIm);
    for (let k = 0; k < N; k++) { fRe[k] *= specR[k]; fIm[k] *= specR[k]; }
    space.ifft(fRe, fIm, outRe, outIm);
    for (let row = 0; row < N; row++) HR[row * N + col] = outRe[rev[row]];
  }

  let commFrob2 = 0;
  let hqFrob2 = 0;
  let hrFrob2 = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      hqFrob2 += HQ[i * N + j] ** 2;
      hrFrob2 += HR[i * N + j] ** 2;
      let ab = 0;
      let ba = 0;
      for (let k = 0; k < N; k++) {
        ab += HQ[i * N + k] * HR[k * N + j];
        ba += HR[i * N + k] * HQ[k * N + j];
      }
      const d = ab - ba;
      commFrob2 += d * d;
    }
  }

  return {
    space,
    HQ,
    HR,
    commutatorNorm: Math.sqrt(commFrob2),
    normalizedCommutator: Math.sqrt(commFrob2) / Math.sqrt(hqFrob2 * hrFrob2),
  };
}

/**
 * Directly extract the exact complex Hermitian D x D block of H_Q^{leaf} = F R_p D_p^alpha R_p F^*
 * restricted to valuation-residue sector W_{0, m} = span{e_k : k = m (mod p)} (1 <= m < p),
 * of dimension D = p^{n-1}, along with the diagonal Archimedean energies specR[k] and exact
 * cross-sector leakage verification.
 */
function buildSectorW0mBlock(p, n, mRes = 1, alpha = 1.0) {
  const space = new PadicSpace(p, n);
  const N = space.N;
  const D = (N / p) | 0;
  const q = new PadicQuantumEngine(space);
  q.setAlpha(alpha);

  const specQ = q.vladimirovSpec;
  const specR = q.archimedeanSpec;
  const rev = space.revTable;

  const HQRe = new Float64Array(D * D);
  const HQIm = new Float64Array(D * D);
  const diagR = new Float64Array(D);

  const eRe = new Float64Array(N);
  const eIm = new Float64Array(N);
  const fRe = new Float64Array(N);
  const fIm = new Float64Array(N);
  const oRe = new Float64Array(N);
  const oIm = new Float64Array(N);

  let maxCrossSectorLeak = 0;
  for (let b = 0; b < D; b++) {
    const kCol = b * p + mRes;
    diagR[b] = specR[kCol];

    eRe.fill(0); eIm.fill(0);
    eRe[kCol] = 1.0;
    space.ifft(eRe, eIm, oRe, oIm);
    for (let i = 0; i < N; i++) {
      eRe[i] = oRe[rev[i]];
      eIm[i] = oIm[rev[i]];
    }
    space.fft(eRe, eIm, fRe, fIm);
    for (let m = 0; m < N; m++) {
      fRe[m] *= specQ[m];
      fIm[m] *= specQ[m];
    }
    space.ifft(fRe, fIm, oRe, oIm);
    for (let i = 0; i < N; i++) {
      eRe[i] = oRe[rev[i]];
      eIm[i] = oIm[rev[i]];
    }
    space.fft(eRe, eIm, fRe, fIm);

    for (let j = 0; j < N; j++) {
      if (j % p === mRes) {
        const a = (j / p) | 0;
        HQRe[a * D + b] = fRe[j];
        HQIm[a * D + b] = fIm[j];
      } else {
        const mag = Math.hypot(fRe[j], fIm[j]);
        if (mag > maxCrossSectorLeak) maxCrossSectorLeak = mag;
      }
    }
  }

  let maxHermErr = 0;
  let maxImPart = 0;
  for (let a = 0; a < D; a++) {
    for (let b = 0; b < D; b++) {
      maxImPart = Math.max(maxImPart, Math.abs(HQIm[a * D + b]));
      const er = Math.abs(HQRe[a * D + b] - HQRe[b * D + a]);
      const ei = Math.abs(HQIm[a * D + b] + HQIm[b * D + a]);
      maxHermErr = Math.max(maxHermErr, er, ei);
    }
  }

  return { N, D, mRes, HQRe, HQIm, diagR, maxCrossSectorLeak, maxHermErr, maxImPart };
}

/**
 * Compute Oganesyan-Huse adjacent level-spacing ratio <r> on non-degenerate unique levels
 * Benchmarks:
 *   Poisson (integrable):            <r> = 2 ln 2 - 1 ~= 0.38629
 *   GOE (real symmetric chaos):      <r> ~= 0.5307
 *   GUE (complex Hermitian chaos):   <r> ~= 0.5996
 */
function levelSpacingStats(evals) {
  const N = evals.length;
  const rawSpacings = [];
  for (let i = 0; i < N - 1; i++) rawSpacings.push(Math.max(0, evals[i + 1] - evals[i]));

  const uniq = [evals[0]];
  for (let i = 1; i < N; i++) {
    if (evals[i] - uniq[uniq.length - 1] > 1e-8) uniq.push(evals[i]);
  }

  let sumR = 0;
  let cntR = 0;
  for (let i = 1; i < uniq.length - 1; i++) {
    const s1 = uniq[i] - uniq[i - 1];
    const s2 = uniq[i + 1] - uniq[i];
    const mx = Math.max(s1, s2);
    if (mx > 1e-12) {
      sumR += Math.min(s1, s2) / mx;
      cntR++;
    }
  }

  let rawSumR = 0;
  let rawCnt = 0;
  for (let i = 0; i < rawSpacings.length - 1; i++) {
    const mx = Math.max(rawSpacings[i], rawSpacings[i + 1]);
    if (mx > 1e-12) {
      rawSumR += Math.min(rawSpacings[i], rawSpacings[i + 1]) / mx;
      rawCnt++;
    }
  }

  return {
    totalLevels: N,
    distinctLevels: uniq.length,
    degeneracyBrokenFraction: uniq.length / N,
    meanR_distinct: cntR > 0 ? sumR / cntR : 0,
    meanR_raw: rawCnt > 0 ? rawSumR / rawCnt : 0,
    spectralWidth: evals[N - 1] - evals[0],
  };
}

function runExperimentA() {
  console.log('\n=== Experiment A: Non-Commuting Monna-Conjugated Adelic Hybrid Spectrum ===');
  const configs = [
    { p: 3, n: 4, alpha: 1.0 }, // N = 81
    { p: 2, n: 6, alpha: 1.0 }, // N = 64
    { p: 5, n: 3, alpha: 1.0 }, // N = 125
  ];
  const thetas = [0.0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1.0];
  const allResults = [];

  for (const cfg of configs) {
    const { space, HQ, HR, commutatorNorm, normalizedCommutator } = buildAdelicOperators(cfg.p, cfg.n, cfg.alpha);
    const N = space.N;
    const sweep = [];

    for (const theta of thetas) {
      const H = new Float64Array(N * N);
      for (let i = 0; i < N * N; i++) {
        H[i] = theta * HQ[i] + (1 - theta) * HR[i];
      }
      const { eigenvalues, eigenvectors } = jacobiSymmetricEigen(H, N);
      const stats = levelSpacingStats(eigenvalues);

      let meanIPR = 0;
      let meanEntropy = 0;
      for (let col = 0; col < N; col++) {
        let ipr = 0;
        let ent = 0;
        for (let row = 0; row < N; row++) {
          const p2 = eigenvectors[row * N + col] ** 2;
          ipr += p2 * p2;
          if (p2 > 1e-18) ent -= p2 * Math.log(p2);
        }
        meanIPR += ipr;
        meanEntropy += ent;
      }
      meanIPR /= N;
      meanEntropy /= N;

      sweep.push({
        theta,
        ...stats,
        meanIPR,
        normalizedIPR: meanIPR * N,
        meanShannonEntropy: meanEntropy,
        shannonFraction: meanEntropy / Math.log(N),
      });
    }

    console.log(
      `p=${cfg.p}, n=${cfg.n} (N=${N}): ||[H_Q, H_R]||_F / (||H_Q|| ||H_R||) = ${normalizedCommutator.toFixed(5)}`
    );
    for (const row of sweep) {
      console.log(
        `  theta=${row.theta.toFixed(2)} | distinct=${String(row.distinctLevels).padStart(3)}/${N} | <r>_uniq=${row.meanR_distinct.toFixed(4)} | N*IPR=${row.normalizedIPR.toFixed(3)} | S/lnN=${row.shannonFraction.toFixed(4)}`
      );
    }

    allResults.push({
      ...cfg,
      N,
      commutatorNorm,
      normalizedCommutator,
      sweep,
    });
  }
  return allResults;
}

function runExperimentB() {
  console.log('\n=== Experiment B: Unified Tate-Curve BTZ Ollivier-Ricci Curvature Law ===');
  const cases = [
    { p: 3, n: 4, h: 1 }, // L = 3
    { p: 2, n: 5, h: 2 }, // L = 4
    { p: 5, n: 3, h: 1 }, // L = 5
    { p: 7, n: 3, h: 1 }, // L = 7
    { p: 2, n: 6, h: 3 }, // L = 8
    { p: 3, n: 5, h: 2 }, // L = 9
    { p: 2, n: 6, h: 4 }, // L = 16
  ];
  const rows = [];
  for (const c of cases) {
    const space = new PadicSpace(c.p, c.n);
    const bulk = new BruhatTitsBulk(space, c.h);
    const L = bulk.horizonLength;
    const predicted = -(2 * c.p - Math.max(0, 6 - L)) / (c.p + 2);
    const pureAdS = (-2 * (c.p - 1)) / (c.p + 1);

    let maxErr = 0;
    let measured = 0;
    for (let j = 0; j < L; j++) {
      const k = bulk.ricciCurvature[bulk.horizonEdges[j]];
      measured = k;
      maxErr = Math.max(maxErr, Math.abs(k - predicted));
    }
    const deltaFromAdS = measured - pureAdS;
    console.log(
      `p=${c.p}, L=${String(L).padStart(2)} | measured=${measured.toFixed(12)} | law=${predicted.toFixed(12)} | err=${maxErr.toExponential(2)} | kappa_BTZ - kappa_AdS = ${deltaFromAdS >= 0 ? '+' : ''}${deltaFromAdS.toFixed(5)}`
    );
    rows.push({ p: c.p, n: c.n, h: c.h, L, measured, predicted, maxErr, pureAdS, deltaFromAdS });
  }
  return rows;
}

function runExperimentC() {
  console.log('\n=== Experiment C: Exact Nonlinear Kozyrev Compacton-Soliton vs. Multi-Scale Breakdown ===');
  const space = new PadicSpace(3, 5); // N = 243
  const gs = [0, 20, 60, 150, 300, 500];
  const rows = [];

  for (const g of gs) {
    const qSolo = new PadicQuantumEngine(space);
    qSolo.setAlpha(1.0);
    qSolo.nonlinearity = g;
    const w1 = space.createKozyrevWavelet(2, 2, 1);
    qSolo.setState(w1.re, w1.im, w1.leafStart, w1.leafEnd);
    for (let s = 0; s < 150; s++) qSolo.step(0.015, 2);

    const qDisjoint = new PadicQuantumEngine(space);
    qDisjoint.setAlpha(1.0);
    qDisjoint.nonlinearity = g;
    const wA = space.createKozyrevWavelet(2, 1, 1);
    const wB = space.createKozyrevWavelet(2, 6, 2);
    const dRe = new Float64Array(space.N);
    const dIm = new Float64Array(space.N);
    for (let i = 0; i < space.N; i++) {
      dRe[i] = 0.8 * wA.re[i] + 0.6 * wB.re[i];
      dIm[i] = 0.8 * wA.im[i] + 0.6 * wB.im[i];
    }
    qDisjoint.setState(dRe, dIm, wA.leafStart, wA.leafEnd);
    const initProbA = 1 - qDisjoint.leakagePadic;
    for (let s = 0; s < 150; s++) qDisjoint.step(0.015, 2);
    const disjointBallADrift = Math.abs((1 - qDisjoint.leakagePadic) - initProbA);

    const qMulti = new PadicQuantumEngine(space);
    qMulti.setAlpha(1.0);
    qMulti.nonlinearity = g;
    const m1 = space.createKozyrevWavelet(1, 0, 1);
    const m2 = space.createKozyrevWavelet(2, 1, 2);
    const mRe = new Float64Array(space.N);
    const mIm = new Float64Array(space.N);
    for (let i = 0; i < space.N; i++) {
      mRe[i] = 0.72 * m1.re[i] + 0.69 * m2.re[i];
      mIm[i] = 0.72 * m1.im[i] + 0.69 * m2.im[i];
    }
    qMulti.setState(mRe, mIm, m1.leafStart, m1.leafEnd);
    for (let s = 0; s < 150; s++) qMulti.step(0.015, 2);

    console.log(
      `g=${String(g).padStart(3)} | soloLeak=${qSolo.leakagePadic.toExponential(2)} | disjointDrift=${disjointBallADrift.toExponential(2)} | multiScaleLeak=${(qMulti.leakagePadic * 100).toFixed(2)}% | twinLeak=${(qSolo.leakageTwin * 100).toFixed(2)}%`
    );
    rows.push({
      g,
      soloLeakage: qSolo.leakagePadic,
      soloNormDrift: qSolo.normDriftPadic,
      disjointBallADrift,
      multiScaleLeakage: qMulti.leakagePadic,
      archimedeanTwinLeakage: qSolo.leakageTwin,
    });
  }
  return rows;
}

function runExperimentD() {
  console.log('\n=== Experiment D: Kerr-BTZ Aharonov-Bohm Horizon Flux Response J(Omega) ===');
  const space = new PadicSpace(3, 5); // N = 243
  const bulk = new BruhatTitsBulk(space, 2); // L = 9 horizon ring
  bulk.delta = 1.25;

  const bRe = new Float64Array(space.N);
  const bIm = new Float64Array(space.N);
  const L = bulk.horizonLength;
  const secSize = (space.N / L) | 0;
  for (let l = 0; l < space.N; l++) {
    const sec = (l / secSize) | 0;
    const ang = (2 * Math.PI * sec) / L;
    bRe[l] = Math.exp(-Math.pow(Math.sin(0.5 * ang), 2) * 3.0);
  }

  const rows = [];
  for (let k = -8; k <= 8; k++) {
    const omega = (k / 8) * Math.PI;
    bulk.horizonFlux = omega;
    bulk.solveBulkField(bRe, bIm);

    let totalBulkAction = 0;
    for (let ei = 0; ei < bulk.numEdges; ei++) totalBulkAction += bulk.edgeStress[ei];

    rows.push({
      omega,
      omegaOverPi: k / 8,
      horizonCurrentJ: bulk.horizonFluxCurrent,
      totalBulkAction,
      maxResidual: bulk.maxResidual,
    });
  }

  let maxParityErrJ = 0;
  let maxParityErrE = 0;
  for (let i = 0; i < 8; i++) {
    const a = rows[i];
    const b = rows[16 - i];
    maxParityErrJ = Math.max(maxParityErrJ, Math.abs(a.horizonCurrentJ + b.horizonCurrentJ));
    maxParityErrE = Math.max(maxParityErrE, Math.abs(a.totalBulkAction - b.totalBulkAction));
  }
  console.log(
    `Flux sweep Omega in [-pi, pi]: peak |J| = ${Math.max(...rows.map((r) => Math.abs(r.horizonCurrentJ))).toExponential(4)} | odd-parity err = ${maxParityErrJ.toExponential(2)} | even-action err = ${maxParityErrE.toExponential(2)}`
  );
  return { rows, maxParityErrJ, maxParityErrE };
}

function runExperimentE() {
  console.log('\n=== Experiment E: Large-N Intra-Block Spectral Statistics Inside Sectors W_{0,m} (Frontier #1) ===');
  const configs = [
    { p: 2, n: 7, m: 1, alpha: 1.0 }, // N = 128, dim(W_{0,1}) = 64, r0 = 0
    { p: 2, n: 8, m: 1, alpha: 1.0 }, // N = 256, dim(W_{0,1}) = 128, r0 = 0
    { p: 3, n: 5, m: 1, alpha: 1.0 }, // N = 243, dim(W_{0,1}) = 81, r0 = 1/2
    { p: 5, n: 4, m: 1, alpha: 1.0 }, // N = 625, dim(W_{0,1}) = 125, r0 = 2/3
    { p: 5, n: 4, m: 2, alpha: 1.0 }, // N = 625, dim(W_{0,2}) = 125, r0 = 1/4 (falsifies GUE mirage!)
  ];
  const thetas = [0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9];

  // Cross-validation anchor: verify complex Hermitian W_{0,1} block eigenvalues match full real N x N Jacobi on p=3, n=4
  const checkFull = buildAdelicOperators(3, 4, 1.0);
  const Hfull = new Float64Array(81 * 81);
  for (let i = 0; i < 81 * 81; i++) Hfull[i] = 0.5 * checkFull.HQ[i] + 0.5 * checkFull.HR[i];
  const fullEig = jacobiSymmetricEigen(Hfull, 81).eigenvalues;
  const checkBlk = buildSectorW0mBlock(3, 4, 1, 1.0);
  const MRe0 = new Float64Array(checkBlk.D * checkBlk.D);
  const MIm0 = new Float64Array(checkBlk.D * checkBlk.D);
  for (let i = 0; i < checkBlk.D * checkBlk.D; i++) {
    MRe0[i] = 0.5 * checkBlk.HQRe[i];
    MIm0[i] = 0.5 * checkBlk.HQIm[i];
  }
  for (let a = 0; a < checkBlk.D; a++) MRe0[a * checkBlk.D + a] += 0.5 * checkBlk.diagR[a];
  const blkEig = jacobiHermitianEigen(MRe0, MIm0, checkBlk.D).eigenvalues;
  let maxBlockVsFullErr = 0;
  for (let a = 0; a < checkBlk.D; a++) {
    let best = Infinity;
    for (let k = 0; k < 81; k++) best = Math.min(best, Math.abs(blkEig[a] - fullEig[k]));
    maxBlockVsFullErr = Math.max(maxBlockVsFullErr, best);
  }
  console.log(`Cross-check W_{0,1} (27x27 complex Hermitian) vs full 81x81 real Jacobi at theta=0.5: max eig err = ${maxBlockVsFullErr.toExponential(2)}`);

  const results = [];
  for (const cfg of configs) {
    const blk = buildSectorW0mBlock(cfg.p, cfg.n, cfg.m, cfg.alpha);
    const { N, D, HQRe, HQIm, diagR, maxCrossSectorLeak, maxHermErr, maxImPart } = blk;
    const modularPicketFenceR0 = Math.min(2 * cfg.m, cfg.p - 2 * cfg.m) / Math.max(2 * cfg.m, cfg.p - 2 * cfg.m);
    const sweep = [];

    for (const theta of thetas) {
      const MRe = new Float64Array(D * D);
      const MIm = new Float64Array(D * D);
      for (let i = 0; i < D * D; i++) {
        MRe[i] = theta * HQRe[i];
        MIm[i] = theta * HQIm[i];
      }
      for (let a = 0; a < D; a++) {
        MRe[a * D + a] += (1 - theta) * diagR[a];
      }
      const eig = jacobiHermitianEigen(MRe, MIm, D);
      const stats = levelSpacingStats(eig.eigenvalues);
      sweep.push({
        theta,
        dimBlock: D,
        distinctInBlock: stats.distinctLevels,
        meanR_block: stats.meanR_distinct,
        meanR_raw_block: stats.meanR_raw,
        spectralWidth: stats.spectralWidth,
        traceErr: eig.traceErr,
        frobErr: eig.frobErr,
      });
    }

    const rHalf = sweep.find((r) => r.theta === 0.5).meanR_block;
    console.log(
      `p=${cfg.p}, n=${cfg.n}, W_{0,${cfg.m}} (N=${N}, D=${D}): crossLeak=${maxCrossSectorLeak.toExponential(2)} | r0(p,m)=${modularPicketFenceR0.toFixed(4)} | <r>(0.10)=${sweep[0].meanR_block.toFixed(4)} | <r>(0.50)=${rHalf.toFixed(4)} | <r>(0.90)=${sweep[sweep.length - 1].meanR_block.toFixed(4)}`
    );
    results.push({
      ...cfg,
      N,
      dimBlock: D,
      modularPicketFenceR0,
      maxCrossSectorLeak,
      maxHermErr,
      maxImPart,
      isStrictlyComplexBlock: maxImPart > 1e-6,
      meanR_at_0_5: rHalf,
      sweep,
    });
  }

  return {
    crossValidation_p3_n4_maxEigErr: maxBlockVsFullErr,
    benchmarks: { poisson: 2 * Math.LN2 - 1, goe: 0.5307, gue: 0.5996 },
    configs: results,
  };
}

function runExperimentF() {
  console.log('\n=== Experiment F: Parametric Scaling of Multi-Scale Resonant Self-Trapping Peak g_*(p, alpha) (Frontier #2) ===');
  const cases = [
    { p: 3, n: 5, alpha: 0.6 },
    { p: 3, n: 5, alpha: 0.8 },
    { p: 3, n: 5, alpha: 1.0 },
    { p: 3, n: 5, alpha: 1.2 },
    { p: 3, n: 5, alpha: 1.4 },
    { p: 2, n: 7, alpha: 1.0 },
    { p: 5, n: 3, alpha: 1.0 },
  ];

  const series = [];
  for (const cfg of cases) {
    const space = new PadicSpace(cfg.p, cfg.n);
    const gap12 = cfg.p ** (2 * cfg.alpha) - cfg.p ** cfg.alpha;
    const gScale = Math.max(10, Math.round(gap12 * 10));
    const gMultipliers = [0, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0, 8.0, 12.0, 20.0];
    const m1 = space.createKozyrevWavelet(1, 0, 1);
    const m2 = space.createKozyrevWavelet(2, 1, Math.min(2, cfg.p - 1));
    const mRe = new Float64Array(space.N);
    const mIm = new Float64Array(space.N);
    for (let i = 0; i < space.N; i++) {
      mRe[i] = 0.72 * m1.re[i] + 0.69 * m2.re[i];
      mIm[i] = 0.72 * m1.im[i] + 0.69 * m2.im[i];
    }

    const curve = [];
    for (const mult of gMultipliers) {
      const g = Math.round(mult * gScale);
      const q = new PadicQuantumEngine(space);
      q.setAlpha(cfg.alpha);
      q.nonlinearity = g;
      q.setState(mRe, mIm, m1.leafStart, m1.leafEnd);
      for (let s = 0; s < 150; s++) q.step(0.015, 2);
      curve.push({ g, gOverGap: g / gap12, leakage: q.leakagePadic });
    }

    const peak = curve.reduce((best, r) => (r.leakage > best.leakage ? r : best), curve[0]);
    const tail = curve[curve.length - 1];
    console.log(
      `p=${cfg.p}, n=${cfg.n}, alpha=${cfg.alpha.toFixed(1)} | gap=${gap12.toFixed(3)} | peakLeak=${(peak.leakage * 100).toFixed(3)}% at g*=${peak.g} (g*/gap=${peak.gOverGap.toFixed(1)}) | tailLeak(g=${tail.g})=${(tail.leakage * 100).toFixed(4)}%`
    );
    series.push({
      ...cfg,
      N: space.N,
      vladimirovGap12: gap12,
      peakG: peak.g,
      peakGOverGap: peak.gOverGap,
      peakLeakage: peak.leakage,
      tailG: tail.g,
      tailLeakage: tail.leakage,
      curve,
    });
  }
  return series;
}

function runExperimentG() {
  console.log('\n=== Experiment G: Nonlinear Dispersion alpha in {0.5, 1.0, 1.5, 2.0} Intra-Sector Spectral Contrast ===');
  const sectors = [
    { p: 2, n: 8, m: 1 }, // N = 256, D = 128
    { p: 3, n: 5, m: 1 }, // N = 243, D = 81
    { p: 5, n: 4, m: 1 }, // N = 625, D = 125
    { p: 5, n: 4, m: 2 }, // N = 625, D = 125
  ];
  const alphas = [0.5, 1.0, 1.5, 2.0];
  const theta = 0.5;
  const rows = [];

  for (const sec of sectors) {
    for (const alpha of alphas) {
      const blk = buildSectorW0mBlock(sec.p, sec.n, sec.m, alpha);
      const { N, D, HQRe, HQIm, diagR, maxCrossSectorLeak, maxHermErr } = blk;

      // Exact unperturbed Archimedean folded-spectrum <r> inside W_{0, m} at theta = 0
      const sortedR = Float64Array.from(diagR).sort();
      const statsR0 = levelSpacingStats(sortedR);

      // Measure relative off-diagonal coupling strength inside W_{0, m}
      let offFrob2 = 0;
      let diagRFrob2 = 0;
      for (let a = 0; a < D; a++) {
        diagRFrob2 += diagR[a] * diagR[a];
        for (let b = 0; b < D; b++) {
          if (a !== b) offFrob2 += HQRe[a * D + b] ** 2 + HQIm[a * D + b] ** 2;
        }
      }
      const offToArchRatio = Math.sqrt(offFrob2) / Math.max(1e-12, Math.sqrt(diagRFrob2));

      // Diagonalize hybrid block at theta = 0.5
      const MRe = new Float64Array(D * D);
      const MIm = new Float64Array(D * D);
      for (let i = 0; i < D * D; i++) {
        MRe[i] = theta * HQRe[i];
        MIm[i] = theta * HQIm[i];
      }
      for (let a = 0; a < D; a++) MRe[a * D + a] += (1 - theta) * diagR[a];
      const eig = jacobiHermitianEigen(MRe, MIm, D);
      const statsHyb = levelSpacingStats(eig.eigenvalues);

      console.log(
        `p=${sec.p}, n=${sec.n}, W_{0,${sec.m}}, alpha=${alpha.toFixed(1)} | crossLeak=${maxCrossSectorLeak.toExponential(1)} | ||HQ_off||/||HR||=${offToArchRatio.toFixed(4)} | <r>(theta=0)=${statsR0.meanR_distinct.toFixed(4)} | <r>(theta=0.5)=${statsHyb.meanR_distinct.toFixed(4)} | shift=${(statsHyb.meanR_distinct - statsR0.meanR_distinct >= 0 ? '+' : '') + (statsHyb.meanR_distinct - statsR0.meanR_distinct).toFixed(4)}`
      );
      rows.push({
        p: sec.p,
        n: sec.n,
        m: sec.m,
        N,
        dimBlock: D,
        alpha,
        theta,
        maxCrossSectorLeak,
        maxHermErr,
        offToArchRatio,
        meanR_archimedean0: statsR0.meanR_distinct,
        meanR_hybrid05: statsHyb.meanR_distinct,
        deltaR: statsHyb.meanR_distinct - statsR0.meanR_distinct,
        distinctInBlock: statsHyb.distinctLevels,
      });
    }
  }
  return rows;
}

function runExperimentH() {
  console.log('\n=== Experiment H: Theorem V Curved AdS Gauss-Bonnet Conservation, Pinch Margin & BF Stability ===');

  // Part H1: Non-perturbative curved AdS Gauss-Bonnet conservation & supercritical pinch deficit
  const gbCurves = [];
  const sigmas = [-2.2, -1.8, -1.4, -1.1, -0.8, -0.4, 0.0, 0.5, 1.0, 1.8, 2.5];
  for (const [p, n] of [[2, 5], [3, 4], [5, 3]]) {
    const kappaAdS = (-2 * (p - 1)) / (p + 1);
    const sigmaCrit = -Math.log(p);

    // Require BOTH endpoints AND all 2p adjacent edges to be strictly interior (degree p+1 at every vertex),
    // which requires depth(u) >= 2 and depth(v) = depth(u) + 1 <= nDeep - 2, i.e. nDeep >= 5!
    const nDeep = p === 2 ? 6 : 5;
    const spaceDeep = new PadicSpace(p, nDeep);
    const bulkDeep = new BruhatTitsBulk(spaceDeep, 0);
    // Find an edge (u, v) with depth(u) >= 2 and depth(v) <= nDeep - 2
    let targetEdge = -1;
    for (let ei = 0; ei < bulkDeep.numEdges; ei++) {
      const e = bulkDeep.edges[ei];
      if (bulkDeep.nodeDepth[e.u] >= 2 && bulkDeep.nodeDepth[e.v] <= nDeep - 2) {
        targetEdge = ei;
        break;
      }
    }
    const eObj = bulkDeep.edges[targetEdge];
    const adjEdges = bulkDeep.edgeNeighbors[targetEdge];
    const sweep = [];
    let maxErr = 0;

    for (const sig of sigmas) {
      bulkDeep.sigma.fill(0);
      bulkDeep.sigma[targetEdge] = sig;
      bulkDeep._syncWeights();
      bulkDeep.computeOllivierRicci();

      const kEdge = bulkDeep.ricciCurvature[targetEdge];
      let sumExcess = kEdge - kappaAdS;
      let kAdjSample = 0;
      for (let i = 0; i < adjEdges.length; i++) {
        const ka = bulkDeep.ricciCurvature[adjEdges[i]];
        kAdjSample = ka;
        sumExcess += ka - kappaAdS;
      }

      const w = Math.exp(-sig);
      const predictedTotalExcess = w <= p ? 0.0 : (-2.0 * (w - p)) / (w + p);
      const err = Math.abs(sumExcess - predictedTotalExcess);
      if (err > maxErr) maxErr = err;

      sweep.push({
        sigma: sig,
        edgeLength: Math.exp(sig),
        conductance: w,
        regime: w <= p ? 'subcritical_conserved' : 'supercritical_deficit',
        kappaEdge: kEdge,
        kappaAdj: kAdjSample,
        totalCurvatureExcess: sumExcess,
        theoremVPrediction: predictedTotalExcess,
        absError: err,
      });
    }

    console.log(
      `Theorem V (p=${p}, n=${nDeep}, sigma*=-ln(${p})=${sigmaCrit.toFixed(4)}): max |measured - law| = ${maxErr.toExponential(2)} | stretch(+2.5) sum=${sweep[sweep.length - 1].totalCurvatureExcess.toExponential(2)} | pinch(-2.2) sum=${sweep[0].totalCurvatureExcess.toFixed(6)}`
    );
    gbCurves.push({ p, n: nDeep, kappaAdS, sigmaCrit, maxErr, sweep });
  }

  // Part H2: Breitenlohner-Freedman Tachyonic Margin (Delta -> 0.5+) under curved gravity & maximal Kerr flux
  const deltas = [1.5, 1.0, 0.7, 0.55, 0.51, 0.501, 0.5001];
  const bfRows = [];
  const spaceBF = new PadicSpace(3, 5);
  const bRe = new Float64Array(spaceBF.N);
  const bIm = new Float64Array(spaceBF.N);
  for (let l = 0; l < spaceBF.N; l++) {
    bRe[l] = Math.cos(l * 0.31) * 0.8 + 0.2;
    bIm[l] = Math.sin(l * 0.47) * 0.6;
  }

  for (const isBTZ of [false, true]) {
    const bulk = new BruhatTitsBulk(spaceBF, isBTZ ? 2 : 0);
    // Deterministic inhomogeneous curved geometry sigma in [-1.5, +1.5]
    for (let e = 0; e < bulk.numEdges; e++) {
      bulk.sigma[e] = 1.5 * Math.sin(e * 1.61803398875);
    }
    bulk.horizonFlux = isBTZ ? Math.PI : 0.0;
    bulk._syncWeights();

    for (const delta of deltas) {
      bulk.delta = delta;
      bulk.solveBulkField(bRe, bIm);
      const m2 = bulk.massSquared(delta);
      const bf = bulk.bfBound();
      let minPivot = Infinity;
      for (let u = 0; u < bulk.numNodes; u++) {
        if (!bulk.isLeaf[u]) minPivot = Math.min(minPivot, Math.abs(bulk._D[u]));
      }
      bfRows.push({
        topology: isBTZ ? 'Curved_Kerr_BTZ_L9_OmegaPi' : 'Curved_Pure_AdS',
        p: 3,
        n: 5,
        delta,
        m2,
        m2MinusBF: m2 - bf,
        minSchurPivot: minPivot,
        maxResidual: bulk.maxResidual,
      });
    }
  }
  const worstBFRes = Math.max(...bfRows.map((r) => r.maxResidual));
  const minBFPivot = Math.min(...bfRows.map((r) => r.minSchurPivot));
  console.log(
    `BF Tachyonic Margin Sweep (Delta -> 0.5001, curved sigma in [-1.5,1.5], Omega=pi): worst KG residual = ${worstBFRes.toExponential(2)} | min Schur pivot = ${minBFPivot.toFixed(4)}`
  );

  return { gaussBonnetCurves: gbCurves, bfStabilityMargin: bfRows, worstBFResidual: worstBFRes, minBFPivot };
}

async function main() {
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const results = {
    generatedAt: new Date().toISOString(),
    nodeVersion: process.version,
    experimentA_adelicHybridSpectrum: runExperimentA(),
    experimentB_btzOllivierRicciLaw: runExperimentB(),
    experimentC_kozyrevCompactonSolitons: runExperimentC(),
    experimentD_kerrBtzAharonovBohmFlux: runExperimentD(),
    experimentE_intraBlockSpectralStats: runExperimentE(),
    experimentF_selfTrappingScaling: runExperimentF(),
    experimentG_nonlinearDispersionContrast: runExperimentG(),
    experimentH_gaussBonnetAndBFMargin: runExperimentH(),
  };

  const outPath = path.join(RESULTS_DIR, 'discovery-benchmarks.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved reproducible benchmark results to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

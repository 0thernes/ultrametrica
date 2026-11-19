/**
 * ULTRAMETRICA — Reproducible Scientific Discovery & Falsification Benchmark Suite.
 *
 * Runs 4 exact quantitative experiments and writes reproducible JSON results to results/:
 *   Exp A: Full exact eigenspectrum & level-spacing statistics (<r>, IPR, commutator norm)
 *          of the non-commuting Monna-conjugated Adelic Hybrid Hamiltonian:
 *            H(theta) = theta * D_p^alpha + (1 - theta) * R_p * (-Delta_R)^{alpha/2} * R_p
 *   Exp B: Exhaustive numerical verification of the unified BTZ Ollivier-Ricci curvature law:
 *            kappa_BTZ(p, L) = -(2p - max(0, 6 - L)) / (p + 2)
 *          across p in {2, 3, 5, 7} and L in {3, 4, 5, 6, 7, 8, 9, 16}.
 *   Exp C: Exact Nonlinear Kozyrev Compacton-Soliton Invariance vs. Multi-Scale Breakdown
 *          under the p-adic Gross-Pitaevskii equation across g in [0, 500].
 *   Exp D: Rotating Kerr-BTZ Aharonov-Bohm Horizon Flux Current J(Omega) & Energy Spectrum
 *          across Omega in [-pi, pi].
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

  // Sort eigenvalues & eigenvectors ascending
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
 * Build exact dense real symmetric matrix of:
 *   H_Q = F^* diag(lambda_Qp) F   (Vladimirov D_p^alpha in p-adic x basis)
 *   H_R = R_p F^* diag(lambda_R) F R_p  (Monna-conjugated Archimedean (-Delta_R)^{alpha/2} in x basis)
 * Both are strictly real symmetric because lambda_k = lambda_{N-k} (even spectra)!
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

  // Build H_Q column by column
  for (let col = 0; col < N; col++) {
    eRe.fill(0); eIm.fill(0);
    eRe[col] = 1.0;
    space.fft(eRe, eIm, fRe, fIm);
    for (let k = 0; k < N; k++) { fRe[k] *= specQ[k]; fIm[k] *= specQ[k]; }
    space.ifft(fRe, fIm, outRe, outIm);
    for (let row = 0; row < N; row++) HQ[row * N + col] = outRe[row];
  }

  // Build H_R = R_p F^* diag(specR) F R_p column by column
  const rev = space.revTable;
  for (let col = 0; col < N; col++) {
    eRe.fill(0); eIm.fill(0);
    eRe[rev[col]] = 1.0; // R_p |col> = |rev[col]>
    space.fft(eRe, eIm, fRe, fIm);
    for (let k = 0; k < N; k++) { fRe[k] *= specR[k]; fIm[k] *= specR[k]; }
    space.ifft(fRe, fIm, outRe, outIm);
    for (let row = 0; row < N; row++) HR[row * N + col] = outRe[rev[row]];
  }

  // Compute exact Frobenius norm of commutator [H_Q, H_R] and operators
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
 * Compute Oganesyan-Huse adjacent level-spacing ratio <r> on non-degenerate unique levels
 * (filtering exact symmetry doublets/degeneracies at tol = 1e-9, plus reporting raw <r> and
 * distinct-level fraction!).
 * Benchmarks:
 *   Poisson (integrable): <r> = 2 ln 2 - 1 ~= 0.38629
 *   GOE (real symmetric quantum chaos): <r> ~= 0.5307
 *   GUE (Hermitian quantum chaos): <r> ~= 0.5996
 */
function levelSpacingStats(evals) {
  const N = evals.length;
  // Raw spacings including degeneracies
  const rawSpacings = [];
  for (let i = 0; i < N - 1; i++) rawSpacings.push(Math.max(0, evals[i + 1] - evals[i]));

  // Deduplicate exact symmetries (e.g., reflection parity doublets) to inspect symmetry-reduced spectrum
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

      // Compute mean eigenstate IPR in position basis & mean Shannon participation entropy
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
        normalizedIPR: meanIPR * N, // 1.0 = plane wave, 3.0 = GOE random vector, >3 = localized!
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
    // 1. Single Kozyrev wavelet (exact compacton soliton for ALL g!)
    const qSolo = new PadicQuantumEngine(space);
    qSolo.setAlpha(1.0);
    qSolo.nonlinearity = g;
    const w1 = space.createKozyrevWavelet(2, 2, 1);
    qSolo.setState(w1.re, w1.im, w1.leafStart, w1.leafEnd);
    for (let s = 0; s < 150; s++) qSolo.step(0.015, 2);

    // 2. Two disjoint Kozyrev wavelets on disjoint balls (exact non-interacting multi-soliton!)
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

    // 3. Overlapping multi-scale packet inside ONE depth-1 ball (non-uniform |psi|^2 -> breaks soliton!)
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

  // Real symmetric boundary pulse (zero intrinsic current at Omega = 0)
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

  // Verify exact odd parity J(-Omega) = -J(Omega) and even action E(-Omega) = E(Omega)
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

async function main() {
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const results = {
    generatedAt: new Date().toISOString(),
    nodeVersion: process.version,
    experimentA_adelicHybridSpectrum: runExperimentA(),
    experimentB_btzOllivierRicciLaw: runExperimentB(),
    experimentC_kozyrevCompactonSolitons: runExperimentC(),
    experimentD_kerrBtzAharonovBohmFlux: runExperimentD(),
  };

  const outPath = path.join(RESULTS_DIR, 'discovery-benchmarks.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved reproducible benchmark results to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * ULTRAMETRICA (v1.4.0) — Pre-Registered Confirmatory Statistical Evaluation (Experiment I).
 * Implements Build Standard B28 (20 fixed seeds + RMT control arm), B29 (10,000-resample
 * Monte Carlo permutation test), B30 (mean diff, Cliff's delta, Cohen's d + seeded 95%
 * bootstrap CIs), and B31 (Holm-Bonferroni FWER correction) strictly per docs/preregistration.md.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { PadicSpace } from '../src/engine/padic.js';
import { PadicQuantumEngine } from '../src/engine/quantum.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalPair(rng) {
  let u1 = 0;
  while (u1 <= 1e-12) u1 = rng();
  const u2 = rng();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

/** Exact cyclic Jacobi eigensolver for dense real symmetric or complex Hermitian M x M matrices. */
function jacobiHermitianEigenvalues(reMat, imMat, M) {
  const R = Float64Array.from(reMat);
  const I = imMat ? Float64Array.from(imMat) : new Float64Array(M * M);
  const maxSweeps = 45;

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let offNorm2 = 0;
    for (let i = 0; i < M; i++) {
      for (let j = i + 1; j < M; j++) {
        const a = R[i * M + j];
        const b = I[i * M + j];
        offNorm2 += a * a + b * b;
      }
    }
    if (offNorm2 < 1e-24) break;

    const thresh = sweep < 4 ? (0.2 * Math.sqrt(offNorm2)) / (M * M) : 0;
    for (let p = 0; p < M - 1; p++) {
      for (let q = p + 1; q < M; q++) {
        const aRe = R[p * M + q];
        const aIm = I[p * M + q];
        const mag = Math.hypot(aRe, aIm);
        if (mag <= 1e-15 || mag < thresh) continue;

        const eRe = aRe / mag;
        const eIm = aIm / mag; // a_pq = mag * e^{i phi}
        const app = R[p * M + p];
        const aqq = R[q * M + q];
        const tau = (aqq - app) / (2 * mag);
        const t = tau >= 0 ? 1 / (tau + Math.sqrt(1 + tau * tau)) : -1 / (-tau + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;

        // Update rows/cols k != p, q
        for (let k = 0; k < M; k++) {
          if (k === p || k === q) continue;
          const kpRe = R[k * M + p], kpIm = I[k * M + p];
          const kqRe = R[k * M + q], kqIm = I[k * M + q];

          // v_kp' = c * v_kp - s * e^{-i phi} * v_kq
          const rotKqRe = eRe * kqRe + eIm * kqIm;
          const rotKqIm = eRe * kqIm - eIm * kqRe;
          const nkpRe = c * kpRe - s * rotKqRe;
          const nkpIm = c * kpIm - s * rotKqIm;

          // v_kq' = s * e^{+i phi} * v_kp + c * v_kq
          const rotKpRe = eRe * kpRe - eIm * kpIm;
          const rotKpIm = eRe * kpIm + eIm * kpRe;
          const nkqRe = s * rotKpRe + c * kqRe;
          const nkqIm = s * rotKpIm + c * kqIm;

          R[k * M + p] = nkpRe; I[k * M + p] = nkpIm;
          R[p * M + k] = nkpRe; I[p * M + k] = -nkpIm;
          R[k * M + q] = nkqRe; I[k * M + q] = nkqIm;
          R[q * M + k] = nkqRe; I[q * M + k] = -nkqIm;
        }
        R[p * M + p] = app - t * mag;
        R[q * M + q] = aqq + t * mag;
        R[p * M + q] = 0; I[p * M + q] = 0;
        R[q * M + p] = 0; I[q * M + p] = 0;
      }
    }
  }
  const eigs = new Float64Array(M);
  for (let i = 0; i < M; i++) eigs[i] = R[i * M + i];
  eigs.sort();
  return eigs;
}

function spacingRatios(eigs) {
  const out = [];
  for (let i = 1; i < eigs.length - 1; i++) {
    const d1 = eigs[i] - eigs[i - 1];
    const d2 = eigs[i + 1] - eigs[i];
    const hi = Math.max(d1, d2);
    if (hi > 1e-14) out.push(Math.min(d1, d2) / hi);
  }
  return out;
}

function buildAdelicSectorMatrix(p, n, m, alpha, theta) {
  const sp = new PadicSpace(p, n);
  const N = sp.N;
  const q = new PadicQuantumEngine(sp);
  q.setAlpha(alpha);

  const sectorIdx = [];
  for (let k = 1; k < N; k++) {
    if (k % p === m) sectorIdx.push(k);
  }
  const M = sectorIdx.length;
  const Hre = new Float64Array(M * M);
  const Him = new Float64Array(M * M);
  const eR = new Float64Array(N), eI = new Float64Array(N);
  const fR = new Float64Array(N), fI = new Float64Array(N);
  const oR = new Float64Array(N), oI = new Float64Array(N);

  for (let col = 0; col < M; col++) {
    const k = sectorIdx[col];
    eR.fill(0); eI.fill(0); eR[k] = 1;
    sp.ifft(eR, eI, oR, oI);
    for (let i = 0; i < N; i++) { eR[i] = oR[sp.revTable[i]]; eI[i] = oI[sp.revTable[i]]; }
    sp.fft(eR, eI, fR, fI);
    for (let u = 0; u < N; u++) { fR[u] *= q.vladimirovSpec[u]; fI[u] *= q.vladimirovSpec[u]; }
    sp.ifft(fR, fI, oR, oI);
    for (let i = 0; i < N; i++) { eR[i] = oR[sp.revTable[i]]; eI[i] = oI[sp.revTable[i]]; }
    sp.fft(eR, eI, fR, fI);

    for (let row = 0; row < M; row++) {
      const j = sectorIdx[row];
      Hre[row * M + col] = theta * fR[j] + (row === col ? (1 - theta) * q.archimedeanSpec[k] : 0);
      Him[row * M + col] = theta * fI[j];
    }
  }
  return { M, Hre, Him };
}

function sampleRMTMatrix(M, ensemble, seed) {
  const rng = mulberry32(seed);
  const R = new Float64Array(M * M);
  const I = new Float64Array(M * M);
  const invSqrt2 = 1 / Math.sqrt(2);
  for (let i = 0; i < M; i++) {
    const [z] = normalPair(rng);
    R[i * M + i] = ensemble === 'GOE' ? z * Math.SQRT2 : z;
    for (let j = i + 1; j < M; j++) {
      const [g1, g2] = normalPair(rng);
      if (ensemble === 'GOE') {
        R[i * M + j] = g1; R[j * M + i] = g1;
      } else {
        R[i * M + j] = g1 * invSqrt2; R[j * M + i] = g1 * invSqrt2;
        I[i * M + j] = g2 * invSqrt2; I[j * M + i] = -g2 * invSqrt2;
      }
    }
  }
  return { R, I };
}

const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const std = (arr, mu = mean(arr)) => Math.sqrt(arr.reduce((a, x) => a + (x - mu) ** 2, 0) / Math.max(1, arr.length - 1));

function cliffsDelta(x, y) {
  let gt = 0;
  let lt = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    for (let j = 0; j < y.length; j++) {
      if (xi > y[j]) gt++;
      else if (xi < y[j]) lt++;
    }
  }
  return (gt - lt) / (x.length * y.length);
}

function cohensD(x, y) {
  const mx = mean(x), my = mean(y);
  const vx = std(x, mx) ** 2, vy = std(y, my) ** 2;
  const pooled = Math.sqrt(((x.length - 1) * vx + (y.length - 1) * vy) / (x.length + y.length - 2));
  return pooled > 0 ? (mx - my) / pooled : 0;
}

function permutationTestTwoSided(x, y, resamples, seed) {
  const rng = mulberry32(seed);
  const obs = Math.abs(mean(x) - mean(y));
  const combined = Float64Array.from([...x, ...y]);
  const nX = x.length;
  const N = combined.length;
  let extreme = 0;
  for (let b = 0; b < resamples; b++) {
    // Partial Fisher-Yates of first nX elements
    let sumX = 0;
    let sumAll = 0;
    for (let i = 0; i < N; i++) sumAll += combined[i];
    for (let i = 0; i < nX; i++) {
      const j = i + Math.floor(rng() * (N - i));
      const tmp = combined[i];
      combined[i] = combined[j];
      combined[j] = tmp;
      sumX += combined[i];
    }
    const diff = Math.abs(sumX / nX - (sumAll - sumX) / (N - nX));
    if (diff >= obs - 1e-15) extreme++;
  }
  return (extreme + 1) / (resamples + 1);
}

function bootstrapMeanDiffCI(x, y, resamples, seed) {
  const rng = mulberry32(seed);
  const diffs = new Float64Array(resamples);
  for (let b = 0; b < resamples; b++) {
    let sx = 0;
    for (let i = 0; i < x.length; i++) sx += x[Math.floor(rng() * x.length)];
    let sy = 0;
    for (let j = 0; j < y.length; j++) sy += y[Math.floor(rng() * y.length)];
    diffs[b] = sx / x.length - sy / y.length;
  }
  diffs.sort();
  return [
    Number(diffs[Math.floor(0.025 * resamples)].toFixed(5)),
    Number(diffs[Math.floor(0.975 * resamples)].toFixed(5)),
  ];
}

function holmBonferroni(pvals) {
  const indexed = pvals.map((p, idx) => ({ p, idx })).sort((a, b) => a.p - b.p);
  const m = pvals.length;
  const adj = new Array(m);
  let runningMax = 0;
  for (let k = 0; k < m; k++) {
    const val = Math.min(1, indexed[k].p * (m - k));
    runningMax = Math.max(runningMax, val);
    adj[indexed[k].idx] = runningMax;
  }
  return adj;
}

const SEEDS = Array.from({ length: 20 }, (_, i) => 1001 + i);
const PERM_RESAMPLES = 10000;
const BOOT_RESAMPLES = 10000;

const HYPOTHESES = [
  { id: 'H1', p: 5, n: 4, m: 2, alpha: 1.0, theta: 0.5, ensemble: 'GUE', expectedSign: -1, r0: 0.25 },
  { id: 'H2', p: 5, n: 4, m: 1, alpha: 1.0, theta: 0.5, ensemble: 'GOE', expectedSign: +1, r0: 2 / 3 },
  { id: 'H3', p: 2, n: 7, m: 1, alpha: 1.0, theta: 0.5, ensemble: 'GOE', expectedSign: -1, r0: 0.0 },
  { id: 'H4', p: 5, n: 4, m: 2, alpha: 2.0, theta: 0.5, ensemble: 'GUE', expectedSign: -1, r0: 0.25 },
];

// Cache control ensembles per (M, ensemble) so all hypotheses use identical pre-registered seeds 1001..1020
const rmtCache = new Map();
function getRmtControl(M, ensemble) {
  const key = `${M}_${ensemble}`;
  if (!rmtCache.has(key)) {
    const perSeed = [];
    const pooled = [];
    for (const seed of SEEDS) {
      const { R, I } = sampleRMTMatrix(M, ensemble, seed);
      const eigs = jacobiHermitianEigenvalues(R, I, M);
      const rs = spacingRatios(eigs);
      perSeed.push({ seed, n_ratios: rs.length, mean_r: Number(mean(rs).toFixed(6)) });
      for (const r of rs) pooled.push(r);
    }
    rmtCache.set(key, { perSeed, pooled });
  }
  return rmtCache.get(key);
}

const outcomes = [];
for (const h of HYPOTHESES) {
  const { M, Hre, Him } = buildAdelicSectorMatrix(h.p, h.n, h.m, h.alpha, h.theta);
  const treatEigs = jacobiHermitianEigenvalues(Hre, Him, M);
  const treatRatios = spacingRatios(treatEigs);
  const ctrl = getRmtControl(M, h.ensemble);

  const treatMean = mean(treatRatios);
  const ctrlMean = mean(ctrl.pooled);
  const diff = treatMean - ctrlMean;
  const pPerm = permutationTestTwoSided(treatRatios, ctrl.pooled, PERM_RESAMPLES, 20261125);
  const ci95 = bootstrapMeanDiffCI(treatRatios, ctrl.pooled, BOOT_RESAMPLES, 20261125);
  const cd = cliffsDelta(treatRatios, ctrl.pooled);
  const d = cohensD(treatRatios, ctrl.pooled);
  const seedsMatchingDirection = ctrl.perSeed.filter((s) => (h.expectedSign < 0 ? treatMean < s.mean_r : treatMean > s.mean_r)).length;

  outcomes.push({
    id: h.id,
    sector: `W_{0,${h.m}} (p=${h.p}, n=${h.n}, dim=${M}, alpha=${h.alpha}, theta=${h.theta})`,
    control_ensemble: h.ensemble,
    n_treatment_ratios: treatRatios.length,
    n_control_seeds: SEEDS.length,
    n_control_ratios_pooled: ctrl.pooled.length,
    theoretical_r0: Number(h.r0.toFixed(6)),
    treatment_mean_r: Number(treatMean.toFixed(6)),
    control_mean_r: Number(ctrlMean.toFixed(6)),
    mean_diff: Number(diff.toFixed(6)),
    bootstrap_95ci_diff: ci95,
    cliffs_delta: Number(cd.toFixed(4)),
    cohens_d: Number(d.toFixed(4)),
    p_perm_raw: Number(pPerm.toFixed(6)),
    seeds_in_predicted_direction: `${seedsMatchingDirection}/${SEEDS.length}`,
    expected_sign: h.expectedSign,
    per_seed_controls: ctrl.perSeed,
  });
}

const adjP = holmBonferroni(outcomes.map((o) => o.p_perm_raw));
for (let i = 0; i < outcomes.length; i++) {
  outcomes[i].p_holm_adjusted = Number(adjP[i].toFixed(6));
  const ciExcludesZero =
    outcomes[i].expected_sign < 0
      ? outcomes[i].bootstrap_95ci_diff[1] < 0
      : outcomes[i].bootstrap_95ci_diff[0] > 0;
  outcomes[i].prereg_confirmed = outcomes[i].p_holm_adjusted < 0.01 && ciExcludesZero;
}

let preregCommit = 'uncommitted';
try {
  preregCommit = execSync('git log -n 1 --format=%H -- docs/preregistration.md', { cwd: ROOT, encoding: 'utf8' }).trim() || 'uncommitted';
} catch {}

const out = {
  experiment: 'Experiment I — Pre-Registered Confirmatory Statistical Rejection of GUE/GOE Thermalization',
  generated_at: new Date().toISOString(),
  preregistration_file: 'docs/preregistration.md',
  preregistration_commit: preregCommit,
  config: {
    control_seeds: SEEDS,
    permutation_resamples: PERM_RESAMPLES,
    bootstrap_resamples: BOOT_RESAMPLES,
    resampling_seed: 20261125,
    correction: 'Holm-Bonferroni (FWER alpha = 0.01)',
  },
  environment: {
    node: process.version,
    platform: `${os.platform()}-${os.arch()}`,
    cpu: os.cpus()[0]?.model || 'unknown',
  },
  hypotheses: outcomes,
};

const outPath = path.join(ROOT, 'results', 'stats-eval.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ preregCommit, summary: outcomes.map(({ per_seed_controls, ...rest }) => rest) }, null, 2));

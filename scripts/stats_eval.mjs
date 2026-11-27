#!/usr/bin/env node
/**
 * ULTRAMETRICA (v1.8.0) — Pre-Registered Confirmatory Statistical Evaluation (Experiment I).
 *
 * Implements Build Standard B28 (20 fixed seeds + RMT control arm), B29 (10,000-resample
 * Monte Carlo permutation test + Mann-Whitney U + non-pseudoreplicated matrix-level sign,
 * Wilcoxon signed-rank & empirical rank tests), B30 (mean diff, Cliff's delta, Cohen's d
 * with seeded 10,000-resample 95% bootstrap CIs for ALL THREE effect sizes), and B31
 * (Holm-Bonferroni FWER correction) strictly per docs/preregistration.md & DEVIATIONS.md.
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

/** Abramowitz-Stegun 7.1.26 erfc approximation (max abs error < 1.5e-7) for normal two-sided p-values. */
function normalTwoSidedP(z) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return Math.max(0, Math.min(1, poly * Math.exp(-x * x)));
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
        const eIm = aIm / mag;
        const app = R[p * M + p];
        const aqq = R[q * M + q];
        const tau = (aqq - app) / (2 * mag);
        const t = tau >= 0 ? 1 / (tau + Math.sqrt(1 + tau * tau)) : -1 / (-tau + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;

        for (let k = 0; k < M; k++) {
          if (k === p || k === q) continue;
          const kpRe = R[k * M + p], kpIm = I[k * M + p];
          const kqRe = R[k * M + q], kqIm = I[k * M + q];

          const rotKqRe = eRe * kqRe + eIm * kqIm;
          const rotKqIm = eRe * kqIm - eIm * kqRe;
          const nkpRe = c * kpRe - s * rotKqRe;
          const nkpIm = c * kpIm - s * rotKqIm;

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

/** Exact two-sample Mann-Whitney U statistic with tie correction and normal two-sided p-value. */
function mannWhitneyU(x, y) {
  const n1 = x.length;
  const n2 = y.length;
  const items = new Array(n1 + n2);
  for (let i = 0; i < n1; i++) items[i] = { v: x[i], g: 0 };
  for (let j = 0; j < n2; j++) items[n1 + j] = { v: y[j], g: 1 };
  items.sort((a, b) => a.v - b.v);

  let rankSumX = 0;
  let tieCorrection = 0;
  let i = 0;
  while (i < items.length) {
    let j = i + 1;
    while (j < items.length && items[j].v === items[i].v) j++;
    const avgRank = 0.5 * (i + 1 + j);
    const t = j - i;
    if (t > 1) tieCorrection += t * t * t - t;
    for (let k = i; k < j; k++) {
      if (items[k].g === 0) rankSumX += avgRank;
    }
    i = j;
  }

  const u1 = rankSumX - (n1 * (n1 + 1)) / 2;
  const u2 = n1 * n2 - u1;
  const uMin = Math.min(u1, u2);
  const N = n1 + n2;
  const muU = (n1 * n2) / 2;
  const varU = ((n1 * n2) / 12) * (N + 1 - tieCorrection / (N * (N - 1)));
  const z = varU > 0 ? (u1 - muU) / Math.sqrt(varU) : 0;
  const p = normalTwoSidedP(z);
  return {
    u_statistic: Number(u1.toFixed(1)),
    u_min: Number(uMin.toFixed(1)),
    z_score: Number(z.toFixed(4)),
    p_normal_approx: Number(p.toExponential(3)),
  };
}

function cohensD(x, y) {
  const mx = mean(x), my = mean(y);
  const vx = std(x, mx) ** 2, vy = std(y, my) ** 2;
  const pooled = Math.sqrt(((x.length - 1) * vx + (y.length - 1) * vy) / (x.length + y.length - 2));
  return pooled > 0 ? (mx - my) / pooled : 0;
}

/** Exact pre-registered two-sided Monte Carlo permutation test (identical sequence to v1.4.0 seal). */
function permutationTestTwoSided(x, y, resamples, seed) {
  const rng = mulberry32(seed);
  const obs = Math.abs(mean(x) - mean(y));
  const combined = Float64Array.from([...x, ...y]);
  const nX = x.length;
  const N = combined.length;
  let sumAll = 0;
  for (let i = 0; i < N; i++) sumAll += combined[i];
  let extreme = 0;
  for (let b = 0; b < resamples; b++) {
    let sumX = 0;
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

/** Pre-registered 10,000-resample bootstrap 95% CI for mean difference (preserves exact v1.4.0 stream). */
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

/**
 * Seeded 10,000-resample bootstrap 95% CIs for Cliff's delta and Cohen's d (DEVIATIONS.md #1 / F56).
 * Uses O((n1+n2) log(n1+n2)) sorted rank sweep for exact Cliff's delta inside each resample.
 */
function bootstrapEffectSizeCIs(x, y, resamples, seed) {
  const rng = mulberry32(seed);
  const n1 = x.length;
  const n2 = y.length;
  const xs = new Float64Array(n1);
  const ys = new Float64Array(n2);
  const ds = new Float64Array(resamples);
  const cds = new Float64Array(resamples);
  const invPair = 1 / (n1 * n2);

  for (let b = 0; b < resamples; b++) {
    let sx = 0, sx2 = 0;
    for (let i = 0; i < n1; i++) {
      const v = x[Math.floor(rng() * n1)];
      xs[i] = v;
      sx += v;
      sx2 += v * v;
    }
    let sy = 0, sy2 = 0;
    for (let j = 0; j < n2; j++) {
      const v = y[Math.floor(rng() * n2)];
      ys[j] = v;
      sy += v;
      sy2 += v * v;
    }
    const mx = sx / n1;
    const my = sy / n2;
    const vx = Math.max(0, (sx2 - n1 * mx * mx) / Math.max(1, n1 - 1));
    const vy = Math.max(0, (sy2 - n2 * my * my) / Math.max(1, n2 - 1));
    const pooled = Math.sqrt(((n1 - 1) * vx + (n2 - 1) * vy) / (n1 + n2 - 2));
    ds[b] = pooled > 0 ? (mx - my) / pooled : 0;

    xs.sort();
    ys.sort();
    let gt = 0, lt = 0, lo = 0, hi = 0;
    for (let i = 0; i < n1; i++) {
      const v = xs[i];
      while (lo < n2 && ys[lo] < v) lo++;
      if (hi < lo) hi = lo;
      while (hi < n2 && ys[hi] <= v) hi++;
      gt += lo;
      lt += n2 - hi;
    }
    cds[b] = (gt - lt) * invPair;
  }

  ds.sort();
  cds.sort();
  return {
    cliffs_delta_95ci: [
      Number(cds[Math.floor(0.025 * resamples)].toFixed(4)),
      Number(cds[Math.floor(0.975 * resamples)].toFixed(4)),
    ],
    cohens_d_95ci: [
      Number(ds[Math.floor(0.025 * resamples)].toFixed(4)),
      Number(ds[Math.floor(0.975 * resamples)].toFixed(4)),
    ],
  };
}

/**
 * Non-pseudoreplicated matrix-level sensitivity analysis (DEVIATIONS.md #2 / F56):
 * Treats each independent RMT matrix seed as ONE statistical unit (N = 20 independent draws,
 * eliminating adjacent-eigenvalue dependence!).
 */
function matrixLevelInference(treatMean, seedMeans) {
  const K = seedMeans.length;
  const ctrlGrandMean = mean(seedMeans);
  const ctrlSeedStd = std(seedMeans, ctrlGrandMean);
  const diffs = seedMeans.map((s) => treatMean - s);
  const nPos = diffs.filter((d) => d > 0).length;
  const nNeg = diffs.filter((d) => d < 0).length;
  const kMin = Math.min(nPos, nNeg);

  let comb = 1;
  let tailSum = 1;
  for (let j = 1; j <= kMin; j++) {
    comb = (comb * (K - j + 1)) / j;
    tailSum += comb;
  }
  const pSignExact = Math.min(1, (2 * tailSum) / 2 ** K);

  const ranked = diffs
    .map((d) => ({ abs: Math.abs(d), sign: d >= 0 ? 1 : -1 }))
    .filter((x) => x.abs > 0)
    .sort((a, b) => a.abs - b.abs);
  let wPlus = 0;
  let wMinus = 0;
  for (let i = 0; i < ranked.length; i++) {
    const rank = i + 1;
    if (ranked[i].sign > 0) wPlus += rank;
    else wMinus += rank;
  }
  const wMin = Math.min(wPlus, wMinus);
  const nW = ranked.length;
  const dp = new Float64Array(wMin + 1);
  dp[0] = 1;
  for (let r = 1; r <= nW; r++) {
    for (let s = wMin; s >= r; s--) dp[s] += dp[s - r];
  }
  let ways = 0;
  for (let s = 0; s <= wMin; s++) ways += dp[s];
  const pWilcoxonExact = Math.min(1, (2 * ways) / 2 ** nW);

  const zMatrix = ctrlSeedStd > 0 ? (treatMean - ctrlGrandMean) / ctrlSeedStd : 0;
  const moreExtreme = seedMeans.filter((s) => Math.abs(s - ctrlGrandMean) >= Math.abs(treatMean - ctrlGrandMean)).length;
  const pEmpiricalRank = (moreExtreme + 1) / (K + 1);

  return {
    n_independent_control_matrices: K,
    control_matrix_mean_of_means: Number(ctrlGrandMean.toFixed(6)),
    control_matrix_std_of_means: Number(ctrlSeedStd.toFixed(6)),
    matrix_level_z_score: Number(zMatrix.toFixed(2)),
    sign_test_exact_p: Number(pSignExact.toExponential(3)),
    wilcoxon_w_min: wMin,
    wilcoxon_exact_p: Number(pWilcoxonExact.toExponential(3)),
    empirical_rank_p: Number(pEmpiricalRank.toFixed(6)),
  };
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
  const effectCIs = bootstrapEffectSizeCIs(treatRatios, ctrl.pooled, BOOT_RESAMPLES, 20261126);
  const mw = mannWhitneyU(treatRatios, ctrl.pooled);
  const cd = cliffsDelta(treatRatios, ctrl.pooled);
  const d = cohensD(treatRatios, ctrl.pooled);
  const matrixLevel = matrixLevelInference(treatMean, ctrl.perSeed.map((s) => s.mean_r));
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
    bootstrap_95ci_cliffs_delta: effectCIs.cliffs_delta_95ci,
    cohens_d: Number(d.toFixed(4)),
    bootstrap_95ci_cohens_d: effectCIs.cohens_d_95ci,
    mann_whitney_u: mw,
    matrix_level_sensitivity: matrixLevel,
    p_perm_raw: Number(pPerm.toFixed(6)),
    seeds_in_predicted_direction: `${seedsMatchingDirection}/${SEEDS.length}`,
    expected_sign: h.expectedSign,
    per_seed_controls: ctrl.perSeed,
  });
}

const adjP = holmBonferroni(outcomes.map((o) => o.p_perm_raw));
const adjWilcoxon = holmBonferroni(outcomes.map((o) => Number(o.matrix_level_sensitivity.wilcoxon_exact_p)));
for (let i = 0; i < outcomes.length; i++) {
  outcomes[i].p_holm_adjusted = Number(adjP[i].toFixed(6));
  outcomes[i].matrix_level_sensitivity.wilcoxon_holm_adjusted_p = Number(adjWilcoxon[i].toExponential(3));
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
  deviations_file: 'DEVIATIONS.md',
  config: {
    control_seeds: SEEDS,
    permutation_resamples: PERM_RESAMPLES,
    bootstrap_resamples: BOOT_RESAMPLES,
    resampling_seed_primary: 20261125,
    resampling_seed_effect_cis: 20261126,
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

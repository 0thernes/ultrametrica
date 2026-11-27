/**
 * ULTRAMETRICA (v1.6.0) — TRUE Source-Code Mutation Testing Suite (Build Standard B13, F52).
 *
 * Unlike synthetic mock tests, EVERY mutant below copies the real production `src/` tree
 * and real `test/verify.mjs` into an isolated temporary directory, mutates ONE real line
 * of production source code in `src/engine/{padic,holography,quantum}.js`, executes the
 * REAL verification suite (`node --test test/verify.mjs`) in a subprocess, and asserts
 * non-zero exit (mutant KILLED) and cleanup in `finally`.
 *
 *   M1 (`padic.js`):      Flip Radix-p FFT butterfly root imaginary sign
 *   M2 (`holography.js`): Drop asymptotic root Robin impedance term
 *   M3 (`holography.js`): Break BTZ horizon shortest-path ring metric feeding Dijkstra W1
 *   M4 (`holography.js`): Flip Kerr-BTZ gauge conjugation sign on subdiagonal
 *   M5 (`quantum.js`):    Downgrade 4th-order Yoshida weights to 2nd-order Strang
 *   M6 (`holography.js`): Break 2-case BTZ horizon-ring Ryu-Takayanagi Cycle DP
 *   M7 (`holography.js`): Replace symmetric Jacobi `_sigmaSnap` with in-place Gauss-Seidel
 *   M8 (`holography.js`): Drop `Math.abs` in bridge Wasserstein (breaks Theorem V supercritical pinch)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MUTANTS = [
  {
    id: 'M1',
    name: 'Flipped Radix-p Pontryagin FFT butterfly sign breaks Theorem 1 & Theorem 9',
    relFile: 'src/engine/padic.js',
    target: 'this.radixFwdIm[idx] = -s;',
    replacement: 'this.radixFwdIm[idx] = s;',
    expectedTheorem: 'Theorem 1',
  },
  {
    id: 'M2',
    name: 'Dropping asymptotic root Robin impedance fails Theorem 6 Gubser analytic propagator',
    relFile: 'src/engine/holography.js',
    target: 'diag += muU * (1.0 - this.p ** (-this.delta));',
    replacement: 'diag += 0;',
    expectedTheorem: 'Theorem 6',
  },
  {
    id: 'M3',
    name: 'Corrupted BTZ horizon ring shortest-path metric breaks Johnson Dijkstra W1 (Theorem 9)',
    relFile: 'src/engine/holography.js',
    target: 'hDist[i * L + j] = cw < ccw ? cw : ccw;',
    replacement: 'hDist[i * L + j] = cw;',
    expectedTheorem: 'Theorem 9',
  },
  {
    id: 'M4',
    name: 'Reversed Kerr-BTZ gauge conjugation sign breaks uneliminated Klein-Gordon residual (Theorem 5)',
    relFile: 'src/engine/holography.js',
    target: 'hSubIm[j] = wj * sinT;',
    replacement: 'hSubIm[j] = -wj * sinT;',
    expectedTheorem: 'Theorem 5',
  },
  {
    id: 'M5',
    name: 'Downgrading 4th-order Yoshida weights to 2nd-order Strang fails dt^4 scaling gate (Theorem 4)',
    relFile: 'src/engine/quantum.js',
    target: 'const YOSHIDA_STEPS = [YOSHIDA_W1, YOSHIDA_W0, YOSHIDA_W1];',
    replacement: 'const YOSHIDA_STEPS = [0.5, 0.0, 0.5];',
    expectedTheorem: 'Theorem 4',
  },
  {
    id: 'M6',
    name: 'Horizon-blind Ryu-Takayanagi Cycle DP fails brute-force BTZ min-cut equality (Theorem 8)',
    relFile: 'src/engine/holography.js',
    target: 'for (let firstSide = 0; firstSide <= 1; firstSide++) {',
    replacement: 'for (let firstSide = 0; firstSide <= 0; firstSide++) {',
    expectedTheorem: 'Theorem 8',
  },
  {
    id: 'M7',
    name: 'In-place Gauss-Seidel gravity update breaks sibling edge symmetry on T_p (Theorem 10)',
    relFile: 'src/engine/holography.js',
    target: 'const snap = this._sigmaSnap;\n    snap.set(sigma);',
    replacement: 'const snap = sigma;',
    expectedTheorem: 'Theorem 10',
  },
  {
    id: 'M8',
    name: 'Dropping Math.abs in curved tree Wasserstein breaks Theorem V supercritical pinch (Theorem 10)',
    relFile: 'src/engine/holography.js',
    target: 'w1 += auv * Math.abs(1.0 - wuv * invWu - wuv * invWv);',
    replacement: 'w1 += auv * (1.0 - wuv * invWu - wuv * invWv);',
    expectedTheorem: 'Theorem 10',
  },
];

function runMutantAgainstRealSuite(mutant) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `ultrametrica-mutant-${mutant.id}-`));
  try {
    fs.cpSync(path.join(ROOT, 'src'), path.join(tmpDir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'test'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'test', 'verify.mjs'), path.join(tmpDir, 'test', 'verify.mjs'));
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'ultrametrica-mutant-sandbox', type: 'module' }),
      'utf8'
    );

    const targetPath = path.join(tmpDir, mutant.relFile);
    const original = fs.readFileSync(targetPath, 'utf8');
    const occurrences = original.split(mutant.target).length - 1;
    assert.equal(
      occurrences,
      1,
      `Mutant ${mutant.id} target snippet must appear exactly once in ${mutant.relFile} (found ${occurrences})`
    );
    fs.writeFileSync(targetPath, original.replace(mutant.target, mutant.replacement), 'utf8');

    const childEnv = { ...process.env };
    delete childEnv.NODE_TEST_CONTEXT;
    const res = spawnSync(process.execPath, ['--test', 'test/verify.mjs'], {
      cwd: tmpDir,
      env: childEnv,
      encoding: 'utf8',
      timeout: 30_000,
    });
    return {
      status: res.status,
      output: `${res.stdout || ''}\n${res.stderr || ''}`,
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

for (const mutant of MUTANTS) {
  test(`Real Source Mutant ${mutant.id} KILLED (${mutant.relFile}): ${mutant.name}`, () => {
    const { status, output } = runMutantAgainstRealSuite(mutant);
    assert.notEqual(
      status,
      0,
      `SURVIVING MUTANT ${mutant.id}! Real test/verify.mjs unexpectedly exited 0 after mutating ${mutant.relFile}.`
    );
    assert.ok(
      output.includes(mutant.expectedTheorem),
      `Mutant ${mutant.id} exited ${status}, but output did not report failing ${mutant.expectedTheorem}:\n${output.slice(0, 800)}`
    );
  });
}

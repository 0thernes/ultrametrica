/**
 * ULTRAMETRICA — 4th-Order Yoshida Symplectic Nonlinear p-adic Schrödinger
 * (Vladimirov-Gross-Pitaevskii) + Adelic Hybrid + Archimedean R Twin Engine.
 *
 * Solves simultaneously:
 *   1. Non-Archimedean / Adelic Quantum Field on Z_p / p^n Z_p:
 *        i d/dt psi = [ theta * D_p^alpha + (1 - theta) * (-Delta_R)^{alpha/2}
 *                       + V_grav(x, t) + g * |psi|^2 ] psi
 *      using an exact time-reversible 4th-order Yoshida symplectic composition
 *      over exact Radix-p Pontryagin FFTs (unitarity preserved to ~1e-14).
 *
 *   2. Synchronized Archimedean Twin on R / Z (identical initial spatial profile
 *      on the Monna-map circle and identical spectral energy scale):
 *        i d/dt psi_R = [ (-Delta_R)^{alpha/2} + V_grav + g * |psi_R|^2 ] psi_R
 */

// Exact Yoshida 4th-order symplectic composition weights
const CBRT2 = Math.cbrt(2);
const YOSHIDA_W1 = 1 / (2 - CBRT2);
const YOSHIDA_W0 = -CBRT2 / (2 - CBRT2);
const YOSHIDA_STEPS = [YOSHIDA_W1, YOSHIDA_W0, YOSHIDA_W1];

export class PadicQuantumEngine {
  /**
   * @param {import('./padic.js').PadicSpace} space
   */
  constructor(space) {
    this.space = space;
    this.p = space.p;
    this.n = space.n;
    this.N = space.N;

    // Quantum parameters
    this.alpha = 1.0;        // Vladimirov fractional exponent alpha > 0
    this.nonlinearity = 0.0; // Gross-Pitaevskii self-interaction g
    this.adelicMix = 1.0;    // 1.0 = pure Q_p, 0.0 = pure R, (0, 1) = Adelic hybrid

    // p-adic state psi(x) indexed by p-adic integer x in [0, N-1]
    this.psiRe = new Float64Array(this.N);
    this.psiIm = new Float64Array(this.N);

    // Leaf-ordered (Monna-map) copy of psi for boundary / bulk / rendering
    this.leafRe = new Float64Array(this.N);
    this.leafIm = new Float64Array(this.N);

    // Synchronized Archimedean R Twin state psi_R(l) indexed by circle position l in [0, N-1]
    this.twinRe = new Float64Array(this.N);
    this.twinIm = new Float64Array(this.N);

    // External gravitational potential (stored in both leaf order and p-adic x order)
    this.potentialLeaf = new Float64Array(this.N);
    this.potentialPadic = new Float64Array(this.N);

    // Spectra (raw Vladimirov and scaled physical operators)
    this.rawVladimirovSpec = new Float64Array(this.N);
    this.vladimirovSpec = new Float64Array(this.N);
    this.archimedeanSpec = new Float64Array(this.N);
    this.kineticScale = 1.0;

    // Scratch buffers (zero per-frame GC)
    this._freqRe = new Float64Array(this.N);
    this._freqIm = new Float64Array(this.N);
    this._tmpLeafRe = new Float64Array(this.N);
    this._tmpLeafIm = new Float64Array(this.N);
    this._tmpFreqRe = new Float64Array(this.N);
    this._tmpFreqIm = new Float64Array(this.N);

    // Spectral telemetry: probability per Pontryagin valuation shell (0..n)
    this.dualShellPower = new Float64Array(this.n + 1);
    this.kozyrevShellPower = new Float64Array(this.n + 1);
    this.kozyrevShellCentroid = new Float64Array(this.n + 1);
    this.dualSpectrumMag = new Float64Array(this.N);

    // Tracked support ball [leafStart, leafEnd) for live Kozyrev trapping / leakage proof
    this.trackedLeafStart = 0;
    this.trackedLeafEnd = this.N;

    // Live exact diagnostics
    this.time = 0;
    this.normPadic = 1;
    this.normDriftPadic = 0;
    this.normTwin = 1;
    this.energyPadic = 0;
    this.energyTwin = 0;
    this.initialEnergyPadic = 0;
    this.iprPadic = 0;
    this.iprTwin = 0;
    this.leakagePadic = 0;
    this.leakageTwin = 0;
    this.shannonPadic = 0;
    this.shannonTwin = 0;

    this._rebuildSpectra();
  }

  setAlpha(alpha) {
    const clamped = Math.max(0.15, Math.min(2.2, alpha));
    if (Math.abs(clamped - this.alpha) > 1e-12) {
      this.alpha = clamped;
      this._rebuildSpectra();
    }
  }

  _rebuildSpectra() {
    const rawV = this.space.vladimirovSpectrum(this.alpha);
    const rawA = this.space.archimedeanSpectrum(this.alpha);
    this.rawVladimirovSpec.set(rawV);

    // Characteristic physical frequency scale so time step dt is well-conditioned
    // across all primes p in {2, 3, 5, 7} and exponents alpha.
    // Specifically, normalize by the median valuation shell p^{alpha * ceil(n / 2)} / 2.5
    // while keeping the EXACT eigenvalue ratio between every pair of shells!
    const midShell = Math.max(1, Math.round(this.n * 0.55));
    this.kineticScale = 2.5 / (this.p ** (this.alpha * midShell));

    let rmsV = 0;
    let rmsA = 0;
    for (let k = 1; k < this.N; k++) {
      const sv = rawV[k] * this.kineticScale;
      this.vladimirovSpec[k] = sv;
      rmsV += sv * sv;
      rmsA += rawA[k] * rawA[k];
    }
    this.vladimirovSpec[0] = 0;

    // Calibrate Archimedean R Twin spectral RMS identically to Q_p so the Reality Split
    // comparison runs at the exact same physical kinetic energy scale!
    const archFactor = rmsA > 0 ? Math.sqrt(rmsV / rmsA) : 1.0;
    this.archimedeanSpec[0] = 0;
    for (let k = 1; k < this.N; k++) {
      this.archimedeanSpec[k] = rawA[k] * archFactor;
    }
  }

  /** Set external gravitational potential from bulk (provided in leaf order). */
  setPotentialLeaf(potLeaf) {
    this.potentialLeaf.set(potLeaf);
    const rev = this.space.revTable;
    for (let l = 0; l < this.N; l++) {
      this.potentialPadic[rev[l]] = potLeaf[l];
    }
  }

  /** Sync leaf-ordered cache leafRe/leafIm from p-adic psiRe/psiIm. */
  syncLeafCache() {
    const rev = this.space.revTable;
    for (let l = 0; l < this.N; l++) {
      const x = rev[l];
      this.leafRe[l] = this.psiRe[x];
      this.leafIm[l] = this.psiIm[x];
    }
  }

  /** Normalize a state vector (re, im) to exact unit L2 norm. */
  _normalize(re, im) {
    let norm2 = 0;
    for (let i = 0; i < this.N; i++) {
      norm2 += re[i] * re[i] + im[i] * im[i];
    }
    if (norm2 > 1e-30) {
      const inv = 1 / Math.sqrt(norm2);
      for (let i = 0; i < this.N; i++) {
        re[i] *= inv;
        im[i] *= inv;
      }
    }
  }

  /**
   * Initialize BOTH Q_p and the Archimedean R Twin from the EXACT same initial wavefunction
   * (provided in p-adic x order), and set tracked support ball [leafStart, leafEnd).
   */
  setState(rePadic, imPadic, trackedLeafStart = 0, trackedLeafEnd = this.N) {
    this.psiRe.set(rePadic);
    this.psiIm.set(imPadic);
    this._normalize(this.psiRe, this.psiIm);
    this.syncLeafCache();

    // Twin starts with the IDENTICAL spatial wavefunction on the Monna circle
    this.twinRe.set(this.leafRe);
    this.twinIm.set(this.leafIm);

    this.trackedLeafStart = trackedLeafStart;
    this.trackedLeafEnd = trackedLeafEnd;
    this.time = 0;
    this.computeDiagnostics();
    this.initialEnergyPadic = this.energyPadic;
  }

  /**
   * Inject (superpose) an exact Kozyrev p-adic wavelet psi_{j, b, m} into BOTH
   * Q_p and the Archimedean Twin (renormalizing cleanly to unit L2 norm).
   */
  injectKozyrevWavelet(j, ballIndex, characterM = 1, amplitude = 0.85, replace = false) {
    const w = this.space.createKozyrevWavelet(j, ballIndex, characterM);
    if (replace) {
      this.setState(w.re, w.im, w.leafStart, w.leafEnd);
      return w;
    }

    const rev = this.space.revTable;
    for (let x = 0; x < this.N; x++) {
      this.psiRe[x] += amplitude * w.re[x];
      this.psiIm[x] += amplitude * w.im[x];
    }
    for (let l = 0; l < this.N; l++) {
      const x = rev[l];
      this.twinRe[l] += amplitude * w.re[x];
      this.twinIm[l] += amplitude * w.im[x];
    }

    this._normalize(this.psiRe, this.psiIm);
    this._normalize(this.twinRe, this.twinIm);
    this.syncLeafCache();
    this.trackedLeafStart = w.leafStart;
    this.trackedLeafEnd = w.leafEnd;
    this.computeDiagnostics();
    return w;
  }

  /**
   * Exact nonlinear + potential phase rotation step:
   *   psi <- exp(-i * dt * (V + g * |psi|^2)) * psi
   */
  _applyPotentialNonlinearStep(re, im, pot, g, dt) {
    const N = this.N;
    for (let i = 0; i < N; i++) {
      const r = re[i];
      const m = im[i];
      const phase = -dt * (pot[i] + g * (r * r + m * m));
      const c = Math.cos(phase);
      const s = Math.sin(phase);
      re[i] = r * c - m * s;
      im[i] = r * s + m * c;
    }
  }

  /**
   * Exact unitary linear kinetic step in Fourier space:
   *   psi <- IFFT( exp(-i * dt * weight * spec[k]) * FFT(psi) )
   */
  _applyKineticFFT(re, im, spec, scaleDt) {
    if (Math.abs(scaleDt) < 1e-18) return;
    const fRe = this._freqRe;
    const fIm = this._freqIm;
    this.space.fft(re, im, fRe, fIm);
    const N = this.N;
    for (let k = 0; k < N; k++) {
      const phase = -scaleDt * spec[k];
      const c = Math.cos(phase);
      const s = Math.sin(phase);
      const a = fRe[k];
      const b = fIm[k];
      fRe[k] = a * c - b * s;
      fIm[k] = a * s + b * c;
    }
    this.space.ifft(fRe, fIm, re, im);
  }

  /**
   * Exact unitary Archimedean kinetic step applied to a p-adic-ordered state
   * (used during Adelic Hybrid Morph 0 <= theta < 1):
   * converts x-order -> leaf-order, applies (-Delta_R)^{alpha/2} via FFT, converts back.
   */
  _applyArchimedeanToPadic(re, im, scaleDt) {
    if (Math.abs(scaleDt) < 1e-18) return;
    const rev = this.space.revTable;
    const lRe = this._tmpLeafRe;
    const lIm = this._tmpLeafIm;
    const N = this.N;
    for (let l = 0; l < N; l++) {
      const x = rev[l];
      lRe[l] = re[x];
      lIm[l] = im[x];
    }
    this._applyKineticFFT(lRe, lIm, this.archimedeanSpec, scaleDt);
    for (let l = 0; l < N; l++) {
      const x = rev[l];
      re[x] = lRe[l];
      im[x] = lIm[l];
    }
  }

  /**
   * Single symmetric 2nd-order Strang step S_2(tau) for Q_p / Adelic state.
   */
  _strangStepPadic(tau) {
    const theta = this.adelicMix;
    const g = this.nonlinearity;
    const half = 0.5 * tau;

    // 1. Half nonlinear + potential step
    this._applyPotentialNonlinearStep(this.psiRe, this.psiIm, this.potentialPadic, g, half);

    if (theta >= 1.0 - 1e-12) {
      // Pure Non-Archimedean Q_p: exact single Vladimirov kinetic step
      this._applyKineticFFT(this.psiRe, this.psiIm, this.vladimirovSpec, tau);
    } else if (theta <= 1e-12) {
      // Pure Archimedean R
      this._applyArchimedeanToPadic(this.psiRe, this.psiIm, tau);
    } else {
      // Symmetric Adelic Hybrid Split: B(tau/2) C(tau) B(tau/2)
      this._applyArchimedeanToPadic(this.psiRe, this.psiIm, (1.0 - theta) * half);
      this._applyKineticFFT(this.psiRe, this.psiIm, this.vladimirovSpec, theta * tau);
      this._applyArchimedeanToPadic(this.psiRe, this.psiIm, (1.0 - theta) * half);
    }

    // 2. Half nonlinear + potential step
    this._applyPotentialNonlinearStep(this.psiRe, this.psiIm, this.potentialPadic, g, half);
  }

  /**
   * Single symmetric 2nd-order Strang step S_2(tau) for Archimedean R Twin.
   */
  _strangStepTwin(tau) {
    const g = this.nonlinearity;
    const half = 0.5 * tau;
    this._applyPotentialNonlinearStep(this.twinRe, this.twinIm, this.potentialLeaf, g, half);
    this._applyKineticFFT(this.twinRe, this.twinIm, this.archimedeanSpec, tau);
    this._applyPotentialNonlinearStep(this.twinRe, this.twinIm, this.potentialLeaf, g, half);
  }

  /**
   * Advance BOTH Q_p/Adelic universe and Archimedean R Twin by dt using
   * exact 4th-order Yoshida symplectic integration:
   *   S_4(dt) = S_2(w_1 * dt) o S_2(w_0 * dt) o S_2(w_1 * dt).
   */
  step(dt, substeps = 1) {
    const h = dt / substeps;
    for (let s = 0; s < substeps; s++) {
      for (let y = 0; y < 3; y++) {
        const tau = YOSHIDA_STEPS[y] * h;
        this._strangStepPadic(tau);
        this._strangStepTwin(tau);
      }
    }
    this.time += dt;
    this.syncLeafCache();
    this.computeDiagnostics();
  }

  /**
   * Compute exact real-time quantum invariants:
   *   - L2 norm & drift
   *   - Total Hamiltonian expectation <H> = <T> + <V> + (g/2) sum |psi|^4
   *   - Inverse Participation Ratio (IPR) & Shannon spatial entropy
   *   - Exact probability leakage outside tracked p-adic support ball
   *   - Pontryagin-dual valuation shell spectrum & Fast Kozyrev wavelet shell power
   */
  computeDiagnostics() {
    const N = this.N;
    const g = this.nonlinearity;
    const theta = this.adelicMix;

    // 1. Q_p / Adelic kinetic energy in Pontryagin dual space + dual valuation shell spectrum
    this.space.fft(this.psiRe, this.psiIm, this._tmpFreqRe, this._tmpFreqIm);
    this.dualShellPower.fill(0);

    let kinPadicV = 0;
    const vTab = this.space.valuationTable;
    for (let k = 0; k < N; k++) {
      const p2 = this._tmpFreqRe[k] ** 2 + this._tmpFreqIm[k] ** 2;
      this.dualSpectrumMag[k] = p2;
      const shell = k === 0 ? 0 : this.n - vTab[k];
      this.dualShellPower[shell] += p2;
      kinPadicV += this.vladimirovSpec[k] * p2;
    }

    let kinPadicA = 0;
    if (theta < 1.0 - 1e-12) {
      this.space.fft(this.leafRe, this.leafIm, this._tmpFreqRe, this._tmpFreqIm);
      for (let k = 0; k < N; k++) {
        const p2 = this._tmpFreqRe[k] ** 2 + this._tmpFreqIm[k] ** 2;
        kinPadicA += this.archimedeanSpec[k] * p2;
      }
    }

    // 2. Twin kinetic energy
    this.space.fft(this.twinRe, this.twinIm, this._tmpFreqRe, this._tmpFreqIm);
    let kinTwin = 0;
    for (let k = 0; k < N; k++) {
      const p2 = this._tmpFreqRe[k] ** 2 + this._tmpFreqIm[k] ** 2;
      kinTwin += this.archimedeanSpec[k] * p2;
    }

    // 3. Position-space norms, potential/interaction energy, IPR, Shannon entropy, ball leakage
    let normP = 0;
    let normT = 0;
    let potP = 0;
    let potT = 0;
    let iprP = 0;
    let iprT = 0;
    let shP = 0;
    let shT = 0;
    let inBallP = 0;
    let inBallT = 0;

    const s0 = this.trackedLeafStart;
    const s1 = this.trackedLeafEnd;

    for (let l = 0; l < N; l++) {
      const pP = this.leafRe[l] ** 2 + this.leafIm[l] ** 2;
      const pT = this.twinRe[l] ** 2 + this.twinIm[l] ** 2;
      normP += pP;
      normT += pT;
      potP += this.potentialLeaf[l] * pP;
      potT += this.potentialLeaf[l] * pT;
      iprP += pP * pP;
      iprT += pT * pT;
      if (pP > 1e-18) shP -= pP * Math.log(pP);
      if (pT > 1e-18) shT -= pT * Math.log(pT);
      if (l >= s0 && l < s1) {
        inBallP += pP;
        inBallT += pT;
      }
    }

    this.normPadic = normP;
    this.normDriftPadic = Math.abs(normP - 1.0);
    this.normTwin = normT;
    this.energyPadic = theta * kinPadicV + (1.0 - theta) * kinPadicA + potP + 0.5 * g * iprP;
    this.energyTwin = kinTwin + potT + 0.5 * g * iprT;
    this.iprPadic = iprP;
    this.iprTwin = iprT;
    this.shannonPadic = shP;
    this.shannonTwin = shT;
    this.leakagePadic = Math.max(0, normP - inBallP);
    this.leakageTwin = Math.max(0, normT - inBallT);

    // 4. Exact O(N) Fast Kozyrev Wavelet decomposition (powers + spatial centroids for audio)
    const kt = this.space.kozyrevTransform(this.psiRe, this.psiIm);
    this.kozyrevShellPower.set(kt.shellPower);
    this.kozyrevShellCentroid.set(kt.shellCentroid);
  }
}

/**
 * ULTRAMETRICA — Real-Time 48 kHz Non-Archimedean AudioWorkletProcessor.
 *
 * Synthesizes exact prime-power Vladimirov harmonic shells:
 *   f_s = f_0 * p^{beta * s}
 * producing genuine non-octave acoustic geometries (tritaves for p=3,
 * pentaves for p=5, heptaves for p=7), phase-modulated by Kerr-BTZ black hole
 * horizon currents and live gravitational edge-length strain, with stereo imaging
 * derived directly from each shell's p-adic Monna-map spatial centroid.
 */

const TWO_PI = 2 * Math.PI;
const MAX_SHELLS = 10;

class PadicSynthProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.p = 3;
    this.n = 5;
    this.alpha = 1.0;
    this.isBTZ = false;
    this.masterGain = 0.24;
    this.smoothGain = 0.24;
    this.smoothBtzMix = 0.0;

    this.targetAmp = new Float32Array(MAX_SHELLS);
    this.smoothAmp = new Float32Array(MAX_SHELLS);
    this.targetPan = new Float32Array(MAX_SHELLS).fill(0.5);
    this.smoothPan = new Float32Array(MAX_SHELLS).fill(0.5);
    this.targetFreq = new Float32Array(MAX_SHELLS).fill(110);
    this.smoothFreq = new Float32Array(MAX_SHELLS).fill(110);
    this.phase = new Float64Array(MAX_SHELLS);
    this.modPhase = new Float64Array(MAX_SHELLS);

    // Crisp transient envelope per shell triggered when injecting Kozyrev wavelets
    this.pluckEnv = new Float32Array(MAX_SHELLS);

    this.horizonCurrent = 0;
    this.smoothHorizon = 0;
    this.gravStrain = 0;
    this.smoothGrav = 0;
    this.dronePhase = 0;
    this.droneModPhase = 0;

    this._recomputeFrequencies();

    this.port.onmessage = (event) => {
      const msg = event.data;
      if (!msg) return;

      if (msg.type === 'state') {
        const nextP = Number.isFinite(msg.p) && msg.p >= 2 ? msg.p : this.p;
        const nextN = Number.isFinite(msg.n) && msg.n >= 1 ? msg.n : this.n;
        const nextAlpha = Number.isFinite(msg.alpha) ? msg.alpha : this.alpha;
        const changedTuning = nextP !== this.p || nextN !== this.n || Math.abs(nextAlpha - this.alpha) > 1e-4;
        this.p = nextP;
        this.n = nextN;
        this.alpha = nextAlpha;
        this.isBTZ = !!msg.isBTZ;
        this.horizonCurrent = Number.isFinite(msg.horizonCurrent) ? msg.horizonCurrent : 0;
        this.gravStrain = Number.isFinite(msg.gravStrain) ? Math.max(0, msg.gravStrain) : 0;
        if (Number.isFinite(msg.masterGain)) {
          this.masterGain = Math.max(0, Math.min(1.0, msg.masterGain));
        }

        if (Array.isArray(msg.shellFreqs) && msg.shellFreqs.length > 0) {
          const countF = Math.min(MAX_SHELLS, msg.shellFreqs.length);
          for (let s = 0; s < countF; s++) {
            const f = msg.shellFreqs[s];
            if (Number.isFinite(f) && f > 10 && f < 16000) this.targetFreq[s] = f;
          }
        } else if (changedTuning) {
          this._recomputeFrequencies();
        }

        const powers = msg.shellPower;
        const centroids = msg.shellCentroid;
        if (powers) {
          const count = Math.min(MAX_SHELLS, powers.length);
          for (let s = 0; s < MAX_SHELLS; s++) {
            if (s < count) {
              const pwr = Number.isFinite(powers[s]) ? Math.max(0, powers[s]) : 0;
              const cen = centroids && Number.isFinite(centroids[s]) ? centroids[s] : 0.5;
              // Sqrt maps quantum probability |c|^2 -> acoustic amplitude |c|
              this.targetAmp[s] = Math.sqrt(pwr);
              this.targetPan[s] = Math.max(0.05, Math.min(0.95, cen));
            } else {
              this.targetAmp[s] = 0;
            }
          }
        }
      } else if (msg.type === 'pluck') {
        const s = Math.max(0, Math.min(MAX_SHELLS - 1, msg.shell | 0));
        const inten = Number.isFinite(msg.intensity) ? Math.max(0, Math.min(1.5, msg.intensity)) : 0.85;
        this.pluckEnv[s] = Math.min(1.0, this.pluckEnv[s] + inten);
        if (Number.isFinite(msg.pan)) {
          this.targetPan[s] = Math.max(0.05, Math.min(0.95, msg.pan));
        }
      }
    };
  }

  _recomputeFrequencies() {
    // Prime-specific fundamental and exact fractional prime-power ladder
    // so every prime p generates its own unmistakably distinct harmonic universe:
    //   p=2: octave/tritone geometric ladder
    //   p=3: Bohlen-Pierce tritave (3:1) ladder
    //   p=5: alien pentave (5:1) ladder
    //   p=7: crystalline heptave (7:1) ladder
    const baseByPrime = { 2: 65.41, 3: 78.0, 5: 68.0, 7: 72.0 };
    const expScaleByPrime = { 2: 0.48, 3: 0.5, 5: 0.42, 7: 0.46 };

    const f0 = baseByPrime[this.p] || 78.0;
    const beta = (expScaleByPrime[this.p] || 0.48) * (0.55 + 0.45 * this.alpha);

    this.targetFreq[0] = f0;
    for (let s = 1; s < MAX_SHELLS; s++) {
      let f = f0 * (this.p ** (beta * s));
      // Fold extreme top shells down by exact prime-power ratio p^1 to avoid aliasing
      while (f > 3600) f /= this.p;
      this.targetFreq[s] = f;
    }
  }

  process(_inputs, outputs) {
    const out = outputs[0];
    if (!out || out.length === 0) return true;
    const left = out[0];
    const right = out.length > 1 ? out[1] : null;
    const blockLen = left.length;
    const invSr = 1 / sampleRate;

    const shells = Math.min(MAX_SHELLS, this.n + 1);
    const ampCoeff = 0.0022;
    const freqCoeff = 0.0015;
    const pluckDecay = Math.exp(-invSr / 0.24);

    for (let i = 0; i < blockLen; i++) {
      this.smoothHorizon += (this.horizonCurrent - this.smoothHorizon) * 0.0015;
      this.smoothGrav += (this.gravStrain - this.smoothGrav) * 0.0015;

      const gravFM = Math.min(2.2, this.smoothGrav * 0.55);
      const horFM = Math.min(1.6, Math.abs(this.smoothHorizon) * 18.0);

      let mixL = 0;
      let mixR = 0;

      for (let s = 0; s < shells; s++) {
        this.smoothAmp[s] += (this.targetAmp[s] - this.smoothAmp[s]) * ampCoeff;
        this.smoothPan[s] += (this.targetPan[s] - this.smoothPan[s]) * 0.0012;
        this.smoothFreq[s] += (this.targetFreq[s] - this.smoothFreq[s]) * freqCoeff;
        this.pluckEnv[s] *= pluckDecay;

        const amp = this.smoothAmp[s] * (s === 0 ? 0.32 : 0.42) + this.pluckEnv[s] * 0.45;
        if (amp < 1e-5) continue;

        const freq = this.smoothFreq[s];
        // Modulator ratio uses non-octave prime fraction (1 + 1/p) for glass-like ultrametric timbre
        const modFreq = freq * (1.0 + 1.0 / this.p);

        this.phase[s] += TWO_PI * freq * invSr;
        if (this.phase[s] > TWO_PI) this.phase[s] -= TWO_PI;

        this.modPhase[s] += TWO_PI * modFreq * invSr;
        if (this.modPhase[s] > TWO_PI) this.modPhase[s] -= TWO_PI;

        const fmIndex = 0.14 + gravFM * (0.2 + 0.12 * s) + this.pluckEnv[s] * 1.15 + horFM * 0.25;
        const modSig = Math.sin(this.modPhase[s]);
        // Pure fundamental + subtle prime-harmonic shimmer
        const sig =
          Math.sin(this.phase[s] + fmIndex * modSig) * 0.82 +
          Math.sin(this.phase[s] * 2.0 - 0.3 * modSig) * (0.12 + 0.08 * this.pluckEnv[s]);

        // Equal-power stereo panning from exact p-adic Monna spatial centroid
        const panAngle = Math.max(0.05, Math.min(0.95, this.smoothPan[s])) * (Math.PI * 0.5);
        const gainL = Math.cos(panAngle);
        const gainR = Math.sin(panAngle);

        mixL += sig * amp * gainL;
        mixR += sig * amp * gainR;
      }

      // Rotating BTZ Black Hole sub-horizon resonant undertone (smoothly crossfaded to avoid click)
      const targetBtz = this.isBTZ ? 1.0 : 0.0;
      this.smoothBtzMix += (targetBtz - this.smoothBtzMix) * 0.0012;
      if (this.smoothBtzMix > 1e-4) {
        const subF = this.smoothFreq[0] * 0.5;
        this.dronePhase += TWO_PI * subF * invSr;
        if (this.dronePhase > TWO_PI) this.dronePhase -= TWO_PI;
        this.droneModPhase += TWO_PI * (0.8 + Math.abs(this.smoothHorizon) * 14.0) * invSr;
        if (this.droneModPhase > TWO_PI) this.droneModPhase -= TWO_PI;

        const btzWave = Math.sin(this.dronePhase + 0.45 * Math.sin(this.droneModPhase));
        const btzAmp = (0.14 + Math.min(0.18, Math.abs(this.smoothHorizon) * 2.5)) * this.smoothBtzMix;
        mixL += btzWave * btzAmp * (0.72 + 0.28 * Math.cos(this.droneModPhase));
        mixR += btzWave * btzAmp * (0.72 - 0.28 * Math.cos(this.droneModPhase));
      }

      // Soft analog tanh limiter for clean headroom with smoothed master gain
      this.smoothGain += (this.masterGain - this.smoothGain) * 0.002;
      const g = this.smoothGain;
      left[i] = Math.tanh(mixL * g);
      if (right) right[i] = Math.tanh(mixR * g);
    }

    return true;
  }
}

registerProcessor('padic-synth-processor', PadicSynthProcessor);

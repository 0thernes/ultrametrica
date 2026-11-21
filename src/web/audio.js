/**
 * ULTRAMETRICA — WebAudio Controller for the Non-Archimedean AudioWorklet Synth.
 */

export function computeShellFrequencies(p, n, alpha) {
  const baseByPrime = { 2: 65.41, 3: 78.0, 5: 68.0, 7: 72.0 };
  const expScaleByPrime = { 2: 0.48, 3: 0.5, 5: 0.42, 7: 0.46 };
  const f0 = baseByPrime[p] || 78.0;
  const beta = (expScaleByPrime[p] || 0.48) * (0.55 + 0.45 * alpha);
  const freqs = new Float64Array(n + 1);
  freqs[0] = f0;
  for (let s = 1; s <= n; s++) {
    let f = f0 * (p ** (beta * s));
    while (f > 3600) f /= p;
    freqs[s] = f;
  }
  return freqs;
}

export function primeScaleName(p) {
  switch (p) {
    case 2:
      return '2^x Dyadic Scale';
    case 3:
      return '3^x Bohlen-Pierce Tritave';
    case 5:
      return '5^x Pentave Harmonics';
    case 7:
      return '7^x Heptave Harmonics';
    default:
      return `${p}^x Ultrametric`;
  }
}

export class PadicAudioEngine {
  constructor() {
    this.ctx = null;
    this.node = null;
    this.enabled = false;
    this.initializing = false;
    this.masterGain = 0.28;
  }

  async enable() {
    if (this.enabled) return true;
    if (this.initializing) return false;
    this.initializing = true;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error('WebAudio unavailable');

      if (!this.ctx) {
        this.ctx = new AudioCtx();
        await this.ctx.audioWorklet.addModule(new URL('./audio-worklet.js', import.meta.url).href);
        this.node = new AudioWorkletNode(this.ctx, 'padic-synth-processor', {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [2],
        });

        // Subtle stereo delay shimmer to give depth to the non-Archimedean harmonic cloud
        const dryGain = this.ctx.createGain();
        dryGain.gain.value = 0.88;

        const delayL = this.ctx.createDelay(0.5);
        const delayR = this.ctx.createDelay(0.5);
        delayL.delayTime.value = 0.19;
        delayR.delayTime.value = 0.27;

        const fbL = this.ctx.createGain();
        const fbR = this.ctx.createGain();
        fbL.gain.value = 0.24;
        fbR.gain.value = 0.22;

        const wetGain = this.ctx.createGain();
        wetGain.gain.value = 0.2;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 4200;

        this.node.connect(dryGain);
        dryGain.connect(this.ctx.destination);

        this.node.connect(filter);
        filter.connect(delayL);
        filter.connect(delayR);
        delayL.connect(fbL);
        fbL.connect(delayR);
        delayR.connect(fbR);
        fbR.connect(delayL);
        delayL.connect(wetGain);
        delayR.connect(wetGain);
        wetGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.enabled = true;
      return true;
    } catch (err) {
      console.error('Failed to start p-adic AudioWorklet:', err);
      this.enabled = false;
      return false;
    } finally {
      this.initializing = false;
    }
  }

  async disable() {
    this.enabled = false;
    if (this.ctx && this.ctx.state === 'running') {
      await this.ctx.suspend();
    }
  }

  async toggle() {
    if (this.enabled) {
      await this.disable();
      return false;
    }
    return this.enable();
  }

  update(sim) {
    if (!this.enabled || !this.node) return;
    this.node.port.postMessage({
      type: 'state',
      p: sim.p,
      n: sim.n,
      alpha: sim.quantum.alpha,
      isBTZ: sim.bulk.isBTZ,
      horizonCurrent: sim.bulk.horizonFluxCurrent,
      gravStrain: Math.sqrt(sim.bulk.totalGravEnergy / Math.max(1, sim.bulk.numEdges)),
      masterGain: this.masterGain,
      shellPower: Array.from(sim.quantum.kozyrevShellPower),
      shellCentroid: Array.from(sim.quantum.kozyrevShellCentroid),
    });
  }

  pluck(shell, pan = 0.5, intensity = 0.9) {
    if (!this.enabled || !this.node) return;
    this.node.port.postMessage({
      type: 'pluck',
      shell,
      pan,
      intensity,
    });
  }
}

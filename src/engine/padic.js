/**
 * ULTRAMETRICA — Exact p-adic Arithmetic, Radix-p Pontryagin FFT,
 * Vladimirov Pseudo-Differential Operator, & Kozyrev Wavelet Engine.
 *
 * All operations work on the finite ultrametric ring Z_p / p^n Z_p (N = p^n)
 * for arbitrary prime p in {2, 3, 5, 7}.
 *
 * Canonical duality between p-adic integers x and Bruhat-Tits tree leaves l:
 *   If x = sum_{r=0}^{n-1} d_r p^r, then its p-adic Monna map is
 *   M_p(x) = sum_{r=0}^{n-1} d_r p^{-(r+1)} = rev_p(x) / p^n.
 *   Thus l = rev_p(x) orders Z_p / p^n Z_p so every p-adic ball B(a, p^{-j})
 *   is an exact contiguous subtree slice l in [b * p^{n-j}, (b + 1) * p^{n-j}).
 */

const TWO_PI = 2 * Math.PI;

export function isPrimeSmall(p) {
  return p === 2 || p === 3 || p === 5 || p === 7;
}

export class PadicSpace {
  constructor(p = 3, n = 6) {
    if (!isPrimeSmall(p)) {
      throw new RangeError(`Unsupported prime p=${p}. Supported primes: 2, 3, 5, 7.`);
    }
    if (!Number.isInteger(n) || n < 2) {
      throw new RangeError(`Precision depth n must be an integer >= 2, got ${n}.`);
    }
    const N = p ** n;
    if (!Number.isSafeInteger(N) || N > 65536) {
      throw new RangeError(`Space size N = ${p}^${n} = ${N} exceeds safe engine bound 65536.`);
    }

    this.p = p;
    this.n = n;
    this.N = N;
    this.invSqrtN = 1 / Math.sqrt(this.N);

    // Powers of p: powP[k] = p^k
    this.powP = new Int32Array(n + 1);
    this.powP[0] = 1;
    for (let k = 1; k <= n; k++) {
      this.powP[k] = this.powP[k - 1] * p;
    }

    // Base-p digit reversal permutation (also defines the exact Monna map)
    // revTable[x] = leaf index l, and revTable[l] = x (involution!)
    this.revTable = new Int32Array(this.N);
    for (let x = 0; x < this.N; x++) {
      let v = x;
      let r = 0;
      for (let d = 0; d < n; d++) {
        r = r * p + (v % p);
        v = (v / p) | 0;
      }
      this.revTable[x] = r;
    }

    // Exact p-adic valuation v_p(k) for k in [0, N-1], with v_p(0) = n
    this.valuationTable = new Int32Array(this.N);
    this.valuationTable[0] = n;
    for (let k = 1; k < this.N; k++) {
      let v = 0;
      let m = k;
      while (m % p === 0) {
        m = (m / p) | 0;
        v++;
      }
      this.valuationTable[k] = v;
    }

    // Precomputed Radix-p FFT butterfly roots W_p^{q*r} for forward (-1) and inverse (+1)
    this.radixFwdRe = new Float64Array(p * p);
    this.radixFwdIm = new Float64Array(p * p);
    this.radixInvRe = new Float64Array(p * p);
    this.radixInvIm = new Float64Array(p * p);
    for (let q = 0; q < p; q++) {
      for (let r = 0; r < p; r++) {
        const angle = (TWO_PI * q * r) / p;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const idx = q * p + r;
        this.radixFwdRe[idx] = c;
        this.radixFwdIm[idx] = -s;
        this.radixInvRe[idx] = c;
        this.radixInvIm[idx] = s;
      }
    }

    // Precomputed stage twiddle factors W_{block}^{r*j} for stages s = 0..n-1
    this.stageTwiddleFwdRe = [];
    this.stageTwiddleFwdIm = [];
    this.stageTwiddleInvRe = [];
    this.stageTwiddleInvIm = [];
    for (let s = 0; s < n; s++) {
      const stride = this.powP[s];
      const block = stride * p;
      const len = p * stride;
      const fRe = new Float64Array(len);
      const fIm = new Float64Array(len);
      const iRe = new Float64Array(len);
      const iIm = new Float64Array(len);
      for (let r = 0; r < p; r++) {
        for (let j = 0; j < stride; j++) {
          const angle = (TWO_PI * r * j) / block;
          const c = Math.cos(angle);
          const sn = Math.sin(angle);
          const idx = r * stride + j;
          fRe[idx] = c;
          fIm[idx] = -sn;
          iRe[idx] = c;
          iIm[idx] = sn;
        }
      }
      this.stageTwiddleFwdRe.push(fRe);
      this.stageTwiddleFwdIm.push(fIm);
      this.stageTwiddleInvRe.push(iRe);
      this.stageTwiddleInvIm.push(iIm);
    }

    // Scratch buffers for zero-allocation butterflies
    this._tmpRe = new Float64Array(p);
    this._tmpIm = new Float64Array(p);
    this._fftWorkRe = new Float64Array(this.N);
    this._fftWorkIm = new Float64Array(this.N);
  }

  /** Base-p digits of x in little-endian order [d_0, d_1, ..., d_{n-1}]. */
  digits(x) {
    const out = new Int32Array(this.n);
    let v = ((x % this.N) + this.N) % this.N;
    for (let i = 0; i < this.n; i++) {
      out[i] = v % this.p;
      v = (v / this.p) | 0;
    }
    return out;
  }

  /** Canonical p-adic string "...d_{n-1}...d_1 d_0 (mod p^n)". */
  formatPadic(x) {
    const d = this.digits(x);
    let s = '';
    for (let i = this.n - 1; i >= 0; i--) s += d[i];
    return `...${s}_${this.p}`;
  }

  /** Monna map M_p(x) in [0, 1). */
  monna(x) {
    const xm = ((x % this.N) + this.N) % this.N;
    return this.revTable[xm] / this.N;
  }

  /** Map Bruhat-Tits leaf index l -> p-adic integer x in Z_p / p^n Z_p. */
  leafToPadic(leaf) {
    if (!Number.isInteger(leaf) || leaf < 0 || leaf >= this.N) {
      throw new RangeError(`Leaf index ${leaf} out of range [0, ${this.N - 1}].`);
    }
    return this.revTable[leaf];
  }

  /** Map p-adic integer x -> Bruhat-Tits leaf index l. */
  padicToLeaf(x) {
    if (!Number.isInteger(x)) {
      throw new RangeError(`p-adic integer x must be an integer, got ${x}.`);
    }
    return this.revTable[((x % this.N) + this.N) % this.N];
  }

  /** Exact p-adic valuation v_p(x - y) in {0, 1, ..., n}. */
  diffValuation(x, y) {
    const diff = ((x - y) % this.N + this.N) % this.N;
    return this.valuationTable[diff];
  }

  /** Exact p-adic ultrametric distance |x - y|_p = p^{-v_p(x-y)} (0 if equal mod p^n). */
  distance(x, y) {
    const diff = ((x - y) % this.N + this.N) % this.N;
    if (diff === 0) return 0;
    return this.p ** (-this.valuationTable[diff]);
  }

  /** Exact ultrametric distance between two Bruhat-Tits tree leaves l1, l2. */
  leafDistance(l1, l2) {
    return this.distance(this.leafToPadic(l1), this.leafToPadic(l2));
  }

  /**
   * Exact unitary Radix-p Cooley-Tukey FFT on Z_p / p^n Z_p.
   * Implements Pontryagin-dual additive character transform:
   *   X[k] = (1 / sqrt(N)) sum_{x=0}^{N-1} a[x] exp(sign * 2*pi*i * x * k / N)
   * where sign = -1 (forward) or +1 (inverse).
   *
   * Safe when outRe === inRe and outIm === inIm (in-place supported via work buffer).
   */
  _radixTransform(inRe, inIm, outRe, outIm, inverse) {
    const p = this.p;
    const n = this.n;
    const N = this.N;
    if (!inRe || !inIm || !outRe || !outIm || inRe.length < N || inIm.length < N || outRe.length < N || outIm.length < N) {
      throw new RangeError(`Radix-p FFT requires input/output arrays of length >= ${N}.`);
    }
    const rev = this.revTable;

    // Handle aliasing cleanly
    const dstRe = outRe === inRe ? this._fftWorkRe : outRe;
    const dstIm = outIm === inIm ? this._fftWorkIm : outIm;

    // Step 1: Base-p digit reversal permutation
    for (let i = 0; i < N; i++) {
      const r = rev[i];
      dstRe[r] = inRe[i];
      dstIm[r] = inIm[i];
    }

    const rMatRe = inverse ? this.radixInvRe : this.radixFwdRe;
    const rMatIm = inverse ? this.radixInvIm : this.radixFwdIm;
    const twReStages = inverse ? this.stageTwiddleInvRe : this.stageTwiddleFwdRe;
    const twImStages = inverse ? this.stageTwiddleInvIm : this.stageTwiddleFwdIm;
    const tmpRe = this._tmpRe;
    const tmpIm = this._tmpIm;

    // Step 2: n butterfly stages of radix p
    for (let s = 0; s < n; s++) {
      const stride = this.powP[s];
      const block = stride * p;
      const twRe = twReStages[s];
      const twIm = twImStages[s];

      for (let base = 0; base < N; base += block) {
        for (let j = 0; j < stride; j++) {
          // Multiply each branch by stage twiddle W_block^{r*j}
          for (let r = 0; r < p; r++) {
            const idx = base + r * stride + j;
            const aRe = dstRe[idx];
            const aIm = dstIm[idx];
            if (r === 0 || j === 0) {
              tmpRe[r] = aRe;
              tmpIm[r] = aIm;
            } else {
              const tIdx = r * stride + j;
              const wRe = twRe[tIdx];
              const wIm = twIm[tIdx];
              tmpRe[r] = aRe * wRe - aIm * wIm;
              tmpIm[r] = aRe * wIm + aIm * wRe;
            }
          }

          // Size-p DFT butterfly
          for (let q = 0; q < p; q++) {
            let sumRe = tmpRe[0];
            let sumIm = tmpIm[0];
            const rowOffset = q * p;
            for (let r = 1; r < p; r++) {
              const mRe = rMatRe[rowOffset + r];
              const mIm = rMatIm[rowOffset + r];
              const vRe = tmpRe[r];
              const vIm = tmpIm[r];
              sumRe += vRe * mRe - vIm * mIm;
              sumIm += vRe * mIm + vIm * mRe;
            }
            const outIdx = base + q * stride + j;
            dstRe[outIdx] = sumRe;
            dstIm[outIdx] = sumIm;
          }
        }
      }
    }

    // Step 3: Unitary normalization 1 / sqrt(N)
    const scale = this.invSqrtN;
    if (dstRe !== outRe) {
      for (let i = 0; i < N; i++) {
        outRe[i] = dstRe[i] * scale;
        outIm[i] = dstIm[i] * scale;
      }
    } else {
      for (let i = 0; i < N; i++) {
        outRe[i] *= scale;
        outIm[i] *= scale;
      }
    }
  }

  fft(inRe, inIm, outRe, outIm) {
    this._radixTransform(inRe, inIm, outRe, outIm, false);
  }

  ifft(inRe, inIm, outRe, outIm) {
    this._radixTransform(inRe, inIm, outRe, outIm, true);
  }

  /**
   * Exact eigenvalues of the Vladimirov pseudo-differential operator D_p^alpha
   * in Pontryagin dual frequency space k in {0, ..., N-1}:
   *   lambda_k = |k / p^n|_p^alpha = p^{alpha * (n - v_p(k))}  for k != 0,  0 for k = 0.
   */
  vladimirovSpectrum(alpha) {
    if (!Number.isFinite(alpha) || alpha <= 0) {
      throw new RangeError(`Vladimirov exponent alpha must be finite and > 0, got ${alpha}.`);
    }
    const spec = new Float64Array(this.N);
    spec[0] = 0;
    const p = this.p;
    const n = this.n;
    const vTab = this.valuationTable;
    for (let k = 1; k < this.N; k++) {
      spec[k] = p ** (alpha * (n - vTab[k]));
    }
    return spec;
  }

  /**
   * Archimedean fractional Laplacian (-Delta)^{alpha/2} eigenvalues on Z/NZ
   * mapped to unit circle circumference: (2*pi*min(k, N-k))^alpha.
   */
  archimedeanSpectrum(alpha) {
    if (!Number.isFinite(alpha) || alpha <= 0) {
      throw new RangeError(`Archimedean exponent alpha must be finite and > 0, got ${alpha}.`);
    }
    const spec = new Float64Array(this.N);
    spec[0] = 0;
    const N = this.N;
    for (let k = 1; k < N; k++) {
      const m = k <= N - k ? k : N - k;
      spec[k] = (TWO_PI * m) ** alpha;
    }
    return spec;
  }

  /**
   * Apply exact Vladimirov operator D_p^alpha to state psi (indexed by p-adic x).
   */
  applyVladimirov(re, im, alpha, outRe, outIm) {
    const spec = this.vladimirovSpectrum(alpha);
    const freqRe = new Float64Array(this.N);
    const freqIm = new Float64Array(this.N);
    this.fft(re, im, freqRe, freqIm);
    for (let k = 0; k < this.N; k++) {
      freqRe[k] *= spec[k];
      freqIm[k] *= spec[k];
    }
    this.ifft(freqRe, freqIm, outRe, outIm);
  }

  /**
   * Construct an exact orthonormal Kozyrev p-adic wavelet psi_{j, b, m}(x):
   *   - j in {0, ..., n-1}: ultrametric scale (Bruhat-Tits tree depth of support ball)
   *   - b in {0, ..., p^j - 1}: ball index (contiguous tree-leaf slice [b*p^{n-j}, (b+1)*p^{n-j}))
   *   - m in {1, ..., p-1}: non-trivial additive character index
   *
   * Strictly compactly supported on ball B of cardinality p^{n-j}, yet an EXACT
   * eigenfunction of the non-local Vladimirov operator:
   *   D_p^alpha psi_{j, b, m} = p^{alpha * (j + 1)} psi_{j, b, m}.
   *
   * Returns psi indexed by p-adic integer x (ready for FFT / quantum evolution).
   */
  createKozyrevWavelet(j, ballIndex, characterM = 1) {
    const p = this.p;
    const n = this.n;
    if (!Number.isInteger(j) || j < 0 || j >= n) {
      throw new RangeError(`Wavelet scale j=${j} must be an integer in [0, ${n - 1}].`);
    }
    if (!Number.isInteger(ballIndex)) {
      throw new RangeError(`Wavelet ballIndex must be an integer, got ${ballIndex}.`);
    }
    if (!Number.isInteger(characterM)) {
      throw new RangeError(`Wavelet characterM must be an integer, got ${characterM}.`);
    }
    const numBalls = this.powP[j];
    const b = ((ballIndex % numBalls) + numBalls) % numBalls;
    const m = ((characterM - 1) % (p - 1) + (p - 1)) % (p - 1) + 1;

    const ballSize = this.powP[n - j];
    const subBallSize = this.powP[n - j - 1];
    const leafStart = b * ballSize;
    const leafEnd = leafStart + ballSize;
    const normFactor = 1 / Math.sqrt(ballSize);

    const re = new Float64Array(this.N);
    const im = new Float64Array(this.N);

    for (let leaf = leafStart; leaf < leafEnd; leaf++) {
      const dj = ((leaf - leafStart) / subBallSize) | 0; // exact digit d_j of x = rev_p(leaf)
      const angle = (TWO_PI * m * dj) / p;
      const x = this.revTable[leaf];
      re[x] = normFactor * Math.cos(angle);
      im[x] = normFactor * Math.sin(angle);
    }

    return {
      re,
      im,
      j,
      ballIndex: b,
      characterM: m,
      leafStart,
      leafEnd,
      ballSize,
      centerX: this.revTable[leafStart],
      radius: p ** (-j),
      eigenvalue: (alpha) => p ** (alpha * (j + 1)),
    };
  }

  /**
   * Exact O(N) Fast Kozyrev Wavelet Transform of psi(x) (indexed by p-adic x).
   * Projects psi onto the complete orthonormal basis:
   *   { constMode } U { psi_{j, b, m} : 0 <= j < n, 0 <= b < p^j, 1 <= m < p }.
   *
   * Returns:
   *   - constRe, constIm: DC / constant mode coefficient
   *   - shellPower: Float64Array(n + 1) where shellPower[0] = |const|^2 and
   *                 shellPower[j + 1] = sum_{b, m} |c_{j, b, m}|^2 (exact energy at eigenvalue p^{alpha*(j+1)})
   *   - shellCentroid: Float64Array(n + 1) Monna-map spatial centroid in [0, 1] for stereo audio panning
   *   - coeffs: array of { j, b, m, re, im, power } for non-negligible wavelets
   */
  kozyrevTransform(psiRe, psiIm) {
    const p = this.p;
    const n = this.n;
    const N = this.N;

    // Reorder into Bruhat-Tits leaf order so every p-adic ball is contiguous
    let curRe = new Float64Array(N);
    let curIm = new Float64Array(N);
    for (let l = 0; l < N; l++) {
      const x = this.revTable[l];
      curRe[l] = psiRe[x];
      curIm[l] = psiIm[x];
    }

    const shellPower = new Float64Array(n + 1);
    const shellCentroidNum = new Float64Array(n + 1);
    const rFwdRe = this.radixFwdRe;
    const rFwdIm = this.radixFwdIm;
    const invSqrtP = 1 / Math.sqrt(p);

    // Bottom-up hierarchical Haar/Kozyrev radix-p wavelet cascade:
    // At level j = n-1 down to 0, group p sibling averages into 1 parent average (m=0)
    // and p-1 orthogonal Kozyrev wavelet coefficients (m=1..p-1).
    let curLen = N;
    for (let j = n - 1; j >= 0; j--) {
      const nextLen = (curLen / p) | 0;
      const nextRe = new Float64Array(nextLen);
      const nextIm = new Float64Array(nextLen);

      for (let b = 0; b < nextLen; b++) {
        const base = b * p;
        // m = 0 (average / scaling coefficient carried up the Bruhat-Tits tree)
        let avgRe = 0;
        let avgIm = 0;
        for (let r = 0; r < p; r++) {
          avgRe += curRe[base + r];
          avgIm += curIm[base + r];
        }
        nextRe[b] = avgRe * invSqrtP;
        nextIm[b] = avgIm * invSqrtP;

        // m = 1..p-1 (exact Kozyrev wavelet projections at scale j, ball b)
        let ballPower = 0;
        for (let m = 1; m < p; m++) {
          let cRe = 0;
          let cIm = 0;
          const row = m * p;
          for (let r = 0; r < p; r++) {
            const wRe = rFwdRe[row + r];
            const wIm = rFwdIm[row + r]; // conjugate of exp(+2pi i m r / p) is exp(-2pi i m r / p) = radixFwd!
            const vRe = curRe[base + r];
            const vIm = curIm[base + r];
            cRe += vRe * wRe - vIm * wIm;
            cIm += vRe * wIm + vIm * wRe;
          }
          cRe *= invSqrtP;
          cIm *= invSqrtP;
          ballPower += cRe * cRe + cIm * cIm;
        }
        shellPower[j + 1] += ballPower;
        shellCentroidNum[j + 1] += ballPower * ((b + 0.5) / nextLen);
      }

      curRe = nextRe;
      curIm = nextIm;
      curLen = nextLen;
    }

    const constRe = curRe[0];
    const constIm = curIm[0];
    shellPower[0] = constRe * constRe + constIm * constIm;

    const shellCentroid = new Float64Array(n + 1);
    shellCentroid[0] = 0.5;
    for (let s = 1; s <= n; s++) {
      shellCentroid[s] = shellPower[s] > 1e-15 ? shellCentroidNum[s] / shellPower[s] : 0.5;
    }

    return {
      constRe,
      constIm,
      shellPower,
      shellCentroid,
    };
  }

  /**
   * Exact Ultrametric Triangle & Bruhat-Tits Gromov Product Prover
   * for any 3 boundary leaves (leafA, leafB, leafC).
   */
  proveUltrametricTriangle(leafA, leafB, leafC) {
    const xA = this.leafToPadic(leafA);
    const xB = this.leafToPadic(leafB);
    const xC = this.leafToPadic(leafC);

    const vAB = this.diffValuation(xA, xB);
    const vBC = this.diffValuation(xB, xC);
    const vAC = this.diffValuation(xA, xC);

    const dAB = xA === xB ? 0 : this.p ** (-vAB);
    const dBC = xB === xC ? 0 : this.p ** (-vBC);
    const dAC = xA === xC ? 0 : this.p ** (-vAC);

    // Exact Bruhat-Tits tree geodesic hop distance between leaves: 2*(n - v_p(x - y))
    const treeAB = xA === xB ? 0 : 2 * (this.n - vAB);
    const treeBC = xB === xC ? 0 : 2 * (this.n - vBC);
    const treeAC = xA === xC ? 0 : 2 * (this.n - vAC);

    const sorted = [dAB, dBC, dAC].sort((a, b) => a - b);
    const maxD = sorted[2];
    const secondMaxD = sorted[1];
    const minD = sorted[0];

    // Strong triangle inequality check: all three cyclic permutations
    const strongHolds =
      dAC <= Math.max(dAB, dBC) + 1e-15 &&
      dAB <= Math.max(dAC, dBC) + 1e-15 &&
      dBC <= Math.max(dAB, dAC) + 1e-15;

    // Every non-degenerate ultrametric triangle is strictly isosceles with the two LONGEST sides equal!
    const isIsosceles = Math.abs(maxD - secondMaxD) < 1e-15;

    // Exact Gromov product (A|B)_C in tree hops = depth of branch point
    const gromovAB_C = 0.5 * (treeAC + treeBC - treeAB);

    return {
      leaves: [leafA, leafB, leafC],
      padic: [xA, xB, xC],
      formatted: [this.formatPadic(xA), this.formatPadic(xB), this.formatPadic(xC)],
      valuations: { vAB, vBC, vAC },
      distances: { dAB, dBC, dAC },
      treeHops: { treeAB, treeBC, treeAC },
      minDistance: minD,
      maxDistance: maxD,
      strongTriangleHolds: strongHolds,
      isIsosceles,
      gromovProduct: gromovAB_C,
    };
  }
}

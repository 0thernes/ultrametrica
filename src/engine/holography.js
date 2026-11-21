/**
 * ULTRAMETRICA — Bruhat-Tits Tree T_p & Rotating p-adic BTZ Black Hole (T_p / p^{hZ})
 * Holographic Quantum Gravity Engine.
 *
 * Implements:
 *   1. Exact Bruhat-Tits tree T_p and Tate-curve BTZ black hole quotient (horizon ring L = p^h)
 *   2. Exact O(V) Schur-Complement + Hermitian Sherman-Morrison bulk Klein-Gordon solver
 *      for arbitrary inhomogeneous curved edge lengths a_e and Kerr frame-dragging flux Omega
 *   3. Exact Gubser-et-al. mass-dimension relation m^2 = p^Delta + p^{1-Delta} - (p + 1)
 *      with asymptotic infinity impedance matching infinite-tree bulk-to-boundary propagators
 *   4. Gubser-Heydeman-Jepsen-Marcolli dynamic edge-length Einstein gravity backreaction
 *   5. Exact Ollivier-Ricci discrete curvature kappa(u, v) = 1 - W_1(mu_u, mu_v) / a_{uv}
 *      (exact closed-form Kantorovich formula on tree edges + exact min-cost transport on horizon)
 *   6. Exact O(V) Tree/Cycle DP Ryu-Takayanagi minimal cut & entanglement wedge solver
 */

/**
 * Solve exact 1-Wasserstein earth-mover distance between two discrete distributions
 * muU (size m) and muV (size k) given pairwise cost matrix cost[i * k + j] >= 0,
 * using successive shortest augmenting paths (Bellman-Ford on residual bipartite graph).
 * Used ONLY on the tiny BTZ horizon edges (m, k <= p + 1 <= 8), so it is both
 * 100% mathematically exact and runs in microseconds.
 */
function exactWassersteinBipartite(muU, muV, cost) {
  const m = muU.length;
  const k = muV.length;
  const S = 0;
  const T = 1 + m + k;
  const V = T + 1;

  // Build residual graph adjacency list
  const adj = Array.from({ length: V }, () => []);
  const addEdge = (u, v, cap, c) => {
    const fwd = { to: v, rev: adj[v].length, cap, cost: c };
    const bwd = { to: u, rev: adj[u].length, cap: 0, cost: -c };
    adj[u].push(fwd);
    adj[v].push(bwd);
  };

  let totalSupply = 0;
  for (let i = 0; i < m; i++) {
    if (muU[i] > 1e-15) {
      addEdge(S, 1 + i, muU[i], 0);
      totalSupply += muU[i];
    }
  }
  for (let j = 0; j < k; j++) {
    if (muV[j] > 1e-15) {
      addEdge(1 + m + j, T, muV[j], 0);
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < k; j++) {
      addEdge(1 + i, 1 + m + j, 1.0, cost[i * k + j]);
    }
  }

  let flow = 0;
  let totalCost = 0;
  const dist = new Float64Array(V);
  const prevV = new Int32Array(V);
  const prevE = new Int32Array(V);
  const inQueue = new Uint8Array(V);

  const EPS = 1e-13;
  while (flow < totalSupply - 1e-12) {
    dist.fill(Infinity);
    prevV.fill(-1);
    prevE.fill(-1);
    inQueue.fill(0);
    dist[S] = 0;

    // SPFA / Bellman-Ford
    const queue = [S];
    inQueue[S] = 1;
    let qHead = 0;
    while (qHead < queue.length) {
      const u = queue[qHead++];
      inQueue[u] = 0;
      const du = dist[u];
      const edges = adj[u];
      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei];
        if (e.cap > EPS) {
          const nd = du + e.cost;
          if (nd < dist[e.to] - 1e-13) {
            dist[e.to] = nd;
            prevV[e.to] = u;
            prevE[e.to] = ei;
            if (!inQueue[e.to]) {
              inQueue[e.to] = 1;
              queue.push(e.to);
            }
          }
        }
      }
    }

    if (!Number.isFinite(dist[T])) break;

    let push = totalSupply - flow;
    for (let v = T; v !== S; v = prevV[v]) {
      const e = adj[prevV[v]][prevE[v]];
      if (e.cap < push) push = e.cap;
    }

    for (let v = T; v !== S; v = prevV[v]) {
      const u = prevV[v];
      const ei = prevE[v];
      const e = adj[u][ei];
      e.cap -= push;
      adj[v][e.rev].cap += push;
    }

    flow += push;
    totalCost += push * dist[T];
  }

  return totalCost;
}

export class BruhatTitsBulk {
  /**
   * @param {import('./padic.js').PadicSpace} space
   * @param {number} horizonDepth 0 for pure Bruhat-Tits AdS tree, >=1 for BTZ black hole ring of L = p^horizonDepth
   */
  constructor(space, horizonDepth = 0) {
    this.space = space;
    this.p = space.p;
    this.n = space.n;
    this.N = space.N;

    // Validate horizonDepth: for BTZ black hole we need a cycle of length L = p^h >= 3 and h < n
    let h = horizonDepth | 0;
    if (h > 0) {
      while (h < this.n && this.p ** h < 3) h++;
      if (h >= this.n) h = 0;
    }
    this.horizonDepth = h;
    this.isBTZ = h > 0;
    this.horizonLength = this.isBTZ ? this.p ** h : 0;

    this._buildTopology();
    this._initState();
  }

  _buildTopology() {
    const p = this.p;
    const n = this.n;
    const startDepth = this.horizonDepth;

    // Nodes indexed in BFS order from top depth (0 or horizonDepth) down to leaves (depth n)
    const levelOffset = new Int32Array(n + 2);
    let totalNodes = 0;
    for (let d = startDepth; d <= n; d++) {
      levelOffset[d] = totalNodes;
      totalNodes += p ** d;
    }
    levelOffset[n + 1] = totalNodes;

    this.numNodes = totalNodes;
    this.levelOffset = levelOffset;
    this.nodeDepth = new Int32Array(totalNodes);
    this.nodeIndexInLevel = new Int32Array(totalNodes);
    this.parent = new Int32Array(totalNodes).fill(-1);
    this.parentEdge = new Int32Array(totalNodes).fill(-1);
    this.isLeaf = new Uint8Array(totalNodes);
    this.isHorizon = new Uint8Array(totalNodes);
    this.children = Array.from({ length: totalNodes }, () => []);
    this.adj = Array.from({ length: totalNodes }, () => []); // { to, edge, dir (+1 for u->v, -1 for v->u) }

    const edges = [];

    for (let d = startDepth; d <= n; d++) {
      const count = p ** d;
      const off = levelOffset[d];
      for (let i = 0; i < count; i++) {
        const u = off + i;
        this.nodeDepth[u] = d;
        this.nodeIndexInLevel[u] = i;
        if (d === n) this.isLeaf[u] = 1;
        if (this.isBTZ && d === startDepth) this.isHorizon[u] = 1;

        if (d > startDepth) {
          const parentIdxInPrev = (i / p) | 0;
          const par = levelOffset[d - 1] + parentIdxInPrev;
          this.parent[u] = par;
          this.children[par].push(u);

          const eIdx = edges.length;
          edges.push({
            id: eIdx,
            u: par,
            v: u,
            isHorizon: false,
            depth: d,
          });
          this.parentEdge[u] = eIdx;
          this.adj[par].push({ to: u, edge: eIdx, dir: 1 });
          this.adj[u].push({ to: par, edge: eIdx, dir: -1 });
        }
      }
    }

    // Horizon ring nodes & cyclic edges for BTZ black hole quotient T_p / p^{hZ}
    this.horizonNodes = new Int32Array(this.horizonLength);
    this.horizonEdges = new Int32Array(this.horizonLength);
    if (this.isBTZ) {
      const L = this.horizonLength;
      const off = levelOffset[startDepth];
      for (let j = 0; j < L; j++) {
        this.horizonNodes[j] = off + j;
      }
      for (let j = 0; j < L; j++) {
        const u = this.horizonNodes[j];
        const v = this.horizonNodes[(j + 1) % L];
        const eIdx = edges.length;
        edges.push({
          id: eIdx,
          u,
          v,
          isHorizon: true,
          depth: startDepth,
          horizonIndex: j,
        });
        this.horizonEdges[j] = eIdx;
        this.adj[u].push({ to: v, edge: eIdx, dir: 1 });
        this.adj[v].push({ to: u, edge: eIdx, dir: -1 });
      }
    }

    this.edges = edges;
    this.numEdges = edges.length;

    // Direct leaf node array: leafNodes[leaf] = nodeId (leaf in 0..N-1)
    this.leafNodes = new Int32Array(this.N);
    const leafOff = levelOffset[n];
    for (let l = 0; l < this.N; l++) {
      this.leafNodes[l] = leafOff + l;
    }

    // Precompute internal non-horizon nodes in top-down BFS order (and reverse for bottom-up)
    const internalTree = [];
    for (let u = 0; u < totalNodes; u++) {
      if (!this.isLeaf[u] && !this.isHorizon[u] && !(u === 0 && !this.isBTZ)) {
        internalTree.push(u);
      }
    }
    this.internalTreeOrder = new Int32Array(internalTree);

    // Precompute edge adjacency (edges sharing a vertex) for gravitational wave propagation
    this.edgeNeighbors = Array.from({ length: this.numEdges }, (_, ei) => {
      const e = edges[ei];
      const set = new Set();
      for (const a of this.adj[e.u]) if (a.edge !== ei) set.add(a.edge);
      for (const a of this.adj[e.v]) if (a.edge !== ei) set.add(a.edge);
      return Int32Array.from(set);
    });
  }

  _initState() {
    const V = this.numNodes;
    const E = this.numEdges;

    // Complex bulk scalar field phi(v)
    this.phiRe = new Float64Array(V);
    this.phiIm = new Float64Array(V);

    // Dynamic edge-length gravity: a_e = exp(sigma_e + pinSigma_e), conductance w_e = 1 / a_e
    this.sigma = new Float64Array(E);       // dynamic gravitational log-length
    this.sigmaVel = new Float64Array(E);    // gravitational velocity d(sigma)/dt
    this.pinSigma = new Float64Array(E);    // user wormhole surgery / pinned throat distortion
    this.edgeLength = new Float64Array(E).fill(1.0);
    this.edgeWeight = new Float64Array(E).fill(1.0);
    this.edgeStress = new Float64Array(E);  // bulk stress-energy T_e on each edge
    this.ricciCurvature = new Float64Array(E); // exact Ollivier-Ricci curvature kappa(u, v)

    // Physical bulk parameters
    this.delta = 1.5;          // CFT conformal dimension Delta (>= 0.5 for BF stability)
    this.horizonFlux = 0.0;    // Kerr-BTZ rotational frame-dragging flux Omega in [-pi, pi]
    this.asymptoticRoot = true; // Exact infinite-T_p asymptotic Robin impedance at root (pure AdS)

    // Diagnostics
    this.maxResidual = 0;
    this.meanCurvature = 0;
    this.horizonEntropy = 0;
    this.horizonFluxCurrent = 0;
    this.totalGravEnergy = 0;

    // Solver scratch arrays (zero per-frame GC allocation)
    this._D = new Float64Array(V);
    this._bRe = new Float64Array(V);
    this._bIm = new Float64Array(V);
    this._mu = new Float64Array(V);
    this._sigmaSnap = new Float64Array(E);
    this._sumW = new Float64Array(V);
    this._rtDp0 = new Float64Array(V);
    this._rtDp1 = new Float64Array(V);
    this._rtPickSide = new Uint8Array(V * 2);

    // Horizon ring Sherman-Morrison & Ricci/RT scratch arrays
    const L = Math.max(1, this.horizonLength);
    this._hDiag = new Float64Array(L);
    this._hSupRe = new Float64Array(L);
    this._hSupIm = new Float64Array(L);
    this._hSubRe = new Float64Array(L);
    this._hSubIm = new Float64Array(L);
    this._hRhsRe = new Float64Array(L);
    this._hRhsIm = new Float64Array(L);
    this._hYRe = new Float64Array(L);
    this._hYIm = new Float64Array(L);
    this._hZRe = new Float64Array(L);
    this._hZIm = new Float64Array(L);
    this._hURe = new Float64Array(L);
    this._hUIm = new Float64Array(L);
    this._tCRe = new Float64Array(L);
    this._tCIm = new Float64Array(L);
    this._tDRe = new Float64Array(L);
    this._tDIm = new Float64Array(L);
    this._hDist = new Float64Array(L * L);
    this._ringCum = new Float64Array(L + 1);
    this._rtBestAssign = new Uint8Array(L);
    this._rtRDp0 = new Float64Array(L);
    this._rtRDp1 = new Float64Array(L);
    this._rtRPrev0 = new Uint8Array(L);
    this._rtRPrev1 = new Uint8Array(L);
    const maxDeg = this.p + 2;
    this._wMuU = new Float64Array(maxDeg);
    this._wMuV = new Float64Array(maxDeg);
    this._wCost = new Float64Array(maxDeg * maxDeg);

    // Ryu-Takayanagi state
    this.rtRegionA = new Uint8Array(this.N);
    this.rtCutEdges = new Uint8Array(E);
    this.rtWedgeNodes = new Uint8Array(V);
    this.rtEntropy = 0;
    this.rtCutCount = 0;
    this.rtTouchesHorizon = false;

    this._syncWeights();
    this.computeOllivierRicci();
  }

  /**
   * Exact Gubser-et-al. p-adic AdS/CFT bulk scalar mass squared:
   *   m^2(Delta) = p^Delta + p^{1 - Delta} - (p + 1)
   * Minimum at Delta = 1/2 gives exact Breitenlohner-Freedman bound:
   *   m_BF^2 = -(sqrt(p) - 1)^2.
   */
  massSquared(delta = this.delta) {
    return this.p ** delta + this.p ** (1 - delta) - (this.p + 1);
  }

  bfBound() {
    const s = Math.sqrt(this.p) - 1;
    return -(s * s);
  }

  _syncWeights() {
    const E = this.numEdges;
    for (let e = 0; e < E; e++) {
      let s = this.sigma[e] + this.pinSigma[e];
      if (s < -3.5) s = -3.5;
      else if (s > 4.5) s = 4.5;
      const a = Math.exp(s);
      this.edgeLength[e] = a;
      this.edgeWeight[e] = 1.0 / a;
    }
  }

  /** User wormhole surgery: pinch (positive deltaSigma -> longer/weaker edge) or amplify bulk edge. */
  pinchEdge(edgeId, deltaSigma) {
    if (edgeId < 0 || edgeId >= this.numEdges) return;
    this.pinSigma[edgeId] = Math.max(-3.0, Math.min(4.2, this.pinSigma[edgeId] + deltaSigma));
    this._syncWeights();
  }

  resetGravity() {
    this.sigma.fill(0);
    this.sigmaVel.fill(0);
    this.pinSigma.fill(0);
    this._syncWeights();
    this.computeOllivierRicci();
  }

  /**
   * Exact Complex Thomas Algorithm for tridiagonal system T x = rhs
   * where T has real diagonal diag[0..L-1], complex superdiagonal sup[0..L-2],
   * and complex subdiagonal sub[0..L-2].
   */
  _solveTridiagonal(L, diag, supRe, supIm, subRe, subIm, rhsRe, rhsIm, outRe, outIm) {
    const cRe = this._tCRe;
    const cIm = this._tCIm;
    const dRe = this._tDRe;
    const dIm = this._tDIm;

    // Row 0
    const inv0 = 1.0 / diag[0];
    cRe[0] = supRe[0] * inv0;
    cIm[0] = supIm[0] * inv0;
    dRe[0] = rhsRe[0] * inv0;
    dIm[0] = rhsIm[0] * inv0;

    // Forward sweep
    for (let i = 1; i < L; i++) {
      const aRe = subRe[i - 1];
      const aIm = subIm[i - 1];
      // denom = diag[i] - a * c[i - 1]
      const denRe = diag[i] - (aRe * cRe[i - 1] - aIm * cIm[i - 1]);
      const denIm = -(aRe * cIm[i - 1] + aIm * cRe[i - 1]);
      const invMag2 = 1.0 / (denRe * denRe + denIm * denIm);

      if (i < L - 1) {
        const sRe = supRe[i];
        const sIm = supIm[i];
        cRe[i] = (sRe * denRe + sIm * denIm) * invMag2;
        cIm[i] = (sIm * denRe - sRe * denIm) * invMag2;
      }

      // num = rhs[i] - a * d[i - 1]
      const nRe = rhsRe[i] - (aRe * dRe[i - 1] - aIm * dIm[i - 1]);
      const nIm = rhsIm[i] - (aRe * dIm[i - 1] + aIm * dRe[i - 1]);
      dRe[i] = (nRe * denRe + nIm * denIm) * invMag2;
      dIm[i] = (nIm * denRe - nRe * denIm) * invMag2;
    }

    // Back substitution
    outRe[L - 1] = dRe[L - 1];
    outIm[L - 1] = dIm[L - 1];
    for (let i = L - 2; i >= 0; i--) {
      outRe[i] = dRe[i] - (cRe[i] * outRe[i + 1] - cIm[i] * outIm[i + 1]);
      outIm[i] = dIm[i] - (cRe[i] * outIm[i + 1] + cIm[i] * outRe[i + 1]);
    }
  }

  /**
   * Solve the exact bulk Hermitian Klein-Gordon equation on the curved Bruhat-Tits tree
   * or rotating BTZ black hole:
   *   sum_{u ~ v} w_{uv} (phi_v - exp(i A_{uv}) phi_u) + m^2 * mu_v * phi_v = 0
   * with Dirichlet boundary data phi(leaf_l) = boundary[l] (leaf-ordered!).
   *
   * Complexity: O(V) exact to machine precision (~1e-14).
   */
  solveBulkField(boundaryLeafRe, boundaryLeafIm) {
    this._syncWeights();

    const V = this.numNodes;
    const w = this.edgeWeight;
    const D = this._D;
    const bRe = this._bRe;
    const bIm = this._bIm;
    const mu = this._mu;
    const phiRe = this.phiRe;
    const phiIm = this.phiIm;

    const m2 = this.massSquared(this.delta);

    // 1. Set Dirichlet boundary values on leaves
    for (let l = 0; l < this.N; l++) {
      const v = this.leafNodes[l];
      phiRe[v] = boundaryLeafRe[l];
      phiIm[v] = boundaryLeafIm[l];
    }

    // 2. Assemble initial diagonals D[u] and leaf-boundary RHS b[u]
    for (let u = 0; u < V; u++) {
      if (this.isLeaf[u]) continue;
      const neighbors = this.adj[u];
      let sumW = 0;
      let rhsR = 0;
      let rhsI = 0;
      for (let i = 0; i < neighbors.length; i++) {
        const nb = neighbors[i];
        const we = w[nb.edge];
        sumW += we;
        if (this.isLeaf[nb.to]) {
          rhsR += we * phiRe[nb.to];
          rhsI += we * phiIm[nb.to];
        }
      }
      const muU = sumW / neighbors.length;
      mu[u] = muU;
      let diag = sumW + m2 * muU;

      // Exact asymptotic infinity-branch Robin impedance at root of pure Bruhat-Tits AdS
      if (!this.isBTZ && u === 0 && this.asymptoticRoot) {
        diag += muU * (1.0 - this.p ** (-this.delta));
      }

      D[u] = diag;
      bRe[u] = rhsR;
      bIm[u] = rhsI;
    }

    // 3. Bottom-up Schur-complement elimination of all internal non-horizon tree nodes
    const order = this.internalTreeOrder;
    for (let idx = order.length - 1; idx >= 0; idx--) {
      const c = order[idx];
      const par = this.parent[c];
      const we = w[this.parentEdge[c]];
      const invDc = 1.0 / D[c];
      const factor = we * invDc;
      D[par] -= we * factor;
      bRe[par] += factor * bRe[c];
      bIm[par] += factor * bIm[c];
    }

    // 4. Solve apex (pure AdS root) OR cyclic rotating BTZ black hole horizon ring
    if (!this.isBTZ) {
      const invD0 = 1.0 / D[0];
      phiRe[0] = bRe[0] * invD0;
      phiIm[0] = bIm[0] * invD0;
    } else {
      const L = this.horizonLength;
      const theta = this.horizonFlux / L;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const hDiag = this._hDiag;
      const hSupRe = this._hSupRe;
      const hSupIm = this._hSupIm;
      const hSubRe = this._hSubRe;
      const hSubIm = this._hSubIm;
      const hRhsRe = this._hRhsRe;
      const hRhsIm = this._hRhsIm;

      for (let j = 0; j < L; j++) {
        const hj = this.horizonNodes[j];
        hDiag[j] = D[hj];
        hRhsRe[j] = bRe[hj];
        hRhsIm[j] = bIm[hj];
      }

      for (let j = 0; j < L - 1; j++) {
        const wj = w[this.horizonEdges[j]];
        // M[j, j+1] = -wj * exp(+i * theta), M[j+1, j] = -wj * exp(-i * theta)
        hSupRe[j] = -wj * cosT;
        hSupIm[j] = -wj * sinT;
        hSubRe[j] = -wj * cosT;
        hSubIm[j] = wj * sinT;
      }

      // Rank-1 positive-semidefinite decomposition of wrap-around edge e_{L-1}: (h_{L-1} -> h_0)
      // M = T + u * v^H where u = [1, 0, ..., -exp(+i*theta)]^T,
      // v^H = w_wrap * [1, 0, ..., -exp(-i*theta)]
      const wWrap = w[this.horizonEdges[L - 1]];
      hDiag[0] -= wWrap;
      hDiag[L - 1] -= wWrap;

      const uRe = this._hURe;
      const uIm = this._hUIm;
      uRe.fill(0);
      uIm.fill(0);
      uRe[0] = 1.0;
      uRe[L - 1] = -cosT;
      uIm[L - 1] = -sinT;

      // Solve T y = rhs and T z = u
      this._solveTridiagonal(L, hDiag, hSupRe, hSupIm, hSubRe, hSubIm, hRhsRe, hRhsIm, this._hYRe, this._hYIm);
      this._solveTridiagonal(L, hDiag, hSupRe, hSupIm, hSubRe, hSubIm, uRe, uIm, this._hZRe, this._hZIm);

      const yRe = this._hYRe;
      const yIm = this._hYIm;
      const zRe = this._hZRe;
      const zIm = this._hZIm;

      // v^H y = wWrap * (y[0] - exp(-i*theta) * y[L-1])
      const vyRe = wWrap * (yRe[0] - (cosT * yRe[L - 1] + sinT * yIm[L - 1]));
      const vyIm = wWrap * (yIm[0] - (cosT * yIm[L - 1] - sinT * yRe[L - 1]));

      // 1 + v^H z = 1 + wWrap * (z[0] - exp(-i*theta) * z[L-1])
      const denRe = 1.0 + wWrap * (zRe[0] - (cosT * zRe[L - 1] + sinT * zIm[L - 1]));
      const denIm = wWrap * (zIm[0] - (cosT * zIm[L - 1] - sinT * zRe[L - 1]));
      const invDenMag2 = 1.0 / (denRe * denRe + denIm * denIm);

      const cRe = (vyRe * denRe + vyIm * denIm) * invDenMag2;
      const cIm = (vyIm * denRe - vyRe * denIm) * invDenMag2;

      for (let j = 0; j < L; j++) {
        const hj = this.horizonNodes[j];
        phiRe[hj] = yRe[j] - (cRe * zRe[j] - cIm * zIm[j]);
        phiIm[hj] = yIm[j] - (cRe * zIm[j] + cIm * zRe[j]);
      }
    }

    // 5. Top-down back-substitution through all internal tree nodes
    for (let idx = 0; idx < order.length; idx++) {
      const c = order[idx];
      const par = this.parent[c];
      const we = w[this.parentEdge[c]];
      const invDc = 1.0 / D[c];
      phiRe[c] = (bRe[c] + we * phiRe[par]) * invDc;
      phiIm[c] = (bIm[c] + we * phiIm[par]) * invDc;
    }

    // 6. Compute exact bulk stress-energy T_e, horizon circulation current, & exact PDE residual
    this._computeStressAndResidual(m2);
  }

  _computeStressAndResidual(m2) {
    const V = this.numNodes;
    const E = this.numEdges;
    const w = this.edgeWeight;
    const phiRe = this.phiRe;
    const phiIm = this.phiIm;
    const mu = this._mu;

    const L = this.horizonLength;
    const theta = this.isBTZ ? this.horizonFlux / L : 0;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    let hCurrent = 0;
    let hEnt = 0;
    for (let ei = 0; ei < E; ei++) {
      const e = this.edges[ei];
      const u = e.u;
      const v = e.v;
      const we = w[ei];
      if (e.isHorizon) {
        // Gauge-covariant difference: phi_u - exp(+i*theta) * phi_v
        const rotVRe = cosT * phiRe[v] - sinT * phiIm[v];
        const rotVIm = cosT * phiIm[v] + sinT * phiRe[v];
        const dRe = phiRe[u] - rotVRe;
        const dIm = phiIm[u] - rotVIm;
        this.edgeStress[ei] = we * (dRe * dRe + dIm * dIm);
        // Gauge-invariant horizon probability current J = Im(conj(phi_u) * exp(i*theta) * phi_v) * w
        hCurrent += we * (phiRe[u] * rotVIm - phiIm[u] * rotVRe);
        hEnt += we * Math.log(this.p);
      } else {
        const dRe = phiRe[u] - phiRe[v];
        const dIm = phiIm[u] - phiIm[v];
        this.edgeStress[ei] = we * (dRe * dRe + dIm * dIm);
      }
    }
    this.horizonFluxCurrent = this.isBTZ ? hCurrent / L : 0;
    this.horizonEntropy = hEnt;

    // Exact uneliminated PDE residual verification across all internal nodes
    let maxRes = 0;
    for (let u = 0; u < V; u++) {
      if (this.isLeaf[u]) continue;
      let resRe = m2 * mu[u] * phiRe[u];
      let resIm = m2 * mu[u] * phiIm[u];
      if (!this.isBTZ && u === 0 && this.asymptoticRoot) {
        const rImp = mu[u] * (1.0 - this.p ** (-this.delta));
        resRe += rImp * phiRe[u];
        resIm += rImp * phiIm[u];
      }
      const neighbors = this.adj[u];
      for (let i = 0; i < neighbors.length; i++) {
        const nb = neighbors[i];
        const e = this.edges[nb.edge];
        const we = w[nb.edge];
        const v = nb.to;
        if (e.isHorizon) {
          const s = nb.dir; // +1 means u -> v (+theta), -1 means v -> u (-theta)
          const rRe = cosT * phiRe[v] - s * sinT * phiIm[v];
          const rIm = cosT * phiIm[v] + s * sinT * phiRe[v];
          resRe += we * (phiRe[u] - rRe);
          resIm += we * (phiIm[u] - rIm);
        } else {
          resRe += we * (phiRe[u] - phiRe[v]);
          resIm += we * (phiIm[u] - phiIm[v]);
        }
      }
      const mag = Math.hypot(resRe, resIm);
      if (mag > maxRes) maxRes = mag;
    }
    this.maxResidual = maxRes;
  }

  /**
   * Gubser-Heydeman-Jepsen-Marcolli Dynamic Edge-Length Einstein Gravity step.
   * Evolves gravitational log-lengths sigma_e via damped wave equation coupled to
   * bulk matter stress-energy T_e, using symplectic semi-implicit Euler.
   */
  stepGravity(dt, { newtonG = 1.2, stiffness = 2.4, coupling = 1.6, damping = 1.4 } = {}) {
    const E = this.numEdges;
    const sigma = this.sigma;
    const vel = this.sigmaVel;
    const stress = this.edgeStress;
    const neighbors = this.edgeNeighbors;

    // Snapshot sigma before updating so the discrete line-graph wave operator is strictly symmetric
    // (zero directional Gauss-Seidel edge-ordering bias!)
    const snap = this._sigmaSnap;
    snap.set(sigma);

    // Normalize stress scale to boundary size N so gravity responds consistently across primes
    const gEff = newtonG * this.N * 0.18;
    let gravE = 0;

    for (let ei = 0; ei < E; ei++) {
      const nb = neighbors[ei];
      let avgNb = 0;
      for (let i = 0; i < nb.length; i++) avgNb += snap[nb[i]];
      if (nb.length > 0) avgNb /= nb.length;

      // Stress-energy stretches local edge length (gravitational redshift / throat elongation)
      const sig0 = snap[ei];
      const acc =
        -stiffness * sig0 +
        coupling * (avgNb - sig0) -
        damping * vel[ei] +
        gEff * Math.min(stress[ei], 2.5);

      vel[ei] += dt * acc;
      sigma[ei] = sig0 + dt * vel[ei];
      if (sigma[ei] < -2.5) {
        sigma[ei] = -2.5;
        vel[ei] *= -0.3;
      } else if (sigma[ei] > 3.2) {
        sigma[ei] = 3.2;
        vel[ei] *= -0.3;
      }
      gravE += 0.5 * (vel[ei] * vel[ei] + stiffness * sigma[ei] * sigma[ei]);
    }

    this.totalGravEnergy = gravE;
    this._syncWeights();
  }

  /**
   * Compute exact holographic gravitational backreaction potential V_grav(leaf)
   * felt on the boundary Z_p / p^n Z_p from bulk radial metric distortion a_e - 1.
   */
  computeBoundaryPotential(outLeafPotential, strength = 1.0) {
    for (let l = 0; l < this.N; l++) {
      let cur = this.leafNodes[l];
      let vGrav = 0;
      let scale = 1.0;
      while (this.parent[cur] !== -1) {
        const pe = this.parentEdge[cur];
        vGrav += scale * (this.edgeLength[pe] - 1.0);
        scale *= 1.0 / Math.sqrt(this.p);
        cur = this.parent[cur];
      }
      // If BTZ black hole, also include gravitational strain of the attached horizon edges
      if (this.isBTZ && this.isHorizon[cur]) {
        const adjCur = this.adj[cur];
        for (let i = 0; i < adjCur.length; i++) {
          const ei = adjCur[i].edge;
          if (this.edges[ei].isHorizon) {
            vGrav += 0.5 * scale * (this.edgeLength[ei] - 1.0);
          }
        }
      }
      outLeafPotential[l] = strength * vGrav;
    }
  }

  /**
   * Compute EXACT Ollivier-Ricci discrete curvature on every edge e = (u, v):
   *   kappa(u, v) = 1 - W_1(mu_u, mu_v) / a_{uv}
   * where mu_u(x) = w_{ux} / sum_{z ~ u} w_{uz} is the weighted conductance random walk.
   *
   * On pure uniform Bruhat-Tits tree T_p (a_e = 1):
   *   kappa(u, v) = -2 * (p - 1) / (p + 1)  identically for every internal edge!
   */
  computeOllivierRicci() {
    const V = this.numNodes;
    const E = this.numEdges;
    const a = this.edgeLength;
    const w = this.edgeWeight;

    // Precompute weighted degree W_u = sum_{z ~ u} w_{uz}
    const sumW = this._sumW;
    for (let u = 0; u < V; u++) {
      let s = 0;
      const nb = this.adj[u];
      for (let i = 0; i < nb.length; i++) s += w[nb[i].edge];
      sumW[u] = s;
    }

    // If BTZ, precompute exact shortest-path distances among horizon nodes
    let hDist = null;
    if (this.isBTZ) {
      const L = this.horizonLength;
      hDist = this._hDist;
      const ringCum = this._ringCum;
      ringCum[0] = 0;
      for (let j = 0; j < L; j++) {
        ringCum[j + 1] = ringCum[j] + a[this.horizonEdges[j]];
      }
      const totalRing = ringCum[L];
      for (let i = 0; i < L; i++) {
        for (let j = 0; j < L; j++) {
          const cw = i <= j ? ringCum[j] - ringCum[i] : totalRing - (ringCum[i] - ringCum[j]);
          const ccw = totalRing - cw;
          hDist[i * L + j] = cw < ccw ? cw : ccw;
        }
      }
    }

    let curvSum = 0;
    let internalCount = 0;

    for (let ei = 0; ei < E; ei++) {
      const e = this.edges[ei];
      const u = e.u;
      const v = e.v;
      const auv = a[ei];
      const wuv = w[ei];

      if (!e.isHorizon) {
        // Tree edge: removing e disconnects the graph into T_u and T_v.
        // Exact Kantorovich-Rubinstein tree theorem:
        //   W_1(mu_u, mu_v) = sum_{x ~ u, x != v} a_{ux} mu_u(x)
        //                   + sum_{y ~ v, y != u} a_{vy} mu_v(y)
        //                   + a_{uv} |1 - mu_u(v) - mu_v(u)|
        const invWu = 1.0 / sumW[u];
        const invWv = 1.0 / sumW[v];
        let w1 = 0;

        const nbU = this.adj[u];
        for (let i = 0; i < nbU.length; i++) {
          const x = nbU[i];
          if (x.to !== v) {
            w1 += a[x.edge] * (w[x.edge] * invWu);
          }
        }
        const nbV = this.adj[v];
        for (let i = 0; i < nbV.length; i++) {
          const y = nbV[i];
          if (y.to !== u) {
            w1 += a[y.edge] * (w[y.edge] * invWv);
          }
        }
        w1 += auv * Math.abs(1.0 - wuv * invWu - wuv * invWv);

        const kappa = 1.0 - w1 / auv;
        this.ricciCurvature[ei] = kappa;
        if (!this.isLeaf[v]) {
          curvSum += kappa;
          internalCount++;
        }
      } else {
        // BTZ horizon edge: neighbors can shortcut around the horizon ring!
        // Compute exact shortest-path cost matrix between N(u) and N(v) and solve exact W_1.
        const nbU = this.adj[u];
        const nbV = this.adj[v];
        const m = nbU.length;
        const k = nbV.length;
        const muU = this._wMuU.subarray(0, m);
        const muV = this._wMuV.subarray(0, k);
        const invWu = 1.0 / sumW[u];
        const invWv = 1.0 / sumW[v];
        for (let i = 0; i < m; i++) muU[i] = w[nbU[i].edge] * invWu;
        for (let j = 0; j < k; j++) muV[j] = w[nbV[j].edge] * invWv;

        const L = this.horizonLength;
        const hu = this.nodeIndexInLevel[u];
        const hv = this.nodeIndexInLevel[v];
        const cost = this._wCost.subarray(0, m * k);

        for (let i = 0; i < m; i++) {
          const x = nbU[i].to;
          const xIsH = this.isHorizon[x];
          const hx = xIsH ? this.nodeIndexInLevel[x] : hu;
          const xExtra = xIsH ? 0 : a[nbU[i].edge];

          for (let j = 0; j < k; j++) {
            const y = nbV[j].to;
            if (x === y) {
              cost[i * k + j] = 0;
              continue;
            }
            const yIsH = this.isHorizon[y];
            const hy = yIsH ? this.nodeIndexInLevel[y] : hv;
            const yExtra = yIsH ? 0 : a[nbV[j].edge];
            cost[i * k + j] = xExtra + hDist[hx * L + hy] + yExtra;
          }
        }

        const w1 = exactWassersteinBipartite(muU, muV, cost);
        const kappa = 1.0 - w1 / auv;
        this.ricciCurvature[ei] = kappa;
        curvSum += kappa;
        internalCount++;
      }
    }

    this.meanCurvature = internalCount > 0 ? curvSum / internalCount : 0;
  }

  /**
   * Exact O(V) Ryu-Takayanagi Holographic Minimal Cut & Entanglement Wedge Solver.
   * Finds the exact global minimum-capacity edge cut separating boundary subset A
   * (regionALeaves[l] === 1) from its complement A_bar (regionALeaves[l] === 0),
   * with holographic edge bond-capacity cap(e) = w_e * ln(p).
   *
   * Works identically on both pure Bruhat-Tits trees and unicyclic BTZ black holes
   * via bottom-up tree DP + exact 2-case cyclic DP around the BTZ horizon ring.
   */
  computeRyuTakayanagi(regionALeaves = this.rtRegionA) {
    if (regionALeaves !== this.rtRegionA) {
      this.rtRegionA.set(regionALeaves);
    }

    const V = this.numNodes;
    const E = this.numEdges;
    const w = this.edgeWeight;
    const lnP = Math.log(this.p);
    const INF = 1e18;

    const dp0 = this._rtDp0;
    const dp1 = this._rtDp1;
    // Track child choice given parent side: pickChildSide[c * 2 + parentSide] in {0, 1}
    const pickSide = this._rtPickSide;

    // 1. Leaves have fixed boundary labels
    for (let l = 0; l < this.N; l++) {
      const v = this.leafNodes[l];
      if (this.rtRegionA[l]) {
        dp0[v] = INF;
        dp1[v] = 0;
      } else {
        dp0[v] = 0;
        dp1[v] = INF;
      }
    }

    // 2. Bottom-up tree DP over all non-leaf nodes (reverse BFS order)
    for (let u = V - 1; u >= 0; u--) {
      if (this.isLeaf[u]) continue;
      let cost0 = 0;
      let cost1 = 0;
      const ch = this.children[u];
      for (let i = 0; i < ch.length; i++) {
        const c = ch[i];
        const cap = w[this.parentEdge[c]] * lnP;

        // If parent u is on side 0:
        const c0Stay = dp0[c];
        const c0Cut = dp1[c] + cap;
        if (c0Stay <= c0Cut) {
          cost0 += c0Stay;
          pickSide[c * 2 + 0] = 0;
        } else {
          cost0 += c0Cut;
          pickSide[c * 2 + 0] = 1;
        }

        // If parent u is on side 1:
        const c1Stay = dp1[c];
        const c1Cut = dp0[c] + cap;
        if (c1Stay <= c1Cut) {
          cost1 += c1Stay;
          pickSide[c * 2 + 1] = 1;
        } else {
          cost1 += c1Cut;
          pickSide[c * 2 + 1] = 0;
        }
      }
      dp0[u] = cost0;
      dp1[u] = cost1;
    }

    const side = this.rtWedgeNodes;
    side.fill(0);
    let minEntropy = 0;

    if (!this.isBTZ) {
      // Pure AdS tree: choose best side at root 0
      if (dp0[0] <= dp1[0]) {
        side[0] = 0;
        minEntropy = dp0[0];
      } else {
        side[0] = 1;
        minEntropy = dp1[0];
      }
    } else {
      // Exact cyclic DP around BTZ horizon ring h_0..h_{L-1}
      const L = this.horizonLength;
      let bestCost = INF;
      const bestAssign = this._rtBestAssign;
      const rDp0 = this._rtRDp0;
      const rDp1 = this._rtRDp1;
      const rPrev0 = this._rtRPrev0;
      const rPrev1 = this._rtRPrev1;

      for (let firstSide = 0; firstSide <= 1; firstSide++) {
        rDp0.fill(INF);
        rDp1.fill(INF);
        rPrev0.fill(0);
        rPrev1.fill(0);

        const h0 = this.horizonNodes[0];
        if (firstSide === 0) rDp0[0] = dp0[h0];
        else rDp1[0] = dp1[h0];

        for (let j = 1; j < L; j++) {
          const hj = this.horizonNodes[j];
          const cap = w[this.horizonEdges[j - 1]] * lnP;

          // Assign h_j = 0
          const from0to0 = rDp0[j - 1] + dp0[hj];
          const from1to0 = rDp1[j - 1] + cap + dp0[hj];
          if (from0to0 <= from1to0) {
            rDp0[j] = from0to0;
            rPrev0[j] = 0;
          } else {
            rDp0[j] = from1to0;
            rPrev0[j] = 1;
          }

          // Assign h_j = 1
          const from1to1 = rDp1[j - 1] + dp1[hj];
          const from0to1 = rDp0[j - 1] + cap + dp1[hj];
          if (from1to1 <= from0to1) {
            rDp1[j] = from1to1;
            rPrev1[j] = 1;
          } else {
            rDp1[j] = from0to1;
            rPrev1[j] = 0;
          }
        }

        // Close the ring with wrap-around edge e_{L-1} between h_{L-1} and h_0
        const capWrap = w[this.horizonEdges[L - 1]] * lnP;
        const end0 = rDp0[L - 1] + (firstSide === 0 ? 0 : capWrap);
        const end1 = rDp1[L - 1] + (firstSide === 1 ? 0 : capWrap);

        const endSide = end0 <= end1 ? 0 : 1;
        const candCost = Math.min(end0, end1);

        if (candCost < bestCost) {
          bestCost = candCost;
          let cur = endSide;
          for (let j = L - 1; j >= 0; j--) {
            bestAssign[j] = cur;
            if (j > 0) cur = cur === 0 ? rPrev0[j] : rPrev1[j];
          }
        }
      }

      minEntropy = bestCost;
      for (let j = 0; j < L; j++) {
        side[this.horizonNodes[j]] = bestAssign[j];
      }
    }

    // 3. Top-down reconstruction of entanglement wedge side[v] for all tree nodes
    for (let u = 0; u < V; u++) {
      if (this.isLeaf[u]) continue;
      const su = side[u];
      const ch = this.children[u];
      for (let i = 0; i < ch.length; i++) {
        const c = ch[i];
        side[c] = pickSide[c * 2 + su];
      }
    }

    // 4. Identify cut edges gamma_A and whether entanglement wedge E(A) intersects the BTZ horizon
    this.rtCutEdges.fill(0);
    let cutCount = 0;
    let touchesHorizon = false;
    let horizonNodesInWedge = 0;
    for (let ei = 0; ei < E; ei++) {
      const e = this.edges[ei];
      if (side[e.u] !== side[e.v]) {
        this.rtCutEdges[ei] = 1;
        cutCount++;
        if (e.isHorizon) {
          touchesHorizon = true;
        }
      }
    }
    if (this.isBTZ) {
      for (let j = 0; j < this.horizonLength; j++) {
        if (side[this.horizonNodes[j]] === 1) horizonNodesInWedge++;
      }
      if (horizonNodesInWedge > 0) touchesHorizon = true;
    }

    this.rtEntropy = minEntropy;
    this.rtCutCount = cutCount;
    this.rtTouchesHorizon = touchesHorizon;
    this.rtHorizonNodesInWedge = horizonNodesInWedge;

    return {
      entropy: minEntropy,
      cutCount,
      touchesHorizon,
      cutEdges: this.rtCutEdges,
      wedgeNodes: this.rtWedgeNodes,
    };
  }

  /**
   * Compute exact shortest weighted geodesic path between two boundary leaves
   * (used for the Ultrametric Triangle & Geodesic Prover).
   */
  shortestGeodesic(leafA, leafB) {
    const start = this.leafNodes[leafA];
    const goal = this.leafNodes[leafB];
    const V = this.numNodes;
    const dist = new Float64Array(V).fill(Infinity);
    const prevNode = new Int32Array(V).fill(-1);
    const prevEdge = new Int32Array(V).fill(-1);
    const visited = new Uint8Array(V);
    dist[start] = 0;

    // Simple Dijkstra (V <= 1200, called on user click only)
    for (let iter = 0; iter < V; iter++) {
      let u = -1;
      let best = Infinity;
      for (let i = 0; i < V; i++) {
        if (!visited[i] && dist[i] < best) {
          best = dist[i];
          u = i;
        }
      }
      if (u === -1 || u === goal) break;
      visited[u] = 1;
      const nb = this.adj[u];
      for (let i = 0; i < nb.length; i++) {
        const v = nb[i].to;
        const nd = best + this.edgeLength[nb[i].edge];
        if (nd < dist[v]) {
          dist[v] = nd;
          prevNode[v] = u;
          prevEdge[v] = nb[i].edge;
        }
      }
    }

    const pathEdges = [];
    const pathNodes = [];
    let cur = goal;
    while (cur !== -1) {
      pathNodes.push(cur);
      if (prevEdge[cur] !== -1) pathEdges.push(prevEdge[cur]);
      cur = prevNode[cur];
    }
    pathNodes.reverse();
    pathEdges.reverse();

    return {
      distance: dist[goal],
      hops: pathEdges.length,
      nodes: pathNodes,
      edges: pathEdges,
    };
  }
}

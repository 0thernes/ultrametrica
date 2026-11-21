/**
 * ULTRAMETRICA — High-DPI 2D Scientific Oscilloscope & Mathematical Prover Panels.
 *
 *   1. RealitySplitCanvas: Non-Archimedean Q_p vs Synchronized Archimedean R Twin
 *   2. SpectrumCanvas: Pontryagin-Dual Vladimirov Valuation Shells & Prime-Power Hz
 *   3. TriangleCanvas: Exact Ultrametric Isosceles & Bruhat-Tits Geodesic Prover
 */

import { phaseToRGB } from './renderer3d.js';
import { computeShellFrequencies } from './audio.js';

function prepHiDPI(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: canvas.clientWidth, H: canvas.clientHeight };
}

export class RealitySplitPanel {
  constructor(canvas, onInjectBall) {
    this.canvas = canvas;
    this.onInjectBall = onInjectBall;
    this._lastSim = null;

    canvas.addEventListener('click', (e) => {
      if (!this._lastSim || !this.onInjectBall) return;
      const rect = canvas.getBoundingClientRect();
      const padL = 8;
      const padR = 8;
      const fx = (e.clientX - rect.left - padL) / Math.max(1, rect.width - padL - padR);
      if (fx < 0 || fx > 1) return;
      const leaf = Math.min(this._lastSim.space.N - 1, Math.max(0, Math.floor(fx * this._lastSim.space.N)));
      this.onInjectBall(leaf, e.shiftKey);
    });
  }

  render(sim) {
    this._lastSim = sim;
    const { ctx, W, H } = prepHiDPI(this.canvas);
    ctx.clearRect(0, 0, W, H);

    const q = sim.quantum;
    const N = sim.space.N;
    const p = sim.p;
    const padL = 8;
    const padR = 8;
    const plotW = Math.max(10, W - padL - padR);
    const midY = Math.floor(H * 0.5);
    const trackH = Math.max(24, midY - 22);

    // Subtle p-adic depth-1 ball dividers across both tracks
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    for (let b = 1; b < p; b++) {
      const x = padL + (b / p) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.lineTo(x, H - 6);
      ctx.stroke();
    }

    // Tracked Kozyrev support ball enclosure [trackedLeafStart, trackedLeafEnd)
    const s0 = q.trackedLeafStart;
    const s1 = q.trackedLeafEnd;
    if (s1 > s0 && s1 - s0 < N) {
      const bx0 = padL + (s0 / N) * plotW;
      const bx1 = padL + (s1 / N) * plotW;
      ctx.fillStyle = 'rgba(34, 211, 238, 0.065)';
      ctx.fillRect(bx0, 16, bx1 - bx0, H - 22);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(bx0 + 0.5, 16.5, Math.max(2, bx1 - bx0 - 1), H - 23);
      ctx.setLineDash([]);
    }

    // Center divider
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.beginPath();
    ctx.moveTo(padL, midY);
    ctx.lineTo(W - padR, midY);
    ctx.stroke();

    // Shared max probability scale across both universes for apples-to-apples comparison
    let maxP = 1e-6;
    for (let l = 0; l < N; l++) {
      const p1 = q.leafRe[l] ** 2 + q.leafIm[l] ** 2;
      const p2 = q.twinRe[l] ** 2 + q.twinIm[l] ** 2;
      if (p1 > maxP) maxP = p1;
      if (p2 > maxP) maxP = p2;
    }

    const rgb = [0, 0, 0];
    const barW = Math.max(1.2, plotW / N);

    // Upper track: Non-Archimedean Q_p (or Adelic Hybrid)
    const baseTop = midY - 4;
    for (let l = 0; l < N; l++) {
      const prob = q.leafRe[l] ** 2 + q.leafIm[l] ** 2;
      const h = (prob / maxP) * (trackH - 2);
      if (h < 0.35) continue;
      const phase = Math.atan2(q.leafIm[l], q.leafRe[l]);
      phaseToRGB(phase, rgb, 0);
      ctx.fillStyle = `rgb(${(rgb[0] * 255) | 0}, ${(rgb[1] * 255) | 0}, ${(rgb[2] * 255) | 0})`;
      const x = padL + (l / N) * plotW;
      ctx.fillRect(x, baseTop - h, barW + 0.4, h);
    }

    // Lower track: Synchronized Archimedean R Twin
    const baseBot = H - 6;
    const botH = Math.max(24, H - midY - 22);
    for (let l = 0; l < N; l++) {
      const prob = q.twinRe[l] ** 2 + q.twinIm[l] ** 2;
      const h = (prob / maxP) * (botH - 2);
      if (h < 0.35) continue;
      const phase = Math.atan2(q.twinIm[l], q.twinRe[l]);
      phaseToRGB(phase, rgb, 0);
      ctx.fillStyle = `rgba(${(rgb[0] * 235) | 0}, ${(rgb[1] * 205) | 0}, ${(rgb[2] * 235) | 0}, 0.85)`;
      const x = padL + (l / N) * plotW;
      ctx.fillRect(x, baseBot - h, barW + 0.4, h);
    }

    // Crisp labels & exact leakage readouts
    ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const labelTop =
      q.adelicMix >= 0.99
        ? `Q_${p} NON-ARCHIMEDEAN (D_${p}^${q.alpha.toFixed(2)})`
        : q.adelicMix <= 0.01
        ? `R ARCHIMEDEAN (theta=0.00)`
        : `ADELIC HYBRID (theta=${q.adelicMix.toFixed(2)})`;
    ctx.fillStyle = '#67e8f9';
    ctx.textAlign = 'left';
    ctx.fillText(labelTop, padL + 2, 12);

    const leakP = q.leakagePadic * 100;
    ctx.textAlign = 'right';
    ctx.fillStyle = leakP < 1e-4 ? '#34d399' : '#fbbf24';
    ctx.fillText(
      `BALL LEAKAGE: ${leakP < 1e-4 ? '0.000000%' : leakP.toFixed(2) + '%'}  |  IPR ${q.iprPadic.toFixed(3)}`,
      W - padR - 2,
      12
    );

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`R EUCLIDEAN TWIN (-Delta^${(q.alpha * 0.5).toFixed(2)}, SAME E_0)`, padL + 2, midY + 13);

    const leakT = q.leakageTwin * 100;
    ctx.textAlign = 'right';
    ctx.fillStyle = leakT > 20 ? '#f87171' : '#cbd5e1';
    ctx.fillText(
      `BALL LEAKAGE: ${leakT.toFixed(2)}%  |  IPR ${q.iprTwin.toFixed(3)}`,
      W - padR - 2,
      midY + 13
    );
  }
}

export class PontryaginSpectrumPanel {
  constructor(canvas) {
    this.canvas = canvas;
  }

  render(sim) {
    const { ctx, W, H } = prepHiDPI(this.canvas);
    ctx.clearRect(0, 0, W, H);

    const q = sim.quantum;
    const p = sim.p;
    const n = sim.n;
    const shells = n + 1;
    const freqs = computeShellFrequencies(p, n, q.alpha);

    const padL = 10;
    const padR = 10;
    const padT = 18;
    const padB = 34;
    const plotW = Math.max(10, W - padL - padR);
    const plotH = Math.max(16, H - padT - padB);

    // Header
    ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(`VLADIMIROV SHELLS  |xi|_${p}^a = ${p}^(a*s)`, padL, 12);

    const slotW = plotW / shells;
    const barW = Math.max(10, slotW * 0.58);

    // Reference baseline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(W - padR, padT + plotH);
    ctx.stroke();

    for (let s = 0; s < shells; s++) {
      const cx = padL + (s + 0.5) * slotW;
      const dualPow = q.dualShellPower[s];
      const kozPow = q.kozyrevShellPower[s];
      const centroid = q.kozyrevShellCentroid[s];

      // Background slot frame
      ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.fillRect(cx - barW * 0.5, padT, barW, plotH);

      // Exact Pontryagin dual shell power bar
      const rawPow = Math.max(0, Number.isFinite(dualPow) ? dualPow : 0, Number.isFinite(kozPow) ? kozPow : 0);
      const h = Math.min(1, Math.pow(rawPow, 0.58)) * (plotH - 2);
      const grad = ctx.createLinearGradient(0, padT + plotH - h, 0, padT + plotH);
      if (s === 0) {
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(1, '#334155');
      } else {
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.55, '#22d3ee');
        grad.addColorStop(1, '#0e7490');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(cx - barW * 0.5, padT + plotH - h, barW, h);

      // Percentage readout above bar if active
      if (dualPow > 0.01) {
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.font = '600 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.fillText(`${(dualPow * 100).toFixed(0)}%`, cx, Math.max(padT + 9, padT + plotH - h - 4));
      }

      // Stereo Monna centroid indicator dot inside bar base
      if (kozPow > 0.01) {
        const dotX = cx - barW * 0.42 + centroid * barW * 0.84;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(dotX, padT + plotH - 4, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shell eigenvalue label & exact acoustic Hz
      ctx.textAlign = 'center';
      ctx.font = '600 9.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(s === 0 ? '0' : `${p}^${s}`, cx, padT + plotH + 13);

      ctx.font = '500 8.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${Math.round(freqs[s])}Hz`, cx, padT + plotH + 25);
    }
  }
}

export class UltrametricTrianglePanel {
  constructor(canvas) {
    this.canvas = canvas;
  }

  render(sim) {
    const { ctx, W, H } = prepHiDPI(this.canvas);
    ctx.clearRect(0, 0, W, H);

    const proof = sim.triangleProof;
    if (!proof) return;

    const p = sim.p;
    const padL = 8;

    ctx.font = '600 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(`ULTRAMETRIC PROVER  |x+y|_${p} <= max`, padL, 12);

    ctx.textAlign = 'right';
    ctx.fillStyle = proof.isIsosceles && proof.strongTriangleHolds ? '#34d399' : '#f87171';
    ctx.fillText(proof.isIsosceles ? 'ISOSCELES EXACT' : 'VIOLATION', W - 8, 12);

    // Draw an actual isosceles ultrametric triangle diagram on the left half
    const triW = Math.min(118, W * 0.44);
    const cx = padL + triW * 0.5;
    const topY = 28;
    const botY = H - 30;
    const spanX = triW * 0.38;

    // Identify which edge is the unique shortest side (base) vs the 2 equal longest sides!
    const { dAB, dBC, dAC } = proof.distances;
    const { vAB, vBC, vAC } = proof.valuations;
    const { treeAB, treeBC, treeAC } = proof.treeHops;

    // Put the shortest pair at the bottom base so the drawn triangle is geometrically isosceles!
    let labels = ['A', 'B', 'C'];
    let sideL = { d: dAC, v: vAC, h: treeAC };
    let sideR = { d: dBC, v: vBC, h: treeBC };
    let base = { d: dAB, v: vAB, h: treeAB };
    if (dBC <= dAB && dBC <= dAC) {
      labels = ['B', 'C', 'A'];
      sideL = { d: dAB, v: vAB, h: treeAB };
      sideR = { d: dAC, v: vAC, h: treeAC };
      base = { d: dBC, v: vBC, h: treeBC };
    } else if (dAC <= dAB && dAC <= dBC) {
      labels = ['A', 'C', 'B'];
      sideL = { d: dAB, v: vAB, h: treeAB };
      sideR = { d: dBC, v: vBC, h: treeBC };
      base = { d: dAC, v: vAC, h: treeAC };
    }

    const ptTop = [cx, topY];
    const ptBL = [cx - spanX, botY];
    const ptBR = [cx + spanX, botY];

    // Two equal longest sides in luminous cyan
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptTop[0], ptTop[1]);
    ctx.lineTo(ptBL[0], ptBL[1]);
    ctx.moveTo(ptTop[0], ptTop[1]);
    ctx.lineTo(ptBR[0], ptBR[1]);
    ctx.stroke();

    // Base (shorter or equal) in warm amber
    ctx.strokeStyle = Math.abs(base.d - sideL.d) < 1e-12 ? '#38bdf8' : '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptBL[0], ptBL[1]);
    ctx.lineTo(ptBR[0], ptBR[1]);
    ctx.stroke();

    // Vertices
    const pts = [ptBL, ptBR, ptTop];
    const vCols = ['#f8fafc', '#f8fafc', '#fde047'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = vCols[i];
      ctx.beginPath();
      ctx.arc(pts[i][0], pts[i][1], 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Vertex letters
    ctx.font = '700 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(labels[2], ptTop[0], ptTop[1] - 7);
    ctx.fillText(labels[0], ptBL[0] - 8, ptBL[1] + 4);
    ctx.fillText(labels[1], ptBR[0] + 8, ptBR[1] + 4);

    // Side distance labels
    const fmtPow = (s) => (s.d === 0 ? '0' : `${p}^-${s.v}`);
    ctx.font = '600 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillStyle = '#7dd3fc';
    ctx.textAlign = 'right';
    ctx.fillText(fmtPow(sideL), (ptTop[0] + ptBL[0]) * 0.5 - 5, (ptTop[1] + ptBL[1]) * 0.5);
    ctx.textAlign = 'left';
    ctx.fillText(fmtPow(sideR), (ptTop[0] + ptBR[0]) * 0.5 + 5, (ptTop[1] + ptBR[1]) * 0.5);
    ctx.fillStyle = '#fcd34d';
    ctx.textAlign = 'center';
    ctx.fillText(fmtPow(base), cx, botY + 13);

    // Right column: Exact p-adic digit coordinates & Bruhat-Tits geodesic hops
    const rx = padL + triW + 10;
    ctx.textAlign = 'left';
    ctx.font = '500 9.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

    const lines = [
      { k: 'A', v: proof.formatted[0], c: '#e2e8f0' },
      { k: 'B', v: proof.formatted[1], c: '#e2e8f0' },
      { k: 'C', v: proof.formatted[2], c: '#fde047' },
      { k: 'T_p', v: `hops ${treeAB} / ${treeBC} / ${treeAC}`, c: '#7dd3fc' },
      { k: 'Gromov', v: `(A|B)_C = ${proof.gromovProduct.toFixed(0)} hops`, c: '#a7f3d0' },
    ];

    let y = 32;
    for (const row of lines) {
      ctx.fillStyle = '#64748b';
      ctx.fillText(row.k, rx, y);
      ctx.fillStyle = row.c;
      ctx.fillText(row.v, rx + 42, y);
      y += 17;
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '500 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillText('Click 3 rim nodes in Probe mode', padL, H - 5);
  }
}

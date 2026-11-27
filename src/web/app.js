/**
 * ULTRAMETRICA — Main Browser Application Controller.
 * Connects the exact p-adic holographic simulation engine to the WebGL2 3D renderer,
 * high-DPI scientific panels, and 48 kHz AudioWorklet synthesizer.
 */

import { UltrametricaSimulation, EXPERIMENTS } from '../engine/simulation.js';
import { HyperbolicRenderer3D } from './renderer3d.js';
import { RealitySplitPanel, PontryaginSpectrumPanel, UltrametricTrianglePanel } from './panels2d.js';
import { PadicAudioEngine, primeScaleName } from './audio.js';

const sim = new UltrametricaSimulation(3, 5, 0);
const renderer = new HyperbolicRenderer3D(document.getElementById('canvas3d'));
const audio = new PadicAudioEngine();

if (!renderer.supported) {
  document.getElementById('webglFallback')?.classList.remove('hidden');
}

let activeTool = 'wavelet'; // 'wavelet' | 'surgery' | 'rt' | 'triangle'

// ---- DOM Elements ----
const elManifoldBadge = document.getElementById('manifoldBadge');
const elExperimentList = document.getElementById('experimentList');
const elCaptionTitle = document.getElementById('captionTitle');
const elCaptionFormula = document.getElementById('captionFormula');
const elCaptionDesc = document.getElementById('captionDesc');
const elHoverReadout = document.getElementById('hoverReadout');

const elBtnAudio = document.getElementById('btnAudio');
const elAudioLabel = document.getElementById('audioLabel');
const elBtnPause = document.getElementById('btnPause');
const elBtnReset = document.getElementById('btnReset');
const elBtnShare = document.getElementById('btnShare');
const elBtnSnapshot = document.getElementById('btnSnapshot');
const elBtnHelp = document.getElementById('btnHelp');
const elBtnCloseHelp = document.getElementById('btnCloseHelp');
const elHelpModal = document.getElementById('helpModal');
const elBtnAutoOrbit = document.getElementById('btnAutoOrbit');

const elChkGravity = document.getElementById('chkGravity');
const elSldAlpha = document.getElementById('sldAlpha');
const elSldAdelic = document.getElementById('sldAdelic');
const elSldNonlin = document.getElementById('sldNonlin');
const elSldDelta = document.getElementById('sldDelta');
const elSldGravity = document.getElementById('sldGravity');
const elSldFlux = document.getElementById('sldFlux');
const elSldRT = document.getElementById('sldRT');
const elRowFlux = document.getElementById('rowFlux');

const elValAlpha = document.getElementById('valAlpha');
const elValAdelic = document.getElementById('valAdelic');
const elValNonlin = document.getElementById('valNonlin');
const elValDelta = document.getElementById('valDelta');
const elValMass = document.getElementById('valMass');
const elValGravity = document.getElementById('valGravity');
const elValFlux = document.getElementById('valFlux');
const elValRT = document.getElementById('valRT');
const elRtPhaseBadge = document.getElementById('rtPhaseBadge');

const elTelNormDrift = document.getElementById('telNormDrift');
const elTelBulkRes = document.getElementById('telBulkRes');
const elTelRicci = document.getElementById('telRicci');
const elTelRT = document.getElementById('telRT');
const elTelEnergy = document.getElementById('telEnergy');
const elTelHorizonJ = document.getElementById('telHorizonJ');

// ---- 2D Scientific Panels ----
const panelReality = new RealitySplitPanel(document.getElementById('canvasReality'), (leaf, replace) => {
  const j = Math.max(1, Math.min(sim.n - 2, 2));
  const ballSize = sim.space.powP[sim.n - j];
  const ballIdx = (leaf / ballSize) | 0;
  const w = sim.quantum.injectKozyrevWavelet(j, ballIdx, 1, 0.9, replace);
  sim.syncBulkAndMetrics();
  audio.pluck(w.j + 1, (ballIdx + 0.5) / sim.space.powP[j], 0.95);
});
const panelSpectrum = new PontryaginSpectrumPanel(document.getElementById('canvasSpectrum'));
const panelTriangle = new UltrametricTrianglePanel(document.getElementById('canvasTriangle'));

// ---- Experiment Formula Captions ----
function getExperimentFormula(id) {
  const p = sim.p;
  const a = sim.quantum.alpha.toFixed(2);
  switch (id) {
    case 'kozyrev_trap': {
      const shell = Math.max(1, Math.min(sim.n - 2, 2)) + 1;
      return `D_${p}^${a} psi = ${p}^(${shell}*${a}) psi`;
    }
    case 'btz_black_hole':
      return `T_${p} / ${p}^(${sim.horizonDepth}Z), L=${sim.bulk.horizonLength}`;
    case 'ultrametric_tunneling':
      return `i d_t psi = (D_${p}^${a} + g|psi|^2) psi`;
    case 'adelic_fracture':
      return `theta*D_${p}^a + (1-theta)*(-Delta)^(a/2)`;
    case 'page_transition':
      return `S_A = min_cut sum w_e ln(${p})`;
    case 'wormhole_surgery':
      return `kappa = 1 - W_1(mu_u, mu_v)/a_e`;
    default:
      return `Q_${p} / AdS_2`;
  }
}

// ---- Render Experiment Cards ----
function buildExperimentCards() {
  elExperimentList.replaceChildren();
  for (const exp of EXPERIMENTS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = exp.id === sim.activeExperiment;
    btn.className = 'exp-card' + (isActive ? ' active' : '');
    btn.dataset.exp = exp.id;
    btn.setAttribute('aria-pressed', String(isActive));
    const titleSpan = document.createElement('span');
    titleSpan.className = 'exp-card-title';
    titleSpan.textContent = exp.name;
    const subSpan = document.createElement('span');
    subSpan.className = 'exp-card-sub';
    subSpan.textContent = exp.subtitle;
    btn.append(titleSpan, subSpan);
    btn.addEventListener('click', () => selectExperiment(exp.id));
    elExperimentList.appendChild(btn);
  }
}

function selectExperiment(id) {
  sim.loadExperiment(id);
  // Auto-select the most illuminating 3D shader view for certain experiments
  if (id === 'page_transition') {
    setShaderView('rt');
  } else if (id === 'wormhole_surgery') {
    setShaderView('ricci');
  } else {
    setShaderView('field');
  }
  syncUIFromSim();
  audio.pluck(Math.min(sim.n, 3), 0.5, 0.7);
}

function setShaderView(view) {
  renderer.viewMode = view;
  for (const btn of document.querySelectorAll('#shaderGroup .seg-btn')) {
    const active = btn.dataset.view === view;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
}

function setActiveTool(tool) {
  activeTool = tool;
  renderer.showTriangleOverlay = tool === 'triangle';
  for (const btn of document.querySelectorAll('#toolGroup .seg-btn')) {
    const active = btn.dataset.tool === tool;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
  const hints = {
    wavelet: 'Wavelet Mode: Click any node or rim ball to inject Kozyrev eigenstate (Shift = replace)',
    surgery: 'Wormhole Surgery: Click any bulk edge to stretch/pinch a_e (Shift or Right-Click = tighten)',
    rt: 'RT Cut Mode: Click boundary balls to toggle entanglement region A',
    triangle: '3-Pt Mode: Click 3 boundary rim leaves to prove strong triangle inequality',
  };
  elHoverReadout.textContent = hints[tool];
}

function syncUIFromSim() {
  const p = sim.p;
  const bulk = sim.bulk;
  const q = sim.quantum;

  // Manifold badge (compact for 1280px zero-clipping fit)
  if (bulk.isBTZ) {
    elManifoldBadge.textContent = `T_${p}/${p}^(${bulk.horizonDepth}Z) BTZ · L=${bulk.horizonLength} · N=${sim.space.N}`;
    elManifoldBadge.className = 'badge badge-amber';
  } else {
    elManifoldBadge.textContent = `Q_${p} AdS · N=${sim.space.N}`;
    elManifoldBadge.className = 'badge badge-cyan';
  }

  // Prime & topology segmented buttons
  for (const btn of document.querySelectorAll('#primeGroup .seg-btn')) {
    const active = Number(btn.dataset.prime) === p;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
  for (const btn of document.querySelectorAll('#topoGroup .seg-btn')) {
    const active = (btn.dataset.btz === '1') === bulk.isBTZ;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
  for (const btn of document.querySelectorAll('#experimentList .exp-card')) {
    const active = btn.dataset.exp === sim.activeExperiment;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  }

  // Sliders & exact labels
  elChkGravity.checked = sim.gravityEnabled;
  elSldAlpha.value = String(q.alpha);
  elValAlpha.textContent = q.alpha.toFixed(2);

  elSldAdelic.value = String(q.adelicMix);
  elValAdelic.textContent = q.adelicMix.toFixed(2);

  elSldNonlin.value = String(q.nonlinearity);
  elValNonlin.textContent = q.nonlinearity.toFixed(1);

  elSldDelta.value = String(bulk.delta);
  elValDelta.textContent = bulk.delta.toFixed(2);
  const m2 = bulk.massSquared();
  const bf = bulk.bfBound();
  elValMass.textContent = m2 < 0 ? `m²=${m2.toFixed(2)} (BF>${bf.toFixed(2)})` : `m²=+${m2.toFixed(2)}`;

  elSldGravity.value = String(sim.newtonG);
  elValGravity.textContent = sim.newtonG.toFixed(2);

  elSldFlux.value = String(bulk.horizonFlux);
  elValFlux.textContent = `${bulk.horizonFlux.toFixed(2)} rad`;
  elRowFlux.classList.toggle('disabled', !bulk.isBTZ);
  elSldFlux.disabled = !bulk.isBTZ;

  elSldRT.value = String(sim.rtFraction);
  elValRT.textContent = `${Math.round(sim.rtFraction * 100)}%`;

  // Audio label
  if (audio.enabled) {
    elBtnAudio.classList.add('active');
    elAudioLabel.textContent = primeScaleName(p);
  } else {
    elBtnAudio.classList.remove('active');
    elAudioLabel.textContent = 'Audio OFF';
  }

  // Experiment caption
  const exp = EXPERIMENTS.find((e) => e.id === sim.activeExperiment) || EXPERIMENTS[0];
  elCaptionTitle.textContent = exp.name;
  elCaptionFormula.textContent = getExperimentFormula(exp.id);
  elCaptionDesc.textContent = exp.description;

  updateTelemetryDOM();
}

// ---- Wire Up Top Bar Controls ----
document.getElementById('primeGroup').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  const p = Number(btn.dataset.prime);
  if (p === sim.p) return;
  const keepBTZ = sim.bulk.isBTZ;
  sim.reconfigure({ p, btz: keepBTZ });
  syncUIFromSim();
});

document.getElementById('topoGroup').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  sim.setBTZEnabled(btn.dataset.btz === '1');
  syncUIFromSim();
});

document.getElementById('toolGroup').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  setActiveTool(btn.dataset.tool);
});

document.getElementById('shaderGroup').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  setShaderView(btn.dataset.view);
});

elBtnAutoOrbit.addEventListener('click', () => {
  renderer.autoRotate = !renderer.autoRotate;
  elBtnAutoOrbit.classList.toggle('active', renderer.autoRotate);
  elBtnAutoOrbit.setAttribute('aria-pressed', String(renderer.autoRotate));
});

elBtnAudio.addEventListener('click', async () => {
  await audio.toggle();
  elBtnAudio.setAttribute('aria-pressed', String(audio.enabled));
  syncUIFromSim();
});

elBtnPause.addEventListener('click', () => {
  sim.paused = !sim.paused;
  elBtnPause.textContent = sim.paused ? 'Resume' : 'Pause';
  elBtnPause.classList.toggle('active', sim.paused);
  elBtnPause.setAttribute('aria-pressed', String(sim.paused));
});

elBtnReset.addEventListener('click', () => {
  sim.loadExperiment(sim.activeExperiment, { keepTopology: true });
  syncUIFromSim();
});

function buildPermalinkURL() {
  const url = new URL(window.location.href);
  url.searchParams.set('exp', sim.activeExperiment);
  url.searchParams.set('p', String(sim.p));
  url.searchParams.set('btz', sim.bulk.isBTZ ? '1' : '0');
  url.searchParams.set('view', renderer.viewMode);
  url.searchParams.set('alpha', sim.quantum.alpha.toFixed(2));
  url.searchParams.set('theta', sim.quantum.adelicMix.toFixed(2));
  url.searchParams.set('g', sim.quantum.nonlinearity.toFixed(1));
  url.searchParams.set('delta', sim.bulk.delta.toFixed(2));
  url.searchParams.set('grav', sim.newtonG.toFixed(2));
  url.searchParams.set('dyn', sim.gravityEnabled ? '1' : '0');
  if (sim.bulk.isBTZ) url.searchParams.set('flux', sim.bulk.horizonFlux.toFixed(2));
  else url.searchParams.delete('flux');
  url.searchParams.set('rt', sim.rtFraction.toFixed(2));
  return url;
}

function hydrateStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  if ([...params.keys()].length === 0) return;

  const p = Number(params.get('p'));
  const btz = params.get('btz');
  const hasExplicitBtz = btz === '0' || btz === '1';
  if ([2, 3, 5, 7].includes(p) && p !== sim.p) {
    sim.reconfigure({ p, btz: hasExplicitBtz ? btz === '1' : false });
  } else if (hasExplicitBtz) {
    sim.setBTZEnabled(btz === '1');
  }
  const exp = params.get('exp');
  if (exp && EXPERIMENTS.some((e) => e.id === exp)) {
    sim.loadExperiment(exp, { keepTopology: hasExplicitBtz });
  }
  const view = params.get('view');
  if (['field', 'ricci', 'rt', 'gravity'].includes(view)) {
    setShaderView(view);
  }
  const alpha = parseFloat(params.get('alpha'));
  if (Number.isFinite(alpha) && alpha >= 0.25 && alpha <= 2.0) {
    sim.quantum.setAlpha(alpha);
  }
  const theta = parseFloat(params.get('theta'));
  if (Number.isFinite(theta) && theta >= 0 && theta <= 1) {
    sim.quantum.adelicMix = theta;
  }
  const g = parseFloat(params.get('g'));
  if (Number.isFinite(g) && g >= -180 && g <= 200) {
    sim.quantum.nonlinearity = g;
  }
  const delta = parseFloat(params.get('delta'));
  if (Number.isFinite(delta) && delta >= 0.5001 && delta <= 2.4) {
    sim.bulk.delta = delta;
  }
  const grav = parseFloat(params.get('grav'));
  if (Number.isFinite(grav) && grav >= 0 && grav <= 3.5) {
    sim.newtonG = grav;
    sim.backreactionStrength = Math.min(1.5, grav * 0.65);
  }
  const dyn = params.get('dyn');
  if (dyn === '0' || dyn === '1') {
    sim.gravityEnabled = dyn === '1';
  }
  const flux = parseFloat(params.get('flux'));
  if (sim.bulk.isBTZ && Number.isFinite(flux) && flux >= -Math.PI && flux <= Math.PI) {
    sim.bulk.horizonFlux = flux;
  }
  const rt = parseFloat(params.get('rt'));
  if (Number.isFinite(rt) && rt >= 0.03 && rt <= 0.97) {
    sim.setRTRegionFraction(rt);
  }
  sim.syncBulkAndMetrics();
}

elBtnShare.addEventListener('click', async () => {
  const url = buildPermalinkURL();
  window.history.replaceState(null, '', url.toString());
  try {
    await navigator.clipboard.writeText(url.toString());
    elBtnShare.textContent = 'Copied!';
    setTimeout(() => { elBtnShare.textContent = 'Share'; }, 1400);
  } catch {
    elHoverReadout.textContent = `Permalink updated in URL bar: ${url.search}`;
  }
});

elBtnSnapshot.addEventListener('click', () => {
  const png = renderer.capturePNG(sim, performance.now() * 0.001);
  if (!png) return;
  const link = document.createElement('a');
  link.download = `ultrametrica-p${sim.p}-${sim.activeExperiment}.png`;
  link.href = png;
  link.click();
});

function setHelpModalOpen(open) {
  const wasOpen = !elHelpModal.classList.contains('hidden');
  elHelpModal.classList.toggle('hidden', !open);
  if (open && !wasOpen) {
    elBtnCloseHelp.focus();
  } else if (!open && wasOpen) {
    elBtnHelp.focus();
  }
}

elBtnHelp.addEventListener('click', () => setHelpModalOpen(elHelpModal.classList.contains('hidden')));
elBtnCloseHelp.addEventListener('click', () => setHelpModalOpen(false));
elHelpModal.addEventListener('click', (e) => {
  if (e.target === elHelpModal) setHelpModalOpen(false);
});

// ---- Wire Up Physics Sliders ----
elChkGravity.addEventListener('change', () => {
  sim.gravityEnabled = elChkGravity.checked;
  if (!sim.gravityEnabled) {
    sim.bulk.sigma.fill(0);
    sim.bulk.sigmaVel.fill(0);
    sim.syncBulkAndMetrics();
  }
  updateTelemetryDOM();
});

elSldAlpha.addEventListener('input', () => {
  sim.quantum.setAlpha(parseFloat(elSldAlpha.value));
  elValAlpha.textContent = sim.quantum.alpha.toFixed(2);
  elCaptionFormula.textContent = getExperimentFormula(sim.activeExperiment);
  sim.quantum.computeDiagnostics();
  updateTelemetryDOM();
});

elSldAdelic.addEventListener('input', () => {
  sim.quantum.adelicMix = parseFloat(elSldAdelic.value);
  elValAdelic.textContent = sim.quantum.adelicMix.toFixed(2);
  sim.quantum.computeDiagnostics();
  updateTelemetryDOM();
});

elSldNonlin.addEventListener('input', () => {
  sim.quantum.nonlinearity = parseFloat(elSldNonlin.value);
  elValNonlin.textContent = sim.quantum.nonlinearity.toFixed(1);
  sim.quantum.computeDiagnostics();
  updateTelemetryDOM();
});

elSldDelta.addEventListener('input', () => {
  sim.bulk.delta = parseFloat(elSldDelta.value);
  sim.syncBulkAndMetrics();
  elValDelta.textContent = sim.bulk.delta.toFixed(2);
  const m2 = sim.bulk.massSquared();
  const bf = sim.bulk.bfBound();
  elValMass.textContent = m2 < 0 ? `m²=${m2.toFixed(2)} (BF>${bf.toFixed(2)})` : `m²=+${m2.toFixed(2)}`;
  updateTelemetryDOM();
});

elSldGravity.addEventListener('input', () => {
  sim.newtonG = parseFloat(elSldGravity.value);
  if (sim.newtonG > 0.01 && !sim.gravityEnabled) {
    sim.gravityEnabled = true;
    elChkGravity.checked = true;
  }
  sim.backreactionStrength = Math.min(1.5, sim.newtonG * 0.65);
  elValGravity.textContent = sim.newtonG.toFixed(2);
  updateTelemetryDOM();
});

elSldFlux.addEventListener('input', () => {
  sim.bulk.horizonFlux = parseFloat(elSldFlux.value);
  sim.syncBulkAndMetrics();
  elValFlux.textContent = `${sim.bulk.horizonFlux.toFixed(2)} rad`;
  updateTelemetryDOM();
});

elSldRT.addEventListener('input', () => {
  sim.setRTRegionFraction(parseFloat(elSldRT.value));
  elValRT.textContent = `${Math.round(sim.rtFraction * 100)}%`;
  updateTelemetryDOM();
});

// ---- 3D Raycast Hover & Click Interactions ----
renderer.onHoverChange = (hit) => {
  if (hit.node >= 0) {
    const u = hit.node;
    const bulk = sim.bulk;
    const amp = Math.hypot(bulk.phiRe[u], bulk.phiIm[u]);
    const depth = bulk.nodeDepth[u];
    const pe = bulk.parentEdge[u];
    const extra = bulk.isLeaf[u]
      ? `x = ${sim.space.formatPadic(sim.space.leafToPadic(hit.leaf))}`
      : bulk.isHorizon[u]
      ? `BTZ Horizon #${bulk.nodeIndexInLevel[u]}`
      : `Bulk Ball d=${depth} #${bulk.nodeIndexInLevel[u]}`;
    const curvStr = pe >= 0 ? ` · kappa=${bulk.ricciCurvature[pe].toFixed(3)} · a_e=${bulk.edgeLength[pe].toFixed(2)}` : '';
    elHoverReadout.textContent = `${extra} · |phi|=${amp.toFixed(4)}${curvStr}`;
  } else if (hit.edge >= 0) {
    const ei = hit.edge;
    const bulk = sim.bulk;
    const tag = bulk.edges[ei].isHorizon ? 'BTZ Horizon Edge' : `Bulk Edge #${ei}`;
    elHoverReadout.textContent = `${tag} · a_e=${bulk.edgeLength[ei].toFixed(3)} · w_e=${bulk.edgeWeight[ei].toFixed(3)} · kappa=${bulk.ricciCurvature[ei].toFixed(3)}`;
  }
};

renderer.onPickClick = (hit, evt) => {
  if (activeTool === 'wavelet') {
    if (hit.node >= 0) {
      const w = sim.injectAtNode(hit.node, 1 + (evt.altKey ? 1 : 0), evt.shiftKey);
      const pan = (w.ballIndex + 0.5) / Math.max(1, sim.space.powP[w.j]);
      audio.pluck(w.j + 1, pan, 0.95);
      updateTelemetryDOM();
    }
  } else if (activeTool === 'surgery') {
    const targetEdge = hit.edge >= 0 ? hit.edge : hit.node >= 0 ? sim.bulk.parentEdge[hit.node] : -1;
    if (targetEdge >= 0) {
      const tighten = evt.shiftKey || evt.button === 2;
      sim.bulk.pinchEdge(targetEdge, tighten ? -0.95 : 1.15);
      sim.backreactionStrength = Math.max(sim.backreactionStrength, 1.0);
      sim.syncBulkAndMetrics();
      audio.pluck(1, 0.5, 0.65);
      updateTelemetryDOM();
    }
  } else if (activeTool === 'rt') {
    if (hit.leaf >= 0) {
      sim.toggleRTRegionAtLeaf(hit.leaf, 2);
      setShaderView('rt');
      syncUIFromSim();
    } else if (hit.node >= 0 && !sim.bulk.isLeaf[hit.node]) {
      const d = sim.bulk.nodeDepth[hit.node];
      if (d > 0 && d < sim.n) {
        sim.setRTRegionBall(d, sim.bulk.nodeIndexInLevel[hit.node]);
        setShaderView('rt');
        syncUIFromSim();
      }
    }
  } else if (activeTool === 'triangle') {
    let targetLeaf = hit.leaf;
    if (targetLeaf < 0 && hit.node >= 0) {
      // Descend leftmost child to grab a boundary leaf inside clicked subtree
      let cur = hit.node;
      while (!sim.bulk.isLeaf[cur] && sim.bulk.children[cur].length > 0) {
        cur = sim.bulk.children[cur][0];
      }
      if (sim.bulk.isLeaf[cur]) targetLeaf = sim.bulk.nodeIndexInLevel[cur];
    }
    if (targetLeaf >= 0) {
      sim.pushTriangleProbeLeaf(targetLeaf);
      audio.pluck(sim.n, targetLeaf / sim.space.N, 0.55);
    }
  }
};

// ---- Keyboard Shortcuts ----
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target && e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') {
    setHelpModalOpen(false);
  } else if (e.key === '?') {
    setHelpModalOpen(elHelpModal.classList.contains('hidden'));
  } else if (e.code === 'Space') {
    e.preventDefault();
    elBtnPause.click();
  } else if (e.key === 'm' || e.key === 'M') {
    elBtnAudio.click();
  } else if (e.key === 'r' || e.key === 'R') {
    elBtnReset.click();
  } else if (e.key === 'o' || e.key === 'O') {
    elBtnAutoOrbit.click();
  } else if (e.key >= '1' && e.key <= '6') {
    const idx = Number(e.key) - 1;
    if (EXPERIMENTS[idx]) selectExperiment(EXPERIMENTS[idx].id);
  }
});

// ---- Telemetry Readout Update ----
function updateTelemetryDOM() {
  const q = sim.quantum;
  const b = sim.bulk;

  elTelNormDrift.textContent = q.normDriftPadic.toExponential(2);
  elTelBulkRes.textContent = b.maxResidual.toExponential(2);
  elTelRicci.textContent = b.meanCurvature.toFixed(4);
  elTelRT.textContent = `${b.rtEntropy.toFixed(3)} (${b.rtCutCount}e)`;
  elTelEnergy.textContent = q.energyPadic.toFixed(3);
  elTelHorizonJ.textContent = b.isBTZ ? b.horizonFluxCurrent.toFixed(4) : '— (AdS)';

  if (b.isBTZ) {
    if (b.rtTouchesHorizon) {
      elRtPhaseBadge.textContent = `HORIZON (${b.rtHorizonNodesInWedge}/${b.horizonLength})`;
      elRtPhaseBadge.className = 'rt-pill horizon';
    } else {
      elRtPhaseBadge.textContent = 'DETACHED';
      elRtPhaseBadge.className = 'rt-pill';
    }
  } else {
    elRtPhaseBadge.textContent = `${b.rtCutCount} CUTS`;
    elRtPhaseBadge.className = 'rt-pill';
  }
}

// ---- Boot & 60 FPS Simulation Loop ----
if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  renderer.autoRotate = false;
  elBtnAutoOrbit.classList.remove('active');
  elBtnAutoOrbit.setAttribute('aria-pressed', 'false');
}
buildExperimentCards();
hydrateStateFromURL();
syncUIFromSim();

let lastTs = performance.now();
let telemetryFrame = 0;

function tick(now) {
  const dt = Math.max(0, Math.min(0.032, (now - lastTs) * 0.001));
  lastTs = now;

  sim.step(dt);
  renderer.render(sim, now * 0.001);
  panelReality.render(sim);
  panelSpectrum.render(sim);
  panelTriangle.render(sim);

  if ((telemetryFrame++ & 3) === 0) {
    updateTelemetryDOM();
    audio.update(sim);
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

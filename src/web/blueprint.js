/**
 * ULTRAMETRICA v1.7.0 — Interactive Lean 4 Proof Blueprint DAG & Filter Controller.
 * Zero external dependencies, strict CSP compliant (no inline scripts/styles).
 */

const DAG_NODES = [
  { id: 'spec', x: 24, y: 225, w: 168, h: 64, title: 'Spec.lean', sub: 'Pure defs (0 proofs)', kind: 'spec', card: 'mod-targets' },
  { id: 'basic', x: 232, y: 24, w: 205, h: 62, title: 'Basic.lean (26)', sub: 'Ultrametric + Monna', kind: 'core', card: 'mod-basic' },
  { id: 'adelic', x: 486, y: 24, w: 230, h: 62, title: 'AdelicSymmetry (23)', sub: 'Thm I & Prop 4.2', kind: 'core', card: 'mod-adelic' },
  { id: 'btz', x: 232, y: 112, w: 205, h: 62, title: 'HolographyCurv (39)', sub: 'Thm II & V (L_c = 5)', kind: 'core', card: 'mod-btz' },
  { id: 'vglobal', x: 486, y: 112, w: 230, h: 62, title: 'MultiEdgeHolo (33)', sub: 'Thm V-Global & VI', kind: 'core', card: 'mod-vglobal' },
  { id: 'fgraph', x: 486, y: 200, w: 230, h: 62, title: 'FiniteGraphGB (24)', sub: 'Edge-Sum Gauss-Bonnet', kind: 'core', card: 'mod-fgraph' },
  { id: 'soliton', x: 232, y: 200, w: 205, h: 62, title: 'SolitonAndSolver (12)', sub: 'Thm III & IV (Kerr)', kind: 'core', card: 'mod-soliton' },
  { id: 'vlad', x: 232, y: 288, w: 205, h: 62, title: 'VladimirovOp (26)', sub: 'Thm VII D_K + Kozyrev', kind: 'core', card: 'mod-vlad' },
  { id: 'adv', x: 486, y: 288, w: 230, h: 62, title: 'AdversarialTests (7)', sub: 'Sharpness Negations', kind: 'adv', card: 'mod-adv' },
  { id: 'challenge', x: 232, y: 396, w: 205, h: 64, title: 'Challenge.lean (12)', sub: 'Statement-only targets', kind: 'target', card: 'mod-targets' },
  { id: 'solution', x: 800, y: 218, w: 336, h: 82, title: 'Solution.lean + 6 Kernels', sub: '202 audited (127+56+7+12)', kind: 'target', card: 'mod-targets' },
];

const DAG_EDGES = [
  ['spec', 'challenge'],
  ['spec', 'solution'],
  ['basic', 'adelic'],
  ['basic', 'btz'],
  ['basic', 'vlad'],
  ['btz', 'vglobal'],
  ['vglobal', 'fgraph'],
  ['basic', 'adv'],
  ['adelic', 'adv'],
  ['fgraph', 'adv'],
  ['soliton', 'adv'],
  ['vlad', 'adv'],
  ['adelic', 'solution'],
  ['vglobal', 'solution'],
  ['fgraph', 'solution'],
  ['soliton', 'solution'],
  ['vlad', 'solution'],
  ['adv', 'solution'],
  ['challenge', 'solution'],
];

const SVG_NS = 'http://www.w3.org/2000/svg';

function renderDag() {
  const edgeLayer = document.getElementById('dagEdges');
  const nodeLayer = document.getElementById('dagNodes');
  if (!edgeLayer || !nodeLayer) return;

  const byId = new Map(DAG_NODES.map((n) => [n.id, n]));
  const edgeEls = [];

  for (const [fromId, toId] of DAG_EDGES) {
    const a = byId.get(fromId);
    const b = byId.get(toId);
    if (!a || !b) continue;

    const x1 = a.x + a.w;
    const y1 = a.y + a.h * 0.5;
    const x2 = b.x;
    const y2 = b.y + b.h * 0.5;
    const midX = (x1 + x2) * 0.5;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
    path.setAttribute('class', 'dag-edge');
    path.setAttribute('marker-end', 'url(#arrowHead)');
    path.dataset.from = fromId;
    path.dataset.to = toId;
    edgeLayer.appendChild(path);
    edgeEls.push(path);
  }

  const nodeEls = [];
  for (const node of DAG_NODES) {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', `dag-node kind-${node.kind}`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `${node.title}: ${node.sub}`);

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', String(node.x));
    rect.setAttribute('y', String(node.y));
    rect.setAttribute('width', String(node.w));
    rect.setAttribute('height', String(node.h));

    const title = document.createElementNS(SVG_NS, 'text');
    title.setAttribute('x', String(node.x + 12));
    title.setAttribute('y', String(node.y + 27));
    title.setAttribute('class', 'dag-title');
    title.textContent = node.title;

    const sub = document.createElementNS(SVG_NS, 'text');
    sub.setAttribute('x', String(node.x + 12));
    sub.setAttribute('y', String(node.y + 47));
    sub.setAttribute('class', 'dag-sub');
    sub.textContent = node.sub;

    g.appendChild(rect);
    g.appendChild(title);
    g.appendChild(sub);

    const activate = () => {
      for (const el of nodeEls) el.classList.remove('selected');
      g.classList.add('selected');
      for (const e of edgeEls) {
        const hit = e.dataset.from === node.id || e.dataset.to === node.id;
        e.classList.toggle('active-edge', hit);
      }
      const cards = document.querySelectorAll('.bp-card');
      cards.forEach((c) => {
        const match = c.getAttribute('data-node-id') === node.card;
        c.classList.toggle('highlighted', match);
        if (match) {
          c.classList.remove('hidden');
          c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    };

    g.addEventListener('click', activate);
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        activate();
      }
    });

    nodeLayer.appendChild(g);
    nodeEls.push(g);
  }
}

function setupFilters() {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const search = document.getElementById('bpSearch');
  const cards = Array.from(document.querySelectorAll('.bp-card'));

  let activeFilter = 'all';

  const apply = () => {
    const q = (search instanceof HTMLInputElement ? search.value : '').trim().toLowerCase();
    for (const card of cards) {
      const fam = card.getAttribute('data-family') || '';
      const famMatch = activeFilter === 'all' || fam === activeFilter;
      const textMatch = !q || (card.textContent || '').toLowerCase().includes(q);
      card.classList.toggle('hidden', !(famMatch && textMatch));
    }
  };

  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter') || 'all';
      for (const b of buttons) {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      apply();
    });
  }

  if (search) {
    search.addEventListener('input', apply);
  }
}

renderDag();
setupFilters();

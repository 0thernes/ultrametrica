/**
 * ULTRAMETRICA v1.5.0 — Interactive Lean 4 Proof Blueprint DAG & Filter Controller.
 * Zero external dependencies, strict CSP compliant (no inline scripts/styles).
 */

const DAG_NODES = [
  { id: 'spec', x: 30, y: 185, w: 175, h: 66, title: 'Spec.lean', sub: 'Pure defs (0 proofs)', kind: 'spec', card: 'mod-targets' },
  { id: 'basic', x: 255, y: 28, w: 205, h: 66, title: 'Basic.lean (26)', sub: 'Ultrametric + Monna', kind: 'core', card: 'mod-basic' },
  { id: 'adelic', x: 510, y: 28, w: 225, h: 66, title: 'AdelicSymmetry (23)', sub: 'Thm I & Prop 4.2', kind: 'core', card: 'mod-adelic' },
  { id: 'btz', x: 255, y: 132, w: 205, h: 66, title: 'BTZ Ricci + BF', sub: 'Thm II (L_c = 5)', kind: 'core', card: 'mod-btz' },
  { id: 'vglobal', x: 510, y: 132, w: 225, h: 66, title: 'Multi-Edge W1 & SSA', sub: 'Thm V-Global & VI (73)', kind: 'core', card: 'mod-vglobal' },
  { id: 'soliton', x: 255, y: 238, w: 205, h: 66, title: 'SolitonAndSolver (12)', sub: 'Thm III & IV (Kerr)', kind: 'core', card: 'mod-soliton' },
  { id: 'adv', x: 510, y: 238, w: 225, h: 66, title: 'AdversarialTests (5)', sub: 'Sharpness Negations', kind: 'adv', card: 'mod-adv' },
  { id: 'challenge', x: 255, y: 344, w: 205, h: 66, title: 'Challenge.lean (10)', sub: 'Statement-only targets', kind: 'target', card: 'mod-targets' },
  { id: 'solution', x: 810, y: 185, w: 315, h: 78, title: 'Solution.lean + 6 Kernels', sub: '149 decls · lake check + comparator', kind: 'target', card: 'mod-targets' },
];

const DAG_EDGES = [
  ['spec', 'challenge'],
  ['spec', 'solution'],
  ['basic', 'adelic'],
  ['basic', 'btz'],
  ['btz', 'vglobal'],
  ['basic', 'adv'],
  ['adelic', 'adv'],
  ['vglobal', 'adv'],
  ['soliton', 'adv'],
  ['adelic', 'solution'],
  ['vglobal', 'solution'],
  ['soliton', 'solution'],
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
    title.setAttribute('y', String(node.y + 28));
    title.setAttribute('class', 'dag-title');
    title.textContent = node.title;

    const sub = document.createElementNS(SVG_NS, 'text');
    sub.setAttribute('x', String(node.x + 12));
    sub.setAttribute('y', String(node.y + 49));
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

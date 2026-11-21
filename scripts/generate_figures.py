#!/usr/bin/env python3
"""
ULTRAMETRICA — Reproducible Publication-Grade Vector Figure Generator.

Reads exact benchmark data from results/discovery-benchmarks.json and exact rational
laws, emits standalone LaTeX/PGFPlots sources, and compiles crisp cropped vector PDFs
into paper/figures/ via Tectonic (zero Python third-party plotting dependencies).
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIG_DIR = ROOT / "paper" / "figures"
BENCH_PATH = ROOT / "results" / "discovery-benchmarks.json"


def find_tectonic() -> str:
    found = shutil.which("tectonic")
    if found:
        return found
    win_default = Path.home() / ".local" / "bin" / "tectonic.exe"
    if win_default.exists():
        return str(win_default)
    raise FileNotFoundError("tectonic binary not found in PATH or ~/.local/bin/tectonic.exe")


def fig1_btz_curvature_tex() -> str:
    """Figure 1: Exact Tate-Curve BTZ Ollivier-Ricci Curvature Excess kappa_BTZ - kappa_AdS."""
    curves = {}
    for p in (2, 3, 5, 7):
        pts = []
        for L in range(3, 13):
            ex = float(Fraction((p + 1) * max(0, 6 - L) - 4, (p + 1) * (p + 2)))
            pts.append(f"({L}, {ex:.6f})")
        curves[p] = " ".join(pts)

    return r"""\documentclass[border=4pt]{standalone}
\usepackage{lmodern}
\usepackage{amsmath,amssymb}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\begin{document}
\begin{tikzpicture}
\begin{axis}[
  width=12.6cm,
  height=6.2cm,
  xlabel={BTZ horizon circumference $L$},
  ylabel={Curvature excess $\kappa_{\mathrm{BTZ}}(p, L) - \kappa_{\mathrm{AdS}}(p)$},
  xmin=2.7, xmax=12.3,
  ymin=-0.42, ymax=0.52,
  xtick={3,4,5,6,7,8,9,10,11,12},
  grid=major,
  grid style={dashed, gray!28},
  legend pos=north east,
  legend cell align=left,
  legend style={font=\small, fill=white, fill opacity=0.9, draw=gray!50},
  label style={font=\small},
  tick label style={font=\footnotesize},
]
  % Zero excess reference line
  \addplot[black, thick, densely dashed, forget plot] coordinates {(2.7, 0) (12.3, 0)};
  % Critical circumference L_c = 5 band
  \draw[orange!70!black, dotted, thick] (axis cs:5, -0.42) -- (axis cs:5, 0.52);
  \node[anchor=south west, font=\scriptsize, text=orange!75!black] at (axis cs:5.12, 0.36)
    {$L_c = 5$ trichotomy};
  \draw[->, >=stealth, teal!75!black, thick] (axis cs:6.3, 0.14) -- (axis cs:5.08, 0.015);
  \node[anchor=west, font=\scriptsize, text=teal!75!black, fill=white, fill opacity=0.85, text opacity=1, inner sep=1.5pt] at (axis cs:6.32, 0.15)
    {$(p=3, L=5)$: exact $0$};

  \addplot[color=blue!75!black, thick, mark=*, mark size=2.1pt] coordinates { """ + curves[2] + r""" };
  \addlegendentry{$p = 2$}

  \addplot[color=teal!75!black, thick, mark=square*, mark size=2.0pt] coordinates { """ + curves[3] + r""" };
  \addlegendentry{$p = 3$}

  \addplot[color=orange!85!black, thick, mark=triangle*, mark size=2.4pt] coordinates { """ + curves[5] + r""" };
  \addlegendentry{$p = 5$}

  \addplot[color=purple!80!black, thick, mark=diamond*, mark size=2.3pt] coordinates { """ + curves[7] + r""" };
  \addlegendentry{$p = 7$}
\end{axis}
\end{tikzpicture}
\end{document}
"""


def fig2_adelic_spectrum_tex(data: dict) -> str:
    """Figure 2: Adelic Parity-Doubling Dichotomy (Distinct Levels & Mean N*IPR vs theta)."""
    by_p = {e["p"]: e for e in data["experimentA_adelicHybridSpectrum"]}
    dist_coords = {}
    ipr_coords = {}
    for p in (2, 3, 5):
        exp = by_p[p]
        N = exp["N"]
        dist_coords[p] = " ".join(f"({r['theta']:.2f}, {r['distinctLevels']/N:.5f})" for r in exp["sweep"])
        ipr_coords[p] = " ".join(f"({r['theta']:.2f}, {r['normalizedIPR']:.4f})" for r in exp["sweep"])

    return r"""\documentclass[border=4pt]{standalone}
\usepackage{lmodern}
\usepackage{amsmath,amssymb}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\begin{document}
\begin{tikzpicture}
\begin{axis}[
  name=leftplot,
  width=6.6cm,
  height=5.6cm,
  title={\small (a) Distinct Eigenvalue Fraction},
  xlabel={Adelic morph $\theta$ ($\mathbb{R} \leftrightarrow \mathbb{Q}_p$)},
  ylabel={Distinct levels / $N$},
  xmin=-0.03, xmax=1.03,
  ymin=0.0, ymax=1.08,
  xtick={0,0.25,0.5,0.75,1.0},
  ytick={0,0.25,0.5,0.75,1.0},
  grid=major,
  grid style={dashed, gray!28},
  legend pos=south west,
  legend cell align=left,
  legend style={font=\scriptsize, fill=white, fill opacity=0.92, draw=gray!50},
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  \addplot[color=red!75!black, thick, mark=*, mark size=1.9pt] coordinates { """ + dist_coords[2] + r""" };
  \addlegendentry{$p=2$ ($N=64$, lifted)}
  \addplot[color=blue!75!black, thick, mark=square*, mark size=1.9pt] coordinates { """ + dist_coords[3] + r""" };
  \addlegendentry{$p=3$ ($N=81$, doublets)}
  \addplot[color=teal!75!black, thick, mark=triangle*, mark size=2.1pt] coordinates { """ + dist_coords[5] + r""" };
  \addlegendentry{$p=5$ ($N=125$, doublets)}
\end{axis}

\begin{axis}[
  at={(leftplot.east)},
  anchor=west,
  xshift=1.35cm,
  width=6.6cm,
  height=5.6cm,
  title={\small (b) Mean Eigenstate Localization},
  xlabel={Adelic morph $\theta$ ($\mathbb{R} \leftrightarrow \mathbb{Q}_p$)},
  ylabel={Normalized $N \cdot \overline{\mathrm{IPR}}$},
  xmin=-0.03, xmax=1.03,
  ymin=1.0, ymax=5.4,
  xtick={0,0.25,0.5,0.75,1.0},
  grid=major,
  grid style={dashed, gray!28},
  legend pos=north west,
  legend cell align=left,
  legend style={font=\scriptsize, fill=white, fill opacity=0.92, draw=gray!50},
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  \addplot[color=red!75!black, thick, mark=*, mark size=1.9pt] coordinates { """ + ipr_coords[2] + r""" };
  \addlegendentry{$p=2$}
  \addplot[color=blue!75!black, thick, mark=square*, mark size=1.9pt] coordinates { """ + ipr_coords[3] + r""" };
  \addlegendentry{$p=3$}
  \addplot[color=teal!75!black, thick, mark=triangle*, mark size=2.1pt] coordinates { """ + ipr_coords[5] + r""" };
  \addlegendentry{$p=5$}
\end{axis}
\end{tikzpicture}
\end{document}
"""


def fig3_soliton_resonance_tex(data: dict) -> str:
    """Figure 3: Exact Kozyrev Soliton Zero Leakage vs. Multi-Scale Self-Trapping Resonance & R Twin."""
    rows = data["experimentC_kozyrevCompactonSolitons"]
    solo_pts = " ".join(f"({r['g']}, {r['soloLeakage']*100:.6f})" for r in rows)
    multi_pts = " ".join(f"({r['g']}, {r['multiScaleLeakage']*100:.4f})" for r in rows)
    twin_pts = " ".join(f"({r['g']}, {r['archimedeanTwinLeakage']*100:.2f})" for r in rows)

    return r"""\documentclass[border=4pt]{standalone}
\usepackage{lmodern}
\usepackage{amsmath,amssymb}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\begin{document}
\begin{tikzpicture}
\begin{axis}[
  name=leftplot,
  width=6.6cm,
  height=5.5cm,
  title={\small (a) $\mathbb{Q}_3$ Multi-Scale Tunneling Resonance},
  xlabel={Gross--Pitaevskii nonlinearity $g$},
  ylabel={Ball probability leakage (\%)},
  xmin=-20, xmax=520,
  ymin=-0.03, ymax=0.54,
  grid=major,
  grid style={dashed, gray!28},
  legend pos=north east,
  legend cell align=left,
  legend style={font=\scriptsize, fill=white, fill opacity=0.92, draw=gray!50},
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  \addplot[color=orange!85!black, thick, mark=*, mark size=2.0pt] coordinates { """ + multi_pts + r""" };
  \addlegendentry{Overlapping 2-scale packet}
  \addplot[color=teal!75!black, thick, densely dashed, mark=square*, mark size=1.8pt] coordinates { """ + solo_pts + r""" };
  \addlegendentry{Exact Kozyrev soliton ($0.00\%$)}
  \draw[->, >=stealth, orange!80!black, thick] (axis cs:185, 0.36) -- (axis cs:72, 0.37);
  \node[anchor=west, font=\scriptsize, text=orange!80!black] at (axis cs:188, 0.36) {Peak ($g{=}60$)};
  \node[anchor=south east, font=\scriptsize, text=gray!60!black] at (axis cs:505, 0.045) {Self-trapped};
\end{axis}

\begin{axis}[
  at={(leftplot.east)},
  anchor=west,
  xshift=1.35cm,
  width=6.6cm,
  height=5.5cm,
  title={\small (b) Reality Split: $\mathbb{R}$ Twin vs.\ $\mathbb{Q}_3$ Soliton},
  xlabel={Gross--Pitaevskii nonlinearity $g$},
  ylabel={Ball probability leakage (\%)},
  xmin=-20, xmax=520,
  ymin=-4, ymax=100,
  grid=major,
  grid style={dashed, gray!28},
  legend style={at={(0.97,0.48)}, anchor=east, font=\scriptsize, fill=white, fill opacity=0.92, draw=gray!50},
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  \addplot[color=red!75!black, thick, mark=triangle*, mark size=2.2pt] coordinates { """ + twin_pts + r""" };
  \addlegendentry{Euclidean $\mathbb{R}$ twin}
  \addplot[color=teal!75!black, thick, mark=square*, mark size=1.8pt] coordinates { """ + solo_pts + r""" };
  \addlegendentry{$\mathbb{Q}_3$ Kozyrev soliton}
\end{axis}
\end{tikzpicture}
\end{document}
"""


def fig4_intrablock_and_scaling_tex(data: dict) -> str:
    """Figure 4: Experiment E (Intra-Block W_{0,m} Modular Picket-Fence Law) & Experiment F (Alpha Scaling)."""
    exp_e = data["experimentE_intraBlockSpectralStats"]
    by_key = {(c["p"], c["n"], c["m"]): c for c in exp_e["configs"]}

    def pts_e(key):
        return " ".join(f"({r['theta']:.2f}, {r['meanR_block']:.5f})" for r in by_key[key]["sweep"])

    c_p5_m1 = pts_e((5, 4, 1))
    c_p3_m1 = pts_e((3, 5, 1))
    c_p5_m2 = pts_e((5, 4, 2))
    c_p2_m1 = pts_e((2, 8, 1))

    exp_f = data["experimentF_selfTrappingScaling"]
    p3_curves = {}
    for s in exp_f:
        if s["p"] == 3 and s["n"] == 5:
            pts = " ".join(
                f"({r['g']}, {r['leakage']*100:.4f})"
                for r in s["curve"]
                if r["g"] <= 550
            )
            p3_curves[round(s["alpha"], 1)] = pts

    return r"""\documentclass[border=4pt]{standalone}
\usepackage{lmodern}
\usepackage{amsmath,amssymb}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\begin{document}
\begin{tikzpicture}
\begin{axis}[
  name=leftplot,
  width=6.9cm,
  height=5.9cm,
  title={\small (a) Intra-Block $\langle r \rangle_{W_{0,m}}(\theta)$ ($N \le 625$)},
  xlabel={Adelic morph $\theta$ ($\mathbb{R} \leftrightarrow \mathbb{Q}_p$)},
  ylabel={Intra-sector spacing ratio $\langle r \rangle$},
  xmin=0.05, xmax=1.08,
  ymin=-0.04, ymax=0.96,
  xtick={0.1,0.3,0.5,0.7,0.9},
  ytick={0,0.25,0.5,0.6667},
  yticklabels={$0$,$\tfrac{1}{4}$,$\tfrac{1}{2}$,$\tfrac{2}{3}$},
  grid=major,
  grid style={dashed, gray!25},
  legend style={at={(0.50,0.97)}, anchor=north, legend columns=2, column sep=2pt, inner sep=2pt, font=\tiny, fill=white, fill opacity=0.95, draw=gray!50},
  legend cell align=left,
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  % Random-matrix reference lines
  \addplot[gray!65, densely dotted, thick, forget plot] coordinates {(0.05, 0.5996) (1.08, 0.5996)};
  \node[anchor=west, font=\tiny, text=gray!75!black, fill=white, inner sep=0.8pt] at (axis cs:0.935, 0.600) {GUE};
  \addplot[gray!65, densely dotted, thick, forget plot] coordinates {(0.05, 0.5307) (1.08, 0.5307)};
  \node[anchor=west, font=\tiny, text=gray!75!black, fill=white, inner sep=0.8pt] at (axis cs:0.935, 0.531) {GOE};
  \addplot[gray!65, densely dotted, thick, forget plot] coordinates {(0.05, 0.3863) (1.08, 0.3863)};
  \node[anchor=west, font=\tiny, text=gray!75!black, fill=white, inner sep=0.8pt] at (axis cs:0.935, 0.386) {Poiss.};

  \addplot[color=teal!75!black, thick, mark=triangle*, mark size=2.1pt] coordinates { """ + c_p5_m1 + r""" };
  \addlegendentry{$p{=}5,W_{0,1}\,(\tfrac{2}{3})$}
  \addplot[color=blue!75!black, thick, mark=square*, mark size=1.8pt] coordinates { """ + c_p3_m1 + r""" };
  \addlegendentry{$p{=}3,W_{0,1}\,(\tfrac{1}{2})$}
  \addplot[color=orange!85!black, thick, mark=diamond*, mark size=2.2pt] coordinates { """ + c_p5_m2 + r""" };
  \addlegendentry{$p{=}5,W_{0,2}\,(\tfrac{1}{4})$}
  \addplot[color=red!75!black, thick, mark=*, mark size=1.8pt] coordinates { """ + c_p2_m1 + r""" };
  \addlegendentry{$p{=}2,W_{0,1}\,(0)$}
\end{axis}

\begin{axis}[
  at={(leftplot.east)},
  anchor=west,
  xshift=1.35cm,
  width=6.9cm,
  height=5.9cm,
  title={\small (b) Multi-Scale Tunneling vs.\ $\alpha$ ($\mathbb{Q}_3$, $N{=}243$)},
  xlabel={Gross--Pitaevskii nonlinearity $g$},
  ylabel={Ball probability leakage (\%)},
  xmin=-15, xmax=520,
  ymin=-0.05, ymax=1.65,
  grid=major,
  grid style={dashed, gray!25},
  legend pos=north east,
  legend cell align=left,
  legend style={font=\scriptsize, fill=white, fill opacity=0.92, draw=gray!50},
  label style={font=\footnotesize},
  tick label style={font=\scriptsize},
]
  \addplot[color=red!75!black, thick, mark=*, mark size=1.7pt] coordinates { """ + p3_curves[0.6] + r""" };
  \addlegendentry{$\alpha = 0.6$ ($\Delta\lambda{=}1.80$)}
  \addplot[color=orange!85!black, thick, mark=square*, mark size=1.7pt] coordinates { """ + p3_curves[0.8] + r""" };
  \addlegendentry{$\alpha = 0.8$ ($\Delta\lambda{=}3.39$)}
  \addplot[color=teal!75!black, thick, mark=triangle*, mark size=2.0pt] coordinates { """ + p3_curves[1.0] + r""" };
  \addlegendentry{$\alpha = 1.0$ ($\Delta\lambda{=}6.00$)}
  \addplot[color=blue!75!black, thick, mark=diamond*, mark size=2.0pt] coordinates { """ + p3_curves[1.2] + r""" };
  \addlegendentry{$\alpha = 1.2$ ($\Delta\lambda{=}10.23$)}
  \addplot[color=purple!80!black, thick, mark=pentagon*, mark size=1.8pt] coordinates { """ + p3_curves[1.4] + r""" };
  \addlegendentry{$\alpha = 1.4$ ($\Delta\lambda{=}17.02$)}
\end{axis}
\end{tikzpicture}
\end{document}
"""


def main() -> None:
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(BENCH_PATH.read_text(encoding="utf-8"))
    tectonic = find_tectonic()

    sources = {
        "fig1_btz_curvature": fig1_btz_curvature_tex(),
        "fig2_adelic_spectrum": fig2_adelic_spectrum_tex(data),
        "fig3_soliton_resonance": fig3_soliton_resonance_tex(data),
        "fig4_intrablock_and_scaling": fig4_intrablock_and_scaling_tex(data),
    }

    for stem, tex_src in sources.items():
        tex_path = FIG_DIR / f"{stem}.tex"
        tex_path.write_text(tex_src, encoding="utf-8", newline="\n")
        res = subprocess.run(
            [tectonic, "-X", "compile", str(tex_path), "--outdir", str(FIG_DIR)],
            capture_output=True,
            text=True,
            check=False,
        )
        if res.returncode != 0:
            print(res.stdout)
            print(res.stderr, file=sys.stderr)
            raise RuntimeError(f"Tectonic failed compiling {stem}.tex")
        pdf_path = FIG_DIR / f"{stem}.pdf"
        print(f"[OK] Built vector figure {pdf_path.relative_to(ROOT)} ({pdf_path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()

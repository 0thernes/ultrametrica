#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.4.0) — Deterministic `llms-full.txt` Context Pack Builder (`A32`).

Concatenates key repository documentation into a single self-contained offline
context bundle (`llms-full.txt`) for LLM/agent consumption.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SECTIONS = [
    "llms.txt",
    "AGENTS.md",
    "README.md",
    "CLAIMS.md",
    "LIMITATIONS.md",
    "REPLICATION.md",
    "VERIFICATION.md",
    "docs/architecture.md",
    "docs/statement-fidelity.md",
    "docs/MEGA_ATLAS_CROSSCHECK.md",
    "docs/preregistration.md",
    "docs/benchmarks.md",
    "docs/threat-model.md",
    "docs/faq.md",
    "docs/glossary.md",
]


def main() -> None:
    parts = [
        "# ULTRAMETRICA — Complete Offline LLM Context Bundle (`llms-full.txt`)\n",
        "Generated deterministically by `python scripts/build_llms_full.py`.\n",
    ]
    included = 0
    for rel in SECTIONS:
        p = ROOT / rel
        if not p.exists():
            continue
        body = p.read_text(encoding="utf-8").strip()
        parts.append(f"\n---\n\n## FILE: `{rel}`\n\n{body}\n")
        included += 1

    out = ROOT / "llms-full.txt"
    out.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print(f"[OK] Generated llms-full.txt from {included} docs ({out.stat().st_size:,} bytes).")


if __name__ == "__main__":
    main()

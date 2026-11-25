#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.4.0) — Verbatim README `#print axioms` Consistency Guard.

Ensures every `#print axioms` output line embedded inside README.md's
"5-Second Independent Proof Verification" block matches `results/lean4-audit.txt`
character-for-character (Playbook Finding 13).
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    audit = (ROOT / "results" / "lean4-audit.txt").read_text(encoding="utf-8")
    audit_lines = {line.strip() for line in audit.splitlines() if line.strip()}

    # Extract lines in README matching Lean `#print axioms` output format
    axiom_lines = [
        line.strip()
        for line in readme.splitlines()
        if re.match(r"^'[A-Za-z0-9_.]+' (depends on axioms: \[.*\]|does not depend on any axioms)$", line.strip())
    ]

    if len(axiom_lines) < 6:
        print(
            f"[FAIL] Expected >= 6 verbatim `#print axioms` lines in README.md, found {len(axiom_lines)}",
            file=sys.stderr,
        )
        sys.exit(1)

    missing = [line for line in axiom_lines if line not in audit_lines]
    if missing:
        print("[FAIL] README.md `#print axioms` lines do NOT match results/lean4-audit.txt:", file=sys.stderr)
        for line in missing:
            print(f"  MISMATCH: {line}", file=sys.stderr)
        sys.exit(1)

    print(f"[PASS] Verbatim README `#print axioms` check: {len(axiom_lines)}/{len(axiom_lines)} lines match results/lean4-audit.txt identically.")


if __name__ == "__main__":
    main()

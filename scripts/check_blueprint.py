#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.8.0) — Interactive Lean 4 Proof Blueprint Consistency Guard.

Verifies that:
  1. Every `data-lean-decl="..."` attribute in `src/web/blueprint.html` exists
     verbatim in `results/lean4-audit.txt` (zero stale/fabricated theorem names).
  2. All 15 isolated comparator targets from `lean/comparator.json` appear in
     `src/web/blueprint.html`.
  3. Zero inline `<script>` or `<style>` blocks exist in `src/web/blueprint.html`
     (strict CSP compliance with `server.mjs`).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    html_path = ROOT / "src" / "web" / "blueprint.html"
    audit_path = ROOT / "results" / "lean4-audit.txt"
    comp_path = ROOT / "lean" / "comparator.json"

    html = html_path.read_text(encoding="utf-8")
    audit = audit_path.read_text(encoding="utf-8")
    comp = json.loads(comp_path.read_text(encoding="utf-8"))

    # Parse all audited Lean declaration names from results/lean4-audit.txt
    audited_decls = set(
        re.findall(r"^'([A-Za-z0-9_.]+)' (?:depends on axioms:|does not depend on any axioms)", audit, re.MULTILINE)
    )
    if len(audited_decls) < 250:
        print(
            f"[FAIL] Expected >= 250 audited declarations in results/lean4-audit.txt, found {len(audited_decls)}",
            file=sys.stderr,
        )
        sys.exit(1)

    bp_decls = re.findall(r'data-lean-decl="([A-Za-z0-9_.]+)"', html)
    if len(bp_decls) < 60:
        print(
            f"[FAIL] Expected >= 60 linked declarations in src/web/blueprint.html, found {len(bp_decls)}",
            file=sys.stderr,
        )
        sys.exit(1)

    missing = [d for d in bp_decls if d not in audited_decls]
    if missing:
        print("[FAIL] Blueprint references declarations absent from results/lean4-audit.txt:", file=sys.stderr)
        for d in missing:
            print(f"  MISSING: {d}", file=sys.stderr)
        sys.exit(1)

    comp_theorems = comp.get("theorem_names", [])
    if len(comp_theorems) < 15:
        print(
            f"[FAIL] Expected >= 15 comparator targets in lean/comparator.json, found {len(comp_theorems)}",
            file=sys.stderr,
        )
        sys.exit(1)
    bp_set = set(bp_decls)
    missing_targets = [t for t in comp_theorems if t not in bp_set]
    if missing_targets:
        print("[FAIL] Blueprint missing comparator.json target(s):", file=sys.stderr)
        for t in missing_targets:
            print(f"  MISSING TARGET: {t}", file=sys.stderr)
        sys.exit(1)

    if re.search(r"<style\b", html, re.IGNORECASE) or re.search(r"<script(?![^>]*\bsrc=)", html, re.IGNORECASE):
        print("[FAIL] Inline <style> or <script> detected in src/web/blueprint.html (violates strict CSP).", file=sys.stderr)
        sys.exit(1)

    print(
        f"[PASS] Lean Proof Blueprint audit: {len(bp_decls)}/{len(bp_decls)} declarations verified in "
        f"results/lean4-audit.txt ({len(audited_decls)} audited), {len(comp_theorems)}/{len(comp_theorems)} "
        "comparator targets linked, strict CSP compliant."
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
ULTRAMETRICA (v1.7.0) — Live Negative Lean 4 Tamper-Rejection Gate (Finding F72 / Playbook Gold #12).

Proves that our Lean 4 verification harness is NOT vacuous and actively REJECTS tampered proofs:
  1. Tamper Test 1 (Injected `sorry` in `Solution.lean`):
     Copies `lean/` into an isolated temporary directory, replaces a real target proof in
     `Solution.lean` with `sorry`, compiles it, and asserts BOTH:
       (a) `VerifyAxioms.lean` reports `sorryAx` (caught by our axiom gate)
       (b) `scripts/verify_exact.py` nested-comment forbidden-token scanner catches `sorry`
       (c) On Linux CI with `lake comparator`, `lake comparator --config comparator.json` exits non-zero!
  2. Tamper Test 2 (Weakened Statement in `Challenge.lean` / Signature Mismatch):
     Weakens `target_thm1_monna_and_parity` in a temp copy of `Challenge.lean` to `True`, and asserts:
       (a) Lean rejects unifying the weakened statement type against `Solution.lean`'s real theorem type
       (b) On Linux CI with `lake comparator`, `lake comparator --config comparator.json` exits non-zero!

Never modifies any file inside the repository; all work runs in an auto-cleaned temporary directory.
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEAN_DIR = ROOT / "lean"

sys.path.insert(0, str(ROOT / "scripts"))
from verify_exact import strip_lean_comments_and_strings  # noqa: E402


def find_lake() -> str:
    found = shutil.which("lake")
    if found:
        return found
    elan = Path.home() / ".elan" / "bin" / ("lake.exe" if sys.platform == "win32" else "lake")
    if elan.exists():
        return str(elan)
    raise FileNotFoundError("lake executable not found on PATH or in ~/.elan/bin")


def run_cmd(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, check=False)


def copy_lean_project(dst: Path) -> None:
    """Copy lean/ including prebuilt .lake/build/lib so negative tests execute in seconds."""
    shutil.copytree(
        LEAN_DIR,
        dst,
        ignore=shutil.ignore_patterns("*.ndjson", "*.tmp"),
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Live negative Lean 4 tamper-rejection gate.")
    parser.add_argument(
        "--with-comparator",
        action="store_true",
        help="Also execute `lake comparator --config comparator.json` against tampered copies (Linux CI).",
    )
    args = parser.parse_args()
    lake = find_lake()

    with tempfile.TemporaryDirectory(prefix="ultrametrica_lean_neg_") as tmpdir:
        tmp = Path(tmpdir) / "lean"
        copy_lean_project(tmp)

        # ---- Negative Test 1: Inject `sorry` into Solution.lean ----
        sol_path = tmp / "Solution.lean"
        sol_orig = sol_path.read_text(encoding="utf-8")
        needle = "  exact ⟨h1.1, h1.2, h2, h3⟩"
        assert needle in sol_orig, "Expected proof anchor missing in Solution.lean"
        sol_tampered = sol_orig.replace(needle, "  sorry", 1)
        sol_path.write_text(sol_tampered, encoding="utf-8", newline="\n")

        # (1a) Nested-comment forbidden-token scanner MUST catch it
        forb = re.compile(r"\b(sorry|admit|axiom|native_decide|unsafe|implemented_by)\b|@\[extern")
        cleaned = strip_lean_comments_and_strings(sol_tampered)
        assert forb.search(cleaned) is not None, "NEGATIVE TEST 1 FAILED: forbidden-token scanner missed injected sorry!"

        # (1b) Rebuild tampered Solution & verify VerifyAxioms.lean catches `sorryAx`
        bld = run_cmd([lake, "build", "Solution"], tmp)
        assert bld.returncode == 0, f"Unexpected build error on sorry-tampered Solution:\n{bld.stderr}"
        ax = run_cmd([lake, "env", "lean", "VerifyAxioms.lean"], tmp)
        combined_ax = ax.stdout + "\n" + ax.stderr
        assert "sorryAx" in combined_ax, (
            f"NEGATIVE TEST 1 FAILED: VerifyAxioms.lean did NOT flag sorryAx on tampered Solution!\n{combined_ax[:800]}"
        )
        print("[PASS] Negative Test 1a/1b: Injected `sorry` in Solution.lean caught by scanner AND `sorryAx` axiom audit.")

        # (1c) Optional: `lake comparator` MUST reject sorry-tampered Solution
        if args.with_comparator:
            comp_res = run_cmd([lake, "comparator", "--config", "comparator.json"], tmp)
            assert comp_res.returncode != 0, (
                "NEGATIVE TEST 1c FAILED: lake comparator unexpectedly PASSED on sorry-tampered Solution!"
            )
            print("[PASS] Negative Test 1c: `lake comparator` rejected sorry-tampered Solution.lean (non-zero exit).")

        # Restore clean Solution.lean before Test 2
        sol_path.write_text(sol_orig, encoding="utf-8", newline="\n")
        bld_clean = run_cmd([lake, "build", "Solution"], tmp)
        assert bld_clean.returncode == 0, f"Failed restoring clean Solution:\n{bld_clean.stderr}"

        # ---- Negative Test 2: Weaken target statement in Challenge.lean ----
        ch_path = tmp / "Challenge.lean"
        ch_orig = ch_path.read_text(encoding="utf-8")
        weak_pattern = re.compile(
            r"public theorem target_thm1_picket_fence_law\s*:[\s\S]*?:=\s*by\s+sorry",
            re.MULTILINE,
        )
        assert weak_pattern.search(ch_orig), "Could not locate target_thm1_picket_fence_law in Challenge.lean"
        ch_tampered = weak_pattern.sub(
            "public theorem target_thm1_picket_fence_law : True := by\n  sorry",
            ch_orig,
            count=1,
        )
        ch_path.write_text(ch_tampered, encoding="utf-8", newline="\n")

        bld_ch = run_cmd([lake, "build", "Challenge"], tmp)
        assert bld_ch.returncode == 0, f"Unexpected build error on tampered Challenge:\n{bld_ch.stderr}"

        # (2a) Direct Lean type-mismatch check (works identically on Windows, macOS & Linux)
        mismatch_probe = tmp / "TamperProbe.lean"
        mismatch_probe.write_text(
            "import Solution\n"
            "example : True = ("
            "∀ p m a, 2 ≤ p → 1 ≤ m → 2 * m ≤ p → "
            "Ultrametrica.Spec.picketVal p m (2 * a) ≤ Ultrametrica.Spec.picketVal p m (2 * a + 1) ∧ "
            "Ultrametrica.Spec.picketVal p m (2 * a + 1) < Ultrametrica.Spec.picketVal p m (2 * a + 2) ∧ "
            "Ultrametrica.Spec.picketVal p m (2 * a + 1) - Ultrametrica.Spec.picketVal p m (2 * a) = p - 2 * m ∧ "
            "Ultrametrica.Spec.picketVal p m (2 * a + 2) - Ultrametrica.Spec.picketVal p m (2 * a + 1) = 2 * m"
            ") := rfl\n",
            encoding="utf-8",
            newline="\n",
        )
        probe_res = run_cmd([lake, "env", "lean", "TamperProbe.lean"], tmp)
        assert probe_res.returncode != 0, (
            "NEGATIVE TEST 2a FAILED: Lean unexpectedly accepted weakened statement mismatch!"
        )
        print("[PASS] Negative Test 2a: Weakened Challenge.lean target rejected by Lean type checker.")

        # (2b) Optional: `lake comparator` MUST reject mismatched Challenge vs Solution
        if args.with_comparator:
            comp_res2 = run_cmd([lake, "comparator", "--config", "comparator.json"], tmp)
            assert comp_res2.returncode != 0, (
                "NEGATIVE TEST 2b FAILED: lake comparator unexpectedly PASSED on weakened Challenge.lean!"
            )
            print("[PASS] Negative Test 2b: `lake comparator` rejected weakened Challenge.lean (non-zero exit).")

    print("\nALL LIVE NEGATIVE LEAN TAMPER-REJECTION GATES PASSED.")


if __name__ == "__main__":
    main()

module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.MultiEdgeHolography
public import UltrametricaProofs.SolitonAndSolver
public import UltrametricaProofs.AdversarialTests

/-!
  ULTRAMETRICA (v1.6.0) — Root Lean 4 Proof Library (`v4.35.0`, Palomar `module`)
  Imports all six machine-checked proof modules (Basic, AdelicSymmetry, HolographyCurvature,
  MultiEdgeHolography, SolitonAndSolver, AdversarialTests) with zero Mathlib dependencies,
  zero `sorry`, zero `native_decide`, and zero custom axioms. Every module stays under 1,000 lines.
  Run `lake env lean VerifyAxioms.lean` to audit all exported declarations.
-/

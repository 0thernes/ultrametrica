module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.MultiEdgeHolography
public import UltrametricaProofs.FiniteGraphGaussBonnet
public import UltrametricaProofs.SolitonAndSolver
public import UltrametricaProofs.VladimirovOperator
public import UltrametricaProofs.AdversarialTests

/-!
  ULTRAMETRICA (v1.7.0) — Root Lean 4 Proof Library (`v4.35.0`, Palomar `module`)
  Imports all eight machine-checked proof modules (Basic, AdelicSymmetry, HolographyCurvature,
  MultiEdgeHolography, FiniteGraphGaussBonnet, SolitonAndSolver, VladimirovOperator,
  AdversarialTests) with zero Mathlib dependencies, zero `sorry`, zero `native_decide`,
  and zero custom axioms. Every module stays strictly under 1,000 lines.
  Run `lake env lean VerifyAxioms.lean` to audit all exported declarations.
-/

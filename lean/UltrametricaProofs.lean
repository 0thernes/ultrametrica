module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.OperatorAndSpectrum
public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.FullGraphBTZ
public import UltrametricaProofs.MultiEdgeHolography
public import UltrametricaProofs.FiniteGraphGaussBonnet
public import UltrametricaProofs.SolitonAndSolver
public import UltrametricaProofs.BulkOperatorPositivity
public import UltrametricaProofs.VladimirovOperator
public import UltrametricaProofs.AdversarialTests

/-!
  ULTRAMETRICA (v1.8.0) — Root Lean 4 Proof Library (`v4.35.0`, Palomar `module`)
  Imports all eleven machine-checked proof modules (Basic, AdelicSymmetry, OperatorAndSpectrum,
  HolographyCurvature, FullGraphBTZ, MultiEdgeHolography, FiniteGraphGaussBonnet,
  SolitonAndSolver, BulkOperatorPositivity, VladimirovOperator, AdversarialTests) with zero
  Mathlib dependencies, zero `sorry`, zero `native_decide`, and zero custom axioms.
  Every `.lean` file stays strictly under 1,000 lines.
  Run `lake env lean VerifyAxioms.lean` to audit 100% of exported public declarations.
-/

/-
  ULTRAMETRICA — Root Lean 4 Proof Verification Module (v4.35.0)
  Imports all 4 proof libraries and prints kernel axiom audits for every flagship theorem.
-/

import UltrametricaProofs.Basic
import UltrametricaProofs.AdelicSymmetry
import UltrametricaProofs.HolographyCurvature
import UltrametricaProofs.SolitonAndSolver

-- Kernel Axiom Audit (verifies ZERO sorryAx and ZERO custom axioms)
#print axioms Ultrametrica.ultrametric_isosceles_lt
#print axioms Ultrametrica.ultrametric_two_longest_equal
#print axioms Ultrametrica.pow_dvd_add
#print axioms Ultrametrica.not_pow_dvd_add_of_dvd_left
#print axioms Ultrametrica.monna_involution_p3_n4
#print axioms Ultrametrica.complement_commutes_monna_p3_n4
#print axioms Ultrametrica.hilbert_sector_completeness
#print axioms Ultrametrica.conjugate_sector_factor
#print axioms Ultrametrica.conjugate_residue_mod_p
#print axioms Ultrametrica.odd_prime_conjugate_sector_disjoint
#print axioms Ultrametrica.even_prime_self_conjugate
#print axioms Ultrametrica.odd_prime_doublet_bound
#print axioms Ultrametrica.btz_curvature_excess_identity
#print axioms Ultrametrica.btz_flatter_than_ads_L3_L4
#print axioms Ultrametrica.btz_flatter_L5_for_p_ge_4
#print axioms Ultrametrica.btz_more_negative_for_L_ge_6
#print axioms Ultrametrica.gubser_bf_bound_exact_square
#print axioms Ultrametrica.gubser_bf_excess_nonneg
#print axioms Ultrametrica.kozyrev_exact_nonlinear_soliton
#print axioms Ultrametrica.disjoint_multi_soliton_no_crosstalk
#print axioms Ultrametrica.horizon_edge_laplacian_psd
#print axioms Ultrametrica.horizon_edge_quadratic_expansion
#print axioms Ultrametrica.sherman_morrison_denominator_ge_one
#print axioms Ultrametrica.sherman_morrison_denominator_ne_zero

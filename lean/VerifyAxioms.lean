/-
  ULTRAMETRICA — Standalone Kernel Axiom Audit (v4.35.0)
  Audits all 36 exported theorems across the four proof libraries via `#print axioms`.
  Every theorem must depend strictly on a subset of [propext, Classical.choice, Quot.sound]
  (or no axioms at all) with zero `sorryAx` and zero custom axioms.
-/

import UltrametricaProofs

-- Module 1: Basic Ultrametric Geometry & Monna Involution (12 theorems)
#print axioms Ultrametrica.ultrametric_isosceles_lt
#print axioms Ultrametrica.ultrametric_two_longest_equal
#print axioms Ultrametrica.pow_dvd_add
#print axioms Ultrametrica.not_pow_dvd_add_of_dvd_left
#print axioms Ultrametrica.monna_involution_p2_n6
#print axioms Ultrametrica.monna_involution_p3_n4
#print axioms Ultrametrica.monna_involution_p5_n3
#print axioms Ultrametrica.monna_involution_p7_n2
#print axioms Ultrametrica.complement_commutes_monna_p2_n6
#print axioms Ultrametrica.complement_commutes_monna_p3_n4
#print axioms Ultrametrica.complement_commutes_monna_p5_n3
#print axioms Ultrametrica.complement_commutes_monna_p7_n2

-- Module 2: Adelic Parity-Doubling Dichotomy & Sector Completeness (6 theorems)
#print axioms Ultrametrica.hilbert_sector_completeness
#print axioms Ultrametrica.conjugate_sector_factor
#print axioms Ultrametrica.conjugate_residue_mod_p
#print axioms Ultrametrica.odd_prime_conjugate_sector_disjoint
#print axioms Ultrametrica.even_prime_self_conjugate
#print axioms Ultrametrica.odd_prime_doublet_bound

-- Module 3: Holographic BTZ Ollivier-Ricci Curvature, Gubser BF Bound & RT Bounds (12 theorems)
#print axioms Ultrametrica.btz_curvature_excess_identity
#print axioms Ultrametrica.btz_flatter_than_ads_L3_L4
#print axioms Ultrametrica.btz_critical_L5_p2
#print axioms Ultrametrica.btz_critical_L5_p3
#print axioms Ultrametrica.btz_critical_L5_p5
#print axioms Ultrametrica.btz_flatter_L5_for_p_ge_4
#print axioms Ultrametrica.btz_more_negative_for_L_ge_6
#print axioms Ultrametrica.gubser_massless_marginal
#print axioms Ultrametrica.gubser_bf_bound_exact_square
#print axioms Ultrametrica.gubser_bf_excess_nonneg
#print axioms Ultrametrica.rt_odd_prime_horizon_dominance
#print axioms Ultrametrica.rt_dyadic_criticality

-- Module 4: Kozyrev Compacton-Solitons & Kerr-BTZ Rank-1 Solver Stability (6 theorems)
#print axioms Ultrametrica.kozyrev_exact_nonlinear_soliton
#print axioms Ultrametrica.disjoint_multi_soliton_no_crosstalk
#print axioms Ultrametrica.horizon_edge_laplacian_psd
#print axioms Ultrametrica.horizon_edge_quadratic_expansion
#print axioms Ultrametrica.sherman_morrison_denominator_ge_one
#print axioms Ultrametrica.sherman_morrison_denominator_ne_zero

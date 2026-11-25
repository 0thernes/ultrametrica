/-
  ULTRAMETRICA — Standalone Kernel Axiom Audit (v4.35.0, release v1.3.0)
  Audits all 101 exported theorems across the four proof libraries via `#print axioms`.
  Every theorem must depend strictly on a subset of [propext, Classical.choice, Quot.sound]
  (or no axioms at all) with zero `sorryAx`, zero `native_decide`, and zero custom axioms.
-/

import UltrametricaProofs

-- Module 1: Basic Ultrametric Geometry, Universal Monna Involution, Ball Contiguity & Concrete Tree Metric (26 theorems)
#print axioms Ultrametrica.ultrametric_isosceles_lt
#print axioms Ultrametrica.ultrametric_two_longest_equal
#print axioms Ultrametrica.pow_dvd_add
#print axioms Ultrametrica.not_pow_dvd_add_of_dvd_left
#print axioms Ultrametrica.revBaseAux_eq
#print axioms Ultrametrica.revBase_succ
#print axioms Ultrametrica.revBase_lt
#print axioms Ultrametrica.revBase_succ_high
#print axioms Ultrametrica.monna_involution_universal
#print axioms Ultrametrica.complement_commutes_monna_universal
#print axioms Ultrametrica.revBase_div_eq_revBase_mod
#print axioms Ultrametrica.padic_ball_monna_contiguity
#print axioms Ultrametrica.monna_involution_p2_n6
#print axioms Ultrametrica.monna_involution_p3_n4
#print axioms Ultrametrica.monna_involution_p5_n3
#print axioms Ultrametrica.monna_involution_p7_n2
#print axioms Ultrametrica.complement_commutes_monna_p2_n6
#print axioms Ultrametrica.complement_commutes_monna_p3_n4
#print axioms Ultrametrica.complement_commutes_monna_p5_n3
#print axioms Ultrametrica.complement_commutes_monna_p7_n2
#print axioms Ultrametrica.padic_ball_cardinality
#print axioms Ultrametrica.monna_injective
#print axioms Ultrametrica.monna_surjective
#print axioms Ultrametrica.treeHopDist_symm
#print axioms Ultrametrica.treeHopDist_strong_tri
#print axioms Ultrametrica.bruhatTits_leaves_isosceles

-- Module 2: Adelic Parity-Doubling Dichotomy, Subtree Isometry, Fourier Separation & Picket-Fence Law (23 theorems)
#print axioms Ultrametrica.hilbert_sector_completeness
#print axioms Ultrametrica.subtreeShift_preserves_ball
#print axioms Ultrametrica.subtreeShift_preserves_offset
#print axioms Ultrametrica.subtreeShift_child_digit
#print axioms Ultrametrica.subtreeShift_preserves_child_ancestor
#print axioms Ultrametrica.subtreeShift_preserves_ultrametric_prefix
#print axioms Ultrametrica.fourier_ball_periodicity
#print axioms Ultrametrica.fourier_shift_phase_congruence
#print axioms Ultrametrica.fourier_sector_nonconstant_phase
#print axioms Ultrametrica.conjugate_sector_factor
#print axioms Ultrametrica.conjugate_residue_mod_p
#print axioms Ultrametrica.odd_prime_conjugate_sector_disjoint
#print axioms Ultrametrica.even_prime_self_conjugate
#print axioms Ultrametrica.odd_pow_is_odd
#print axioms Ultrametrica.odd_prime_doublet_bound
#print axioms Ultrametrica.picket_fence_even_val
#print axioms Ultrametrica.picket_fence_odd_val
#print axioms Ultrametrica.picket_fence_monotone
#print axioms Ultrametrica.picket_fence_even_gap
#print axioms Ultrametrica.picket_fence_odd_gap
#print axioms Ultrametrica.picket_fence_gap_sum
#print axioms Ultrametrica.picket_fence_odd_prime_strictly_positive
#print axioms Ultrametrica.picket_fence_dyadic_zero_gap

-- Module 3: First-Principles Optimal-Transport Curvature, Cycle Bridge, BF Bound, RT & Theorem V Gauss-Bonnet (40 theorems)
#print axioms Ultrametrica.ads_dual_1lipschitz
#print axioms Ultrametrica.ads_wasserstein_lower_bound
#print axioms Ultrametrica.ads_primal_cost_exact
#print axioms Ultrametrica.ads_kappa_from_wasserstein
#print axioms Ultrametrica.btz_graph_metric_eq_classDist
#print axioms Ultrametrica.btz_dual_1lipschitz
#print axioms Ultrametrica.btz_wasserstein_lower_bound
#print axioms Ultrametrica.btz_primal_feasible
#print axioms Ultrametrica.btz_primal_cost_exact
#print axioms Ultrametrica.btz_kappa_from_wasserstein
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
#print axioms Ultrametrica.rt_uniform_odd_prime_all_arcs
#print axioms Ultrametrica.rt_uniform_dyadic_two_arcs
#print axioms Ultrametrica.rt_cut_complement_symmetry
#print axioms Ultrametrica.btz_curvature_monotone_in_L
#print axioms Ultrametrica.gubser_shadow_duality
#print axioms Ultrametrica.geomSum_pos
#print axioms Ultrametrica.ads_vertex_count_identity
#print axioms Ultrametrica.ads_euler_characteristic_one
#print axioms Ultrametrica.btz_euler_characteristic_zero
#print axioms Ultrametrica.curved_sub_dual_1lipschitz
#print axioms Ultrametrica.curved_sub_wasserstein_lower_bound
#print axioms Ultrametrica.curved_sub_primal_cost_exact
#print axioms Ultrametrica.curved_sup_dual_1lipschitz
#print axioms Ultrametrica.curved_sup_wasserstein_lower_bound
#print axioms Ultrametrica.curved_sup_primal_cost_exact
#print axioms Ultrametrica.curved_ads_gauss_bonnet_subcritical
#print axioms Ultrametrica.curved_ads_supercritical_pinch_deficit
#print axioms Ultrametrica.curved_ads_supercritical_strictly_negative
#print axioms Ultrametrica.RatQ.eqv_refl
#print axioms Ultrametrica.RatQ.eqv_symm
#print axioms Ultrametrica.RatQ.eqv_trans
#print axioms Ultrametrica.RatQ.add_congr
#print axioms Ultrametrica.RatQ.add_zero_right
#print axioms Ultrametrica.RatQ.add_same_den
#print axioms Ultrametrica.sumInt_map_mul
#print axioms Ultrametrica.ratq_sumList_same_den
#print axioms Ultrametrica.vertex_half_charge_conserved
#print axioms Ultrametrica.curved_gen_kappa_charge_decomp
#print axioms Ultrametrica.global_multi_edge_vertex_charge_conservation
#print axioms Ultrametrica.global_multi_edge_nonvacuous_witness
#print axioms Ultrametrica.rt_edge_cut_submodular
#print axioms Ultrametrica.rt_cut_submodular
#print axioms Ultrametrica.rt_union_homologous
#print axioms Ultrametrica.rt_inter_homologous_disjoint
#print axioms Ultrametrica.rt_strong_subadditivity
#print axioms Ultrametrica.rt_subadditivity
#print axioms Ultrametrica.rt_ssa_nonvacuous_witness

-- Module 4: Multi-Ball Solitons, Exact Complex Sherman-Morrison & Kerr Parity Laws (12 theorems)
#print axioms Ultrametrica.kozyrev_exact_nonlinear_soliton
#print axioms Ultrametrica.disjoint_multi_soliton_no_crosstalk
#print axioms Ultrametrica.multi_ball_kozyrev_soliton_list
#print axioms Ultrametrica.horizon_edge_laplacian_psd
#print axioms Ultrametrica.horizon_edge_quadratic_expansion
#print axioms Ultrametrica.sherman_morrison_denominator_ge_one
#print axioms Ultrametrica.sherman_morrison_denominator_ne_zero
#print axioms Ultrametrica.hermitianDot_sub
#print axioms Ultrametrica.hermitianDot_smul
#print axioms Ultrametrica.sherman_morrison_exact_identity
#print axioms Ultrametrica.kerr_flux_edge_stress_even
#print axioms Ultrametrica.kerr_flux_edge_current_odd

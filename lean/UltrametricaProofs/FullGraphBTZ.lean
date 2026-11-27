module

public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.MultiEdgeHolography

/-!
  ULTRAMETRICA (v1.8.0) — Lean 4 Formal Proofs (Module 3D: Full-Graph (p+2) x (p+2)
  BTZ Horizon Optimal-Transport Symmetry Reduction — closes F88 / R84 Limit #3)

  Closes the symmetry-reduction boundary noted in v1.7.0 (`HolographyCurvature.lean` proved
  primal-dual optimality for the reduced 3-class model with marginals `(M, M, p*M)`).
  Here we define the literal `(p + 2)`-element neighbor set `BTZNbr p` (`opp`, `back`, and
  `p` distinct hanging subtree children `child r` for `r : Fin p`) of a uniform BTZ horizon
  edge `e = (h_0, h_1)`, define the full `(p + 2) x (p + 2)` unicyclic shortest-path metric
  `fullBtzDist p L x y = btzGraphDist L x.cls y.cls`, and prove directly in zero-Mathlib Lean 4:
    1. Aggregating ANY arbitrary non-negative `(p + 2) x (p + 2)` full-graph transport plan `Q`
       with uniform marginals `M` into its 3-class projection `aggBTZPlan p Q` preserves
       non-negativity, yields exact marginals `(M, M, p*M)`, and preserves total transport cost
       IDENTICALLY (`fullBtz_cost_eq_agg`).
    2. Consequently, the exact Kantorovich lower bound `M * (3p + 2 - max(0, 6 - L))` holds
       over ALL arbitrary `(p + 2) x (p + 2)` full-graph couplings `Q` (`fullBtz_wasserstein_lower_bound`).
    3. Conversely, uniform disaggregation across the `p` children (scaled by `p`) produces an
       EXPLICIT non-negative `(p + 2) x (p + 2)` full-graph coupling `fullBtzOptimalPlan p M`
       satisfying all `(p + 2)` row marginals `= p * M`, all `(p + 2)` column marginals `= p * M`,
       and exact transport cost equality `fullBtzTransportCost p L (fullBtzOptimalPlan p M) =
       (p * M) * (3p + 2 - max(0, 6 - L))` (`fullBtz_primal_optimal_exists`).

  Palomar-compliant Lean 4.35.0 `module` (< 350 lines), zero Mathlib, zero `native_decide`,
  zero `sorry`, zero custom axioms.
-/

@[expose] public section

namespace Ultrametrica

/-- Literal `(p + 2)`-element neighbor set of a uniform BTZ horizon vertex on `T_p / p^{hZ}`:
    - `opp`: opposite endpoint of the horizon edge (1 neighbor)
    - `back`: other horizon ring neighbor (1 neighbor)
    - `child r`: the `p` distinct hanging Bruhat-Tits subtree children (`r : Fin p`). -/
inductive BTZNbr (p : Nat)
  | opp
  | back
  | child (r : Fin p)
deriving DecidableEq, Repr

/-- Class projection mapping each of the `p + 2` literal neighbors to its symmetry class. -/
def BTZNbr.cls {p : Nat} : BTZNbr p → BTZNbrClass
  | .opp     => .opp
  | .back    => .back
  | .child _ => .child

/-- Exact sum over all `p + 2` literal neighbors of a BTZ horizon vertex. -/
def sumBTZNbr (p : Nat) (f : BTZNbr p → Int) : Int :=
  f .opp + f .back + finSum p (fun r => f (.child r))

/-- Full `(p + 2) x (p + 2)` unicyclic shortest-path distance between literal neighbors
    `x ∈ N(h_0)` and `y ∈ N(h_1)` on `T_p / p^{hZ}`. -/
def fullBtzDist (p : Nat) (L : Int) (x y : BTZNbr p) : Int :=
  btzGraphDist L x.cls y.cls

/-- Total unnormalized transport cost of an arbitrary `(p + 2) x (p + 2)` full-graph coupling `Q`. -/
def fullBtzTransportCost (p : Nat) (L : Int) (Q : BTZNbr p → BTZNbr p → Int) : Int :=
  sumBTZNbr p (fun x => sumBTZNbr p (fun y => Q x y * fullBtzDist p L x y))

/-- Exact 3-class aggregation of an arbitrary `(p + 2) x (p + 2)` full-graph coupling `Q`. -/
def aggBTZPlan (p : Nat) (Q : BTZNbr p → BTZNbr p → Int) : BTZNbrClass → BTZNbrClass → Int
  | .opp,   .opp   => Q .opp .opp
  | .opp,   .back  => Q .opp .back
  | .opp,   .child => finSum p (fun s => Q .opp (.child s))
  | .back,  .opp   => Q .back .opp
  | .back,  .back  => Q .back .back
  | .back,  .child => finSum p (fun s => Q .back (.child s))
  | .child, .opp   => finSum p (fun r => Q (.child r) .opp)
  | .child, .back  => finSum p (fun r => Q (.child r) .back)
  | .child, .child => finSum p (fun r => finSum p (fun s => Q (.child r) (.child s)))

/-- Theorem II.F1 (Full-Graph Aggregation Feasibility):
    Aggregating ANY non-negative `(p + 2) x (p + 2)` coupling `Q` with uniform row/column
    marginals `M` produces a valid non-negative 3-class coupling `aggBTZPlan p Q` with exact
    marginals `(M, M, p * M)`. -/
theorem fullBtz_agg_feasible (p : Nat) (M : Int) (Q : BTZNbr p → BTZNbr p → Int)
    (hnn : ∀ x y, 0 ≤ Q x y)
    (hrow : ∀ x, sumBTZNbr p (fun y => Q x y) = M)
    (hcol : ∀ y, sumBTZNbr p (fun x => Q x y) = M) :
    (∀ i j, 0 ≤ aggBTZPlan p Q i j) ∧
    (aggBTZPlan p Q .opp .opp + aggBTZPlan p Q .opp .back + aggBTZPlan p Q .opp .child = M) ∧
    (aggBTZPlan p Q .back .opp + aggBTZPlan p Q .back .back + aggBTZPlan p Q .back .child = M) ∧
    (aggBTZPlan p Q .child .opp + aggBTZPlan p Q .child .back + aggBTZPlan p Q .child .child = (p : Int) * M) ∧
    (aggBTZPlan p Q .opp .opp + aggBTZPlan p Q .back .opp + aggBTZPlan p Q .child .opp = M) ∧
    (aggBTZPlan p Q .opp .back + aggBTZPlan p Q .back .back + aggBTZPlan p Q .child .back = M) ∧
    (aggBTZPlan p Q .opp .child + aggBTZPlan p Q .back .child + aggBTZPlan p Q .child .child = (p : Int) * M) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro i j
    cases i <;> cases j <;> simp only [aggBTZPlan]
    · exact hnn .opp .opp
    · exact hnn .opp .back
    · exact finSum_nonneg p _ (fun s => hnn .opp (.child s))
    · exact hnn .back .opp
    · exact hnn .back .back
    · exact finSum_nonneg p _ (fun s => hnn .back (.child s))
    · exact finSum_nonneg p _ (fun r => hnn (.child r) .opp)
    · exact finSum_nonneg p _ (fun r => hnn (.child r) .back)
    · exact finSum_nonneg p _ (fun r => finSum_nonneg p _ (fun s => hnn (.child r) (.child s)))
  · simpa only [aggBTZPlan, sumBTZNbr] using hrow .opp
  · simpa only [aggBTZPlan, sumBTZNbr] using hrow .back
  · simp only [aggBTZPlan]
    have hsum : finSum p (fun r => sumBTZNbr p (fun y => Q (.child r) y)) = (p : Int) * M := by
      have heq : (fun r => sumBTZNbr p (fun y => Q (.child r) y)) = (fun _ => M) := by
        funext r; exact hrow (.child r)
      rw [heq, finSum_const]
    simp only [sumBTZNbr] at hsum
    rw [finSum_add, finSum_add] at hsum
    exact hsum
  · simpa only [aggBTZPlan, sumBTZNbr] using hcol .opp
  · simpa only [aggBTZPlan, sumBTZNbr] using hcol .back
  · simp only [aggBTZPlan]
    have hsum : finSum p (fun s => sumBTZNbr p (fun x => Q x (.child s))) = (p : Int) * M := by
      have heq : (fun s => sumBTZNbr p (fun x => Q x (.child s))) = (fun _ => M) := by
        funext s; exact hcol (.child s)
      rw [heq, finSum_const]
    simp only [sumBTZNbr] at hsum
    rw [finSum_add, finSum_add] at hsum
    rw [finSum_swap]
    exact hsum

/-- Theorem II.F2 (Exact Full-Graph Transport Cost Preservation Under 3-Class Aggregation):
    For ALL `p`, ALL `L >= 3`, and EVERY `(p + 2) x (p + 2)` coupling `Q`, the literal full-graph
    transport cost equals the 3-class reduced transport cost IDENTICALLY. -/
theorem fullBtz_cost_eq_agg (p : Nat) (L : Int) (hL : 3 ≤ L) (Q : BTZNbr p → BTZNbr p → Int) :
    fullBtzTransportCost p L Q = btzTransportCost L (aggBTZPlan p Q) := by
  unfold fullBtzTransportCost sumBTZNbr fullBtzDist
  simp only [BTZNbr.cls, btz_graph_metric_eq_classDist L hL]
  rw [finSum_add, finSum_add]
  rw [finSum_mul_right, finSum_mul_right, finSum_mul_right, finSum_mul_right]
  have hcc : finSum p (fun r => finSum p (fun s => Q (.child r) (.child s) * btzClassDist L .child .child)) =
      finSum p (fun r => finSum p (fun s => Q (.child r) (.child s))) * btzClassDist L .child .child := by
    have hinner : (fun r => finSum p (fun s => Q (.child r) (.child s) * btzClassDist L .child .child)) =
        (fun r => finSum p (fun s => Q (.child r) (.child s)) * btzClassDist L .child .child) := by
      funext r; exact finSum_mul_right p (fun s => Q (.child r) (.child s)) (btzClassDist L .child .child)
    rw [hinner, finSum_mul_right]
  rw [hcc]
  simp only [btzTransportCost, aggBTZPlan]
  omega

/-- Theorem II.F3 (Full-Graph (p+2) x (p+2) BTZ 1-Wasserstein Kantorovich Lower Bound):
    For ALL `p`, ALL `L >= 3`, ALL `M`, and EVERY arbitrary non-negative `(p + 2) x (p + 2)`
    full-graph coupling `Q` with uniform marginals `M`:
      fullBtzTransportCost p L Q >= M * (3 * p + 2 - max(0, 6 - L)). -/
theorem fullBtz_wasserstein_lower_bound (p : Nat) (L M : Int) (hL : 3 ≤ L)
    (Q : BTZNbr p → BTZNbr p → Int)
    (hnn : ∀ x y, 0 ≤ Q x y)
    (hrow : ∀ x, sumBTZNbr p (fun y => Q x y) = M)
    (hcol : ∀ y, sumBTZNbr p (fun x => Q x y) = M) :
    M * (3 * (p : Int) + 2 - shortcutSaving L) ≤ fullBtzTransportCost p L Q := by
  rw [fullBtz_cost_eq_agg p L hL Q]
  rcases fullBtz_agg_feasible p M Q hnn hrow hcol with ⟨ha, hr0, hr1, hr2, hc0, hc1, hc2⟩
  exact btz_wasserstein_lower_bound (p : Int) L M hL (aggBTZPlan p Q) ha hr0 hr1 hr2 hc0 hc1 hc2

/-- Explicit non-negative `(p + 2) x (p + 2)` full-graph optimal transport plan (scaled by `p * M`
    so every entry is an exact integer with zero division!):
    - `(opp, child s)   ↦ M`          (each of the `p` children receives `M`, summing to `p * M`)
    - `(back, back)     ↦ p * M`      (matches opposite ring neighbor via horizon shortcut!)
    - `(child r, opp)   ↦ M`          (each of the `p` children sends `M` to `opp`, summing to `p * M`)
    - `(child r, child s) ↦ if r = s then (p - 1) * M else 0` (exact diagonal child-to-child transport!). -/
def fullBtzOptimalPlan (p : Nat) (M : Int) : BTZNbr p → BTZNbr p → Int
  | .opp,     .child _ => M
  | .back,    .back    => (p : Int) * M
  | .child _, .opp     => M
  | .child r, .child s => if r = s then ((p : Int) - 1) * M else 0
  | _,        _        => 0

/-- Helper: `finSum` of a Kronecker delta `if i = j then c else 0` equals `c`. -/
theorem finSum_kronecker_right (p : Nat) (r : Fin p) (c : Int) :
    finSum p (fun s : Fin p => if r = s then c else 0) = c := by
  induction p with
  | zero => exact Fin.elim0 r
  | succ k ih =>
    simp only [finSum]
    by_cases hr : r.val = k
    · have hreq : r = ⟨k, Nat.lt_succ_self k⟩ := Fin.ext hr
      subst hreq
      have hzero : finSum k (fun s : Fin k => if (⟨k, Nat.lt_succ_self k⟩ : Fin (k + 1)) = s.castSucc then c else 0) = 0 := by
        have hfn : (fun s : Fin k => if (⟨k, Nat.lt_succ_self k⟩ : Fin (k + 1)) = s.castSucc then c else 0) = (fun _ => 0) := by
          funext s
          have hne : (⟨k, Nat.lt_succ_self k⟩ : Fin (k + 1)) ≠ s.castSucc := by
            intro heq
            have hv := congrArg Fin.val heq
            simp only [Fin.val_castSucc] at hv
            omega
          simp [hne]
        rw [hfn, finSum_const, Int.mul_zero]
      rw [hzero]
      simp
    · have hlt : r.val < k := by omega
      let r' : Fin k := ⟨r.val, hlt⟩
      have hrcast : r = r'.castSucc := Fin.ext rfl
      rw [hrcast]
      have hneLast : r'.castSucc ≠ ⟨k, Nat.lt_succ_self k⟩ := by
        intro heq
        have hv := congrArg Fin.val heq
        simp only [Fin.val_castSucc] at hv
        omega
      simp only [hneLast, ite_false, Int.add_zero]
      have hfn : (fun s : Fin k => if r'.castSucc = s.castSucc then c else 0) =
          (fun s : Fin k => if r' = s then c else 0) := by
        funext s
        by_cases h : r' = s
        · subst h; simp
        · have h' : r'.castSucc ≠ s.castSucc := by
            intro heq
            apply h
            have hv := congrArg Fin.val heq
            simp only [Fin.val_castSucc] at hv
            exact Fin.ext hv
          simp [h, h']
      rw [hfn]
      exact ih r'

theorem finSum_kronecker_left (p : Nat) (s : Fin p) (c : Int) :
    finSum p (fun r : Fin p => if r = s then c else 0) = c := by
  have hfn : (fun r : Fin p => if r = s then c else 0) = (fun r : Fin p => if s = r then c else 0) := by
    funext r
    by_cases h : r = s
    · subst h; simp
    · have h' : s ≠ r := Ne.symm h
      simp [h, h']
  rw [hfn]
  exact finSum_kronecker_right p s c

/-- Theorem II.F4 (Explicit Full-Graph (p+2) x (p+2) Primal Optimality Attainment):
    For ALL `p >= 1`, ALL `L >= 3`, and ALL `M >= 0`, the explicit full-graph transport plan
    `fullBtzOptimalPlan p M` is non-negative on all `(p + 2)^2` pairs, satisfies EVERY single
    individual vertex row marginal `= p * M` and column marginal `= p * M`, and attains the
    EXACT Kantorovich dual lower bound `(p * M) * (3 * p + 2 - max(0, 6 - L))`! -/
theorem fullBtz_primal_optimal_exists (p : Nat) (L M : Int) (hp : 1 ≤ p) (hL : 3 ≤ L) (hM : 0 ≤ M) :
    (∀ x y : BTZNbr p, 0 ≤ fullBtzOptimalPlan p M x y) ∧
    (∀ x : BTZNbr p, sumBTZNbr p (fun y => fullBtzOptimalPlan p M x y) = (p : Int) * M) ∧
    (∀ y : BTZNbr p, sumBTZNbr p (fun x => fullBtzOptimalPlan p M x y) = (p : Int) * M) ∧
    fullBtzTransportCost p L (fullBtzOptimalPlan p M) =
      ((p : Int) * M) * (3 * (p : Int) + 2 - shortcutSaving L) := by
  have hpM : 0 ≤ (p : Int) * M := Int.mul_nonneg (Int.natCast_nonneg p) hM
  have hp1M : 0 ≤ ((p : Int) - 1) * M := Int.mul_nonneg (by omega) hM
  have hsub : ((p : Int) - 1) * M = (p : Int) * M - M := by rw [Int.sub_mul, Int.one_mul]
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro x y
    cases x <;> cases y <;> simp only [fullBtzOptimalPlan] <;> (try split) <;> omega
  · intro x
    cases x with
    | opp =>
      simp only [sumBTZNbr, fullBtzOptimalPlan, finSum_const]; omega
    | back =>
      have hz : finSum p (fun _ : Fin p => (0 : Int)) = 0 := by rw [finSum_const, Int.mul_zero]
      simp only [sumBTZNbr, fullBtzOptimalPlan, hz]; omega
    | child r =>
      simp only [sumBTZNbr, fullBtzOptimalPlan, finSum_kronecker_right]
      omega
  · intro y
    cases y with
    | opp =>
      simp only [sumBTZNbr, fullBtzOptimalPlan, finSum_const]; omega
    | back =>
      have hz : finSum p (fun _ : Fin p => (0 : Int)) = 0 := by rw [finSum_const, Int.mul_zero]
      simp only [sumBTZNbr, fullBtzOptimalPlan, hz]; omega
    | child s =>
      simp only [sumBTZNbr, fullBtzOptimalPlan, finSum_kronecker_left]
      omega
  · rw [fullBtz_cost_eq_agg p L hL (fullBtzOptimalPlan p M)]
    have hagg : aggBTZPlan p (fullBtzOptimalPlan p M) = btzOptimalPlan (p : Int) ((p : Int) * M) := by
      funext i j
      cases i <;> cases j <;> simp only [aggBTZPlan, fullBtzOptimalPlan, btzOptimalPlan]
      · exact finSum_const p M
      · rw [finSum_const, Int.mul_zero]
      · exact finSum_const p M
      · rw [finSum_const, Int.mul_zero]
      · have hinner : (fun r : Fin p => finSum p (fun s : Fin p => if r = s then ((p : Int) - 1) * M else 0)) =
            (fun _ => ((p : Int) - 1) * M) := by
          funext r; exact finSum_kronecker_right p r (((p : Int) - 1) * M)
        rw [hinner, finSum_const]
        rw [← Int.mul_assoc, Int.mul_comm (p : Int) ((p : Int) - 1), Int.mul_assoc]
    rw [hagg]
    exact btz_primal_cost_exact (p : Int) L ((p : Int) * M)

end Ultrametrica

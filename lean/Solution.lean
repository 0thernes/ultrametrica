module

public import UltrametricaProofs.Spec
public import UltrametricaProofs

/-!
  ULTRAMETRICA (v1.7.0) — Sorry-Free Solution Module Matched Against `Challenge.lean`.

  Palomar Registry compliant Lean 4.35.0 `module`.
  Proves all 12 upgraded targets in `Ultrametrica.ComparatorTarget` with ZERO `sorry`,
  ZERO `native_decide`, ZERO custom axioms, and ZERO Mathlib dependencies, verified across
  6 independent Lean kernels via:
      lake check --paranoid
      lake comparator --config comparator.json --paranoid
-/

namespace Ultrametrica.ComparatorTarget

-- ---- Exact 1-to-1 Bridges Between Spec Definitions and Proof Modules ----

private theorem spec_revBaseAux_eq (p d v acc : Nat) :
    Spec.revBaseAux p d v acc = Ultrametrica.revBaseAux p d v acc := by
  induction d generalizing v acc with
  | zero => rfl
  | succ k ih => exact ih (v / p) (acc * p + v % p)

private theorem spec_revBase_eq (p n x : Nat) :
    Spec.revBase p n x = Ultrametrica.revBase p n x :=
  spec_revBaseAux_eq p n x 0

private def toCoreNbr : Spec.BTZNbrClass → Ultrametrica.BTZNbrClass
  | .opp   => .opp
  | .back  => .back
  | .child => .child

private def fromCoreNbr : Ultrametrica.BTZNbrClass → Spec.BTZNbrClass
  | .opp   => .opp
  | .back  => .back
  | .child => .child

private theorem spec_btzGraphDist_eq_core (L : Int) (i j : Spec.BTZNbrClass) :
    Spec.btzGraphDist L i j = Ultrametrica.btzGraphDist L (toCoreNbr i) (toCoreNbr j) := by
  cases i <;> cases j <;> (
    simp only [Spec.btzGraphDist, Ultrametrica.btzGraphDist, toCoreNbr,
      Ultrametrica.btzAnchorU, Ultrametrica.btzAnchorV, Ultrametrica.btzRadialOffset,
      Spec.cycleDist, Ultrametrica.cycleDist]
    omega
  )

private theorem spec_btzGraphDist_eq_classDist (L : Int) (hL : 3 ≤ L) (i j : Spec.BTZNbrClass) :
    Spec.btzGraphDist L i j = Ultrametrica.btzClassDist L (toCoreNbr i) (toCoreNbr j) := by
  rw [spec_btzGraphDist_eq_core]
  exact Ultrametrica.btz_graph_metric_eq_classDist L hL (toCoreNbr i) (toCoreNbr j)

private theorem spec_btzTransportCost_eq (L : Int) (hL : 3 ≤ L)
    (P : Spec.BTZNbrClass → Spec.BTZNbrClass → Int) :
    Spec.btzTransportCost L P =
      Ultrametrica.btzTransportCost L (fun i j => P (fromCoreNbr i) (fromCoreNbr j)) := by
  unfold Spec.btzTransportCost Ultrametrica.btzTransportCost
  rw [spec_btzGraphDist_eq_classDist L hL .opp .opp,
      spec_btzGraphDist_eq_classDist L hL .opp .back,
      spec_btzGraphDist_eq_classDist L hL .opp .child,
      spec_btzGraphDist_eq_classDist L hL .back .opp,
      spec_btzGraphDist_eq_classDist L hL .back .back,
      spec_btzGraphDist_eq_classDist L hL .back .child,
      spec_btzGraphDist_eq_classDist L hL .child .opp,
      spec_btzGraphDist_eq_classDist L hL .child .back,
      spec_btzGraphDist_eq_classDist L hL .child .child]
  rfl

private theorem spec_finSum_eq (n : Nat) (f : Fin n → Int) :
    Spec.finSum n f = Ultrametrica.finSum n f := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.finSum, Ultrametrica.finSum]
    rw [ih (fun i => f i.castSucc)]

private theorem spec_genBridgeTransportCost_eq (p : Nat) (ae : Int) (uA vA : Fin p → Int)
    (P00 : Int) (P0y Px0 : Fin p → Int) (Pxy : Fin p → Fin p → Int) :
    Spec.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy =
      Ultrametrica.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy := by
  unfold Spec.genBridgeTransportCost Ultrametrica.genBridgeTransportCost
  rw [spec_finSum_eq, spec_finSum_eq, spec_finSum_eq]
  have hinner : (fun r => Spec.finSum p (fun s => Pxy r s * (uA r + ae + vA s))) =
      (fun r => Ultrametrica.finSum p (fun s => Pxy r s * (uA r + ae + vA s))) := by
    funext r
    exact spec_finSum_eq p _
  rw [hinner]

private def toCoreCInt (z : Spec.CInt) : Ultrametrica.CInt := ⟨z.re, z.im⟩
private def fromCoreCInt (z : Ultrametrica.CInt) : Spec.CInt := ⟨z.re, z.im⟩

private theorem fromCore_toCore_CInt (z : Spec.CInt) : fromCoreCInt (toCoreCInt z) = z := by
  cases z; rfl

private theorem toCore_fromCore_CInt (z : Ultrametrica.CInt) : toCoreCInt (fromCoreCInt z) = z := by
  cases z; rfl

private def toCoreCVec {L : Nat} (v : Spec.CVec L) : Ultrametrica.CVec L := fun i => toCoreCInt (v i)
private def fromCoreCVec {L : Nat} (v : Ultrametrica.CVec L) : Spec.CVec L := fun i => fromCoreCInt (v i)

private theorem fromCore_toCore_CVec {L : Nat} (v : Spec.CVec L) : fromCoreCVec (toCoreCVec v) = v := by
  funext i; exact fromCore_toCore_CInt (v i)

private theorem toCore_fromCore_CVec {L : Nat} (v : Ultrametrica.CVec L) : toCoreCVec (fromCoreCVec v) = v := by
  funext i; exact toCore_fromCore_CInt (v i)

private theorem toCore_add (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.add a b) = Ultrametrica.CInt.add (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

private theorem toCore_sub (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.sub a b) = Ultrametrica.CInt.sub (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

private theorem toCore_mul (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.mul a b) = Ultrametrica.CInt.mul (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

private theorem toCore_smul (s : Int) (a : Spec.CInt) :
    toCoreCInt (Spec.CInt.smul s a) = Ultrametrica.CInt.smul s (toCoreCInt a) := by
  cases a; rfl

private theorem toCore_conj (a : Spec.CInt) :
    toCoreCInt (Spec.CInt.conj a) = Ultrametrica.CInt.conj (toCoreCInt a) := by
  cases a; rfl

private theorem toCore_finSumCInt (n : Nat) (f : Fin n → Spec.CInt) :
    toCoreCInt (Spec.finSumCInt n f) = Ultrametrica.finSumCInt n (fun i => toCoreCInt (f i)) := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.finSumCInt, Ultrametrica.finSumCInt]
    rw [toCore_add, ih (fun i => f i.castSucc)]

private theorem toCore_hermitianDot {L : Nat} (u v : Spec.CVec L) :
    toCoreCInt (Spec.hermitianDot u v) = Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec v) := by
  unfold Spec.hermitianDot Ultrametrica.hermitianDot toCoreCVec
  rw [toCore_finSumCInt]
  have hfn : (fun i : Fin L => toCoreCInt (Spec.CInt.mul (Spec.CInt.conj (u i)) (v i))) =
      (fun i : Fin L => Ultrametrica.CInt.mul (Ultrametrica.CInt.conj (toCoreCInt (u i))) (toCoreCInt (v i))) := by
    funext i
    rw [toCore_mul, toCore_conj]
  rw [hfn]

private theorem spec_cint_add_zero_left (a : Spec.CInt) :
    Spec.CInt.add Spec.CInt.zero a = a := by
  cases a; unfold Spec.CInt.add Spec.CInt.zero; simp

private theorem spec_cint_add_zero_right (a : Spec.CInt) :
    Spec.CInt.add a Spec.CInt.zero = a := by
  cases a; unfold Spec.CInt.add Spec.CInt.zero; simp

private theorem spec_cint_smul_zero (s : Int) :
    Spec.CInt.smul s Spec.CInt.zero = Spec.CInt.zero := by
  unfold Spec.CInt.smul Spec.CInt.zero; simp

private theorem spec_foldr_zero_of_all_zero {X : Type} (modes : List ((X → Spec.CInt) × Int)) (x : X)
    (hz : ∀ m ∈ modes, m.1 x = Spec.CInt.zero) :
    modes.foldr (fun m acc => Spec.CInt.add (m.1 x) acc) Spec.CInt.zero = Spec.CInt.zero := by
  induction modes with
  | nil => rfl
  | cons hd tl ih =>
    simp only [List.foldr_cons]
    have hhd : hd.1 x = Spec.CInt.zero := hz hd (List.mem_cons_self)
    have htl : tl.foldr (fun m acc => Spec.CInt.add (m.1 x) acc) Spec.CInt.zero = Spec.CInt.zero :=
      ih (fun m hm => hz m (List.mem_cons_of_mem hd hm))
    rw [hhd, htl, spec_cint_add_zero_left]

private theorem spec_foldr_smul_zero_of_all_zero {X : Type} (F : Int → Int)
    (modes : List ((X → Spec.CInt) × Int)) (x : X)
    (hz : ∀ m ∈ modes, m.1 x = Spec.CInt.zero) :
    modes.foldr (fun m acc => Spec.CInt.add (Spec.CInt.smul (F m.2) (m.1 x)) acc) Spec.CInt.zero =
      Spec.CInt.zero := by
  induction modes with
  | nil => rfl
  | cons hd tl ih =>
    simp only [List.foldr_cons]
    have hhd : hd.1 x = Spec.CInt.zero := hz hd (List.mem_cons_self)
    have htl : tl.foldr (fun m acc => Spec.CInt.add (Spec.CInt.smul (F m.2) (m.1 x)) acc) Spec.CInt.zero =
        Spec.CInt.zero :=
      ih (fun m hm => hz m (List.mem_cons_of_mem hd hm))
    rw [hhd, spec_cint_smul_zero, htl, spec_cint_add_zero_left]

private theorem spec_rtCutCap_eq (edges : List (Nat × Nat × Nat)) (S : Nat → Bool) :
    Spec.rtCutCap edges S = Ultrametrica.rtCutCap edges S := by
  induction edges with
  | nil => rfl
  | cons e rest ih =>
    rcases e with ⟨u, v, c⟩
    simp only [Spec.rtCutCap, Ultrametrica.rtCutCap, ih]

private theorem spec_sumInt_eq (ws : List Int) :
    Spec.sumInt ws = Ultrametrica.sumInt ws := by
  induction ws with
  | nil => rfl
  | cons w rest ih => simp only [Spec.sumInt, Ultrametrica.sumInt, ih]

private def toCoreRatQ (q : Spec.RatQ) : Ultrametrica.RatQ := ⟨q.num, q.den, q.den_pos⟩

private theorem toCoreRatQ_add (a b : Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.add a b) = Ultrametrica.RatQ.add (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

private theorem toCoreRatQ_sub (a b : Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.sub a b) = Ultrametrica.RatQ.sub (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

private theorem toCoreRatQ_sumList (xs : List Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.sumList xs) = Ultrametrica.RatQ.sumList (xs.map toCoreRatQ) := by
  induction xs with
  | nil => rfl
  | cons x rest ih =>
    simp only [Spec.RatQ.sumList, List.map_cons, Ultrametrica.RatQ.sumList, toCoreRatQ_add, ih]

private theorem toCoreRatQ_eqv_iff (a b : Spec.RatQ) :
    Spec.RatQ.eqv a b ↔ Ultrametrica.RatQ.eqv (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

private def toCoreEdge {n : Nat} (e : Spec.WeightedEdge n) : Ultrametrica.WeightedEdge n :=
  ⟨e.u, e.v, e.w⟩

private theorem spec_graphVertexWeight_eq {n : Nat} (edges : List (Spec.WeightedEdge n)) (x : Fin n) :
    Spec.graphVertexWeight edges x = Ultrametrica.graphVertexWeight (edges.map toCoreEdge) x := by
  unfold Spec.graphVertexWeight Ultrametrica.graphVertexWeight
  rw [spec_sumInt_eq, List.map_map]
  rfl

private theorem spec_padicValAux_eq (p fuel d : Nat) :
    Spec.padicValAux p fuel d = Ultrametrica.padicValAux p fuel d := by
  induction fuel generalizing d with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.padicValAux, Ultrametrica.padicValAux]
    split <;> simp [ih]

private theorem spec_padicValMod_eq (p n d : Nat) :
    Spec.padicValMod p n d = Ultrametrica.padicValMod p n d :=
  spec_padicValAux_eq p n (d % p ^ n)

private theorem spec_padicDistVal_eq (p n x y : Nat) :
    Spec.padicDistVal p n x y = Ultrametrica.padicDistVal p n x y :=
  spec_padicValMod_eq p n ((x + p ^ n - y) % p ^ n)

private theorem spec_kozyrevHaar_eq (p n j c : Nat) (hp : 2 ≤ p) (a : Fin p → Int) :
    Spec.kozyrevHaar p n j c hp a = Ultrametrica.kozyrevHaar p n j c hp a := by
  funext x; rfl

private theorem spec_ultrametricOp_eq (p n : Nat) (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)) :
    Spec.ultrametricOp p n K f x = Ultrametrica.ultrametricOp p n K f x := by
  unfold Spec.ultrametricOp Ultrametrica.ultrametricOp
  rw [spec_finSum_eq]
  apply Ultrametrica.finSum_congr
  intro y
  rw [spec_padicDistVal_eq]

private theorem spec_ultrametricWaveletEigenvalue_eq (p n j : Nat) (K : Nat → Int) :
    Spec.ultrametricWaveletEigenvalue p n j K = Ultrametrica.ultrametricWaveletEigenvalue p n j K := by
  unfold Spec.ultrametricWaveletEigenvalue Ultrametrica.ultrametricWaveletEigenvalue
  rw [spec_finSum_eq]
  congr 1
  apply Ultrametrica.finSum_congr
  intro t
  rw [spec_padicValMod_eq]

private theorem spec_vecRev_eq (N : Nat) (v : Fin N → Int) :
    Spec.vecRev N v = Ultrametrica.vecRev N v := by
  funext i; rfl

-- ---- The 12 Upgraded Comparator Targets (Exact Match to `Challenge.lean`) ----

public theorem target_thm1_monna_and_parity :
    (∀ p n x, 2 ≤ p → x < p ^ n → Spec.revBase p n (Spec.revBase p n x) = x) ∧
    (∀ p n x, 2 ≤ p → x < p ^ n → Spec.revBase p n (p ^ n - 1 - x) = p ^ n - 1 - Spec.revBase p n x) ∧
    (∀ p n j x y, 2 ≤ p → j ≤ n → x < p ^ n → y < p ^ n →
      (x % p ^ j = y % p ^ j ↔ Spec.revBase p n x / p ^ (n - j) = Spec.revBase p n y / p ^ (n - j))) ∧
    (∀ p m, p % 2 = 1 → 1 ≤ m → m < p → m ≠ p - m) ∧
    (∀ m, 1 ≤ m → m < 2 → m = 2 - m) := by
  refine ⟨?_, ?_, ?_, ?_, Ultrametrica.even_prime_self_conjugate⟩
  · intro p n x hp hx
    rw [spec_revBase_eq, spec_revBase_eq]
    exact Ultrametrica.monna_involution_universal p n x hp hx
  · intro p n x hp hx
    rw [spec_revBase_eq, spec_revBase_eq]
    exact Ultrametrica.complement_commutes_monna_universal p n x hp hx
  · intro p n j x y hp hj _hx _hy
    rw [spec_revBase_eq, spec_revBase_eq]
    exact Ultrametrica.padic_ball_monna_contiguity p n j x y hp hj
  · intro p m hodd h1 hlt
    exact Ultrametrica.odd_prime_conjugate_sector_disjoint p m hodd h1 hlt

public theorem target_thm1_picket_fence_law :
    ∀ p m a, 2 ≤ p → 1 ≤ m → 2 * m ≤ p →
      Spec.picketVal p m (2 * a) ≤ Spec.picketVal p m (2 * a + 1) ∧
      Spec.picketVal p m (2 * a + 1) < Spec.picketVal p m (2 * a + 2) ∧
      Spec.picketVal p m (2 * a + 1) - Spec.picketVal p m (2 * a) = p - 2 * m ∧
      Spec.picketVal p m (2 * a + 2) - Spec.picketVal p m (2 * a + 1) = 2 * m := by
  intro p m a _hp hm h2m
  have heq : ∀ i, Spec.picketVal p m i = Ultrametrica.picketSeq p m i := by
    intro i; unfold Spec.picketVal Ultrametrica.picketSeq; rfl
  simp only [heq]
  have h2a : 2 * a + 2 = 2 * (a + 1) := by omega
  rw [h2a]
  have h1 := Ultrametrica.picket_fence_monotone p m a hm h2m
  have h2 := Ultrametrica.picket_fence_even_gap p m a h2m
  have h3 := Ultrametrica.picket_fence_odd_gap p m a h2m
  exact ⟨h1.1, h1.2, h2, h3⟩

public theorem target_thm2_btz_ollivier_ricci :
    (∀ p L M : Int, 2 ≤ p → 3 ≤ L → 1 ≤ M →
      ∀ P : Spec.BTZNbrClass → Spec.BTZNbrClass → Int,
        (∀ i j, 0 ≤ P i j) →
        P .opp .opp + P .opp .back + P .opp .child = M →
        P .back .opp + P .back .back + P .back .child = M →
        P .child .opp + P .child .back + P .child .child = p * M →
        P .opp .opp + P .back .opp + P .child .opp = M →
        P .opp .back + P .back .back + P .child .back = M →
        P .opp .child + P .back .child + P .child .child = p * M →
        M * (3 * p + 2 - max 0 (6 - L)) ≤ Spec.btzTransportCost L P) ∧
    (∀ p L M : Int, 2 ≤ p → 3 ≤ L → 1 ≤ M →
      ∃ P : Spec.BTZNbrClass → Spec.BTZNbrClass → Int,
        (∀ i j, 0 ≤ P i j) ∧
        P .opp .opp + P .opp .back + P .opp .child = M ∧
        P .back .opp + P .back .back + P .back .child = M ∧
        P .child .opp + P .child .back + P .child .child = p * M ∧
        P .opp .opp + P .back .opp + P .child .opp = M ∧
        P .opp .back + P .back .back + P .child .back = M ∧
        P .opp .child + P .back .child + P .child .child = p * M ∧
        Spec.btzTransportCost L P = M * (3 * p + 2 - max 0 (6 - L))) ∧
    (∀ p L : Int,
      (p + 1) * (-(2 * p - max 0 (6 - L))) - (-2 * (p - 1)) * (p + 2) =
        (p + 1) * max 0 (6 - L) - 4) := by
  have hss : ∀ L : Int, Ultrametrica.shortcutSaving L = max 0 (6 - L) := by
    intro L
    unfold Ultrametrica.shortcutSaving
    omega
  refine ⟨?_, ?_, ?_⟩
  · intro p L M _hp hL _hM P hnn hr0 hr1 hr2 hc0 hc1 hc2
    rw [spec_btzTransportCost_eq L hL P, ← hss L]
    exact Ultrametrica.btz_wasserstein_lower_bound p L M hL
      (fun i j => P (fromCoreNbr i) (fromCoreNbr j))
      (fun i j => hnn (fromCoreNbr i) (fromCoreNbr j))
      hr0 hr1 hr2 hc0 hc1 hc2
  · intro p L M hp hL hM
    let Pspec : Spec.BTZNbrClass → Spec.BTZNbrClass → Int :=
      fun i j => Ultrametrica.btzOptimalPlan p M (toCoreNbr i) (toCoreNbr j)
    have hfeas := Ultrametrica.btz_primal_feasible p M (by omega) (by omega)
    have hcost := Ultrametrica.btz_primal_cost_exact p L M
    have hmatch : (fun i j => Pspec (fromCoreNbr i) (fromCoreNbr j)) = Ultrametrica.btzOptimalPlan p M := by
      funext i j; cases i <;> cases j <;> rfl
    refine ⟨Pspec, ?_, hfeas.2.1, hfeas.2.2.1, hfeas.2.2.2.1, hfeas.2.2.2.2.1, hfeas.2.2.2.2.2.1, hfeas.2.2.2.2.2.2, ?_⟩
    · intro i j
      exact hfeas.1 (toCoreNbr i) (toCoreNbr j)
    · rw [spec_btzTransportCost_eq L hL Pspec, hmatch, hcost, hss L]
  · intro p L
    have hid := Ultrametrica.btz_curvature_excess_identity p L
    unfold Ultrametrica.curvatureExcessNum Ultrametrica.kappaBTZNum Ultrametrica.kappaAdSNum
      Ultrametrica.kappaAdSDen Ultrametrica.kappaBTZDen at hid
    rw [hss L, Int.mul_comm (-(2 * p - max 0 (6 - L))) (p + 1)] at hid
    exact hid

public theorem target_thm3_multiball_soliton :
    ∀ (X : Type) (F : Int → Int) (modes : List ((X → Spec.CInt) × Int)),
      (∀ m ∈ modes, ∀ x, m.1 x = Spec.CInt.zero ∨ (m.1 x).normSq = m.2) →
      (∀ i j (hi : i < modes.length) (hj : j < modes.length),
        i ≠ j → ∀ x, (modes[i]'hi).1 x = Spec.CInt.zero ∨ (modes[j]'hj).1 x = Spec.CInt.zero) →
      ∀ x,
        let total := modes.foldr (fun m acc => Spec.CInt.add (m.1 x) acc) Spec.CInt.zero
        Spec.CInt.smul (F total.normSq) total =
          modes.foldr (fun m acc => Spec.CInt.add (Spec.CInt.smul (F m.2) (m.1 x)) acc) Spec.CInt.zero := by
  intro X F modes
  induction modes with
  | nil =>
    intro _ _ x
    exact spec_cint_smul_zero (F Spec.CInt.zero.normSq)
  | cons hd tl ih =>
    intro hflat hdisj x
    dsimp only
    simp only [List.foldr_cons]
    have hhd_flat : hd.1 x = Spec.CInt.zero ∨ (hd.1 x).normSq = hd.2 :=
      hflat hd List.mem_cons_self x
    have htl_flat : ∀ m ∈ tl, ∀ y, m.1 y = Spec.CInt.zero ∨ (m.1 y).normSq = m.2 :=
      fun m hm => hflat m (List.mem_cons_of_mem hd hm)
    have htl_disj : ∀ i j (hi : i < tl.length) (hj : j < tl.length),
        i ≠ j → ∀ y, (tl[i]'hi).1 y = Spec.CInt.zero ∨ (tl[j]'hj).1 y = Spec.CInt.zero := by
      intro i j hi hj hne y
      have hi' : i + 1 < (hd :: tl).length := Nat.succ_lt_succ hi
      have hj' : j + 1 < (hd :: tl).length := Nat.succ_lt_succ hj
      exact hdisj (i + 1) (j + 1) hi' hj' (by omega) y
    cases hhd_flat with
    | inl hzero =>
      rw [hzero, spec_cint_add_zero_left, spec_cint_smul_zero, spec_cint_add_zero_left]
      exact ih htl_flat htl_disj x
    | inr hnorm =>
      by_cases hhd_z : hd.1 x = Spec.CInt.zero
      · rw [hhd_z, spec_cint_add_zero_left, spec_cint_smul_zero, spec_cint_add_zero_left]
        exact ih htl_flat htl_disj x
      · have htl_all_zero : ∀ m ∈ tl, m.1 x = Spec.CInt.zero := by
          intro m hm
          rcases List.getElem_of_mem hm with ⟨idx, hidx, rfl⟩
          have h0 : 0 < (hd :: tl).length := Nat.zero_lt_succ _
          have hi : idx + 1 < (hd :: tl).length := Nat.succ_lt_succ hidx
          cases hdisj 0 (idx + 1) h0 hi (by omega) x with
          | inl hcontra => exact False.elim (hhd_z hcontra)
          | inr hmz => exact hmz
        rw [spec_foldr_zero_of_all_zero tl x htl_all_zero,
            spec_foldr_smul_zero_of_all_zero F tl x htl_all_zero,
            spec_cint_add_zero_right, spec_cint_add_zero_right, hnorm]

public theorem target_thm4_kerr_solver_and_parity :
    (∀ w q : Int, 0 ≤ w → 0 ≤ q → 1 ≤ 1 + w * q) ∧
    (∀ (L : Nat) (T : Spec.CVec L → Spec.CVec L),
      (∀ (c1 c2 : Spec.CInt) (v1 v2 : Spec.CVec L),
        T (Spec.cvecSub (Spec.cvecSmul c1 v1) (Spec.cvecSmul c2 v2)) =
          Spec.cvecSub (Spec.cvecSmul c1 (T v1)) (Spec.cvecSmul c2 (T v2))) →
      ∀ (w : Int) (u b y z : Spec.CVec L),
        T y = b → T z = u →
        let den := Spec.CInt.add Spec.CInt.one (Spec.CInt.smul w (Spec.hermitianDot u z))
        let wy := Spec.CInt.smul w (Spec.hermitianDot u y)
        let xScaled := Spec.cvecSub (Spec.cvecSmul den y) (Spec.cvecSmul wy z)
        Spec.cvecAdd (T xScaled) (Spec.cvecSmul (Spec.CInt.smul w (Spec.hermitianDot u xScaled)) u) =
          Spec.cvecSmul den b) ∧
    (∀ w : Int, ∀ z0 z1 ph : Spec.CInt,
      let d1 := Spec.CInt.sub z0 (Spec.CInt.mul ph z1)
      let d2 := Spec.CInt.sub z0.conj (Spec.CInt.mul ph.conj z1.conj)
      w * d2.normSq = w * d1.normSq) ∧
    (∀ w : Int, ∀ z0 z1 ph : Spec.CInt,
      let j1 := w * (Spec.CInt.mul z0.conj (Spec.CInt.mul ph z1)).im
      let j2 := w * (Spec.CInt.mul z0 (Spec.CInt.mul ph.conj z1.conj)).im
      j2 = -j1) := by
  refine ⟨Ultrametrica.sherman_morrison_denominator_ge_one, ?_, ?_, ?_⟩
  · intro L T hT_lin w u b y z hTy hTz
    dsimp only
    let Tcore : Ultrametrica.CVec L → Ultrametrica.CVec L := fun v => toCoreCVec (T (fromCoreCVec v))
    have hTcore_lin : ∀ (c1 c2 : Ultrametrica.CInt) (v1 v2 : Ultrametrica.CVec L),
        Tcore (Ultrametrica.cvecSub (Ultrametrica.cvecSmul c1 v1) (Ultrametrica.cvecSmul c2 v2)) =
          Ultrametrica.cvecSub (Ultrametrica.cvecSmul c1 (Tcore v1)) (Ultrametrica.cvecSmul c2 (Tcore v2)) := by
      intro c1 c2 v1 v2
      have harg : fromCoreCVec (Ultrametrica.cvecSub (Ultrametrica.cvecSmul c1 v1) (Ultrametrica.cvecSmul c2 v2)) =
          Spec.cvecSub (Spec.cvecSmul (fromCoreCInt c1) (fromCoreCVec v1))
                       (Spec.cvecSmul (fromCoreCInt c2) (fromCoreCVec v2)) := by
        funext i; rfl
      show toCoreCVec (T (fromCoreCVec _)) = _
      rw [harg, hT_lin]
      funext i
      unfold toCoreCVec Spec.cvecSub Spec.cvecSmul Ultrametrica.cvecSub Ultrametrica.cvecSmul
      rw [toCore_sub, toCore_mul, toCore_mul, toCore_fromCore_CInt, toCore_fromCore_CInt]
      rfl
    have hTcore_y : Tcore (toCoreCVec y) = toCoreCVec b := by
      show toCoreCVec (T (fromCoreCVec (toCoreCVec y))) = toCoreCVec b
      rw [fromCore_toCore_CVec, hTy]
    have hTcore_z : Tcore (toCoreCVec z) = toCoreCVec u := by
      show toCoreCVec (T (fromCoreCVec (toCoreCVec z))) = toCoreCVec u
      rw [fromCore_toCore_CVec, hTz]
    have hcore := Ultrametrica.sherman_morrison_exact_identity Tcore hTcore_lin w
      (toCoreCVec u) (toCoreCVec b) (toCoreCVec y) (toCoreCVec z) hTcore_y hTcore_z
    funext i
    have hi := congrFun hcore i
    have h_eq : ∀ a b : Spec.CInt, toCoreCInt a = toCoreCInt b → a = b := by
      intro a b h
      rw [← fromCore_toCore_CInt a, ← fromCore_toCore_CInt b, h]
    apply h_eq
    have hden_eq : toCoreCInt (Spec.CInt.add Spec.CInt.one (Spec.CInt.smul w (Spec.hermitianDot u z))) =
        Ultrametrica.CInt.add Ultrametrica.CInt.one (Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec z))) := by
      rw [toCore_add, toCore_smul, toCore_hermitianDot]; rfl
    have hwy_eq : toCoreCInt (Spec.CInt.smul w (Spec.hermitianDot u y)) =
        Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec y)) := by
      rw [toCore_smul, toCore_hermitianDot]
    let xS : Spec.CVec L :=
      Spec.cvecSub (Spec.cvecSmul (Spec.CInt.add Spec.CInt.one (Spec.CInt.smul w (Spec.hermitianDot u z))) y)
                   (Spec.cvecSmul (Spec.CInt.smul w (Spec.hermitianDot u y)) z)
    have hx_eq : toCoreCVec xS =
        Ultrametrica.cvecSub
          (Ultrametrica.cvecSmul (Ultrametrica.CInt.add Ultrametrica.CInt.one (Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec z)))) (toCoreCVec y))
          (Ultrametrica.cvecSmul (Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec y))) (toCoreCVec z)) := by
      funext j
      unfold xS toCoreCVec Spec.cvecSub Spec.cvecSmul Ultrametrica.cvecSub Ultrametrica.cvecSmul
      rw [toCore_sub, toCore_mul, toCore_mul, hden_eq, hwy_eq]
      rfl
    change toCoreCInt (Spec.CInt.add (T xS i) (Spec.CInt.mul (Spec.CInt.smul w (Spec.hermitianDot u xS)) (u i))) =
      toCoreCInt (Spec.CInt.mul (Spec.CInt.add Spec.CInt.one (Spec.CInt.smul w (Spec.hermitianDot u z))) (b i))
    rw [toCore_add, toCore_mul, toCore_mul, toCore_smul, toCore_hermitianDot, hden_eq, hx_eq]
    have hTx : toCoreCInt (T xS i) =
        Tcore (Ultrametrica.cvecSub
          (Ultrametrica.cvecSmul (Ultrametrica.CInt.add Ultrametrica.CInt.one (Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec z)))) (toCoreCVec y))
          (Ultrametrica.cvecSmul (Ultrametrica.CInt.smul w (Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec y))) (toCoreCVec z))) i := by
      show (toCoreCVec (T xS)) i = (toCoreCVec (T (fromCoreCVec _))) i
      rw [← hx_eq, fromCore_toCore_CVec]
    rw [hTx]
    exact hi
  · intro w z0 z1 ph
    have hcore := Ultrametrica.kerr_flux_edge_stress_even (toCoreCInt z0) (toCoreCInt z1) (toCoreCInt ph)
    dsimp only
    exact congrArg (w * ·) hcore
  · intro w z0 z1 ph
    dsimp only
    have hcur : (Spec.CInt.mul z0 (Spec.CInt.mul ph.conj z1.conj)).im =
        -(Spec.CInt.mul z0.conj (Spec.CInt.mul ph z1)).im := by
      cases z0 with | mk a b =>
      cases z1 with | mk c d =>
      cases ph with | mk cr si =>
      unfold Spec.CInt.conj Spec.CInt.mul
      simp only [Int.neg_mul, Int.mul_neg, Int.neg_neg]
      have h1 : -(cr * d) + -(si * c) = -(cr * d + si * c) := by omega
      rw [h1, Int.mul_neg]
      omega
    rw [hcur, Int.mul_neg]

public theorem target_thm5_global_curved_gauss_bonnet :
    (∀ p w Wu Wv : Int,
      Spec.curvedGenKappaNum p w Wu Wv =
        -(p - 1) * w * Wv + -(p - 1) * w * Wu - Spec.curvedGenDeficitNum w Wu Wv) ∧
    (∀ p : Int, ∀ ws : List Int,
      Spec.sumInt (ws.map (fun w => -(p - 1) * w)) = -(p - 1) * Spec.sumInt ws) := by
  constructor
  · intro p w Wu Wv
    unfold Spec.curvedGenKappaNum Spec.curvedGenDeficitNum
    have hcharge : (-(p - 1) * w) * Wv + (-(p - 1) * w) * Wu = -(p - 1) * w * (Wu + Wv) := by
      rw [← Int.mul_add, Int.add_comm Wv Wu]
    rw [hcharge]
    by_cases hsub : w * (Wu + Wv) ≤ Wu * Wv
    · simp only [hsub, ite_true]; omega
    · simp only [hsub, ite_false]
      have ha : -(p - 1) * w * (Wu + Wv) = -(p * (w * (Wu + Wv))) + w * (Wu + Wv) := by
        rw [Int.mul_assoc (-(p - 1)) w (Wu + Wv), Int.neg_mul, Int.sub_mul, Int.one_mul]; omega
      have hb : (p + 1) * w * (Wu + Wv) = p * (w * (Wu + Wv)) + w * (Wu + Wv) := by
        rw [Int.mul_assoc (p + 1) w (Wu + Wv), Int.add_mul, Int.one_mul]
      have hc : 2 * Wu * Wv = 2 * (Wu * Wv) := Int.mul_assoc 2 Wu Wv
      omega
  · intro p ws
    rw [spec_sumInt_eq, spec_sumInt_eq]
    exact Ultrametrica.sumInt_map_mul (-(p - 1)) ws

public theorem target_thm5_kantorovich_dual :
    (∀ (p : Nat) (D ae w Wu Wv M : Int) (uW vW uA vA : Fin p → Int)
       (P00 : Int) (P0y Px0 : Fin p → Int) (Pxy : Fin p → Fin p → Int),
      0 ≤ ae → w * ae = D →
      (∀ r, uW r * uA r = D) → (∀ s, vW s * vA s = D) →
      w + Spec.finSum p uW = Wu →
      0 ≤ P00 → (∀ r s, 0 ≤ Pxy r s) →
      (∀ r, Px0 r + Spec.finSum p (fun s => Pxy r s) = uW r * Wv * M) →
      P00 + Spec.finSum p Px0 = w * Wu * M →
      (∀ s, P0y s + Spec.finSum p (fun r => Pxy r s) = vW s * Wu * M) →
      ae * M * (Wu * Wv + ((p : Int) - 1) * w * (Wu + Wv)) ≤
        Spec.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy ∧
      ae * M * (((p : Int) + 1) * w * (Wu + Wv) - Wu * Wv) ≤
        Spec.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy) ∧
    (∀ (p : Nat) (D ae w Wu Wv : Int) (uW vW uA vA : Fin p → Int),
      0 ≤ w → (∀ r, 0 ≤ uW r) → (∀ s, 0 ≤ vW s) →
      w * (Wu + Wv) ≤ Wu * Wv →
      w * ae = D → (∀ r, uW r * uA r = D) → (∀ s, vW s * vA s = D) →
      w + Spec.finSum p uW = Wu → w + Spec.finSum p vW = Wv →
      ∃ (M P00 : Int) (P0y Px0 : Fin p → Int) (Pxy : Fin p → Fin p → Int),
        0 ≤ M ∧ 0 ≤ P00 ∧ (∀ s, 0 ≤ P0y s) ∧ (∀ r, 0 ≤ Px0 r) ∧ (∀ r s, 0 ≤ Pxy r s) ∧
        P00 + Spec.finSum p P0y = w * Wv * M ∧
        (∀ r, Px0 r + Spec.finSum p (fun s => Pxy r s) = uW r * Wv * M) ∧
        P00 + Spec.finSum p Px0 = w * Wu * M ∧
        (∀ s, P0y s + Spec.finSum p (fun r => Pxy r s) = vW s * Wu * M) ∧
        Spec.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy =
          ae * M * (Wu * Wv + ((p : Int) - 1) * w * (Wu + Wv))) ∧
    (∀ (p : Nat) (D ae w Wu Wv : Int) (uW vW uA vA : Fin p → Int),
      0 ≤ w → (∀ r, 0 ≤ uW r) → (∀ s, 0 ≤ vW s) →
      Wu * Wv ≤ w * (Wu + Wv) →
      w * ae = D → (∀ r, uW r * uA r = D) → (∀ s, vW s * vA s = D) →
      w + Spec.finSum p uW = Wu → w + Spec.finSum p vW = Wv →
      ∃ (P00 : Int) (P0y Px0 : Fin p → Int) (Pxy : Fin p → Fin p → Int),
        0 ≤ P00 ∧ (∀ s, 0 ≤ P0y s) ∧ (∀ r, 0 ≤ Px0 r) ∧ (∀ r s, 0 ≤ Pxy r s) ∧
        P00 + Spec.finSum p P0y = w * Wv * 1 ∧
        (∀ r, Px0 r + Spec.finSum p (fun s => Pxy r s) = uW r * Wv * 1) ∧
        P00 + Spec.finSum p Px0 = w * Wu * 1 ∧
        (∀ s, P0y s + Spec.finSum p (fun r => Pxy r s) = vW s * Wu * 1) ∧
        Spec.genBridgeTransportCost p ae uA vA P00 P0y Px0 Pxy =
          ae * 1 * (((p : Int) + 1) * w * (Wu + Wv) - Wu * Wv)) := by
  refine ⟨?_, ?_, ?_⟩
  · intro p D ae w Wu Wv M uW vW uA vA P00 P0y Px0 Pxy hae hwD huA hvA hWu hP00 hPxy hRowR hCol0 hColS
    rw [spec_finSum_eq] at hWu hCol0
    have hRowR' : ∀ r, Px0 r + Ultrametrica.finSum p (fun s => Pxy r s) = uW r * Wv * M := by
      intro r; rw [← spec_finSum_eq]; exact hRowR r
    have hColS' : ∀ s, P0y s + Ultrametrica.finSum p (fun r => Pxy r s) = vW s * Wu * M := by
      intro s; rw [← spec_finSum_eq]; exact hColS s
    rw [spec_genBridgeTransportCost_eq]
    exact ⟨
      Ultrametrica.gen_bridge_wasserstein_lower_bound_sub
        p D ae w Wu Wv M uW vW uA vA P00 P0y Px0 Pxy hae hwD huA hvA hWu hP00 hRowR' hCol0 hColS',
      Ultrametrica.gen_bridge_wasserstein_lower_bound_sup
        p D ae w Wu Wv M uW vW uA vA P00 P0y Px0 Pxy hae hwD huA hvA hWu hPxy hRowR' hCol0 hColS'
    ⟩
  · intro p D ae w Wu Wv uW vW uA vA hw huW hvW hsub hwD huA hvA hWu hWv
    rw [spec_finSum_eq] at hWu hWv
    have hopt := Ultrametrica.gen_bridge_primal_sub_optimal
      p D ae w Wu Wv uW vW uA vA hw huW hvW hsub hwD huA hvA hWu hWv
    refine ⟨(Wu - w) * (Wv - w), 0,
      fun s => w * Wv * (Wu - w) * vW s,
      fun r => w * Wu * (Wv - w) * uW r,
      fun r s => (Wu * Wv - w * (Wu + Wv)) * (uW r * vW s),
      hopt.1, hopt.2.1, hopt.2.2.1, hopt.2.2.2.1, hopt.2.2.2.2.1, ?_, ?_, ?_, ?_, ?_⟩
    · rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.1
    · intro r; rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.2.1 r
    · rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.2.2.1
    · intro s; rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.2.2.2.1 s
    · rw [spec_genBridgeTransportCost_eq]; exact hopt.2.2.2.2.2.2.2.2.2
  · intro p D ae w Wu Wv uW vW uA vA hw huW hvW hsup hwD huA hvA hWu hWv
    rw [spec_finSum_eq] at hWu hWv
    have hopt := Ultrametrica.gen_bridge_primal_sup_optimal
      p D ae w Wu Wv uW vW uA vA hw huW hvW hsup hwD huA hvA hWu hWv
    refine ⟨w * (Wu + Wv) - Wu * Wv,
      fun s => vW s * Wu,
      fun r => uW r * Wv,
      fun _ _ => 0,
      hopt.1, hopt.2.1, hopt.2.2.1, hopt.2.2.2.1, ?_, ?_, ?_, ?_, ?_⟩
    · rw [spec_finSum_eq]; exact hopt.2.2.2.2.1
    · intro r; rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.1 r
    · rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.2.1
    · intro s; rw [spec_finSum_eq]; exact hopt.2.2.2.2.2.2.2.1 s
    · rw [spec_genBridgeTransportCost_eq]; exact hopt.2.2.2.2.2.2.2.2

public theorem target_thm6_holographic_ssa :
    ∀ (edges : List (Nat × Nat × Nat)) (bdry A B C W_AB W_BC : Nat → Bool) (S_ABC S_B : Nat),
      (∀ v, bdry v = true → (A v && C v) = false) →
      Spec.IsHomologous bdry (fun v => A v || B v) W_AB →
      Spec.IsHomologous bdry (fun v => B v || C v) W_BC →
      (∀ W, Spec.IsHomologous bdry (fun v => (A v || B v) || C v) W → S_ABC ≤ Spec.rtCutCap edges W) →
      (∀ W, Spec.IsHomologous bdry B W → S_B ≤ Spec.rtCutCap edges W) →
      S_ABC + S_B ≤ Spec.rtCutCap edges W_AB + Spec.rtCutCap edges W_BC := by
  intro edges bdry A B C W_AB W_BC S_ABC S_B hdisj hAB hBC hminABC hminB
  rw [spec_rtCutCap_eq, spec_rtCutCap_eq]
  apply Ultrametrica.rt_strong_subadditivity edges bdry A B C W_AB W_BC S_ABC S_B hdisj hAB hBC
  · intro W hW; rw [← spec_rtCutCap_eq]; exact hminABC W hW
  · intro W hW; rw [← spec_rtCutCap_eq]; exact hminB W hW

public theorem target_adversarial_refutations :
    ¬ (∀ m : Nat, 1 ≤ m → m < 2 → m ≠ 2 - m) ∧
    Spec.curvedGenDeficitNum 8 10 10 ≠ 0 ∧
    ¬ (Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5), (1, 3, 4)] (fun v => v == 1 || v == 2) +
       Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5), (1, 3, 4)] (fun v => v == 2 || v == 3) ≤
       Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5), (1, 3, 4)] (fun v => v == 1 || v == 2 || v == 3) +
       Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5), (1, 3, 4)] (fun v => v == 2)) ∧
    Spec.curvedGenKappaNum 3 2 2 2 * 1 ≠ (-(3 - 1) * 2) * (2 * 2) ∧
    ¬ (∃ lam : Int, ∀ x : Fin (3 ^ 2),
        Spec.ultrametricOp 3 2 (fun v => (v : Int) + 1)
          (Spec.kozyrevHaar 3 2 1 0 (Nat.le_succ 2) (fun d => if d.val = 0 then 1 else 0)) x =
        lam * Spec.kozyrevHaar 3 2 1 0 (Nat.le_succ 2) (fun d => if d.val = 0 then 1 else 0) x) := by
  refine ⟨Ultrametrica.Adversarial.adv_dyadic_breaks_odd_doublet_protection, by decide, by decide, by decide, ?_⟩
  have hlhs : Ultrametrica.ultrametricOp 3 2 (fun v => (v : Int) + 1)
      (Ultrametrica.kozyrevHaar 3 2 1 0 (Nat.le_succ 2) (fun d => if d.val = 0 then 1 else 0))
      ⟨1, by omega⟩ = 1 := by decide
  have hrhs : Ultrametrica.kozyrevHaar 3 2 1 0 (Nat.le_succ 2)
      (fun d => if d.val = 0 then 1 else 0) ⟨1, by omega⟩ = 0 := by decide
  rintro ⟨lam, h⟩
  have h1 := h ⟨1, by omega⟩
  rw [spec_ultrametricOp_eq, spec_kozyrevHaar_eq] at h1
  rw [hlhs, hrhs, Int.mul_zero] at h1
  omega

public theorem target_nonvacuity_witnesses :
    (Spec.revBase 3 4 5 = 63 ∧ 5 < 3 ^ 4) ∧
    (Spec.picketVal 5 1 1 - Spec.picketVal 5 1 0 = 3) ∧
    ((3 + 1 : Int) * (-(2 * 3 - max 0 (6 - 5))) - (-2 * (3 - 1)) * (3 + 2) = 0 ∧
      Spec.btzGraphDist 5 .back .back = 2) ∧
    (∃ modes : List ((Nat → Spec.CInt) × Int),
      modes.length = 2 ∧
      (∀ m ∈ modes, ∀ x, m.1 x = Spec.CInt.zero ∨ (m.1 x).normSq = m.2) ∧
      (∀ i j (hi : i < modes.length) (hj : j < modes.length),
        i ≠ j → ∀ x, (modes[i]'hi).1 x = Spec.CInt.zero ∨ (modes[j]'hj).1 x = Spec.CInt.zero)) ∧
    (Spec.CInt.add Spec.CInt.one
      (Spec.CInt.smul 2 (Spec.hermitianDot (fun _ : Fin 1 => Spec.CInt.one) (fun _ : Fin 1 => Spec.CInt.one)))
      = ⟨3, 0⟩) ∧
    (Spec.curvedGenDeficitNum 2 5 7 = 0 ∧ Spec.curvedGenDeficitNum 8 10 10 = 120) ∧
    (let uW : Fin 2 → Int := fun i => if i.val == 0 then 1 else 2
     let vW : Fin 2 → Int := fun i => if i.val == 0 then 3 else 1
     let uA : Fin 2 → Int := fun i => if i.val == 0 then 12 else 6
     let vA : Fin 2 → Int := fun i => if i.val == 0 then 4 else 12
     (2 : Int) * 6 = 12 ∧ (∀ r, uW r * uA r = 12) ∧ (∀ s, vW s * vA s = 12) ∧
     2 + Spec.finSum 2 uW = 5 ∧ 2 + Spec.finSum 2 vW = 6 ∧ (2 : Int) * (5 + 6) ≤ 5 * 6) ∧
    (Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5)] (fun v => v == 1 || v == 2) = 5 ∧
     Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5)] (fun v => v == 2 || v == 3) = 8) ∧
    (let v0 : Fin 4 := ⟨0, Nat.zero_lt_succ 3⟩
     let v1 : Fin 4 := ⟨1, Nat.succ_lt_succ (Nat.zero_lt_succ 2)⟩
     let v2 : Fin 4 := ⟨2, Nat.succ_lt_succ (Nat.succ_lt_succ (Nat.zero_lt_succ 1))⟩
     let v3 : Fin 4 := ⟨3, Nat.lt_succ_self 3⟩
     let edges : List (Spec.WeightedEdge 4) := [⟨v0, v1, 2⟩, ⟨v0, v2, 3⟩, ⟨v0, v3, 5⟩]
     Spec.graphVertexWeight edges v0 = 10 ∧
     Spec.graphVertexWeight edges v1 = 2 ∧
     Spec.graphVertexWeight edges v2 = 3 ∧
     Spec.graphVertexWeight edges v3 = 5) ∧
    (let a : Fin 3 → Int := fun d => if d.val = 0 then 1 else if d.val = 1 then -1 else 0
     Spec.finSum 3 a = 0 ∧ Spec.ultrametricWaveletEigenvalue 3 2 0 (fun v => (v : Int)) = 4) := by
  refine ⟨by decide, by decide, by decide, ?_, rfl, by decide, ?_, by decide, by decide, by decide⟩
  · refine ⟨[(fun x => if x == 0 then Spec.CInt.one else Spec.CInt.zero, 1),
              (fun x => if x == 1 then Spec.CInt.one else Spec.CInt.zero, 1)], rfl, ?_, ?_⟩
    · intro m hm x
      simp only [List.mem_cons, List.not_mem_nil, or_false] at hm
      rcases hm with rfl | rfl
      · by_cases hx : x == 0
        · right; simp [hx, Spec.CInt.one, Spec.CInt.normSq]
        · left; simp [hx]
      · by_cases hx : x == 1
        · right; simp [hx, Spec.CInt.one, Spec.CInt.normSq]
        · left; simp [hx]
    · intro i j hi hj hne x
      simp only [List.length_cons, List.length_nil] at hi hj
      have hi2 : i = 0 ∨ i = 1 := by omega
      have hj2 : j = 0 ∨ j = 1 := by omega
      rcases hi2 with rfl | rfl <;> rcases hj2 with rfl | rfl
      · exact False.elim (hne rfl)
      · cases x with
        | zero => right; rfl
        | succ _ => left; rfl
      · cases x with
        | zero => left; rfl
        | succ k =>
          cases k with
          | zero => right; rfl
          | succ _ => left; rfl
      · exact False.elim (hne rfl)
  · refine ⟨by decide, ?_, ?_, by decide, by decide, by decide⟩
    · intro r
      rcases r with ⟨v, hv⟩
      have hv2 : v = 0 ∨ v = 1 := by omega
      rcases hv2 with rfl | rfl <;> rfl
    · intro s
      rcases s with ⟨v, hv⟩
      have hv2 : v = 0 ∨ v = 1 := by omega
      rcases hv2 with rfl | rfl <;> rfl

public theorem target_thm5_finite_graph_gauss_bonnet :
    (∀ (n : Nat) (p : Int) (edges : List (Spec.WeightedEdge n))
       (hW : ∀ x : Fin n, 0 < Spec.graphVertexWeight edges x),
      Spec.RatQ.eqv
        (Spec.RatQ.sumList (edges.map (fun e =>
          Spec.curvedGenKappaQ p e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v))))
        (Spec.RatQ.sub
          ⟨-(p - 1) * (n : Int), 1, Int.zero_lt_one⟩
          (Spec.RatQ.sumList (edges.map (fun e =>
            Spec.curvedGenDeficitQ e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
              (hW e.u) (hW e.v)))))) ∧
    (∀ (n : Nat) (p : Int) (edges : List (Spec.WeightedEdge n))
       (hW : ∀ x : Fin n, 0 < Spec.graphVertexWeight edges x),
      (∀ e ∈ edges,
        e.w * (Spec.graphVertexWeight edges e.u + Spec.graphVertexWeight edges e.v) ≤
          Spec.graphVertexWeight edges e.u * Spec.graphVertexWeight edges e.v) →
      Spec.RatQ.eqv
        (Spec.RatQ.sumList (edges.map (fun e =>
          Spec.curvedGenKappaQ p e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v))))
        ⟨-(p - 1) * (n : Int), 1, Int.zero_lt_one⟩) := by
  constructor
  · intro n p edges hW
    let edgesC := edges.map toCoreEdge
    have hWC : ∀ x : Fin n, 0 < Ultrametrica.graphVertexWeight edgesC x := by
      intro x
      rw [← spec_graphVertexWeight_eq]
      exact hW x
    rw [toCoreRatQ_eqv_iff, toCoreRatQ_sumList, toCoreRatQ_sub, toCoreRatQ_sumList,
        List.map_map, List.map_map]
    have h1 : edges.map (toCoreRatQ ∘ fun e =>
          Spec.curvedGenKappaQ p e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v)) =
        edgesC.map (fun e =>
          Ultrametrica.curvedGenKappaQ p e.w (Ultrametrica.graphVertexWeight edgesC e.u)
            (Ultrametrica.graphVertexWeight edgesC e.v) (hWC e.u) (hWC e.v)) := by
      simp only [edgesC, List.map_map]
      apply List.map_congr_left
      intro e _
      simp only [Function.comp, toCoreRatQ, toCoreEdge, Spec.curvedGenKappaQ, Ultrametrica.curvedGenKappaQ,
        Spec.curvedGenKappaNum, Ultrametrica.curvedGenKappaNum, spec_graphVertexWeight_eq]
      rfl
    have h2 : edges.map (toCoreRatQ ∘ fun e =>
          Spec.curvedGenDeficitQ e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v)) =
        edgesC.map (fun e =>
          Ultrametrica.curvedGenDeficitQ e.w (Ultrametrica.graphVertexWeight edgesC e.u)
            (Ultrametrica.graphVertexWeight edgesC e.v) (hWC e.u) (hWC e.v)) := by
      simp only [edgesC, List.map_map]
      apply List.map_congr_left
      intro e _
      simp only [Function.comp, toCoreRatQ, toCoreEdge, Spec.curvedGenDeficitQ, Ultrametrica.curvedGenDeficitQ,
        Spec.curvedGenDeficitNum, Ultrametrica.curvedGenDeficitNum, spec_graphVertexWeight_eq]
      rfl
    rw [h1, h2]
    exact Ultrametrica.finite_graph_curved_gauss_bonnet_sum p edgesC hWC
  · intro n p edges hW hsub
    let edgesC := edges.map toCoreEdge
    have hWC : ∀ x : Fin n, 0 < Ultrametrica.graphVertexWeight edgesC x := by
      intro x
      rw [← spec_graphVertexWeight_eq]
      exact hW x
    have hsubC : ∀ e ∈ edgesC,
        e.w * (Ultrametrica.graphVertexWeight edgesC e.u + Ultrametrica.graphVertexWeight edgesC e.v) ≤
          Ultrametrica.graphVertexWeight edgesC e.u * Ultrametrica.graphVertexWeight edgesC e.v := by
      intro e he
      rcases List.mem_map.mp he with ⟨es, hes, rfl⟩
      have h := hsub es hes
      dsimp only [edgesC, toCoreEdge]
      rw [← spec_graphVertexWeight_eq, ← spec_graphVertexWeight_eq]
      exact h
    rw [toCoreRatQ_eqv_iff, toCoreRatQ_sumList, List.map_map]
    have h1 : edges.map (toCoreRatQ ∘ fun e =>
          Spec.curvedGenKappaQ p e.w (Spec.graphVertexWeight edges e.u) (Spec.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v)) =
        edgesC.map (fun e =>
          Ultrametrica.curvedGenKappaQ p e.w (Ultrametrica.graphVertexWeight edgesC e.u)
            (Ultrametrica.graphVertexWeight edgesC e.v) (hWC e.u) (hWC e.v)) := by
      simp only [edgesC, List.map_map]
      apply List.map_congr_left
      intro e _
      simp only [Function.comp, toCoreRatQ, toCoreEdge, Spec.curvedGenKappaQ, Ultrametrica.curvedGenKappaQ,
        Spec.curvedGenKappaNum, Ultrametrica.curvedGenKappaNum, spec_graphVertexWeight_eq]
      rfl
    rw [h1]
    exact Ultrametrica.finite_graph_subcritical_gauss_bonnet_conserved p edgesC hWC hsubC

public theorem target_thm7_vladimirov_kozyrev_eigenfunction :
    (∀ p n x y z, 2 ≤ p → x < p ^ n → y < p ^ n → z < p ^ n →
      min (Spec.padicDistVal p n x y) (Spec.padicDistVal p n y z) ≤ Spec.padicDistVal p n x z) ∧
    (∀ (p n j c : Nat) (hp : 2 ≤ p), j < n → c < p ^ n →
      ∀ (K : Nat → Int) (a : Fin p → Int), Spec.finSum p a = 0 →
        ∀ x : Fin (p ^ n),
          Spec.ultrametricOp p n K (Spec.kozyrevHaar p n j c hp a) x =
            Spec.ultrametricWaveletEigenvalue p n j K * Spec.kozyrevHaar p n j c hp a x) ∧
    (∀ (p n : Nat), 2 ≤ p → ∀ (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)),
      Spec.ultrametricOp p n K (Spec.vecRev (p ^ n) f) x =
        Spec.vecRev (p ^ n) (Spec.ultrametricOp p n K f) x) ∧
    (∀ (N : Nat) (H : (Fin N → Int) → (Fin N → Int)),
      (∀ v, H (Spec.vecRev N v) = Spec.vecRev N (H v)) →
      (∀ v, H (fun i => -(v i)) = fun i => -(H v i)) →
      (∀ v, Spec.vecRev N v = v → Spec.vecRev N (H v) = H v) ∧
      (∀ v, Spec.vecRev N v = (fun i => -(v i)) → Spec.vecRev N (H v) = fun i => -(H v i))) := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · intro p n x y z hp hx hy hz
    rw [spec_padicDistVal_eq, spec_padicDistVal_eq, spec_padicDistVal_eq]
    exact Ultrametrica.padicDistVal_strong_tri p n x y z hp hx hy hz
  · intro p n j c hp hj hc K a hsum x
    rw [spec_finSum_eq] at hsum
    rw [spec_ultrametricOp_eq, spec_kozyrevHaar_eq, spec_ultrametricWaveletEigenvalue_eq]
    exact Ultrametrica.kozyrevHaar_vladimirov_eigenfunction p n j c hp hj hc K a hsum x
  · intro p n hp K f x
    rw [spec_ultrametricOp_eq, spec_vecRev_eq]
    have hfun : Spec.ultrametricOp p n K f = Ultrametrica.ultrametricOp p n K f := by
      funext y; exact spec_ultrametricOp_eq p n K f y
    rw [hfun, spec_vecRev_eq]
    exact Ultrametrica.ultrametricOp_commutes_vecRev p n hp K f x
  · intro N H hcomm hneg
    have hcomm' : ∀ v, H (Ultrametrica.vecRev N v) = Ultrametrica.vecRev N (H v) := by
      intro v; simpa only [spec_vecRev_eq] using hcomm v
    have hcore := Ultrametrica.j_commuting_preserves_parity N H hcomm' hneg
    constructor
    · intro v hv
      rw [spec_vecRev_eq] at hv ⊢
      exact hcore.1 v hv
    · intro v hv
      rw [spec_vecRev_eq] at hv ⊢
      exact hcore.2 v hv

end Ultrametrica.ComparatorTarget

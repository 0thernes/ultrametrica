module

public import UltrametricaProofs.Spec
public import UltrametricaProofs

/-!
  ULTRAMETRICA (v1.8.0) — Exact `Spec ↔ Core` Equivalence Bridge (`SolutionBridge.lean`).

  Imported ONLY by `Solution.lean` (NEVER by statement-only `Challenge.lean`) to keep
  both `Solution.lean` and `SolutionBridge.lean` strictly modular and well below 1,000 lines.
  Zero Mathlib, zero `sorry`, zero `native_decide`, zero custom axioms.
-/

@[expose] public section

namespace Ultrametrica.SolutionBridge

theorem spec_revBaseAux_eq (p d v acc : Nat) :
    Spec.revBaseAux p d v acc = Ultrametrica.revBaseAux p d v acc := by
  induction d generalizing v acc with
  | zero => rfl
  | succ k ih => exact ih (v / p) (acc * p + v % p)

theorem spec_revBase_eq (p n x : Nat) :
    Spec.revBase p n x = Ultrametrica.revBase p n x :=
  spec_revBaseAux_eq p n x 0

def toCoreNbr : Spec.BTZNbrClass → Ultrametrica.BTZNbrClass
  | .opp   => .opp
  | .back  => .back
  | .child => .child

def fromCoreNbr : Ultrametrica.BTZNbrClass → Spec.BTZNbrClass
  | .opp   => .opp
  | .back  => .back
  | .child => .child

def toCoreFullNbr {p : Nat} : Spec.BTZNbr p → Ultrametrica.BTZNbr p
  | .opp     => .opp
  | .back    => .back
  | .child r => .child r

def fromCoreFullNbr {p : Nat} : Ultrametrica.BTZNbr p → Spec.BTZNbr p
  | .opp     => .opp
  | .back    => .back
  | .child r => .child r

theorem spec_btzGraphDist_eq_core (L : Int) (i j : Spec.BTZNbrClass) :
    Spec.btzGraphDist L i j = Ultrametrica.btzGraphDist L (toCoreNbr i) (toCoreNbr j) := by
  cases i <;> cases j <;> (
    simp only [Spec.btzGraphDist, Ultrametrica.btzGraphDist, toCoreNbr,
      Ultrametrica.btzAnchorU, Ultrametrica.btzAnchorV, Ultrametrica.btzRadialOffset,
      Spec.cycleDist, Ultrametrica.cycleDist]
    omega
  )

theorem spec_btzGraphDist_eq_classDist (L : Int) (hL : 3 ≤ L) (i j : Spec.BTZNbrClass) :
    Spec.btzGraphDist L i j = Ultrametrica.btzClassDist L (toCoreNbr i) (toCoreNbr j) := by
  rw [spec_btzGraphDist_eq_core]
  exact Ultrametrica.btz_graph_metric_eq_classDist L hL (toCoreNbr i) (toCoreNbr j)

theorem spec_btzTransportCost_eq (L : Int) (hL : 3 ≤ L)
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

theorem spec_finSum_eq (n : Nat) (f : Fin n → Int) :
    Spec.finSum n f = Ultrametrica.finSum n f := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.finSum, Ultrametrica.finSum]
    rw [ih (fun i => f i.castSucc)]

theorem spec_sumBTZNbr_eq (p : Nat) (f : Spec.BTZNbr p → Int) :
    Spec.sumBTZNbr p f = Ultrametrica.sumBTZNbr p (fun x => f (fromCoreFullNbr x)) := by
  unfold Spec.sumBTZNbr Ultrametrica.sumBTZNbr
  rw [spec_finSum_eq]
  rfl

theorem spec_fullBtzDist_eq (p : Nat) (L : Int) (x y : Spec.BTZNbr p) :
    Spec.fullBtzDist p L x y = Ultrametrica.fullBtzDist p L (toCoreFullNbr x) (toCoreFullNbr y) := by
  unfold Spec.fullBtzDist Ultrametrica.fullBtzDist
  cases x <;> cases y <;> exact spec_btzGraphDist_eq_core L _ _

theorem spec_fullBtzTransportCost_eq (p : Nat) (L : Int) (Q : Spec.BTZNbr p → Spec.BTZNbr p → Int) :
    Spec.fullBtzTransportCost p L Q =
      Ultrametrica.fullBtzTransportCost p L (fun x y => Q (fromCoreFullNbr x) (fromCoreFullNbr y)) := by
  unfold Spec.fullBtzTransportCost Ultrametrica.fullBtzTransportCost
  rw [spec_sumBTZNbr_eq]
  congr 1
  funext x
  rw [spec_sumBTZNbr_eq]
  congr 1
  funext y
  have hdx : toCoreFullNbr (fromCoreFullNbr x) = x := by cases x <;> rfl
  have hdy : toCoreFullNbr (fromCoreFullNbr y) = y := by cases y <;> rfl
  rw [spec_fullBtzDist_eq, hdx, hdy]

theorem spec_genBridgeTransportCost_eq (p : Nat) (ae : Int) (uA vA : Fin p → Int)
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

def toCoreCInt (z : Spec.CInt) : Ultrametrica.CInt := ⟨z.re, z.im⟩
def fromCoreCInt (z : Ultrametrica.CInt) : Spec.CInt := ⟨z.re, z.im⟩

theorem fromCore_toCore_CInt (z : Spec.CInt) : fromCoreCInt (toCoreCInt z) = z := by
  cases z; rfl

theorem toCore_fromCore_CInt (z : Ultrametrica.CInt) : toCoreCInt (fromCoreCInt z) = z := by
  cases z; rfl

def toCoreCVec {L : Nat} (v : Spec.CVec L) : Ultrametrica.CVec L := fun i => toCoreCInt (v i)
def fromCoreCVec {L : Nat} (v : Ultrametrica.CVec L) : Spec.CVec L := fun i => fromCoreCInt (v i)

theorem fromCore_toCore_CVec {L : Nat} (v : Spec.CVec L) : fromCoreCVec (toCoreCVec v) = v := by
  funext i; exact fromCore_toCore_CInt (v i)

theorem toCore_fromCore_CVec {L : Nat} (v : Ultrametrica.CVec L) : toCoreCVec (fromCoreCVec v) = v := by
  funext i; exact toCore_fromCore_CInt (v i)

theorem toCore_add (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.add a b) = Ultrametrica.CInt.add (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

theorem toCore_sub (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.sub a b) = Ultrametrica.CInt.sub (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

theorem toCore_mul (a b : Spec.CInt) :
    toCoreCInt (Spec.CInt.mul a b) = Ultrametrica.CInt.mul (toCoreCInt a) (toCoreCInt b) := by
  cases a; cases b; rfl

theorem toCore_smul (s : Int) (a : Spec.CInt) :
    toCoreCInt (Spec.CInt.smul s a) = Ultrametrica.CInt.smul s (toCoreCInt a) := by
  cases a; rfl

theorem toCore_conj (a : Spec.CInt) :
    toCoreCInt (Spec.CInt.conj a) = Ultrametrica.CInt.conj (toCoreCInt a) := by
  cases a; rfl

theorem toCore_normSq (a : Spec.CInt) :
    a.normSq = (toCoreCInt a).normSq := by
  cases a; rfl

theorem toCore_finSumCInt (n : Nat) (f : Fin n → Spec.CInt) :
    toCoreCInt (Spec.finSumCInt n f) = Ultrametrica.finSumCInt n (fun i => toCoreCInt (f i)) := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.finSumCInt, Ultrametrica.finSumCInt]
    rw [toCore_add, ih (fun i => f i.castSucc)]

theorem toCore_hermitianDot {L : Nat} (u v : Spec.CVec L) :
    toCoreCInt (Spec.hermitianDot u v) = Ultrametrica.hermitianDot (toCoreCVec u) (toCoreCVec v) := by
  unfold Spec.hermitianDot Ultrametrica.hermitianDot toCoreCVec
  rw [toCore_finSumCInt]
  have hfn : (fun i : Fin L => toCoreCInt (Spec.CInt.mul (Spec.CInt.conj (u i)) (v i))) =
      (fun i : Fin L => Ultrametrica.CInt.mul (Ultrametrica.CInt.conj (toCoreCInt (u i))) (toCoreCInt (v i))) := by
    funext i
    rw [toCore_mul, toCore_conj]
  rw [hfn]

theorem toCore_matVecMul (N : Nat) (A : Fin N → Fin N → Spec.CInt) (v : Spec.CVec N) :
    toCoreCVec (Spec.matVecMul N A v) =
      Ultrametrica.matVecMul N (fun i j => toCoreCInt (A i j)) (toCoreCVec v) := by
  funext i
  unfold toCoreCVec Spec.matVecMul Ultrametrica.matVecMul
  rw [toCore_finSumCInt]
  rfl

theorem toCore_diagOp {N : Nat} (d : Fin N → Int) (v : Spec.CVec N) :
    toCoreCVec (Spec.diagOp d v) = Ultrametrica.diagOp d (toCoreCVec v) := by
  funext i
  exact toCore_smul (d i) (v i)

theorem toCore_fourierConj (N : Nat) (hN : 0 < N) (v : Spec.CVec N) :
    toCoreCVec (Spec.fourierConj N hN v) = Ultrametrica.fourierConj N hN (toCoreCVec v) := by
  funext k
  exact toCore_conj _

theorem spec_InSector_iff (p n s m : Nat) (v : Spec.CVec (p ^ n)) :
    Spec.InSector p n s m v ↔ Ultrametrica.InSector p n s m (toCoreCVec v) := by
  constructor
  · intro h k hnot
    have hk := h k hnot
    unfold toCoreCVec
    rw [hk]; rfl
  · intro h k hnot
    have hk := h k hnot
    unfold toCoreCVec at hk
    have hback := congrArg fromCoreCInt hk
    rwa [fromCore_toCore_CInt] at hback

theorem spec_cint_add_zero_left (a : Spec.CInt) :
    Spec.CInt.add Spec.CInt.zero a = a := by
  cases a; unfold Spec.CInt.add Spec.CInt.zero; simp

theorem spec_cint_add_zero_right (a : Spec.CInt) :
    Spec.CInt.add a Spec.CInt.zero = a := by
  cases a; unfold Spec.CInt.add Spec.CInt.zero; simp

theorem spec_cint_smul_zero (s : Int) :
    Spec.CInt.smul s Spec.CInt.zero = Spec.CInt.zero := by
  unfold Spec.CInt.smul Spec.CInt.zero; simp

theorem spec_foldr_zero_of_all_zero {X : Type} (modes : List ((X → Spec.CInt) × Int)) (x : X)
    (hz : ∀ m ∈ modes, m.1 x = Spec.CInt.zero) :
    modes.foldr (fun m acc => Spec.CInt.add (m.1 x) acc) Spec.CInt.zero = Spec.CInt.zero := by
  induction modes with
  | nil => rfl
  | cons hd tl ih =>
    simp only [List.foldr_cons]
    have hhd : hd.1 x = Spec.CInt.zero := hz hd List.mem_cons_self
    have htl := ih (fun m hm => hz m (List.mem_cons_of_mem hd hm))
    rw [hhd, htl, spec_cint_add_zero_left]

theorem spec_foldr_smul_zero_of_all_zero {X : Type} (F : Int → Int)
    (modes : List ((X → Spec.CInt) × Int)) (x : X)
    (hz : ∀ m ∈ modes, m.1 x = Spec.CInt.zero) :
    modes.foldr (fun m acc => Spec.CInt.add (Spec.CInt.smul (F m.2) (m.1 x)) acc) Spec.CInt.zero =
      Spec.CInt.zero := by
  induction modes with
  | nil => rfl
  | cons hd tl ih =>
    simp only [List.foldr_cons]
    have hhd : hd.1 x = Spec.CInt.zero := hz hd List.mem_cons_self
    have htl := ih (fun m hm => hz m (List.mem_cons_of_mem hd hm))
    rw [hhd, spec_cint_smul_zero, htl, spec_cint_add_zero_left]

theorem spec_rtCutCap_eq (edges : List (Nat × Nat × Nat)) (S : Nat → Bool) :
    Spec.rtCutCap edges S = Ultrametrica.rtCutCap edges S := by
  induction edges with
  | nil => rfl
  | cons e rest ih =>
    rcases e with ⟨u, v, c⟩
    simp only [Spec.rtCutCap, Ultrametrica.rtCutCap, ih]

theorem spec_sumInt_eq (ws : List Int) :
    Spec.sumInt ws = Ultrametrica.sumInt ws := by
  induction ws with
  | nil => rfl
  | cons w rest ih => simp only [Spec.sumInt, Ultrametrica.sumInt, ih]

def toCoreRatQ (q : Spec.RatQ) : Ultrametrica.RatQ := ⟨q.num, q.den, q.den_pos⟩

theorem toCoreRatQ_add (a b : Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.add a b) = Ultrametrica.RatQ.add (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

theorem toCoreRatQ_sub (a b : Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.sub a b) = Ultrametrica.RatQ.sub (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

theorem toCoreRatQ_sumList (xs : List Spec.RatQ) :
    toCoreRatQ (Spec.RatQ.sumList xs) = Ultrametrica.RatQ.sumList (xs.map toCoreRatQ) := by
  induction xs with
  | nil => rfl
  | cons x rest ih =>
    simp only [Spec.RatQ.sumList, List.map_cons, Ultrametrica.RatQ.sumList, toCoreRatQ_add, ih]

theorem toCoreRatQ_eqv_iff (a b : Spec.RatQ) :
    Spec.RatQ.eqv a b ↔ Ultrametrica.RatQ.eqv (toCoreRatQ a) (toCoreRatQ b) := by
  cases a; cases b; rfl

def toCoreEdge {n : Nat} (e : Spec.WeightedEdge n) : Ultrametrica.WeightedEdge n :=
  ⟨e.u, e.v, e.w⟩

theorem spec_graphVertexWeight_eq {n : Nat} (edges : List (Spec.WeightedEdge n)) (x : Fin n) :
    Spec.graphVertexWeight edges x = Ultrametrica.graphVertexWeight (edges.map toCoreEdge) x := by
  unfold Spec.graphVertexWeight Ultrametrica.graphVertexWeight
  rw [spec_sumInt_eq, List.map_map]
  rfl

def toCoreGaugeEdge {n : Nat} (e : Spec.GaugeEdge n) : Ultrametrica.GaugeEdge n :=
  ⟨e.u, e.v, e.w, toCoreCInt e.ph⟩

theorem spec_gaugeLaplacianQuad_eq {n : Nat} (edges : List (Spec.GaugeEdge n)) (v : Spec.CVec n) :
    Spec.gaugeLaplacianQuad edges v =
      Ultrametrica.gaugeLaplacianQuad (edges.map toCoreGaugeEdge) (toCoreCVec v) := by
  induction edges with
  | nil => rfl
  | cons e rest ih =>
    simp only [Spec.gaugeLaplacianQuad, List.map_cons, Ultrametrica.gaugeLaplacianQuad, ih]
    rw [toCore_normSq, toCore_sub, toCore_mul]
    rfl

theorem spec_weightedNormSq_eq {n : Nat} (d : Fin n → Int) (v : Spec.CVec n) :
    Spec.weightedNormSq d v = Ultrametrica.weightedNormSq d (toCoreCVec v) := by
  unfold Spec.weightedNormSq Ultrametrica.weightedNormSq
  rw [spec_finSum_eq]
  apply Ultrametrica.finSum_congr
  intro x
  rw [toCore_normSq]
  rfl

theorem spec_bulkQuadForm_eq {n : Nat} (edges : List (Spec.GaugeEdge n)) (d : Fin n → Int) (v : Spec.CVec n) :
    Spec.bulkQuadForm edges d v =
      Ultrametrica.bulkQuadForm (edges.map toCoreGaugeEdge) d (toCoreCVec v) := by
  unfold Spec.bulkQuadForm Ultrametrica.bulkQuadForm
  rw [spec_gaugeLaplacianQuad_eq, spec_weightedNormSq_eq]

theorem spec_padicValAux_eq (p fuel d : Nat) :
    Spec.padicValAux p fuel d = Ultrametrica.padicValAux p fuel d := by
  induction fuel generalizing d with
  | zero => rfl
  | succ k ih =>
    simp only [Spec.padicValAux, Ultrametrica.padicValAux]
    split <;> simp [ih]

theorem spec_padicValMod_eq (p n d : Nat) :
    Spec.padicValMod p n d = Ultrametrica.padicValMod p n d :=
  spec_padicValAux_eq p n (d % p ^ n)

theorem spec_padicDistVal_eq (p n x y : Nat) :
    Spec.padicDistVal p n x y = Ultrametrica.padicDistVal p n x y :=
  spec_padicValMod_eq p n ((x + p ^ n - y) % p ^ n)

theorem spec_kozyrevHaar_eq (p n j c : Nat) (hp : 2 ≤ p) (a : Fin p → Int) :
    Spec.kozyrevHaar p n j c hp a = Ultrametrica.kozyrevHaar p n j c hp a := by
  funext x; rfl

theorem spec_ultrametricOp_eq (p n : Nat) (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)) :
    Spec.ultrametricOp p n K f x = Ultrametrica.ultrametricOp p n K f x := by
  unfold Spec.ultrametricOp Ultrametrica.ultrametricOp
  rw [spec_finSum_eq]
  apply Ultrametrica.finSum_congr
  intro y
  rw [spec_padicDistVal_eq]

theorem spec_ultrametricWaveletEigenvalue_eq (p n j : Nat) (K : Nat → Int) :
    Spec.ultrametricWaveletEigenvalue p n j K = Ultrametrica.ultrametricWaveletEigenvalue p n j K := by
  unfold Spec.ultrametricWaveletEigenvalue Ultrametrica.ultrametricWaveletEigenvalue
  rw [spec_finSum_eq]
  congr 1
  apply Ultrametrica.finSum_congr
  intro t
  rw [spec_padicValMod_eq]

theorem spec_vecRev_eq (N : Nat) (v : Fin N → Int) :
    Spec.vecRev N v = Ultrametrica.vecRev N v := by
  funext i; rfl

end Ultrametrica.SolutionBridge

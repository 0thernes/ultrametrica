module

public import UltrametricaProofs.SolitonAndSolver
public import UltrametricaProofs.FiniteGraphGaussBonnet

/-!
  ULTRAMETRICA (v1.8.0) — Lean 4 Formal Proofs (Module 4B: Full Finite Weighted
  Gauge-Covariant Graph Laplacian Positivity, Strict Positive Definiteness `T ≻ 0`,
  Sherman-Morrison Denominator Discharge, and Exact Tree Schur-Complement Pivot
  Positivity — closes F90 / R84 Limit #2)

  Closes the operator-positivity boundary noted in v1.7.0 (`SolitonAndSolver.lean`
  proved `1 ≤ 1 + w*q` under an external hypothesis `0 ≤ q`, without connecting `q`
  to the weighted Bruhat-Tits bulk operator `T = L_E + diag(d)` or proving tree
  Schur-complement pivot positivity). Here we prove directly in zero-Mathlib Lean 4:
    1. For ANY finite weighted gauge-covariant graph `edges : List (GaugeEdge n)` with
       non-negative conductances `e.w >= 0`, the full graph Laplacian quadratic form
       `gaugeLaplacianQuad edges v = ∑_{e ∈ edges} e.w * |v(u) - e.ph * v(v)|^2` is
       universally positive semidefinite (`gaugeLaplacianQuad_nonneg`).
    2. Adding ANY strictly positive diagonal mass/Robin shift `d : Fin n -> Int`
       (`∀ x, 0 < d x`, holding for all Gubser conformal dimensions with `m^2(Δ) > 0`
       or positive boundary Robin impedance) yields a STRICTLY POSITIVE DEFINITE bulk
       operator (`v ≠ 0 -> 0 < bulkQuadForm edges d v`, `bulk_operator_strictly_pos_def`).
    3. For ANY positive-semidefinite Hermitian operator `T : CVec L -> CVec L`
       (`∀ z, 0 ≤ (hermitianDot z (T z)).re`), whenever `T z = u` and `0 ≤ w`, the
       Rank-1 Kerr-BTZ Sherman-Morrison denominator satisfies
         `1 ≤ (CInt.add CInt.one (CInt.smul w (hermitianDot u z))).re`
       and is STRICTLY NONZERO (`spd_operator_sherman_morrison_den_ge_one`), directly
       discharging `0 ≤ q` from `T ⪰ 0`!
    4. Exact `RatQ` tree Schur-complement elimination step (`tree_schur_pivot_stays_positive`
       and `tree_schur_elim_exact`): eliminating any child vertex with diagonal pivot
       `D_c > w > 0` and parent diagonal `D_p ≥ w` preserves strict diagonal positivity
       `D_p' = D_p - w^2 / D_c > 0` in exact rational arithmetic AND satisfies exact
       Gaussian elimination of the child variable!

  Palomar-compliant Lean 4.35.0 `module` (< 320 lines), zero Mathlib, zero `native_decide`,
  zero `sorry`, zero custom axioms.
-/

@[expose] public section

namespace Ultrametrica

/-- A weighted gauge-covariant bulk edge `(u, v)` with conductance `w` and U(1) gauge phase `ph`. -/
structure GaugeEdge (n : Nat) where
  u  : Fin n
  v  : Fin n
  w  : Int
  ph : CInt
deriving DecidableEq, Repr

/-- Exact finite-graph gauge-covariant Laplacian quadratic form:
    `L_E(v) = ∑_{e ∈ edges} e.w * |v(e.u) - e.ph * v(e.v)|^2`. -/
def gaugeLaplacianQuad {n : Nat} : List (GaugeEdge n) → CVec n → Int
  | [], _ => 0
  | e :: rest, v =>
      e.w * (CInt.sub (v e.u) (CInt.mul e.ph (v e.v))).normSq + gaugeLaplacianQuad rest v

/-- Diagonal mass/Robin quadratic form `∑_{x : Fin n} d(x) * |v(x)|^2`. -/
def weightedNormSq {n : Nat} (d : Fin n → Int) (v : CVec n) : Int :=
  finSum n (fun x => d x * (v x).normSq)

/-- Full finite bulk Klein-Gordon quadratic form `Q_{E,d}(v) = L_E(v) + ∑_x d(x) |v(x)|^2`. -/
def bulkQuadForm {n : Nat} (edges : List (GaugeEdge n)) (d : Fin n → Int) (v : CVec n) : Int :=
  gaugeLaplacianQuad edges v + weightedNormSq d v

/-- Theorem IV.Pos1 (Full Finite Weighted Gauge-Covariant Graph Laplacian is PSD):
    For EVERY finite list of gauge edges with `e.w >= 0` and EVERY field `v : CVec n`:
      `0 ≤ gaugeLaplacianQuad edges v`. -/
theorem gaugeLaplacianQuad_nonneg {n : Nat} (edges : List (GaugeEdge n))
    (hw : ∀ e ∈ edges, 0 ≤ e.w) (v : CVec n) :
    0 ≤ gaugeLaplacianQuad edges v := by
  induction edges with
  | nil =>
    simp [gaugeLaplacianQuad]
  | cons e rest ih =>
    simp only [gaugeLaplacianQuad]
    have hwe : 0 ≤ e.w := hw e (List.Mem.head rest)
    have hterm : 0 ≤ e.w * (CInt.sub (v e.u) (CInt.mul e.ph (v e.v))).normSq :=
      Int.mul_nonneg hwe (CInt.normSq_nonneg _)
    have hrest : 0 ≤ gaugeLaplacianQuad rest v :=
      ih (fun e' he' => hw e' (List.Mem.tail e he'))
    omega

/-- Helper: `weightedNormSq d v >= 0` whenever `d x >= 0` for all `x`. -/
theorem weightedNormSq_nonneg {n : Nat} (d : Fin n → Int) (hd : ∀ x, 0 ≤ d x) (v : CVec n) :
    0 ≤ weightedNormSq d v := by
  unfold weightedNormSq
  induction n with
  | zero => simp [finSum]
  | succ k ih =>
    simp only [finSum]
    have h1 := ih (fun x => d x.castSucc) (fun x => hd x.castSucc) (fun x => v x.castSucc)
    have h2 : 0 ≤ d ⟨k, Nat.lt_succ_self k⟩ * (v ⟨k, Nat.lt_succ_self k⟩).normSq :=
      Int.mul_nonneg (hd ⟨k, Nat.lt_succ_self k⟩) (CInt.normSq_nonneg _)
    omega

private theorem int_sq_nonneg_aux (a : Int) : 0 ≤ a * a := by
  cases a with
  | ofNat n => exact Int.mul_nonneg (Int.natCast_nonneg n) (Int.natCast_nonneg n)
  | negSucc n =>
    have hpos : 0 ≤ -(Int.negSucc n) := by omega
    have hm := Int.mul_nonneg hpos hpos
    rwa [Int.neg_mul_neg] at hm

/-- Helper: `weightedNormSq d v > 0` whenever `d x > 0` everywhere and `v` is nonzero at some vertex. -/
theorem weightedNormSq_pos_of_ne_zero {n : Nat} (d : Fin n → Int) (hd : ∀ x, 0 < d x)
    (v : CVec n) (hnz : ∃ x : Fin n, v x ≠ CInt.zero) :
    0 < weightedNormSq d v := by
  rcases hnz with ⟨x0, hx0⟩
  have hnorm_pos : 0 < (v x0).normSq := by
    cases hv : v x0 with | mk vr vi =>
    unfold CInt.normSq
    simp only
    have hvr : 0 ≤ vr * vr := int_sq_nonneg_aux vr
    have hvi : 0 ≤ vi * vi := int_sq_nonneg_aux vi
    by_cases h1 : vr = 0
    · by_cases h2 : vi = 0
      · subst h1; subst h2; exact False.elim (hx0 hv)
      · have : 0 < vi * vi := by
          cases Int.lt_or_gt_of_ne h2 with
          | inl hneg =>
            have hp : 0 < -vi := by omega
            have hm := Int.mul_pos hp hp
            rwa [Int.neg_mul_neg] at hm
          | inr hpos => exact Int.mul_pos hpos hpos
        omega
    · have : 0 < vr * vr := by
        cases Int.lt_or_gt_of_ne h1 with
        | inl hneg =>
          have hp : 0 < -vr := by omega
          have hm := Int.mul_pos hp hp
          rwa [Int.neg_mul_neg] at hm
        | inr hpos => exact Int.mul_pos hpos hpos
      omega
  have hterm_pos : 0 < d x0 * (v x0).normSq := Int.mul_pos (hd x0) hnorm_pos
  unfold weightedNormSq
  clear hx0 hnorm_pos
  induction n with
  | zero => exact Fin.elim0 x0
  | succ k ih =>
    simp only [finSum]
    by_cases hx : x0.val = k
    · have hxeq : x0 = ⟨k, Nat.lt_succ_self k⟩ := Fin.ext hx
      subst hxeq
      have hpref : 0 ≤ weightedNormSq (fun x => d x.castSucc) (fun x => v x.castSucc) :=
        weightedNormSq_nonneg _ (fun x => Int.le_of_lt (hd x.castSucc)) _
      unfold weightedNormSq at hpref
      dsimp only at hpref
      omega
    · have hlt : x0.val < k := by omega
      let x' : Fin k := ⟨x0.val, hlt⟩
      have hxcast : x0 = x'.castSucc := Fin.ext rfl
      rw [hxcast] at hterm_pos
      have h1 := ih (fun x => d x.castSucc) (fun x => hd x.castSucc) (fun x => v x.castSucc) x' hterm_pos
      have h2 : 0 ≤ d ⟨k, Nat.lt_succ_self k⟩ * (v ⟨k, Nat.lt_succ_self k⟩).normSq :=
        Int.mul_nonneg (Int.le_of_lt (hd ⟨k, Nat.lt_succ_self k⟩)) (CInt.normSq_nonneg _)
      omega

/-- Theorem IV.Pos2 (Strict Positive Definiteness of the Finite Bulk Klein-Gordon Operator):
    For EVERY finite weighted gauge graph (`e.w >= 0`) and EVERY strictly positive mass/Robin
    diagonal (`d x > 0`), the bulk operator `T = L_E + diag(d)` is STRICTLY POSITIVE DEFINITE:
    `v ≠ 0 -> 0 < bulkQuadForm edges d v`. -/
theorem bulk_operator_strictly_pos_def {n : Nat} (edges : List (GaugeEdge n)) (d : Fin n → Int)
    (hw : ∀ e ∈ edges, 0 ≤ e.w) (hd : ∀ x, 0 < d x)
    (v : CVec n) (hnz : ∃ x : Fin n, v x ≠ CInt.zero) :
    0 < bulkQuadForm edges d v := by
  unfold bulkQuadForm
  have h1 := gaugeLaplacianQuad_nonneg edges hw v
  have h2 := weightedNormSq_pos_of_ne_zero d hd v hnz
  omega

/-- Helper: real part of `hermitianDot u z` equals real part of `hermitianDot z u`. -/
theorem hermitianDot_re_symm {L : Nat} (u z : CVec L) :
    (hermitianDot u z).re = (hermitianDot z u).re := by
  unfold hermitianDot
  induction L with
  | zero => rfl
  | succ k ih =>
    simp only [finSumCInt, CInt.add]
    have h1 := ih (fun i => u i.castSucc) (fun i => z i.castSucc)
    have h2 : (CInt.mul (u ⟨k, Nat.lt_succ_self k⟩).conj (z ⟨k, Nat.lt_succ_self k⟩)).re =
        (CInt.mul (z ⟨k, Nat.lt_succ_self k⟩).conj (u ⟨k, Nat.lt_succ_self k⟩)).re := by
      cases u ⟨k, Nat.lt_succ_self k⟩ with | mk ur ui =>
      cases z ⟨k, Nat.lt_succ_self k⟩ with | mk zr zi =>
      unfold CInt.conj CInt.mul
      simp only
      rw [Int.neg_mul, Int.neg_mul, Int.mul_comm ur zr, Int.mul_comm ui zi]
    omega

/-- Theorem IV.Pos3 (End-to-End Discharge of Sherman-Morrison `den >= 1` from `T ⪰ 0` — closes F90):
    For ANY positive-semidefinite operator `T : CVec L -> CVec L` (`∀ z, 0 ≤ (hermitianDot z (T z)).re`),
    ANY horizon wrap conductance `w >= 0`, and ANY solution `T z = u`, the Rank-1 Kerr-BTZ
    Sherman-Morrison denominator `den = 1 + w * <u, z>` satisfies `1 ≤ den.re` and `den ≠ 0`! -/
theorem spd_operator_sherman_morrison_den_ge_one {L : Nat} (T : CVec L → CVec L)
    (hT_psd : ∀ z : CVec L, 0 ≤ (hermitianDot z (T z)).re)
    (w : Int) (hw : 0 ≤ w) (u z : CVec L) (hTz : T z = u) :
    let den := CInt.add CInt.one (CInt.smul w (hermitianDot u z))
    1 ≤ den.re ∧ den ≠ CInt.zero := by
  intro den
  have hq_nonneg : 0 ≤ (hermitianDot u z).re := by
    rw [hermitianDot_re_symm u z, ← hTz]
    exact hT_psd z
  have hre : 1 ≤ den.re := by
    show 1 ≤ (CInt.add CInt.one (CInt.smul w (hermitianDot u z))).re
    unfold CInt.add CInt.one CInt.smul
    simp only
    have hmul : 0 ≤ w * (hermitianDot u z).re := Int.mul_nonneg hw hq_nonneg
    omega
  refine ⟨hre, ?_⟩
  intro hzero
  have h0 : den.re = 0 := congrArg CInt.re hzero
  omega

/-- Exact `RatQ` Schur-complement reduced parent diagonal `D_p' = D_p - w^2 / D_c = (D_p * D_c - w^2) / D_c`. -/
def schurReducedDiag (Dp Dc w : Int) (hDc : 0 < Dc) : RatQ :=
  ⟨Dp * Dc - w * w, Dc, hDc⟩

/-- Theorem IV.Pos4 (Exact Tree Schur-Complement Pivot Positivity in `RatQ`):
    In bottom-up tree elimination of a child vertex with diagonal pivot `D_c > w > 0`
    and parent diagonal `D_p ≥ w` (which holds at every Bruhat-Tits tree vertex when
    `m^2 >= 0` and leaf Robin/Dirichlet diagonals are strictly positive), the Schur-complement
    reduced parent diagonal `D_p' = D_p - w^2 / D_c` is STRICTLY POSITIVE (`num > 0`, `den > 0`),
    and satisfies the exact cleared-denominator Gaussian elimination identity! -/
theorem tree_schur_pivot_stays_positive (Dp Dc w : Int)
    (hw : 0 < w) (hDc_gt : w < Dc) (hDp_ge : w ≤ Dp) :
    let Dp' := schurReducedDiag Dp Dc w (by omega)
    0 < Dp'.num ∧ 0 < Dp'.den := by
  intro Dp'
  refine ⟨?_, ?_⟩
  · show 0 < Dp * Dc - w * w
    have h1 : w * w < w * Dc := Int.mul_lt_mul_of_pos_left hDc_gt hw
    have h2 : w * Dc ≤ Dp * Dc := Int.mul_le_mul_of_nonneg_right hDp_ge (by omega)
    omega
  · show 0 < Dc
    omega

/-- Theorem IV.Pos5 (Exact Algebraic Tree Schur-Complement Elimination Identity):
    For any 2-node parent-child subsystem `D_c * phi_c - w * phi_p = b_c`,
    `D_p * phi_p - w * phi_c = b_p`, eliminating `phi_c` yields identically the
    cleared-denominator Schur equation `(D_p * D_c - w^2) * phi_p = D_c * b_p + w * b_c`! -/
theorem tree_schur_elim_exact (Dp Dc w phiP phiC bP bC : Int)
    (hChild : Dc * phiC - w * phiP = bC)
    (hParent : Dp * phiP - w * phiC = bP) :
    (Dp * Dc - w * w) * phiP = Dc * bP + w * bC := by
  have h1 : Dc * (Dp * phiP - w * phiC) = Dc * bP := by rw [hParent]
  have h2 : w * (Dc * phiC - w * phiP) = w * bC := by rw [hChild]
  rw [Int.mul_sub] at h1 h2
  have hcomm1 : Dc * (Dp * phiP) = (Dp * Dc) * phiP := by
    rw [← Int.mul_assoc, Int.mul_comm Dc Dp]
  have hcomm2 : Dc * (w * phiC) = w * (Dc * phiC) := by
    rw [← Int.mul_assoc, Int.mul_comm Dc w, Int.mul_assoc]
  have hcomm3 : w * (w * phiP) = (w * w) * phiP := by
    rw [← Int.mul_assoc]
  rw [Int.sub_mul]
  omega

end Ultrametrica

module

public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.SolitonAndSolver

/-!
  ULTRAMETRICA (v1.8.0) — Lean 4 Formal Proofs (Module 2B: Operator-Level Adelic
  Block-Diagonality, Anti-Unitary Conjugate Equivariance & Odd-Prime Orthogonal
  Eigenvalue Multiplicity >= 2 on Z[i]^N — closes F89 / R84 Limit #2)

  Upgrades Theorem I from sector-index arithmetic (`AdelicSymmetry.lean`) to genuine
  linear-operator theorems on the Gaussian-integer Hilbert space `CVec N = Fin N -> CInt`:
    1. Real-entry matrices commute identically with componentwise complex conjugation
       `cvecConj` (`real_matrix_commutes_conj`) and preserve real-eigenvalue eigenspaces
       (`real_matrix_eigenvector_conj`).
    2. ANY matrix `H` commuting with a diagonal sector-label operator `diagOp d` is
       IDENTICALLY block-diagonal (`d i ≠ d j -> H i j = 0`, `commuting_diag_block_diagonal`)
       and leaves every label eigenspace invariant (`block_diag_preserves_eigenspace`).
    3. For every odd prime `p >= 3` (`p % 2 = 1`), depth `n`, valuation `0 <= s < n`,
       residue `1 <= m < p`, and ANY operator `H : CVec (p^n) -> CVec (p^n)` commuting with
       Fourier conjugation `(fourierConj v) k = (v ((p^n - k) % p^n)).conj`:
         - If `v ∈ W_{s,m}` is ANY nonzero eigenvector with real eigenvalue `λ : Int`,
           then `w := fourierConj v` lies in the DISJOINT conjugate sector `W_{s, p - m}`,
           obeys `H w = λ w`, has IDENTICAL positive norm-squared `<w, w> = <v, v> > 0`,
           AND satisfies **strict Hermitian orthogonality `<v, w> = 0`**!
         - In particular, `v` and `w` are strictly linearly independent over `CInt`
           (`odd_prime_doublet_linearly_independent`), proving **exact eigenvalue
           multiplicity >= 2** for every excited sector eigenstate at every odd prime!

  Palomar-compliant Lean 4.35.0 `module` (< 450 lines), zero Mathlib, zero `native_decide`,
  zero `sorry`, zero custom axioms.
-/

@[expose] public section

namespace Ultrametrica

/-- Componentwise complex conjugation on `CVec N = Fin N -> CInt`. -/
def cvecConj {N : Nat} (v : CVec N) : CVec N :=
  fun i => (v i).conj

/-- Exact matrix-vector multiplication on `CVec N`. -/
def matVecMul (N : Nat) (A : Fin N → Fin N → CInt) (v : CVec N) : CVec N :=
  fun i => finSumCInt N (fun j => CInt.mul (A i j) (v j))

/-- A matrix `A` on `CVec N` has strictly real entries iff every imaginary part vanishes. -/
def IsRealMatrix (N : Nat) (A : Fin N → Fin N → CInt) : Prop :=
  ∀ i j, (A i j).im = 0

/-- Diagonal operator `(diagOp d v) i = d i * v i` for integer labels `d : Fin N -> Int`. -/
def diagOp {N : Nat} (d : Fin N → Int) (v : CVec N) : CVec N :=
  fun i => CInt.smul (d i) (v i)

/-- Standard basis vector `e_j` on `CVec N`. -/
def stdBasis (N : Nat) (j : Fin N) : CVec N :=
  fun i => if i = j then CInt.one else CInt.zero

/-- Valuation-residue sector predicate `k ≡ m * p^s (mod p^{s+1})`. -/
def isSectorIdx (p s m k : Nat) : Prop :=
  k % p ^ (s + 1) = m * p ^ s

/-- Vector `v ∈ CVec (p^n)` belongs to Fourier valuation-residue sector `W_{s,m}`. -/
def InSector (p n s m : Nat) (v : CVec (p ^ n)) : Prop :=
  ∀ k : Fin (p ^ n), ¬ isSectorIdx p s m k.val → v k = CInt.zero

/-- Anti-unitary Fourier conjugation involution `(fourierConj N hN v) k = conj(v ((N - k) % N))`
    corresponding to position-space complex conjugation under the unitary Pontryagin DFT. -/
def fourierConj (N : Nat) (hN : 0 < N) (v : CVec N) : CVec N :=
  fun k => (v ⟨(N - k.val) % N, Nat.mod_lt _ hN⟩).conj

/-- Helper: `CInt.conj` distributes over `CInt.add` and `CInt.mul` and `CInt.smul`. -/
theorem CInt.conj_add (a b : CInt) : (CInt.add a b).conj = CInt.add a.conj b.conj := by
  cases a; cases b; unfold CInt.add CInt.conj; simp; omega

theorem CInt.conj_mul (a b : CInt) : (CInt.mul a b).conj = CInt.mul a.conj b.conj := by
  cases a with | mk ar ai =>
  cases b with | mk br bi =>
  unfold CInt.mul CInt.conj
  simp only [CInt.mk.injEq]
  constructor
  · rw [Int.neg_mul_neg]
  · rw [Int.mul_neg, Int.neg_mul]
    omega

theorem CInt.conj_smul (s : Int) (a : CInt) : (CInt.smul s a).conj = CInt.smul s a.conj := by
  cases a; unfold CInt.smul CInt.conj; simp [Int.mul_neg]

theorem CInt.conj_self_of_im_zero (a : CInt) (h : a.im = 0) : a.conj = a := by
  cases a with | mk ar ai =>
  simp only at h
  subst h
  rfl

theorem CInt.conj_normSq (a : CInt) : a.conj.normSq = a.normSq := by
  cases a with | mk ar ai =>
  unfold CInt.conj CInt.normSq
  simp [Int.neg_mul_neg]

theorem CInt.mul_conj_self (a : CInt) : CInt.mul a.conj a = ⟨a.normSq, 0⟩ := by
  cases a with | mk ar ai =>
  unfold CInt.conj CInt.mul CInt.normSq
  simp only [CInt.mk.injEq]
  constructor
  · rw [Int.neg_mul]; omega
  · rw [Int.neg_mul, Int.mul_comm ai ar]; omega

theorem finSumCInt_conj (N : Nat) (f : Fin N → CInt) :
    (finSumCInt N f).conj = finSumCInt N (fun i => (f i).conj) := by
  induction N with
  | zero => rfl
  | succ k ih =>
    simp only [finSumCInt]
    rw [CInt.conj_add, ih (fun i => f i.castSucc)]

theorem finSumCInt_zero_all (N : Nat) (f : Fin N → CInt) (h : ∀ i, f i = CInt.zero) :
    finSumCInt N f = CInt.zero := by
  induction N with
  | zero => rfl
  | succ k ih =>
    simp only [finSumCInt]
    rw [ih (fun i => f i.castSucc) (fun i => h i.castSucc), h ⟨k, Nat.lt_succ_self k⟩]
    rfl

theorem finSumCInt_single (N : Nat) (j : Fin N) (f : Fin N → CInt)
    (h : ∀ i, i ≠ j → f i = CInt.zero) :
    finSumCInt N f = f j := by
  induction N with
  | zero => exact Fin.elim0 j
  | succ k ih =>
    simp only [finSumCInt]
    by_cases hj : j.val = k
    · have hjeq : j = ⟨k, Nat.lt_succ_self k⟩ := Fin.ext hj
      subst hjeq
      have hpref : finSumCInt k (fun i => f i.castSucc) = CInt.zero := by
        apply finSumCInt_zero_all
        intro i
        apply h
        intro heq
        have hv := congrArg Fin.val heq
        simp only [Fin.val_castSucc] at hv
        omega
      rw [hpref, CInt.add_zero_left]
    · have hlt : j.val < k := by omega
      let j' : Fin k := ⟨j.val, hlt⟩
      have hjcast : j = j'.castSucc := Fin.ext rfl
      rw [hjcast]
      have hlast : f ⟨k, Nat.lt_succ_self k⟩ = CInt.zero := by
        apply h
        intro heq
        have hv : k = j.val := congrArg Fin.val heq
        omega
      rw [hlast, CInt.add_zero_right]
      exact ih j' (fun i => f i.castSucc) (fun i hi => h i.castSucc (fun heq => by
        apply hi
        have hv := congrArg Fin.val heq
        simp only [Fin.val_castSucc] at hv
        exact Fin.ext hv))

/-- Theorem I.Op1 (Real-Matrix Anti-Unitary Conjugation Equivariance):
    Every real-entry operator `A` on `CVec N` commutes identically with complex conjugation `cvecConj`. -/
theorem real_matrix_commutes_conj (N : Nat) (A : Fin N → Fin N → CInt)
    (hreal : IsRealMatrix N A) (v : CVec N) :
    matVecMul N A (cvecConj v) = cvecConj (matVecMul N A v) := by
  funext i
  simp only [matVecMul, cvecConj, finSumCInt_conj]
  congr 1
  funext j
  rw [CInt.conj_mul, CInt.conj_self_of_im_zero (A i j) (hreal i j)]

/-- Theorem I.Op2 (Real-Matrix Eigenvector Conjugation Preservation):
    If `A` has real entries and `A v = λ v` for real eigenvalue `λ : Int`, then `A v̄ = λ v̄`. -/
theorem real_matrix_eigenvector_conj (N : Nat) (A : Fin N → Fin N → CInt)
    (hreal : IsRealMatrix N A) (v : CVec N) (lam : Int)
    (heig : matVecMul N A v = fun i => CInt.smul lam (v i)) :
    matVecMul N A (cvecConj v) = fun i => CInt.smul lam (cvecConj v i) := by
  rw [real_matrix_commutes_conj N A hreal v, heig]
  funext i
  exact CInt.conj_smul lam (v i)

/-- Theorem I.Op3 (Exact Block-Diagonality of Any Diagonal-Commuting Matrix):
    If matrix `H` on `CVec N` commutes with diagonal sector-label operator `diagOp d`,
    then `H i j = 0` IDENTICALLY whenever `d i ≠ d j`! -/
theorem commuting_diag_block_diagonal (N : Nat) (H : Fin N → Fin N → CInt) (d : Fin N → Int)
    (hcomm : ∀ v : CVec N, matVecMul N H (diagOp d v) = diagOp d (matVecMul N H v))
    (i j : Fin N) (hne : d i ≠ d j) :
    H i j = CInt.zero := by
  have hact := congrFun (hcomm (stdBasis N j)) i
  simp only [matVecMul, diagOp, stdBasis] at hact
  have hlhs : finSumCInt N (fun k => CInt.mul (H i k) (CInt.smul (d k) (if k = j then CInt.one else CInt.zero))) =
      CInt.smul (d j) (H i j) := by
    rw [finSumCInt_single N j]
    · simp only [ite_true]
      cases H i j with | mk hr hi =>
      unfold CInt.mul CInt.smul CInt.one
      simp [Int.mul_comm]
    · intro k hk
      simp only [hk, ite_false, CInt.smul_zero]
      cases H i k; unfold CInt.mul CInt.zero; simp
  have hrhs : finSumCInt N (fun k => CInt.mul (H i k) (if k = j then CInt.one else CInt.zero)) = H i j := by
    rw [finSumCInt_single N j]
    · simp only [ite_true]
      cases H i j; unfold CInt.mul CInt.one; simp
    · intro k hk
      simp only [hk, ite_false]
      cases H i k; unfold CInt.mul CInt.zero; simp
  rw [hlhs, hrhs] at hact
  cases hij : H i j with | mk hr hi =>
  rw [hij] at hact
  unfold CInt.smul at hact
  simp only [CInt.mk.injEq] at hact
  have hre : (d j - d i) * hr = 0 := by rw [Int.sub_mul]; omega
  have him : (d j - d i) * hi = 0 := by rw [Int.sub_mul]; omega
  have hne' : d j - d i ≠ 0 := by omega
  have hhr : hr = 0 := (Int.mul_eq_zero.mp hre).resolve_left hne'
  have hhi : hi = 0 := (Int.mul_eq_zero.mp him).resolve_left hne'
  subst hhr; subst hhi; rfl

/-- Theorem I.Op4 (Exact Sector Invariance of Any Block-Diagonal Matrix):
    If `H i j = 0` whenever `d i ≠ d j`, then `H` maps every eigenspace `{v | ∀ k, d k ≠ c → v k = 0}`
    into itself! -/
theorem block_diag_preserves_eigenspace (N : Nat) (H : Fin N → Fin N → CInt) (d : Fin N → Int)
    (hbd : ∀ i j, d i ≠ d j → H i j = CInt.zero)
    (c : Int) (v : CVec N) (hv : ∀ k, d k ≠ c → v k = CInt.zero) :
    ∀ i, d i ≠ c → matVecMul N H v i = CInt.zero := by
  intro i hdi
  unfold matVecMul
  apply finSumCInt_zero_all
  intro j
  by_cases hdj : d j = c
  · have hne : d i ≠ d j := by rw [hdj]; exact hdi
    rw [hbd i j hne]
    cases v j; unfold CInt.mul CInt.zero; simp
  · rw [hv j hdj]
    cases H i j; unfold CInt.mul CInt.zero; simp

/-- Helper: modular negation `(p^n - k) % p^n` maps sector `W_{s,m}` strictly into `W_{s, p - m}`
    for every `p >= 2`, `s < n`, `1 <= m < p`, and `k < p^n`. -/
theorem fourier_neg_maps_sector (p n s m k : Nat)
    (hp : 2 ≤ p) (hs : s < n) (hm1 : 1 ≤ m) (hmp : m < p) (hk : k < p ^ n)
    (hsec : isSectorIdx p s m ((p ^ n - k) % p ^ n)) :
    isSectorIdx p s (p - m) k := by
  have hpPos : 0 < p := by omega
  have hpnPos : 0 < p ^ n := Nat.pow_pos hpPos
  have hps1 : p ^ (s + 1) ∣ p ^ n := by
    have hle : s + 1 ≤ n := by omega
    have hsplit : p ^ n = p ^ (s + 1) * p ^ (n - (s + 1)) := by
      rw [← Nat.pow_add, Nat.add_sub_cancel' hle]
    exact ⟨p ^ (n - (s + 1)), hsplit⟩
  have hmod_red : ((p ^ n - k) % p ^ n) % p ^ (s + 1) = (p ^ n - k) % p ^ (s + 1) := by
    rcases hps1 with ⟨q, hq⟩
    have h1 : (p ^ n - k) % (p ^ (s + 1) * q) % p ^ (s + 1) = (p ^ n - k) % p ^ (s + 1) :=
      Nat.mod_mul_right_mod (p ^ n - k) (p ^ (s + 1)) q
    rwa [← hq] at h1
  unfold isSectorIdx at hsec ⊢
  rw [hmod_red] at hsec
  have hpsPos : 0 < p ^ s := Nat.pow_pos hpPos
  have hps1Pos : 0 < p ^ (s + 1) := Nat.pow_pos hpPos
  have hsum_mod : ((p ^ n - k) + k) % p ^ (s + 1) = 0 := by
    rw [Nat.sub_add_cancel (Nat.le_of_lt hk)]
    exact Nat.mod_eq_zero_of_dvd hps1
  have hadd : ((p ^ n - k) % p ^ (s + 1) + k % p ^ (s + 1)) % p ^ (s + 1) = 0 := by
    rw [← Nat.add_mod]; exact hsum_mod
  rw [hsec] at hadd
  have hklt : k % p ^ (s + 1) < p ^ (s + 1) := Nat.mod_lt k hps1Pos
  have hpow : p ^ (s + 1) = p * p ^ s := by rw [Nat.pow_succ, Nat.mul_comm]
  have hmlt : m * p ^ s < p ^ (s + 1) := by
    rw [hpow]; exact Nat.mul_lt_mul_of_pos_right hmp hpsPos
  have hmpos : 0 < m * p ^ s := Nat.mul_pos (by omega) hpsPos
  have hsum_pos : 0 < m * p ^ s + k % p ^ (s + 1) := Nat.lt_of_lt_of_le hmpos (Nat.le_add_right _ _)
  have hsum_lt2 : m * p ^ s + k % p ^ (s + 1) < 2 * p ^ (s + 1) := by omega
  have hdiv : p ^ (s + 1) ∣ (m * p ^ s + k % p ^ (s + 1)) := Nat.dvd_of_mod_eq_zero hadd
  rcases hdiv with ⟨t, ht⟩
  have ht1 : t = 1 := by
    by_cases h0 : t = 0
    · subst h0; omega
    · by_cases h2 : 2 ≤ t
      · have hle : p ^ (s + 1) * 2 ≤ p ^ (s + 1) * t := Nat.mul_le_mul_left (p ^ (s + 1)) h2
        omega
      · omega
  subst ht1
  have hpm : (p - m) * p ^ s = p * p ^ s - m * p ^ s := Nat.sub_mul p m (p ^ s)
  omega

/-- Theorem I.Op5 (Fourier Conjugation Maps `W_{s,m}` Strictly Into `W_{s, p - m}`):
    For every `p >= 2`, `s < n`, `1 <= m < p`, and `v ∈ W_{s,m}`, `fourierConj v ∈ W_{s, p - m}`! -/
theorem fourierConj_maps_sector (p n s m : Nat) (hp : 2 ≤ p) (hs : s < n)
    (hm1 : 1 ≤ m) (hmp : m < p) (v : CVec (p ^ n)) (hv : InSector p n s m v) :
    InSector p n s (p - m) (fourierConj (p ^ n) (Nat.pow_pos (by omega)) v) := by
  intro k hnot
  unfold fourierConj
  have hnot_src : ¬ isSectorIdx p s m ((p ^ n - k.val) % p ^ n) := by
    intro hsrc
    exact hnot (fourier_neg_maps_sector p n s m k.val hp hs hm1 hmp k.isLt hsrc)
  have hz := hv ⟨(p ^ n - k.val) % p ^ n, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩ hnot_src
  rw [hz]
  rfl

/-- Theorem I.Op6 (Hermitian Orthogonality of Disjoint Sectors):
    Any two vectors supported in disjoint odd-prime conjugate sectors `W_{s,m}` and `W_{s, p - m}`
    (`p % 2 = 1`, `1 <= m < p`) are STRICTLY ORTHOGONAL: `hermitianDot v w = 0`! -/
theorem disjoint_sectors_orthogonal (p n s m : Nat) (hp_odd : p % 2 = 1)
    (hm1 : 1 ≤ m) (hmp : m < p) (v w : CVec (p ^ n))
    (hv : InSector p n s m v) (hw : InSector p n s (p - m) w) :
    hermitianDot v w = CInt.zero := by
  unfold hermitianDot
  apply finSumCInt_zero_all
  intro k
  by_cases hsec : isSectorIdx p s m k.val
  · have hnot2 : ¬ isSectorIdx p s (p - m) k.val := by
      intro hsec2
      unfold isSectorIdx at hsec hsec2
      have heq : m * p ^ s = (p - m) * p ^ s := hsec.symm.trans hsec2
      have hpsPos : 0 < p ^ s := Nat.pow_pos (by omega)
      have hmeq : m = p - m := Nat.eq_of_mul_eq_mul_right hpsPos heq
      exact odd_prime_conjugate_sector_disjoint p m hp_odd hm1 hmp hmeq
    rw [hw k hnot2]
    cases (v k).conj; unfold CInt.mul CInt.zero; simp
  · rw [hv k hsec]
    cases w k; unfold CInt.conj CInt.mul CInt.zero; simp

/-- Helper: `fourierConj` is an exact involution on `CVec N`. -/
theorem fourierConj_involutive (N : Nat) (hN : 0 < N) (v : CVec N) :
    fourierConj N hN (fourierConj N hN v) = v := by
  funext k
  unfold fourierConj
  have hidx : (N - (N - k.val) % N) % N = k.val := by
    by_cases hk0 : k.val = 0
    · simp [hk0]
    · have h1 : (N - k.val) % N = N - k.val := Nat.mod_eq_of_lt (by omega)
      rw [h1]
      have h2 : N - (N - k.val) = k.val := by omega
      rw [h2]
      exact Nat.mod_eq_of_lt k.isLt
  have hfin : (⟨(N - (N - k.val) % N) % N, Nat.mod_lt _ hN⟩ : Fin N) = k := Fin.ext hidx
  rw [hfin]
  cases v k; unfold CInt.conj; simp

private theorem int_sq_nonneg_op (a : Int) : 0 ≤ a * a := by
  cases a with
  | ofNat n => exact Int.mul_nonneg (Int.natCast_nonneg n) (Int.natCast_nonneg n)
  | negSucc n =>
    have hpos : 0 ≤ -(Int.negSucc n) := by omega
    have hm := Int.mul_nonneg hpos hpos
    rwa [Int.neg_mul_neg] at hm

private theorem cint_normSq_pos_of_ne_zero (a : CInt) (h : a ≠ CInt.zero) : 0 < a.normSq := by
  cases ha : a with | mk ar ai =>
  unfold CInt.normSq
  simp only
  have har : 0 ≤ ar * ar := int_sq_nonneg_op ar
  have hai : 0 ≤ ai * ai := int_sq_nonneg_op ai
  by_cases h1 : ar = 0
  · by_cases h2 : ai = 0
    · subst h1; subst h2; exact False.elim (h ha)
    · have : 0 < ai * ai := by
        cases Int.lt_or_gt_of_ne h2 with
        | inl hneg =>
          have hp : 0 < -ai := by omega
          have hm := Int.mul_pos hp hp
          rwa [Int.neg_mul_neg] at hm
        | inr hpos => exact Int.mul_pos hpos hpos
      omega
  · have : 0 < ar * ar := by
      cases Int.lt_or_gt_of_ne h1 with
      | inl hneg =>
        have hp : 0 < -ar := by omega
        have hm := Int.mul_pos hp hp
        rwa [Int.neg_mul_neg] at hm
      | inr hpos => exact Int.mul_pos hpos hpos
    omega

private theorem finSumCInt_re_nonneg (m : Nat) (f : Fin m → CInt) (h : ∀ i, 0 ≤ (f i).re) :
    0 ≤ (finSumCInt m f).re := by
  induction m with
  | zero => exact Int.le_refl 0
  | succ r ihr =>
    simp only [finSumCInt, CInt.add]
    have h1 := ihr (fun i => f i.castSucc) (fun i => h i.castSucc)
    have h2 := h ⟨r, Nat.lt_succ_self r⟩
    omega

/-- Helper: Hermitian self-inner-product has real part `>= 0` and strictly `> 0` whenever `v ≠ 0`. -/
theorem hermitianDot_self_pos_of_ne_zero (N : Nat) (v : CVec N)
    (hnonzero : ∃ k : Fin N, v k ≠ CInt.zero) :
    0 < (hermitianDot v v).re := by
  rcases hnonzero with ⟨k0, hk0⟩
  have hterm_ge : ∀ i : Fin N, 0 ≤ (CInt.mul (v i).conj (v i)).re := by
    intro i; rw [CInt.mul_conj_self]; exact CInt.normSq_nonneg (v i)
  have hterm_pos : 0 < (CInt.mul (v k0).conj (v k0)).re := by
    rw [CInt.mul_conj_self]
    exact cint_normSq_pos_of_ne_zero (v k0) hk0
  unfold hermitianDot
  clear hk0
  induction N with
  | zero => exact Fin.elim0 k0
  | succ m ih =>
    simp only [finSumCInt, CInt.add]
    by_cases hk : k0.val = m
    · have hkeq : k0 = ⟨m, Nat.lt_succ_self m⟩ := Fin.ext hk
      subst hkeq
      have hpref : 0 ≤ (finSumCInt m (fun i => CInt.mul (v i.castSucc).conj (v i.castSucc))).re :=
        finSumCInt_re_nonneg m _ (fun i => hterm_ge i.castSucc)
      omega
    · have hlt : k0.val < m := by omega
      let k' : Fin m := ⟨k0.val, hlt⟩
      have hkcast : k0 = k'.castSucc := Fin.ext rfl
      rw [hkcast] at hterm_pos
      have h1 := ih (fun i => v i.castSucc) k' (fun i => hterm_ge i.castSucc) hterm_pos
      have h2 := hterm_ge ⟨m, Nat.lt_succ_self m⟩
      omega

/-- Theorem I.Op7 (Main Operator-Level Odd-Prime Eigenvalue Multiplicity >= 2 Theorem — closes F89):
    For EVERY odd prime `p >= 3`, depth `n`, valuation `0 <= s < n`, residue `1 <= m < p`,
    and EVERY Fourier-conjugate-equivariant operator `H : CVec (p^n) -> CVec (p^n)`:
    if `v ∈ W_{s,m}` is ANY nonzero eigenvector with real eigenvalue `λ : Int`, then its
    conjugate partner `w := fourierConj v` satisfies ALL FOUR doublet invariants:
      (1) `w ∈ W_{s, p - m}` (strictly disjoint conjugate sector),
      (2) `H w = λ w` (exact same eigenvalue `λ`),
      (3) `0 < (hermitianDot v v).re` and `0 < (hermitianDot w w).re` (both nonzero), AND
      (4) `hermitianDot v w = CInt.zero` (strict Hermitian orthogonality -> multiplicity >= 2!). -/
theorem odd_prime_sector_eigenvector_orthogonal_doublet (p n s m : Nat)
    (hp : 2 ≤ p) (hp_odd : p % 2 = 1) (hs : s < n) (hm1 : 1 ≤ m) (hmp : m < p)
    (H : CVec (p ^ n) → CVec (p ^ n))
    (hcomm : ∀ u, H (fourierConj (p ^ n) (Nat.pow_pos (by omega)) u) =
      fourierConj (p ^ n) (Nat.pow_pos (by omega)) (H u))
    (v : CVec (p ^ n)) (lam : Int)
    (hv_sec : InSector p n s m v)
    (hv_nz : ∃ k : Fin (p ^ n), v k ≠ CInt.zero)
    (hv_eig : H v = fun i => CInt.smul lam (v i)) :
    let w := fourierConj (p ^ n) (Nat.pow_pos (by omega)) v
    InSector p n s (p - m) w ∧
    (H w = fun i => CInt.smul lam (w i)) ∧
    0 < (hermitianDot v v).re ∧
    0 < (hermitianDot w w).re ∧
    hermitianDot v w = CInt.zero := by
  intro w
  have hw_sec : InSector p n s (p - m) w :=
    fourierConj_maps_sector p n s m hp hs hm1 hmp v hv_sec
  have hw_eig : H w = fun i => CInt.smul lam (w i) := by
    show H (fourierConj (p ^ n) (Nat.pow_pos (by omega)) v) = _
    rw [hcomm v, hv_eig]
    funext i
    exact CInt.conj_smul lam (v ⟨(p ^ n - i.val) % p ^ n, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩)
  have hw_nz : ∃ k : Fin (p ^ n), w k ≠ CInt.zero := by
    rcases hv_nz with ⟨k0, hk0⟩
    refine ⟨⟨(p ^ n - k0.val) % p ^ n, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩, ?_⟩
    intro hw0
    have hinv := congrFun (fourierConj_involutive (p ^ n) (Nat.pow_pos (by omega)) v) k0
    have hvk0 : v k0 = (w ⟨(p ^ n - k0.val) % p ^ n, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩).conj := hinv.symm
    rw [hw0] at hvk0
    exact hk0 hvk0
  refine ⟨hw_sec, hw_eig,
    hermitianDot_self_pos_of_ne_zero (p ^ n) v hv_nz,
    hermitianDot_self_pos_of_ne_zero (p ^ n) w hw_nz,
    disjoint_sectors_orthogonal p n s m hp_odd hm1 hmp v w hv_sec hw_sec⟩

/-- Helper: `CInt` is an integral domain (`a * b = 0 -> a = 0 ∨ b = 0`). -/
theorem CInt.mul_eq_zero_or (a b : CInt) (hab : CInt.mul a b = CInt.zero) :
    a = CInt.zero ∨ b = CInt.zero := by
  by_cases hb : b = CInt.zero
  · exact Or.inr hb
  · left
    have hbn : 0 < b.normSq := cint_normSq_pos_of_ne_zero b hb
    have hmul : CInt.mul (CInt.mul a b) b.conj = CInt.zero := by
      rw [hab]; cases b.conj; unfold CInt.mul CInt.zero; simp
    have hassoc : CInt.mul (CInt.mul a b) b.conj = CInt.smul b.normSq a := by
      cases a with | mk ar ai =>
      cases b with | mk br bi =>
      unfold CInt.mul CInt.conj CInt.smul CInt.normSq
      simp only [CInt.mk.injEq]
      constructor
      · rw [Int.sub_mul, Int.add_mul, Int.mul_neg, Int.mul_neg, Int.add_mul]
        have h1 : ar * br * br = br * br * ar := by rw [Int.mul_assoc, Int.mul_comm ar (br * br)]
        have h2 : ai * br * bi = ai * bi * br := by rw [Int.mul_assoc, Int.mul_comm br bi, ← Int.mul_assoc]
        have h3 : ar * bi * bi = bi * bi * ar := by rw [Int.mul_assoc, Int.mul_comm ar (bi * bi)]
        omega
      · rw [Int.sub_mul, Int.add_mul, Int.mul_neg, Int.mul_neg, Int.add_mul]
        have h1 : ar * br * bi = ar * bi * br := by rw [Int.mul_assoc, Int.mul_comm br bi, ← Int.mul_assoc]
        have h2 : ai * bi * bi = bi * bi * ai := by rw [Int.mul_assoc, Int.mul_comm ai (bi * bi)]
        have h3 : ai * br * br = br * br * ai := by rw [Int.mul_assoc, Int.mul_comm ai (br * br)]
        omega
    rw [hassoc] at hmul
    cases ha : a with | mk ar ai =>
    rw [ha] at hmul
    unfold CInt.smul CInt.zero at hmul
    simp only [CInt.mk.injEq] at hmul
    have hne : b.normSq ≠ 0 := by omega
    have har : ar = 0 := (Int.mul_eq_zero.mp hmul.1).resolve_left hne
    have hai : ai = 0 := (Int.mul_eq_zero.mp hmul.2).resolve_left hne
    subst har; subst hai; rfl

/-- Corollary I.Op8 (Strict Linear Independence Over `CInt` -> Eigenvalue Multiplicity >= 2):
    Any nonzero vectors `v ∈ W_{s,m}` and `w ∈ W_{s, p - m}` at an odd prime (`p % 2 = 1`) are
    strictly linearly independent over `CInt`: `c1 * v + c2 * w = 0 -> c1 = 0 ∧ c2 = 0`. -/
theorem odd_prime_doublet_linearly_independent (p n s m : Nat)
    (hp_odd : p % 2 = 1) (hm1 : 1 ≤ m) (hmp : m < p)
    (v w : CVec (p ^ n))
    (hv_sec : InSector p n s m v) (hw_sec : InSector p n s (p - m) w)
    (hv_nz : ∃ k : Fin (p ^ n), v k ≠ CInt.zero)
    (hw_nz : ∃ k : Fin (p ^ n), w k ≠ CInt.zero)
    (c1 c2 : CInt)
    (hlin : ∀ k : Fin (p ^ n), CInt.add (CInt.mul c1 (v k)) (CInt.mul c2 (w k)) = CInt.zero) :
    c1 = CInt.zero ∧ c2 = CInt.zero := by
  have hpsPos : 0 < p ^ s := Nat.pow_pos (by omega)
  constructor
  · rcases hv_nz with ⟨k0, hk0⟩
    have hsec : isSectorIdx p s m k0.val := by
      by_cases hs : isSectorIdx p s m k0.val
      · exact hs
      · exact False.elim (hk0 (hv_sec k0 hs))
    have hnot_w : ¬ isSectorIdx p s (p - m) k0.val := by
      intro hsec2
      unfold isSectorIdx at hsec hsec2
      have hmeq : m = p - m := Nat.eq_of_mul_eq_mul_right hpsPos (hsec.symm.trans hsec2)
      exact odd_prime_conjugate_sector_disjoint p m hp_odd hm1 hmp hmeq
    have hw0 : w k0 = CInt.zero := hw_sec k0 hnot_w
    have hk := hlin k0
    rw [hw0] at hk
    have hmul0 : CInt.mul c2 CInt.zero = CInt.zero := by cases c2; unfold CInt.mul CInt.zero; simp
    rw [hmul0, CInt.add_zero_right] at hk
    exact (CInt.mul_eq_zero_or c1 (v k0) hk).resolve_right hk0
  · rcases hw_nz with ⟨k1, hk1⟩
    have hsec : isSectorIdx p s (p - m) k1.val := by
      by_cases hs : isSectorIdx p s (p - m) k1.val
      · exact hs
      · exact False.elim (hk1 (hw_sec k1 hs))
    have hnot_v : ¬ isSectorIdx p s m k1.val := by
      intro hsec1
      unfold isSectorIdx at hsec hsec1
      have hmeq : m = p - m := Nat.eq_of_mul_eq_mul_right hpsPos (hsec1.symm.trans hsec)
      exact odd_prime_conjugate_sector_disjoint p m hp_odd hm1 hmp hmeq
    have hv0 : v k1 = CInt.zero := hv_sec k1 hnot_v
    have hk := hlin k1
    rw [hv0] at hk
    have hmul0 : CInt.mul c1 CInt.zero = CInt.zero := by cases c1; unfold CInt.mul CInt.zero; simp
    rw [hmul0, CInt.add_zero_left] at hk
    exact (CInt.mul_eq_zero_or c2 (w k1) hk).resolve_right hk1

end Ultrametrica

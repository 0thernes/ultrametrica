module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.MultiEdgeHolography

/-!
  ULTRAMETRICA (v1.7.0) — Lean 4 Formal Proofs (Module 5: Discrete Finite-Level
  p-adic Ultrametric Valuation, Radial Vladimirov Convolution Operator D_K,
  First-Principles Kozyrev-Haar Wavelet Eigenfunction Theorem, and Complement
  Involution J-Parity Decomposition)

  Directly closes the 2026-11-26 statement-audit gap (F71): defines the actual
  discrete radial ultrametric operator (including cleared-denominator Vladimirov
  operators D_p^alpha), actual discrete Kozyrev-Haar wavelets on Z / p^n Z, and
  proves from first principles (zero Mathlib, zero sorry, arbitrary prime p >= 2,
  depth n, scale j < n, ball center c, zero-sum profile a, and arbitrary kernel K)
  that every Kozyrev-Haar wavelet is an EXACT EIGENFUNCTION of D_K with scale-only
  eigenvalue, and that D_K commutes with the complement-reversal involution J.

  Palomar-compliant Lean 4.35.0 `module` (< 900 lines), zero Mathlib,
  zero `native_decide`, zero `sorry`, zero custom axioms.
-/

@[expose] public section

namespace Ultrametrica

/-! ## 1. Exact Finite-Level p-adic Valuation & Strong Ultrametric Geometry on Z / p^n Z -/

/-- Bounded recursive `p`-adic valuation up to cutoff `fuel`. -/
def padicValAux (p : Nat) : Nat → Nat → Nat
  | 0, _        => 0
  | fuel + 1, d => if d % p = 0 then 1 + padicValAux p fuel (d / p) else 0

/-- Exact `p`-adic valuation on `Z / p^n Z`: returns `n` iff `p^n ∣ d`, else `v_p(d) < n`. -/
def padicValMod (p n d : Nat) : Nat :=
  padicValAux p n (d % p ^ n)

/-- Modular difference `(x - y) mod N` in `Nat` for `x, y < N`. -/
def modDiff (N x y : Nat) : Nat :=
  (x + N - y) % N

/-- Exact finite-level ultrametric valuation `v_p(x - y)` on `Z / p^n Z`. -/
def padicDistVal (p n x y : Nat) : Nat :=
  padicValMod p n (modDiff (p ^ n) x y)

theorem padicValAux_le (p fuel d : Nat) : padicValAux p fuel d ≤ fuel := by
  induction fuel generalizing d with
  | zero => exact Nat.le_refl 0
  | succ k ih =>
    unfold padicValAux
    split
    · have := ih (d / p); omega
    · omega

theorem padicValMod_le (p n d : Nat) : padicValMod p n d ≤ n :=
  padicValAux_le p n (d % p ^ n)

/-- Fundamental characterization: for `k ≤ fuel`, `k ≤ padicValAux p fuel d ↔ p ^ k ∣ d`. -/
theorem padicValAux_ge_iff (p fuel k d : Nat) (hp : 2 ≤ p) (hk : k ≤ fuel) :
    k ≤ padicValAux p fuel d ↔ p ^ k ∣ d := by
  induction k generalizing fuel d with
  | zero =>
    simp [Nat.pow_zero]
  | succ k ih =>
    cases fuel with
    | zero => omega
    | succ m =>
      unfold padicValAux
      constructor
      · intro h
        by_cases hdiv : d % p = 0
        · simp only [hdiv, ite_true] at h
          have hk' : k ≤ padicValAux p m (d / p) := by omega
          have hdvd_q : p ^ k ∣ d / p := (ih m (d / p) (by omega)).mp hk'
          rcases hdvd_q with ⟨q, hq⟩
          refine ⟨q, ?_⟩
          have hd : d = p * (d / p) := by
            have := Nat.div_add_mod d p
            omega
          rw [hd, hq, Nat.pow_succ, Nat.mul_comm (p ^ k) p, Nat.mul_assoc]
        · simp only [hdiv, ite_false] at h
          omega
      · intro h
        rcases h with ⟨q, hq⟩
        have hdiv : d % p = 0 := by
          rw [hq, Nat.pow_succ, Nat.mul_assoc]
          have : p ^ k * (p * q) = p * (p ^ k * q) := by
            rw [← Nat.mul_assoc, Nat.mul_comm (p ^ k) p, Nat.mul_assoc]
          rw [this, Nat.mul_mod_right]
        simp only [hdiv, ite_true]
        have hquot : d / p = p ^ k * q := by
          have hp0 : 0 < p := by omega
          rw [hq, Nat.pow_succ]
          have : p ^ k * p * q = p * (p ^ k * q) := by
            rw [Nat.mul_comm (p ^ k) p, Nat.mul_assoc]
          rw [this, Nat.mul_div_right _ hp0]
        have hk' : k ≤ padicValAux p m (d / p) := (ih m (d / p) (by omega)).mpr ⟨q, hquot⟩
        omega

/-- Exact divisibility equivalence on `Z / p^n Z`: `k ≤ padicValMod p n d ↔ p ^ k ∣ d` for `k ≤ n`. -/
theorem padicValMod_ge_iff (p n k d : Nat) (hp : 2 ≤ p) (hk : k ≤ n) :
    k ≤ padicValMod p n d ↔ p ^ k ∣ d := by
  unfold padicValMod
  rw [padicValAux_ge_iff p n k (d % p ^ n) hp hk]
  have hpow : p ^ k ∣ p ^ n := by
    refine ⟨p ^ (n - k), ?_⟩
    rw [← Nat.pow_add, Nat.add_sub_cancel' hk]
  have hmod : d % p ^ n + p ^ n * (d / p ^ n) = d := by
    rw [Nat.add_comm]
    exact Nat.div_add_mod d (p ^ n)
  constructor
  · intro h1
    rcases h1 with ⟨a, ha⟩
    rcases hpow with ⟨b, hb⟩
    refine ⟨a + b * (d / p ^ n), ?_⟩
    calc
      d = d % p ^ n + p ^ n * (d / p ^ n) := hmod.symm
      _ = p ^ k * a + (p ^ k * b) * (d / p ^ n) := by rw [ha, hb]
      _ = p ^ k * (a + b * (d / p ^ n)) := by rw [Nat.mul_assoc, ← Nat.mul_add]
  · intro h2
    rcases h2 with ⟨a, ha⟩
    rcases hpow with ⟨b, hb⟩
    have hle_d : p ^ n * (d / p ^ n) ≤ d := Nat.mul_div_le d (p ^ n)
    have hmul : p ^ k * (b * (d / p ^ n)) ≤ p ^ k * a := by
      rw [← Nat.mul_assoc, ← hb, ← ha]
      exact hle_d
    refine ⟨a - b * (d / p ^ n), ?_⟩
    rw [Nat.mul_sub_left_distrib, ← ha, ← Nat.mul_assoc, ← hb]
    omega

/-- Helper: modular reduction when `m ≤ s < 2 * m`. -/
private theorem mod_eq_sub_of_ge (s m : Nat) (h1 : m ≤ s) (h2 : s < 2 * m) :
    s % m = s - m := by
  have heq : s = (s - m) + m := by omega
  calc
    s % m = ((s - m) + m) % m := congrArg (· % m) heq
    _ = (s - m) % m := Nat.add_mod_right (s - m) m
    _ = s - m := Nat.mod_eq_of_lt (by omega)

/-- Congruence characterization of `padicDistVal`: for `x, y < p^n` and `k ≤ n`,
    `k ≤ padicDistVal p n x y ↔ x % p ^ k = y % p ^ k`. -/
theorem padicDistVal_ge_iff (p n k x y : Nat) (hp : 2 ≤ p) (hk : k ≤ n)
    (_hx : x < p ^ n) (hy : y < p ^ n) :
    k ≤ padicDistVal p n x y ↔ x % p ^ k = y % p ^ k := by
  unfold padicDistVal modDiff
  rw [padicValMod_ge_iff p n k ((x + p ^ n - y) % p ^ n) hp hk]
  have hpow : p ^ k ∣ p ^ n := ⟨p ^ (n - k), by rw [← Nat.pow_add, Nat.add_sub_cancel' hk]⟩
  have hpk_pos : 0 < p ^ k := Nat.pow_pos (by omega)
  have hmod_eq : ((x + p ^ n - y) % p ^ n) % p ^ k = (x + p ^ n - y) % p ^ k :=
    Nat.mod_mod_of_dvd (x + p ^ n - y) hpow
  have hdvd_mod : p ^ k ∣ (x + p ^ n - y) % p ^ n ↔ (x + p ^ n - y) % p ^ k = 0 := by
    rw [Nat.dvd_iff_mod_eq_zero, hmod_eq]
  rw [hdvd_mod]
  have hadd : (x + p ^ n - y) + y = x + p ^ n := by omega
  have hp_mod : p ^ n % p ^ k = 0 := Nat.mod_eq_zero_of_dvd hpow
  constructor
  · intro h0
    have h1 : ((x + p ^ n - y) + y) % p ^ k = (0 + y % p ^ k) % p ^ k := by
      rw [Nat.add_mod, h0]
    rw [hadd, Nat.zero_add, Nat.mod_mod, Nat.add_mod, hp_mod, Nat.add_zero, Nat.mod_mod] at h1
    exact h1
  · intro hxy
    have h1 : ((x + p ^ n - y) + y) % p ^ k = y % p ^ k := by
      rw [hadd, Nat.add_mod, hp_mod, Nat.add_zero, Nat.mod_mod, hxy]
    have h2 : ((x + p ^ n - y) % p ^ k + y % p ^ k) % p ^ k = y % p ^ k := by
      rw [← Nat.add_mod]
      exact h1
    have hlt1 : (x + p ^ n - y) % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
    have hlt2 : y % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
    by_cases hsum : (x + p ^ n - y) % p ^ k + y % p ^ k < p ^ k
    · rw [Nat.mod_eq_of_lt hsum] at h2
      omega
    · rw [mod_eq_sub_of_ge _ (p ^ k) (by omega) (by omega)] at h2
      omega

/-- Exact symmetry of the finite-level `p`-adic valuation distance on `Z / p^n Z`. -/
theorem padicDistVal_symm (p n x y : Nat) (hp : 2 ≤ p) (hx : x < p ^ n) (hy : y < p ^ n) :
    padicDistVal p n x y = padicDistVal p n y x := by
  have h1 : padicDistVal p n x y ≤ padicDistVal p n y x := by
    have hle : padicDistVal p n x y ≤ n := padicValMod_le p n _
    rw [padicDistVal_ge_iff p n _ y x hp hle hy hx]
    exact ((padicDistVal_ge_iff p n _ x y hp hle hx hy).mp (Nat.le_refl _)).symm
  have h2 : padicDistVal p n y x ≤ padicDistVal p n x y := by
    have hle : padicDistVal p n y x ≤ n := padicValMod_le p n _
    rw [padicDistVal_ge_iff p n _ x y hp hle hx hy]
    exact ((padicDistVal_ge_iff p n _ y x hp hle hy hx).mp (Nat.le_refl _)).symm
  omega

/-- Exact strong ultrametric triangle inequality on `Z / p^n Z`:
    `min(v_p(x - y), v_p(y - z)) ≤ v_p(x - z)`. -/
theorem padicDistVal_strong_tri (p n x y z : Nat) (hp : 2 ≤ p)
    (hx : x < p ^ n) (hy : y < p ^ n) (hz : z < p ^ n) :
    min (padicDistVal p n x y) (padicDistVal p n y z) ≤ padicDistVal p n x z := by
  let k := min (padicDistVal p n x y) (padicDistVal p n y z)
  have hk_le_n : k ≤ n := Nat.le_trans (Nat.min_le_left _ _) (padicValMod_le p n _)
  rw [padicDistVal_ge_iff p n k x z hp hk_le_n hx hz]
  have hxy : x % p ^ k = y % p ^ k :=
    (padicDistVal_ge_iff p n k x y hp hk_le_n hx hy).mp (Nat.min_le_left _ _)
  have hyz : y % p ^ k = z % p ^ k :=
    (padicDistVal_ge_iff p n k y z hp hk_le_n hy hz).mp (Nat.min_le_right _ _)
  exact hxy.trans hyz

/-- Sharp ultrametric isosceles law on `Z / p^n Z`:
    if `v_p(x - y) < v_p(y - z)`, then `v_p(x - z) = v_p(x - y)` identically. -/
theorem padicDistVal_isosceles_eq (p n x y z : Nat) (hp : 2 ≤ p)
    (hx : x < p ^ n) (hy : y < p ^ n) (hz : z < p ^ n)
    (hlt : padicDistVal p n x y < padicDistVal p n y z) :
    padicDistVal p n x z = padicDistVal p n x y := by
  have h1 : padicDistVal p n x y ≤ padicDistVal p n x z := by
    have hst := padicDistVal_strong_tri p n x y z hp hx hy hz
    omega
  have h2 : padicDistVal p n x z ≤ padicDistVal p n x y := by
    have hst := padicDistVal_strong_tri p n x z y hp hx hz hy
    have hsym := padicDistVal_symm p n z y hp hz hy
    omega
  omega

/-- Outside ball `B(c, j)`, `v_p(x - y)` is strictly constant (`= v_p(x - c)`) for all `y ∈ B(c, j)`. -/
theorem padicDistVal_const_outside_ball (p n j c x y : Nat) (hp : 2 ≤ p) (hj : j ≤ n)
    (hc : c < p ^ n) (hx : x < p ^ n) (hy : y < p ^ n)
    (hx_out : x % p ^ j ≠ c % p ^ j) (hy_in : y % p ^ j = c % p ^ j) :
    padicDistVal p n x y = padicDistVal p n x c := by
  have hxc_lt : padicDistVal p n x c < j := by
    apply Nat.lt_of_not_le
    intro hge
    exact hx_out ((padicDistVal_ge_iff p n j x c hp hj hx hc).mp hge)
  have hcy_ge : j ≤ padicDistVal p n c y := by
    rw [padicDistVal_ge_iff p n j c y hp hj hc hy]
    exact hy_in.symm
  exact padicDistVal_isosceles_eq p n x c y hp hx hc hy (by omega)

/-- Distinct child sub-balls inside `B(c, j)` have exact valuation `v_p(x - y) = j`. -/
theorem padicDistVal_sibling_subball_eq (p n j x y : Nat) (hp : 2 ≤ p) (hj : j + 1 ≤ n)
    (hx : x < p ^ n) (hy : y < p ^ n)
    (hsame : x % p ^ j = y % p ^ j)
    (hdiff : (x / p ^ j) % p ≠ (y / p ^ j) % p) :
    padicDistVal p n x y = j := by
  have hge : j ≤ padicDistVal p n x y :=
    (padicDistVal_ge_iff p n j x y hp (by omega) hx hy).mpr hsame
  have hnot : ¬ (j + 1 ≤ padicDistVal p n x y) := by
    intro hsucc
    have hmod : x % p ^ (j + 1) = y % p ^ (j + 1) :=
      (padicDistVal_ge_iff p n (j + 1) x y hp hj hx hy).mp hsucc
    have hx_d : (x / p ^ j) % p = (x % p ^ (j + 1)) / p ^ j := by
      have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
      rw [Nat.pow_succ, Nat.mod_mul_right_div_self]
    have hy_d : (y / p ^ j) % p = (y % p ^ (j + 1)) / p ^ j := by
      have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
      rw [Nat.pow_succ, Nat.mod_mul_right_div_self]
    rw [hx_d, hy_d, hmod] at hdiff
    exact hdiff rfl
  omega

/-- Complement-reversal invariance of the finite-level `p`-adic valuation distance:
    `v_p((p^n - 1 - x) - (p^n - 1 - y)) = v_p(x - y)`. -/
theorem padicDistVal_complement (p n x y : Nat) (hp : 2 ≤ p)
    (hx : x < p ^ n) (hy : y < p ^ n) :
    padicDistVal p n (p ^ n - 1 - x) (p ^ n - 1 - y) = padicDistVal p n x y := by
  have hx' : p ^ n - 1 - x < p ^ n := by omega
  have hy' : p ^ n - 1 - y < p ^ n := by omega
  have hiff : ∀ k, k ≤ n →
      (k ≤ padicDistVal p n (p ^ n - 1 - x) (p ^ n - 1 - y) ↔ k ≤ padicDistVal p n x y) := by
    intro k hk
    rw [padicDistVal_ge_iff p n k _ _ hp hk hx' hy', padicDistVal_ge_iff p n k x y hp hk hx hy]
    have hpow : p ^ k ∣ p ^ n := ⟨p ^ (n - k), by rw [← Nat.pow_add, Nat.add_sub_cancel' hk]⟩
    have hpk_pos : 0 < p ^ k := Nat.pow_pos (by omega)
    have hrem : ∀ a, a < p ^ n →
        ((p ^ n - 1 - a) % p ^ k + a % p ^ k) % p ^ k = (p ^ n - 1) % p ^ k := by
      intro a ha
      rw [← Nat.add_mod]
      have : p ^ n - 1 - a + a = p ^ n - 1 := by omega
      rw [this]
    have hrx := hrem x hx
    have hry := hrem y hy
    constructor
    · intro heq
      rw [heq] at hrx
      have hcomb : ((p ^ n - 1 - y) % p ^ k + x % p ^ k) % p ^ k =
          ((p ^ n - 1 - y) % p ^ k + y % p ^ k) % p ^ k := hrx.trans hry.symm
      have hlt_c : (p ^ n - 1 - y) % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      have hlt_x : x % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      have hlt_y : y % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      -- Both sums lie in [0, 2*p^k - 2] and agree mod p^k, so x % p^k = y % p^k
      have hsub : ∀ u v c m : Nat, u < m → v < m → c < m → (c + u) % m = (c + v) % m → u = v := by
        intro u v c m hu hv hc hEq
        by_cases h1 : c + u < m <;> by_cases h2 : c + v < m
        · rw [Nat.mod_eq_of_lt h1, Nat.mod_eq_of_lt h2] at hEq; omega
        · rw [Nat.mod_eq_of_lt h1, mod_eq_sub_of_ge (c + v) m (by omega) (by omega)] at hEq; omega
        · rw [mod_eq_sub_of_ge (c + u) m (by omega) (by omega), Nat.mod_eq_of_lt h2] at hEq; omega
        · rw [mod_eq_sub_of_ge (c + u) m (by omega) (by omega),
              mod_eq_sub_of_ge (c + v) m (by omega) (by omega)] at hEq; omega
      exact hsub (x % p ^ k) (y % p ^ k) ((p ^ n - 1 - y) % p ^ k) (p ^ k) hlt_x hlt_y hlt_c hcomb
    · intro heq
      rw [heq] at hrx
      have hcomb : ((p ^ n - 1 - x) % p ^ k + y % p ^ k) % p ^ k =
          ((p ^ n - 1 - y) % p ^ k + y % p ^ k) % p ^ k := hrx.trans hry.symm
      have hlt_c : y % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      have hlt_x : (p ^ n - 1 - x) % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      have hlt_y : (p ^ n - 1 - y) % p ^ k < p ^ k := Nat.mod_lt _ hpk_pos
      have hsub : ∀ u v c m : Nat, u < m → v < m → c < m → (u + c) % m = (v + c) % m → u = v := by
        intro u v c m hu hv hc hEq
        by_cases h1 : u + c < m <;> by_cases h2 : v + c < m
        · rw [Nat.mod_eq_of_lt h1, Nat.mod_eq_of_lt h2] at hEq; omega
        · rw [Nat.mod_eq_of_lt h1, mod_eq_sub_of_ge (v + c) m (by omega) (by omega)] at hEq; omega
        · rw [mod_eq_sub_of_ge (u + c) m (by omega) (by omega), Nat.mod_eq_of_lt h2] at hEq; omega
        · rw [mod_eq_sub_of_ge (u + c) m (by omega) (by omega),
              mod_eq_sub_of_ge (v + c) m (by omega) (by omega)] at hEq; omega
      exact hsub _ _ _ _ hlt_x hlt_y hlt_c hcomb
  have h1 : padicDistVal p n (p ^ n - 1 - x) (p ^ n - 1 - y) ≤ padicDistVal p n x y :=
    (hiff _ (padicValMod_le p n _)).mp (Nat.le_refl _)
  have h2 : padicDistVal p n x y ≤ padicDistVal p n (p ^ n - 1 - x) (p ^ n - 1 - y) :=
    (hiff _ (padicValMod_le p n _)).mpr (Nat.le_refl _)
  omega

/-! ## 2. Pure-Core `finSum` Product, Shift, and Complement-Reversal Lemmas -/

theorem finSum_zero (n : Nat) : finSum n (fun _ => 0) = 0 := by
  induction n with
  | zero => rfl
  | succ k ih =>
    simp only [finSum, ih, Int.add_zero]

theorem finSum_single {n : Nat} (a : Fin n) (f : Fin n → Int) :
    finSum n (fun x => if x = a then f x else 0) = f a := by
  induction n with
  | zero => exact Fin.elim0 a
  | succ k ih =>
    simp only [finSum]
    by_cases hlast : a.val = k
    · have ha : a = ⟨k, Nat.lt_succ_self k⟩ := Fin.ext hlast
      have hpre : finSum k (fun i => if i.castSucc = a then f i.castSucc else 0) = 0 := by
        rw [finSum_congr k _ (fun _ => 0)]
        · exact finSum_zero k
        · intro i
          have hne : i.castSucc ≠ a := by
            intro h; have := congrArg Fin.val h; dsimp [Fin.castSucc] at this; omega
          simp [hne]
      rw [hpre, Int.zero_add, ha]
      simp
    · have hlt : a.val < k := by omega
      let a' : Fin k := ⟨a.val, hlt⟩
      have ha : a = a'.castSucc := Fin.ext rfl
      have hne_last : (⟨k, Nat.lt_succ_self k⟩ : Fin (k + 1)) ≠ a := by
        intro h; exact hlast (congrArg Fin.val h).symm
      have hpre : finSum k (fun i => if i.castSucc = a then f i.castSucc else 0) = f a := by
        rw [finSum_congr k _ (fun i => if i = a' then f i.castSucc else 0)]
        · simpa [ha] using ih a' (fun i => f i.castSucc)
        · intro i
          by_cases hi : i = a'
          · have h1 : i.castSucc = a := by rw [hi, ha]
            simp only [eq_true h1, eq_true hi, ite_true]
          · have h1 : i.castSucc ≠ a := by
              intro h; apply hi
              have hv : i.val = a'.val := by simpa [a', Fin.castSucc] using congrArg Fin.val h
              exact Fin.ext hv
            simp only [eq_false h1, eq_false hi, ite_false]
      rw [hpre]
      simp [hne_last]

/-- Splitting a finite sum over `Fin (a + b)`. -/
theorem finSum_append (a b : Nat) (f : Fin (a + b) → Int) :
    finSum (a + b) f =
      finSum a (fun i => f ⟨i.val, Nat.lt_of_lt_of_le i.isLt (Nat.le_add_right a b)⟩) +
      finSum b (fun j => f ⟨a + j.val, Nat.add_lt_add_left j.isLt a⟩) := by
  induction b with
  | zero =>
    simp [finSum]
  | succ k ih =>
    change finSum (a + k) (fun i => f i.castSucc) + f ⟨a + k, Nat.lt_succ_self (a + k)⟩ =
      finSum a (fun i => f ⟨i.val, Nat.lt_of_lt_of_le i.isLt (Nat.le_add_right a (k + 1))⟩) +
      (finSum k (fun j => f ⟨a + j.val, Nat.add_lt_add_left (Nat.lt_succ_of_lt j.isLt) a⟩) +
        f ⟨a + k, Nat.lt_succ_self (a + k)⟩)
    rw [ih (fun i => f i.castSucc), Int.add_assoc]
    rfl

/-- Product reindexing of `finSum (q * m)`: row-major decomposition `x = r * m + u`. -/
theorem finSum_mul_split (q m : Nat) (f : Fin (q * m) → Int) :
    finSum (q * m) f =
      finSum q (fun r => finSum m (fun u =>
        f ⟨r.val * m + u.val, by
          have hr : r.val + 1 ≤ q := r.isLt
          have h1 : r.val * m + m = (r.val + 1) * m := by rw [Nat.add_mul, Nat.one_mul]
          have h2 : (r.val + 1) * m ≤ q * m := Nat.mul_le_mul_right m hr
          omega⟩)) := by
  have hrew : ∀ (n1 n2 : Nat) (h : n1 = n2) (g : Fin n1 → Int),
      finSum n1 g = finSum n2 (fun i => g ⟨i.val, h ▸ i.isLt⟩) := by
    intro n1 n2 h g; subst h; rfl
  induction q with
  | zero =>
    rw [hrew (0 * m) 0 (Nat.zero_mul m) f]
    rfl
  | succ k ih =>
    have hmul : (k + 1) * m = k * m + m := by rw [Nat.add_mul, Nat.one_mul]
    rw [hrew ((k + 1) * m) (k * m + m) hmul f]
    rw [finSum_append (k * m) m]
    simp only [finSum]
    congr 1
    exact ih (fun i => f ⟨i.val, by omega⟩)

/-- Exact reversal invariance of `finSum N`: `sum_{i < N} f(N - 1 - i) = sum_{i < N} f(i)`. -/
theorem finSum_rev (N : Nat) (f : Fin N → Int) :
    finSum N (fun i => f ⟨N - 1 - i.val, by omega⟩) = finSum N f := by
  induction N with
  | zero => rfl
  | succ k ih =>
    have hstep : finSum (k + 1) (fun i => f ⟨k - i.val, by omega⟩) =
        f ⟨0, Nat.zero_lt_succ k⟩ + finSum k (fun j => f ⟨k - j.val, by omega⟩) := by
      simp only [finSum]
      have h0 : k - k = 0 := Nat.sub_self k
      rw [Int.add_comm]
      congr 1
      simp [h0]
    have htail : finSum (k + 1) f = f ⟨0, Nat.zero_lt_succ k⟩ + finSum k (fun j => f ⟨j.val + 1, Nat.succ_lt_succ j.isLt⟩) := by
      have h1 := finSum_append 1 k (fun i => f ⟨i.val, by omega⟩)
      have heq : 1 + k = k + 1 := Nat.add_comm 1 k
      have hrew : ∀ (n1 n2 : Nat) (h : n1 = n2) (g : Fin n1 → Int),
          finSum n1 g = finSum n2 (fun i => g ⟨i.val, h ▸ i.isLt⟩) := by
        intro n1 n2 h g; subst h; rfl
      rw [hrew (k + 1) (1 + k) heq.symm f]
      rw [finSum_append 1 k]
      simp only [finSum, Int.zero_add]
      congr 1
      apply finSum_congr
      intro j
      have : 1 + j.val = j.val + 1 := Nat.add_comm 1 j.val
      simp [this]
    have hih := ih (fun j => f ⟨j.val + 1, Nat.succ_lt_succ j.isLt⟩)
    have hmatch : finSum k (fun j => f ⟨k - j.val, by omega⟩) =
        finSum k (fun j => f ⟨(k - 1 - j.val) + 1, by omega⟩) := by
      apply finSum_congr
      intro j
      have : k - j.val = (k - 1 - j.val) + 1 := by omega
      simp [this]
    have hnorm : finSum (k + 1) (fun i => f ⟨k + 1 - 1 - i.val, by omega⟩) =
        finSum (k + 1) (fun i => f ⟨k - i.val, by omega⟩) := by
      apply finSum_congr; intro i; simp
    rw [hnorm, hstep, hmatch, hih, htail]

/-- Cyclic modular subtraction bijection invariance on `Fin M`:
    `sum_{q < M} g ((q0 + M - q) % M) = sum_{t < M} g t`. -/
theorem finSum_modSub_inv (M : Nat) (q0 : Nat) (hq0 : q0 < M) (g : Fin M → Int) :
    finSum M (fun q => g ⟨(q0 + M - q.val) % M, Nat.mod_lt _ (by omega)⟩) = finSum M g := by
  have hM : M = (q0 + 1) + (M - (q0 + 1)) := by omega
  have hrew : ∀ (n1 n2 : Nat) (h : n1 = n2) (hfn : Fin n1 → Int),
      finSum n1 hfn = finSum n2 (fun i => hfn ⟨i.val, h ▸ i.isLt⟩) := by
    intro n1 n2 h hfn; subst h; rfl
  -- Split LHS into q ∈ [0, q0] (where (q0 + M - q) % M = q0 - q) and q ∈ [q0+1, M-1] (= q0 + M - q)
  rw [hrew M ((q0 + 1) + (M - (q0 + 1))) hM]
  rw [finSum_append (q0 + 1) (M - (q0 + 1))]
  have hpart1 :
      finSum (q0 + 1) (fun i => g ⟨(q0 + M - i.val) % M, Nat.mod_lt _ (by omega)⟩) =
      finSum (q0 + 1) (fun i => g ⟨i.val, by omega⟩) := by
    rw [← finSum_rev (q0 + 1) (fun i => g ⟨i.val, by omega⟩)]
    apply finSum_congr
    intro i
    have hmod : (q0 + M - i.val) % M = q0 - i.val := by
      have : q0 + M - i.val = (q0 - i.val) + M := by omega
      rw [this, Nat.add_mod_right, Nat.mod_eq_of_lt (by omega)]
    simp [hmod]
  have hpart2 :
      finSum (M - (q0 + 1)) (fun j => g ⟨(q0 + M - (q0 + 1 + j.val)) % M, Nat.mod_lt _ (by omega)⟩) =
      finSum (M - (q0 + 1)) (fun j => g ⟨q0 + 1 + j.val, by omega⟩) := by
    rw [← finSum_rev (M - (q0 + 1)) (fun j => g ⟨q0 + 1 + j.val, by omega⟩)]
    apply finSum_congr
    intro j
    have hmod : (q0 + M - (q0 + 1 + j.val)) % M = M - 1 - j.val := by
      have h1 : q0 + M - (q0 + 1 + j.val) = M - 1 - j.val := by omega
      rw [h1, Nat.mod_eq_of_lt (by omega)]
    have hsub : q0 + 1 + (M - (q0 + 1) - 1 - j.val) = M - 1 - j.val := by omega
    simp [hmod, hsub]
  rw [hpart1, hpart2]
  rw [← finSum_append (q0 + 1) (M - (q0 + 1)) (fun i => g ⟨i.val, by omega⟩)]
  exact (hrew M ((q0 + 1) + (M - (q0 + 1))) hM g).symm

/-! ## 3. Actual Discrete Vladimirov / Radial Ultrametric Operator & Kozyrev-Haar Eigenfunctions -/

/-- Exact discrete radial ultrametric convolution operator on `Z / p^n Z`:
    `(ultrametricOp p n K f) x = sum_{y < p^n} K(v_p(x - y)) * f(y)`.
    Instantiating `K` to cleared-denominator Vladimirov weights yields `D_p^alpha` directly. -/
def ultrametricOp (p n : Nat) (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)) : Int :=
  finSum (p ^ n) (fun y => K (padicDistVal p n x.val y.val) * f y)

/-- Actual discrete Kozyrev-Haar wavelet on `Z / p^n Z` at scale `j < n`, ball center `c`,
    and child-slice weights `a : Fin p → Int` (with `sum a = 0`). -/
def kozyrevHaar (p n j c : Nat) (hp : 2 ≤ p) (a : Fin p → Int) (x : Fin (p ^ n)) : Int :=
  if x.val % p ^ j = c % p ^ j then
    a ⟨(x.val / p ^ j) % p, Nat.mod_lt _ (by omega)⟩
  else 0

/-- Exact scale-only eigenvalue of `ultrametricOp p n K` on every scale-`j` Kozyrev-Haar wavelet
    (strictly independent of ball center `c` and zero-sum character profile `a`!):
      `lambda_K(p, n, j) = sum_{t < p^(n - j - 1)} K((j + 1) + v_p(t)) - p^(n - j - 1) * K(j)`. -/
def ultrametricWaveletEigenvalue (p n j : Nat) (K : Nat → Int) : Int :=
  finSum (p ^ (n - j - 1)) (fun t => K (j + 1 + padicValMod p (n - j - 1) t.val)) -
    ((p ^ (n - j - 1) : Nat) : Int) * K j

/-- Helper: valuation of a sub-ball shift `((q0 + p^m - q) % p^m) * p^(j+1)` equals `j + 1 + v_p(q0 - q)`. -/
theorem padicValMod_mul_pow_shift (p m s t : Nat) (hp : 2 ≤ p) :
    padicValMod p (m + s) (t * p ^ s) = s + padicValMod p m t := by
  have h1 : ∀ k, k ≤ m + s → (k ≤ padicValMod p (m + s) (t * p ^ s) ↔ k ≤ s + padicValMod p m t) := by
    intro k hk
    rw [padicValMod_ge_iff p (m + s) k (t * p ^ s) hp hk]
    by_cases hks : k ≤ s
    · have hdvd : p ^ k ∣ t * p ^ s := by
        refine ⟨t * p ^ (s - k), ?_⟩
        calc
          t * p ^ s = t * (p ^ k * p ^ (s - k)) := by rw [← Nat.pow_add, Nat.add_sub_cancel' hks]
          _ = p ^ k * (t * p ^ (s - k)) := by rw [← Nat.mul_assoc, Nat.mul_comm t (p ^ k), Nat.mul_assoc]
      constructor
      · intro _; omega
      · intro _; exact hdvd
    · have hgt : s < k := by omega
      have hkm : k - s ≤ m := by omega
      have hpow : p ^ k = p ^ (k - s) * p ^ s := by
        rw [← Nat.pow_add, Nat.sub_add_cancel (by omega)]
      have hps_pos : 0 < p ^ s := Nat.pow_pos (by omega)
      have hdvd_iff : p ^ k ∣ t * p ^ s ↔ p ^ (k - s) ∣ t := by
        rw [hpow]
        constructor
        · rintro ⟨w, hw⟩
          refine ⟨w, ?_⟩
          have : t * p ^ s = (p ^ (k - s) * w) * p ^ s := by
            calc
              t * p ^ s = (p ^ (k - s) * p ^ s) * w := hw
              _ = p ^ (k - s) * (p ^ s * w) := Nat.mul_assoc _ _ _
              _ = p ^ (k - s) * (w * p ^ s) := by rw [Nat.mul_comm (p ^ s) w]
              _ = (p ^ (k - s) * w) * p ^ s := (Nat.mul_assoc _ _ _).symm
          exact Nat.eq_of_mul_eq_mul_right hps_pos this
        · rintro ⟨w, hw⟩
          refine ⟨w, ?_⟩
          rw [hw]
          calc
            p ^ (k - s) * w * p ^ s = p ^ (k - s) * (w * p ^ s) := Nat.mul_assoc _ _ _
            _ = p ^ (k - s) * (p ^ s * w) := by rw [Nat.mul_comm w (p ^ s)]
            _ = p ^ (k - s) * p ^ s * w := (Nat.mul_assoc _ _ _).symm
      rw [hdvd_iff, ← padicValMod_ge_iff p m (k - s) t hp hkm]
      omega
  have hle1 : padicValMod p (m + s) (t * p ^ s) ≤ s + padicValMod p m t :=
    (h1 _ (padicValMod_le p (m + s) _)).mp (Nat.le_refl _)
  have hle2 : s + padicValMod p m t ≤ padicValMod p (m + s) (t * p ^ s) := by
    have hbound : s + padicValMod p m t ≤ m + s := by
      have := padicValMod_le p m t; omega
    exact (h1 _ hbound).mpr (Nat.le_refl _)
  omega

/-- Exact 3-factor reindexing of any sum over `Fin (p ^ n)` into `(q < p^(n-j-1), d < p, r < p^j)`. -/
theorem finSum_padic_3split (p n j : Nat) (_hp : 2 ≤ p) (hj : j < n) (f : Fin (p ^ n) → Int) :
    finSum (p ^ n) f =
      finSum (p ^ (n - j - 1)) (fun q =>
        finSum p (fun d =>
          finSum (p ^ j) (fun r =>
            f ⟨(q.val * p + d.val) * p ^ j + r.val, by
              have hq : q.val + 1 ≤ p ^ (n - j - 1) := q.isLt
              have hd : d.val + 1 ≤ p := d.isLt
              have h1 : q.val * p + d.val + 1 ≤ p ^ (n - j - 1) * p := by
                have : (q.val + 1) * p ≤ p ^ (n - j - 1) * p := Nat.mul_le_mul_right p hq
                rw [Nat.add_mul, Nat.one_mul] at this; omega
              have h2 : (q.val * p + d.val + 1) * p ^ j ≤ p ^ (n - j - 1) * p * p ^ j :=
                Nat.mul_le_mul_right (p ^ j) h1
              have hpow : p ^ (n - j - 1) * p * p ^ j = p ^ n := by
                rw [← Nat.pow_succ, ← Nat.pow_add]
                congr 1; omega
              rw [Nat.add_mul, Nat.one_mul] at h2
              omega⟩))) := by
  have hpow1 : p ^ n = (p ^ (n - j - 1) * p) * p ^ j := by
    rw [← Nat.pow_succ, ← Nat.pow_add]; congr 1; omega
  have hrew : ∀ (n1 n2 : Nat) (h : n1 = n2) (g : Fin n1 → Int),
      finSum n1 g = finSum n2 (fun i => g ⟨i.val, h ▸ i.isLt⟩) := by
    intro n1 n2 h g; subst h; rfl
  rw [hrew (p ^ n) ((p ^ (n - j - 1) * p) * p ^ j) hpow1 f]
  rw [finSum_mul_split (p ^ (n - j - 1) * p) (p ^ j)]
  rw [finSum_mul_split (p ^ (n - j - 1)) p]

/-- Theorem VII-A (Zero Mean of Every Discrete Kozyrev-Haar Wavelet):
    For ALL `p ≥ 2`, depth `n`, scale `j < n`, ball `c`, and zero-sum weights `a`,
    `sum_{x < p^n} kozyrevHaar p n j c hp a x = 0`. -/
theorem kozyrevHaar_zero_mean (p n j c : Nat) (hp : 2 ≤ p) (hj : j < n)
    (a : Fin p → Int) (hsum : finSum p a = 0) :
    finSum (p ^ n) (kozyrevHaar p n j c hp a) = 0 := by
  rw [finSum_padic_3split p n j hp hj]
  let c0 : Fin (p ^ j) := ⟨c % p ^ j, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩
  have hinner : ∀ (q : Fin (p ^ (n - j - 1))) (d : Fin p),
      finSum (p ^ j) (fun r =>
        kozyrevHaar p n j c hp a ⟨(q.val * p + d.val) * p ^ j + r.val, by
          have hq : q.val + 1 ≤ p ^ (n - j - 1) := q.isLt
          have hd : d.val + 1 ≤ p := d.isLt
          have h1 : q.val * p + d.val + 1 ≤ p ^ (n - j - 1) * p := by
            have := Nat.mul_le_mul_right p hq; rw [Nat.add_mul, Nat.one_mul] at this; omega
          have h2 := Nat.mul_le_mul_right (p ^ j) h1
          have hpow : p ^ (n - j - 1) * p * p ^ j = p ^ n := by
            rw [← Nat.pow_succ, ← Nat.pow_add]; congr 1; omega
          rw [Nat.add_mul, Nat.one_mul] at h2; omega⟩) = a d := by
    intro q d
    rw [finSum_congr (p ^ j) _ (fun r => if r = c0 then a d else 0)]
    · exact finSum_single c0 (fun _ => a d)
    · intro r
      unfold kozyrevHaar
      have hmod : ((q.val * p + d.val) * p ^ j + r.val) % p ^ j = r.val := by
        rw [Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_eq_of_lt r.isLt]
      have hdiv : (((q.val * p + d.val) * p ^ j + r.val) / p ^ j) % p = d.val := by
        have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
        rw [Nat.add_comm, Nat.add_mul_div_right _ _ hpj, Nat.div_eq_of_lt r.isLt, Nat.zero_add,
            Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_eq_of_lt d.isLt]
      rw [hmod]
      by_cases hrc : r = c0
      · have hval : r.val = c % p ^ j := congrArg Fin.val hrc
        simp only [eq_true hval, eq_true hrc, ite_true]
        congr 1
        exact Fin.ext hdiv
      · have hne : r.val ≠ c % p ^ j := fun hv => hrc (Fin.ext hv)
        simp only [eq_false hne, eq_false hrc, ite_false]
  have hd_zero : ∀ q : Fin (p ^ (n - j - 1)),
      finSum p (fun d => finSum (p ^ j) (fun r =>
        kozyrevHaar p n j c hp a ⟨(q.val * p + d.val) * p ^ j + r.val, by
          have hq : q.val + 1 ≤ p ^ (n - j - 1) := q.isLt
          have hd : d.val + 1 ≤ p := d.isLt
          have h1 : q.val * p + d.val + 1 ≤ p ^ (n - j - 1) * p := by
            have := Nat.mul_le_mul_right p hq; rw [Nat.add_mul, Nat.one_mul] at this; omega
          have h2 := Nat.mul_le_mul_right (p ^ j) h1
          have hpow : p ^ (n - j - 1) * p * p ^ j = p ^ n := by
            rw [← Nat.pow_succ, ← Nat.pow_add]; congr 1; omega
          rw [Nat.add_mul, Nat.one_mul] at h2; omega⟩)) = 0 := by
    intro q
    rw [finSum_congr p _ a (fun d => hinner q d)]
    exact hsum
  rw [finSum_congr (p ^ (n - j - 1)) _ (fun _ => 0) hd_zero]
  exact finSum_zero _

/-- Theorem VII-B (First-Principles Discrete Vladimirov / Ultrametric Kozyrev-Haar
    Eigenfunction Theorem — closes F71):
    For ALL `p ≥ 2`, depth `n`, scale `j < n`, ball center `c < p^n`, arbitrary zero-sum
    digit weights `a : Fin p → Int`, and ANY radial ultrametric convolution kernel `K : Nat → Int`
    (covering EVERY discrete Vladimirov operator `D_p^alpha`), the Kozyrev-Haar wavelet `ψ`
    satisfies the exact pointwise eigenvalue equation:
      `(ultrametricOp p n K ψ) x = ultrametricWaveletEigenvalue p n j K * ψ x`
    for EVERY `x : Fin (p ^ n)`! -/
theorem kozyrevHaar_vladimirov_eigenfunction (p n j c : Nat) (hp : 2 ≤ p) (hj : j < n)
    (hc : c < p ^ n) (K : Nat → Int) (a : Fin p → Int) (hsum : finSum p a = 0)
    (x : Fin (p ^ n)) :
    ultrametricOp p n K (kozyrevHaar p n j c hp a) x =
      ultrametricWaveletEigenvalue p n j K * kozyrevHaar p n j c hp a x := by
  unfold ultrametricOp
  by_cases hxin : x.val % p ^ j = c % p ^ j
  · -- Case 1: `x` lies INSIDE the support ball `B(c, j)`!
    let m := n - j - 1
    have hpm_pow : p ^ m * p * p ^ j = p ^ n := by
      rw [← Nat.pow_succ, ← Nat.pow_add]; congr 1; omega
    let d0 : Fin p := ⟨(x.val / p ^ j) % p, Nat.mod_lt _ (by omega)⟩
    let q0 : Nat := x.val / p ^ (j + 1)
    have hq0_lt : q0 < p ^ m := by
      have hpj1 : 0 < p ^ (j + 1) := Nat.pow_pos (by omega)
      have hsplit : p ^ n = p ^ m * p ^ (j + 1) := by
        rw [← Nat.pow_add]; congr 1; omega
      have hlt : x.val < p ^ m * p ^ (j + 1) := hsplit ▸ x.isLt
      exact Nat.div_lt_of_lt_mul (by rw [Nat.mul_comm]; exact hlt)
    have hx_decomp : x.val = (q0 * p + d0.val) * p ^ j + c % p ^ j := by
      have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
      have h1 : x.val = (x.val / p ^ j) * p ^ j + x.val % p ^ j := by
        rw [Nat.mul_comm]; exact (Nat.div_add_mod x.val (p ^ j)).symm
      have h2 : x.val / p ^ j = q0 * p + d0.val := by
        have hq : q0 = (x.val / p ^ j) / p := by
          dsimp [q0]; rw [Nat.pow_succ, Nat.div_div_eq_div_mul]
        rw [hq, Nat.mul_comm]
        exact (Nat.div_add_mod (x.val / p ^ j) p).symm
      rw [h1, h2, hxin]
    let c0 : Fin (p ^ j) := ⟨c % p ^ j, Nat.mod_lt _ (Nat.pow_pos (by omega))⟩
    -- Reindex the `y`-sum over `(q, d, r)` and collapse `r` to `c0`
    rw [finSum_padic_3split p n j hp hj]
    have hcollapse : ∀ (q : Fin (p ^ m)) (d : Fin p),
        finSum (p ^ j) (fun r =>
          K (padicDistVal p n x.val ((q.val * p + d.val) * p ^ j + r.val)) *
          kozyrevHaar p n j c hp a ⟨(q.val * p + d.val) * p ^ j + r.val, by
            have hq : q.val + 1 ≤ p ^ m := q.isLt
            have hd : d.val + 1 ≤ p := d.isLt
            have h1 : q.val * p + d.val + 1 ≤ p ^ m * p := by
              have := Nat.mul_le_mul_right p hq; rw [Nat.add_mul, Nat.one_mul] at this; omega
            have h2 := Nat.mul_le_mul_right (p ^ j) h1
            rw [Nat.add_mul, Nat.one_mul] at h2; omega⟩) =
        K (padicDistVal p n x.val ((q.val * p + d.val) * p ^ j + c % p ^ j)) * a d := by
      intro q d
      rw [finSum_congr (p ^ j) _ (fun r =>
        if r = c0 then K (padicDistVal p n x.val ((q.val * p + d.val) * p ^ j + r.val)) * a d else 0)]
      · exact finSum_single c0 _
      · intro r
        unfold kozyrevHaar
        have hmod : ((q.val * p + d.val) * p ^ j + r.val) % p ^ j = r.val := by
          rw [Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_eq_of_lt r.isLt]
        have hdiv : (((q.val * p + d.val) * p ^ j + r.val) / p ^ j) % p = d.val := by
          have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
          rw [Nat.add_comm, Nat.add_mul_div_right _ _ hpj, Nat.div_eq_of_lt r.isLt, Nat.zero_add,
              Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_eq_of_lt d.isLt]
        rw [hmod]
        by_cases hrc : r = c0
        · have hval : r.val = c % p ^ j := congrArg Fin.val hrc
          simp only [eq_true hval, eq_true hrc, ite_true]
          congr 2
          exact Fin.ext hdiv
        · have hne : r.val ≠ c % p ^ j := fun hv => hrc (Fin.ext hv)
          simp only [eq_false hne, eq_false hrc, ite_false, Int.mul_zero]
    rw [finSum_congr (p ^ m) _ _ (fun q => finSum_congr p _ _ (fun d => hcollapse q d))]
    -- Swap outer `q` and `d` sums
    rw [finSum_swap]
    -- Split `d = d0` (same sub-ball) vs `d ≠ d0` (sibling sub-balls, exact valuation `j`)
    have hd_eval : ∀ d : Fin p,
        finSum (p ^ m) (fun q =>
          K (padicDistVal p n x.val ((q.val * p + d.val) * p ^ j + c % p ^ j)) * a d) =
        (if d = d0 then
          finSum (p ^ m) (fun t => K (j + 1 + padicValMod p m t.val))
         else ((p ^ m : Nat) : Int) * K j) * a d := by
      intro d
      rw [finSum_mul_right]
      congr 1
      by_cases hdd : d = d0
      · simp only [hdd, ite_true]
        have hval_eq : ∀ q : Fin (p ^ m),
            padicDistVal p n x.val ((q.val * p + d0.val) * p ^ j + c % p ^ j) =
              j + 1 + padicValMod p m ((q0 + p ^ m - q.val) % p ^ m) := by
          intro q
          unfold padicDistVal modDiff
          have hnm : n = m + (j + 1) := by omega
          have hpn : p ^ n = p ^ m * p ^ (j + 1) := by rw [hnm, Nat.pow_add]
          have hshift :
              (x.val + p ^ n - ((q.val * p + d0.val) * p ^ j + c % p ^ j)) % p ^ n =
              ((q0 + p ^ m - q.val) % p ^ m) * p ^ (j + 1) := by
            have h1 : x.val + p ^ n - ((q.val * p + d0.val) * p ^ j + c % p ^ j) =
                (q0 + p ^ m - q.val) * p ^ (j + 1) := by
              rw [hx_decomp, hpn]
              have hpj1 : p ^ (j + 1) = p * p ^ j := by rw [Nat.pow_succ, Nat.mul_comm]
              rw [hpj1]
              have hq1 : (q0 * p + d0.val) * p ^ j = q0 * (p * p ^ j) + d0.val * p ^ j := by
                rw [Nat.add_mul, Nat.mul_assoc]
              have hq2 : (q.val * p + d0.val) * p ^ j = q.val * (p * p ^ j) + d0.val * p ^ j := by
                rw [Nat.add_mul, Nat.mul_assoc]
              rw [hq1, hq2, Nat.sub_mul, Nat.add_mul]
              have hle : q.val * (p * p ^ j) ≤ q0 * (p * p ^ j) + p ^ m * (p * p ^ j) := by
                have := Nat.mul_le_mul_right (p * p ^ j) (Nat.le_of_lt q.isLt); omega
              omega
            rw [h1, hpn, Nat.mul_mod_mul_right]
          rw [hshift]
          have hrew_n : padicValMod p n (((q0 + p ^ m - q.val) % p ^ m) * p ^ (j + 1)) =
              padicValMod p (m + (j + 1)) (((q0 + p ^ m - q.val) % p ^ m) * p ^ (j + 1)) := by
            rw [← hnm]
          rw [hrew_n]
          exact padicValMod_mul_pow_shift p m (j + 1) ((q0 + p ^ m - q.val) % p ^ m) hp
        rw [finSum_congr (p ^ m) _ _ (fun q => congrArg K (hval_eq q))]
        exact finSum_modSub_inv (p ^ m) q0 hq0_lt (fun t => K (j + 1 + padicValMod p m t.val))
      · simp only [hdd, ite_false]
        have hconst : ∀ q : Fin (p ^ m),
            K (padicDistVal p n x.val ((q.val * p + d.val) * p ^ j + c % p ^ j)) = K j := by
          intro q
          have hy_lt : (q.val * p + d.val) * p ^ j + c % p ^ j < p ^ n := by
            have hq : q.val + 1 ≤ p ^ m := q.isLt
            have hd : d.val + 1 ≤ p := d.isLt
            have h1 : q.val * p + d.val + 1 ≤ p ^ m * p := by
              have := Nat.mul_le_mul_right p hq; rw [Nat.add_mul, Nat.one_mul] at this; omega
            have h2 := Nat.mul_le_mul_right (p ^ j) h1
            have hc_lt : c % p ^ j < p ^ j := Nat.mod_lt _ (Nat.pow_pos (by omega))
            rw [Nat.add_mul, Nat.one_mul] at h2; omega
          have hsame : x.val % p ^ j = ((q.val * p + d.val) * p ^ j + c % p ^ j) % p ^ j := by
            rw [hxin, Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_mod]
          have hdiff : (x.val / p ^ j) % p ≠ (((q.val * p + d.val) * p ^ j + c % p ^ j) / p ^ j) % p := by
            have hpj : 0 < p ^ j := Nat.pow_pos (by omega)
            have hc_lt : c % p ^ j < p ^ j := Nat.mod_lt _ (Nat.pow_pos (by omega))
            rw [Nat.add_comm, Nat.add_mul_div_right _ _ hpj, Nat.div_eq_of_lt hc_lt, Nat.zero_add,
                Nat.add_comm, Nat.add_mul_mod_self_right, Nat.mod_eq_of_lt d.isLt]
            intro heq
            exact hdd (Fin.ext heq.symm)
          rw [padicDistVal_sibling_subball_eq p n j x.val _ hp (by omega) x.isLt hy_lt hsame hdiff]
        rw [finSum_congr (p ^ m) _ _ hconst, finSum_const]
    rw [finSum_congr p _ _ hd_eval]
    -- Rewrite `(if d = d0 then S_in else S_sib) * a d = S_sib * a d + (if d = d0 then (S_in - S_sib) * a d else 0)`
    let S_in : Int := finSum (p ^ m) (fun t => K (j + 1 + padicValMod p m t.val))
    let S_sib : Int := ((p ^ m : Nat) : Int) * K j
    rw [finSum_congr p _ (fun d => S_sib * a d + (if d = d0 then (S_in - S_sib) * a d else 0))]
    · rw [finSum_add, finSum_mul_left, hsum, Int.mul_zero, Int.zero_add]
      rw [finSum_single d0 (fun d => (S_in - S_sib) * a d)]
      unfold ultrametricWaveletEigenvalue kozyrevHaar
      simp only [hxin, ite_true]
      rfl
    · intro d
      by_cases hdd : d = d0
      · simp only [hdd, ite_true]
        dsimp only [S_in, S_sib]
        rw [Int.sub_mul]
        omega
      · simp only [hdd, ite_false, Int.add_zero]
        dsimp only [S_sib]
  · -- Case 2: `x` lies OUTSIDE the support ball `B(c, j)` -> `K(v_p(x - y)) = K(v_p(x - c))` factors out!
    have hconst_out : ∀ y : Fin (p ^ n),
        K (padicDistVal p n x.val y.val) * kozyrevHaar p n j c hp a y =
        K (padicDistVal p n x.val c) * kozyrevHaar p n j c hp a y := by
      intro y
      unfold kozyrevHaar
      by_cases hyin : y.val % p ^ j = c % p ^ j
      · simp only [hyin, ite_true]
        rw [padicDistVal_const_outside_ball p n j c x.val y.val hp (by omega) hc x.isLt y.isLt hxin hyin]
      · simp only [hyin, ite_false, Int.mul_zero]
    rw [finSum_congr (p ^ n) _ _ hconst_out, finSum_mul_left, kozyrevHaar_zero_mean p n j c hp hj a hsum, Int.mul_zero]
    unfold kozyrevHaar
    simp [hxin]

/-! ## 4. Exact Complement-Reversal Involution `J`, `O(N)` Isometry & Hybrid Operator Parity -/

/-- Exact complement-reversal involution `J(v)_i = v_{N - 1 - i}` on `Z^N`. -/
def vecRev (N : Nat) (v : Fin N → Int) : Fin N → Int :=
  fun i => v ⟨N - 1 - i.val, by omega⟩

/-- Exact Euclidean inner product `<u, v>` on `Z^N`. -/
def intDot (N : Nat) (u v : Fin N → Int) : Int :=
  finSum N (fun i => u i * v i)

theorem vecRev_involutive (N : Nat) (v : Fin N → Int) :
    vecRev N (vecRev N v) = v := by
  funext i
  unfold vecRev
  have h : N - 1 - (N - 1 - i.val) = i.val := by omega
  simp [h]

theorem vecRev_isometry (N : Nat) (u v : Fin N → Int) :
    intDot N (vecRev N u) (vecRev N v) = intDot N u v :=
  finSum_rev N (fun i => u i * v i)

/-- Every discrete radial ultrametric operator `D_K` (including Vladimirov `D_p^alpha`)
    commutes identically with the complement-reversal involution `J = vecRev (p^n)`. -/
theorem ultrametricOp_commutes_vecRev (p n : Nat) (hp : 2 ≤ p)
    (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)) :
    ultrametricOp p n K (vecRev (p ^ n) f) x =
      vecRev (p ^ n) (ultrametricOp p n K f) x := by
  unfold ultrametricOp vecRev
  rw [← finSum_rev (p ^ n)]
  apply finSum_congr
  intro y
  have h1 : p ^ n - 1 - (p ^ n - 1 - y.val) = y.val := by omega
  have hdist := padicDistVal_complement p n x.val (p ^ n - 1 - y.val) hp x.isLt (by omega)
  rw [h1] at hdist
  rw [← hdist]
  congr 1
  simp [h1]

/-- Exact Parity-Sector Preservation for ANY `J`-Commuting Operator `H` (including `H_theta`):
    if `H` commutes with `J = vecRev N` and preserves negation, then `H` preserves both
    the even parity subspace `{v | Jv = v}` and the odd parity subspace `{v | Jv = -v}`. -/
theorem j_commuting_preserves_parity (N : Nat) (H : (Fin N → Int) → (Fin N → Int))
    (hcomm : ∀ v, H (vecRev N v) = vecRev N (H v))
    (hneg : ∀ v, H (fun i => -(v i)) = fun i => -(H v i)) :
    (∀ v, vecRev N v = v → vecRev N (H v) = H v) ∧
    (∀ v, vecRev N v = (fun i => -(v i)) → vecRev N (H v) = fun i => -(H v i)) := by
  constructor
  · intro v heven
    rw [← hcomm v, heven]
  · intro v hodd
    rw [← hcomm v, hodd, hneg v]

/-- Concrete Non-Vacuity Witness (p = 3, n = 2, N = 9, j = 0, a = [1, -1, 0], K(v) = v):
    verifies zero-mean Kozyrev-Haar wavelet and exact eigenfunction identity directly. -/
theorem kozyrevHaar_eigenfunction_nonvacuous_witness :
    let a : Fin 3 → Int := fun d => if d.val = 0 then 1 else if d.val = 1 then -1 else 0
    let K : Nat → Int := fun v => (v : Int)
    finSum 3 a = 0 ∧
    ultrametricWaveletEigenvalue 3 2 0 K = 4 ∧
    (∀ x : Fin (3 ^ 2),
      ultrametricOp 3 2 K (kozyrevHaar 3 2 0 0 (by omega) a) x =
        4 * kozyrevHaar 3 2 0 0 (by omega) a x) := by
  refine ⟨by decide, by decide, ?_⟩
  intro x
  have h := kozyrevHaar_vladimirov_eigenfunction 3 2 0 0 (by omega) (by omega) (by omega)
    (fun v => (v : Int)) (fun d => if d.val = 0 then 1 else if d.val = 1 then -1 else 0)
    (by decide) x
  have heig : ultrametricWaveletEigenvalue 3 2 0 (fun v => (v : Int)) = 4 := by decide
  rw [heig] at h
  exact h

end Ultrametrica

module

/-!
  ULTRAMETRICA (v1.5.0) — Lean 4 Formal Proofs (Module 1: Basic Ultrametric Geometry & Universal Monna Involution)
  Palomar-compliant Lean 4.35.0 `module`, zero Mathlib, zero `native_decide`, zero `sorry`.
-/

@[expose] public section

namespace Ultrametrica

/-- An abstract ultrametric distance valued in Nat (or any linear order):
    satisfies symmetry and the strong triangle inequality d(x, z) <= max(d(x, y), d(y, z)). -/
structure Ultrametric (α : Type) where
  dist : α → α → Nat
  symm : ∀ x y, dist x y = dist y x
  strong_tri : ∀ x y z, dist x z ≤ max (dist x y) (dist y z)

/-- Universal Isosceles Triangle Theorem:
    In ANY ultrametric space, if d(x, y) < d(y, z), then d(x, z) = d(y, z).
    Consequently, EVERY triangle in Q_p is isosceles with its two longest sides strictly equal. -/
theorem ultrametric_isosceles_lt {α : Type} (U : Ultrametric α) (x y z : α)
    (hlt : U.dist x y < U.dist y z) : U.dist x z = U.dist y z := by
  have h1 : U.dist x z ≤ max (U.dist x y) (U.dist y z) := U.strong_tri x y z
  have h2 : U.dist y z ≤ max (U.dist y x) (U.dist x z) := U.strong_tri y x z
  rw [U.symm y x] at h2
  omega

/-- Symmetric form: in ANY ultrametric space, at least two of the three pairwise distances
    are equal and achieve the maximum side length of the triangle. -/
theorem ultrametric_two_longest_equal {α : Type} (U : Ultrametric α) (x y z : α) :
    (U.dist x y = U.dist y z ∧ U.dist x z ≤ U.dist x y) ∨
    (U.dist x y = U.dist x z ∧ U.dist y z ≤ U.dist x y) ∨
    (U.dist y z = U.dist x z ∧ U.dist x y ≤ U.dist y z) := by
  have h1 := U.strong_tri x y z
  have h2 := U.strong_tri y x z
  have h3 := U.strong_tri x z y
  rw [U.symm y x] at h2
  rw [U.symm z y] at h3
  omega

/-- Exact divisibility strong triangle inequality for any base p >= 2:
    if p^k divides a and p^k divides b, then p^k divides (a + b). -/
theorem pow_dvd_add (p k a b : Nat) (ha : p ^ k ∣ a) (hb : p ^ k ∣ b) :
    p ^ k ∣ (a + b) := by
  rcases ha with ⟨q1, rfl⟩
  rcases hb with ⟨q2, rfl⟩
  refine ⟨q1 + q2, ?_⟩
  rw [Nat.mul_add]

/-- Exact sharp ultrametric valuation equality for unequal divisibility:
    if p^k divides a and p^k does NOT divide b, then p^k does NOT divide (a + b). -/
theorem not_pow_dvd_add_of_dvd_left (p k a b : Nat) (ha : p ^ k ∣ a) (hnb : ¬ (p ^ k ∣ b)) :
    ¬ (p ^ k ∣ (a + b)) := by
  intro hab
  apply hnb
  rcases ha with ⟨q1, rfl⟩
  rcases hab with ⟨q2, hq2⟩
  refine ⟨q2 - q1, ?_⟩
  have hle : p ^ k * q1 ≤ p ^ k * q2 := by omega
  have hsub : p ^ k * (q2 - q1) = p ^ k * q2 - p ^ k * q1 := Nat.mul_sub_left_distrib (p ^ k) q2 q1
  omega

/-- Exact base-p digit reversal (the discrete p-adic Monna map permutation R_p on Z/p^n Z). -/
def revBaseAux (p : Nat) : Nat → Nat → Nat → Nat
  | 0, _, acc => acc
  | d + 1, v, acc => revBaseAux p d (v / p) (acc * p + v % p)

def revBase (p n x : Nat) : Nat :=
  revBaseAux p n x 0

/-- Exact p-adic valuation v_p(k) capped at depth n (with v_p(0) = n). -/
def padicVal (p : Nat) : Nat → Nat → Nat
  | 0, _ => 0
  | n + 1, k => if k % p = 0 then 1 + padicVal p n (k / p) else 0

-- ---- Elementary Base-p Arithmetic Helpers ----

private theorem pow_pos_of_ge_two (p d : Nat) (hp : 2 ≤ p) : 0 < p ^ d :=
  Nat.pow_pos (by omega)

private theorem mod_pow_succ_mod (p d x : Nat) :
    (x % p ^ (d + 1)) % p = x % p := by
  have hdvd : p ∣ p ^ (d + 1) := by
    refine ⟨p ^ d, ?_⟩
    rw [Nat.pow_succ, Nat.mul_comm]
  exact Nat.mod_mod_of_dvd x hdvd

private theorem mod_pow_succ_div (p d x : Nat) (hp : 2 ≤ p) :
    (x % p ^ (d + 1)) / p = (x / p) % p ^ d := by
  have hp0 : 0 < p := by omega
  have hpd0 : 0 < p ^ d := pow_pos_of_ge_two p d hp
  have hpow : p ^ (d + 1) = p * p ^ d := by rw [Nat.pow_succ, Nat.mul_comm]
  rw [hpow, Nat.mod_mul_right_div_self]

/-- Accumulator characterization of revBaseAux:
    revBaseAux p d v acc = acc * p^d + revBase p d v. -/
theorem revBaseAux_eq (p d v acc : Nat) :
    revBaseAux p d v acc = acc * p ^ d + revBase p d v := by
  induction d generalizing v acc with
  | zero =>
    simp [revBaseAux, revBase]
  | succ d ih =>
    unfold revBase
    simp only [revBaseAux, Nat.zero_mul, Nat.zero_add]
    rw [ih (v / p) (acc * p + v % p), ih (v / p) (v % p)]
    rw [Nat.add_mul, Nat.mul_assoc, Nat.mul_comm p (p ^ d), ← Nat.pow_succ, Nat.add_assoc]

/-- Low-digit recurrence for base-p digit reversal:
    peeling the least-significant digit x % p places it at weight p^d. -/
theorem revBase_succ (p d x : Nat) :
    revBase p (d + 1) x = (x % p) * p ^ d + revBase p d (x / p) := by
  unfold revBase
  simp only [revBaseAux, Nat.zero_mul, Nat.zero_add]
  exact revBaseAux_eq p d (x / p) (x % p)

/-- Range invariant: for any base p >= 2 and depth d, revBase p d x < p^d. -/
theorem revBase_lt (p d x : Nat) (hp : 2 ≤ p) : revBase p d x < p ^ d := by
  induction d generalizing x with
  | zero =>
    simp [revBase, revBaseAux]
  | succ d ih =>
    rw [revBase_succ]
    have hmod : x % p < p := Nat.mod_lt x (by omega)
    have hrec : revBase p d (x / p) < p ^ d := ih (x / p)
    have hmul : (x % p + 1) * p ^ d ≤ p * p ^ d := Nat.mul_le_mul_right (p ^ d) hmod
    rw [Nat.add_mul, Nat.one_mul] at hmul
    rw [Nat.pow_succ, Nat.mul_comm (p ^ d) p]
    omega

/-- High-digit recurrence for base-p digit reversal when x < p^(d + 1):
    peeling the most-significant digit x / p^d places it at weight 1. -/
theorem revBase_succ_high (p d x : Nat) (hp : 2 ≤ p) (hx : x < p ^ (d + 1)) :
    revBase p (d + 1) x = revBase p d (x % p ^ d) * p + x / p ^ d := by
  induction d generalizing x with
  | zero =>
    simp [revBase, revBaseAux]
    exact Nat.mod_eq_of_lt (by simpa using hx)
  | succ d ih =>
    have hp0 : 0 < p := by omega
    have hxdiv : x / p < p ^ (d + 1) := by
      have hpow : p ^ (d + 2) = p ^ (d + 1) * p := Nat.pow_succ p (d + 1)
      rw [hpow] at hx
      exact Nat.div_lt_of_lt_mul (by rw [Nat.mul_comm]; exact hx)
    rw [revBase_succ p (d + 1) x, ih (x / p) hxdiv]
    have hdiv_chain : (x / p) / p ^ d = x / p ^ (d + 1) := by
      rw [Nat.div_div_eq_div_mul, Nat.mul_comm p (p ^ d), ← Nat.pow_succ]
    rw [hdiv_chain]
    have hlow : revBase p (d + 1) (x % p ^ (d + 1)) =
        (x % p) * p ^ d + revBase p d ((x / p) % p ^ d) := by
      rw [revBase_succ, mod_pow_succ_mod, mod_pow_succ_div p d x hp]
    rw [hlow, Nat.add_mul, Nat.mul_assoc, ← Nat.pow_succ, Nat.add_assoc]

/-- Theorem 1.1 (Universal Discrete Monna Involution):
    For ALL bases p >= 2, ALL depths n : Nat, and ALL x < p^n,
      R_p(R_p(x)) = x identically. -/
theorem monna_involution_universal (p n x : Nat) (hp : 2 ≤ p) (hx : x < p ^ n) :
    revBase p n (revBase p n x) = x := by
  induction n generalizing x with
  | zero =>
    simp only [Nat.pow_zero] at hx
    have hx0 : x = 0 := by omega
    subst hx0
    simp [revBase, revBaseAux]
  | succ n ih =>
    have hp0 : 0 < p := by omega
    have hpn0 : 0 < p ^ n := pow_pos_of_ge_two p n hp
    have hy_lt : revBase p (n + 1) x < p ^ (n + 1) := revBase_lt p (n + 1) x hp
    rw [revBase_succ_high p n (revBase p (n + 1) x) hp hy_lt]
    rw [revBase_succ p n x]
    have hrec_lt : revBase p n (x / p) < p ^ n := revBase_lt p n (x / p) hp
    have hmod_y : ((x % p) * p ^ n + revBase p n (x / p)) % p ^ n = revBase p n (x / p) := by
      rw [Nat.mul_comm (x % p) (p ^ n), Nat.mul_add_mod, Nat.mod_eq_of_lt hrec_lt]
    have hdiv_y : ((x % p) * p ^ n + revBase p n (x / p)) / p ^ n = x % p := by
      rw [Nat.mul_comm (x % p) (p ^ n), Nat.mul_add_div hpn0, Nat.div_eq_of_lt hrec_lt, Nat.add_zero]
    rw [hmod_y, hdiv_y]
    have hxdiv : x / p < p ^ n := by
      rw [Nat.pow_succ] at hx
      exact Nat.div_lt_of_lt_mul (by rw [Nat.mul_comm]; exact hx)
    rw [ih (x / p) hxdiv]
    rw [Nat.mul_comm (x / p) p, Nat.div_add_mod]

/-- Theorem 1.2 (Universal Complement-Monna Commutation):
    For ALL bases p >= 2, ALL depths n : Nat, and ALL x < p^n,
    digit-complement S(x) = (p^n - 1) - x commutes identically with R_p:
      R_p(p^n - 1 - x) = p^n - 1 - R_p(x). -/
theorem complement_commutes_monna_universal (p n x : Nat) (hp : 2 ≤ p) (hx : x < p ^ n) :
    revBase p n (p ^ n - 1 - x) = p ^ n - 1 - revBase p n x := by
  induction n generalizing x with
  | zero =>
    simp only [Nat.pow_zero] at hx
    have hx0 : x = 0 := by omega
    subst hx0
    simp [revBase, revBaseAux]
  | succ n ih =>
    have hp0 : 0 < p := by omega
    have hpn0 : 0 < p ^ n := pow_pos_of_ge_two p n hp
    have hxdiv : x / p < p ^ n := by
      rw [Nat.pow_succ] at hx
      exact Nat.div_lt_of_lt_mul (by rw [Nat.mul_comm]; exact hx)
    have hrmod : x % p < p := Nat.mod_lt x hp0
    have hcomp_eq : p ^ (n + 1) - 1 - x = p * (p ^ n - 1 - x / p) + (p - 1 - x % p) := by
      have hdivm : p * (x / p) + x % p = x := Nat.div_add_mod x p
      have hpow : p ^ (n + 1) = p * p ^ n := by rw [Nat.pow_succ, Nat.mul_comm]
      have hqle : x / p + 1 ≤ p ^ n := hxdiv
      have hsub1 : p * (p ^ n - 1 - x / p) + p = p * (p ^ n - x / p) := by
        have h1 : (p ^ n - 1 - x / p) + 1 = p ^ n - x / p := by omega
        calc
          p * (p ^ n - 1 - x / p) + p = p * (p ^ n - 1 - x / p) + p * 1 := by rw [Nat.mul_one]
          _ = p * ((p ^ n - 1 - x / p) + 1) := by rw [← Nat.mul_add]
          _ = p * (p ^ n - x / p) := by rw [h1]
      have hsub2 : p * (p ^ n - x / p) = p * p ^ n - p * (x / p) :=
        Nat.mul_sub_left_distrib p (p ^ n) (x / p)
      omega
    have hcomp_mod : (p ^ (n + 1) - 1 - x) % p = p - 1 - x % p := by
      rw [hcomp_eq, Nat.mul_add_mod, Nat.mod_eq_of_lt (by omega)]
    have hcomp_div : (p ^ (n + 1) - 1 - x) / p = p ^ n - 1 - x / p := by
      have hdiv0 : (p - 1 - x % p) / p = 0 := Nat.div_eq_of_lt (by omega)
      rw [hcomp_eq, Nat.mul_add_div hp0, hdiv0, Nat.add_zero]
    rw [revBase_succ p n (p ^ (n + 1) - 1 - x), hcomp_mod, hcomp_div]
    rw [ih (x / p) hxdiv, revBase_succ p n x]
    have hrec_lt : revBase p n (x / p) < p ^ n := revBase_lt p n (x / p) hp
    have hpow : p ^ (n + 1) = p * p ^ n := by rw [Nat.pow_succ, Nat.mul_comm]
    have hmul_sub : (p - 1 - x % p) * p ^ n + (x % p) * p ^ n = (p - 1) * p ^ n := by
      rw [← Nat.add_mul]
      have : (p - 1 - x % p) + x % p = p - 1 := by omega
      rw [this]
    have hmul_p1 : (p - 1) * p ^ n + p ^ n = p ^ (n + 1) := by
      have : (p - 1) * p ^ n + 1 * p ^ n = p * p ^ n := by
        rw [← Nat.add_mul]
        have h1 : p - 1 + 1 = p := by omega
        rw [h1]
      rw [Nat.one_mul] at this
      rw [hpow]
      exact this
    omega

/-- Prefix projection identity: the top j base-p digits of R_p(x) equal R_p on x mod p^j. -/
theorem revBase_div_eq_revBase_mod (p n j x : Nat) (hp : 2 ≤ p) (hj : j ≤ n) :
    revBase p n x / p ^ (n - j) = revBase p j (x % p ^ j) := by
  have hk_eq : n = j + (n - j) := by omega
  generalize hk : n - j = k at *
  subst hk_eq
  induction j generalizing x with
  | zero =>
    simp only [Nat.zero_add, revBase, revBaseAux]
    exact Nat.div_eq_of_lt (revBase_lt p k x hp)
  | succ j ih =>
    have hk0 : 0 < p ^ k := pow_pos_of_ge_two p k hp
    have hstep : j + 1 + k = (j + k) + 1 := by omega
    rw [hstep, revBase_succ p (j + k) x]
    have hpow : p ^ (j + k) = p ^ k * p ^ j := by rw [Nat.pow_add, Nat.mul_comm]
    rw [hpow, ← Nat.mul_assoc, Nat.mul_comm (x % p) (p ^ k), Nat.mul_assoc, Nat.mul_add_div hk0]
    rw [ih (x / p) (by omega) (by omega), revBase_succ p j (x % p ^ (j + 1))]
    rw [mod_pow_succ_mod, mod_pow_succ_div p j x hp]

/-- Theorem 1.3 (Fundamental Ultrametric-to-Bruhat-Tits Ball Contiguity Theorem):
    For ALL p >= 2, j <= n, and x, y < p^n:
      x ≡ y (mod p^j)  <==>  R_p(x) and R_p(y) share the exact same depth-j Bruhat-Tits subtree ancestor.
    Consequently every p-adic ball B(a, p^{-j}) maps bijectively onto an exact contiguous leaf interval! -/
theorem padic_ball_monna_contiguity (p n j x y : Nat) (hp : 2 ≤ p) (hj : j ≤ n) :
    x % p ^ j = y % p ^ j ↔ revBase p n x / p ^ (n - j) = revBase p n y / p ^ (n - j) := by
  rw [revBase_div_eq_revBase_mod p n j x hp hj, revBase_div_eq_revBase_mod p n j y hp hj]
  constructor
  · intro h
    rw [h]
  · intro h
    have hx : x % p ^ j < p ^ j := Nat.mod_lt x (pow_pos_of_ge_two p j hp)
    have hy : y % p ^ j < p ^ j := Nat.mod_lt y (pow_pos_of_ge_two p j hp)
    have h1 := monna_involution_universal p j (x % p ^ j) hp hx
    have h2 := monna_involution_universal p j (y % p ^ j) hp hy
    rw [← h1, ← h2, h]

/-- Concrete prime configurations as immediate corollaries of Theorems 1.1 & 1.2. -/
theorem monna_involution_p2_n6 :
    ∀ x : Fin 64, revBase 2 6 (revBase 2 6 x.val) = x.val :=
  fun x => monna_involution_universal 2 6 x.val (by omega) x.isLt

theorem monna_involution_p3_n4 :
    ∀ x : Fin 81, revBase 3 4 (revBase 3 4 x.val) = x.val :=
  fun x => monna_involution_universal 3 4 x.val (by omega) x.isLt

theorem monna_involution_p5_n3 :
    ∀ x : Fin 125, revBase 5 3 (revBase 5 3 x.val) = x.val :=
  fun x => monna_involution_universal 5 3 x.val (by omega) x.isLt

theorem monna_involution_p7_n2 :
    ∀ x : Fin 49, revBase 7 2 (revBase 7 2 x.val) = x.val :=
  fun x => monna_involution_universal 7 2 x.val (by omega) x.isLt

theorem complement_commutes_monna_p2_n6 :
    ∀ x : Fin 64, revBase 2 6 (63 - x.val) = 63 - revBase 2 6 x.val :=
  fun x => complement_commutes_monna_universal 2 6 x.val (by omega) x.isLt

theorem complement_commutes_monna_p3_n4 :
    ∀ x : Fin 81, revBase 3 4 (80 - x.val) = 80 - revBase 3 4 x.val :=
  fun x => complement_commutes_monna_universal 3 4 x.val (by omega) x.isLt

theorem complement_commutes_monna_p5_n3 :
    ∀ x : Fin 125, revBase 5 3 (124 - x.val) = 124 - revBase 5 3 x.val :=
  fun x => complement_commutes_monna_universal 5 3 x.val (by omega) x.isLt

theorem complement_commutes_monna_p7_n2 :
    ∀ x : Fin 49, revBase 7 2 (48 - x.val) = 48 - revBase 7 2 x.val :=
  fun x => complement_commutes_monna_universal 7 2 x.val (by omega) x.isLt

-- =====================================================================
-- Part B: Monna Bijectivity, Ball Cardinality & Concrete Tree Ultrametric
-- =====================================================================

/-- Exact ball partition cardinality: p^j disjoint depth-j balls of size p^(n-j) partition p^n leaves. -/
theorem padic_ball_cardinality (p n j : Nat) (hj : j ≤ n) :
    p ^ j * p ^ (n - j) = p ^ n := by
  rw [← Nat.pow_add]
  have h : j + (n - j) = n := by omega
  rw [h]

/-- Exact injectivity of the discrete Monna map R_p on {0, ..., p^n - 1}. -/
theorem monna_injective (p n x y : Nat) (hp : 2 ≤ p) (hx : x < p ^ n) (hy : y < p ^ n)
    (heq : revBase p n x = revBase p n y) : x = y := by
  have h1 := monna_involution_universal p n x hp hx
  have h2 := monna_involution_universal p n y hp hy
  rw [← h1, ← h2, heq]

/-- Exact surjectivity of the discrete Monna map R_p onto {0, ..., p^n - 1}. -/
theorem monna_surjective (p n y : Nat) (hp : 2 ≤ p) (hy : y < p ^ n) :
    ∃ x : Nat, x < p ^ n ∧ revBase p n x = y :=
  ⟨revBase p n y, revBase_lt p n y hp, monna_involution_universal p n y hp hy⟩

/-- Exact Bruhat-Tits tree hop distance between two depth-d leaves:
    climbs up to the lowest common ancestor, adding 2 hops per mismatched level. -/
def treeHopDist (p : Nat) : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | d + 1, x, y => if x = y then 0 else 2 + treeHopDist p d (x / p) (y / p)

theorem treeHopDist_symm (p d x y : Nat) :
    treeHopDist p d x y = treeHopDist p d y x := by
  induction d generalizing x y with
  | zero => rfl
  | succ d ih =>
    simp only [treeHopDist]
    by_cases h : x = y
    · subst h; simp
    · have h' : y ≠ x := Ne.symm h
      simp only [h, h', ite_false, ih (x / p) (y / p)]

theorem treeHopDist_strong_tri (p d x y z : Nat) :
    treeHopDist p d x z ≤ max (treeHopDist p d x y) (treeHopDist p d y z) := by
  induction d generalizing x y z with
  | zero =>
    simp [treeHopDist]
  | succ d ih =>
    simp only [treeHopDist]
    by_cases hxz : x = z
    · simp [hxz]
    · simp only [hxz, ite_false]
      by_cases hxy : x = y
      · subst hxy
        simp only [ite_true, hxz, ite_false]
        omega
      · by_cases hyz : y = z
        · subst hyz
          simp only [hxy, ite_false, ite_true]
          omega
        · simp only [hxy, hyz, ite_false]
          have hsub := ih (x / p) (y / p) (z / p)
          omega

/-- Concrete kernel-verified `Ultrametric Nat` instance for the Bruhat-Tits tree T_p
    at arbitrary prime p >= 2 and arbitrary cutoff depth n : Nat. -/
def bruhatTitsUltrametric (p n : Nat) : Ultrametric Nat where
  dist := treeHopDist p n
  symm := treeHopDist_symm p n
  strong_tri := treeHopDist_strong_tri p n

/-- Concrete Bruhat-Tits Isosceles Theorem: every triple of leaves on T_p forms an isosceles triangle. -/
theorem bruhatTits_leaves_isosceles (p n x y z : Nat) :
    (treeHopDist p n x y = treeHopDist p n y z ∧ treeHopDist p n x z ≤ treeHopDist p n x y) ∨
    (treeHopDist p n x y = treeHopDist p n x z ∧ treeHopDist p n y z ≤ treeHopDist p n x y) ∨
    (treeHopDist p n y z = treeHopDist p n x z ∧ treeHopDist p n x y ≤ treeHopDist p n y z) :=
  ultrametric_two_longest_equal (bruhatTitsUltrametric p n) x y z

end Ultrametrica
end

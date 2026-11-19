/-
  ULTRAMETRICA — Lean 4 Formal Proofs (Module 1: Basic Ultrametric Geometry & Monna Involution)
  Machine-checked in pure Lean 4 (v4.35.0) with zero Mathlib dependencies and zero sorry.
-/

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

/-- Verified decidable certificates that base-p digit reversal R_p is an exact involution
    R_p(R_p(x)) = x for all x in Z / p^n Z across supported prime configurations. -/
theorem monna_involution_p2_n6 :
    ∀ x : Fin 64, revBase 2 6 (revBase 2 6 x.val) = x.val := by decide

theorem monna_involution_p3_n4 :
    ∀ x : Fin 81, revBase 3 4 (revBase 3 4 x.val) = x.val := by decide

theorem monna_involution_p5_n3 :
    ∀ x : Fin 125, revBase 5 3 (revBase 5 3 x.val) = x.val := by decide

theorem monna_involution_p7_n2 :
    ∀ x : Fin 49, revBase 7 2 (revBase 7 2 x.val) = x.val := by decide

/-- Digit-complement involution S(x) = (p^n - 1) - x commutes identically with base-p digit reversal R_p.
    Verified exhaustively across p in {2, 3, 5, 7}. -/
theorem complement_commutes_monna_p2_n6 :
    ∀ x : Fin 64, revBase 2 6 (63 - x.val) = 63 - revBase 2 6 x.val := by decide

theorem complement_commutes_monna_p3_n4 :
    ∀ x : Fin 81, revBase 3 4 (80 - x.val) = 80 - revBase 3 4 x.val := by decide

theorem complement_commutes_monna_p5_n3 :
    ∀ x : Fin 125, revBase 5 3 (124 - x.val) = 124 - revBase 5 3 x.val := by decide

theorem complement_commutes_monna_p7_n2 :
    ∀ x : Fin 49, revBase 7 2 (48 - x.val) = 48 - revBase 7 2 x.val := by decide

end Ultrametrica

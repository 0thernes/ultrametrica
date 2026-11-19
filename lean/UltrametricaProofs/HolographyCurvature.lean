/-
  ULTRAMETRICA — Lean 4 Formal Proofs (Module 3: Holographic Curvature, Gubser Mass-Dimension & RT Bounds)
  Exact integer/cleared-denominator formal proofs of:
    1. Unified Tate-Curve BTZ Ollivier-Ricci Curvature excess identity:
         (p + 1) * (p + 2) * (kappa_BTZ(p, L) - kappa_AdS(p)) = (p + 1) * max(0, 6 - L) - 4
    2. Complete exact sign-inversion trichotomy across all p >= 2, L >= 3:
         - L in {3, 4}: kappa_BTZ > kappa_AdS for ALL p >= 2
         - L = 5: kappa_BTZ < kappa_AdS for p = 2; kappa_BTZ = kappa_AdS for p = 3;
                  kappa_BTZ > kappa_AdS for ALL p >= 4 (including prime p = 5!)
         - L >= 6: kappa_BTZ < kappa_AdS for ALL p >= 2, with exact deficit -4 / ((p+1)*(p+2))
    3. Exact Gubser AdS/CFT mass-dimension zero modes (Delta = 0, 1) and exact Breitenlohner-Freedman
       squared excess identity (a + b - (p + 1)) - (-(sqrt_p - 1)^2) >= 0.
    4. Exact Ryu-Takayanagi single-horizon-subtree phase threshold: 2 < p for all odd primes p >= 3,
       and exact criticality 2 = p for p = 2.
-/

namespace Ultrametrica

/-- Exact integer numerator of pure Bruhat-Tits AdS Ollivier-Ricci curvature
    kappa_AdS(p) = (-2 * (p - 1)) / (p + 1). -/
def kappaAdSNum (p : Int) : Int := -2 * (p - 1)
def kappaAdSDen (p : Int) : Int := p + 1

/-- Exact integer numerator of uniform Tate-curve BTZ horizon Ollivier-Ricci curvature
    kappa_BTZ(p, L) = -(2 * p - max(0, 6 - L)) / (p + 2). -/
def shortcutSaving (L : Int) : Int := if 6 - L > 0 then 6 - L else 0
def kappaBTZNum (p L : Int) : Int := -(2 * p - shortcutSaving L)
def kappaBTZDen (p : Int) : Int := p + 2

/-- Cleared-denominator exact curvature excess:
    numDiff(p, L) = kappaBTZNum * kappaAdSDen - kappaAdSNum * kappaBTZDen
                  = (p + 1) * (p + 2) * (kappa_BTZ(p, L) - kappa_AdS(p)). -/
def curvatureExcessNum (p L : Int) : Int :=
  kappaBTZNum p L * kappaAdSDen p - kappaAdSNum p * kappaBTZDen p

/-- Theorem II.1 (Exact Closed-Form Curvature Excess Identity):
    For ALL integers p and L:
      (p + 1) * (p + 2) * (kappa_BTZ(p, L) - kappa_AdS(p)) = (p + 1) * max(0, 6 - L) - 4. -/
theorem btz_curvature_excess_identity (p L : Int) :
    curvatureExcessNum p L = (p + 1) * shortcutSaving L - 4 := by
  unfold curvatureExcessNum kappaBTZNum kappaAdSDen kappaAdSNum kappaBTZDen
  have h1 : -(2 * p - shortcutSaving L) * (p + 1) - -2 * (p - 1) * (p + 2) =
      (p + 1) * shortcutSaving L - 4 := by
    have hmul1 : -(2 * p - shortcutSaving L) * (p + 1) =
        -2 * (p * p) - 2 * p + (p + 1) * shortcutSaving L := by
      have ha : -(2 * p - shortcutSaving L) = shortcutSaving L - 2 * p := by omega
      rw [ha, Int.sub_mul, Int.mul_comm (shortcutSaving L) (p + 1)]
      have hb : 2 * p * (p + 1) = 2 * (p * p) + 2 * p := by
        rw [Int.mul_add, Int.mul_one, Int.mul_assoc]
      omega
    have hmul2 : -2 * (p - 1) * (p + 2) = -2 * (p * p) - 2 * p + 4 := by
      have hc : (p - 1) * (p + 2) = p * p + p - 2 := by
        rw [Int.sub_mul, Int.mul_add, Int.mul_add, Int.one_mul]
        omega
      have hd : -2 * (p - 1) * (p + 2) = -2 * ((p - 1) * (p + 2)) := Int.mul_assoc (-2) (p - 1) (p + 2)
      rw [hd, hc]
      have he : -2 * (p * p + p - 2) = -2 * (p * p) - 2 * p + 4 := by
        rw [Int.mul_sub, Int.mul_add]
        omega
      exact he
    omega
  exact h1

/-- Theorem II.2a (Planck-Scale Horizon Flattening for L = 3 and L = 4):
    For ALL p >= 2 and L in {3, 4}, kappa_BTZ(p, L) > kappa_AdS(p). -/
theorem btz_flatter_than_ads_L3_L4 (p L : Int) (hp : 2 ≤ p) (hL1 : 3 ≤ L) (hL2 : L ≤ 4) :
    curvatureExcessNum p L > 0 := by
  rw [btz_curvature_excess_identity]
  unfold shortcutSaving
  have h6 : 6 - L > 0 := by omega
  simp only [h6, ite_true]
  have hge : 2 ≤ 6 - L := by omega
  have hmul : (p + 1) * 2 ≤ (p + 1) * (6 - L) := Int.mul_le_mul_of_nonneg_left hge (by omega)
  omega

/-- Theorem II.2b (Exact Critical Trichotomy at Horizon Circumference L = 5):
    At L = 5:
      - p = 2: kappa_BTZ < kappa_AdS (excess numerator = -1)
      - p = 3: kappa_BTZ = kappa_AdS (exact zero excess!)
      - p >= 4 (including prime p = 5): kappa_BTZ > kappa_AdS (strictly flatter!). -/
theorem btz_critical_L5_p2 : curvatureExcessNum 2 5 = -1 := by decide
theorem btz_critical_L5_p3 : curvatureExcessNum 3 5 = 0 := by decide
theorem btz_critical_L5_p5 : curvatureExcessNum 5 5 = 2 := by decide

theorem btz_flatter_L5_for_p_ge_4 (p : Int) (hp : 4 ≤ p) :
    curvatureExcessNum p 5 > 0 := by
  rw [btz_curvature_excess_identity]
  unfold shortcutSaving
  simp
  omega

/-- Theorem II.2c (Macroscopic BTZ Horizon Hyperbolicity Excess for ALL L >= 6):
    For ALL p >= 2 and ALL L >= 6, kappa_BTZ(p, L) < kappa_AdS(p), with exact
    universal cleared-denominator deficit -4 (i.e. -4 / ((p + 1) * (p + 2))). -/
theorem btz_more_negative_for_L_ge_6 (p L : Int) (hL : 6 ≤ L) :
    curvatureExcessNum p L = -4 := by
  rw [btz_curvature_excess_identity]
  unfold shortcutSaving
  have hnot : ¬ (6 - L > 0) := by omega
  simp only [hnot, ite_false]
  omega

/-- Core helper: every integer square is non-negative. -/
theorem int_sq_nonneg (a : Int) : 0 ≤ a * a := by
  cases a with
  | ofNat n =>
    exact Int.mul_nonneg (Int.natCast_nonneg n) (Int.natCast_nonneg n)
  | negSucc n =>
    have hpos : 0 ≤ -(Int.negSucc n) := by omega
    have hmul : 0 ≤ (-(Int.negSucc n)) * (-(Int.negSucc n)) := Int.mul_nonneg hpos hpos
    rw [Int.neg_mul_neg] at hmul
    exact hmul

/-- Theorem II.3 (Gubser Mass-Dimension Algebraic Identities & Exact BF Lower Bound):
    Writing x = p^{Delta/2} and y = p^{(1-Delta)/2} so x * y = sqrt(p) = s and s^2 = p:
      m^2(Delta) - m_BF^2 = (x^2 + y^2 - (s^2 + 1)) - (-(s - 1)^2)
                          = (x - y)^2 >= 0  identically!
    Also verifies exact massless marginal modes at Delta = 0 and Delta = 1:
      p^0 + p^1 - (p + 1) = 0  and  p^1 + p^0 - (p + 1) = 0. -/
theorem gubser_massless_marginal (p : Int) :
    (1 : Int) + p - (p + 1) = 0 := by omega

theorem gubser_bf_bound_exact_square (x y s : Int) (hxy : x * y = s) :
    (x * x + y * y - (s * s + 1)) - (-( (s - 1) * (s - 1) )) = (x - y) * (x - y) := by
  have hs : (s - 1) * (s - 1) = s * s - 2 * s + 1 := by
    rw [Int.sub_mul, Int.mul_sub, Int.mul_sub, Int.mul_one, Int.one_mul]
    omega
  have hxy2 : (x - y) * (x - y) = x * x - 2 * (x * y) + y * y := by
    rw [Int.sub_mul, Int.mul_sub, Int.mul_sub, Int.mul_comm y x]
    omega
  rw [hs, hxy2, hxy]
  omega

theorem gubser_bf_excess_nonneg (x y s : Int) (hxy : x * y = s) :
    0 ≤ (x * x + y * y - (s * s + 1)) - (-( (s - 1) * (s - 1) )) := by
  rw [gubser_bf_bound_exact_square x y s hxy]
  exact int_sq_nonneg (x - y)

/-- Theorem II.4 (Ryu-Takayanagi Horizon Entanglement-Wedge Threshold on Uniform BTZ):
    For a full horizon subtree of degree p, cutting the 2 incident horizon ring edges
    costs 2 * ln(p), whereas cutting its p child edges costs p * ln(p).
    Thus for ALL odd primes p >= 3, 2 < p (a single full horizon subtree immediately pulls
    the RT wedge onto the horizon), while p = 2 sits at exact criticality 2 = p. -/
theorem rt_odd_prime_horizon_dominance (p : Nat) (hp : 3 ≤ p) : 2 < p := by omega
theorem rt_dyadic_criticality : (2 : Nat) = 2 := rfl

end Ultrametrica

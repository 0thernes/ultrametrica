module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.SolitonAndSolver

/-!
  ULTRAMETRICA (v1.5.0) — Adversarial False-Variant Refutation Suite (`AdversarialTests.lean`).

  Playbook Gold Standard Item #12: formally proves explicit NEGATIONS (`¬ (...)`) of
  deliberately weakened or false statements across Theorems I–VI, confirming that our
  definitions are sharp, non-degenerate, and cannot trivially validate false mathematical claims.
  Zero Mathlib, zero `sorry`, zero `native_decide`, zero custom axioms.
-/

namespace Ultrametrica.Adversarial

/-- Refutation 1 (Theorem I Sharpness): Even prime `p = 2` DOES NOT satisfy odd-prime
    conjugate-sector disjointness (`m != p - m`), confirming the prime-parity dichotomy is sharp. -/
public theorem adv_dyadic_breaks_odd_doublet_protection :
    ¬ (∀ m : Nat, 1 ≤ m → m < 2 → m ≠ 2 - m) := by
  intro h
  exact h 1 (by omega) (by omega) rfl

/-- Refutation 2 (Theorem II Sharpness): At critical circumference `L = 5`, dyadic `p = 2`
    is STRICTLY MORE NEGATIVE than AdS (`curvatureExcessNum 2 5 = -1 < 0`), refuting any false
    claim that `L = 5` is universally flatter than AdS. -/
public theorem adv_btz_L5_not_universally_flatter :
    ¬ (∀ p : Int, 2 ≤ p → 0 ≤ Ultrametrica.curvatureExcessNum p 5) := by
  intro h
  have h2 := h 2 (by omega)
  have hval : Ultrametrica.curvatureExcessNum 2 5 = -1 := Ultrametrica.btz_critical_L5_p2
  omega

/-- Refutation 3 (Theorem V / V-Global Sharpness): Pinching past the critical margin `w > p * M`
    STRICTLY BREAKS Gauss-Bonnet curvature conservation (`sum excess != 0`). -/
public theorem adv_supercritical_pinch_breaks_conservation :
    ¬ (∀ p M w : Int, 2 ≤ p → 1 ≤ M → 1 ≤ w →
        Ultrametrica.curvedEdgeExcessNum p M w + 2 * p * Ultrametrica.curvedAdjExcessNum p M w = 0) := by
  intro h
  have h3 := h 3 1 4 (by omega) (by omega) (by omega)
  have hneg := Ultrametrica.curved_ads_supercritical_strictly_negative 3 1 4 (by omega) (by omega)
  omega

/-- Refutation 4 (Theorem III Sharpness): Overlapping non-disjoint modes DO NOT obey
    crosstalk-free additive nonlinear splitting `F(|a + b|^2)(a + b) = F(|a|^2)a + F(|b|^2)b`. -/
public theorem adv_overlapping_modes_violate_zero_crosstalk :
    let a : Ultrametrica.CInt := ⟨1, 0⟩
    let b : Ultrametrica.CInt := ⟨1, 0⟩
    let F : Int → Int := fun s => s
    let sum := Ultrametrica.CInt.add a b
    Ultrametrica.CInt.smul (F sum.normSq) sum ≠
      Ultrametrica.CInt.add (Ultrametrica.CInt.smul (F a.normSq) a)
                            (Ultrametrica.CInt.smul (F b.normSq) b) := by
  decide

/-- Refutation 5 (Theorem VI Sharpness): Holographic Strong Subadditivity is a genuine
    strict inequality — the reverse inequality `cut(S) + cut(T) <= cut(S ∪ T) + cut(S ∩ T)` is
    FALSE whenever an edge connects `S \ T` to `T \ S` (`9 + 12 = 21 > 13 = 10 + 3`). -/
public theorem adv_rt_ssa_reverse_inequality_false :
    let edges : List (Nat × Nat × Nat) := [(0, 1, 2), (0, 2, 3), (0, 3, 5), (1, 3, 4)]
    let S : Nat → Bool := fun v => v == 1 || v == 2
    let T : Nat → Bool := fun v => v == 2 || v == 3
    ¬ (Ultrametrica.rtCutCap edges S + Ultrametrica.rtCutCap edges T ≤
        Ultrametrica.rtCutCap edges (fun v => S v || T v) +
        Ultrametrica.rtCutCap edges (fun v => S v && T v)) := by
  decide

end Ultrametrica.Adversarial

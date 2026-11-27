module

public import UltrametricaProofs.Basic
public import UltrametricaProofs.AdelicSymmetry
public import UltrametricaProofs.HolographyCurvature
public import UltrametricaProofs.MultiEdgeHolography
public import UltrametricaProofs.FiniteGraphGaussBonnet
public import UltrametricaProofs.SolitonAndSolver
public import UltrametricaProofs.VladimirovOperator

/-!
  ULTRAMETRICA (v1.7.0) — Adversarial False-Variant Refutation Suite (`AdversarialTests.lean`).

  Playbook Gold Standard Item #12: formally proves 7 explicit NEGATIONS (`¬ (...)`) of
  deliberately weakened or false statements across Theorems I–VII, confirming that our
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

/-- Refutation 6 (Finite-Graph Theorem V-Global Sharpness): On a finite weighted graph with a
    supercritical edge (`w * (Wu + Wv) > Wu * Wv`, here 2-vertex edge `w = 2` with `W = (2, 2)`
    so `2 * 4 = 8 > 4`), the total edge-sum curvature STRICTLY VIOLATES the subcritical
    Gauss-Bonnet constant `-(p - 1) * n` (`-6 ≠ -4` at `p = 3, n = 2`). -/
public theorem adv_supercritical_finite_graph_violates_conservation :
    let edges : List (Ultrametrica.WeightedEdge 2) := [⟨⟨0, by omega⟩, ⟨1, by omega⟩, 2⟩]
    let hW : ∀ x : Fin 2, 0 < Ultrametrica.graphVertexWeight edges x := fun x => by
      rcases x with ⟨v, hv⟩
      have hv2 : v = 0 ∨ v = 1 := by omega
      rcases hv2 with rfl | rfl <;> decide +revert
    ¬ Ultrametrica.RatQ.eqv
        (Ultrametrica.RatQ.sumList (edges.map (fun e =>
          Ultrametrica.curvedGenKappaQ 3 e.w
            (Ultrametrica.graphVertexWeight edges e.u)
            (Ultrametrica.graphVertexWeight edges e.v)
            (hW e.u) (hW e.v))))
        ⟨-(3 - 1) * (2 : Int), 1, by omega⟩ := by
  dsimp only
  intro h
  unfold Ultrametrica.RatQ.eqv at h
  revert h
  decide

/-- Refutation 7 (Theorem VII Sharpness): Dropping the zero-mean condition (`finSum p a = 0`)
    on a Kozyrev-Haar wavelet DESTROYS the eigenfunction property: for `p = 3, n = 2, j = 1, c = 0`,
    profile `a = [1, 0, 0]` (`sum = 1 ≠ 0`), and `K(v) = v + 1`, `ψ(1) = 0` while `(D_K ψ)(1) = 1`,
    so NO eigenvalue `lam : Int` satisfies `(D_K ψ) x = lam * ψ x` for all `x`. -/
public theorem adv_nonzerosum_not_vladimirov_eigenfunction :
    let a : Fin 3 → Int := fun d => if d.val = 0 then 1 else 0
    let K : Nat → Int := fun v => (v : Int) + 1
    ¬ (∃ lam : Int, ∀ x : Fin (3 ^ 2),
        Ultrametrica.ultrametricOp 3 2 K (Ultrametrica.kozyrevHaar 3 2 1 0 (by omega) a) x =
          lam * Ultrametrica.kozyrevHaar 3 2 1 0 (by omega) a x) := by
  dsimp only
  have hlhs : Ultrametrica.ultrametricOp 3 2 (fun v => (v : Int) + 1)
      (Ultrametrica.kozyrevHaar 3 2 1 0 (by omega) (fun d => if d.val = 0 then 1 else 0))
      ⟨1, by omega⟩ = 1 := by decide
  have hrhs : Ultrametrica.kozyrevHaar 3 2 1 0 (by omega)
      (fun d => if d.val = 0 then 1 else 0) ⟨1, by omega⟩ = 0 := by decide
  rintro ⟨lam, h⟩
  have h1 := h ⟨1, by omega⟩
  rw [hlhs, hrhs, Int.mul_zero] at h1
  omega

end Ultrametrica.Adversarial

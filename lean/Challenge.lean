module

public import UltrametricaProofs.Spec

/-!
  ULTRAMETRICA (v1.8.0) — Isolated Statement-Only Challenge File (`lake comparator`).

  Palomar Registry compliant Lean 4.35.0 `module` (< 400 lines).
  Imports ONLY `UltrametricaProofs.Spec` (pure definitions, zero proofs) and NONE of the
  eleven proof modules (`Basic`, `AdelicSymmetry`, `OperatorAndSpectrum`, `HolographyCurvature`,
  `FullGraphBTZ`, `MultiEdgeHolography`, `FiniteGraphGaussBonnet`, `SolitonAndSolver`,
  `BulkOperatorPositivity`, `VladimirovOperator`, `AdversarialTests`).

  Every `sorry` in this file is intentional — matched strictly against sorry-free `Solution.lean` by:
      lake comparator --config comparator.json --paranoid
-/

namespace Ultrametrica.ComparatorTarget

/-- Target 1 (Theorem I — Universal Monna Involution, Complement Commutation, Ball Contiguity & Prime-Parity Dichotomy). -/
public theorem target_thm1_monna_and_parity :
    (∀ p n x, 2 ≤ p → x < p ^ n → Spec.revBase p n (Spec.revBase p n x) = x) ∧
    (∀ p n x, 2 ≤ p → x < p ^ n → Spec.revBase p n (p ^ n - 1 - x) = p ^ n - 1 - Spec.revBase p n x) ∧
    (∀ p n j x y, 2 ≤ p → j ≤ n → x < p ^ n → y < p ^ n →
      (x % p ^ j = y % p ^ j ↔ Spec.revBase p n x / p ^ (n - j) = Spec.revBase p n y / p ^ (n - j))) ∧
    (∀ p m, p % 2 = 1 → 1 ≤ m → m < p → m ≠ p - m) ∧
    (∀ m, 1 ≤ m → m < 2 → m = 2 - m) := by
  sorry

/-- Target 2 (Proposition 4.2 — Universal Modular Picket-Fence Spacing Law). -/
public theorem target_thm1_picket_fence_law :
    ∀ p m a, 2 ≤ p → 1 ≤ m → 2 * m ≤ p →
      Spec.picketVal p m (2 * a) ≤ Spec.picketVal p m (2 * a + 1) ∧
      Spec.picketVal p m (2 * a + 1) < Spec.picketVal p m (2 * a + 2) ∧
      Spec.picketVal p m (2 * a + 1) - Spec.picketVal p m (2 * a) = p - 2 * m ∧
      Spec.picketVal p m (2 * a + 2) - Spec.picketVal p m (2 * a + 1) = 2 * m := by
  sorry

/-- Target 3 (Theorem II — First-Principles Cycle-Metric Kantorovich Primal-Dual BTZ Ollivier-Ricci Law & L_c = 5):
    Proves BOTH the Kantorovich dual lower bound across ALL non-negative bipartite couplings AND
    the existence of a non-negative feasible primal plan attaining EXACT equality (tight W_1), plus
    the curvature excess identity vs. pure AdS! -/
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
  sorry

/-- Target 4 (Theorem III — Arbitrary K-Ball Disjoint Kozyrev Compacton-Soliton Invariance). -/
public theorem target_thm3_multiball_soliton :
    ∀ (X : Type) (F : Int → Int) (modes : List ((X → Spec.CInt) × Int)),
      (∀ m ∈ modes, ∀ x, m.1 x = Spec.CInt.zero ∨ (m.1 x).normSq = m.2) →
      (∀ i j (hi : i < modes.length) (hj : j < modes.length),
        i ≠ j → ∀ x, (modes[i]'hi).1 x = Spec.CInt.zero ∨ (modes[j]'hj).1 x = Spec.CInt.zero) →
      ∀ x,
        let total := modes.foldr (fun m acc => Spec.CInt.add (m.1 x) acc) Spec.CInt.zero
        Spec.CInt.smul (F total.normSq) total =
          modes.foldr (fun m acc => Spec.CInt.add (Spec.CInt.smul (F m.2) (m.1 x)) acc) Spec.CInt.zero := by
  sorry

/-- Target 5 (Theorem IV — Positive-Definite Rank-1 Kerr-BTZ Denominator >= 1 under w, q >= 0,
    Abstract Arbitrary-Dimension L Complex Hermitian Sherman-Morrison Identity & Edge Flux Parity). -/
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
  sorry

/-- Target 6 (Theorem V-Global — Per-Edge Curved AdS Gauss-Bonnet Charge Decomposition). -/
public theorem target_thm5_global_curved_gauss_bonnet :
    (∀ p w Wu Wv : Int,
      Spec.curvedGenKappaNum p w Wu Wv =
        -(p - 1) * w * Wv + -(p - 1) * w * Wu - Spec.curvedGenDeficitNum w Wu Wv) ∧
    (∀ p : Int, ∀ ws : List Int,
      Spec.sumInt (ws.map (fun w => -(p - 1) * w)) = -(p - 1) * Spec.sumInt ws) := by
  sorry

/-- Target 7 (Theorem V-Global First-Principles Multi-Edge Inhomogeneous Kantorovich Primal-Dual Duality):
    Proves BOTH universal dual lower bounds across ALL non-negative couplings AND existence of
    EXPLICIT NON-NEGATIVE feasible primal plans attaining exact equality in BOTH subcritical
    and supercritical regimes for arbitrary degree p and arbitrary inhomogeneous conductances! -/
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
  sorry

/-- Target 8 (Theorem VI — Universal Holographic Ryu-Takayanagi Strong Subadditivity on Any Weighted Graph). -/
public theorem target_thm6_holographic_ssa :
    ∀ (edges : List (Nat × Nat × Nat)) (bdry A B C W_AB W_BC : Nat → Bool) (S_ABC S_B : Nat),
      (∀ v, bdry v = true → (A v && C v) = false) →
      Spec.IsHomologous bdry (fun v => A v || B v) W_AB →
      Spec.IsHomologous bdry (fun v => B v || C v) W_BC →
      (∀ W, Spec.IsHomologous bdry (fun v => (A v || B v) || C v) W → S_ABC ≤ Spec.rtCutCap edges W) →
      (∀ W, Spec.IsHomologous bdry B W → S_B ≤ Spec.rtCutCap edges W) →
      S_ABC + S_B ≤ Spec.rtCutCap edges W_AB + Spec.rtCutCap edges W_BC := by
  sorry

/-- Target 9 (Adversarial False-Variant Refutations — Sharpness of Theorems I, V-Global, VI & VII). -/
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
  sorry

/-- Target 10 (Complete Non-Vacuity Witnesses Covering ALL 13 Theorem Targets 1–8 & 11–15 — Playbook Gold #8). -/
public theorem target_nonvacuity_witnesses :
    -- Target 1 witness: p=3, n=4, x=5 < 81
    (Spec.revBase 3 4 5 = 63 ∧ 5 < 3 ^ 4) ∧
    -- Target 2 witness: p=5, m=1, a=0
    (Spec.picketVal 5 1 1 - Spec.picketVal 5 1 0 = 3) ∧
    -- Target 3 witness: BTZ (p=3, L=5, M=1) exact optimal cost = 10 & zero curvature excess
    ((3 + 1 : Int) * (-(2 * 3 - max 0 (6 - 5))) - (-2 * (3 - 1)) * (3 + 2) = 0 ∧
      Spec.btzGraphDist 5 .back .back = 2) ∧
    -- Target 4 witness: 2 disjoint nontrivial constant-modulus CInt modes on Nat
    (∃ modes : List ((Nat → Spec.CInt) × Int),
      modes.length = 2 ∧
      (∀ m ∈ modes, ∀ x, m.1 x = Spec.CInt.zero ∨ (m.1 x).normSq = m.2) ∧
      (∀ i j (hi : i < modes.length) (hj : j < modes.length),
        i ≠ j → ∀ x, (modes[i]'hi).1 x = Spec.CInt.zero ∨ (modes[j]'hj).1 x = Spec.CInt.zero)) ∧
    -- Target 5 witness: L=1 Sherman-Morrison denominator den = 1 + 2 * 1 = 3 >= 1
    (Spec.CInt.add Spec.CInt.one
      (Spec.CInt.smul 2 (Spec.hermitianDot (fun _ : Fin 1 => Spec.CInt.one) (fun _ : Fin 1 => Spec.CInt.one)))
      = ⟨3, 0⟩) ∧
    -- Target 6 witness: subcritical & supercritical curvedGenDeficitNum
    (Spec.curvedGenDeficitNum 2 5 7 = 0 ∧ Spec.curvedGenDeficitNum 8 10 10 = 120) ∧
    -- Target 7 witness: p=2 inhomogeneous bridge w=2, uW=[1,2], vW=[3,1], D=12 (subcritical: 2*11 <= 30)
    (let uW : Fin 2 → Int := fun i => if i.val == 0 then 1 else 2
     let vW : Fin 2 → Int := fun i => if i.val == 0 then 3 else 1
     let uA : Fin 2 → Int := fun i => if i.val == 0 then 12 else 6
     let vA : Fin 2 → Int := fun i => if i.val == 0 then 4 else 12
     (2 : Int) * 6 = 12 ∧ (∀ r, uW r * uA r = 12) ∧ (∀ s, vW s * vA s = 12) ∧
     2 + Spec.finSum 2 uW = 5 ∧ 2 + Spec.finSum 2 vW = 6 ∧ (2 : Int) * (5 + 6) ≤ 5 * 6) ∧
    -- Target 8 witness: concrete weighted graph with strict RT SSA
    (Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5)] (fun v => v == 1 || v == 2) = 5 ∧
     Spec.rtCutCap [(0, 1, 2), (0, 2, 3), (0, 3, 5)] (fun v => v == 2 || v == 3) = 8) ∧
    -- Target 11 witness: 4-vertex finite weighted star with inhomogeneous edges w = 2, 3, 5
    (let v0 : Fin 4 := ⟨0, Nat.zero_lt_succ 3⟩
     let v1 : Fin 4 := ⟨1, Nat.succ_lt_succ (Nat.zero_lt_succ 2)⟩
     let v2 : Fin 4 := ⟨2, Nat.succ_lt_succ (Nat.succ_lt_succ (Nat.zero_lt_succ 1))⟩
     let v3 : Fin 4 := ⟨3, Nat.lt_succ_self 3⟩
     let edges : List (Spec.WeightedEdge 4) := [⟨v0, v1, 2⟩, ⟨v0, v2, 3⟩, ⟨v0, v3, 5⟩]
     Spec.graphVertexWeight edges v0 = 10 ∧
     Spec.graphVertexWeight edges v1 = 2 ∧
     Spec.graphVertexWeight edges v2 = 3 ∧
     Spec.graphVertexWeight edges v3 = 5) ∧
    -- Target 12 witness: p=3, n=2, j=0, a=[1, -1, 0], K(v)=v has zero sum and eigenvalue 4
    (let a : Fin 3 → Int := fun d => if d.val = 0 then 1 else if d.val = 1 then -1 else 0
     Spec.finSum 3 a = 0 ∧ Spec.ultrametricWaveletEigenvalue 3 2 0 (fun v => (v : Int)) = 4) ∧
    -- Target 13 witness: full-graph BTZ (p=3, L=5) has exact child-to-child dist 3 & back-to-back dist 2
    (Spec.fullBtzDist 3 5 (.child ⟨0, Nat.zero_lt_succ 2⟩) (.child ⟨1, Nat.succ_lt_succ (Nat.zero_lt_succ 1)⟩) = 3 ∧
     Spec.fullBtzDist 3 5 .back .back = 2) ∧
    -- Target 14 witness: odd prime p=3, n=1, s=0, m=1 has orthogonal conjugate basis vectors e_1 and e_2
    (let e1 : Spec.CVec (3 ^ 1) := fun k => if k.val = 1 then Spec.CInt.one else Spec.CInt.zero
     let e2 := Spec.fourierConj (3 ^ 1) (Nat.pow_pos (Nat.zero_lt_succ 2)) e1
     Spec.InSector 3 1 0 1 e1 ∧ Spec.InSector 3 1 0 2 e2 ∧ Spec.hermitianDot e1 e2 = Spec.CInt.zero) ∧
    -- Target 15 witness: 2-vertex gauge edge w=1 + positive mass d=2 has positive bulkQuadForm & positive Schur pivot
    (let v0 : Fin 2 := ⟨0, Nat.zero_lt_succ 1⟩
     let v1 : Fin 2 := ⟨1, Nat.lt_succ_self 1⟩
     let gEdges : List (Spec.GaugeEdge 2) := [⟨v0, v1, 1, Spec.CInt.one⟩]
     Spec.bulkQuadForm gEdges (fun _ => 2) (fun _ => Spec.CInt.one) = 4 ∧
     (Spec.schurReducedDiag 2 3 1 (Int.ofNat_lt.mpr (Nat.zero_lt_succ 2))).num = 5) := by
  sorry

/-- Target 11 (Theorem V-Global Actual Finite-Graph Edge-Sum Curved Gauss-Bonnet Conservation — closes F70):
    Directly sums exact curved Ollivier-Ricci curvature over EVERY edge `e ∈ edges` of an arbitrary
    finite undirected weighted graph `edges : List (Spec.WeightedEdge n)` on `Fin n`! -/
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
  sorry

/-- Target 12 (Theorem VII — First-Principles Discrete Vladimirov / Radial Ultrametric Operator,
    Kozyrev-Haar Wavelet Eigenfunction Theorem, and Complement Involution J-Parity — closes F71). -/
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
  sorry

/-- Target 13 (Full-Graph `(p+2) x (p+2)` BTZ Symmetry Reduction & Optimal Transport — closes F88):
    Proves BOTH the universal Kantorovich lower bound over ALL arbitrary non-negative `(p+2) x (p+2)`
    full-graph couplings `Q` AND existence of an explicit non-negative `(p+2) x (p+2)` full-graph
    optimal transport plan attaining exact equality! -/
public theorem target_thm2_full_graph_btz_reduction :
    (∀ (p : Nat) (L M : Int), 3 ≤ L →
      ∀ Q : Spec.BTZNbr p → Spec.BTZNbr p → Int,
        (∀ x y, 0 ≤ Q x y) →
        (∀ x, Spec.sumBTZNbr p (fun y => Q x y) = M) →
        (∀ y, Spec.sumBTZNbr p (fun x => Q x y) = M) →
        M * (3 * (p : Int) + 2 - max 0 (6 - L)) ≤ Spec.fullBtzTransportCost p L Q) ∧
    (∀ (p : Nat) (L M : Int), 1 ≤ p → 3 ≤ L → 0 ≤ M →
      ∃ Q : Spec.BTZNbr p → Spec.BTZNbr p → Int,
        (∀ x y, 0 ≤ Q x y) ∧
        (∀ x, Spec.sumBTZNbr p (fun y => Q x y) = (p : Int) * M) ∧
        (∀ y, Spec.sumBTZNbr p (fun x => Q x y) = (p : Int) * M) ∧
        Spec.fullBtzTransportCost p L Q = ((p : Int) * M) * (3 * (p : Int) + 2 - max 0 (6 - L))) := by
  sorry

/-- Target 14 (Operator-Level Adelic Block-Diagonality & Odd-Prime Orthogonal Multiplicity >= 2 — closes F89):
    Proves that ANY matrix commuting with a diagonal sector-label operator is identically block-diagonal
    (`d i ≠ d j -> H i j = 0`), AND that for every odd prime `p >= 3` (`p % 2 = 1`), any nonzero
    real-eigenvalue eigenvector `v ∈ W_{s,m}` of any Fourier-conjugate-equivariant operator `H` yields
    a strictly orthogonal conjugate twin eigenvector `w ∈ W_{s, p - m}` with identical eigenvalue `λ`
    and `<v, w> = 0`! -/
public theorem target_thm1_operator_orthogonal_doublets :
    (∀ (N : Nat) (H : Fin N → Fin N → Spec.CInt) (d : Fin N → Int),
      (∀ v : Spec.CVec N, Spec.matVecMul N H (Spec.diagOp d v) = Spec.diagOp d (Spec.matVecMul N H v)) →
      ∀ i j : Fin N, d i ≠ d j → H i j = Spec.CInt.zero) ∧
    (∀ (p n s m : Nat) (hpn : 0 < p ^ n),
      2 ≤ p → p % 2 = 1 → s < n → 1 ≤ m → m < p →
      ∀ (H : Spec.CVec (p ^ n) → Spec.CVec (p ^ n)),
        (∀ u, H (Spec.fourierConj (p ^ n) hpn u) = Spec.fourierConj (p ^ n) hpn (H u)) →
        ∀ (v : Spec.CVec (p ^ n)) (lam : Int),
          Spec.InSector p n s m v →
          (∃ k : Fin (p ^ n), v k ≠ Spec.CInt.zero) →
          (H v = fun i => Spec.CInt.smul lam (v i)) →
          let w := Spec.fourierConj (p ^ n) hpn v
          Spec.InSector p n s (p - m) w ∧
          (H w = fun i => Spec.CInt.smul lam (w i)) ∧
          0 < (Spec.hermitianDot v v).re ∧
          0 < (Spec.hermitianDot w w).re ∧
          Spec.hermitianDot v w = Spec.CInt.zero) := by
  sorry

/-- Target 15 (Bulk Gauge-Covariant Graph Laplacian `T ≻ 0`, Sherman-Morrison Discharge & Tree Schur Pivot Positivity — closes F90):
    Proves that ANY finite weighted gauge-covariant graph Laplacian + strictly positive diagonal is
    strictly positive definite (`bulkQuadForm > 0` for `v ≠ 0`), that ANY PSD operator `T` with `T z = u`
    forces `(1 + w <u, z>).re >= 1` and `den ≠ 0`, AND that tree Schur elimination preserves strict
    pivot positivity `D_p - w^2 / D_c > 0` and exact elimination! -/
public theorem target_thm4_bulk_positivity_and_schur :
    (∀ (n : Nat) (edges : List (Spec.GaugeEdge n)) (d : Fin n → Int),
      (∀ e ∈ edges, 0 ≤ e.w) → (∀ x, 0 < d x) →
      ∀ v : Spec.CVec n, (∃ x : Fin n, v x ≠ Spec.CInt.zero) →
        0 < Spec.bulkQuadForm edges d v) ∧
    (∀ (L : Nat) (T : Spec.CVec L → Spec.CVec L),
      (∀ z : Spec.CVec L, 0 ≤ (Spec.hermitianDot z (T z)).re) →
      ∀ (w : Int), 0 ≤ w → ∀ (u z : Spec.CVec L), T z = u →
        let den := Spec.CInt.add Spec.CInt.one (Spec.CInt.smul w (Spec.hermitianDot u z))
        1 ≤ den.re ∧ den ≠ Spec.CInt.zero) ∧
    (∀ (Dp Dc w : Int) (hDc : 0 < Dc),
      0 < w → w < Dc → w ≤ Dp →
      0 < (Spec.schurReducedDiag Dp Dc w hDc).num ∧ 0 < (Spec.schurReducedDiag Dp Dc w hDc).den) ∧
    (∀ Dp Dc w phiP phiC bP bC : Int,
      Dc * phiC - w * phiP = bC →
      Dp * phiP - w * phiC = bP →
      (Dp * Dc - w * w) * phiP = Dc * bP + w * bC) := by
  sorry

end Ultrametrica.ComparatorTarget

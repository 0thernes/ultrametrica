module

/-!
  ULTRAMETRICA (v1.6.0) — Pure Statement-Only Definitions (`Spec.lean`).

  Palomar Registry compliant Lean 4.35.0 `module`.
  Contains ONLY mathematical definitions (ZERO theorems, ZERO tactics, ZERO `sorry`).
  Imported by `Challenge.lean` so that every theorem signature audited by
  `lake comparator --config comparator.json --paranoid` can be verified for
  statement fidelity independently of all proof modules.
-/

namespace Ultrametrica.Spec

/-- Base-p digit reversal (discrete p-adic Monna involution R_p on Z / p^n Z). -/
@[expose] public def revBaseAux (p : Nat) : Nat → Nat → Nat → Nat
  | 0, _, acc => acc
  | d + 1, v, acc => revBaseAux p d (v / p) (acc * p + v % p)

@[expose] public def revBase (p n x : Nat) : Nat :=
  revBaseAux p n x 0

/-- Monotone folded modular picket-fence frequency sequence in sector W_{0, m}. -/
@[expose] public def picketVal (p m i : Nat) : Nat :=
  if i % 2 = 0 then (i / 2) * p + m else (i / 2 + 1) * p - m

/-- Exact shortest-path distance between vertices a, b in {0, ..., L-1} on the L-cycle graph C_L. -/
@[expose] public def cycleDist (L a b : Int) : Int :=
  let d := if a ≤ b then b - a else a - b
  if d ≤ L - d then d else L - d

/-- The 3 graph-symmetry neighbor classes of a BTZ horizon endpoint (opp, back, child). -/
public inductive BTZNbrClass where
  | opp   : BTZNbrClass
  | back  : BTZNbrClass
  | child : BTZNbrClass
deriving DecidableEq, Repr

/-- Exact literal graph shortest-path distance between neighbor classes of adjacent BTZ horizon
    vertices h_0 and h_1 on T_p / p^{hZ} (horizon circumference L >= 3). -/
@[expose] public def btzGraphDist (L : Int) : BTZNbrClass → BTZNbrClass → Int
  | .opp,   .opp   => cycleDist L 1 0
  | .opp,   .back  => cycleDist L 1 2
  | .opp,   .child => cycleDist L 1 1 + 1
  | .back,  .opp   => cycleDist L (L - 1) 0
  | .back,  .back  => cycleDist L (L - 1) 2
  | .back,  .child => cycleDist L (L - 1) 1 + 1
  | .child, .opp   => 1 + cycleDist L 0 0
  | .child, .back  => 1 + cycleDist L 0 2
  | .child, .child => 1 + cycleDist L 0 1 + 1

/-- Total scaled transport cost of a bipartite transport plan P on a BTZ horizon edge. -/
@[expose] public def btzTransportCost (L : Int) (P : BTZNbrClass → BTZNbrClass → Int) : Int :=
  P .opp .opp * btzGraphDist L .opp .opp +
  P .opp .back * btzGraphDist L .opp .back +
  P .opp .child * btzGraphDist L .opp .child +
  P .back .opp * btzGraphDist L .back .opp +
  P .back .back * btzGraphDist L .back .back +
  P .back .child * btzGraphDist L .back .child +
  P .child .opp * btzGraphDist L .child .opp +
  P .child .back * btzGraphDist L .child .back +
  P .child .child * btzGraphDist L .child .child

/-- Exact finite sum over Fin n in Int (zero Mathlib dependency). -/
@[expose] public def finSum : (n : Nat) → (Fin n → Int) → Int
  | 0, _     => 0
  | n + 1, f => finSum n (fun i => f i.castSucc) + f ⟨n, Nat.lt_succ_self n⟩

/-- Exact total transport cost of an arbitrary (p+1) x (p+1) bipartite coupling on a general
    inhomogeneous weighted bridge edge e = (u, v) of T_p with length ae and arbitrary positive
    outer arm lengths uA, vA : Fin p -> Int (satisfying d(v,u)=ae, d(v,y_s)=vA s,
    d(x_r,u)=uA r, d(x_r,y_s)=uA r + ae + vA s). -/
@[expose] public def genBridgeTransportCost (p : Nat) (ae : Int) (uA vA : Fin p → Int)
    (P00 : Int) (P0y Px0 : Fin p → Int) (Pxy : Fin p → Fin p → Int) : Int :=
  P00 * ae +
  finSum p (fun s => P0y s * vA s) +
  finSum p (fun r => Px0 r * uA r) +
  finSum p (fun r => finSum p (fun s => Pxy r s * (uA r + ae + vA s)))

/-- Exact cleared-denominator curved Ollivier-Ricci numerator on an arbitrary weighted bridge
    edge e = (u, v) of T_p with conductance w and endpoint weighted degrees Wu, Wv. -/
@[expose] public def curvedGenKappaNum (p w Wu Wv : Int) : Int :=
  if w * (Wu + Wv) ≤ Wu * Wv then
    -(p - 1) * w * (Wu + Wv)
  else
    2 * Wu * Wv - (p + 1) * w * (Wu + Wv)

/-- Exact supercritical pinch deficit numerator (0 when w/Wu + w/Wv <= 1). -/
@[expose] public def curvedGenDeficitNum (w Wu Wv : Int) : Int :=
  if w * (Wu + Wv) ≤ Wu * Wv then 0 else 2 * (w * (Wu + Wv) - Wu * Wv)

/-- Exact integer list sum. -/
@[expose] public def sumInt : List Int → Int
  | []      => 0
  | x :: xs => x + sumInt xs

/-- Exact Ryu-Takayanagi cut capacity of bulk wedge S on any finite weighted graph. -/
@[expose] public def rtCutCap (edges : List (Nat × Nat × Nat)) (S : Nat → Bool) : Nat :=
  match edges with
  | [] => 0
  | (u, v, c) :: rest => (if S u != S v then c else 0) + rtCutCap rest S

/-- Boundary homology condition for a bulk entanglement wedge W. -/
@[expose] public def IsHomologous (bdry R W : Nat → Bool) : Prop :=
  ∀ v, bdry v = true → W v = R v

/-- Exact complex integer arithmetic (Gaussian integers Z[i]). -/
public structure CInt where
  re : Int
  im : Int
deriving DecidableEq, Repr

@[expose] public def CInt.zero : CInt := ⟨0, 0⟩
@[expose] public def CInt.one : CInt := ⟨1, 0⟩
@[expose] public def CInt.add (a b : CInt) : CInt := ⟨a.re + b.re, a.im + b.im⟩
@[expose] public def CInt.sub (a b : CInt) : CInt := ⟨a.re - b.re, a.im - b.im⟩
@[expose] public def CInt.mul (a b : CInt) : CInt := ⟨a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re⟩
@[expose] public def CInt.smul (s : Int) (a : CInt) : CInt := ⟨s * a.re, s * a.im⟩
@[expose] public def CInt.conj (a : CInt) : CInt := ⟨a.re, -a.im⟩
@[expose] public def CInt.normSq (a : CInt) : Int := a.re * a.re + a.im * a.im

/-- Finite-dimensional Gaussian-integer vector space CInt^L and Hermitian inner product <u, v>. -/
public abbrev CVec (L : Nat) := Fin L → CInt

@[expose] public def cvecAdd {L : Nat} (a b : CVec L) : CVec L := fun i => CInt.add (a i) (b i)
@[expose] public def cvecSub {L : Nat} (a b : CVec L) : CVec L := fun i => CInt.sub (a i) (b i)
@[expose] public def cvecSmul {L : Nat} (c : CInt) (a : CVec L) : CVec L := fun i => CInt.mul c (a i)

@[expose] public def finSumCInt : (n : Nat) → (Fin n → CInt) → CInt
  | 0, _ => CInt.zero
  | n + 1, f => CInt.add (finSumCInt n (fun i => f i.castSucc)) (f ⟨n, Nat.lt_succ_self n⟩)

@[expose] public def hermitianDot {L : Nat} (u v : CVec L) : CInt :=
  finSumCInt L (fun i => CInt.mul (CInt.conj (u i)) (v i))

end Ultrametrica.Spec

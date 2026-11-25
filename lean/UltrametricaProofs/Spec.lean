/-
  ULTRAMETRICA (v1.4.0) — Pure Statement-Only Definitions (`Spec.lean`).

  Contains ONLY mathematical definitions (ZERO theorems, ZERO tactics, ZERO `sorry`).
  Imported by `Challenge.lean` so that every theorem signature audited by `lake comparator --paranoid`
  can be verified for statement fidelity independently of all proof modules.
-/

namespace Ultrametrica.Spec

/-- Base-p digit reversal (discrete p-adic Monna involution R_p on Z / p^n Z). -/
def revBaseAux (p : Nat) : Nat → Nat → Nat → Nat
  | 0, _, acc => acc
  | d + 1, v, acc => revBaseAux p d (v / p) (acc * p + v % p)

def revBase (p n x : Nat) : Nat :=
  revBaseAux p n x 0

/-- Monotone folded modular picket-fence frequency sequence in sector W_{0, m}. -/
def picketVal (p m i : Nat) : Nat :=
  if i % 2 = 0 then (i / 2) * p + m else (i / 2 + 1) * p - m

/-- Exact shortest-path distance between vertices a, b in {0, ..., L-1} on the L-cycle graph C_L. -/
def cycleDist (L a b : Int) : Int :=
  let d := if a ≤ b then b - a else a - b
  if d ≤ L - d then d else L - d

/-- The 3 graph-symmetry neighbor classes of a BTZ horizon endpoint (opp, back, child). -/
inductive BTZNbrClass where
  | opp   : BTZNbrClass
  | back  : BTZNbrClass
  | child : BTZNbrClass
deriving DecidableEq, Repr

/-- Exact literal graph shortest-path distance between neighbor classes of adjacent BTZ horizon
    vertices h_0 and h_1 on T_p / p^{hZ} (horizon circumference L >= 3). -/
def btzGraphDist (L : Int) : BTZNbrClass → BTZNbrClass → Int
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
def btzTransportCost (L : Int) (P : BTZNbrClass → BTZNbrClass → Int) : Int :=
  P .opp .opp * btzGraphDist L .opp .opp +
  P .opp .back * btzGraphDist L .opp .back +
  P .opp .child * btzGraphDist L .opp .child +
  P .back .opp * btzGraphDist L .back .opp +
  P .back .back * btzGraphDist L .back .back +
  P .back .child * btzGraphDist L .back .child +
  P .child .opp * btzGraphDist L .child .opp +
  P .child .back * btzGraphDist L .child .back +
  P .child .child * btzGraphDist L .child .child

/-- Exact cleared-denominator curved Ollivier-Ricci numerator on an arbitrary weighted bridge
    edge e = (u, v) of T_p with conductance w and endpoint weighted degrees Wu, Wv. -/
def curvedGenKappaNum (p w Wu Wv : Int) : Int :=
  if w * (Wu + Wv) ≤ Wu * Wv then
    -(p - 1) * w * (Wu + Wv)
  else
    2 * Wu * Wv - (p + 1) * w * (Wu + Wv)

/-- Exact supercritical pinch deficit numerator (0 when w/Wu + w/Wv <= 1). -/
def curvedGenDeficitNum (w Wu Wv : Int) : Int :=
  if w * (Wu + Wv) ≤ Wu * Wv then 0 else 2 * (w * (Wu + Wv) - Wu * Wv)

/-- Exact integer list sum. -/
def sumInt : List Int → Int
  | []      => 0
  | x :: xs => x + sumInt xs

/-- Exact Ryu-Takayanagi cut capacity of bulk wedge S on any finite weighted graph. -/
def rtCutCap (edges : List (Nat × Nat × Nat)) (S : Nat → Bool) : Nat :=
  match edges with
  | [] => 0
  | (u, v, c) :: rest => (if S u != S v then c else 0) + rtCutCap rest S

/-- Boundary homology condition for a bulk entanglement wedge W. -/
def IsHomologous (bdry R W : Nat → Bool) : Prop :=
  ∀ v, bdry v = true → W v = R v

/-- Exact complex integer arithmetic (Gaussian integers Z[i]). -/
structure CInt where
  re : Int
  im : Int
deriving DecidableEq, Repr

def CInt.zero : CInt := ⟨0, 0⟩
def CInt.add (a b : CInt) : CInt := ⟨a.re + b.re, a.im + b.im⟩
def CInt.sub (a b : CInt) : CInt := ⟨a.re - b.re, a.im - b.im⟩
def CInt.mul (a b : CInt) : CInt := ⟨a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re⟩
def CInt.smul (s : Int) (a : CInt) : CInt := ⟨s * a.re, s * a.im⟩
def CInt.conj (a : CInt) : CInt := ⟨a.re, -a.im⟩
def CInt.normSq (a : CInt) : Int := a.re * a.re + a.im * a.im

end Ultrametrica.Spec

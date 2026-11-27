module

/-!
  ULTRAMETRICA (v1.7.0) — Pure Statement-Only Definitions (`Spec.lean`).

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

/-- Exact positive-denominator rational numbers `num / den` (`den > 0`, zero Mathlib). -/
public structure RatQ where
  num     : Int
  den     : Int
  den_pos : 0 < den

@[expose] public def RatQ.zero : RatQ := ⟨0, 1, Int.zero_lt_one⟩
@[expose] public def RatQ.add (a b : RatQ) : RatQ :=
  ⟨a.num * b.den + b.num * a.den, a.den * b.den, Int.mul_pos a.den_pos b.den_pos⟩
@[expose] public def RatQ.neg (a : RatQ) : RatQ := ⟨-a.num, a.den, a.den_pos⟩
@[expose] public def RatQ.sub (a b : RatQ) : RatQ := RatQ.add a (RatQ.neg b)
@[expose] public def RatQ.eqv (a b : RatQ) : Prop := a.num * b.den = b.num * a.den
@[expose] public def RatQ.sumList : List RatQ → RatQ
  | []      => RatQ.zero
  | x :: xs => RatQ.add x (RatQ.sumList xs)

/-- An undirected weighted edge `(u, v, w)` on finite vertex set `Fin n`. -/
public structure WeightedEdge (n : Nat) where
  u : Fin n
  v : Fin n
  w : Int

@[expose] public def edgeIncidentWeight {n : Nat} (x : Fin n) (e : WeightedEdge n) : Int :=
  (if e.u = x then e.w else 0) + (if e.v = x then e.w else 0)

@[expose] public def graphVertexWeight {n : Nat} (edges : List (WeightedEdge n)) (x : Fin n) : Int :=
  sumInt (edges.map (edgeIncidentWeight x))

@[expose] public def curvedGenKappaQ (p w Wu Wv : Int) (hWu : 0 < Wu) (hWv : 0 < Wv) : RatQ :=
  ⟨curvedGenKappaNum p w Wu Wv, Wu * Wv, Int.mul_pos hWu hWv⟩

@[expose] public def curvedGenDeficitQ (w Wu Wv : Int) (hWu : 0 < Wu) (hWv : 0 < Wv) : RatQ :=
  ⟨curvedGenDeficitNum w Wu Wv, Wu * Wv, Int.mul_pos hWu hWv⟩

/-- Exact finite-level `p`-adic valuation & ultrametric distance on `Z / p^n Z`. -/
@[expose] public def padicValAux (p : Nat) : Nat → Nat → Nat
  | 0, _        => 0
  | fuel + 1, d => if d % p = 0 then 1 + padicValAux p fuel (d / p) else 0

@[expose] public def padicValMod (p n d : Nat) : Nat :=
  padicValAux p n (d % p ^ n)

@[expose] public def modDiff (N x y : Nat) : Nat :=
  (x + N - y) % N

@[expose] public def padicDistVal (p n x y : Nat) : Nat :=
  padicValMod p n (modDiff (p ^ n) x y)

/-- Exact discrete radial ultrametric / Vladimirov convolution operator on `Z / p^n Z`. -/
@[expose] public def ultrametricOp (p n : Nat) (K : Nat → Int) (f : Fin (p ^ n) → Int) (x : Fin (p ^ n)) : Int :=
  finSum (p ^ n) (fun y => K (padicDistVal p n x.val y.val) * f y)

/-- Actual discrete Kozyrev-Haar wavelet at scale `j`, ball `c`, and child weights `a : Fin p -> Int`. -/
@[expose] public def kozyrevHaar (p n j c : Nat) (hp : 2 ≤ p) (a : Fin p → Int) (x : Fin (p ^ n)) : Int :=
  if x.val % p ^ j = c % p ^ j then
    a ⟨(x.val / p ^ j) % p, Nat.mod_lt _ (Nat.lt_of_lt_of_le (Nat.zero_lt_two) hp)⟩
  else 0

/-- Exact scale-only eigenvalue of `ultrametricOp p n K` on every scale-`j` Kozyrev-Haar wavelet. -/
@[expose] public def ultrametricWaveletEigenvalue (p n j : Nat) (K : Nat → Int) : Int :=
  finSum (p ^ (n - j - 1)) (fun t => K (j + 1 + padicValMod p (n - j - 1) t.val)) -
    ((p ^ (n - j - 1) : Nat) : Int) * K j

/-- Exact complement-reversal involution `J(v)_i = v_{N - 1 - i}` on `Z^N`. -/
@[expose] public def vecRev (N : Nat) (v : Fin N → Int) : Fin N → Int :=
  fun i => v ⟨N - 1 - i.val,
    Nat.lt_of_le_of_lt (Nat.sub_le (N - 1) i.val)
      (Nat.sub_lt (Nat.lt_of_le_of_lt (Nat.zero_le i.val) i.isLt) Nat.zero_lt_one)⟩

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

-- =====================================================================
-- v1.8.0 Statement-Only Definitions for Full-Graph BTZ, Operator Doublets
-- & Bulk Graph-Laplacian Positivity (Targets 13, 14, 15)
-- =====================================================================

/-- Literal `(p + 2)`-element neighbor set of a uniform BTZ horizon vertex on `T_p / p^{hZ}`. -/
public inductive BTZNbr (p : Nat)
  | opp
  | back
  | child (r : Fin p)
deriving DecidableEq, Repr

@[expose] public def BTZNbr.cls {p : Nat} : BTZNbr p → BTZNbrClass
  | .opp     => .opp
  | .back    => .back
  | .child _ => .child

@[expose] public def sumBTZNbr (p : Nat) (f : BTZNbr p → Int) : Int :=
  f .opp + f .back + finSum p (fun r => f (.child r))

@[expose] public def fullBtzDist (p : Nat) (L : Int) (x y : BTZNbr p) : Int :=
  btzGraphDist L x.cls y.cls

@[expose] public def fullBtzTransportCost (p : Nat) (L : Int) (Q : BTZNbr p → BTZNbr p → Int) : Int :=
  sumBTZNbr p (fun x => sumBTZNbr p (fun y => Q x y * fullBtzDist p L x y))

/-- Operator-level Adelic hybrid definitions on `CVec N = Fin N -> CInt`. -/
@[expose] public def cvecConj {N : Nat} (v : CVec N) : CVec N :=
  fun i => (v i).conj

@[expose] public def matVecMul (N : Nat) (A : Fin N → Fin N → CInt) (v : CVec N) : CVec N :=
  fun i => finSumCInt N (fun j => CInt.mul (A i j) (v j))

@[expose] public def diagOp {N : Nat} (d : Fin N → Int) (v : CVec N) : CVec N :=
  fun i => CInt.smul (d i) (v i)

@[expose] public def isSectorIdx (p s m k : Nat) : Prop :=
  k % p ^ (s + 1) = m * p ^ s

@[expose] public def InSector (p n s m : Nat) (v : CVec (p ^ n)) : Prop :=
  ∀ k : Fin (p ^ n), ¬ isSectorIdx p s m k.val → v k = CInt.zero

@[expose] public def fourierConj (N : Nat) (hN : 0 < N) (v : CVec N) : CVec N :=
  fun k => (v ⟨(N - k.val) % N, Nat.mod_lt _ hN⟩).conj

/-- Finite weighted gauge-covariant bulk graph Laplacian & Schur-complement pivot definitions. -/
public structure GaugeEdge (n : Nat) where
  u  : Fin n
  v  : Fin n
  w  : Int
  ph : CInt
deriving DecidableEq, Repr

@[expose] public def gaugeLaplacianQuad {n : Nat} : List (GaugeEdge n) → CVec n → Int
  | [], _ => 0
  | e :: rest, v =>
      e.w * (CInt.sub (v e.u) (CInt.mul e.ph (v e.v))).normSq + gaugeLaplacianQuad rest v

@[expose] public def weightedNormSq {n : Nat} (d : Fin n → Int) (v : CVec n) : Int :=
  finSum n (fun x => d x * (v x).normSq)

@[expose] public def bulkQuadForm {n : Nat} (edges : List (GaugeEdge n)) (d : Fin n → Int) (v : CVec n) : Int :=
  gaugeLaplacianQuad edges v + weightedNormSq d v

@[expose] public def schurReducedDiag (Dp Dc w : Int) (hDc : 0 < Dc) : RatQ :=
  ⟨Dp * Dc - w * w, Dc, hDc⟩

end Ultrametrica.Spec

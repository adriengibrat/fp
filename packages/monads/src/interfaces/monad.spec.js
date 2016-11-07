// // See https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch9.html

// // associativity
// compose(join, map(join)) == compose(join, join)

// // identity for all (M a)
// compose(join, of) === compose(join, map(of)) === id

// function mcompose (f, g) {
//   return compose(chain(f), chain(g))
// }

// // left identity
// mcompose(M, f) == f

// // right identity
// mcompose(f, M) == f

// // associativity
// mcompose(mcompose(f, g), h) === mcompose(f, mcompose(g, h))

// // See https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch10.html

// F.of(x).map(f) == F.of(f).ap(F.of(x))

// // map derived from of/ap
// X.prototype.map = function map (f) {
//   return this.constructor.of(f).ap(this)
// }

// // map derived from chain
// X.prototype.map = function map (fn) {
//   return m.chain((a) => m.constructor.of(fn(a)))
// }

// // ap derived from chain/map
// X.prototype.ap = function ap (other) {
//   return this.chain((f) => other.map(f))
// }

// // identity
// A.of(identity).ap(v) == v

// // homomorphism
// A.of(fn).ap(A.of(x)) == A.of(fn(x))

// // interchange
// v.ap(A.of(x)) == A.of((fn) => fn(x)).ap(v)

// // composition
// A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w))

// // See https://github.com/fantasyland/fantasy-land



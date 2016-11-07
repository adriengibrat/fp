import apply from './apply'

/* global Error: false */

export default (arity, fn) => {
	arity >= 0 || (arity = 0)
	switch (arity) {
		case 0:
			return function nullary () {
				return apply(fn, this, arguments)
			}
		case 1:
			// eslint-disable-next-line no-unused-vars
			return function unary (a) {
				return apply(fn, this, arguments)
			}
		case 2:
			// eslint-disable-next-line no-unused-vars
			return function binary (a, b) {
				return apply(fn, this, arguments)
			}
		case 3:
			// eslint-disable-next-line no-unused-vars
			return function ternary (a, b, c) {
				return apply(fn, this, arguments)
			}
		case 4:
			// eslint-disable-next-line no-unused-vars
			return function quaternary (a, b, c, d) {
				return apply(fn, this, arguments)
			}
		case 5:
			// eslint-disable-next-line no-unused-vars
			return function quinary (a, b, c, d, e) {
				return apply(fn, this, arguments)
			}
		case 6:
			// eslint-disable-next-line no-unused-vars
			return function senary (a, b, c, d, e, f) {
				return apply(fn, this, arguments)
			}
		case 7:
			// eslint-disable-next-line no-unused-vars
			return function septenary (a, b, c, d, e, f, g) {
				return apply(fn, this, arguments)
			}
		case 8:
			// eslint-disable-next-line no-unused-vars
			return function octonary (a, b, c, d, e, f, g, h) {
				return apply(fn, this, arguments)
			}
		case 9:
			// eslint-disable-next-line no-unused-vars
			return function novenary (a, b, c, d, e, f, g, h, i) {
				return apply(fn, this, arguments)
			}
		default:
			throw Error(`Arity "${ arity }" is not supported`) // wtf arity >= 10
	}
}

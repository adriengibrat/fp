import assign from 'utils/object/assign'
import map from 'utils/map'
import curry from 'curry'
import * as monads from 'monads'
import fp from 'fp'

/* global Function: false, Array: false */

const slice = Array.prototype.slice

function ap (container, apply) { return apply.ap(container) }

export default assign(fp || {}, monads, {
	chain: curry.debug(function chain (fn, monad) { return monad.chain(fn) })
	, either: curry.debug(monads.either)
	, join: function join (comonad) { return comonad.join() }
	, lift: curry.debug(function lift (fn, apply) {
		return slice.call(arguments, 2).reduce(ap, map(fn, apply))
	})
})

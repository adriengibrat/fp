import { identity } from 'basics'
import { setArity, apply, getLength } from 'optims'
import { setSignature, getSignature } from 'utils/doc'
import { placeholder, attachPlaceholder } from 'utils/placeholder'
import { targetFn } from 'symbols'
import { partial, partialDebug } from 'partial'

function curryFactory (partial, wrapper) {
	return (arity, fn) => {
		arity = parseInt(arity, 10) || 0

		const curried = setArity(arity, function () {
			return getLength(arguments, arity, placeholder) === arity ?
				apply(fn, this, arguments)
				: partial.call(this, curried, arguments)
		})

		return wrapper(curried, fn)
	}
}

const debug = (curried, fn) => {
	const target = fn[targetFn] || fn
	curried.toString = () => `/* curried */${ target }`
	setSignature(getSignature(target), curried)
	curried[targetFn] = target

	return curried
}

const curryN = curryFactory(partial, identity)
const curryNDebug = curryFactory(partialDebug, debug)
const curry = fn => curryN(fn.length, fn)
const curryDebug = fn => curryNDebug(fn.length, fn)

attachPlaceholder(curryN)
attachPlaceholder(curryNDebug)
attachPlaceholder(curry)
attachPlaceholder(curryDebug)

const setCurrySignature = partial(setSignature, ['curry :: (α, … → β) → (α → … → β)'])
setCurrySignature(curry)
setCurrySignature(curryDebug)

const setCurryNSignature = partial(setSignature, ['curryN :: N → (α1, …, αN, … → β) → (α1 → … → αN → β)'])
setCurryNSignature(curryN)
setCurryNSignature(curryNDebug)

curry.debug = curryDebug
curry.n = curryN
curryN.debug = curryNDebug

export { curry, curryDebug, curryN, curryNDebug }

export default curry

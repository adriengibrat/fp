import { setArity, apply, getLength } from 'optims'
import { signature, targetFn, placeholder } from 'symbols'
import partial, { partialDebug } from 'partial'

const curry = curryFactory(partial)
const curryDebug = curryFactory(partialDebug, debug)

curry[signature] = curryDebug[signature] = 'curry :: (α1, …, αN → β) A, ?Number N = A.length → (α1 → … → αN → β)'

curry.placeholder = curryDebug.placeholder = placeholder

curry.debug = curryDebug

function curryFactory (partial, wrapper) {
	return function curry (fn, arity = fn.length) {
		arity = parseInt(arity, 10) || 0

		const _curried = setArity(arity, function curried () {
			return getLength(arguments, arity, placeholder) === arity ?
				apply(fn, this, arguments) :
				partial.call(this, _curried, arguments)
		})

		return wrapper ? wrapper(_curried, fn) : _curried
	}
}

function debug (curried, fn) {
	/* attach debug info */
	const target = fn[targetFn] || fn
	curried.toString = () => `/* curried */${ target }`
	curried[signature] = target[signature]
	curried[targetFn] = target

	return curried
}

export { curryDebug }

export default curry

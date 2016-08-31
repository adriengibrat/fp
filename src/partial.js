import { setArity, arrayConcat, apply, getLength } from 'optims'
import { placeholder, attachPlaceholder, setSignature, getSignature  } from 'utils/index'
import { targetFn, boundThis, partialArgs } from 'symbols'

function partial (fn, args = []) {
	const length = fn.length

	return setArity(length - getLength(args, length, placeholder), function partiallyApplied () {
		return apply(fn, this, arrayConcat(args, arguments, placeholder))
	})
}

function partialDebug (fn, args = []) {
	const applied = partial(fn, args)

	const target = fn[targetFn] || fn
	applied.toString = () => `/* partially applied */${ target }`
	setSignature(getSignature(target), applied)
	applied[targetFn] = target
	applied[boundThis] = this
	applied[partialArgs] = args

	return applied
}

const setPartialSignature = partial(setSignature, ['partial :: (α1, …, αZ → β) → [α1, …, αM] → (αN, …, αZ → β)'])
setPartialSignature(partial)
setPartialSignature(partialDebug)

attachPlaceholder(partial)
attachPlaceholder(partialDebug)

partial.debug = partialDebug

export { partial, partialDebug }

export default partial

import { setArity, arrayConcat, apply, getLength } from 'optims'
import { signature, targetFn, boundThis, partialArgs, placeholder } from 'symbols'

partial[signature] = partialDebug[signature] = 'partial :: (α1, …, αN → β), ?[α1, …] = [] → (…, αN → β)'

partial.placeholder = partialDebug.placeholder = placeholder

partial.debug = partialDebug

export function partialDebug (fn, args = []) {
	const applied = partial(fn, args)

	/* attach debug info */
	const target = fn[targetFn] || fn
	applied.toString = () => `/* partially applied */${ target }`
	applied[signature] = target[signature]
	applied[targetFn] = target
	applied[boundThis] = this
	applied[partialArgs] = args

	return applied
}

export default function partial (fn, args = []) {
	const length = fn.length

	return setArity(length - getLength(args, length, placeholder), function partiallyApplied () {
		return apply(fn, this, arrayConcat(args, arguments, placeholder))
	})
}

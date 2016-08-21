import { setArity, toArray, arrayConcat, apply } from 'optims'
import { signature, targetFn } from 'symbols'
import map from 'utils/map'
import trace from 'utils/trace'

compose[signature] = composeDebug[signature] = composeTrace[signature] = 
'compose :: (…, αN → β), …, (α1, … → α2) → (α1, … → β)'

compose.debug = composeDebug

compose.trace = composeTrace

function composer (args, fn) {
	return arrayConcat(
		[apply(fn, this, toArray(args, fn.length || args.length))],
		[].slice.call(args, fn.length || 1)
	)
}

export function composeTrace () {
	return apply(compose, this, map((fn) => trace('compose', fn), arguments))
}

export function composeDebug () {
	const composed = apply(compose, null, arguments)
	const last = arguments[arguments.length - 1]

	/* attach debug info */
	const target = last[targetFn] || last
	composed.toString = () => `/* composed */${ target }`
	composed[signature] = target[signature]
	composed[targetFn] = target

	return composed
}

export default function compose () {
	const functions = toArray(arguments)
	const last = arguments[arguments.length - 1]

	return setArity(last && last.length || 0, function composed () {
		return functions.reduceRight(composer, arguments).shift()
	})
}

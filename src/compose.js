import { setArity, toArray, arrayConcat, apply } from 'optims'
import { targetFn } from 'symbols'
import { setSignature, getSignature } from 'utils/doc'
import map from 'utils/map'
import trace from 'utils/trace'
import { partial } from 'partial'

function composer (args, fn) {
	return arrayConcat(
		[apply(fn, this, toArray(args, fn.length || args.length))],
		[].slice.call(args, fn.length || 1)
	)
}

function compose () {
	const functions = toArray(arguments)
	const last = arguments[arguments.length - 1]

	return setArity(last && last.length || 0, function composed () {
		return functions.reduceRight(composer, arguments).shift()
	})
}

function composeDebug () {
	const composed = apply(compose, null, arguments)
	const last = arguments[arguments.length - 1]

	/* attach debug info */
	const target = last[targetFn] || last
	composed.toString = () => `/* composed */${ target }`
	setSignature(getSignature(target), composed)
	composed[targetFn] = target

	return composed
}

function composeTrace () {
	return apply(compose, this, map(fn => trace('compose', fn), arguments))
}

const setComposeSignature = partial(setSignature, ['compose :: (…, αZ → β), …, (α1, …, αM → αN) → (α1, …, αM → β)'])
setComposeSignature(compose)
setComposeSignature(composeDebug)
setComposeSignature(composeTrace)

compose.debug = composeDebug
compose.trace = composeTrace

export { compose, composeDebug, composeTrace }

export default compose

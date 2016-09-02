import { setArity, reverse, reduce } from 'optims'
import { targetFn } from 'symbols'
import { setSignature, getSignature, map, trace } from 'utils/index'
import { partial } from 'partial'

const composer = (a, b) => function () {
	return b.call(this, a.apply(this, arguments))
}

function _compose () {
	const functions = reverse(arguments)
	return setArity(
		functions[0].length
		, reduce(composer, functions)
	)
}

function compose () {
	const composed = _compose.apply(this, arguments)
	const last = arguments[arguments.length - 1]

	/* attach debug info */
	const target = last[targetFn] || last
	composed.toString = () => `/* composed */${ target }`
	// setSignature(getSignature(target), composed)
	// composed[targetFn] = target

	return composed
}

function composeDebug () {
	const composed = _compose.apply(this, arguments)
	const last = arguments[arguments.length - 1]

	/* attach debug info */
	const target = last[targetFn] || last
	composed.toString = () => `/* composed */${ target }`
	setSignature(getSignature(target), composed)
	composed[targetFn] = target

	return composed
}

function composeTrace () {
	return _compose.apply(this, map(fn => trace('compose', fn), arguments))
}

const setComposeSignature = partial(setSignature, ['compose :: (…, αZ → β), …, (α1, …, αM → αN) → (α1, …, αM → β)'])
setComposeSignature(compose)
setComposeSignature(composeDebug)
setComposeSignature(composeTrace)

compose.debug = composeDebug
compose.trace = composeTrace

export { compose, composeDebug, composeTrace }

export default compose

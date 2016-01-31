import {signature} from 'utils/doc'

export default function curry(fn, arity = fn.length) {
	if (arity <= 1) return fn // TODO remove shortcut in source, should be done later on
	return function partial (...args) {
		if (args.length >= arity) return fn.apply(this, args)
		let curried = function () { return partial.apply(this, [...args, ...arguments]) }
		Object.defineProperty(curried, 'length', {value: arity - args.length})
		return curried
	}()
}

curry[signature] = curryDebug[signature] = '(* → x) → (* → x)'

export function curryDebug (fn, arity = fn.length) {
	arity = parseInt(arity) || 0
	if (arity <= 1) return fn // TODO remove shortcut in source, should be done later on
	Object.defineProperty(curried, 'length', {value: arity})
	/* debug info */ curried.toString = () => `/* Curried */ ${fn}`
	function curried () {
		if (arguments.length >= arity) return fn.apply(this, arguments)
		let partial = curried.bind(this, ...arguments) // bind allow to track info with chrome console trace
		/* debug info */ partial.toString = curried.toString
		return partial
	}
	return curried
}

export function curryN (arity, fn) {
	return curry(fn, parseInt(arity, 10) || 0);
}

curryN[signature] = 'Number → ' + curry[signature]

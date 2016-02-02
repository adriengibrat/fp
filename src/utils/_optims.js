export function apply (fn, context, args) {
	switch (args.length) {
		case 0:
			return fn.call(context)
		case 1:
			return fn.call(context, args[0])
		case 2:
			return fn.call(context, args[0], args[1])
		case 3:
			return fn.call(context, args[0], args[1], args[2])
		case 4:
			return fn.call(context, args[0], args[1], args[2], args[3])
		case 5:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4])
		case 6:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5])
		case 7:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6])
		case 8:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
		case 9:
			return fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])
		default:
			return fn.apply(context, args)
	}
}

export function setArity (arity, fn) {
	arity >= 0 || (arity = 0)
	switch (arity) {
		case 0:
			return function nullary () {
				return apply(fn, this, arguments)
			}
		case 1:
			return function unary (a) {
				return apply(fn, this, arguments)
			}
		case 2:
			return function binary (a, b) {
				return apply(fn, this, arguments)
			}
		case 3:
			return function ternary (a, b, c) {
				return apply(fn, this, arguments)
			}
		case 4:
			return function quaternary (a, b, c, d) {
				return apply(fn, this, arguments)
			}
		case 5:
			return function quinary (a, b, c, d, e) {
				return apply(fn, this, arguments)
			}
		case 6:
			return function senary (a, b, c, d, e, f) {
				return apply(fn, this, arguments)
			}
		case 7:
			return function septenary (a, b, c, d, e, f, g) {
				return apply(fn, this, arguments)
			}
		case 8:
			return function octonary (a, b, c, d, e, f, g, h) {
				return apply(fn, this, arguments)
			}
		case 9:
			return function novenary (a, b, c, d, e, f, g, h, i) {
				return apply(fn, this, arguments)
			}
		default:
			throw Error(`Arity "${arity}" is not supported`) // wtf arity >= 10
	}
}

export function toArray (list, length = list.length) {
	const array = Array(length)

	while (length--)
		array[length] = list[length]

	return array
}

export function getLength (list, max, placeholder) {
	let length = 0
	let index = list.length
	index > max && (index = max)

	while (index--)
		list[index] !== placeholder && length++

	return length
}

export function arrayConcat (a, b, placeholder) {
	const aLength = a.length
	const bLength = b.length
	const array = Array() // cannot guess final length, because of placeholders

	for (let i = 0, j = 0; i < aLength || j < bLength; i++)
		array[i] = i >= aLength || a[i] === placeholder ? b[j++] : a[i]

	return array
}

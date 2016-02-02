(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('fp')) :
	typeof define === 'function' && define.amd ? define('fp.monads', ['fp'], factory) :
	(global.fp = factory(global.fp));
}(this, function (fp) { 'use strict';

	fp = 'default' in fp ? fp['default'] : fp;

	/* global Object: false, Function: false */

	var hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty)

	/* global Object: false */

	var assign = Object.assign || function assign (target) {
		var arguments$1 = arguments;

		for (var index = 1; index < arguments$1.length; index++) {
			var source = arguments$1[index]
			if (source != null)
				for (var key in source)
					if (hasOwnProperty(source, key))
						target[key] = source[key]
		}
		return target
	}

	var signature = Symbol('signature')
	var targetFn = Symbol('targetFn')
	var boundThis = Symbol('boundThis')
	var partialArgs = Symbol('partialArgs')
	var placeholder = Symbol('placeholder')

	map[signature] = 'map :: (α, ?Integer, ?List L → β) → [α] L, ?Boolean = L.map !== map → [β]'

	function map (iteratee, collection, useMethod) {
		if ( useMethod === void 0 ) useMethod = (collection.map[targetFn] || collection.map) !== map;

		if (typeof collection.map === 'function' && useMethod) // objects with map method (array, functor/monad, etc.)
			return collection.map(iteratee) 

		var mapped = new (collection.constructor) // default mapping
		for (var key in collection)
			if (hasOwnProperty(collection, key))
				mapped[key] = iteratee(collection[key], key, collection)
		return mapped
	}

	function apply (fn, context, args) {
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

	function setArity (arity, fn) {
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
				throw Error(("Arity \"" + arity + "\" is not supported")) // wtf arity >= 10
		}
	}

	function toArray (list, length) {
		if ( length === void 0 ) length = list.length;

		var array = Array(length)

		while (length--)
			array[length] = list[length]

		return array
	}

	function getLength (list, max, placeholder) {
		var length = 0
		var index = list.length
		index > max && (index = max)

		while (index--)
			list[index] !== placeholder && length++

		return length
	}

	function arrayConcat (a, b, placeholder) {
		var aLength = a.length
		var bLength = b.length
		var array = Array() // cannot guess final length, because of placeholders

		for (var i = 0, j = 0; i < aLength || j < bLength; i++)
			array[i] = i >= aLength || a[i] === placeholder ? b[j++] : a[i]

		return array
	}

	partial[signature] = partialDebug[signature] = 'partial :: (α1, …, αN → β), ?[α1, …] = [] → (…, αN → β)'

	partial.placeholder = partialDebug.placeholder = placeholder

	partial.debug = partialDebug

	function partialDebug (fn, args) {
		if ( args === void 0 ) args = [];

		var applied = partial(fn, args)

		/* attach debug info */
		var target = fn[targetFn] || fn
		applied.toString = function () { return ("/* partially applied */" + target); }
		applied[signature] = target[signature]
		applied[targetFn] = target
		applied[boundThis] = this
		applied[partialArgs] = args

		return applied
	}

	function partial (fn, args) {
		if ( args === void 0 ) args = [];

		var length = fn.length

		return setArity(length - getLength(args, length, placeholder), function partiallyApplied () {
			return apply(fn, this, arrayConcat(args, arguments, placeholder))
		})
	}

	var curry = curryFactory(partial)
	var curryDebug = curryFactory(partialDebug, debug)

	curry[signature] = curryDebug[signature] = 'curry :: (α1, …, αN → β) A, ?Number N = A.length → (α1 → … → αN → β)'

	curry.placeholder = curryDebug.placeholder = placeholder

	curry.debug = curryDebug

	function curryFactory (partial, wrapper) {
		return function curry (fn, arity) {
			if ( arity === void 0 ) arity = fn.length;

			arity = parseInt(arity, 10) || 0

			var _curried = setArity(arity, function curried () {
				return getLength(arguments, arity, placeholder) === arity ?
					apply(fn, this, arguments) :
					partial.call(this, _curried, arguments)
			})

			return wrapper ? wrapper(_curried, fn) : _curried
		}
	}

	function debug (curried, fn) {
		/* attach debug info */
		var target = fn[targetFn] || fn
		curried.toString = function () { return ("/* curried */" + target); }
		curried[signature] = target[signature]
		curried[targetFn] = target

		return curried
	}

	/* global Object: false */

	var create = Object.create

	/* global Object: false */

	var defineProperties = Object.defineProperties

	var property = function (value, settings) { return assign({ value: value }, settings); }
	var define = function (properties, method) {
		if (method)
			properties[method.name] = property(method, {enumerable: true})
		return properties
	}

	function canning (constructor, value) {
		return create(constructor.prototype, { valueOf: property(function () { return value; })})
	}

	/* global Object: false */

	function container (ref) {
		var constructor = ref.constructor;
		var ref_parent = ref.parent, parent = ref_parent === void 0 ? Object : ref_parent;

		return defineProperties(constructor, {
		prototype: property(
			create(parent.prototype, [].concat(ref.methods).reduce(define, {
				constructor: property(constructor)
				, toString: property(function toString () { return ((constructor.name) + "(" + (this.valueOf()) + ")") })
			}))
		)
		, toString: property(function toString () { return ("function " + (constructor.name) + "(value) { [container] }") })
	});
	}

	var Functor = container({
		constructor: function Functor (value) { return canning(Functor, value) }
		, methods: function map (fn) { return this.constructor(fn(this.valueOf())) }
	})

	var Apply = container({
		constructor: function Apply (value) { return canning(Apply, value) }
		, methods: function ap (functor) { return functor.map(this.valueOf()) }
		, parent: Functor
	})

	var Chain = container({
		constructor: function Chain (value) { return canning(Chain, value) }
		, methods: function chain (fn) { return this.map(fn).valueOf() }
		, parent: Apply
	})

	// Chain.prototype.chain = function chain (fn) { return this.map(fn).valueOf() }

	// Chain.prototype.chain = function chain (fn) { return fn(this.valueOf()) }

	// Chain.prototype.ap = function ap (functor) { return this.chain(fn => functor.map(fn)) }

	var Applicative = container({
		constructor: function Applicative (value) { return canning(Applicative, value) }
		, methods: function of (value) { return this.constructor(value) }
		, parent: Apply
	})

	/* global Object: false, TypeError: false */

	var _setPrototype
	try {
		_setPrototype = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set
		_setPrototype.call({}, null)
	} catch (e) {
		_setPrototype = function setPrototype () {
			this['__proto__'] = prototype // does not work in IE < 11
		}
	}

	function isObject (x) {
		return typeof x === 'function' || typeof x === 'object' && x !== null
	}

	var setPrototype = Object.setPrototypeOf || function setPrototypeOf (object, prototype) {
		if (!isObject(object))
			throw new TypeError('cannot set prototype on a non-object')
		if (!(prototype === null || isObject(proto)))
			throw new TypeError(("can only set prototype to an object or null " + prototype))
		_setPrototype.call(object, prototype)
		return object
	}

	/* global Object: false */

	var getPrototype = Object.getPrototypeOf

	var Monad = container({
		constructor: function Monad (value) { return canning(Monad, value) },
		parent: Chain
	})

	Monad.prototype = setPrototype(getPrototype(Monad.prototype), Applicative.prototype)

	var Identity = container({
		constructor: function Identity (value) { return canning(Identity, value) },
		parent: Monad
	})

	Identity.of = Identity

	Identity[signature] = 'Identity :: α → Identity α'

	var Noop = container({
		constructor: function Noop (value) { return canning(Noop, value) }
		, methods: [
			function map () { return this }
			, function chain () { return this }
			, function ap () { return this }
		]
		, parent: Monad
	})

	Noop.of = Noop

	Noop[signature] = 'Noop :: α → Noop α'

	/* global Object: false, Function: false */

	var isEnumerable = Function.call.bind(Object.prototype.propertyIsEnumerable)

	/* global Object: false */

	var values = Object.values || function values (object) {
		return Object.keys(object).reduce(
			function (values, key) { return (typeof key === 'string' && isEnumerable(object, key)) ?
				values.concat([object[key]]) :
				values; }
			, []
		)
	}

	var Maybe = container({
		constructor: function Maybe (value) { return value == null ? nothing : Just(value) }
		, parent: Monad
	})

	Maybe.of = function of (value) { return Maybe(value) }

	Maybe[signature] = 'Maybe :: α|null → Maybe α null'

	var Just = container({
		constructor: function Just (value) { return canning(Just, value) }
		, methods: Maybe.of
		, parent: Maybe
	})

	var Nothing = container({
		constructor: function Nothing () { return canning(Nothing, null) }
		, methods: values(Noop.prototype).concat(Maybe.of)
		, parent: Maybe
	})

	var nothing = Nothing(null)

	trace[signature] = 'trace :: String → α → α'

	/* global console: false */

	function trace (tag, value) {
		console.log((tag + " %1$O\n%1$s"), value)
		return value
	}

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

	function composeTrace () {
		return apply(compose, this, map(function (fn) { return trace('compose', fn); }, arguments))
	}

	function composeDebug () {
		var composed = apply(compose, null, arguments)
		var last = arguments[arguments.length - 1]

		/* attach debug info */
		var target = last[targetFn] || last
		composed.toString = function () { return ("/* composed */" + target); }
		composed[signature] = target[signature]
		composed[targetFn] = target

		return composed
	}

	function compose () {
		var functions = toArray(arguments)
		var last = arguments[arguments.length - 1]

		return setArity(last && last.length || 0, function composed () {
			return functions.reduceRight(composer, arguments).shift()
		})
	}

	var IO = container({
		constructor: function IO (value) { return canning(IO, value) }
		, methods: [
			function map (fn) { return IO(compose(fn, this.valueOf())) }
			, function of (value) { return IO(function () { return value; }) }
		]
		, parent: Monad
	})

	IO.of = IO.prototype.of

	IO[signature] = 'IO :: (* → α) → IO (* → α)'

	var Left = container({
		constructor: function Left (value) { return canning(Left, value) },
		parent: Noop
	})

	Left.of = Left

	Left[signature] = 'Left :: α → Left α'

	var Right = container({
		constructor: function Right (value) { return canning(Right, value) },
		parent: Monad
	})

	Right.of = Right

	Right[signature] = 'Right :: α → Right α'

	either.Left = Left
	either.Right = Right

	either[signature] = 'either :: (α → λ) → (β → λ) → Either α β → λ'

	function either (left, right, either) {
		if (either instanceof Left)
			return left(either.valueOf())
		if (either instanceof Right)
			return right(either.valueOf())
		throw TypeError((either + " must be instance of Right or Left"))
	}



	var monads = Object.freeze({
		Identity: Identity,
		Noop: Noop,
		Maybe: Maybe,
		Just: Just,
		Nothing: Nothing,
		IO: IO,
		either: either,
		Right: Right,
		Left: Left,
		Functor: Functor,
		Apply: Apply,
		Applicative: Applicative,
		Chain: Chain,
		Monad: Monad
	});

	/* global Function: false, Array: false */

	var slice = Function.call.bind(Array.prototype.slice)

	function _apply (container, apply) { return apply.ap(container) }

	var index_monads = assign(fp || {}, monads, {
		chain: curry.debug(function chain (fn, monad) { return monad.chain(fn) })
		, either: curry.debug(either)
		, join: function join (comonad) { return comonad.join() }
		, lift: curry.debug(function lift (fn, apply) {
			return slice(arguments, 2).reduce(_apply, map(fn, apply))
		})
	})

	return index_monads;

}));
//# sourceMappingURL=fp.monads.js.map
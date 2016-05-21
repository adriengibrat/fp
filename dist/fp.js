(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('fp', factory) :
	(global.fp = factory());
}(this, function () { 'use strict';

	var version = "0.0.1";

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

	/* global Object: false */

	var is = Object.is || function is (a, b) {
		return a === b ?
			//+0 !== -0
			a !== 0 || 1 / a === 1 / b :
			// NaN === NaN
			a !== a && b !== b
	}

	/* global Object: false */

	var getPrototype = Object.getPrototypeOf

	/* global Object: false, Array: false */

	function getProperties (object) {
		var properties = []
		for (; object != null; object = getPrototype(object))
			Array.prototype.push.apply(
				properties,
				Object.getOwnPropertyNames(object).concat(Object.getOwnPropertySymbols(object))
					.filter(function (property) { return properties.indexOf(property) === -1; })
			)
		return properties
	}

	function equals (a, b) {
		var aType = typeof a
		if (aType !== typeof b)
			return false
		if (is(a, b))
			return true
		if (aType !== 'object')
			return false
		var aProperties = getProperties(a)
		var bProperties = getProperties(b)
		var aValue = typeof a.valueOf === 'function' && a.valueOf()
		var bValue = typeof b.valueOf === 'function' && b.valueOf()
		var aContainValue = aValue !== a
		var bContainValue = bValue !== b

		return aProperties.length === bProperties.length
			&& aProperties.every(function (key) { return equals(a[key], b[key]); })
			&& (aContainValue && bContainValue ? equals(aValue, bValue) : true)
	}

	var signature = Symbol('signature')
	var targetFn = Symbol('targetFn')
	var boundThis = Symbol('boundThis')
	var partialArgs = Symbol('partialArgs')
	var placeholder = Symbol('placeholder')

	doc[signature] = 'doc :: (* → *) → String'

	/* global Object: false */

	function doc (fn) {
		return ("doc " + (fn && (fn[signature] || fn.name) || Object.prototype.toString.call(fn)))
	}

	/*
	// SEE http://www.cjandia.com/2012/06/x-calc/dhm/lib/?types.js
	const _funcNamePattern = /^([^:\s]+)\s*::\s+/
	const _separatorPattern = /\s*→\s+/
	const _namePattern = /\s+([a-zA-Z0-9]+)\s+/ // *Definition* Name
	//const _typePattern = /\s*[a-z\d]+\s*$/i // Type *Definition*
	const _argumentsPattern = /\s*,\s+/
	const _optionalPattern = /^\?\s*([^\s])(?:\s*([^=]))?(?:\s*=\s*(.*))?/ // ?*Type* *Name* = *Default*
	const _listPattern = /\[([^\]])\]/ // [*Definition*]
	function _parseArgs (signature) {
		let deepParenthesis = 0
		let deepList = 0
		let offset = 0

		signature.arguments = [].reduce.call(signature.source, function parser (args, char, index, string) {
			const openParenthesis = char === '('
			const closeParenthesis = char === ')'
			const openList = char === '['
			const closeList = char === ']'
			const separator = char === '→' || char === ','
			// const optional = char === '?'
			// const defaultValue = char === '='
			const end = index === string.length - 1

			const source = string.slice(offset ? offset : offset + 1, index)
			let parsed = []

			closeParenthesis && deepParenthesis--
			closeList && deepList--

			if (closeParenthesis && !deepParenthesis) { // parenthesis group
				parsed = _parseArgs({source})

				const named = string.slice(index + 1).match(_namePattern)
				if (named) {
					index += named[0].length
					parsed.name = named[1]
				}

				parsed.source = string.slice(offset ? offset - 1 : offset, index + 1).trim()

				offset = index + 1
			} else if (closeList && !deepList) { // list
				parsed = _parseArgs({source})

				parsed.type = 'List'
				parsed.of = source
				parsed.source = string.slice(offset ? offset - 1 : offset, index + 1)

				offset = index + 1
			} else if (!deepParenthesis && !deepList && separator || end) { // flat signature
				parsed = [string
					.slice(offset, index).trim()]
					//.split(_separatorPattern)
					//.reduce((args, arg) => args
					//	.concat(arg.split(_argumentsPattern).filter(Boolean))
					//, [])
					.map((string)=> ({ source: string }))
					// .map((item) => { // handle list type
					// 	const list = item.source.match(_listPattern)
					// 	if (list) {
					// 		item.type = 'List'
					// 		item.of = list[1]
					// 	}
					// 	return item
					// })
					.map((item) => { // handle optional params
						const optional = item.source.match(_optionalPattern)
						if (optional) {
							item.optional = true
							item.type = optional[2] && optional[1]
							item.name = optional[2] || optional[1]
							item.default = optional[3]
						}
						return item
					})
					.map((item) => { // guess name & type
						if (!item.name)
							item.name = item.source
						if (!item.type && item.name.length > 2) {
							item.type = item.name
							delete item.name
						}
						return item
					})

				offset = index + 1
			}

			openParenthesis && deepParenthesis++
			openList && deepList++

			return args.concat(parsed)
		}, [])
			.filter(Boolean)

		if (signature.arguments.length > 1) {
			signature.type = 'Function'
			signature.return = signature.arguments.pop()
			signature.arity = signature.arguments.find((arg) => arg.source === '…') ?
				'variadic' :
				signature.arguments.filter((arg) => !arg.optional).length
		}

		return signature
	}


	doc._parse = (fn) => {
		let name
		const _signature = fn && fn[signature]
		const parsed = _signature && _parseArgs({
			source: _signature.replace(_funcNamePattern, (_, _name) => (name = _name, ''))
		})
		parsed && (parsed.name = name)
		return parsed
	}
	//*/

	trace[signature] = 'trace :: String → α → α'

	/* global console: false */

	function trace (tag, value) {
		console.log((tag + " %1$O\n%1$s"), value)
		return value
	}

	/* global String: false */

	function path (path, object) {
		if(!Array.isArray(path))
			path = String.prototype.split.call(path, '.')
		return path.reduce(function (object, key) { return object != null ? object[key] : object; }, object)
	}

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

	/* global Object: false */

	function arrayConcat (a, b, placeholder) {
		var aLength = a.length
		var bLength = b.length
		var array = Array() // cannot guess final length, because of placeholders

		for (var i = 0, j = 0; i < aLength || j < bLength; i++)
			array[i] = i >= aLength || a[i] === placeholder ? b[j++] : a[i]

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

	/* global Error: false */

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

	/* global Array: false */

	function toArray (list, length) {
		if ( length === void 0 ) length = list.length;

		var array = Array(length)

		for (;length;)
			array[--length] = list[length]

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

	arity[signature] = 'arity :: (α1, …, αN → β) F, ?Number A = F.length → (α1, …, αA → β)'

	function arity (fn, arity) {
		if ( arity === void 0 ) arity = fn.length;

		return setArity(arity, function Nary () {
			arguments.length = arity
			return apply(fn, this, arguments)
		})
	}

	not[signature] = 'not :: (α1, …, αN → β) → (α1, …, αN → Boolean !β)'

	function not (fn) {
		return setArity(fn.length, function not () {
			return !apply(fn, this, arguments)
		})
	}

	noop[signature] = 'noop :: α → undefined'

	function noop () {}

	identity[signature] = 'identity :: α → α'

	function identity (value) {
		return value
	}

	constant[signature] = 'constant :: α → β → α'

	function constant (value) {
		return function () { return value; }
	}



	var functions = Object.freeze({
		noop: noop,
		identity: identity,
		constant: constant
	});

	var filters = {
		contains: function (b) { return function (a) { return String.prototype.indexOf.call(a, b) > -1; }; }
		, in:     function (b) { return function (a) { return String.prototype.indexOf.call(b, a) > -1; }; }
		, eq:     function (b) { return function (a) { return a === b; }; }
		, not:    function (b) { return function (a) { return a !== b; }; }
		, gte:    function (b) { return function (a) { return a >= b; }; }
		, lte:    function (b) { return function (a) { return a <= b; }; }
		, gt:     function (b) { return function (a) { return a > b; }; }
		, lt:     function (b) { return function (a) { return a < b; }; }
		, mod:    function (b) { return function (a) { return a % b; }; }
		, odd:    function (a) { return a % 2; }
	}

	var assignKey = function (object, value, key) { return (object[key] = value, object); }
	var pushValue = function (array, value) { return (array.push(value), array); }

	function first () { return  true }
	function tupple (value, index) { return [index, value] }
	var callback = function (x) {
		switch (typeof x) {
			case 'function':
				return x
			case 'string':
				return function (item) { return item[x]; }
			case 'object':
				var sequence = Collection.from(x)
				return function (item) { return sequence.every(function (value, key) { return item[key] === value; }); }
			case 'undefined':
				return function (item) { return item; }
			default:
				throw new Error(("Invalid callback " + x))
		}
	}

	function Collection (source) {
		this.source = source
	}

	Collection.prototype = {
		filter: function filter (predicate) { return new FilteredCollection(this, predicate) }
		, unique: function unique () {
			var unique = []
			return this.filter(function (value) { return unique.indexOf(value) < 0 && unique.push(value); }) // TODO indexOf perf
		}
		, map: function map (mapper) { return new MappedCollection(this, mapper) }
		, entries: function entries() { return this.map(tupple) }
		, slice: function slice (start, end) {
			end === undefined && hasOwnProperty(this, 'length') && (end = this.length)
			if (start < 0 || end < 0) {
				if (!('length' in this))
					return Collection.from(this.valueOf()).slice(start, end)
				start < 0 && (start += this.length)
				end  = end < 0 ? (end + this.length) : end || this.length
			}
			return new SlicedCollection(this, start || 0, end)
		}
		, find: function find (predicate) {
			var found
			this.forEach(function lookup (value, key) {
				if (predicate(value, key))
					return found = value, false
			})
			return found
		}
		, some: function some (predicate) {
			this.forEach(function (value, key) { return predicate(value, key) ? (predicate = false) : null; })
			return !predicate
		}
		, every: function every (predicate) { return !this.some(function not (value, key) { return !predicate(value, key) }) }
		, reduce: function reduce (reducer, accumulator) {
			if (arguments.length < 2)
				return this.slice(1).reduce(reducer, this.find(first)) // eg. head
			this.forEach(function accumulate (value, key) { accumulator = reducer(accumulator, value, key) })
			return accumulator
		}
		// , concat () {
		// 	return new ConcatenatedCollection(this, arguments)
		// }
		, toArray: function toArray () { return this.reduce(pushValue, hasOwnProperty(this, 'length') ? new Array(this.length) : []) }
		, toString: function toString () { return this.toArray().join('') }
		, toObject: function toObject () { return this.reduce(assignKey, {}) }
		, toJSON: function toJSON () { return this.valueOf() }
		, value: function value () { return this.toArray() } // lodash compatibility
		, valueOf: function valueOf () {
			var source = this.source
			while (source.valueOf === Collection.prototype.valueOf)
				source = source.source
			return source.valueOf.call(this)
		}
	}

	function IndexedCollection (index) {
		Collection.call(this, index)
		this.length = index.length
	}

	IndexedCollection.prototype = Object.create(Collection.prototype, {
		valueOf: { value: function valueOf () { return this.source } }
		, forEach: { value: function forEach (iteratee) {
			var index = -1
			var source = this.source
			var length = this.length
			while (++index < length)
				if (false === iteratee(source[index], index))
					break
			return this
		} }
		, has: { value: function has (index) { return hasOwnProperty(this.source, index) } }
		, get: { value: function get (index) { return this.source[index] } }
		// optimization
		, filter: { value: function filter (predicate) { return new FilteredIndexCollection(this, predicate) } }
	})

	function ArrayCollection (array) {
		IndexedCollection.call(this, array)
	}

	ArrayCollection.prototype = Object.create(IndexedCollection.prototype, {
		valueOf: { value: function valueOf () { return this.toArray() } }
		, toArray: { value: function toArray () { return this.source } }
	})

	function StringCollection (string) {
		IndexedCollection.call(this, string)
	}

	StringCollection.prototype = Object.create(IndexedCollection.prototype, {
		valueOf: { value: function valueOf () { return this.toString() } }
		, toString: { value: function toString () { return this.source } }
		, get: { value: function get (index) { return this.source.charAt(index) } }
	})

	function ObjectCollection (object) {
		Collection.call(this, object)
	}

	ObjectCollection.prototype = Object.create(Collection.prototype, {
		valueOf: { value: function valueOf () { return this.toObject() } }
		, toObject: { value: function toObject () { return this.source } }
		, forEach: { value: function forEach (iteratee) {
			var object = this.source
			for (var key in object)
				if (false === iteratee(object[key], key))
					break
			return this
		} }
		, has: { value: IndexedCollection.prototype.has }
		, get: { value: IndexedCollection.prototype.get }
		, length: { get: function length () { return this._length || (this._length = Object.keys(this.source).length) } }
	})

	function FilteredCollection (collection, predicate) {
		Collection.call(this, collection)
		this.predicate = callback(predicate)
	}

	FilteredCollection.prototype = Object.create(Collection.prototype, {
		forEach: { value: function forEach (iteratee) {
			var predicate = this.predicate
			var filteredIndex = -1
			this.source.forEach(function filteredIteratee (value, index) {
				if (predicate(value, index))
					return iteratee(value, typeof index === 'number' ? ++filteredIndex : index)
			})
			return this
		} }
		, filter: { value: function filter (predicate) { // filter composition optimization
			predicate = callback(predicate)
			var parentPredicate = this.predicate
			return this.source.filter(function composedPredicate (value, index) {
				return parentPredicate(value, index) && predicate(value, index)
			})
		} }
		, has:  { value: function has (index) { return this.source.has(index) && this.predicate(this.source.get(index), index) } }
		, get: { value: function get (index) {
			var value = this.source.get(index)
			return this.predicate(value, index) ? value : undefined
		} }
		, length: { get: function length () { return this.toArray().length } }
	})

	// optimization 
	function FilteredIndexCollection (collection, predicate) {
		FilteredCollection.call(this, collection, predicate)
	}

	FilteredIndexCollection.prototype = Object.create(FilteredCollection.prototype, {
		forEach: { value: function forEach (iteratee) {
			var source = this.source.source
			var predicate = this.predicate
			var length = source.length
			var filteredIndex = -1
			var sourceIndex = -1
			var value
			while (++sourceIndex < length) {
				value = source[sourceIndex]
				if (predicate(value, sourceIndex) && false === iteratee(value, ++filteredIndex))
					break
			}
			return this
		} }
		// , get: { value: function get (index) {
		// 	const value = this.source[index]
		// 	return this.predicate(value, index) ? value : undefined
		// } }
	})

	function MappedCollection (collection, mapper) {
		Collection.call(this, collection)
		this.mapper = callback(mapper)
	}

	MappedCollection.prototype = Object.create(Collection.prototype, {
		forEach: { value: function forEach (iteratee) {
			var mapper = this.mapper
			this.source.forEach(function mappedIteratee (value, index) {
				return iteratee(mapper(value, index), index)
			})
			return this
		} }
		, map: { value: function map (mapper) { // map composition optimization
			mapper = callback(mapper)
			var parentMapper = this.mapper
			return this.source.map(function composedMapper (value, index) {
				return mapper(parentMapper(value, index), index)
			})
		} }
		, has: { value: function has (index) { return this.source.has(index) } }
		, get: { value: function get (index) {
			if(this.has(index))
				return this.mapper(this.source.get(index), index)
		} }
		, length: { get: function length () { return this.source.length } }
	})

	function SlicedCollection (collection, start, end) {
		Collection.call(this, collection)
		this.start = start
		this.end = end
	}

	SlicedCollection.prototype = Object.create(Collection.prototype, {
		forEach: { value: function forEach (iteratee) {
			var end = this.end
			var sliceIndex = -1 - this.start
			this.source.forEach(function slicedIteratee (value, index) {
				if (++sliceIndex < 0)
					return
				return sliceIndex < end && iteratee(value, typeof index === 'number' ? sliceIndex : index)
			})
			return this
		} }
		, has: { value: function has (index) { return 0 <= index && index < this.length && this.source.has(index - this.start) } }
		, get: { value: function get (index) {
			if(0 <= index && index < this.length)
				return this.source.get(index - this.start)
		} }
		, length: { get: function length () { return this.end && Math.max(this.end - this.start, 0) } }
	})

	function getIterator (value) {
		if (value != null) {
			if (typeof value[Symbol.iterator] === 'function') // value has an iterator (ex: array, string, generator)
				return function () { return value[Symbol.iterator](); }
			if (typeof value.next === 'function') // value implements iterator protocol
				return function () { return value; }
			if (typeof value === 'function') // value may be a generator, better test may be Object.getPrototypeOf(value) === Object.getPrototypeOf(function*() {})
				return value
		}
		return function () { return ({ next: function next () { return { done: true } } }); }
	}

	/* global Array: false, Object: false */

	var collection = Collection.from = function (value) {
		if (Array.isArray(value))
			return new ArrayCollection(value) // collection specialized for array
		if (typeof value === 'string')
			return new StringCollection(value) // collection specialized for string
		if (typeof value === 'object' && value.constructor === Object)
			return new ObjectCollection(value) // collection specialized for object
		return new Collection(getIterator(value))
	}

	var index = assign(
		collection
		, {
			version: version
			, f: filters
			, placeholder: placeholder
			, doc: doc
			, partial: partial, curry: curry, compose: compose, arity: arity, not: not
		}
		, functions
		, map(function (fn) { return curry.debug(fn); }, { trace: trace, path: path, equals: equals, map: map })
	)

	return index;

}));
//# sourceMappingURL=fp.js.map
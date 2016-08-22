import hasOwnProperty from 'utils/object/hasOwnProperty'

export const filters = {
	contains: (b) => (a) => String.prototype.indexOf.call(a, b) > -1
	, in:     (b) => (a) => String.prototype.indexOf.call(b, a) > -1
	, eq:     (b) => (a) => a === b
	, not:    (b) => (a) => a !== b
	, gte:    (b) => (a) => a >= b
	, lte:    (b) => (a) => a <= b
	, gt:     (b) => (a) => a > b
	, lt:     (b) => (a) => a < b
	, mod:    (b) => (a) => a % b
	, odd:    (a) => a % 2
}


const assignKey = (object, value, key) => (object[key] = value, object)
const pushValue = (array, value) => (array.push(value), array)

function first () { return  true }
function tupple (value, index) { return [index, value] }
function byIndex (index) { return (_, i) => index === i }

const callback = (x) => {
	switch (typeof x) {
		case 'function':
			return x
		case 'string':
			return (item) => item[x]
		case 'object':
			const sequence = Collection.from(x)
			return (item) => sequence.every((value, key) => item[key] === value)
		case 'undefined':
			return (item) => item
		default:
			throw new Error(`Invalid callback ${x}`)
	}
}

export function Collection (source) {
	this.source = source
}

Collection.prototype = {
	filter (predicate) { return new FilteredCollection(this, predicate) }
	, unique () {
		const unique = []
		return this.filter((value) => unique.indexOf(value) < 0 && unique.push(value)) // TODO indexOf perf
	}
	, map (mapper) { return new MappedCollection(this, mapper) }
	, entries() { return this.map(tupple) }
	, slice (start, end) {
		end === undefined && hasOwnProperty(this, 'length') && (end = this.length)
		if (start < 0 || end < 0) {
			if (!('length' in this))
				return Collection.from(this.valueOf()).slice(start, end)
			start < 0 && (start += this.length)
			end  = end < 0 ? (end + this.length) : end || this.length
		}
		return new SlicedCollection(this, start || 0, end)
	}
	, find (predicate) {
		let found
		this.forEach(function lookup (value, key) {
			if (predicate(value, key))
				return found = value, false
		})
		return found
	}
	, some (predicate) {
		this.forEach((value, key) => predicate(value, key) ? (predicate = false) : null)
		return !predicate
	}
	, every (predicate) { return !this.some(function not (value, key) { return !predicate(value, key) }) }
	, reduce (reducer, accumulator) {
		if (arguments.length < 2)
			return this.slice(1).reduce(reducer, this.find(first)) // eg. head
		this.forEach(function accumulate (value, key) { accumulator = reducer(accumulator, value, key) })
		return accumulator
	}
	// , concat () {
	// 	return new ConcatenatedCollection(this, arguments)
	// }
	, toArray () { return this.reduce(pushValue, hasOwnProperty(this, 'length') ? new Array(this.length) : []) }
	, toString () { return this.toArray().join('') }
	, toObject () { return this.reduce(assignKey, {}) }
	, toJSON () { return this.valueOf() }
	, value () { return this.toArray() } // lodash compatibility
	, valueOf () {
		let source = this.source
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
		let index = -1
		const source = this.source
		const length = this.length
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
		const object = this.source
		for (let key in object)
			if (false === iteratee(object[key], key))
				break
		return this
	} }
	, has: { value: IndexedCollection.prototype.has }
	, get: { value: IndexedCollection.prototype.get }
	, length: { get: function length () { return this._length || (this._length = Object.keys(this.source).length) } }
})

function IteratorCollection (iterator) {
	Collection.call(this, iterator)
}

IteratorCollection.prototype = Object.create(Collection.prototype, {
	valueOf: { value: function valueOf () { return this } }
	, forEach: { value: function forEach (iteratee) {
		const iterator = this.source()
		let index = -1
		let result
		while ((result = iterator.next()) && !result.done)
			if (false === iteratee(result.value, ++index))
				break
		return this
	} }
	, has: { value: function has (index) { return this.some(byIndex(index)) } }
	, get: { value: function get (index) { return this.find(byIndex(index)) } }
})

function FilteredCollection (collection, predicate) {
	Collection.call(this, collection)
	this.predicate = callback(predicate)
}

FilteredCollection.prototype = Object.create(Collection.prototype, {
	forEach: { value: function forEach (iteratee) {
		const predicate = this.predicate
		let filteredIndex = -1
		this.source.forEach(function filteredIteratee (value, index) {
			if (predicate(value, index))
				return iteratee(value, typeof index === 'number' ? ++filteredIndex : index)
		})
		return this
	} }
	, filter: { value: function filter (predicate) { // filter composition optimization
		predicate = callback(predicate)
		const parentPredicate = this.predicate
		return this.source.filter(function composedPredicate (value, index) {
			return parentPredicate(value, index) && predicate(value, index)
		})
	} }
	, has:  { value: function has (index) { return this.source.has(index) && this.predicate(this.source.get(index), index) } }
	, get: { value: function get (index) {
		const value = this.source.get(index)
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
		const source = this.source.source
		const predicate = this.predicate
		const length = source.length
		let filteredIndex = -1
		let sourceIndex = -1
		let value
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
		const mapper = this.mapper
		this.source.forEach(function mappedIteratee (value, index) {
			return iteratee(mapper(value, index), index)
		})
		return this
	} }
	, map: { value: function map (mapper) { // map composition optimization
		mapper = callback(mapper)
		const parentMapper = this.mapper
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
		const end = this.end
		let sliceIndex = -1 - this.start
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
			return () => value[Symbol.iterator]()
		if (typeof value.next === 'function') // value implements iterator protocol
			return () => value
		if (typeof value === 'function') // value may be a generator, better test may be Object.getPrototypeOf(value) === Object.getPrototypeOf(function*() {})
			return value
	}
	return () => ({ next () { return { done: true } } })
}

/* global Array: false, Object: false */

export default Collection.from = (value) => {
	if (Array.isArray(value))
		return new ArrayCollection(value) // collection specialized for array
	if (typeof value === 'string')
		return new StringCollection(value) // collection specialized for string
	if (typeof value === 'object' && value.constructor === Object)
		return new ObjectCollection(value) // collection specialized for object
	return new Collection(getIterator(value))
}

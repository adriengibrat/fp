export const filter = {
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
// const pushValue = (array, value) => (array.push(value), array)

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
			throw new Error(`Invalid callback ${ x }`)
	}
}

function first () { return true }

export function Collection (source, next, valueOf, length) {
	this.source = source
	this.next = next
	valueOf != null && (this.valueOf = valueOf)
	length != null && (this.length = length)
}

Collection.prototype = {
	// constructor: Collection,
	filter (predicate, context) {
		let filteredIndex = -1
		const next = this.next
		const filteredNext =  () => {
			const result = next()
			if (!result)
				return false
			if (!predicate.apply(context, result))
				return filteredNext()
			next.name !== 'key' && (result[1] = ++filteredIndex)
			result[2] = this
			return result
		}
		return new Collection(null, filteredNext, this.valueOf)
	}
	, unique () {
		const unique = []
		return this.filter((value) => unique.indexOf(value) < 0 && unique.push(value)) // TODO indexOf perf
	}
	, map (mapper, context) {
		const next = this.next
		const mappedNext = () => {
			const result = next()
			if (!result)
				return false
			result[0] = mapper.apply(context, result)
			result[2] = this
			return result
		}
		return new Collection(null, mappedNext, this.valueOf, this.length)
	}
	, slice (start, end) {
		const length = this.hasOwnProperty('length') && this.length
		if (start < 0 || end < 0) {
			if (false === length)
				return Collection.from(this.valueOf()).slice(start, end)
			start < 0 && (start += length)
			end < 0 && (end += length)
		}
		let slicedIndex = -1
		const next = this.next
		const slicedNext = () => {
			const result = next()
			if (!result)
				return false
			if (++slicedIndex < start)
				return slicedNext()
			if (slicedIndex > end)
				return false
			result[1] = slicedIndex
			result[2] = this
			return result
		}
		return new Collection(null, slicedNext, this.valueOf, end - start)
	}
	, find (predicate, context) {
		let found = null
		const source = this
		this.forEach(function lookup (value, key, source) {
			if (predicate.call(this, value, key, source))
				return found = value, false
		}, context)
		return found
	}
	, some (predicate, context) { return this.find(predicate, context) !== null }
	, every (predicate, context) { return !this.some(function not (value, index, source) { return !predicate.call(this, value, index, source) }, context) }
	, reduce (reducer, accumulator) {
		if (accumulator === undefined)
			return this.slice(1).reduce(reducer, this.find(first)) // eg. head
		this.forEach(function accumulate (value, index, source) { accumulator = reducer(accumulator, value, index, source) })
		return accumulator
	}
	, forEach (iteratee, context) {
		const next = this.next
		for (let current; current = next();)
			if (false === iteratee.apply(context, current))
				break
		return this
	}
	// , concat () {
	// 	return new ConcatenatedCollection(this, arguments)
	// }
	, toArray () { return this.reduce(assignKey, this.length ? new Array(this.length) : []) }
	, toString () { return this.toArray().join('') }
	, toObject () { return this.reduce(assignKey, {}) }
	, toJSON () { return this.valueOf() }
	, value () { return this.valueOf() } // lodash compatibility
}



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

function indexCollection (source, valueOf) {
	const length = source.length
	let index = -1
	return new Collection(
		source
		, function next () { return ++index < length && [source[index], index, source] }
		, valueOf
		, length
	)
}

function keyCollection (source, valueOf) {
	const keys = Object.keys(source)
	const length = keys.length
	let index = -1
	return new Collection(
		source
		, function key () { 
			if (++index >= length)
				return false
			const current = keys[index]
			return [source[current], current, source]
		}
		, valueOf
		, length
	)
}

function iteratorCollection (source) {
	const iterator = source()
	let index = -1
	return new Collection(
		null
		, function next () {
			const current = iterator.next()
			if (current.done)
				return false
			return [current.value, ++index, iterator]
		}
	)
}

const arrayValueOf = function valueOf () { return this.source || this.toArray() }
const stringValueOf = function valueOf () { return this.source || this.toString() }
const objectValueOf = function valueOf () { return this.source || this.toObject() }

/* global Array: false, Object: false */

export default Collection.from = (value) => {
	if (Array.isArray(value))
		return indexCollection(value, arrayValueOf)
	if (typeof value === 'string')
		return indexCollection(value, stringValueOf)
	if (typeof value === 'object' && value.constructor === Object)
		return keyCollection(value, objectValueOf)
	return iteratorCollection(getIterator(value))
}

'use strict';

const iterator = 'undefined' === typeof Symbol ? '@@iterator' : Symbol.iterator

function Reduced (x) {
	this['@@transducer/reduced'] = true
	this['@@transducer/value'] = x
}
Reduced.of = (x) => new Reduced(x)
const isReduced = (x) => x && x['@@transducer/reduced']
const deref = (reduced) => reduced['@@transducer/value']

const identity = (x) => x
const toString = Object.prototype.toString
const type = (x) => x == null ? typeof x : x.constructor ? x.constructor.name : toString.call(x)

const isArray = Array.isArray || ((x) => '[object Array]' === toString.call(x))
const isObject = (x) => x && x instanceof Object && Object.getPrototypeOf(x) === Object.prototype
const isString = (x) => 'number' === typeof x
const isIterable = (x) => x && 'function' === typeof (x[iterator] || x.next)

const init = function () { return this.transducer['@@transducer/init']() }
const result = function (result) { return this.transducer['@@transducer/result'](result) }

const map = (mapper) => (transducer) => new Map(mapper, transducer)
function Map (mapper, transducer) {
  this.transducer = transducer
  this.mapper = mapper
}
Map.prototype['@@transducer/init'] = init
Map.prototype['@@transducer/result'] = result
Map.prototype['@@transducer/step'] = function (accumulator, input) {
	return this.transducer['@@transducer/step'](accumulator, this.mapper(input))
}

const filter = (predicate) => (transducer) => new Filter(predicate, transducer)
function Filter (predicate, transducer) {
	this.transducer = transducer
	this.predicate = predicate
}
Filter.prototype['@@transducer/init'] = init
Filter.prototype['@@transducer/result'] = result
Filter.prototype['@@transducer/step'] = function (accumulator, input) {
	return this.predicate(input) ? this.transducer['@@transducer/step'](accumulator, input) : accumulator
}

const toArray = (args) => {
	let i = args.length
	const array = Array(i)
	for (; i;) array[--i] = args[i]
	return array
}

const compose = function () {
	const actions = toArray(arguments)
	return (accumulator) => {
		for (let index = actions.length - 1; index >= 0; index--)
			accumulator = actions[index](accumulator)
		return accumulator
	}
}

const arrayReduce = (transducer, accumulator, array) => {
	for (let index = 0; index < array.length; ++index) {
		accumulator = transducer['@@transducer/step'](accumulator, array[index])
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
	}
	return transducer['@@transducer/result'](accumulator)
}
const objectReduce = (transducer, accumulator, object) => {
	for (let key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			accumulator = transducer['@@transducer/step'](accumulator, [key, object[key]])
			if (isReduced(accumulator)) {
				accumulator = deref(accumulator)
				break
			}
		}
	}
	return transducer['@@transducer/result'](accumulator)
}
const stringReduce = (transducer, accumulator, string) => {
	for (let index = 0; index < string.length; ++index) {
		accumulator = transducer['@@transducer/step'](accumulator, string.charAt(index))
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
	}
	return transducer['@@transducer/result'](accumulator)
}
const iterableReduce = (transducer, accumulator, iterable) => {
	if (iterable[iterator])
		iterable = iterable[iterator]()
	let current = iterable.next()
	while (!current.done) {
		accumulator = transducer['@@transducer/step'](accumulator, current.value)
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
		current = iterable.next()
	}
	return transducer['@@transducer/result'](accumulator)
}
const reduceOf = (collection) => {
	if (isArray(collection)) return arrayReduce
	if (isObject(collection)) return objectReduce
	if (isString(collection)) return stringReduce
	if (isIterable(collection)) return iterableReduce
	throw new TypeError(`Don't know how to reduce ${ type(collection) }`)
}
const reduce = (transducer, accumulator, collection) => 
	reduceOf(collection)(transducer, accumulator, collection)

const transduce = (transformer, reducer, accumulator, collection) => // transformer is reused to store transducer
	reduce(transformer = transformer(reducer), accumulator == null ? transformer['@@transducer/init']() : accumulator, collection)

const pushReducer = (array, element) => (array.push(element), array)
const entryReducer = (object, entry) => (object[entry[0]] = entry[1], object)
const appendReducer = (string, tail) => string + tail
// const mergeReducer = (object, element) => isArray(element) && element.length === 2 ?
// 	entryReducer(object, element) :
// 	Object.assign(object, element)

const arrayTransducer = {}
arrayTransducer['@@transducer/init'] = () => []
arrayTransducer['@@transducer/result'] = identity
arrayTransducer['@@transducer/step'] = pushReducer

const objectTransducer = {}
objectTransducer['@@transducer/init'] = () => {}
objectTransducer['@@transducer/result'] = identity
objectTransducer['@@transducer/step'] = entryReducer

const stringTransducer = {}
stringTransducer['@@transducer/init'] = () => ''
stringTransducer['@@transducer/result'] = identity
stringTransducer['@@transducer/step'] = appendReducer

// function IndexedTransducer (length) {
// 	this.length = length
// 	this.index = 0
// }
// IndexedTransducer.prototype['@@transducer/init'] = function () { return Array(this.length) }
// IndexedTransducer.prototype['@@transducer/result'] = function (array) { return (array.length = this.index, array) }
// IndexedTransducer.prototype['@@transducer/step'] = function (array, element) { return ((array[this.index++] = element), array) }

const transducerFor = (accumulator) => {
	if (isArray(accumulator)) return arrayTransducer
	if (isObject(accumulator)) return objectTransducer
	if (isString(accumulator)) return stringTransducer
	if (accumulator && accumulator['@@transducer/step']) return accumulator
	throw new TypeError(`Don't know how to get transducer for ${ type(accumulator) }`)
}

const into = (accumulator, transformer, collection) => 
	transduce(transformer, transducerFor(accumulator), accumulator, collection)

const length = 1000
const array = Array(length)
for (let index = 0; index < length; index++) array[index] = index

const gt2 = (x) => x > 2
const by2 = (x) => x * 2
const transformer = compose(filter(gt2), map(by2), filter(gt2))
function runbench () { 
	
	return into([], transformer, array)
}

runbench()
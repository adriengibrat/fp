'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const lodash = require('lodash/core')
const lazy = require('lazy.js')
const t = require('transducers-js')

const array = []
const object = {}
const length = 10000
for (let index = 0; index < length; index++) {
	 array[index] = index
	if (index < 100)
		object[String.fromCharCode(index + 65)] = index
}
const string = array.join('')

const id = (a) => a
const inc = (a) => a + 1
const sum = (a, b) => a + b
const odd = (a) => a % 2
const gt5 = (a) => a > 5

const reduce = Function.call.bind(Array.prototype.reduce)
const map = Function.call.bind(Array.prototype.map)
const filter = Function.call.bind(Array.prototype.filter)
const slice = Function.call.bind(Array.prototype.slice)
const type = Function.call.bind(Object.prototype.toString)
const inspect = (object, limit) => {
	if (null == object)
		return type(object).slice(0, limit)
	if (typeof object !== 'object')
		return object.toString().slice(0, limit)
	const properties = []
	let index = -1
	for (let property in object)
		(!limit || ++index < limit) && properties.push(`${property}:${object[property]}`)
	return properties.join(', ').slice(0, limit)
}

function typeOf (a) {
	const b = typeof a
	if ('object' === b) {
		if (!a)
			return 'null'
		if (a instanceof Array)
			return 'array'
		if (a instanceof Object)
			return b
		const c = Object.prototype.toString.call(a)
		if ('[object Window]' === c)
			return 'object'
		if ('[object Array]' === c || 'number' === typeof a.length && 'undefined' !== typeof a.splice && 'undefined' != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('splice'))
			return 'array'
		if ('[object Function]' === c || 'undefined' !== typeof a.call && 'undefined' !== typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('call'))
			return 'function'
	} else if ('function' === b && 'undefined' === typeof a.call)
		return 'object'
	return b
}

function isObject (a) { return 'object' === typeOf(a) }
function predicateEntry (predicate) { return (entry) => predicate(entry[1], entry[0]) }
function mapEntry (mapper) { return (entry) => (entry[1] = mapper(entry[1], entry[0]), entry) }
function entryValue (entry) { return entry[1] }
function EntryValue (transformer) {
  this.transformer = transformer
}
EntryValue.of = (transformer) => new EntryValue(transformer)
EntryValue.prototype["@@transducer/init"] = function init () {
  return this.transformer["@@transducer/init"]()
}
EntryValue.prototype["@@transducer/result"] = function result (accumulator) {
  return this.transformer["@@transducer/result"](accumulator)
}
EntryValue.prototype["@@transducer/step"] = function step (accumulator, entry) {
  return this.transformer["@@transducer/step"](accumulator, entry[1])
}

function push (array, item) { return array.push(item), array }
let i = 0
function compose () {
	switch (arguments.length) {
		case 0:
			return id
		case 1:
			return arguments[0]
		default:
			return t.comp.apply(null, arguments)
	}
}

function Transduce (input) {
	this.input = input
	this.steps = []
}
Transduce.from = (input) => new Transduce(input)
Transduce.prototype = {
	map (mapper) {
		this.steps.push(t.map(isObject(this.input) ? mapEntry(mapper) : mapper))
		return this
	}
	, filter (predicate) {
		this.steps.push(t.filter(isObject(this.input) ? predicateEntry(predicate) : predicate))
		return this
	}
	, reduce (reducer, accumulator) {
		return t.reduce(t.toFn(compose.apply(null, isObject(this.input) ? this.steps.concat(EntryValue.of) : this.steps), reducer), accumulator, this.input)
	}
	, slice (start, end) {
		start && this.steps.push(t.drop(start))
		end && this.steps.push(t.take(end - start))
		return this
	}
	, value () {
		return this.reduce(push, [])
	}
}




const bench = (runner, value) => {
	const expected = runner.naive(value)
	let result
	return new benchmark({ maxTime: 1, minSamples: 2 })
		.add('naive', () => runner.naive(value))
		.add('fp', runner(fp, value))
		.add('lodash', runner(lodash, value))
		.add('transduce', runner(Transduce.from, value))
		.add('lazy', function () { try { return runner(lazy, value).call() } catch (error) { return String(this.error = error) } })
		.on('start', () => console.log(runner.name, type(value).slice(8, 11)))
		.on('cycle', (event) => console.log(fp.equals(result = event.target.fn(), expected) ? '✓' : '✗', String(event.target), inspect(result, 50)))
		.on('complete', function () { console.log('Fastest is', this.filter('successful').filter('fastest').map('name'), '\n') })
		.run({ 'async': true })
}

function instanceValue (wrapper, value) {
	return function runbench () { return wrapper(value).value() }
}
instanceValue.naive = id

function filterValue (wrapper, value) {
	return function runbench () { return wrapper(value).filter(odd).value() }
}
filterValue.naive = (value) => filter(value, odd)

function mapValue (wrapper, value) {
	return function runbench () { return wrapper(value).map(inc).value() }
}
mapValue.naive = (value) => map(value, inc)

function mapMapValue (wrapper, value) {
	return function runbench () { return wrapper(value).map(inc).map(inc).value() }
}
mapMapValue.naive = (value) => map(map(value, inc), inc)

function filterFilterValue (wrapper, value) {
	return function runbench () { return wrapper(value).filter(odd).filter(gt5).value() }
}
filterFilterValue.naive = (value) => filter(filter(value, odd), gt5)

function reduceSum (wrapper, value) {
	return function runbench () { return wrapper(value).reduce(sum, 0) }
}
reduceSum.naive = (value) => reduce(value, sum, 0)

function filterSliceValue (wrapper, value) {
	return function runbench () { return wrapper(value).filter(odd).slice(1, 3).value() }
}
filterSliceValue.naive = (value) => slice(filter(value, odd), 1, 3)

function mapFilterMapReduce (wrapper, value) {
	return function runbench () { return wrapper(value).map(inc).filter(odd).map(inc).value() }
}
mapFilterMapReduce.naive = (value) => reduce(map(filter(map(value, inc), odd), inc), sum, 0)

return [
	// instanceValue
	, mapValue
	, 
	mapMapValue
	, 
	filterValue
	, filterFilterValue
	, reduceSum
	, 
	filterSliceValue
	, 
	mapFilterMapReduce
].reduce((run, test) => {
	const benchWith = (value) => () => new Promise((resolve) => bench(test, value).on('complete', resolve).on('error', resolve))
	// const benchWith = (value) => () => new Promise((resolve) => resolve(
	// 	test(fp, value).call(),
	// 	//test(lodash, value).call(),
	// 	test(lazy, value).call())
	// )
	return Promise.resolve(run)
		.then(benchWith(array))
		.then(benchWith(object))
		.then(benchWith(string))
}, null)


function* fibonacci () {
	let a = 0
	let b = 1
	while (true) {
		let current = a
		a = b
		b += current
		yield current
	}
}
const fibonacciFn = () => {
	const sequence = fibonacci()
	return () => sequence.next().value
}
const lazyFibo = () => lazy.generate(fibonacciFn()).take(10)
const fpFibo = () => fp(fibonacci()).slice(0, 10)
const validFibo = (fn) => fn() === 52 ? '✓' : '✗'

new benchmark()
	.add('fp', bench(fpFibo))
	.add('lazy', bench(lazyFibo))
	.on('cycle', (event) => console.log(validFibo(event.target.fn), String(event.target)))
	.on('complete', function () { console.log('\nFastest is ' + this.filter('fastest').map('name')) })
	.run({ async: true })

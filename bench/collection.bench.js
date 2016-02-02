'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const lodash = require('lodash/core')
const lazy = require('lazy.js')

const array = []
const object = {}
const length = 10000
for (let index = 0; index < length; index++) array[index] = object[String.fromCharCode(index + 65)] = index
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
		return type(object)
	if (typeof object !== 'object')
		return object.toString().slice(0, limit)
	const properties = []
	let index = -1
	for (let property in object)
		(!limit || ++index < limit) && properties.push(`${property}:${object[property]}`)
	return properties.join(', ')
}

const bench = (runner, value) => {
	const expected = runner.naive(value)
	let result
	new benchmark()
		//.add('naive', () => runner.naive(value))
		.add('fp', runner(fp, value))
		.add('lodash', runner(lodash, value))
		.add('lazy', runner(lazy, value))
		.on('cycle', (event) => console.log(fp.equals(result = event.target.fn(), expected) ? '✓' : '✗', String(event.target), inspect(result, 10)))
		.on('complete', function () { console.log('\n', runner.name, type(value).slice(8, 11), 'Fastest is', this.filter('fastest').map('name'), '\n') })
		.run({ maxTime: 1, minSamples: 2 })
}

function mapFilterMapReduce (wrapper, value) {
	return function runbench () { return wrapper(value).map(inc).filter(odd).map(inc).reduce(sum, 0) }
}
mapFilterMapReduce.naive = (value) => reduce(map(filter(map(value, inc), odd), inc), sum, 0)

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
	return function runbench () { return wrapper(value).filter(odd).slice(-3, -1).value() }
}
filterSliceValue.naive = (value) => slice(filter(value, odd), -3, -1)

Array(
	// instanceValue,
	mapValue
	, mapMapValue
	, filterValue
	, filterFilterValue
	, reduceSum
	, mapFilterMapReduce
	// , filterSliceValue
).forEach((test) => {
	bench(test, array)
	bench(test, object)
	bench(test, string)
})

return

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

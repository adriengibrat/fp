'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const lodash = {curry: require('lodash/curry')}
const ramda = require('ramda')
ramda.curry.placeholder = ramda.__

function fn (a, b) {
  return [].slice.call(arguments)
}

const noCurry = () => {
	const a = 1
	const b = 2
	return fn(a, b)
}
const manual = () => ((a) => (b) => fn(a, b))(1)(2)

const bench = (curry) => {
	const curried = curry(fn) // bench curried function, not currying process
	return () => curried(curry.placeholder, 2)(1)
}
const valid = (fn) => JSON.stringify(fn()) === '[1,2]' ? '✓' : '✗'

new benchmark()
	// .add('no curry', noCurry)
	// .add('manual curry', manual)
	.add('fp.curry', bench(fp.curry))
	.add('fp.curry.debug', bench(fp.curry.debug))
	.add('lodash.curry', bench(lodash.curry))
	.add('ramda.curry', bench(ramda.curry))
	.on('cycle', (event) => console.log(valid(event.target.fn), String(event.target)))
	.on('complete', function () { console.log('\nFastest is ' + this.filter('fastest').map('name')) })
	.run({ async: true })

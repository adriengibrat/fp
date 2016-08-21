'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const lodash = { curry: require('lodash/curry') }
const ramda = require('ramda')
ramda.curry.placeholder = ramda.__

const bench = (test, valid) => new benchmark(test.name)
	.add('fp.curry', test(fp.curry))
	.add('fp.curry.debug', test(fp.curry.debug))
	.add('lodash.curry', test(lodash.curry))
	.add('ramda.curry', test(ramda.curry))
	.on('start', event => console.log('Bench %s', event.currentTarget.name))
	.on('cycle', event => console.log('%s %s', valid(event.target.fn) ? '✓' : '✗', event.target))
	.on('complete', event => console.log('-> Fastest is %s', event.currentTarget.filter('fastest').map('name')))
	.run()

function fn (a, b) {
	return [].slice.call(arguments)
}

// currying process speed
bench(function currying (curry) {
	return () => curry(fn)
}, fn => fn().length === 2)

const valid = fn => JSON.stringify(fn()) === '[1,2]'

// curried function speed
bench(function basics (curry) {
	const curried = curry(fn)
	return () => curried(1)(2)
}, valid)

// curried function speed using placeholder
bench(function placeholder (curry) {
	const curried = curry(fn) 
	return () => curried(curry.placeholder, 2)(1)
}, valid)

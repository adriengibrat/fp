'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const lodashCurry = require('lodash/curry')
const ramda = require('ramda')
ramda.curry.placeholder = ramda.__
const curry = require('@thisables/curry').curry
const placeholder = require('@thisables/curry')._
const curryThis = { _curry: curry, curry: function (fn) { return curry.call(fn) }, placeholder: placeholder }

const bench = (test, valid) => new benchmark(test.name)
	.add('fp.curry', test(fp.curry))
	.add('fp.curry.debug', test(fp.curry.debug))
	.add('lodash.curry', test(lodashCurry))
	.add('ramda.curry', test(ramda.curry))
	.add('curryThis', test(curryThis.curry))
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

const valid = fn => fn && JSON.stringify(fn()) === '[1,2]'

// curried function speed
bench(function basics (curry) {
	const curried = curry(fn)
	return () => curried(1)(2)
}, valid)

// curried function speed using placeholder
bench(function placeholder (curry) {
	if (curryThis.curry === curry) {
		return 
		// const curried = curryThis._curry.call(fn, curry.placeholder, 2)
		// return () => curried(1)
	}
	const curried = curry(fn)
	return () => curried(curry.placeholder, 2)(1)
}, valid)

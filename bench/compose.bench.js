'use strict';

const benchmark = require('benchmark').Suite

const fp = require('../dist/fp')
const ramda = require('ramda')

const bench = (test, valid) => new benchmark(test.name)
	.add('fp.compose', test(fp.compose))
	.add('fp.compose.debug', test(fp.compose.debug))
	.add('ramda.compose', test(ramda.compose))
	.on('start', event => console.log('Bench %s', event.currentTarget.name))
	.on('cycle', event => console.log('%s %s', valid(event.target.fn) ? '✓' : '✗', event.target))
	.on('complete', event => console.log('-> Fastest is %s', event.currentTarget.filter('fastest').map('name')))
	.run()

function reverse (array) {
	return array.slice().reverse()
}

function head (array) {
	return array[0]
}

// composing process speed
bench(function composing (compose) {
	return () => compose(head, reverse)
}, fn => fn().length === reverse.length)

// composed function speed
bench(function basics (compose) {
	const composed = compose(head, reverse)
	return () => composed([1,2,3])
}, fn => fn() === 3)

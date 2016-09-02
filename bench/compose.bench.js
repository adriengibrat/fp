'use strict';

const Suite = require('benchmark').Suite

const implementations = [{
	name: 'fp.compose'
	, fn: require('../dist/fp').compose
}, {
	name: 'fp.compose.debug'
	, fn: require('../dist/fp').compose.debug
}, {
	name: 'ramda.compose'
	, fn: require('ramda').compose
}, {
	name: 'compose-function'
	, fn: require('compose-function')
}]

const bench = (name, implementations, test, valid) =>
	new Promise((resolve, reject) => {
		const suite = new Suite(name)
			.on('start', event => console.log('Bench %s', event.currentTarget.name))
			.on('cycle', event => console.log('%s %s', valid(event.target.fn) ? '✓' : '✗', event.target))
			.on('complete', event => console.log('-> Fastest is %s', event.currentTarget.filter('fastest').map('name')))
			.on('complete', () => resolve(suite))
			.on('error', () => reject(suite))
		implementations.forEach(implementation => suite.add(implementation.name, test(implementation.fn)))
		suite.run({ async: true })
	})

const reverse = array => array.reverse()

const head = array => array[2]

const example = (_, $) => [1, 2, 3]

bench(
	'composing process'
	, implementations
	, compose => _ => compose(head, reverse, example)
	, fn => fn().length === example.length
)
.then(bench.bind(null,
	'composed function'
	, implementations
	, compose => compose(head, reverse, example)//.bind(null)
	, fn => fn() === 1
))
.then(bench.bind(null,
	'composing + composed call'
	, implementations
	, compose => _ => compose(head, reverse, example)()
	, fn => fn() === 1
))

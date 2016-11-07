/* global console: false */

import { Suite } from 'benchmark'
import { compose as fpCompose } from './src/index'
import { compose as ramdaCompose } from 'ramda'
import fnCompose from 'compose-function'

const implementations = [
	{ name: 'fp.compose', args: [fpCompose] }
	, { name: 'fp.compose.debug', args: [fpCompose.debug] }
	, { name: 'ramda.compose', args: [ramdaCompose] }
	, { name: 'compose-function', args: [fnCompose] }
]

const bench = (name, implementations, test, valid) =>
	new Promise((resolve, reject) => {
		const suite = new Suite(name)
			.on('start', event => console.log('Bench %s', event.currentTarget.name))
			.on('cycle', event => console.log('%s %s', valid(event.target.fn) ? '✓' : '✗', event.target))
			.on('complete', event => console.log('-> Fastest is %s', event.currentTarget.filter('fastest').map('name')))
			.on('complete', () => resolve(suite))
			.on('error', () => reject(suite))
		implementations.forEach(implementation => suite.add(implementation.name, test.apply(null, implementation.args)))
		suite.run({ async: true })
	})

const reverse = array => array.reverse()
const head = array => array[0]
const list = (a, b) => [a, b, true]

bench(
	'composing process'
	, implementations
	, compose => () => compose(head, reverse, list)
	, fn => fn().length === list.length
)
.then(() => bench(
	'composed function'
	, implementations
	, compose => compose(head, reverse, list)
	, fn => fn() === true
))
.then(() => bench(
	'composing + composed call'
	, implementations
	, compose => () => compose(head, reverse, list)()
	, fn => fn() === true
))

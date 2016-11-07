/* global console: false */

import { Suite } from 'benchmark'
import { curry as fpCurry } from './src/index'
import lodashCurry from 'lodash/curry'
import { curry as ramdaCurry, __ as ramdaPlaceholder } from 'ramda'

const implementations = [
  { name: 'fp.curry', args: [fpCurry, fpCurry.placeholder] },
  { name: 'fp.curry.debug', args: [fpCurry.debug, fpCurry.placeholder] },
  { name: 'lodash.curry', args: [lodashCurry, lodashCurry.placeholder] },
  { name: 'ramda.curry', args: [ramdaCurry, ramdaPlaceholder] }
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

const fn = (a, b) => [a, b]
const valid = fn => JSON.stringify(fn()) === '[1,2]'

// currying process speed
bench(
  'composing process',
  implementations,
  curry => () => curry(fn),
  fn => fn().length === 2
)
// curried function speed
.then(() => bench(
  'curried',
  implementations,
  curry => {
    const curried = curry(fn)
    return () => curried(1)(2)
  },
  valid
))
// curried function speed using placeholder
.then(() => bench(
  'placeholders',
  implementations,
  (curry, placeholder) => {
    const curried = curry(fn)(placeholder, 2)
    return () => curried(1)
  },
  valid
))

/* global Symbol: true, Object: false */

if ('undefined' === typeof Symbol)
	Symbol = symbol => Object({ toString: () => `@@${symbol}` })

const signature = Symbol('signature')
const targetFn = Symbol('targetFn')
const boundThis = Symbol('boundThis')
const partialArgs = Symbol('partialArgs')
const placeholder = Symbol('placeholder')

export { signature, targetFn, boundThis, partialArgs, placeholder }
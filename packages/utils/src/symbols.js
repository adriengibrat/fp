/* global Symbol: true, Object: false */

if (typeof Symbol === 'undefined') {
  Symbol = symbol => Object({ toString: () => `@@${symbol}` })
}

export const signature = Symbol('signature')
export const targetFn = Symbol('targetFn')
export const boundThis = Symbol('boundThis')
export const partialArgs = Symbol('partialArgs')
export const placeholder = Symbol('placeholder')

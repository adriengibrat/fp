import {signature} from 'utils/doc'

export default function compose(...functions) {
  return (...args) =>
  	functions.reduceRight(
  		(args, fn) => [fn.apply(this, args.slice(0, fn.length || undefined))].concat(args.slice(fn.length || 1)),
  		args
  	)
  	.shift()
}

compose[signature] = composeTrace[signature] = '(y → z), …, (x → y) → (x → z)'

import trace from 'utils/trace'

export function composeTrace(...functions) {
	return compose.apply(null, functions.map(fn => trace('compose', fn)))
}

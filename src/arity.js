import { setArity, apply } from 'optims'
import { signature } from 'symbols'

arity[signature] = 'arity :: (α1, …, αN → β) F, ?Number A = F.length → (α1, …, αA → β)'

export default function arity (fn, arity = fn.length) {
	return setArity(arity, function Nary () {
		arguments.length = arity
		return apply(fn, this, arguments)
	})
}
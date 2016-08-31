import { setArity, apply } from 'optims'
import { setSignature } from 'utils/doc'

const arity = (arity, fn) => setArity(arity, function Nary () {
	arguments.length = arity
	return apply(fn, this, arguments)
})

setSignature('arity :: N → (α1, …, αN, … → β) → (α1, …, αN → β)', arity)

export default arity

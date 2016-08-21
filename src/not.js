import { setArity, apply } from 'optims'
import { signature } from 'symbols'

not[signature] = 'not :: (α1, …, αN → β) → (α1, …, αN → Boolean !β)'

export default function not (fn) {
	return setArity(fn.length, function not () {
		return !apply(fn, this, arguments)
	})
}

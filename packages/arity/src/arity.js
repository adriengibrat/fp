import { setArity, apply } from '@fp/utils'

export default (n, fn) => setArity(n, function Nary () {
  arguments.length = n
  return apply(fn, this, arguments)
})

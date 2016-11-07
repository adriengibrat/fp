import { setArity, arrayConcat, apply, getLength, placeholder } from '@fp/utils'

export { placeholder }

export default (fn, args = []) => {
  const length = fn.length

  return setArity(length - getLength(args, length, placeholder), function partiallyApplied () {
    return apply(fn, this, arrayConcat(args, arguments, placeholder))
  })
}

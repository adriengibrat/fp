import { setArity, apply, getLength, placeholder } from '@fp/utils'

export { placeholder }

export default (partial, wrapper) => {
  return (arity, fn) => {
    // arity = parseInt(arity, 10) || 0

    const curried = setArity(arity, function () {
      return getLength(arguments, arity, placeholder) === arity
        ? apply(fn, this, arguments)
        : partial.call(this, curried, arguments)
    })

    return wrapper(curried, fn)
  }
}

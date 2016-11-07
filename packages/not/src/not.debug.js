import not from './not'
import { targetFn } from '@fp/utils'

export default function (fn) {
  const negated = not(fn)

  /* attach debug info */
  const target = fn[targetFn] || fn
  negated.toString = () => `/* negated */${target}`
  negated[targetFn] = target

  return negated
}

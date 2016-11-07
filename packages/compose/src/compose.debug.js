import compose from './compose'
import { targetFn } from '@fp/utils'

export default function () {
  const composed = compose.apply(null, arguments)
  const last = arguments[arguments.length - 1]

  /* attach debug info */
  const target = last[targetFn] || last
  composed.toString = () => `/* composed */${target}`
  composed[targetFn] = target

  return composed
}

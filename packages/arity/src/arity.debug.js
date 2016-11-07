import { targetFn } from '@fp/utils'

import arity from './arity'

export default (n, fn) => {
  const limited = arity(n, fn)

  const target = fn[targetFn] || fn
  limited.toString = () => `/* arity ${n} */${target}`
  limited[targetFn] = target

  return limited
}

import { partial } from '@fp/partial'
import { targetFn } from '@fp/utils'

import curryFactory, { placeholder } from './curry.factory'

export { placeholder }

export default curryFactory(partial.debug, (curried, fn) => {
  /* attach debug info */
  const target = fn[targetFn] || fn
  curried.toString = () => `/* curried */${target}`
  curried[targetFn] = target

  return curried
})

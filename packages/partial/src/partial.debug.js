import { targetFn, partialArgs } from '@fp/utils'

import partial, { placeholder } from './partial'

export { placeholder }

export default function (fn, args = []) {
  const applied = partial(fn, args)

  const target = fn[targetFn] || fn
  applied.toString = () => `/* partially applied */${target}`
  applied[targetFn] = target
  applied[partialArgs] = args

  return applied
}

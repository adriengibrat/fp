import { partial } from '@fp/partial'
import { identity } from '@fp/identity'

import curryFactory, { placeholder } from './curry.factory'

export { placeholder }

export default curryFactory(partial, identity)

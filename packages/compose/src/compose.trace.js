import compose from './compose'
import { apply } from '@fp/utils'
import { map } from '@fp/map'
import { trace } from '@fp/trace'

export default (...args) => apply(compose, null, map(trace('compose'), args))

import { placeholder, apply } from '@fp/utils'
import { doc } from '@fp/doc'

import { trace } from '@fp/trace'
import { map } from '@fp/map'
import { path } from '@fp/path'

import { arity } from '@fp/arity'
import { not } from '@fp/not'

import { noop } from '@fp/noop'
import { identity } from '@fp/identity'
import { constant } from '@fp/constant'

import { partial } from '@fp/partial'
import { curry } from '@fp/curry'
import { compose } from '@fp/compose'

export default {
  not,
  noop,
  identity,
  constant,
  arity: Object.assign(curry(arity), arity),
  placeholder,
  doc,
  trace: Object.assign(curry(trace), trace),
  path: Object.assign(curry(path), path),
  map: Object.assign(curry(map), map),
  partial,
  compose: Object.assign(compose, {
    trace: Object.assign((...args) => apply(compose, null, map(trace('compose'), args)), {
      signature: compose.signature
    })
  }),
  curry: Object.assign(curry, {
    n: Object.assign(curry(curry.n), curry.n, {
      debug: Object.assign(curry(curry.n.debug), curry.n.debug)
    })
  })
  // equals:  curry(equals),
}

import partial, { placeholder } from './partial'
import debug from './partial.debug'
import signature from './partial.signature'

partial.signature = signature
partial.placeholder = placeholder
partial.debug = debug
partial.debug.signature = signature
partial.debug.placeholder = placeholder

export { partial }

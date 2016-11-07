import arity from './arity'
import debug from './arity.debug'
import signature from './arity.signature'

arity.signature = signature
arity.debug = debug
arity.debug.signature = signature

export { arity }

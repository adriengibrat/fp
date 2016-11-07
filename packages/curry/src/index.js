import curry, { placeholder } from './curry'
import debug from './curry.debug'
import signature from './curry.signature'
import curryN from './curry.n'
import curryNDebug from './curry.n.debug'
import curryNDebugSignature from './curry.n.signature'

curry.debug = debug
curry.signature = curry.debug.signature = signature
curry.n = curryN
curry.n.debug = curryNDebug
curry.n.signature = curry.n.debug.signature = curryNDebugSignature
curry.placeholder = curry.debug.placeholder = curry.n.placeholder = curry.n.debug.placeholder = placeholder

export { curry }

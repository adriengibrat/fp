import compose from './compose'
import debug from './compose.debug'
// import trace from './compose.trace'
import signature from './compose.signature'

compose.signature = signature
compose.debug = debug
compose.debug.signature = signature
// compose.trace = trace
// compose.trace.signature = signature

export { compose }

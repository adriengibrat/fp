import not from './not'
import debug from './not.debug'
import signature from './not.signature'

not.signature = signature
not.debug = debug
not.debug.signature = signature

export { not }

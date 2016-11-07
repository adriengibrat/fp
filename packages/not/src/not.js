import { setArity, apply } from '@fp/utils'

export default fn => setArity(fn.length, function () { return !apply(fn, this, arguments) })

import { setArity, apply } from 'optims'
import { setSignature } from 'utils/doc'

const not = fn => setArity(fn.length, function not () { return !apply(fn, this, arguments) })

setSignature('not :: (* → α) → (* → !α)', not)

export default not

import debug, { placeholder } from './curry.n.debug'

export { placeholder }

export default fn => debug(fn.length, fn)

import curryN, { placeholder } from './curry.n'

export { placeholder }

export default fn => curryN(fn.length, fn)

import { signature, targetFn } from '@fp/utils'

/* global Object: false */

const getSignature = fn => fn && fn[signature] || getSignature(fn && fn[targetFn])

// export const setSignature = (string, fn) => {
//   fn[signature] = string
//   return fn
// }

export default fn => `doc ${getSignature(fn) || fn && fn.name || Object.prototype.toString.call(fn)}`

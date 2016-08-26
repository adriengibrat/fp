import { signature } from 'symbols'

/* global Object: false */

const setSignature = (string, fn) => fn && (fn[signature] = string)

const getSignature = fn => fn && fn[signature]

const doc = fn => `doc ${ getSignature(fn) || fn && fn.name || Object.prototype.toString.call(fn) }`

setSignature('doc :: (* → *) → String', doc)

export { setSignature, getSignature }

export default doc

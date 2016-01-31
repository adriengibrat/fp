import trace from 'utils/trace'

export default function doc(fn) { return fn[signature] }

export const signature = Symbol('signature')

doc.trace = (fn) => trace(`doc ${fn.name || fn} ${doc(fn)||''}`, fn)
// doc.copy = (x, y) => y[signature] = x[signature]
doc.trace[signature] = doc[signature] = '(* → x) → String|undefined'

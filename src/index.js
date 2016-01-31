import doc, {signature} from 'utils/doc'
import trace from 'utils/trace'
import compose, {composeTrace} from './compose'
import curry, {curryN, curryDebug} from './curry'
import * as stringMethods from 'fn/string'
import * as arrayMethods from 'fn/array'

curry.debug = curryDebug
compose.trace = composeTrace

identity[signature] = 'x → x'
function identity(x) { return x }

// String → String
head[signature] = '[x] → x|undefined'
function head(list) { return list[0] }

add[signature] = 'Number → Number → Number'
function add(x, y) { return x + y }

let objectMap = (fn, object) => Object.keys(object).reduce((target, key) => (target[key] = fn(object[key]), target), {})
const fp = objectMap(curryDebug, {
	doc, trace,
	compose, curry, curryN,
	identity, head, add,
	...stringMethods,
	...arrayMethods
})
let copy = (target, alias) => Object.keys(alias).forEach((key) => target[key] = target[alias[key]])
copy(fp, {first: 'head', id: 'identity'})

export default fp

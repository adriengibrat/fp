import {signature} from 'utils/doc'

/* global Function: false, console: false */

export default function trace(tag, x) { return (Function('tag, x', 'tag && console.log(tag); console.dir(x)')(tag, x), x) }

trace[signature] = 'String → x → x'

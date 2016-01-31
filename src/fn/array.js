import {signature} from 'utils/doc'

export function concat (array, y) { return array.concat(y) }
concat[signature] = '[x] → [x]|x → [x]'

export function reduce (reducer, accumulator, array) { return array.reduce(reducer, accumulator) }
reduce[signature] = '((x, y) → x) → x → [y] → x'

export function join (glue, array) { return array.join(glue) }
join[signature] = 'String → [x] → String'

// Filterable f => (x → Boolean) → f x → f x
export function filter (predicate, array) { return array.filter(predicate) }
filter[signature] = '(x → Boolean) → [x] → [x]|undefined'

// Functor f => (x → y) → f x → f y
export function map (mapper, array) { return array.map(mapper) }
map[signature] = '(x → y) → [x] → [y]'
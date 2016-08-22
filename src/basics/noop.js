import { signature } from 'symbols'

noop[signature] = 'noop :: α → undefined'

export default function noop () {}

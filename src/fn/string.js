import {signature} from 'utils/doc'

export function upper (string) { return string.toUpperCase() }
export function lower (string) { return string.toLowerCase() }
upper[signature] = upper[signature] = 'String → String'

export function split (pattern, string) { return string.split(pattern) }
split[signature] = 'String|RegExp → String → [String]'

export function replace (pattern, replacement, string) { return string.replace(pattern, replacement) }
replace[signature] = 'RegExp|String → String → String → String'

export function match (pattern, string) { return string.match(pattern) }
upper[signature] = 'RegExp → String → [String|undefined]'
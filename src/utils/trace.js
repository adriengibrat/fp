import { signature } from 'symbols'

trace[signature] = 'trace :: String → α → α'

/* global console: false */

export default function trace (tag, value) {
	// eslint-disable-next-line no-console
	console.log(`${ tag } %1$O\n%1$s`, value)
	return value
}

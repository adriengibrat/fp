import { signature } from 'symbols'

constant[signature] = 'constant :: α → β → α'

export default function constant (value) {
	return () => value
}

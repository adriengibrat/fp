import { signature } from 'symbols'

identity[signature] = 'identity :: α → α'

export default function identity (value) {
	return value
}

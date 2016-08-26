import { setSignature } from 'utils/doc'

setSignature('constant :: α → β → α', constant)

export default function constant (value) {
	return () => value
}

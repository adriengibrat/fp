import { setSignature } from 'utils/doc'

setSignature('identity :: α → α', identity)

export default function identity (value) {
	return value
}

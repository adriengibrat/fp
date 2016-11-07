import { placeholder } from '../symbols'

const attachPlaceholder = fn => {
	fn.placeholder = placeholder
	return fn
}

export default attachPlaceholder

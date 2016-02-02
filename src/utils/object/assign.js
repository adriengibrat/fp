import hasOwnProperty from 'utils/object/has-own-property'

/* global Object: false */

export default Object.assign || function assign (target) {
	for (let index = 1; index < arguments.length; index++) {
		let source = arguments[index]
		if (source != null)
			for (let key in source)
				if (hasOwnProperty(source, key))
					target[key] = source[key]
	}
	return target
}

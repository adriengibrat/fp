import isEnumerable from 'utils/object/property-is-enumerable'

/* global Object: false */

export default Object.values || function values (object) {
	return Object.keys(object).reduce(
		(values, key) => (typeof key === 'string' && isEnumerable(object, key)) ?
			values.concat([object[key]]) :
			values
		, []
	)
}

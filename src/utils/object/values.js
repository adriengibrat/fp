import propertyIsEnumerable from '_propertyIsEnumerable'

/* global Object: false */

export default Object.values || function values (object) {
	return Object.keys(object).reduce(
		(values, key) => (typeof key === 'string' && propertyIsEnumerable(object, key)) ?
			values.concat([object[key]]) :
			values
		, []
	)
}

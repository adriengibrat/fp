import getPrototypeOf from 'getPrototypeOf'
import is from 'is'

/* global Object: false, Array: false */

function getProperties (object) {
	const properties = []
	for (; object != null; object = getPrototypeOf(object))
		Array.prototype.push.apply(
			properties,
			Object.getOwnPropertyNames(object).concat(Object.getOwnPropertySymbols(object))
				.filter((property) => properties.indexOf(property) === -1)
		)
	return properties
}

export default function equals (a, b) {
	const aType = typeof a
	if (aType !== typeof b)
		return false
	if (is(a, b))
		return true
	if (aType !== 'object')
		return false
	const aProperties = getProperties(a)
	const bProperties = getProperties(b)
	const aValue = typeof a.valueOf === 'function' && a.valueOf()
	const bValue = typeof b.valueOf === 'function' && b.valueOf()
	const aContainValue = aValue !== a
	const bContainValue = bValue !== b

	return aProperties.length === bProperties.length
		&& aProperties.every((key) => equals(a[key], b[key]))
		&& (aContainValue && bContainValue ? equals(aValue, bValue) : true)
}

import create from 'utils/object/create'
import assign from 'utils/object/assign'
import defineProperties from 'utils/object/define-properties'

const property = (value, settings) => assign({ value }, settings)
const define = (properties, method) => {
	if (method)
		properties[method.name] = property(method, {enumerable: true})
	return properties
}

export function canning (constructor, value) {
	return create(constructor.prototype, { valueOf: property(() => value)})
}

/* global Object: false */

export default ({constructor, methods, parent = Object}) => defineProperties(constructor, {
	prototype: property(
		create(parent.prototype, [].concat(methods).reduce(define, {
			constructor: property(constructor)
			, toString: property(function toString () { return `${constructor.name}(${this.valueOf()})` })
		}))
	)
	, toString: property(function toString () { return `function ${constructor.name}(value) { [container] }` })
})

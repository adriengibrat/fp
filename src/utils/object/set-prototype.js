/* global Object: false, TypeError: false */

let _setPrototype
try {
	_setPrototype = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set
	_setPrototype.call({}, null)
} catch (e) {
	_setPrototype = function setPrototype () {
		this['__proto__'] = prototype // does not work in IE < 11
	}
}

function isObject (x) {
	return typeof x === 'function' || typeof x === 'object' && x !== null
}

export default Object.setPrototypeOf || function setPrototypeOf (object, prototype) {
	if (!isObject(object))
		throw new TypeError('cannot set prototype on a non-object')
	if (!(prototype === null || isObject(proto)))
		throw new TypeError(`can only set prototype to an object or null ${prototype}`)
	_setPrototype.call(object, prototype)
	return object
}

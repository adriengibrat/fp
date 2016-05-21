// import create from 'utils/object/create'
// import defineProperties from 'utils/object/define-properties'

// See https://github.com/zloirock/core-js#ecmascript-6-symbol
// See https://github.com/medikoo/es6-symbol

// const Symbol = Symbol || (function (Object, objPrototype, defineProperty) {
// 	const created = create(null)

// 	const generateName = function (description) {
// 		let postfix = 0

// 		while (created[description + (postfix || '')]) ++postfix
// 		description += (postfix || '')
// 		created[description] = true

// 		const name = '@@' + description
// 		let ie11BugWorkaround

// 		defineProperty(objPrototype, name, {
// 			get: function () {}
// 			, set: function (value) {
// 				// For IE11 issue see:
// 				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
// 				//    ie11-broken-getters-on-dom-objects
// 				// https://github.com/medikoo/es6-symbol/issues/12
// 				if (ie11BugWorkaround) return
// 				ie11BugWorkaround = true
// 				defineProperty(this, name, {value})
// 				ie11BugWorkaround = false
// 			}
// 		})
// 		return name
// 	}

// 	const isSymbol = function (x) {
// 		return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false
// 	}

// 	const validateSymbol = function (value) {
// 		if (!isSymbol(value)) throw new TypeError(`${value} is not a symbol`)
// 		return value
// 	}

// 	function SymbolTweak (description) { return Symbol(description) }

// 	defineProperties(SymbolTweak.prototype, {
// 		toString: { value: function () { return `Symbol (${validateSymbol(this).__description__})` } },
// 		valueOf: { value: function () { return validateSymbol(this) } }
// 	})

// 	function Symbol (description) {
// 		if (this instanceof Symbol)
// 			throw TypeError('TypeError: Symbol is not a constructor')

// 		const symbol = create(Symbol.prototype)
// 		description = (description === undefined ? '' : String(description))

// 		return defineProperties(symbol, {
// 			__description__: { value: description },
// 			__name__: { value: generateName(description) }
// 		})
// 	}

// 	defineProperties(Symbol.prototype, {
// 		constructor: { value: SymbolTweak },
// 		toString: { value: function () { return this.__name__ } },
// 		'@@toStringTag': { value: 'Symbol' }
// 	})

// 	return Symbol

// })(Object, Object.prototype, Object.defineProperty)

export const signature = Symbol('signature')
export const targetFn = Symbol('targetFn')
export const boundThis = Symbol('boundThis')
export const partialArgs = Symbol('partialArgs')
export const placeholder = Symbol('placeholder')

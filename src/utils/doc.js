import {signature} from 'symbols'

doc[signature] = 'doc :: (* → *) → String'

/* global Object: false */

export default function doc (fn) {
	return `doc ${fn && (fn[signature] || fn.name) || Object.prototype.toString.call(fn)}`
}

/*
// SEE http://www.cjandia.com/2012/06/x-calc/dhm/lib/?types.js
const _funcNamePattern = /^([^:\s]+)\s*::\s+/
const _separatorPattern = /\s*→\s+/
const _namePattern = /\s+([a-zA-Z0-9]+)\s+/ // *Definition* Name
//const _typePattern = /\s*[a-z\d]+\s*$/i // Type *Definition*
const _argumentsPattern = /\s*,\s+/
const _optionalPattern = /^\?\s*([^\s])(?:\s*([^=]))?(?:\s*=\s*(.*))?/ // ?*Type* *Name* = *Default*
const _listPattern = /\[([^\]])\]/ // [*Definition*]
function _parseArgs (signature) {
	let deepParenthesis = 0
	let deepList = 0
	let offset = 0

	signature.arguments = [].reduce.call(signature.source, function parser (args, char, index, string) {
		const openParenthesis = char === '('
		const closeParenthesis = char === ')'
		const openList = char === '['
		const closeList = char === ']'
		const separator = char === '→' || char === ','
		// const optional = char === '?'
		// const defaultValue = char === '='
		const end = index === string.length - 1

		const source = string.slice(offset ? offset : offset + 1, index)
		let parsed = []

		closeParenthesis && deepParenthesis--
		closeList && deepList--

		if (closeParenthesis && !deepParenthesis) { // parenthesis group
			parsed = _parseArgs({source})

			const named = string.slice(index + 1).match(_namePattern)
			if (named) {
				index += named[0].length
				parsed.name = named[1]
			}

			parsed.source = string.slice(offset ? offset - 1 : offset, index + 1).trim()

			offset = index + 1
		} else if (closeList && !deepList) { // list
			parsed = _parseArgs({source})

			parsed.type = 'List'
			parsed.of = source
			parsed.source = string.slice(offset ? offset - 1 : offset, index + 1)

			offset = index + 1
		} else if (!deepParenthesis && !deepList && separator || end) { // flat signature
			parsed = [string
				.slice(offset, index).trim()]
				//.split(_separatorPattern)
				//.reduce((args, arg) => args
				//	.concat(arg.split(_argumentsPattern).filter(Boolean))
				//, [])
				.map((string)=> ({ source: string }))
				// .map((item) => { // handle list type
				// 	const list = item.source.match(_listPattern)
				// 	if (list) {
				// 		item.type = 'List'
				// 		item.of = list[1]
				// 	}
				// 	return item
				// })
				.map((item) => { // handle optional params
					const optional = item.source.match(_optionalPattern)
					if (optional) {
						item.optional = true
						item.type = optional[2] && optional[1]
						item.name = optional[2] || optional[1]
						item.default = optional[3]
					}
					return item
				})
				.map((item) => { // guess name & type
					if (!item.name)
						item.name = item.source
					if (!item.type && item.name.length > 2) {
						item.type = item.name
						delete item.name
					}
					return item
				})

			offset = index + 1
		}

		openParenthesis && deepParenthesis++
		openList && deepList++

		return args.concat(parsed)
	}, [])
		.filter(Boolean)

	if (signature.arguments.length > 1) {
		signature.type = 'Function'
		signature.return = signature.arguments.pop()
		signature.arity = signature.arguments.find((arg) => arg.source === '…') ?
			'variadic' :
			signature.arguments.filter((arg) => !arg.optional).length
	}

	return signature
}


doc._parse = (fn) => {
	let name
	const _signature = fn && fn[signature]
	const parsed = _signature && _parseArgs({
		source: _signature.replace(_funcNamePattern, (_, _name) => (name = _name, ''))
	})
	parsed && (parsed.name = name)
	return parsed
}
//*/

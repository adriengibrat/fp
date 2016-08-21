/* global Object: false */

export default function arrayConcat (a, b, placeholder) {
	const aLength = a.length
	const bLength = b.length
	const array = Array() // cannot guess final length, because of placeholders

	for (let i = 0, j = 0; i < aLength || j < bLength; ++i)
		array[i] = i >= aLength || a[i] === placeholder ? b[j++] : a[i]

	return array
}

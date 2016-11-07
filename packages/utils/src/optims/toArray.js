/* global Array: false */

export default (list, length = list.length) => {
	const array = Array(length)

	for (;length;)
		array[--length] = list[length]

	return array
}

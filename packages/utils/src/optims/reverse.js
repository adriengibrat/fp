/* global Array: false */

export default (list, length = list.length) => {
	const array = Array(length)
	length -= 1

	for (let index = 0; index <= length; ++index)
		array[index] = list[length - index]

	return array
}
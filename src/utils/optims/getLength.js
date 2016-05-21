export default function getLength (list, max, placeholder) {
	let length = 0
	let index = list.length
	index > max && (index = max)

	while (index--)
		list[index] !== placeholder && length++

	return length
}

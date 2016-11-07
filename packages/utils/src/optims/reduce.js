export default (fn, list, accumulator) => {
	let index = 0
	const length = list.length
	if (accumulator == null)
		accumulator = list[index++]
	while (index < length)
		accumulator = fn(accumulator, list[index++])
	return accumulator
}

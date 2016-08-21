import { isReduced, deref } from './reduced'

const arrayReduce = (transducer, accumulator, array) => {
	for (let index = 0; index < array.length; ++index) {
		accumulator = transducer['@@transducer/step'](accumulator, array[index])
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
	}
	return transducer['@@transducer/result'](accumulator)
}

export default arrayReduce

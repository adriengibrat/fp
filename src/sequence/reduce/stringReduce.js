import { isReduced, deref } from './reduced'

const stringReduce = (transducer, accumulator, string) => {
	for (let index = 0; index < string.length; ++index) {
		accumulator = transducer['@@transducer/step'](accumulator, string.charAt(index))
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
	}
	return transducer['@@transducer/result'](accumulator)
}


export default stringReduce

import { isReduced, deref } from './reduced'
import hasOwnProperty from 'utils/object/hasOwnProperty'

const objectReduce = (transducer, accumulator, object) => {
	for (let key in object) {
		if (hasOwnProperty(object, key)) {
			accumulator = transducer['@@transducer/step'](accumulator, [key, object[key]])
			if (isReduced(accumulator)) {
				accumulator = deref(accumulator)
				break
			}
		}
	}
	return transducer['@@transducer/result'](accumulator)
}

export default objectReduce

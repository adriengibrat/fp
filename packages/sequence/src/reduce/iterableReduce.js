import { isReduced, deref } from './reduced'
import iteratorSymbol from '../_iteratorSymbol'

const iterableReduce = (transducer, accumulator, iterable) => {
	if (iterable[iteratorSymbol])
		iterable = iterable[iteratorSymbol]()
	let current = iterable.next()
	while (!current.done) {
		accumulator = transducer['@@transducer/step'](accumulator, current.value)
		if (isReduced(accumulator)) {
			accumulator = deref(accumulator)
			break
		}
		current = iterable.next()
	}
	return transducer['@@transducer/result'](accumulator)
}

export default iterableReduce
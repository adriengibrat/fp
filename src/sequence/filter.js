import { init, result } from './_transform'

export function Filter (predicate, transducer) {
	this.transducer = transducer
	this.predicate = predicate
}

Filter.prototype['@@transducer/init'] = init
Filter.prototype['@@transducer/result'] = result
Filter.prototype['@@transducer/step'] = function step (accumulator, input) {
	if (!this.predicate(input))
		return accumulator
	return this.transducer['@@transducer/step'](accumulator, input)
}

export default (predicate) => (transducer) => new Filter(predicate, transducer)

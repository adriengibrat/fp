import compose from './compose'
import filter from './filter'
import into from './into'
import map from './map'
import transduce from './transduce'
import { init, result } from './_transform'
import { isObject } from './_types'

function Entry (transducer) {
  this.transducer = transducer
}

Entry.prototype['@@transducer/init'] = init
Entry.prototype['@@transducer/result'] = result
Entry.prototype['@@transducer/step'] = function step (accumulator, entry) {
  return this.transducer['@@transducer/step'](accumulator, entry[1])
}

Entry.of = (transducer) => new Entry(transducer)
Entry.filter = (predicate) => (entry) => predicate(entry[1], entry[0])
Entry.map = (mapper) => (entry) => (entry[1] = mapper(entry[1], entry[0]), entry)

function Sequence (input) {
  this.input = input
  this.steps = []
}

Sequence.prototype = {
  get transformer () {
    const isEntry = isObject(this.input)
    return compose.apply(null, this.steps.map(
			(step) => step.action(isEntry ? Entry[step.action.name](step.fn) : step.fn)
		).concat(isEntry ? Entry.of : []))
  },
  map (mapper) {
    this.steps.push({ action: map, fn: mapper })
    return this
  },
	 filter (predicate) {
   this.steps.push({ action: filter, fn: predicate })
   return this
 },
	 reduce (reducer, accumulator) {
   return transduce(this.transformer, reducer, accumulator, this.input)

		// t.reduce(t.toFn(compose.apply(null, isObject(this.input) ? this.steps.concat(EntryValue.of) : this.steps), reducer), accumulator, this.input)
 },
	 slice (start, end) {
   start && this.steps.push(/*drop(start)*/)
   end && this.steps.push(/*take(end - start)*/)
   return this
 },
	 value () {
   return into([], this.transformer, this.input)
 }
}

export default Sequence.from = (input) => new Sequence(input)

import { init, result } from './_transform'

export function Map (mapper, transducer) {
  this.transducer = transducer
  this.mapper = mapper
}

Map.prototype['@@transducer/init'] = init
Map.prototype['@@transducer/result'] = result
Map.prototype['@@transducer/step'] = function step (accumulator, input) {
  return this.transducer['@@transducer/step'](accumulator, this.mapper(input))
}

export default (mapper) => (transducer) => new Map(mapper, transducer)

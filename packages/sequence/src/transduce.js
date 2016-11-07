import reduce from './reduce/reduce'

export default function transduce (transformer, reducer, accumulator, collection) {
  transformer = transformer(reducer) // transformer is reused to store transducer
  return reduce(transformer, accumulator == null ? transformer['@@transducer/init']() : accumulator, collection)
}

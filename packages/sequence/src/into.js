import arrayTransducer from './transducers/arrayTransducer'
import objectTransducer from './transducers/objectTransducer'
import stringTransducer from './transducers/stringTransducer'
import transduce from './transduce'
import { isArray, isObject, isString, type } from './_types'

/* global TypeError: false */

const transducerFor = (accumulator) => {
  if (isArray(accumulator)) return arrayTransducer
  if (isObject(accumulator)) return objectTransducer
  if (isString(accumulator)) return stringTransducer
  if (accumulator && accumulator['@@transducer/step']) return accumulator
  throw new TypeError(`Don't know how to get transducer for ${type(accumulator)}`)
}

export default function into (accumulator, transformer, collection) {
  return transduce(transformer, transducerFor(accumulator), accumulator, collection)
}

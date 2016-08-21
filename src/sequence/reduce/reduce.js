import arrayReduce from './arrayReduce'
import iterableReduce from './iterableReduce'
import objectReduce from './objectReduce'
import stringReduce from './stringReduce'
import { isArray, isObject, isString, isIterable, type } from '../_types'

/* global TypeError: false */

const reduceOf = (collection) => {
	if (isArray(collection)) return arrayReduce
	if (isObject(collection)) return objectReduce
	if (isString(collection)) return stringReduce
	if (isIterable(collection)) return iterableReduce
	throw new TypeError(`Don't know how to reduce ${ type(collection) }`)
}

export default function reduce(transducer, accumulator, collection) {
	return reduceOf(collection)(transducer, accumulator, collection)
}

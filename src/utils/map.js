import hasOwnProperty from 'utils/object/has-own-property'
import {signature, targetFn} from 'symbols'

map[signature] = 'map :: (α, ?Integer, ?List L → β) → [α] L, ?Boolean = L.map !== map → [β]'

export default function map (iteratee, collection, useMethod = (collection.map[targetFn] || collection.map) !== map) {
	if (typeof collection.map === 'function' && useMethod) // objects with map method (array, functor/monad, etc.)
		return collection.map(iteratee) 

	const mapped = new (collection.constructor) // default mapping
	for (let key in collection)
		if (hasOwnProperty(collection, key))
			mapped[key] = iteratee(collection[key], key, collection)
	return mapped
}

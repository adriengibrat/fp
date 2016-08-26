import hasOwnProperty from 'utils/object/hasOwnProperty'
import { setSignature } from 'utils/doc'
import { targetFn } from 'symbols'

setSignature('map :: (α → β) → [α] → [β]', map)

export default function map (iteratee, collection, useMethod = (collection && collection.map && collection.map[targetFn] || collection.map) !== map) {
	if (typeof collection.map === 'function' && useMethod) // objects with map method (array, functor/monad, etc.)
		return collection.map(iteratee) 

	const mapped = new (collection.constructor) // default mapping
	for (let key in collection)
		if (hasOwnProperty(collection, key))
			mapped[key] = iteratee(collection[key], key, collection)
	return mapped
}

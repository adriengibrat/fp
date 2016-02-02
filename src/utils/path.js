/* global String: false */

export default function path (path, object) {
	if(!Array.isArray(path))
		path = String.prototype.split.call(path, '.')
	return path.reduce((object, key) => object != null ? object[key] : object, object)
}
/* global String: false, Array: false */

const split = String.prototype.split

export default (path, object) => {
  if (!Array.isArray(path)) {
    path = split.call(path, '.')
  }
  return path.reduce((object, key) => object != null ? object[key] : object, object)
}

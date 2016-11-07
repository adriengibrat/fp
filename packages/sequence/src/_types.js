import getPrototypeOf from 'utils/object/getPrototypeOf'
import iteratorSymbol from './_iteratorSymbol'

/* global Object: false */

const toString = Object.prototype.toString

/* global Array: false */

const isArray = Array.isArray || ((x) => toString.call(x) === '[object Array]')

/* global Object: false */

const isObject = (x) => x && x instanceof Object && getPrototypeOf(x) === Object.prototype
const isString = (x) => typeof x === 'string'
const isIterable = (x) => x && typeof (x[iteratorSymbol] || x.next) === 'function'

const type = (x) => x == null ? typeof x : x.constructor ? x.constructor.name : toString.call(x)

export { isArray, isObject, isString, isIterable, type }

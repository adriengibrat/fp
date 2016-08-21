/* global String: false */

const indexOf = String.prototype.indexOf

export default {
	contains: (b) => (a) => indexOf.call(a, b) > -1
	, in:     (b) => (a) => indexOf.call(b, a) > -1
	, eq:     (b) => (a) => a === b
	, not:    (b) => (a) => a !== b
	, gte:    (b) => (a) => a >= b
	, lte:    (b) => (a) => a <= b
	, gt:     (b) => (a) => a > b
	, lt:     (b) => (a) => a < b
	, mod:    (b) => (a) => a % b
	, odd:    (a) => a % 2
}
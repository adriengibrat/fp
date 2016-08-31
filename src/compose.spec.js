var tape = require('tape')

module.exports = function (compose, title) {

	function three () {
		return 3
	}

	function test () {
		return [1, 2, 3]
	}

	function odd (x) {
		return !! (x % 2)
	}

	function reverse (array) {
		return array.slice().reverse()
	}

	function head (array) {
		return array[0]
	}

	function map (fn) {
		return function (array) {
			return array.map(fn)
		}
	}

	function filter (fn) {
		return function (array) {
			return array.filter(fn)
		}
	}

	function id (a) {
		return a
	}

	tape(title, function (assert) {

		assert.true(typeof compose === 'function', 'compose is a function')

		const last = compose(head, reverse, test)
		assert.equal(last(), 3, 'composing multiple functions')

		const last_ = compose(head, compose(reverse, test))
		const _last = compose(compose(head, reverse), test)

		assert.true(_last() === last_() && last_() === last(), 'compose associativity')

		const id_ = compose(id, three)
		const _id = compose(three, id)
		assert.true(_id() === id_() && id_() === three(), 'compose identity')

		const _map = compose(map(id), map(three))
		const map_ = map(compose(id, three))
		assert.deepEqual(_map(test()), map_(test()), 'map composition law')

		const _head = compose(three, head)
		const head_ = compose(head, map(three))
		assert.equal(_head(test()), head_(test()), 'map with head')

		const _filter = compose(map(three), filter(compose(odd, three)))
		const filter_ = compose(filter(odd), map(three))
		assert.deepEqual(_filter(test()), filter_(test()), 'map with filter')

		assert.end()
	})
}
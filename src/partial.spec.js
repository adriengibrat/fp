var tape = require('tape')

module.exports = function (partial, title) {

	function fn (a, b, c) {
		return (a || 0) + (b || 0) + (c || 0) + (arguments[3] || 0) + (this && this.x || 0)
	}

	var context = {x: 10, partial: partial(fn, [2])}

	tape(title, function (assert) {

		assert.true(typeof partial === 'function', 'partial is a function')

		assert.equal(partial(fn, [1, 2])(3), 6, 'guess function arity')
		assert.equal(partial(fn).length + partial(fn, [1]).length, 5, 'set partial arity')

		assert.equal(partial(fn)(1, 2, 3), 6, 'allow no partial arguments')
		assert.equal(partial(fn, [1])(2, 3), 6, 'allow single partial argument')
		assert.equal(partial(fn, [1, 2, 3])(), 6, 'allow full partial arguments')
		assert.equal(partial(fn, [1, 2, 3, 4])(), 10, 'forward extra arguments')

		assert.equal(partial(fn, [partial.placeholder, partial.placeholder, 3])(1, 2, 4), 10, 'allow placeholders use')

		assert.equal(partial(fn).call(context, 2, 15, 15), 42, 'bound on full application')
		assert.equal(partial(fn, [2]).bind(context)(15, 15), 42, 'bound on partial application')
		assert.equal(context.partial(15, 15), 42, 'bound to attached object')

		assert.end()
	})
}
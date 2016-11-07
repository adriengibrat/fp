export default (test, curry, placeholder, title) => {
  function fn (a, b, c) {
    return (a || 0) + (b || 0) + (c || 0) + (arguments[3] || 0) + (this && this.x || 0)
  }

  var context = { x: 10, curried: curry(fn) }

  test(title, assert => {
    assert.true(typeof curry === 'function', 'curry is a function')

    assert.true(curry(fn)(1, 2, 3) === 6, 'guess function arity')
    assert.true(curry(fn).length + curry(fn)(1).length === 5, 'set curried arity')

    assert.true(curry(fn)(1)(2)(3) === 6, 'allow unary applications')
    assert.true(curry(fn)(1)(2, 3) === 6, 'allow multiple arguments')
    assert.true(curry(fn)(1, 2, 3, 4) === 10, 'forward extra arguments')

    assert.true(curry(fn)(placeholder, placeholder, 3)(1, placeholder, 4)(2) === 10, 'allow placeholders use')

    assert.true(curry(fn).call(context, 2, 15, 15) === 42, 'bound on full application')
    assert.true(curry(fn).bind(context)(2, 15, 15) === 42, 'bound on last partial application')
    assert.true(curry(fn).bind(context)(2)(15, 15) === 32, 'not bound after partial application')
    assert.true(context.curried(2, 15, 15) === 42, 'bound to attached object')

  })
}

// assert.true(curry(fn, 2)(1, 2) === 3, 'allow to specify arity')
// assert.true(curry(fn, 'x')() === 0, 'coerce arity to integer')

// var curry = require('ramda').curry
// var curry = require('auto-curry') // fail: properly reports the length of the curried function
// var curry = require('curry') // fail : preserves context & forwards extra arguments
// var curry = function(fn) {return require('curry-d/dist/curry-d').curry(fn, null, false, false)} // fail: properly reports the length of the curried function
// var curry = require('curry-es6/src')
// var curry = require('fn-curry').curry // fail: properly reports the length of the curried function
// var curry = require('lodash.curry').curry // fail: properly reports the length of the curried function
var curry = require('./fp').curry
//curry = require('./fp').curry.debug
var eq = require('assert').deepEqual

describe('curry', function() {
  it('curries a single value', function() {
    var f = curry(function(a, b, c, d) { return (a + b * c) / d }) // f(12, 3, 6, 2) == 15
    var g = f(12)
    eq(g(3, 6, 2), 15)
  })

  it('curries multiple values', function() {
    var f = curry(function(a, b, c, d) { return (a + b * c) / d }) // f(12, 3, 6, 2) == 15
    var g = f(12, 3)
    eq(g(6, 2), 15)
    var h = f(12, 3, 6)
    eq(h(2), 15)

    var curried = curry(function(a, b, c, d) { return [].slice.call(arguments) })
    var expected = [1, 2, 3, 4]
    eq(curried(1)(2)(3)(4), expected)
    eq(curried(1, 2)(3, 4), expected)
    eq(curried(1, 2, 3, 4), expected)
  })

  it('allows further currying of a curried function', function() {
    var f = curry(function(a, b, c, d) { return (a + b * c) / d }) // f(12, 3, 6, 2) == 15
    var g = f(12)
    eq(g(3, 6, 2), 15)
    var h = g(3)
    eq(h(6, 2), 15)
    eq(g(3, 6)(2), 15)
  })

  it('reports the length of the curried function', function() {
    var f = curry(function(a, b, c, d) { return (a + b * c) / d })
    eq(f.length, 4)
    var g = f(12)
    eq(g.length, 3)
    var h = g(3)
    eq(h.length, 2)
    eq(g(3, 6).length, 1)
  })

  it('allows specifying `arity`', function() {
    var curried = curry(function(a, b, c, d) { return [].slice.call(arguments) }, 3),
        expected = [1, 2, 3]

    eq(curried(1)(2, 3), expected)
    eq(curried(1, 2)(3), expected)
    eq(curried(1, 2, 3), expected)
  })

  it('coerces `arity` to an integer', function() {
    function fn(a, b, c, d) { return [].slice.call(arguments) }
    eq(curry(fn, '0')(), [])
    eq(curry(fn, 0.6)(), [])
    eq(curry(fn, 'xyz')(), [])
    eq(curry(fn, '2')(1)(2), [1, 2])
  })

  it('allows binding', function() {
    var ctx = {x: 10}
    function fn (a, b) { return a + b * this.x }
    var g = curry(fn)

    eq(g.call(ctx, 2, 4), 42)
    eq(g.call(ctx, 2).call(ctx, 4), 42)
  })

  it('does not set binding', function() {
    function fn(a, b, c) {
      var value = this || {}
      return [value[a], value[b], value[c]]
    }

    var object = { 'a': 1, 'b': 2, 'c': 3 }
    var expected = [1, 2, 3]
    var notbound = [undefined, undefined, undefined]

    eq(curry(fn.bind(object))('a')('b')('c'), expected)
    eq(curry(fn.bind(object))('a', 'b')('c'), expected)
    eq(curry(fn.bind(object))('a', 'b', 'c'), expected)

    eq(curry(fn).bind(object)('a')('b')('c'), notbound)
    eq(curry(fn).bind(object)('a', 'b')('c'), notbound)
    eq(curry(fn).bind(object)('a', 'b', 'c'), expected)

    object.curried = curry(fn)
    eq(object.curried('a')('b')('c'), notbound)
    eq(object.curried('a', 'b')('c'), notbound)
    eq(object.curried('a', 'b', 'c'), expected)
  })

  it('ensures `new curried` is an instance of `func`', function() {
    function Foo (value) { return value && object }

    var curried = curry(Foo)
    var object = {}

    eq(new curried(false) instanceof Foo, true)
    eq(new curried(true), object)
  })

  it('does not affect original curried function', function () {
      var sum5 = curry(function (a,b,c,d,e) { return a+b+c+d+e })
      var sum4 = sum5(10)

      eq(sum5(1,1,1,1,1), 5)
      eq(sum4(1,1,1,1), 14)
  })

  it('forwards extra arguments', function() {
    function fn (a, b, c) {
      void c
      return Array.prototype.slice.call(arguments)
    }
    var g = curry(fn)

    eq(g(1, 2, 3), [1, 2, 3])
    eq(g(1, 2, 3, 4), [1, 2, 3, 4])
    eq(g(1, 2)(3, 4), [1, 2, 3, 4])
    eq(g(1)(2, 3, 4), [1, 2, 3, 4])
    eq(g(1)(2)(3, 4), [1, 2, 3, 4])
  })

/*
  it('supports R.__ placeholder', function() {
    var f = function(a, b, c) { return [a, b, c] }
    var g = curry(f)
    var _ = R.__

    eq(g(1)(2)(3), [1, 2, 3])
    eq(g(1)(2, 3), [1, 2, 3])
    eq(g(1, 2)(3), [1, 2, 3])
    eq(g(1, 2, 3), [1, 2, 3])

    eq(g(_, 2, 3)(1), [1, 2, 3])
    eq(g(1, _, 3)(2), [1, 2, 3])
    eq(g(1, 2, _)(3), [1, 2, 3])

    eq(g(1, _, _)(2)(3), [1, 2, 3])
    eq(g(_, 2, _)(1)(3), [1, 2, 3])
    eq(g(_, _, 3)(1)(2), [1, 2, 3])

    eq(g(1, _, _)(2, 3), [1, 2, 3])
    eq(g(_, 2, _)(1, 3), [1, 2, 3])
    eq(g(_, _, 3)(1, 2), [1, 2, 3])

    eq(g(1, _, _)(_, 3)(2), [1, 2, 3])
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3])
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3])

    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3])
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3])
  })

  it('supports @@functional/placeholder', function() {
    var f = function(a, b, c) { return [a, b, c] }
    var g = curry(f)
    var _ = {'@@functional/placeholder': true, x: Math.random()}

    eq(g(1)(2)(3), [1, 2, 3])
    eq(g(1)(2, 3), [1, 2, 3])
    eq(g(1, 2)(3), [1, 2, 3])
    eq(g(1, 2, 3), [1, 2, 3])

    eq(g(_, 2, 3)(1), [1, 2, 3])
    eq(g(1, _, 3)(2), [1, 2, 3])
    eq(g(1, 2, _)(3), [1, 2, 3])

    eq(g(1, _, _)(2)(3), [1, 2, 3])
    eq(g(_, 2, _)(1)(3), [1, 2, 3])
    eq(g(_, _, 3)(1)(2), [1, 2, 3])

    eq(g(1, _, _)(2, 3), [1, 2, 3])
    eq(g(_, 2, _)(1, 3), [1, 2, 3])
    eq(g(_, _, 3)(1, 2), [1, 2, 3])

    eq(g(1, _, _)(_, 3)(2), [1, 2, 3])
    eq(g(_, 2, _)(_, 3)(1), [1, 2, 3])
    eq(g(_, _, 3)(_, 2)(1), [1, 2, 3])

    eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3])
    eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3])
  })
*/
})

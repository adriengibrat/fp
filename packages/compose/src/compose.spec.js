import test from 'tape'

export default (compose, title) => {
  const three = () => 3
  const list = () => [1, 2, 3]
  const odd = x => !!(x % 2)
  const reverse = array => array.slice().reverse()
  const head = array => array[0]
  const map = fn => array => array.map(fn)
  const filter = fn => array => array.filter(fn)
  const id = a => a

  test(title, assert => {
    assert.true(typeof compose === 'function', 'compose is a function')

    const last = compose(head, reverse, list)
    assert.equal(last(), 3, 'composing multiple functions')

    const last_ = compose(head, compose(reverse, list))
    const _last = compose(compose(head, reverse), list)

    assert.true(_last() === last_() && last_() === last(), 'compose associativity')

    const id_ = compose(id, three)
    const _id = compose(three, id)
    assert.true(_id() === id_() && id_() === three(), 'compose identity')

    const _map = compose(map(id), map(three))
    const map_ = map(compose(id, three))
    assert.deepEqual(_map(list()), map_(list()), 'map composition law')

    const _head = compose(three, head)
    const head_ = compose(head, map(three))
    assert.equal(_head(list()), head_(list()), 'map with head')

    const _filter = compose(map(three), filter(compose(odd, three)))
    const filter_ = compose(filter(odd), map(three))
    assert.deepEqual(_filter(list()), filter_(list()), 'map with filter')

    assert.end()
  })
}

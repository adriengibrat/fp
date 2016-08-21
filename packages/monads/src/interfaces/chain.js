import Apply from 'interfaces/apply'
import container, { canning } from 'container'

export default container({
	constructor: function Chain (value) { return canning(Chain, value) }
	, methods: function chain (fn) { return this.map(fn).valueOf() }
	, parent: Apply
})

// Chain.prototype.chain = function chain (fn) { return this.map(fn).valueOf() }

// Chain.prototype.chain = function chain (fn) { return fn(this.valueOf()) }

// Chain.prototype.ap = function ap (functor) { return this.chain(fn => functor.map(fn)) }

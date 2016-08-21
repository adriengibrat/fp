import container, { canning } from 'container'

export default container({
	constructor: function Functor (value) { return canning(Functor, value) }
	, methods: function map (fn) { return this.constructor(fn(this.valueOf())) }
})

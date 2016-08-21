import Apply from 'interfaces/apply'
import container, { canning } from 'container'

export default container({
	constructor: function Applicative (value) { return canning(Applicative, value) }
	, methods: function of (value) { return this.constructor(value) }
	, parent: Apply
})

import Functor from 'interfaces/functor'
import container, { canning } from 'container'

export default container({
	constructor: function Apply (value) { return canning(Apply, value) }
	, methods: function ap (functor) { return functor.map(this.valueOf()) }
	, parent: Functor
})

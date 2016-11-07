import container, { canning } from 'container'
import { signature } from 'symbols'
import Monad from 'interfaces/monad'

const Noop = container({
  constructor: function Noop (value) { return canning(Noop, value) },
	 methods: [
   function map () { return this },
		 function chain () { return this },
		 function ap () { return this }
 ],
	 parent: Monad
})

Noop.of = Noop

Noop[signature] = 'Noop :: α → Noop α'

export default Noop

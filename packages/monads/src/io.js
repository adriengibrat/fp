import container, { canning } from 'container'
import { signature } from 'utils/symbols'
import Monad from 'interfaces/monad'
import compose from 'compose'

const IO = container({
  constructor: function IO (value) { return canning(IO, value) },
	 methods: [
   function map (fn) { return IO(compose(fn, this.valueOf())) },
		 function of (value) { return IO(() => value) }
 ],
	 parent: Monad
})

IO.of = IO.prototype.of

IO[signature] = 'IO :: (* → α) → IO (* → α)'

export default IO

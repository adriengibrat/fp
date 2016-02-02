import container, {canning} from 'container'
import {signature} from 'symbols'
import Monad from 'interfaces/monad'

const Right = container({
	constructor: function Right (value) { return canning(Right, value) },
	parent: Monad
})

Right.of = Right

Right[signature] = 'Right :: α → Right α'

export default Right

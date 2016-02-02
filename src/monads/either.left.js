import container, {canning} from 'container'
import {signature} from 'symbols'
import Noop from 'monads/noop'

const Left = container({
	constructor: function Left (value) { return canning(Left, value) },
	parent: Noop
})

Left.of = Left

Left[signature] = 'Left :: α → Left α'

export default Left

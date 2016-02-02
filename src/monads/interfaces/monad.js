import Chain from 'interfaces/chain'
import Applicative from 'interfaces/applicative'
import container, {canning} from 'container'
import setPrototype from 'utils/object/set-prototype'
import getPrototype from 'utils/object/get-prototype'

const Monad = container({
	constructor: function Monad (value) { return canning(Monad, value) },
	parent: Chain
})

Monad.prototype = setPrototype(getPrototype(Monad.prototype), Applicative.prototype)

export default Monad

// extract aka join ?
// Comonad.prototype.extract = function extract (fn) { return this.valueOf() }

// import identity from 'functions/identity'
// Comonad.prototype.extract = function extract (fn) { return this.chain(identity) }

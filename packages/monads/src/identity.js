import container, { canning } from 'container'
import { signature } from 'symbols'
import Monad from 'interfaces/monad'

const Identity = container({
  constructor: function Identity (value) { return canning(Identity, value) },
  parent: Monad
})

Identity.of = Identity

Identity[signature] = 'Identity :: α → Identity α'

export default Identity

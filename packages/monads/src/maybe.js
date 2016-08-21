import container, { canning } from 'container'
import { signature } from 'symbols'
import values from 'utils/object/values'
import Monad from 'interfaces/monad'
import Noop from 'noop'

const Maybe = container({
	constructor: function Maybe (value) { return value == null ? nothing : Just(value) }
	, parent: Monad
})

Maybe.of = function of (value) { return Maybe(value) }

Maybe[signature] = 'Maybe :: α|null → Maybe α null'

const Just = container({
	constructor: function Just (value) { return canning(Just, value) }
	, methods: Maybe.of
	, parent: Maybe
})

const Nothing = container({
	constructor: function Nothing () { return canning(Nothing, null) }
	, methods: values(Noop.prototype).concat(Maybe.of)
	, parent: Maybe
})

const nothing = Nothing(null)

export default Maybe

export { Just, Nothing }

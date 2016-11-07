import spec from './src/compose.spec'
import { compose } from './src/index'

spec(compose, 'compose')
spec(compose.debug, 'compose.debug')
//spec(compose.trace, 'compose.trace')

import spec from './src/partial.spec'
import { partial } from './src/index'

spec(partial, partial.placeholder, 'partial')
spec(partial.debug, partial.placeholder, 'partial.debug')

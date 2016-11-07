import test from 'ava'
import spec from './src/curry.spec'
import { curry } from './src/index'

spec(test, curry, curry.placeholder, 'curry')
    spec(test, curry.debug, curry.placeholder, 'curry.debug')

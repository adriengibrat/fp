var fp = require('../dist/fp')
var test = require('../src/curry.spec')

test(fp.curry, 'curry')
test(fp.curry.debug, 'curry.debug')

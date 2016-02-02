var compose = require('../dist/fp').compose
var test = require('../src/compose.spec')

test(compose, 'compose')
//test(compose.trace, 'compose.trace')
fp λ
====
> Readable, debbuggable & fast ES6 Functional Programming

`fp` offers a collection of usefull functions :
* `compose`, `curry`, `partial` higher-order functions
* `map` function to iterate over any object
* `not`, `arity` & `path` helper functions to use with `compose` & `map`
* `identity`, `constant`, `noop` & other utilities functions

## Usage

Source are written as ES6 modules, just include the sources
* import `fp` library
```js
import fp from 'fp/src'
```
* import `fp.compose` function
```js
import compose from 'fp/src/compose'
```
! source functions are not auto curried

`fp.js` file is an ES5 umd bundle (including amd, commonjs & global definitions)

#### amd

```js
define(['fp'], function (fp) { ... })
```

#### commonjs

```js
var fp = require('fp')
```

#### global

```js
global.fp // just `fp` or `window.fp`
```

## Tests

`partial`, `curry` & `compose` functions are unit-tested, to run all tests :

```sh
npm test
```
or run tests for a specific function :
```sh
npm run test:partial
npm run test:curry
npm run test:compose
```

## Benchmarks

`curry` function is benchmarked against [Ramda][ramda] and [Lodash][lodash] implementations, to run benchmarks :

```sh
npm run bench
```
~curried functions are 1.7× faster than [Lodash][lodash] and 7× faster than [Ramda][ramda] ;)~ not true anymore

## Documentation

`doc` function allow to get Hindley-Milner signature of every `fp` function

```js
console.log(fp.doc(fp.compose))
```

## Contribute

Clone & [rollup][]

```sh
git clone git@github.com:adriengibrat/fp.git
cd fp
npm install --no-optional # optional dependencies are only used for benchmarks
npm start # watch `src` directory and bundle `fp.js` on change
```

## Platform support

This library assumes an ES5 environment, it may be supported in older browsers :
add [ES5 shims][es5-shim] in your js dependencies or include [Polyfills script][polyfills] in your html `<script src="https://cdn.jsdelivr.net/polyfills/polyfill.js+es5"></script>`.

## Credits & inspirations

In no particular order :

* [mostly-adequate-guide][]
* [ramda][] 
* [lodash][] the Swiss army knife
* [fantasyland][] just love the logo ;)
* [folktalejs][] modular & smart
* [functionaljs][] K.I.S.S. `fp` grandpa

## Licence

Copyright © 2016 Adrien Gibrat.

Released under the [MIT licence][legal].

[ramda]: http://ramdajs.com
[lodash]: https://lodash.com
[rollup]: http://rollupjs.org
[es5-shim]: https://github.com/es-shims/es5-shim
[polyfills]: http://polyfills.io
[mostly-adequate-guide]: https://drboolean.gitbooks.io/mostly-adequate-guide
[fantasyland]: https://github.com/fantasyland/fantasy-land
[folktalejs]: http://folktalejs.org
[functionaljs]: https://github.com/osteele/functional-javascript
[legal]: https://www.tldrlegal.com/l/mit

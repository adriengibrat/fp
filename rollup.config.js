import resolve from 'rollup-plugin-includepaths'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import eslint from 'rollup-plugin-eslint'
import uglify from 'rollup-plugin-uglify'

const settings = {
	plugins: [
		resolve({
			include: {
				fp:  'src/index.js'
				, functions: 'src/functions/index.js'
				, monads: 'src/monads/index.js'
				, container: 'src/monads/interfaces/_container.js'
				, optims: 'src/utils/_optims.js'
				, symbols: 'src/utils/_symbols.js'
			}
			, paths: ['src', 'src/monads']
			, external: []
		})
		, json()
		, buble()
	]
	, format: 'umd'
	, noConflict: true
	, moduleName: 'fp'
	, sourceMap: true
}

if (process.env.BUILD === 'min') {
	const transpiler = settings.plugins.pop()
	settings.plugins.push(eslint(), transpiler, uglify())
}

export default settings

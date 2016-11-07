import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

const plugins = [
	nodeResolve({
		jsnext: true,
		main: true,
	}),
	commonjs({
		include: 'node_modules/**'
	}),
	buble(),
]

if (process.env.build === 'min')
	plugins.push(uglify())

export default {
	format: 'umd',
	entry: process.env.npm_package_module,
	dest: process.env.npm_package_main,
	moduleName: 'fp',
	moduleId: process.env.npm_package_name,
	banner: `/**
 * ${process.env.npm_package_name} ${process.env.npm_package_version} – ${process.env.npm_package_description}
 * Made with ♫·♪ & -♥- by ${process.env.npm_package_author_name} <${process.env.npm_package_author_email}>
 * Published under ${process.env.npm_package_license} License
 */`,
	sourceMap: true,
	noConflict: true,
	plugins,
}

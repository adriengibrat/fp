import buble from 'rollup-plugin-buble'
import eslint from 'rollup-plugin-eslint'
import uglify from 'rollup-plugin-uglify'
import nodeResolve from 'rollup-plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'

const resolveId = nodeResolve().resolveId
const plugins = [
	{
		resolveId(importee, importer) {
			if (importee.startsWith('@fp/'))
				return new Promise(resolve => resolve(resolveId(importee, `${__dirname}/foo`)))
			return resolveId(importee, importer)
		}
	},
	eslint(),
	buble(),
]

if (process.env.build === 'min')
	plugins.push(uglify())

plugins.push(filesize())

export default {
	format: 'umd',
	moduleName: process.env.npm_package_name,
	moduleId: process.env.npm_package_name,
	banner: `/**
 * ${process.env.npm_package_name} ${process.env.npm_package_version} – ${process.env.npm_package_description}
 * Made with ♫·♪ & -♥- by ${process.env.npm_package_author_name} <${process.env.npm_package_author_email}>
 * Published under ${process.env.npm_package_license} License
 */`,
	sourceMap: true,
	noConflict: true,
	plugins: plugins,
}

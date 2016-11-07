import buble from 'rollup-plugin-buble'
import eslint from 'rollup-plugin-eslint'

export default {
	format: 'umd',
	entry: process.env.npm_package_module,
	dest: process.env.npm_package_main,
	moduleName: process.env.npm_package_name,
	moduleId: process.env.npm_package_name,
	banner: `/**
 * ${process.env.npm_package_name} ${process.env.npm_package_version} – ${process.env.npm_package_description}
 * Made with ♫·♪ & -♥- by ${process.env.npm_package_author_name} <${process.env.npm_package_author_email}>
 * Published under ${process.env.npm_package_license} License
 */`,
	sourceMap: true,
	noConflict: true,
	plugins: [
		eslint(),
		buble(),
	],
}

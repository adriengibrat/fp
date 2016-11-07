import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  moduleName: 'fp',
  moduleId: process.env.npm_package_name,
  banner: `/**
 * ${process.env.npm_package_name} ${process.env.npm_package_version} – ${process.env.npm_package_description}
 * Made with ♫·♪ & -♥- by ${process.env.npm_package_author_name} <${process.env.npm_package_author_email}>
 * Published under ${process.env.npm_package_license} License
 */`,
  sourceMap: true,
  noConflict: true,
  plugins: [
    nodeResolve(),
    buble(),
  ],
}

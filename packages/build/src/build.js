const rollup = require('rollup')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const filesize = require('rollup-plugin-filesize')

const currentPkg = `${process.cwd()}/package.json`

const resolveId = nodeResolve().resolveId
const plugins = [
  {
    resolveId(importee, importer) {
      if (importee.startsWith('@fp/'))
        return new Promise(resolve => resolve(resolveId(importee, currentPkg)))
      return resolveId(importee, importer)
    }
  },
  buble(),
]

const pkg = require(currentPkg)
const args = process.argv.slice(2)

let dest = pkg.main
let external
let globals
if (args.indexOf('full') !== -1) {
  dest = dest.replace('.js', '.full.js')
} else if (pkg.dependencies) {
  const dependencies = Object.keys(pkg.dependencies)
  globals = dependencies.reduce((globals, dependency) => 
    Object.assign(globals, {
      [dependency]: dependency.replace('@', '').replace('/', '.')
    }),
    {}
  )
  external = dependencies
  const bundled = pkg.bundledDependencies
  if (bundled) {
    external = external.filter(dependency => bundled.includes(dependency))
  }
}

if (args.indexOf('min') !== -1) {
  plugins.push(uglify())
  dest = dest.replace('.js', '.min.js')
}

plugins.push(filesize())

rollup.rollup({
  entry: pkg.module,
  plugins,
  external,
})
.then(bundle => bundle
  .write({
    format: 'umd',
    indent: '  ',
    sourceMap: true,
    noConflict: true,
    moduleName: pkg.name.replace('@', '').split('/').shift(),
    moduleId: pkg.name,
    banner: `/**
 * ${pkg.name} ${pkg.version} – ${pkg.description}
 * Made with ♫·♪ & -♥- by ${pkg.author}
 * Published under ${pkg.license} License
 */`,
    globals,
    dest,
  })
  .then(() => console.log(` ${pkg.name} ${args}`))
)
.catch(console.error)

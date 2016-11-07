#!/usr/bin/env node
'use strict';

var rollup = require('rollup');
var buble = require('rollup-plugin-buble');
var uglify = require('rollup-plugin-uglify');
var nodeResolve = require('rollup-plugin-node-resolve');
var filesize = require('rollup-plugin-filesize');

var currentPkg = (process.cwd()) + "/package.json";

var resolveId = nodeResolve().resolveId;
var plugins = [
  {
    resolveId: function resolveId$1(importee, importer) {
      if (importee.startsWith('@fp/'))
        { return new Promise(function (resolve) { return resolve(resolveId(importee, currentPkg)); }) }
      return resolveId(importee, importer)
    }
  },
  buble() ];

var pkg = require(currentPkg);
var args = process.argv.slice(2);

var dest = pkg.main;
var external;
var globals;
if (args.indexOf('full') !== -1) {
  dest = dest.replace('.js', '.full.js');
} else if (pkg.dependencies) {
  var dependencies = Object.keys(pkg.dependencies);
  globals = dependencies.reduce(function (globals, dependency) { return Object.assign(globals, ( obj = {}, obj[dependency] = dependency.replace('@', '').replace('/', '.'), obj ))
      var obj; },
    {}
  );
  external = dependencies;
  var bundled = pkg.bundledDependencies;
  if (bundled) {
    external = external.filter(function (dependency) { return bundled.includes(dependency); });
  }
}

if (args.indexOf('min') !== -1) {
  plugins.push(uglify());
  dest = dest.replace('.js', '.min.js');
}

plugins.push(filesize());

rollup.rollup({
  entry: pkg.module,
  plugins: plugins,
  external: external,
})
.then(function (bundle) { return bundle
  .write({
    format: 'umd',
    indent: '  ',
    sourceMap: true,
    noConflict: true,
    moduleName: pkg.name.replace('@', '').split('/').shift(),
    moduleId: pkg.name,
    banner: ("/**\n * " + (pkg.name) + " " + (pkg.version) + " – " + (pkg.description) + "\n * Made with ♫·♪ & -♥- by " + (pkg.author) + "\n * Published under " + (pkg.license) + " License\n */"),
    globals: globals,
    dest: dest,
  })
  .then(function () { return console.log((" " + (pkg.name) + " " + args)); }); }
)
.catch(console.error);

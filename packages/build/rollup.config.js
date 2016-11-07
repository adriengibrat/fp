import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  format: 'cjs',
  banner: '#!/usr/bin/env node',
  plugins: [
    nodeResolve(),
    buble()
  ]
}

import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import { version } from '../package.json'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import testEnv from '../config/test'

export default {
    input: 'src/index.js',
    output: {
        file: `release/index@${ version }.js`,
        name: 'index',
        format: 'es'
    },
    plugins: [
        resolve(),
        json(),
        replace({
          'process.env': JSON.stringify(testEnv)
        }),
        babel({
            exclude: 'node_modules/**'
        }),
    ]
}
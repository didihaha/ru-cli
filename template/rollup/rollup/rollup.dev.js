import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import devEnv from '../config/dev'

export default {
    input: 'src/index.js',
    output: {
        file: 'release/index.js',
        name: 'index.js',
        format: 'iife'
    },
    watch: {
        include: 'src/**'
    },
    plugins: [
        resolve(),
        json(),
        babel({
            exclude: 'node_modules/**', // 排除引入的库
            runtimeHelpers: true // 配置runtime，不设置会报错
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        replace({
          'process.env': JSON.stringify(devEnv)
        }),
        serve({
            open: true,
        
            // Folder to serve files from
            contentBase: './release',
            historyApiFallback: false,
            // Options used in setting up server
            host: '0.0.0.0',
            port: 9300,
            
            //set headers
            headers: {
                'Access-Control-Allow-Origin': '*',
                foo: 'bar'
            }
        })
    ]
}
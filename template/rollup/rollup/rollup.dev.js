import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import rollupTypescript from 'rollup-plugin-typescript2'
import devEnv from '../config/dev'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import addCssImport from '../plugins/addCssImport'
import createPackage from '../plugins/createPackage'

export default {
    input: 'src/index.tsx',
    external: ['react'],
    output: {
        file: 'release/es/index.js',
        format: 'esm'
    },
    watch: {
        include: 'src/**'
    },
    plugins: [
        addCssImport(),
        del({ targets: 'release/*' }),
        createPackage(),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false,  // Default: true
        }),
        rollupTypescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                "compilerOptions": {
                    "declarationDir": `./release/es`,
                }
            }
        }),
        resolve(),
        babel({
            exclude: 'node_modules/**', // 排除引入的库
            runtimeHelpers: true // 配置runtime，不设置会报错
        }),
        replace({
            'process.env': JSON.stringify(devEnv),
            preventAssignment: true
        }),
        postcss({
            // modules: true, // 增加 css-module 功能
            extensions: ['.less', '.css'],
            use: [
                ['less', {
                    javascriptEnabled: true
                }]
            ],
            plugins: [
                cssnext({ warnForDuplicates: false, }),
                cssnano()
            ],
            extract: `style/index.css`
        }),
        json()
    ]
}
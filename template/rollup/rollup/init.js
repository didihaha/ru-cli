import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import rollupTypescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import addCssImport from '../plugins/addCssImport'
import createPackage from '../plugins/createPackage'
import replaceEntryTsxToJs from '../plugins/replaceEntryTsxToJs'
const fs = require('fs')

/**
 * 
 * @param {* 输出模块规范} type  
 * @param {* 环境变量配置} envConfig
 */
function getBaseConfig(type, envConfig) {
    return {
        external: ['react'],
        plugins: [
            addCssImport(),
            commonjs({
                include: 'node_modules/**',  // Default: undefined
                sourceMap: false,  // Default: true
            }),
            rollupTypescript({
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    "compilerOptions": {
                        "declarationDir": `./release/${type}`,
                    }
                }
            }),
            postcss({
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
            resolve(),
            json(),
            replace({
                'process.env': envConfig,
                preventAssignment: true
            }),
            babel({
                exclude: 'node_modules/**', // 排除引入的库
                babelHelpers: 'runtime' // 配置runtime，不设置会报错
            }),
        ]
    }
}

/**
 * 
 * @param {* 模块名称} name 
 * @param {* 环境变量配置} envConfig
 */
const createBuildEntry = (config) => {
    const esConfig = getBaseConfig('es', config.envConfig)
    const libConfig = getBaseConfig('lib', config.envConfig)
    return [
        Object.assign({}, esConfig, {
            input: `src/${config.formatName}/index.tsx`,
            output: {
                file: `release/es/${config.formatName}/index.js`,
                name: 'index',
                format: 'esm',
                sourcemap: false
            },
        }),
        Object.assign({}, libConfig, {
            input: `src/${config.formatName}/index.tsx`,
            output: {
                file: `release/lib/${config.formatName}/index.js`,
                name: 'index',
                format: 'cjs',
                sourcemap: false,
                exports: 'named'
            },
        })
    ]
}

const dir = fs.readdirSync('./src')
const buildEntryArr = dir.filter(item => {
    const stat = fs.statSync(`./src/${item}`)
    return stat.isDirectory()
})

/**
 * 
 * @param {* 环境变量配置} envConfig 
 */
function init(envConfig) {
    const res = []
    buildEntryArr.forEach(item => {
        const config = createBuildEntry({
            formatName: item,
            envConfig: JSON.stringify(envConfig),
            plugins: []
        })
        res.push(...config)
    })

    // 第一个配置添加删除文件夹插件
    res[0].plugins.unshift(del({ targets: 'release/*' }))
    // 最后一个配置添加同步package.json文件的插件
    res[res.length - 1].plugins.push(createPackage())
    // 再添加移动入口文件插件
    res[res.length - 2].plugins.push(replaceEntryTsxToJs())
    res[res.length - 1].plugins.push(replaceEntryTsxToJs())

    return res
}

export default init
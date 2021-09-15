const path = require('path')
const ncp = require('ncp')

export default function replaceEntryTsxToJs() {
    return {
        name: '@rollup/plugin-replace-entry-tsx-to-js',
        writeBundle(outputOptions) {
            const paths = outputOptions.file.split(/\//)
            const targetFileUrl = path.resolve(__dirname, '..', paths[0], paths[1], 'index.js')
            const sourceFileUrl = path.resolve(__dirname, '../src/index.tsx')
            ncp(sourceFileUrl, targetFileUrl, function (err) {
                if (err) {
                    throw new Error('拷贝入口文件失败, 请重新编译')
                }
            })
        }
    }
}
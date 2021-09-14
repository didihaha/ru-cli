const path = require('path')
const fs = require('fs')


export default function createPkg() {
    return {
        name: 'rollup-plugin-create-package',
        outputOptions(outputOptions) {
            const paths = outputOptions.file.split(/\//)
            const outputDir = path.resolve(__dirname, '..', paths[0])
            let templateStr = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
            
            fs.writeFileSync(path.join(outputDir, 'package.json'), templateStr, 'utf8')
        }
    }
}
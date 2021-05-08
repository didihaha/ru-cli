const path = require('path')
const ejs = require('ejs')
const fs = require('fs')


export default function createPkg() {
    return {
        name: 'rollup-plugin-create-package',
        outputOptions(outputOptions) {
            const paths = outputOptions.file.split(/\//)
            const outputDir = path.resolve(__dirname, '..', paths[0])
            let templateStr = fs.readFileSync(path.resolve(__dirname, '../scripts/pkgTemplate.json'), 'utf8')
            
            const requirer = require('inquirer')
            requirer.prompt([
                {
                    type: 'input',
                    name: 'version',
                    message: 'please input next version',
                }
            ]).then(locals => {
                templateStr = ejs.render(templateStr, {
                    version: locals.version
                })
    
                fs.writeFileSync(path.join(outputDir, 'package.json'), templateStr, 'utf8')
            })
        }
    }
}
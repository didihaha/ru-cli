const fs = require('fs')
const path = require('path')

const copyTemplate = function (oldUrl, newUrl) {
    const files = fs.readdirSync(oldUrl)
    files.forEach((file, index) => {
        const fileUrl = path.resolve(oldUrl, '.', file),                        //读取模板文件的路径
            newFileUrl = path.resolve(newUrl, '.', file),                       //生成项目文件的路径
            isFile = fs.statSync(fileUrl).isFile()
        let str = ''
        if (isFile) {
            str = fs.readFileSync(fileUrl)
            fs.writeFileSync(newFileUrl, str, 'utf8')
            console.log('生成文件:    ' + file)
        } else {
            fs.mkdirSync(newFileUrl)
            copyTemplate(fileUrl, newFileUrl)
        }
    })
}

module.exports = copyTemplate
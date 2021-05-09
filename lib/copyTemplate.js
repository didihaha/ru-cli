const fs = require('fs'),
    path = require('path'),
    ejs = require('ejs')

/**
 *
 * @param {* 脚手架目录路径} oldUrl
 * @param {* 执行命令路径} newUrl
 * @param {* 包含用户交互获取的数据对象} locals
 */
const copyTemplate = (oldUrl, newUrl, locals) => {
    const files = fs.readdirSync(oldUrl)
    files.forEach((file, index) => {
        const fileUrl = path.resolve(oldUrl, '.', file),  //读取模板文件的路径
            newFileUrl = path.resolve(newUrl, '.', file), //生成项目文件的路径
            isFile = fs.statSync(fileUrl).isFile()
        let str = ''
        if (isFile) {
            if (/\.DS_Store$/.test(fileUrl)) {
                return null
            }
            str = fs.readFileSync(fileUrl, 'utf8')
            // ejs文件不可用ejs模块写入交互数据
            if (!/\.ejs$/.test(fileUrl)) {
                str = ejs.render(str, locals)
            }
            fs.writeFileSync(newFileUrl, str, 'utf8')
            console.log('生成文件:  ' + file)
        } else {
            fs.mkdirSync(newFileUrl)
            copyTemplate(fileUrl, newFileUrl, locals)
        }
    })
}

module.exports = copyTemplate
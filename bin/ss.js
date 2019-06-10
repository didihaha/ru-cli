#!/usr/bin/env node

const fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    glob = require('glob'),
    requirer = require('inquirer'),
    copyTemplate = require('../lib/copyTemplate'),
    type = ['react', 'express', 'multiple_pages']

program.version('1.0.0')
    .usage('[options] [dir]')
    .command('init', 'init project')
    .option('-r, --react', 'create react project', 'react')
    .option('-e, --express', 'create express project', 'express')
    .option('-u, --rollup', 'create rollup project', 'rollup')
    .option('-m, --multiple_pages', 'create multiple_pages project', 'multiple_pages')
    .parse(process.argv)

requirer.prompt([
    {
        type: 'input',
        name: 'description',
        message: 'please input some description about this project',
        default: ''
    },
    {
        type: 'input',
        name: 'author',
        message: 'who is the author for this project?',
        default: 'mantis li'
    }
]).then(locals => {
    const projectName = program.args.shift()
    locals.projectName = projectName
    locals.startTime = (new Date()).toLocaleDateString() + ' ' +  (new Date()).toLocaleTimeString()

    // 选取的框架
    let templateName
    const { react, express, rollup } = program,
        inputParams = [react, express, rollup].filter(item => !!item)

    if (inputParams.length > 1) {
        throw new Error('选取的项目模板参数不可多选')
    } else if (inputParams.length === 0) {
        throw new Error('项目分类参数必填, 请输入参数[-r | -e | react | express]选取框架模版')
    } else {
        templateName = inputParams[0]
    }

    // 验证项目名的可用性
    const isAvailable = type.findIndex(item => item === projectName) === -1
    if (!isAvailable) {
        throw new ReferenceError('项目名称不可用')
    }

    //将生成项目目录的路径
    const oldUrl = path.resolve(__dirname, '..', 'template', templateName),
        newUrl = path.resolve(process.cwd(), '.', projectName),
        list = glob.sync('*')

    if (list.includes(projectName)) {
        if (fs.readdirSync(newUrl).length !== 0) {
            throw new ReferenceError('文件夹已存在')
        }
    } else {
        fs.mkdirSync(projectName)
    }

    copyTemplate(oldUrl, newUrl, locals)

    console.log(`*********     项目目录文件构建已完成      *********`)
}).catch (err => {
    throw err
})
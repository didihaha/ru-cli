#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const glob = require('glob')

const copyTemplate = require('../lib/copyTemplate'),
    type = ['react', 'express']

program.parse(process.argv)

const optionArr = program.args,
    projectName = optionArr[1]

if ( !(optionArr.length === 2 && type.includes(optionArr[0])) ) {
    throw new Error('参数错误, 请参考README.md文件')
    return null
}

//将生成项目目录的路径
const newUrl = path.resolve(process.cwd(), '.', projectName)
const list = glob.sync('*')

if (list.includes(projectName)) {
    if (fs.readdirSync(newUrl).length !== 0) {
        throw new Error('文件夹已存在')
    }
} else {
    fs.mkdirSync(projectName)
}


copyTemplate(path.join(__dirname, '..', 'template', optionArr[0]), newUrl)

console.log(`*********     项目目录文件构建已完成      *********`)
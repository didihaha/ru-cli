#!/usr/bin/env node

const program = require('commander')

program.version('1.0.0')
    .usage('[options] [dir]')
    .command('init', 'init project')
    .command('hello', 'say hello')
    .option('-r, --react', 'create react project')
    .option('-v, --vue', 'create vue project')
    .parse(process.argv)
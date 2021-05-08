const merge = require('webpack-merge'),
    webpack = require('webpack'),
    testConfig = require('../config/test'),
    pre = require('./webpack.pre')

const test = {
    mode: 'development',
    output: {
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin(testConfig)
    ]
}

module.exports = merge(pre, test)
const merge = require('webpack-merge'),
	webpack = require('webpack'),
	devConfig = require('../config/dev'),
    pre = require('./webpack.pre')

const test = {
    mode: 'development',
    output: {
        publicPath: devConfig.CDN_HOST,
    },
    plugins: [
		new webpack.DefinePlugin(devConfig)
    ]
}

module.exports = merge(pre, test)
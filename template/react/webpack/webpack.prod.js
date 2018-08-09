const merge = require('webpack-merge'),
	webpack = require('webpack'),
	prodConfig = require('../config/prod'),
    pre = require('./webpack.pre')

const prod = {
    mode: 'production',
    output: {
        publicPath: prodConfig.CDN_HOST,
    },
    plugins: [
		new webpack.DefinePlugin(prodConfig)
    ]
}

module.exports = merge(pre, prod)
const merge = require('webpack-merge'),
    webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	base = require('./webpack.base'),
	devConfig = require('../config/dev')

const dev = {
	mode: 'development',
	devtool: 'inline-source-map',
	output: {
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		sourceMapFilename: '[file].map'
	},
	devServer: {
        historyApiFallback: true,
		host: 'localhost',
		port: 8000,
		hot: true,
		open: true,
        inline: true,
        compress: true,
		progress: true,
		// watchContentBase: true
	},
	plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new webpack.DefinePlugin({ ...devConfig })
    ]
}

module.exports = merge(base, dev)
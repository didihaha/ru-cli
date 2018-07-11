const merge = require('webpack-merge'),
	webpack = require('webpack'),
	base = require('./webpack.base')

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
	optimization: {
		namedModules: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HappyPack({
			id: 'css',
            threads: 2,
			loaders: ['style-loader', 'css-loader', 'postcss-loader']
		}),
		new HappyPack({
			id: 'less',
            threads: 2,
			loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
		}),
	]
}

module.exports = merge(base, dev)
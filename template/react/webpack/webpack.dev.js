const merge = require('webpack-merge'),
    webpack = require('webpack'),
	base = require('./webpack.base'),
	// HtmlWebpackPlugin = require('html-webpack-plugin-from-webpack-contrib'),
	HtmlWebpackPlugin = require('html-webpack-plugin')

const dev = {
	devtool: 'inline-source-map',
	output: {
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js',
		sourceMapFilename: '[file].map'
	},
	devServer: {
        historyApiFallback: true,
        contentBase: '/',
		host: 'localhost',
		port: 8000,
		hot: true,
		open: true,
        inline: true,
        compress: true,
        progress: true
	},
	plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"'
		})
    ]
}

module.exports = merge(base, dev)
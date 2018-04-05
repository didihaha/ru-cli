const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin

module.exports = {
	devtool: 'inline-source-map',
	entry: [
		'babel-polyfill',
		'react-hot-loader/patch',
		'./public/js/index.js'
	],
	output: {
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js',
		sourceMapFilename: '[file].map'
	},
	devServer: {
		historyApiFallback: true,
		host: 'localhost',
		port: 8000,
		hot: true,
		open: true
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: { minimize: true }
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: { minimize: true }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'less-loader'
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'url-loader',
				options: {
					limit: 10000, // 10KB
					name: '[path][name].[ext]'
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module, count) {
				let context = module.context
				return context && context.indexOf('node_modules') >= 0
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
			minChunks: Infinity
		}),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new webpack.DefinePlugin({
			IN_APP: process.env.IN_APP,
			'process.env.NODE_ENV': '"development"'
		})
	]
};

const HappyPack = require('happypack'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	productionMode = process.env.NODE_ENV === 'production',
	HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk'],
		main: './public/js/index.js'
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
                use: 'happypack/loader?id=babel',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					productionMode ? {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '/'
						}
					} : 'style-loader',
					'css-loader', 'postcss-loader'],
            	exclude: /node_modules/
			},
			{
				test: /\.less$/,
				use: [
					productionMode ? {
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '/'
						}
					} : 'style-loader',
					'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/i,
				loader: 'url-loader',
				options: {
					limit: 10000, // 10KB
					name: '[path][name]_[hash:7].[ext]',
					publicPath: '/release/',
					outputPath: 'images/'
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new HappyPack({
            id: 'babel',
            threads: 4,
            loaders: ['babel-loader']
		})
	]
};

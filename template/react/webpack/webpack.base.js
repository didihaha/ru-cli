const HappyPack = require('happypack'),
	AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
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
				test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/i,
				loader: 'url-loader',
				options: {
					limit: 10000, // 10KB
					fallback: 'file-loader',
					name: 'images/[name]_[hash:7].[ext]',
					publicPath: '/',
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
		new AddAssetHtmlPlugin({ filepath: require.resolve('../dll/*.js') }),
		new HappyPack({
            id: 'babel',
            threads: 4,
            loaders: ['babel-loader']
		})
	]
};

const HappyPack = require('happypack'),
    path = require('path'),
    webpack = require('webpack'),
	AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	{ CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
	entry: {
		main: './src/index.tsx'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.json', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
                use: [
					{ loader: 'happypack/loader?id=babel' },
					{ loader: 'awesome-typescript-loader' }
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/i,
				loader: 'url-loader',
				options: {
					limit: 10000, // 10KB
					fallback: 'file-loader',
					name: 'images/[name]_[hash:7].[ext]',
					publicPath: '/',
				}
			},
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
		]
	},
	plugins: [
		new CheckerPlugin(),
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, '../dll/'),
			manifest: require(path.join(__dirname, '../dll', 'polyfill_manifest.json')),
        }),
        new webpack.DllReferencePlugin({
			context: path.join(__dirname, '../dll/'),
			manifest: require(path.join(__dirname, '../dll', 'vendor_manifest.json')),
        }),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new AddAssetHtmlPlugin([
			{ filepath: require.resolve('../dll/dll_polyfill_56b2f803.js') },
			{ filepath: require.resolve('../dll/dll_vendor_56b2f803.js') }
		]),
		new HappyPack({
            id: 'babel',
            threads: 4,
            loaders: ['babel-loader']
		})
	]
};

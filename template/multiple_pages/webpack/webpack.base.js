const HappyPack = require('happypack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	fs = require('fs'),
	path = require('path'),
	sourcePath = path.resolve(__dirname, '../src')

const htmlPlugins = [],
	dirArr = fs.readdirSync(sourcePath).filter(item => fs.statSync(path.resolve(sourcePath, item)).isDirectory()),
	entries = {}

dirArr.forEach(item => {
	entries[item] = `./src/${ item }/main.js`
	htmlPlugins.push( new HtmlWebpackPlugin({
		filename: `${item}.html`,
		template: path.resolve(sourcePath, `${ item }/${ item }.html`),
		chunks: [item, 'commons']
	}) )
})

module.exports = {
	entry: entries,
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
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000, // 10KB
						name: '[name].[ext]',
						publicPath: '/images/',
						outputPath: '/images'
					}
				}]
			}
		]
	},
	plugins: [
		// ...htmlPlugins,
		new HtmlWebpackPlugin({
			filename: `share.html`,
			template: path.resolve(sourcePath, `share/share.html`),
			inject: true
		}),
		new HappyPack({
            id: 'babel',
            threads: 4,
            loaders: ['babel-loader']
		})
	]
};
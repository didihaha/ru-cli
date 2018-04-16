const webpack = require('webpack'),
	HappyPack = require('happypack'),
	HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'immutable'],
		main: './public/js/index.js'
	},
	resolve: {
		// 请不要使用jsx尾缀
		extensions: ['.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
                use: 'happypack/loader?id=babel',
				exclude: /node_modules/
			},
			// {
			// 	test: /\.css$/,
			// 	use: 'happypack/loader?id=css',
            //  exclude: /node_modules/
			// },
			{
				test: /\.less$/,
				use: 'happypack/loader?id=less',
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
	optimization: {
        splitChunks: {
            cacheGroups: {
				// 提出公共js文件
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 2,
                    name: 'common'
                }
            }
        }
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
		}),
		// new HappyPack({
		// 	id: 'css',
        //     threads: 2,
		// 	loaders: ['style-loader', 'css-loader', 'postcss-loader']
		// }),
		new HappyPack({
			id: 'less',
            threads: 2,
			loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	]
};

const webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	HappyPack = require('happypack')

module.exports = {
	entry: {
		main: './public/js/index.js',
		vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'immutable']
	},
	resolve: {
		// 请不要使用jsx尾缀
		extensions: ['.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
                use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
                    use: ['style-loader', 'css-loader', 'postcss-loader']
                }),
                exclude: /node_modules/
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/i,
				loader: 'url-loader',
				options: {
					limit: 10000, // 10KB
					name: '[path][name]_[hash:7].[ext]'
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
		// contenthash:8: 根据内容生成hash值取前8位
		// new ExtractTextPlugin('[name].css'),
		// new HappyPack({
        //     id: 'babel',
        //     threads: 4,
        //     loader: 'babel-loader'
		// }),
		// new HappyPack({
		// 	id: 'less',
        //     threads: 4,
		// 	loaders: ['css-loader', 'postcss-loader', 'less-loader']
		//   }),
		new webpack.optimize.ModuleConcatenationPlugin(),
	]
};

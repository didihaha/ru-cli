const merge = require('webpack-merge'),
    webpack = require('webpack'),
    path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'),
    outputPath = path.resolve(__dirname, '../release'),
    base = require('./webpack.base'),
	prodConfig = require('../config/prod')

const prod = {
    mode: 'production',
    output: {
		path: outputPath,
		filename: 'js/[name]-[contenthash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                }),
                exclude: /node_modules/
            },
            {
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					// use: 'happypack/loader?id=less',
					use: ['css-loader', 'postcss-loader', 'less-loader']
                }),
                exclude: /node_modules/
			}
        ]
    },
    plugins: [
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, '../dll/'),
			manifest: require(path.join(__dirname, '../dll', 'manifest.json')),
        }),
		new ExtractTextPlugin({
			filename: getPath => {
				return getPath('css/style-[hash].css').replace('css/js', 'css')
            },
            allChunks: true
		}),
        new CleanWebpackPlugin(
            // 需要删除的文件夹
            [outputPath + '/*'],
            {
                root: outputPath
            }
        ),
		new webpack.DefinePlugin({ ...prodConfig }),
        new WebpackParallelUglifyPlugin(
            {
                uglifyJS: {
                    mangle: false,
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }
        )
    ]
}

module.exports = merge(base, prod)
const merge = require('webpack-merge'),
    path = require('path'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'),
    outputPath = path.resolve(__dirname, '../dist'),
    base = require('./webpack.base')

const prod = {
    mode: 'production',
    output: {
		path: outputPath,
		filename: 'js/[name]_[contenthash:8].js'
    },
    module: {
        rules: [
            {
				test: /\.css$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '/'
						}
					}, 'css-loader', 'postcss-loader'],
            	exclude: /node_modules/
			}
        ]
    },
	optimization: {
        noEmitOnErrors: true,
        concatenateModules: true,
        runtimeChunk: { 
            name: 'runtime'
        }
    },
    plugins: [
        new CleanWebpackPlugin(
            // 需要删除的文件夹
            [outputPath + '/*'],
            {
                root: outputPath
            }
        ),
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
            chunkFilename: 'css/[name].[contenthash:6].css'
        }),
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
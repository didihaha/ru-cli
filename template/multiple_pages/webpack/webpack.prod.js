const merge = require('webpack-merge'),
    webpack = require('webpack'),
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
		filename: 'js/[name]-[contenthash:8].js'
    },
	optimization: {
        noEmitOnErrors: true,
        concatenateModules: true,
        runtimeChunk: { 
            name: 'runtime'
        }
    },
    module: {
		rules: [
			{
				test: /\.(css|less)$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '/'
						}
					}, 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/
			}
		]
	},
    plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:6].css',
            chunkFilename: 'css/[id].[contenthash:6].css'
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
        ),
        new CleanWebpackPlugin(
            // 需要删除的文件夹
            [outputPath + '/*'],
            {
                root: outputPath
            }
        )
    ]
}

module.exports = merge(base, prod)
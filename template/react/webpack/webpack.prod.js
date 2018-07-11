const merge = require('webpack-merge'),
    webpack = require('webpack'),
    path = require('path'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'),
    outputPath = path.resolve(__dirname, '../release'),
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
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, '../dll/'),
			manifest: require(path.join(__dirname, '../dll', 'manifest.json')),
        }),
		new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
		new HappyPack({
			id: 'css',
            threads: 2,
			loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
		}),
		new HappyPack({
			id: 'less',
            threads: 2,
			loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
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
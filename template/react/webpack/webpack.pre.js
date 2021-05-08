const merge = require('webpack-merge'),
    path = require('path'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'),
    outputPath = path.resolve(__dirname, '../release'),
    base = require('./webpack.base')

const pre = {
    output: {
        path: outputPath,
        filename: 'js/[name]_[contenthash:8].js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                }, 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/
            }
        ]
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
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name]_[contenthash:6].css',
            chunkFilename: 'css/[id]_[contenthash:6].css'
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
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    },
                    warnings: false,
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

module.exports = merge(base, pre)

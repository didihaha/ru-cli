const merge = require('webpack-merge'),
    webpack = require('webpack'),
    path = require('path'),
    base = require('./webpack.base'),
    WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const prod = {
    output: {
		path: path.join(__dirname, './release'),
		filename: 'main.js'
    },
    plugins: [
        new CleanWebpackPlugin(
            // 需要删除的文件夹或文件
            [path.join(__dirname, './release/*.*')],
            {
                // root目录
                root: path.join(__dirname, './')
            }
        ),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
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
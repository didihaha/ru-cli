const merge = require('webpack-merge'),
    webpack = require('webpack'),
    devConfig = require('../config/dev'),
    base = require('./webpack.base'),
    ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    
const dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        sourceMapFilename: '[file].map'
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8000,
        open: true,
        compress: true,
        // watchContentBase: true
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.DefinePlugin(devConfig)
    ]
}

module.exports = merge(base, dev)
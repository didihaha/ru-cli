const webpack = require('webpack'),
    path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'immutable']
    },
    output: {
        path: path.join(__dirname, '../dll'),
        filename: 'dll.[name].js',
        library: '[name]_[hash]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dll', 'manifest.json'),
            name: '[name]_[hash]'
        })
    ]
}
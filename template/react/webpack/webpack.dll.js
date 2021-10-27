const webpack = require('webpack'),
    path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'axios', 'classnames']
    },
    output: {
        path: path.join(__dirname, '../dll'),
        filename: 'dll_[name]_[hash:8].js',
        library: '[name]_dll'
    },
    plugins: [
        new webpack.DllPlugin({
            context: path.join(__dirname, '../dll/'),
            path: path.join(__dirname, '../dll', '[name]_manifest.json'),
            name: '[name]_dll'
        })
    ]
}
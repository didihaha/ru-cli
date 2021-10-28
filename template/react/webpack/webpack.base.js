const HtmlWebpackPlugin = require('html-webpack-plugin'),
    AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin")

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
    entry: {
        main: ['core-js/modules/es.set', 'core-js/modules/es.map', 'core-js/modules/es.array.iterator', './src/index.tsx']
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: ['thread-loader', 'babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.ts|tsx$/,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean)
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/i,
                loader: 'url-loader',
                options: {
                    limit: 10000, // 10KB
                    fallback: 'file-loader',
                    name: 'images/[name]_[hash:7].[ext]',
                    publicPath: '/',
                }
            },
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            "filename": "index.html",
            "template": "index.html",
            "inject": true
        }),
        new AddAssetHtmlPlugin([
            { filepath: require.resolve('../dll/dll_vendor_f865f399.js') }
        ]),
    ]
};

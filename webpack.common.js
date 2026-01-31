const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            assets: path.resolve('./client/assets')
        },
        fallback: {
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            util: require.resolve('util')
        },
        modules: ['node_modules']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './client/index.html',
            inject: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    output: {
        publicPath: '/',
        clean: true
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /[\\/]node_modules[\\/](?!(@sendgrid\/mail|debug|engine.io-client|socket.io-client|cross-env|eslint-config-prettier|eslint-plugin-prettier|lint-staged|pg|prettier|socket.io|winston)[\\/])/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpe?g|svg|png|gif|ico|mp3|ogg|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
                type: 'asset/resource'
            },
            {
                test: /\.json/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [require.resolve('json-loader')]
            }
        ]
    }
};

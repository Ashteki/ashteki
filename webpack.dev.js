const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        bundle: [
            'react-hot-loader/babel',
            './client/index.jsx',
            'webpack-hot-middleware/client'
        ]
    },
    output: {
        filename: '[name].[contenthash].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
        historyApiFallback: true,
        publicPath: '/'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
});

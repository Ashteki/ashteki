const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        publicPath: '/'
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
                exclude: /[\\/]node_modules[\\/](?!(@sendgrid\/mail|debug|engine.io-client|socket.io-client|cross-env|eslint-config-prettier|eslint-plugin-jest|eslint-plugin-prettier|pg|prettier|socket.io|winston)[\\/])/,
                loader: 'babel-loader'
            },
            {
                test: /.(jpe?g|png|gif|woff(2)?|eot|ttf|cur|svg|mp3|ogg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=16384'
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, './'),
                                    path.resolve(__dirname, 'node_modules')
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.json/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [require.resolve('json-loader')]
            },
            // pug templates removed; use static HTML template at client/index.html
        ]
    }
};

const { resolve } = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const path = require('path');
const fs = require('fs');
const ip = require('ip').address();
const packageJson = require('./package.json');
const appName = packageJson.name.split('.').join('');

const getBundleName = function() {
    let dirUrl = path.resolve(__dirname, 'bundle');
    let files = fs.readdirSync(dirUrl);
    for (fileName of files) {
        if (/.js$/.test(fileName)) {
            return fileName;
        }
    }
    return '';
};

const bundleName = getBundleName();
const bundlePath = '//p0.ifengimg.com/fe/zl/test/live/' + appName + '/';

module.exports = {
    context: resolve(__dirname, 'client'),

    entry: {
        index: ['./index.js'],
        // 我们 app 的入口文件
    },
    output: {
        filename: '[name].[chunkhash:5].js',
        chunkFilename: '[name].[chunkhash:5].js',
        // 输出的打包文件
        path: resolve(__dirname, 'dist'),
        publicPath: '//p0.ifengimg.com/fe/zl/test/live/' + appName + '/',
        // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
    },

    devtool: 'source-map',
    resolve: {
        alias: {
            utils: path.resolve(__dirname, './client/utils/'),
            config: path.resolve(__dirname, './client/config'),
        },
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|sass|css)$/,
                include: /node_modules/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(scss|sass|css)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader?modules&localIdentName=[path][local]_[hash:base64:5]',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: '[name].[hash:5].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            LOCATIONIP: JSON.stringify(ip),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest'],
            minChunks: 2,
        }),
        new HtmlwebpackPlugin({
            template: './index.html',
            inject: true,
            path: '/',
            bundleUrl: bundlePath + bundleName,
            chunks: ['index', 'vendor', 'manifest'],
        }),
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require('./bundle/bundle.manifest.json'),
        }),
        new ExtractTextPlugin('[name].[contenthash:5].css'),
        new CleanPlugin(['dist']),
    ],
};

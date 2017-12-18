const { resolve } = require('path');
const webpack = require('webpack');
const ip = require('ip').address();
const path = require('path');
const fs = require('fs');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const getBundleName = function () {
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
const bundlePath = '/bundle/';

module.exports = function(env) {
    console.log(env);
    return {
        context: resolve(__dirname, env.type),
        entry: {
            index: [
                'react-hot-loader/patch',
                // 开启 React 代码的模块热替换(HMR)

                // 为 webpack-dev-server 的环境打包代码
                // 然后连接到指定服务器域名与端口
                'webpack-dev-server/client?http://localhost:' + env.port,
                // 为热替换(HMR)打包好代码
                // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
                'webpack/hot/only-dev-server',

                // 我们 app 的入口文件
                './index.js',
            ],
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
            // 输出的打包文件
            path: resolve(__dirname, 'dist'),
            publicPath: '/',
            // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
        },

        devtool: 'cheap-module-eval-source-map',
        // devtool: 'cheap-module-source-map',

        devServer: {
            // 开启服务器的模块热替换(HMR)
            hot: true,
            host: '0.0.0.0',
            inline: true,
            disableHostCheck: true,
            // 输出文件的路径
            // contentBase: resolve(__dirname, 'web'),
            // 和上文 output 的“publicPath”值保持一致
            publicPath: '/',
        },
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
                }, {
                    test: /\.(scss|sass|css)$/,
                    include: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'postcss-loader',
                    ],
                }, {
                    test: /\.(scss|sass|css)$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader?modules&localIdentName=[path][name]_[local]',
                        'postcss-loader',
                    ],
                }, {
                    test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 100,
                                name: '[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlwebpackPlugin({
                template: './index.html',
                inject: true,
                path: 'http://p0.ifengimg.com/386ce73cec45533b/2017/29/',
                min: '',
                bundleUrl: bundlePath + bundleName,
                chunks: ['index', 'vendor', 'manifest'],
            }),
            // 允许创建一个在编译时可以配置的全局常量
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development'),
                'LOCATIONIP': JSON.stringify(ip),
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['vendor', 'manifest'],
                minChunks: 2,
            }),
            new webpack.DllReferencePlugin({
                context: '.',
                manifest: require('./bundle/bundle.manifest.json'),
            }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'vendor',
            //     minChunks: Infinity
            // }),
            // new ExtractTextPlugin('index.css'),
            new webpack.HotModuleReplacementPlugin(),
            // 开启全局的模块热替换(HMR)

            new webpack.NamedModulesPlugin(),
            // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
        ],
    };
};

const webpack = require('webpack');
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
module.exports = {
    entry: {
        bundle: [
            'react',
            'react-dom',
            // 'react-redux',
            // 'react-router',
            // 'react-router-dom',
            // 'redux',
            // 'redux-thunk',
            // 'reselect',
            'antd',
            // 其他库
        ],
    },
    output: {
        path: ROOT_PATH + '/bundle',
        filename: '[name].[hash:5].js',
        library: '[name]_library',
    },
    plugins: [
        new webpack.DllPlugin({
            path: ROOT_PATH + '/bundle/bundle.manifest.json',
            name: '[name]_library',
        }),
        new CleanPlugin(['bundle']),
    ],
};

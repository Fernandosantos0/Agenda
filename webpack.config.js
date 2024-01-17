const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './frontend/main.js',
    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
            'style-loader',
            'css-loader'
            ]
        }
        ]
    },
    devtool: 'source-map'
};
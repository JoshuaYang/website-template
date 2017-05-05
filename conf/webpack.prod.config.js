const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config.js');


module.exports = merge(baseWebpackConfig, {
    plugins: [
        new CleanWebpackPlugin([
            'dist',
        ], {
            root: process.cwd(),
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                drop_console: true,
            },
        }),
        new CopyWebpackPlugin([
            {
                // from: './dev',
                from: './dev/favicon.ico',
            },
        ], {
            ignore: [
                // '*.html',
                // 'router.js',
                // 'style/**/*',
                // 'script/**/*',
                // 'store/**/*',
                // 'component/**/*',
                // 'data/**/*',
                // 'font/**/*',
            ],
        }),
    ],
});

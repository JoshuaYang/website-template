let webpack = require('webpack');
let merge = require('webpack-merge');
let webpackConfig;

let baseWebpackConfig = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                loader: 'babel',
            },
            {
                test: /\.vue$/,
                loader: 'vue',
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js',
        },
    },
    plugins: [],
};

if(process.env.NODE_ENV === 'development'){
    webpackConfig = merge(baseWebpackConfig, {
        watch: true,
        devtool: 'source-map',
    });
}

if(process.env.NODE_ENV === 'production'){
    webpackConfig = merge(baseWebpackConfig, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
            })
        ],
    });
}


module.exports = webpackConfig;
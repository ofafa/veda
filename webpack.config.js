/**
 * Created by s955281 on 2017/2/20.
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: path.join('./', 'src','composPage.js'),
    output: {
        path: path.join('./', 'public', 'js'),
        filename: 'bundle.js'
    },
    module:{
        loaders:[{
            test: /\.jsx?/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                cacheDirectory: 'babel_cache',
                presets:['react', 'es2015']
            }
        }]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_env':JSON.stringify(process.env.NODE_env)
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings:false },
            mangle: false,
            sourcemap:false,
            beautify: false,
            dead_code:true
        })
    ]
};

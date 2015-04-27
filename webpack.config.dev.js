/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
var webpack = require('webpack');
module.exports = {
    entry: {
        quiz: 'quiz.js',
        quizApp: 'quizApp.js',
        createQuizApp: 'createQuizApp.js',
        vendor: ['angular', 'angular-route', 'angular-animate', 'fastclick']
    },
    plugins: [ new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js') ],
    cache: true,
    output: {
        path: __dirname,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'scripts']
    },
    devtool: '#source-map'
};
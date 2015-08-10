/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        quiz: 'quiz.js',
        quizApp: 'quizApp.js',
        cqApp: ['createQuizApp/styles/createQuizApp', 'createQuizApp/CQApp.js'],
        vendor: ['fastclick', 'react', 'superagent', 'object-assign']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es/)
    ],
    output: {
        path: path.join(__dirname, 'public/js/'),
        filename: '[name].js',
        publicPath: 'http://localhost:7071/js/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: ['react-hot', 'babel?optional[]=runtime'],
                exclude: /(bower_components)/
            },
            {
                test: /\.js$/,
                loader: 'babel?optional[]=runtime',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.es6\.js$/,
                loader: 'babel?optional[]=runtime',
                exclude: /(bower_components)/
            },
            {
                test: /\.scss$/,
                loader: 'style!css?sourceMap!autoprefixer-loader?browsers=last 2 version!sass?sourceMap&sourceMapContents=true'
            },
            {
                test: /\.css$/,
                loader: 'style!css?sourceMap!autoprefixer-loader?browsers=last 2 version'
            },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.jpg$/, loader: "url-loader" },
            { test: /\.svg$/, loader: "url-loader?limit=100000" }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.es6.js', '.js', '.jsx', '.json', '.scss'],
        modulesDirectories: ['node_modules', 'scripts'],
        alias: {
            'ie': 'component-ie'
        }
    }
};

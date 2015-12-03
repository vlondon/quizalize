/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        quiz: 'quiz.js',
        quizApp: 'quizApp.js',
        home: ['home.js', 'liveBeta/liveBeta.js'],
        playQuizApp: ['playQuizApp/index.js'], 
        publishers: 'publishers.js',
        kahoot: 'kahoot.js',
        quizlet: 'quizlet.js',
        cqApp: ['createQuizApp/styles/createQuizApp', 'createQuizApp/CQApp.js'],
        vendor: ['fastclick', 'react', 'superagent']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es/),
        new ExtractTextPlugin("[name].css")
    ],
    output: {
        path: path.join(__dirname, 'public/js/'),
        filename: '[name].js',
        publicPath: '/js/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: ['babel?optional[]=runtime&stage=0'],
                exclude: /(bower_components)/
            },
            {
                test: /\.js$/,
                loader: 'babel?optional[]=runtime&stage=0',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap!autoprefixer-loader?{browsers:["last 2 version", "IE >= 9"]}!sass?sourceMap&sourceMapContents=true')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap!autoprefixer-loader?{browsers:["last 2 version", "IE >= 9"]}!sass?sourceMap&sourceMapContents=true')
            },
            { test: /\.png$/, loader: "url-loader?mimetype=image/png&limit=5000000" },
            { test: /\.jpg$/, loader: "url-loader" },
            { test: /\.svg$/, loader: "url-loader?limit=500" }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.es6.js', '.js', '.jsx', '.json', '.scss'],
        modulesDirectories: ['node_modules', 'src/client'],
        alias: {
            'ie': 'component-ie'
        }
    }
};

var config = require('./webpack.config.dev.js');

var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');


var server = new WebpackDevServer(webpack(config), {
    contentBase: path.join(__dirname, '/public/js'),
    hot: true,
    quiet: false,
    noInfo: false,
    publicPath: 'http://localhost:7071/js',
    historyApiFallback: false,

    stats: { colors: true }

});


server.listen(7071, 'localhost', function() {});

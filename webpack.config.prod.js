/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
// var webpack = require('webpack');
console.log('__dirname', __dirname);
module.exports = {
    entry: './src/main/scripts/app.jsx',
    output: {
        path: __dirname,
        filename: 'scripts.js'
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({compress: {
    //         'drop_console': true
    //     }})
    // ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                loader: 'typescript-loader?typescriptCompiler=jsx-typescript'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'src/main/scripts']
    }
};

// module.exports = {
//
// 	output: {
// 		filename: 'main.js',
// 		publicPath: '/assets/'
// 	},
//
// 	cache: true,
// 	debug: true,
// 	devtool: false,
// 	entry: [
// 			'webpack/hot/only-dev-server',
// 			'./src/scripts/components/main.js'
// 	],
//
// 	stats: {
// 		colors: true,
// 		reasons: true
// 	},
//
// 	resolve: {
// 		extensions: ['', '.js'],
// 		alias: {
// 			'styles': '../../../src/styles',
// 			'components': '../../../src/scripts/components/'
// 		}
// 	},
// 	module: {
// 		preLoaders: [{
// 			test: /\.js$/,
// 			exclude: /node_modules/,
// 			loader: 'jsxhint'
// 		}],
// 		loaders: [{
// 			test: /\.js$/,
// 			exclude: /node_modules/,
// 			loader: 'react-hot!jsx-loader?harmony'
// 		}, {
// 			test: /\.less/,
// 			loader: 'style-loader!css-loader!less-loader'
// 		}, {
// 			test: /\.css$/,
// 			loader: 'style-loader!css-loader'
// 		}, {
// 			test: /\.(png|jpg)$/,
// 			loader: 'url-loader?limit=8192'
// 		}]
// 	},
//
// 	plugins: [
// 		new webpack.HotModuleReplacementPlugin(),
// 		new webpack.NoErrorsPlugin()
// 	]

// };

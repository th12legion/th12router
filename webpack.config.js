var path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

let NODE_ENV = process.env.NODE_ENV || "development";// production development

module.exports = {
	mode: NODE_ENV,
  	entry: './src/index.js',
  	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		libraryTarget: 'commonjs2'
 	},
  	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|build)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	externals: {
		'react': {
			root: 'React',
			commonjs: 'react',
			commonjs2: 'react',
		},
		'react-native': {
			root: 'ReactNative',
			commonjs: 'react-native',
			commonjs2: 'react-native',
		},
		'th12storage': {
			root: 'th12storage',
			commonjs: 'th12storage',
			commonjs2: 'th12storage',
		},
		'prop-types': {
			root: 'PropTypes',
			commonjs: 'prop-types',
			commonjs2: 'prop-types',
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs: 'react-dom',
			commonjs2: 'react-dom',
		},
		'react-dom/server': {
			root: 'ReactDOMServer',
			commonjs: 'react-dom/server',
			commonjs2: 'react-dom/server',
		}
	}
	,plugins: [
		...(NODE_ENV=="development" ? [] : [new TerserPlugin()]),
	]
};
import {join} from 'path';
import {optimize} from 'webpack';
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

/**
 * Update this variable if you change your library name
 */
const libraryName = 'mobxpromise';

export default {
	entry: join(__dirname, `src/${libraryName}.ts`),
	devtool: 'source-map',
	output: {
		path: join(__dirname, 'dist'),
		libraryTarget: 'umd',
		library: libraryName,
		filename: `${libraryName}.js`
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: [
				{
					loader: 'babel-loader',
					options: {presets: ['es2015']}
				},
				{
					loader: 'ts-loader'
				}
			],
			exclude: [
				join(__dirname, 'node_modules'),
				join(__dirname, 'test')
			]
		}]
	},
	plugins: [
		new optimize.UglifyJsPlugin({sourceMap: true}),
		new TypedocWebpackPlugin(
			{
				theme: 'minimal',
				out: 'docs',
				target: 'es6',
				ignoreCompilerErrors: true
			},
			'src'
		)
	]
};

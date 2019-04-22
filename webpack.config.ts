import {join} from 'path'
const {camelCase} = require('lodash')
const {TsConfigPathsPlugin, CheckerPlugin} = require('awesome-typescript-loader')

/**
 * Update this variable if you change your library name
 */
const libraryName = 'index'

export default {
	entry: join(__dirname, `src/${libraryName}.ts`),
	// Currently cheap-module-source-map is broken https://github.com/webpack/webpack/issues/4176
	devtool: 'source-map',
	output: {
		path: join(__dirname, 'dist'),
		libraryTarget: 'umd',
		library: camelCase(libraryName),
		filename: `${libraryName}.js`
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react'],
					plugins: ['transform-decorators-legacy', 'transform-class-properties'],
				}
			}
		]
	},
	externals: {
		mobx: 'mobx'
	},
	plugins: [
		new CheckerPlugin(),
		new TsConfigPathsPlugin()
	]
}

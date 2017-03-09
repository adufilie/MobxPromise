"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const { camelCase } = require('lodash');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
/**
 * Update this variable if you change your library name
 */
const libraryName = 'index';
exports.default = {
    entry: path_1.join(__dirname, `src/${libraryName}.ts`),
    // Currently cheap-module-source-map is broken https://github.com/webpack/webpack/issues/4176
    devtool: 'source-map',
    output: {
        path: path_1.join(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: camelCase(libraryName),
        filename: `${libraryName}.js`
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
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
        new TsConfigPathsPlugin(),
        new TypedocWebpackPlugin({
            theme: 'minimal',
            out: 'docs',
            target: 'es6',
            ignoreCompilerErrors: true
        }, 'src')
    ]
};
//# sourceMappingURL=webpack.config.js.map
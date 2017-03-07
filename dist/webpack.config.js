"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const webpack_1 = require("webpack");
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
/**
 * Update this variable if you change your library name
 */
const libraryName = 'mobxpromise';
exports.default = {
    entry: path_1.join(__dirname, `src/${libraryName}.ts`),
    devtool: 'source-map',
    output: {
        path: path_1.join(__dirname, 'dist'),
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
                        options: { presets: ['es2015'] }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: [
                    path_1.join(__dirname, 'node_modules'),
                    path_1.join(__dirname, 'test')
                ]
            }]
    },
    plugins: [
        new webpack_1.optimize.UglifyJsPlugin({ sourceMap: true }),
        new TypedocWebpackPlugin({
            theme: 'minimal',
            out: 'docs',
            target: 'es6',
            ignoreCompilerErrors: true
        }, 'src')
    ]
};
//# sourceMappingURL=webpack.config.js.map
declare var _default: {
    entry: string;
    devtool: string;
    output: {
        path: string;
        libraryTarget: string;
        library: any;
        filename: string;
    };
    resolve: {
        extensions: string[];
    };
    module: {
        loaders: ({
            test: RegExp;
            exclude: RegExp;
            loader: string;
        } | {
            test: RegExp;
            exclude: RegExp;
            loader: string;
            query: {
                presets: string[];
                plugins: string[];
            };
        })[];
    };
    externals: {
        mobx: string;
    };
    plugins: any[];
};
export default _default;

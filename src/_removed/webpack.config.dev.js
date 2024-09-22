const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/extension.ts', // Your extension's entry point
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'inline-source-map', // Enhanced source maps for debugging
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode' // Important for VS Code extensions
    },
    watch: true // Watch for changes and rebuild automatically
};

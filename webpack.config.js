//@ts-check

'use strict';

const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */

module.exports = (_env, argv) => {
    const isProduction = argv.mode === 'production';

    // mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    const mode = isProduction ? 'production' : 'development';

    const devtool = isProduction ? false : 'eval-source-map';

    return {
        target: 'node',
        mode: mode,
        entry: './src/extension.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'extension.js',
            libraryTarget: 'commonjs2',
            clean: true,
        },
        externals: { vscode: 'commonjs vscode', typescript: 'commonjs typescript' },  //
        resolve: { extensions: ['.ts', '.js'] },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'jsx', // Or 'ts' if you're using TypeScript
                            target: 'es2020', // Adjust the target if needed
                        },
                    },
                },
            ],
        },

        devtool: devtool,
        infrastructureLogging: {
            level: 'log', // enables logging required for problem matchers
        },
    };
};

// module.exports = [ extensionConfig ];












// {
//     test: /\.(js|ts)x?$/,
//     exclude: /node_modules/,
//     use: {
//         loader: 'esbuild-loader',
//         options: {
//             loader: 'ts',
//             target: 'es2022',
//         },
//     },
// },

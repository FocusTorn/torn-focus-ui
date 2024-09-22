//@ts-check

'use strict';

const path = require('path');


//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */


module.exports = (_env, argv) => {
    const isProduction = argv.mode === 'production';
    
    console.log(isProduction);
    
    
    const mode = isProduction ? 'production' : 'development';
    const devtool = isProduction ? false : 'source-map';
    
    
    
    
    return {
        target: 'node',
        mode: mode,
        entry: './src/extension.ts',

        // const extensionConfig = {
        // target: 'node',
        // mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        // entry: './src/extension.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'extension.js',
            libraryTarget: 'commonjs2',
            clean: true,
        },
        externals: { vscode: 'commonjs vscode', typescript: 'commonjs typescript' },
        resolve: { extensions: ['.ts', '.js'] },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/, // Match both .js and .ts files (and optional .jsx/.tsx)
                    exclude: /node_modules/,
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'ts', // Use 'tsx' to handle both TS and JSX
                            // (or 'ts' if you're not using JSX)
                            target: 'es2020', // Adjust the target if needed
                        },
                    },
                },
            ],
        },

        // devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
        // devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
        
        // devtool: isProduction ? false : 'source-map',

        devtool: devtool,

        

        infrastructureLogging: {
            level: 'log', // enables logging required for problem matchers
        },
    };
};








    // When using 
    
    // ```webpack --mode production```
    
    // to use 
    
    // ```D:\_dev\torn-focus-ui\webpack.config.js```
    
    // why does the argv.mode not get set
    














// module.exports = [ extensionConfig ];

// {
//     test: /\.ts$/,
//     exclude: /node_modules/,
//     use: [
//         {
//             loader: 'ts-loader',
//         },
//     ],
// },
// {
//     test: /\.m?js$/,
//     exclude: /node_modules/,
//     use: {
//         loader: 'esbuild-loader',
//         options: {
//             loader: 'jsx', // Or 'ts' if you're using TypeScript
//             target: 'es2022', // Adjust the target if needed
//         },
//     },
// },

// if (require.main === module) {
//     // Modify the extensionConfig object for production build
//     extensionConfig.mode = 'production';
//     extensionConfig.devtool = 'hidden-source-map';
// }

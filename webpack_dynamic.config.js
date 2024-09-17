const path = require('path');
// const WriteFilePlugin = require('write-file-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');


// class EntryFilePlugin {
//     apply(compiler) {
//         compiler.hooks.afterCompile.tap('EntryFilePlugin', (compilation) => {
//             const entryFileContent = `module.exports = 'extension.${compilation.hash}.js';`;
//             compilation.assets['entry-file.js'] = {
//                 source: () => entryFileContent,
//                 size: () => entryFileContent.length,
//             };
//         });
//     }
// }

// class EntryFilePlugin {
//     apply(compiler) {
//       compiler.hooks.processAssets.tap(
//         {
//           name: 'EntryFilePlugin',
//           stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE, // Correct position
//         },
//         (assets) => {
//           // Access everything you need here
//           const compilation = assets.compilation;
//           const entryFileContent = `module.exports = 'extension.${compilation.hash}.js';`;
//           assets['entry-file.js'] = {
//             source: () => entryFileContent,
//             size: () => entryFileContent.length,
//           };
//         }
//       );
//     }
//   }











module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';




    return {
        entry: './src/extension.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'extension.js', //filename: '[name].[contenthash].js', // Use content hash for better caching
            clean: true
        },
        target: 'node',
        devtool: isProduction ? false : 'inline-source-map', // Source maps only in dev
        externals: { vscode: 'commonjs vscode' },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                }
            ]
        },
        resolve: { extensions: ['.ts', '.js'] },
        watch: !isProduction,
        watchOptions: {
            // Example: ignored: [path.resolve(__dirname, 'src/data')],
            ignored: /node_modules/,
            poll: 1000, // Check for changes every 1000 milliseconds (1 second)
            aggregateTimeout: 500, // Delay before rebuilding after the last file change

        },
        plugins: [
            // new WriteFilePlugin({
            //     // Write the filename to a file like 'entry-file.js'
            //     name: 'entry-file.js',
            //     path: path.resolve(__dirname, 'dist'),

            //     // content: `module.exports = 'extension.${compilation.hash}.js';`
            //     content: function (compilation) {
            //         return `module.exports = 'extension.${compilation.hash}.js';`;
            //     }


            // }),


            // new CopyPlugin({
            //     patterns: [
            //         {
            //             from: path.resolve(__dirname, 'src', 'scripts', 'js', 'entry-file-template.js'),
            //             to: path.resolve(__dirname, 'dist', 'entry-file.js'),
            //             transform(content, absoluteFrom) {
            //                 return content.toString().replace('[fullhash]', compilation.hash);
            //             },
            //         },
            //     ],
            // }),


            // new CopyPlugin({
            //     patterns: [
            //         {
            //             from: path.resolve(__dirname, 'src', 'scripts', 'js', 'entry-file-template.js'),
            //             to: path.resolve(__dirname, 'dist', 'entry-file.js'),
            //         },
            //     ],
            // }),

            // // Add the custom plugin to the plugins array
            // new EntryFilePlugin(),





        ],



















    };
};

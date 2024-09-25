import { join } from 'node:path';
import { build } from 'esbuild'; 
import config from './esbuild.config';
import * as fs from 'fs/promises';
// import { visualizer } from 'rollup-plugin-visualizer';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


const args = process.argv.slice(2);

// Function to parse arguments (you can customize this logic)
function parseArguments(args: string[]) {
    let sourcemapEnabled = config.sourcemap;
    let minifyEnabled = config.minify;

    for (const arg of args) {
        if (arg === '--sourcemap=false') {
            sourcemapEnabled = false;
        } else if (arg === '--minify=true') {
            minifyEnabled = true;
        } 
        
        
        
        
        
        
        // Add more argument parsing logic if needed
    }

    return { sourcemapEnabled, minifyEnabled };
}

// Parse the arguments
const { sourcemapEnabled, minifyEnabled } = parseArguments(args);

// Create build options, overriding defaults if flags are provided
const buildOptions = {
    ...config,
    sourcemap: sourcemapEnabled,
    minify: minifyEnabled,
    
    define: {
        "process.env.NODE_ENV": '"production"',
        "console.log": "null",
      },
    
    
    

    plugins: [

        // {   name: 'bundle-analyzer',
        //     setup(build) {
        //         new BundleAnalyzerPlugin({
        //             analyzerMode: 'static',
        //             reportFilename: 'dist/bundle-report.html',
        //         }).apply(build);
        //     },
        // },




        // visualizer({
        //     filename: 'dist/stats.html',
        //     template: 'treemap',
        // }),
    ],
};







const output = await build(buildOptions).catch(() => process.exit(1));

if (config.metafile) {
    const path = join(process.cwd(), 'dist', 'metafile.json');
    await fs.writeFile(path, JSON.stringify(output.metafile, undefined, 2));
}



// //- For NPM ------------------------------------------------------

// (async () => {
//     const output = await build(buildOptions).catch(() => process.exit(1));

//     if (config.metafile) {
//         const path = join(process.cwd(), 'dist', 'metafile.json');
//         await fs.writeFile(path, JSON.stringify(output.metafile, undefined, 2));
//     }
// })();





// OR !!!!!

// const output = await build(config).catch(() => process.exit(1));

// If metafile is enabled, write it to dist/metafile.json
// Metafiles can be analyzed to determine the dependencies of the build
// https://esbuild.github.io/analyze/

// if (config.metafile) {
//     const path = join(process.cwd(), 'dist', 'metafile.json');
//     await fs.writeFile(path, JSON.stringify(output.metafile, undefined, 2));
// }

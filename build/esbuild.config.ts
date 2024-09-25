import type { BuildOptions } from 'esbuild';

const config: BuildOptions = {
    
    
    
    
    // entryPoints: ['./src/extension.ts'],
    entryPoints: ['./out/src/extension.js'],
    
    
    
    minify: false,
    sourcemap: true,
    bundle: true,
    metafile: true,
    
    
    platform: 'node',
    target: 'node12',
    
    outdir: './dist',

    outExtension: {
        '.js': '.cjs',
    },

    format: 'cjs',
    
    
    external: ['vscode'],

    loader: {
        '.ts': 'ts',
        '.js': 'js',
    },
    logLevel: 'info',
};

export default config;

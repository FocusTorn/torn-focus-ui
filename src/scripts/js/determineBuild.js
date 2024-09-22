import { execSync } from 'child_process';

// Function to check if a command exists
// function commandExists(command) {
//     try {
//         execSync(`${command} --version`, { stdio: 'ignore' });
//         return true;
//     } catch (_error) {
//         return false;
//     }
// }

// 1. Check for an environment variable to override the build tool
const preferredBuildTool = process.env.BUILD_TOOL;

// 2. Determine the build command based on priority or environment variable
// let buildCommand = '';


if (preferredBuildTool === 'wp') {
    console.log('Using Webpack for build (specified via environment variable).');
    // buildCommand = 'npm run build:webpack';
  
}else if (preferredBuildTool === 'esb') {
    console.log('Using ESBuild for build (specified via environment variable).');
    // buildCommand = 'npm run build:esbuild';
    
// } else if (commandExists('bun') && preferredBuildTool !== 'esbuild') {
//     console.log('Bun found, using esbuild for build.');
//     buildCommand = 'npm run build:esbuild';
    
    
// } else if (commandExists('webpack')) {
//     console.log('Webpack found, using it for build.');
//     buildCommand = 'npm run build:webpack';
    
    
} else {
    console.error('Error: Neither Bun nor Webpack found. Please install one.');
    process.exit(1);
}






// 3. Execute the build command
console.log(`Running build command: ${buildCommand}`);
execSync(buildCommand, { stdio: 'inherit' });

const fs = require('node:fs');
const path = require('node:path');

function getDotPathToWorkspaceRoot() {
    let currentDir = __dirname;
    let dotPath = '';
    let levelsUp = 0;

    // Keep going up until we find a directory containing 'package.json'
    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.resolve(currentDir, '..');
        dotPath = path.join('..', dotPath); // Prepend ".." to the dotPath
        levelsUp++;

        // Safety check to avoid infinite loops if something goes wrong
        if (levelsUp > 10) {
            console.error('Could not find workspace root (package.json) after 10 levels.');
            return null;
        }
    }

    return dotPath;
}

// Example usage:
const DOTPATH = getDotPathToWorkspaceRoot();
const WORKSPACEROOT = path.resolve(__dirname, DOTPATH);

console.log('Dot Path:', DOTPATH);
console.log("Workspace Root:", WORKSPACEROOT);

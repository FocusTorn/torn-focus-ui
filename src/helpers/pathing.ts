import * as fs from 'fs';
import * as path from 'path';

export function getDotPathToWorkspaceRoot(): string | null {
    let currentDir = __dirname;
    let dotPath = '';
    let levelsUp = 0;

    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.resolve(currentDir, '..');
        dotPath = path.join('..', dotPath);
        levelsUp++;

        if (levelsUp > 10) {
            console.error('Could not find workspace root (package.json) after 10 levels.');
            return null;
        }
    }

    return dotPath;
}

export const getWorkspaceRoot = getDotPathToWorkspaceRoot() ? path.resolve(__dirname, getDotPathToWorkspaceRoot()!) : null;


 






const fs = require('fs');
const entryFile = require('./dist/entry-file.js'); // Get the filename from the file
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
packageJson.main = `./dist/${entryFile}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

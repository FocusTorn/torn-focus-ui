const fs = require('fs');

// Read package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Get current version and split it
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Increment patch version
patch++;

// Update package.json with the new version
packageJson.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Version updated to ${packageJson.version}`);

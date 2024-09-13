var fileIcons = {
    file: { name: 'file' },
    icons: [{}
        ,{
            name: 'image',
            fileExtensions: [
                'jpg',
                'gif',
                'png'
            ]
	    }
        ,{
            name: 'js',
            fileExtensions: [
                'js',
                'mjs'
            ]
	    }
        ,{
            name: 'ts',
            fileExtensions: ['ts']
	    }
        ,{
            name: 'sh',
            fileExtensions: ['sh']
	    }
        ,{
            name: 'txt',
            fileExtensions: ['txt']
	    }
        ,{
            name: 'svg',
            fileExtensions: ['svg']
	    }
        ,{
            name: 'yaml',
            fileExtensions: ['yaml']
	    }
        ,{
            name: 'markdown',
            fileExtensions: ['md']
	    }
        ,{
            name: 'julia',
            fileExtensions: ['jl']
	    }
        ,{
            name: 'json',
            fileExtensions: ['json']
	    }
        ,{
            name: 'c',
            fileExtensions: ['c']
	    }
        ,{
            name: 'cpp',
            fileExtensions: ['cpp']
	    }
        ,{
            name: 'cs',
            fileExtensions: ['cs']
	    }
        ,{
            name: 'ahkf',
            fileExtensions: ['ahk']
	    }
        ,{
            name: 'ahks',
            fileExtensions: ['ah2']
	    }
        ,{
            name: 'vscode',
            fileExtensions: [
                'vsix',
                'code-workspace'
            ],
            fileNames: [
                'vsc-extension-quickstart.md'
            ]
	    }
        ,{
            name: 'vscode-ignore',
            fileNames: [
                '.vscodeignore'
            ]
	    }
        ,{
            name: 'python',
            fileExtensions: ['py']
	    }
        ,{
            name: 'python-misc',
            fileExtensions: [
                'pyc',
                'whl'
            ],
            fileNames: [
                '.python-version',
                'requirements.txt',
                'pipfile',
                'manifest.in',
                'pylintrc',
                'pyproject.toml',
                'py.typed'
            ]
	    }
        ,{
            name: 'console',
            fileExtensions: ['bash']
	    }
        ,{
            name: 'powershell',
            fileExtensions: [
                'ps1',
                'psm1',
                'psd1',
                'ps1xml',
                'psc1',
                'pssc'
            ]
	    }
        ,{
            name: 'readme',
            fileNames: ['readme.md']
	    }
        ,{
            name: 'git-ignore',
            fileNames: ['.gitignore']
	    }
        ,{
            name: 'license',
            fileNames: [
                'license.txt',
                'license.md'
            ]
	    }
        ,{
            name: 'bun-lock',
            fileNames: ['bun.lockb']
	    }
        ,{
            name: 'bun-config',
            fileNames: ['bunfig.toml']
	    }
        ,{
            name: 'coderabbit',
            fileNames: ['.coderabbit.yaml']
	    }
        ,{
            name: 'eslint',
            fileNames: ['.eslintrc.json']
	    }
        ,{
            name: 'package',
            fileNames: ['package.json']
	    }
        ,{
            name: 'package-lock',
            fileNames: ['package-lock.json']
	    }
        ,{
            name: 'editorconfig',
            fileNames: ['.editorconfig']
	    }
        ,{
            name: 'tsconfig',
            fileNames: ['tsconfig.json']
	    }
        ,{
            name: 'git',
            fileNames: ['.gitattributes']
	    }
        ,{
            name: 'node-ignore',
            fileNames: ['.npmignore']
	    }
        ,{
            name: '',
            fileNames: ['']
	    }
    ]
};







var folderIcons = {
    folder: { name: 'basic' },
    rootFolder: { name: 'root' },
    icons: [{}
        ,{
            name: 'vscode',
            folderNames: ['.vscode']
	    }
        ,{
            name: 'source',
            folderNames: ['src']
	    }
        ,{
            name: 'env',
            folderNames: ['.venv']
	    }
        ,{
            name: 'resources',
            folderNames: ['resources']
	    }
        ,{
            name: 'git',
            folderNames: [
                '.git',
                '.github'
            ]
	    }
        ,{
            name: 'helper',
            folderNames: [
                'helper',
                'helpers'
            ]
	    }
        ,{
            name: 'core',
            folderNames: ['core']
	    }
        ,{
            name: 'dict',
            folderNames: [
                'dict',
                'dictionary'
            ]
	    }
        ,{
            name: 'node',
            folderNames: ['node_modules']
	    }
        ,{
            name: 'script',
            folderNames: ['scripts']
	    }
        ,{
            name: 'tests',
            folderNames: [
                'test',
                'tests',
                '_tests',
                '.vscode-test'
            ]
	    }
        ,{
            name: 'webpack',
            folderNames: ['.devcontainer']
	    }
        ,{
            name: 'js',
            folderNames: ['js']
	    }
        ,{
            name: 'ts',
            folderNames: ['ts']
	    }
        ,{
            name: 'sh',
            folderNames: ['sh']
	    }
        ,{
            name: 'json',
            folderNames: ['json']
	    }
        ,{
            name: 'removed',
            folderNames: [
                '_removed',
                '_X_removed',
                '_XX_removed',
                '_XXX_removed',
                'removed',
                'X_removed',
                'XX_removed',
                'XXX_removed',
                'unused',
                'X_unused',
                'XX_unused',
                'XXX_unused',
                '_unused',
                '_X_unused',
                '_XX_unused',
                '_XXX_unused',
            ]
	    }
        ,{
            name: 'notes',
            folderNames: [
                '.notes',
                '.pnotes',
                'notes',
                'pnotes'
            ]
	    }
        ,{
            name: 'out',
            folderNames: [
                'dist',
                'out'
            ]
	    }
        ,{
            name: 'images',
            folderNames: [
                'images',
                'icons'
            ]
	    }
        ,{
            name: 'theme',
            folderNames: [
                'theme',
                'themes'
            ]
	    }
        ,{
            name: 'python',
            folderNames: [
                'python',
                '.python',
                '_python',
                '__python__'
            ]
	    }
        ,{
            name: 'pycache',
            folderNames: [
                'pycache',
                '.pycache',
                '_pycache',
                '__pycache__',
                'pytest_cache',
                '.pytest_cache',
                '_pytest_cache',
                '__pytest_cache__'
            ]
	    }
    ]
};


var fs = require('fs');
var path = require('path');


var icons = 'resources/icons/';
var fileIconsDirectory = icons + 'file_icons/';
var folderIconsDirectory = icons + 'folder_icons/';


function saveToJson(outputFile, data) {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 4));
}


// Function to transform the data
function transformFileIcons(iconsData) {
    var fileResult = {
        fileExtensions: {},
        fileNames: {},
        file: iconsData.file.name, // Set the default icon
    };

    // Use a Set to keep track of encountered icon names
    var encounteredNames = new Set();

    iconsData.icons.forEach(function (icon) {

        // Check for duplicate icon.name
        if (icon.name && encounteredNames.has(icon.name)) {
            console.warn("Warning: Duplicate icon name found:", icon.name);
        } else if (icon.name) {
            encounteredNames.add(icon.name);
        }

        // Create entries for the "fileExtensions" section
        if (icon.fileExtensions) {
            icon.fileExtensions.forEach(function (ext) {
                if (ext !== "") {
                    fileResult.fileExtensions[ext] = '_' + icon.name;
                }
            });
        }

        // Create entries for the "fileNames" section
        if (icon.fileNames) {
            icon.fileNames.forEach(function (fileName) {
                if (fileName !== "") {
                    fileResult.fileNames[fileName] = '_' + icon.name;
                }
            });
        }

    });
    return fileResult;
}



// Function to transform folder icon data
function transformFolderIcons(iconsData) {
    var folderResult = {
        folderNames: {},
        folderNamesExpanded: {},
        folder: iconsData.folder.name,
        rootFolder: iconsData.rootFolder.name
    };

    // Use a Set to keep track of encountered folder icon names
    var encounteredNames = new Set();

    iconsData.icons.forEach(function (icon) {

        // Check for duplicate icon.name
        if (icon.name && encounteredNames.has(icon.name)) {
            console.warn("Warning: Duplicate folder icon name found:", icon.name);
        } else if (icon.name) {
            encounteredNames.add(icon.name);
        }

        if (icon.folderNames) {
            icon.folderNames.forEach(function (folderName) {
                if (folderName !== "") {
                    folderResult.folderNames[folderName] = '_folder-' + icon.name;
                    folderResult.folderNamesExpanded[folderName] = '_folder-' + icon.name + '-open'; // Assuming you have _open variants
                }
            });
        }
    });
    return folderResult;
}


var transformedIcons = transformFileIcons(fileIcons);
var outputFilePath = path.join(__dirname, 'file_icons.json');
saveToJson(outputFilePath, transformedIcons);
console.log("File icons saved to: ".concat(outputFilePath));

var transformedFolderIcons = transformFolderIcons(folderIcons);
var folderOutputFilePath = path.join(__dirname, 'folder_icons.json');
saveToJson(folderOutputFilePath, transformedFolderIcons);
console.log("Folder icons saved to: " + folderOutputFilePath);

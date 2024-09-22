/** @format */

var fileIcons = {
    file: { name: "file" },
    icons: [
        {
            name: "image",
            fileExtensions: [
                "jpg",
                "gif",
                "png"
            ],
        },
        {
            name: "js",
            fileExtensions: [
                "js",
                "mjs"
            ],
        },
        {
            name: "ts",
            fileExtensions: ["ts"],
        },
        {
            name: "sh",
            fileExtensions: ["sh"],
        },
        {
            name: "txt",
            fileExtensions: ["txt"],
        },
        {
            name: "svg",
            fileExtensions: ["svg"],
        },
        {
            name: "yaml",
            fileExtensions: ["yaml"],
        },
        {
            name: "markdown",
            fileExtensions: ["md"],
        },
        {
            name: "julia",
            fileExtensions: ["jl"],
        },
        {
            name: "json",
            fileExtensions: ["json"],
        },
        {
            name: "c",
            fileExtensions: ["c"],
        },
        {
            name: "cpp",
            fileExtensions: ["cpp"],
        },
        {
            name: "cs",
            fileExtensions: ["cs"],
        },
        {
            name: "ahkf",
            fileExtensions: ["ahk"],
        },
        {
            name: "ahks",
            fileExtensions: ["ah2"],
        },
        {
            name: "vscode",
            fileExtensions: [
                "vsix",
                "code-workspace"
            ],
            fileNames: [
                "vsc-extension-quickstart.md"
            ],
        },
        {
            name: "vscode-ignore",
            fileNames: [".vscodeignore"],
        },
        {
            name: "python",
            fileExtensions: ["py"],
        },
        {
            name: "python-misc",
            fileExtensions: [
                "pyc",
                "whl"
            ],
            fileNames: [
                ".python-version",
                "requirements.txt",
                "pipfile",
                "manifest.in",
                "pylintrc",
                "pyproject.toml",
                "py.typed",
            ],
        },
        {
            name: "console",
            fileExtensions: ["bash"],
        },
        {
            name: "powershell",
            fileExtensions: ["ps1",
                "psm1",
                "psd1",
                "ps1xml",
                "psc1",
                "pssc"
            ],
        },
        {
            name: "readme",
            fileNames: ["readme.md"],
        },
        {
            name: "git-ignore",
            fileNames: [".gitignore"],
        },
        {
            name: "license",
            fileNames: [
                "license.txt",
                "license.md"
            ],
        },
        {
            name: "bun-lock",
            fileNames: ["bun.lockb"],
        },
        {
            name: "bun-config",
            fileNames: ["bunfig.toml"],
        },
        {
            name: "coderabbit",
            fileNames: [".coderabbit.yaml"],
        },
        {
            name: "eslint",
            fileNames: [".eslintrc.json"],
        },
        {
            name: "package",
            fileNames: ["package.json"],
        },
        {
            name: "package-lock",
            fileNames: ["package-lock.json"],
        },
        {
            name: "editorconfig",
            fileNames: [".editorconfig"],
        },
        {
            name: "tsconfig",
            fileNames: ["tsconfig.json"],
        },
        {
            name: "git",
            fileNames: [".gitattributes"],
        },
        {
            name: "node-ignore",
            fileNames: [".npmignore"],
        },
    ],
};


var folderIcons = {
    folder: { name: "basic" },
    rootFolder: { name: "root" },
    icons: [
        {
            name: "vscode",
            folderNames: [".vscode"],
        },
        {
            name: "source",
            folderNames: ["src"],
        },
        {
            name: "env",
            folderNames: [".venv"],
        },
        {
            name: "resources",
            folderNames: ["resources"],
        },
        {
            name: "git",
            folderNames: [
                ".git",
                ".github"
            ],
        },
        {
            name: "helper",
            folderNames: [
                "helper",
                "helpers"
            ],
        },
        {
            name: "core",
            folderNames: ["core"],
        },
        {
            name: "dict",
            folderNames: [
                "dict",
                "dictionary"
            ],
        },
        {
            name: "node",
            folderNames: ["node_modules"],
        },
        {
            name: "script",
            folderNames: ["scripts"],
        },
        {
            name: "tests",
            folderNames: [
                "test",
                "tests",
                "_tests",
                ".vscode-test"
            ],
        },
        {
            name: "webpack",
            folderNames: [".devcontainer"],
        },
        {
            name: "js",
            folderNames: ["js"],
        },
        {
            name: "ts",
            folderNames: ["ts"],
        },
        {
            name: "sh",
            folderNames: ["sh"],
        },
        {
            name: "json",
            folderNames: ["json"],
        },
        {
            name: "removed",
            folderNames: [
                "_removed",
                "_X_removed",
                "_XX_removed",
                "_XXX_removed",
                "removed",
                "X_removed",
                "XX_removed",
                "XXX_removed",
                "unused",
                "X_unused",
                "XX_unused",
                "XXX_unused",
                "_unused",
                "_X_unused",
                "_XX_unused",
                "_XXX_unused",
            ],
        },
        {
            name: "notes",
            folderNames: [
                ".notes",
                ".pnotes",
                "notes",
                "pnotes"
            ],
        },
        {
            name: "out",
            folderNames: [
                "dist",
                "out"
            ],
        },
        {
            name: "images",
            folderNames: [
                "images",
                "icons"
            ],
        },
        {
            name: "theme",
            folderNames: [
                "theme",
                "themes"
            ],
        },
        {
            name: "python",
            folderNames: [
                "python",
                ".python",
                "_python",
                "__python__"
            ],
        },
        {
            name: "pycache",
            folderNames: [
                "pycache",
                ".pycache",
                "_pycache",
                "__pycache__",
                "pytest_cache",
                ".pytest_cache",
                "_pytest_cache",
                "__pytest_cache__",
            ],
        },
    ],
};

const fs = require("fs");
const path = require("path");

const iconsDir = "resources/icons/";
const fileIconsDir = path.join(iconsDir, "file_icons/");
const folderIconsDir = path.join(iconsDir, "folder_icons/");

function saveToJson(outputFile, data) {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 4));
}




function transformIcons(iconsData, type) {
    const result = {
        [`${type}Names`]: {},
    };

    // Only add 'Extensions' for file types
    if (type === 'file') {
        result[`${type}Extensions`] = {};
    }

    const encounteredNames = new Set();

    iconsData.icons.forEach((icon) => {
        if (icon.name && encounteredNames.has(icon.name)) {
            console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
        } else if (icon.name) {
            encounteredNames.add(icon.name);
        }

        if (type === 'file' && icon[`${type}Extensions`]) {
            icon[`${type}Extensions`].forEach(ext => {
                if (ext !== "") {
                    result[`${type}Extensions`][ext] = `_${icon.name}`;
                }
            });
        }

        if (icon[`${type}Names`]) {
            icon[`${type}Names`].forEach(name => {
                if (name !== "") {
                    result[`${type}Names`][name] = `_${icon.name}`;
                }
            });
        }
    });

    return result;
}




// function transformIcons(iconsData, type) {
//     const result = {
//         [`${type}Names`]: {},
//     };

//     if (type === 'file') {
//         result[`${type}Extensions`] = {};
//     }

//     const encounteredNames = new Set();

//     iconsData.icons.forEach((icon) => {
//         if (icon.name && encounteredNames.has(icon.name)) {
//             console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
//         } else if (icon.name) {
//             encounteredNames.add(icon.name);
//         }

//         if (type === 'file' && icon[`${type}Extensions`]) {
//             icon[`${type}Extensions`].forEach(ext => {
//                 if (ext !== "") {
//                     result[`${type}Extensions`][ext] = `_${icon.name}`;
//                 }
//             });
//         }

//         if (icon[`${type}Names`]) {
//             icon[`${type}Names`].forEach(name => {
//                 if (name !== "") {
//                     result[`${type}Names`][name] = `_${icon.name}`;

//                     // Only add expanded folder names when processing folders
//                     if (type === 'folder' && icon[`${type}NamesExpanded`]) {
//                         icon[`${type}NamesExpanded`].forEach(expandedName => {
//                             if (expandedName !== "") {
//                                 result[`${type}NamesExpanded`][expandedName] = `_${icon.name}-open`;
//                             }
//                         });
//                     }
//                 }
//             });
//         }







//     });

//     // result[type] = iconsData[type].name;

//     // result[type] = iconsData[type].name;
//     // result[type] = iconsData[type].name;
//     // result[type] = iconsData[type].name;
//     // result[type] = iconsData[type].name;





//     // "file":               "file",
//     // "folder":             "_folder-basic",
//     // "folderExpanded":     "_folder-basic-open",
//     // "rootFolder":         "_folder-root",
//     // "rootFolderExpanded": "_folder-root-open",



//     return result;
// }


// const combinedIconsData = {
// fileIcons: transformIcons(fileIcons, "file"),
// folderIcons: transformIcons(folderIcons, "folder"),


// };


const combinedIconsData = {
    ...transformIcons(fileIcons, "file"), // Spread the file icon data
    ...transformIcons(folderIcons, "folder"), // Spread the folder icon data
};




// const combinedIconsData = {
//     // 1. Spread properties that should be at the beginning
//     ...transformIcons(fileIcons, "file"),
//     ...transformIcons(folderIcons, "folder"),

//     // 2. Use rest syntax to capture default properties
//     ...({ file, folder, folderExpanded, rootFolder, rootFolderExpanded } =
//         { ...transformIcons(fileIcons, "file"), ...transformIcons(folderIcons, "folder") }),
// };





saveToJson(path.join(__dirname, "icons.json"), combinedIconsData);
console.log(`Icons saved to: ${path.join(__dirname, "icons.json")}`);


// saveToJson(path.join(__dirname, "file_icons.json"), transformIcons(fileIcons, "file"));
// console.log(`File icons saved to: ${path.join(__dirname, "file_icons.json")}`);

// saveToJson(path.join(__dirname, "folder_icons.json"), transformIcons(folderIcons, "folder"));
// console.log(`Folder icons saved to: ${path.join(__dirname, "folder_icons.json")}`);

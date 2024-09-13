/** @format */

const fs = require("fs");
const path = require("path");

const fileIcons = require('../models/file_icons.model.js');
const folderIcons = require('../models/folder_icons.model.js');



const themes = 'themes';
const output_file_path = path.join(themes, 'base_theme.json');

const icons = 'resources/icons';
const file_icons_directory = path.join(icons, 'file_icons');
const folder_icons_directory = path.join(icons, 'folder_icons');

const file_icon_relative = path.relative(themes, file_icons_directory);
const folder_icon_relative = path.relative(themes, folder_icons_directory);







function saveToJson(outputFile, data) {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 4));
}



function generateMetadata(directoryPath) {
    const iconsData = {};
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
            const nameWithoutExt = "_" + path.parse(file).name;
            const filenameWithExt = file;
            const iconPath = path.relative(path.dirname(output_file_path), directoryPath) + filenameWithExt;
            iconsData[nameWithoutExt] = { iconPath };
        }
    }
    return iconsData;
}

function transformIcons(fileIconsData, folderIconsData) {
    const result = {
        iconDefinitions: {}, // Initialize iconDefinitions
        folderNames: {},
        folderNamesExpanded: {},
        fileExtensions: {},
        fileNames: {},
        file: "_file", // Assuming you want a default file icon
        folder: "_folder-basic",
        folderExpanded: "_folder-basic-open",
        rootFolder: "_folder-root",
        rootFolderExpanded: "_folder-root-open",
        languageIds: {},
        hidesExplorerArrows: true,
        highContrast: {
            fileExtensions: {},
            fileNames: {}
        }
    };

    function processIconAssociations(iconsData, type) {
        const encounteredNames = new Set(); // Keep track of encountered icon names
        iconsData.icons.forEach((icon) => {
            if (icon.name && encounteredNames.has(icon.name)) {
                console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
            } else if (icon.name) {
                encounteredNames.add(icon.name); // Add the name to the set if it's not a duplicate
            }

            if (icon.fileExtensions) {
                icon.fileExtensions.forEach(ext => {
                    if (ext !== "") {
                        result.fileExtensions[ext] = `_${icon.name}`;
                        let pathing = path.join(file_icon_relative,icon.name);
                        result.iconDefinitions[`_${icon.name}`] = {
                            // iconPath: `${file_icon_relative}/${icon.name}.svg`
                            iconPath: `${pathing}.svg`

                        };
                    }
                });
            }

            if (icon.fileNames) {
                icon.fileNames.forEach(name => {
                    if (name !== "") {
                        result.fileNames[name] = `_${icon.name}`;
                        let pathing = path.join(file_icon_relative,icon.name);
                        result.iconDefinitions[`_${icon.name}`] = {
                            // iconPath: `${file_icon_relative}/${icon.name}.svg`
                            iconPath: `${pathing}.svg`
                        };
                    }
                });
            }

            if (icon.folderNames) {
                icon.folderNames.forEach(folderName => {
                    if (folderName !== "") {
                        const sanitizedName = icon.name.replace(/[^a-zA-Z0-9-]/g, ''); // Use icon.name here

                        result.folderNames[folderName] = `_folder-${sanitizedName}`;
                        result.folderNamesExpanded[folderName] = `_folder-${sanitizedName}-open`;

                        // result.iconDefinitions[`_folder-${sanitizedName}`] = { iconPath: `./folder_icons/folder-${sanitizedName}.svg` };
                        // result.iconDefinitions[`_folder-${sanitizedName}-open`] = { iconPath: `./folder_icons/folder-${sanitizedName}-open.svg` };

                        let pathing = path.join(folder_icon_relative, `folder-${sanitizedName}`);
                        let open_pathing = path.join(folder_icon_relative, `folder-${sanitizedName}-open`);

                        result.iconDefinitions[`_folder-${sanitizedName}`] = {
                            // iconPath: `${folder_icon_relative}/folder-${sanitizedName}.svg`
                            iconPath: `${pathing}.svg`
                        };

                        result.iconDefinitions[`_folder-${sanitizedName}-open`] = {
                            // iconPath: `${folder_icon_relative}/folder-${sanitizedName}-open.svg`
                            iconPath: `${open_pathing}.svg`
                        };

                    }
                });
            }
        });
    }

    processIconAssociations(fileIconsData, "file");
    processIconAssociations(folderIconsData, "folder");

    const generatedFileIcons = generateMetadata(file_icons_directory);
    const generatedFolderIcons = generateMetadata(folder_icons_directory);

    const combinedIconDefinitions = {};

    Object.assign(combinedIconDefinitions, generatedFileIcons);
    Object.assign(combinedIconDefinitions, generatedFolderIcons);
    Object.assign(combinedIconDefinitions, result.iconDefinitions);

    // Replace result.iconDefinitions with the combined definitions
    result.iconDefinitions = combinedIconDefinitions;

    return result;
}
module.exports = { transformIcons };


if (fs.existsSync(output_file_path)) {
    fs.unlinkSync(output_file_path);
    console.log(`Deleted existing icons file: ${output_file_path}`);
}

const combinedIconsData = transformIcons(fileIcons, folderIcons);
saveToJson(output_file_path, combinedIconsData);
console.log(`Icons saved to: ${output_file_path}`);


















// folder_icon_dictionary:
//
// {
//     name: "source",
//     folderNames: ["src"],
// },


// iconDefinitions:
//
// "_folder-source": {
//     "iconPath": "./folder_icons/folder-source.svg"
// },


// current output:
//
// "src": "_folder-src",


// correct output:
//
// "src": "_folder-source",









// // Process both file and folder icons from dictionary files
// processIconData(fileIconsData, "file");
// processIconData(folderIconsData, "folder");

// // Generate metadata for file and folder icons from directories
// const generatedFileIcons = generateMetadata(file_icons_directory);
// const generatedFolderIcons = generateMetadata(folder_icons_directory);

// // Add generated icons to iconDefinitions
// Object.assign(result.iconDefinitions, generatedFileIcons);
// Object.assign(result.iconDefinitions, generatedFolderIcons);



// // Add generated file icons to fileNames
// for (const [name, data] of Object.entries(generatedFileIcons)) {
//     result.fileNames[name] = data.iconPath;
// }

// // Add generated folder icons to folderNames and folderNamesExpanded
// for (const [name, data] of Object.entries(generatedFolderIcons)) {
//     result.folderNames[name.replace('-open', '')] = name;
//     result.folderNamesExpanded[name.replace('-open', '')] = name;
// }





// function transformIcons(fileIconsData, folderIconsData) {
//     const result = {
//         fileExtensions: {}, // Initialize fileExtensions here
//         fileNames: {},
//         folderNames: {},
//         folderNamesExpanded: {},
//         file: fileIconsData.file.name,
//         folder: `_folder-${folderIconsData.folder.name}`,
//         folderExpanded: `_folder-${folderIconsData.folder.name}-open`,
//         rootFolder: `_folder-${folderIconsData.rootFolder.name}`,
//         rootFolderExpanded: `_folder-${folderIconsData.rootFolder.name}-open`,
//         languageIds: {},
//         hidesExplorerArrows: true,
//         highContrast: {
//             fileExtensions: {},
//             fileNames: {}
//         }
//     };

//     // Function to process icon data (can be reused for files and folders)
//     function processIconData(iconsData, type) {
//         const encounteredNames = new Set();

//         iconsData.icons.forEach((icon) => {
//             if (icon.name && encounteredNames.has(icon.name)) {
//                 console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
//             } else if (icon.name) {
//                 encounteredNames.add(icon.name);
//             }

//             if (icon.fileExtensions) {
//                 icon.fileExtensions.forEach(ext => {
//                     if (ext !== "") {
//                         result.fileExtensions[ext] = `_${icon.name}`;
//                     }
//                 });
//             }

//             if (icon.fileNames) {
//                 icon.fileNames.forEach(name => {
//                     if (name !== "") {
//                         result.fileNames[name] = `_${icon.name}`;
//                     }
//                 });
//             }

//             if (icon.folderNames) {
//                 icon.folderNames.forEach(name => {
//                     if (name !== "") {
//                         result.folderNames[name] = `_folder-${icon.name}`;
//                         result.folderNamesExpanded[name] = `_folder-${icon.name}-open`;
//                     }
//                 });
//             }
//         });
//     }

//     // Process both file and folder icons
//     processIconData(fileIconsData, "file");
//     processIconData(folderIconsData, "folder");

//     return result;
// }






// // Now you can call transformIcons once with both data sets
// const combinedIconsData = transformIcons(fileIcons, folderIcons);

// // saveToJson(path.join(__dirname, "icons.json"), combinedIconsData);
// saveToJson(icons + 'torn_focus_icons.json', combinedIconsData);

// console.log(`Icons saved to: ${path.join(__dirname, "icons.json")}`);


























// function transformIcons(iconsData, type) {
//     const result = {};

//     // Handle default icons for file and folder
//     if (type === 'file') {
//         result[`${type}`] = iconsData[type].name;
//     } else if (type === 'folder') {
//         result[`${type}`] = `_folder-${iconsData[type].name}`;
//         result[`${type}Expanded`] = `_folder-${iconsData[type].name}-open`;
//         result[`root${type}`] = `_folder-${iconsData.rootFolder.name}`;
//         result[`root${type}Expanded`] = `_folder-${iconsData.rootFolder.name}-open`;
//     }

//     // Handle fileExtensions, fileNames, and folderNames
//     if (type === 'file') {
//         result[`${type}Extensions`] = {}; // Only for files
//     }
//     result[`${type}Names`] = {};

//     // Only add 'NamesExpanded' for folder types
//     if (type === 'folder') {
//         result[`${type}NamesExpanded`] = {}; // For expanded folder icons
//     }

//     iconsData.icons.forEach((icon) => {
//         // ... (rest of your code to process icons) ...

//         if (icon[`${type}Names`]) {
//             icon[`${type}Names`].forEach(name => {
//                 if (name !== "") {
//                     result[`${type}Names`][name] = `_${icon.name}`;

//                     // Add expanded folder names ONLY for folders
//                     if (type === 'folder') {
//                         result[`${type}NamesExpanded`][name] = `_${icon.name}-open`;
//                     }
//                 }
//             });
//         }
//     });

//     return result;
// }

// const combinedIconsData = {
//     ...transformIcons(fileIcons, "file"),
//     ...transformIcons(folderIcons, "folder"),
//     // Add other properties like languageIds, hidesExplorerArrows, highContrast
//     "languageIds": {},
//     "hidesExplorerArrows": true,
//     "highContrast": {
//         "fileExtensions": {},
//         "fileNames": {}
//     }
// };

// saveToJson(path.join(__dirname, "icons.json"), combinedIconsData);
// console.log(`Icons saved to: ${path.join(__dirname, "icons.json")}`);








// standard VS Code icon theme format.
// desired structure of the output json file:



// {
//     "folderNames": {

// "js": "_js",
// "js2": "_js2",
// "json": "_json",
// "jl": "_julia",

//     },

//     "folderNamesExpanded": {


// "js": "_js",
// "js2": "_js2",
// "json": "_json",
// "jl": "_julia",


//     },

//     "fileExtensions": {


// "js": "_js",
// "js2": "_js2",
// "json": "_json",
// "jl": "_julia",


//     },

//     "fileNames": {


// "js": "_js",
// "js2": "_js2",
// "json": "_json",
// "jl": "_julia",


//     },

//     "file": "file",

//     "folder": "_folder-basic",
//     "folderExpanded": "_folder-basic-open",

//     "rootFolder": "_folder-root",
//     "rootFolderExpanded": "_folder-root-open",

//     "languageIds": {},
//     "hidesExplorerArrows": true,
//     "highContrast": {
//         "fileExtensions": {},
//         "fileNames": {}
//     }



// }

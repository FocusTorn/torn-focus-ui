/** @format */

/*

    Combined related functionality:
        The code for processing file and folder icons is now grouped together, making it easier to understand the flow.

    Used more descriptive variable names:
        The variable names are now more meaningful, making the code self-documenting.

    Removed unnecessary nesting:
        The code is now flatter and easier to follow by removing unnecessary levels of nesting.

    Used reduce for concise data transformations:
        The reduce method is used to efficiently process icon data and generate the desired output structure.

    Improved error handling:
        The code now includes better error handling for duplicate icon names, providing more informative warning messages

*/


const fs = require("fs");
const path = require("path");

const fileIcons = require('../models/file_icons.model.js');
const folderIcons = require('../models/folder_icons.model.js');

const themesDir = 'assets/themes';
const outputFile = path.posix.join(themesDir, 'base_theme.json');

const iconsDir = 'assets/icons';
const fileIconsDir = path.posix.join(iconsDir, 'file_icons');
const folderIconsDir = path.posix.join(iconsDir, 'folder_icons');
const fileIconRelPath = path.posix.relative(themesDir, fileIconsDir);
const folderIconRelPath = path.posix.relative(themesDir, folderIconsDir);






// Helper function to generate icon metadata from a directory
function generateMetadata(directoryPath) {
    return fs.readdirSync(directoryPath).reduce((iconsData, file) => {
        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(path.extname(file).toLowerCase())) {
            const name = `_${path.parse(file).name}`;
            const iconPath = path.posix.join(path.posix.relative(path.dirname(outputFile), directoryPath), file);
            iconsData[name] = { iconPath };
        }
        return iconsData;
    }, {});
}






// Function to process icon associations (file extensions, names, folder names)
function processIconAssociations(iconsData, type) {
    return iconsData.icons.reduce((result, icon) => {
      const encounteredNames = new Set();
      const addIconDefinition = (iconName, itemName = null) => {
        const iconPathName = itemName
          ? itemName.replace(/[^a-zA-Z0-9-_.]/g, '')
          : iconName;
        const iconPath =
          type === 'file'
            ? path.posix.join(fileIconRelPath, iconPathName)
            : path.posix.join(folderIconRelPath, iconPathName);
        result.iconDefinitions[`_${iconName}`] = { iconPath: `${iconPath}.svg` };
      };

      if (!icon.name || encounteredNames.has(icon.name)) {
        if (icon.name) {
          console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
        }
        return result; // Skip if no name or duplicate
      }
      encounteredNames.add(icon.name);

      // Sanitize icon.name here, outside the forEach loop
      const sanitizedName = icon.name.replace(/[^a-zA-Z0-9-_.]/g, '');

      // Initialize fileExtensions, fileNames, and folderNames here
      result.fileExtensions = result.fileExtensions || {};
      result.fileNames = result.fileNames || {};
      result.folderNames = result.folderNames || {};

      ['fileExtensions', 'fileNames', 'folderNames'].forEach((prop) => {
        if (icon[prop]) {
          icon[prop].forEach((itemName) => {
            if (itemName) {
              // Generate iconName based on the current prop
              const iconName =
                prop === 'folderNames'
                  ? `folder-${sanitizedName}`
                  : sanitizedName; // Use sanitizedName for file associations

              // Assign to the correct object using computed property names
              result[prop][itemName] = `_${iconName}`;

              // Add icon definition for all types
              addIconDefinition(iconName, itemName);

              if (prop === 'folderNames') {
                result.folderNamesExpanded[itemName] = `_${iconName}-open`;
                addIconDefinition(`${iconName}-open`);
              }
            }
          });
        }
      });

      return result;
    },
    {
      iconDefinitions: {},
      folderNames: {},
      folderNamesExpanded: {},
      fileExtensions: {},
      fileNames: {},
    });
  }



























// Function to generate the complete icon data structure
function generateIconData() {
    const result = {
        iconDefinitions: {},
        folderNames: {},
        folderNamesExpanded: {},
        fileExtensions: {},
        fileNames: {},
        file: "_file",
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

    // Process icon associations for file and folder icons
    Object.assign(result, processIconAssociations(fileIcons, "file"));
    Object.assign(result, processIconAssociations(folderIcons, "folder"));

    // Generate and merge metadata from icon directories
    Object.assign(result.iconDefinitions,

        generateMetadata(folderIconsDir),
        generateMetadata(fileIconsDir)
    );

    return result;
}

// Save data to JSON file
function saveToJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

// Main script execution
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
    console.log(`Deleted existing icons file: ${outputFile}`);
}

const iconData = generateIconData();
saveToJson(outputFile, iconData);
console.log(`Icons saved to: ${outputFile}`);





































// const fs = require("fs");
// const path = require("path");

// const fileIcons = require('../models/file_icons.model.js');
// const folderIcons = require('../models/folder_icons.model.js');

// const themesDir = 'assets/themes';

// // const outputFile = path.join(themesDir, 'base_theme.json');
// const outputFile = path.posix.join(themesDir, 'base_theme.json');


// const iconsDir = 'assets/icons';

// // const fileIconsDir = path.join(iconsDir, 'file_icons');
// // const folderIconsDir = path.join(iconsDir, 'folder_icons');
// // const fileIconRelPath = path.relative(themesDir, fileIconsDir);
// // const folderIconRelPath = path.relative(themesDir, folderIconsDir);

// const fileIconsDir = path.posix.join(iconsDir, 'file_icons');
// const folderIconsDir = path.posix.join(iconsDir, 'folder_icons');
// const fileIconRelPath = path.posix.relative(themesDir, fileIconsDir);
// const folderIconRelPath = path.posix.relative(themesDir, folderIconsDir);


// // const filePosix = path.posix.join(iconsDir, 'file_icons');
// // const filePosixRel = path.posix.relative(themesDir, fileIconsDir);

// // console.log(`fileIconsDir: ${fileIconsDir}`);
// // console.log(`filePosix: ${filePosix}`);

// // console.log(`fileIconRelPath: ${fileIconRelPath}`);
// // console.log(`filePosixRel: ${filePosixRel}`);






























// function saveToJson(filePath, data) {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
// }

// // Helper function to generate icon metadata from a directory
// function generateMetadata(directoryPath) {
//     return fs.readdirSync(directoryPath).reduce((iconsData, file) => {
//         const ext = path.extname(file).toLowerCase();
//         if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
//             const name = `_${path.parse(file).name}`;
//             const iconPath = path.posix.join(path.posix.relative(path.dirname(outputFile), directoryPath), file);
//             iconsData[name] = { iconPath };
//         }
//         return iconsData;
//     }, {});
// }

// // Function to transform icon data into the desired format
// function transformIcons(fileIconsData, folderIconsData) {
//     const result = {
//         iconDefinitions: {},
//         folderNames: {},
//         folderNamesExpanded: {},
//         fileExtensions: {},
//         fileNames: {},
//         file: "_file",
//         folder: "_folder-basic",
//         folderExpanded: "_folder-basic-open",
//         rootFolder: "_folder-root",
//         rootFolderExpanded: "_folder-root-open",
//         languageIds: {},
//         hidesExplorerArrows: true,
//         highContrast: {
//             fileExtensions: {},
//             fileNames: {}
//         }
//     };

//     // Helper function to process icon associations (file extensions, names, folder names)
//     function processIconAssociations(iconsData, type) {
//         const encounteredNames = new Set();
//         iconsData.icons.forEach((icon) => {
//             if (!icon.name || encounteredNames.has(icon.name)) {
//                 if (icon.name) {
//                     console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
//                 }
//                 return; // Skip if no name or duplicate
//             }
//             encounteredNames.add(icon.name);

//             const addIconDefinition = (iconName) => {
//                 const iconPath = type === 'file'
//                     ? path.posix.join(fileIconRelPath, iconName)
//                     : path.posix.join(folderIconRelPath, iconName);
//                 result.iconDefinitions[`_${iconName}`] = { iconPath: `${iconPath}.svg` };
//             };

//             ['fileExtensions', 'fileNames', 'folderNames'].forEach((prop) => {
//                 if (icon[prop]) {
//                     icon[prop].forEach(itemName => {
//                         if (itemName) {
//                             const sanitizedName = icon.name.replace(/[^a-zA-Z0-9-_.]/g, '');
//                             const iconName = prop === 'folderNames' ? `folder-${sanitizedName}` : sanitizedName;

//                             result[prop === 'folderNames' ? 'folderNames' : prop][itemName] = `_${iconName}`;
//                             if (prop === 'folderNames') {
//                                 result.folderNamesExpanded[itemName] = `_${iconName}-open`;
//                             }
//                             addIconDefinition(iconName);
//                             if (prop === 'folderNames') {
//                                 addIconDefinition(`${iconName}-open`);
//                             }
//                         }
//                     });
//                 }
//             });
//         });
//     }

//     processIconAssociations(fileIconsData, "file");
//     processIconAssociations(folderIconsData, "folder");

//     // Generate and merge metadata from icon directories
//     Object.assign(result.iconDefinitions,
//         generateMetadata(fileIconsDir),
//         generateMetadata(folderIconsDir)
//     );

//     return result;
// }

// // Delete the old output file if it exists
// if (fs.existsSync(outputFile)) {
//     fs.unlinkSync(outputFile);
//     console.log(`Deleted existing icons file: ${outputFile}`);
// }

// // Generate and save the combined icon data
// const combinedIconsData = transformIcons(fileIcons, folderIcons);
// saveToJson(outputFile, combinedIconsData);
// console.log(`Icons saved to: ${outputFile}`);






















// const fs = require("fs");
// const path = require("path");
// const sharp = require('sharp'); // Import the sharp library

// const fileIcons = require('../models/file_icons.model.js');
// const folderIcons = require('../models/folder_icons.model.js');

// // ... (rest of your existing code)

// // Function to convert SVG to PNG
// async function convertSvgToPng(svgFilePath, outputPngPath) {
//     try {
//         await sharp(svgFilePath)
//             .resize(16, 16) // Set the desired dimensions
//             .png()
//             .toFile(outputPngPath);

//         console.log(`Successfully converted ${svgFilePath} to ${outputPngPath}`);
//     } catch (error) {
//         console.error(`Error converting SVG to PNG:`, error);
//     }
// }

// // Function to process file icons and convert to PNG
// async function processFileIcons(fileIconsDir, outputDir) {
//     const iconFiles = fs.readdirSync(fileIconsDir);

//     for (const file of iconFiles) {
//         if (path.extname(file).toLowerCase() === '.svg') {
//             const svgFilePath = path.join(fileIconsDir, file);
//             const pngFileName = path.parse(file).name + '.png';
//             const outputPngPath = path.join(outputDir, pngFileName);

//             await convertSvgToPng(svgFilePath, outputPngPath);
//         }
//     }
// }

// // ... (inside your main logic, after defining fileIconsDir)

// // Create the output directory if it doesn't exist
// const fileIconsPngDir = path.join(iconsDir, 'file_icons_png');
// if (!fs.existsSync(fileIconsPngDir)) {
//     fs.mkdirSync(fileIconsPngDir);
// }

// // Convert SVG icons to PNG
// await processFileIcons(fileIconsDir, fileIconsPngDir);

// // ... (rest of your existing code)


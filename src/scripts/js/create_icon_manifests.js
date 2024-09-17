
const fs = require("fs");
const path = require("path");


const fileIcons = require('../../dict/file_icons.model.js');
const folderIcons = require('../../dict/file_icons.model.js');


const themesDir = 'assets/themes';

const outputFile = path.posix.join(themesDir, 'base_theme.json');


const iconsDir = 'assets/icons';

const fileIconsDir = path.posix.join(iconsDir, 'file_icons');
const folderIconsDir = path.posix.join(iconsDir, 'folder_icons');
const fileIconRelPath = path.posix.relative(themesDir, fileIconsDir);
const folderIconRelPath = path.posix.relative(themesDir, folderIconsDir);






























function saveToJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

// Helper function to generate icon metadata from a directory
function generateMetadata(directoryPath) {
    return fs.readdirSync(directoryPath).reduce((iconsData, file) => {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
            const name = `_${path.parse(file).name}`;
            const iconPath = path.posix.join(path.posix.relative(path.dirname(outputFile), directoryPath), file);
            iconsData[name] = { iconPath };
        }
        return iconsData;
    }, {});
}

// Function to transform icon data into the desired format
function transformIcons(fileIconsData, folderIconsData) {
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

    // Helper function to process icon associations (file extensions, names, folder names)
    function processIconAssociations(iconsData, type) {
        const encounteredNames = new Set();
        iconsData.icons.forEach((icon) => {
            if (!icon.name || encounteredNames.has(icon.name)) {
                if (icon.name) {
                    console.warn(`Warning: Duplicate ${type} icon name found:`, icon.name);
                }
                return; // Skip if no name or duplicate
            }
            encounteredNames.add(icon.name);

            const addIconDefinition = (iconName) => {
                const iconPath = type === 'file'
                    ? path.posix.join(fileIconRelPath, iconName)
                    : path.posix.join(folderIconRelPath, iconName);
                result.iconDefinitions[`_${iconName}`] = { iconPath: `${iconPath}.svg` };
            };

            ['fileExtensions', 'fileNames', 'folderNames'].forEach((prop) => {
                if (icon[prop]) {
                    icon[prop].forEach(itemName => {
                        if (itemName) {
                            const sanitizedName = icon.name.replace(/[^a-zA-Z0-9-_.]/g, '');
                            const iconName = prop === 'folderNames' ? `folder-${sanitizedName}` : sanitizedName;

                            result[prop === 'folderNames' ? 'folderNames' : prop][itemName] = `_${iconName}`;
                            if (prop === 'folderNames') {
                                result.folderNamesExpanded[itemName] = `_${iconName}-open`;
                            }
                            addIconDefinition(iconName);
                            if (prop === 'folderNames') {
                                addIconDefinition(`${iconName}-open`);
                            }
                        }
                    });
                }
            });
        });
    }

    processIconAssociations(fileIconsData, "file");
    processIconAssociations(folderIconsData, "folder");

    // Generate and merge metadata from icon directories
    Object.assign(result.iconDefinitions,
        generateMetadata(fileIconsDir),
        generateMetadata(folderIconsDir)
    );

    return result;
}

// Delete the old output file if it exists
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
    console.log(`Deleted existing icons file: ${outputFile}`);
}

// Generate and save the combined icon data
const combinedIconsData = transformIcons(fileIcons, folderIcons);
saveToJson(outputFile, combinedIconsData);
console.log(`Icons saved to: ${outputFile}`);




import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import fileIcons from '../../dict/file_icons.model.js';
const FILEICONS = fileIcons;

import folderIcons from '../../dict/folder_icons.model.js';
const FOLDERICONS = folderIcons;

const THEMESDIR = 'assets/themes';
const BASETHEMEFILE = path.posix.join(THEMESDIR, 'base_theme.json');
const THEMEFILE = path.posix.join(THEMESDIR, 'torn_focus_icons.json');

const ICONSDIR = 'assets/icons';
const FILEICONSDIR = path.posix.join(ICONSDIR, 'file_icons');
const FOLDERICONSDIR = path.posix.join(ICONSDIR, 'folder_icons');
const FILEICONRELPATH = path.posix.relative(THEMESDIR, FILEICONSDIR);
const FOLDERICONRELPATH = path.posix.relative(THEMESDIR, FOLDERICONSDIR);

/**
 * Generates metadata for icons in a given directory.
 * It scans the directory for image files (PNG, JPG, JPEG, GIF, BMP, SVG)
 * and creates an object where keys are icon names (prefixed with "_")
 * and values are objects containing the relative path to the icon file.
 *
 * @param {string} directoryPath - The path to the directory containing the icons.
 * @returns {Object} An object containing icon metadata.
 */
function generateMetadata(directoryPath) {
    return fs.readdirSync(directoryPath).reduce((iconsData, file) => {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
            const name = `_${path.parse(file).name}`;
            const iconPath = path.posix.join(path.posix.relative(path.dirname(BASETHEMEFILE), directoryPath), file);
            iconsData[name] = { iconPath };
        }
        return iconsData;
    }, {});
}

/**
 * Adds an icon definition to the result object.
 *
 * @param {Object} result - The result object to modify.
 * @param {string} iconName - The name of the icon.
 * @param {string} type - The type of icon ('file' or 'folder').
 */
function addIconDefinition(result, iconName, type) {
    const iconPath =
        type === 'file' ? path.posix.join(FILEICONRELPATH, iconName) : path.posix.join(FOLDERICONRELPATH, iconName);
    result.iconDefinitions[`_${iconName}`] = { iconPath: `${iconPath}.svg` };
}

/**
 * Processes icon associations for a given icon object, adding entries to the result object
 * for file extensions, file names, and folder names. It also adds icon definitions for
 * the associated icon names.
 *
 * @param {Object} result - The result object to modify, containing icon definitions and associations.
 * @param {Object} icon - The icon object to process, containing name, fileExtensions, fileNames, and folderNames.
 * @param {string} type - The type of icon ('file' or 'folder').
 */

function processIconAssociations(result, icon, type) {
    ['fileExtensions', 'fileNames', 'folderNames'].forEach((prop) => {
        if (icon[prop]) {
            icon[prop].forEach((itemName) => {
                if (itemName) {
                    const sanitizedName = icon.name.replace(/[^a-zA-Z0-9-_.]/g, '');
                    const iconName = prop === 'folderNames' ? `folder-${sanitizedName}` : sanitizedName;

                    result[prop === 'folderNames' ? 'folderNames' : prop][itemName] = `_${iconName}`;
                    if (prop === 'folderNames') {
                        result.folderNamesExpanded[itemName] = `_${iconName}-open`;
                    }
                    addIconDefinition(result, iconName, type);
                    if (prop === 'folderNames') {
                        addIconDefinition(result, `${iconName}-open`, type);
                    }
                }
            });
        }
    });
}

/**
 * Transforms file and folder icon data into a combined icon manifest.
 * It processes both file and folder icon data, checking for duplicates,
 * and generates icon definitions and associations for file extensions,
 * file names, and folder names. It also merges metadata from icon directories.
 *
 * @param {Object} fileIconsData - The file icons data.
 * @param {Object} folderIconsData - The folder icons data.
 * @returns {Object} The combined icon manifest, containing icon definitions,
 *                   folder and file associations, and other theme settings.
 */
function transformIcons(fileIconsData, folderIconsData) {
    const result = {
        iconDefinitions: {},
        folderNames: {},
        folderNamesExpanded: {},
        fileExtensions: {},
        fileNames: {},
        file: '_file',
        folder: '_folder-basic',
        folderExpanded: '_folder-basic-open',
        rootFolder: '_folder-root',
        rootFolderExpanded: '_folder-root-open',
        languageIds: {},
        hidesExplorerArrows: true,
        highContrast: {
            fileExtensions: {},
            fileNames: {},
        },
    };

    for (const iconsData of [fileIconsData, folderIconsData]) {
        const type = iconsData === fileIconsData ? 'file' : 'folder';
        const encounteredNames = new Set();

        iconsData.icons.forEach((icon) => {
            if (!icon.name || encounteredNames.has(icon.name)) {
                if (icon.name) {
                    console.warn(chalk.yellow(`\nWARNING: Duplicate ${type} icon name found: ${icon.name} \n`));
                }
                return;
            }
            encounteredNames.add(icon.name);
            processIconAssociations(result, icon, type);
        });
    }

    Object.assign(result.iconDefinitions, generateMetadata(FILEICONSDIR), generateMetadata(FOLDERICONSDIR));

    return result;
}

async function main() {
    for (const file of [BASETHEMEFILE, THEMEFILE]) {
        if (fs.existsSync(file)) { fs.unlinkSync(file); }
    }

    const combinediconsdata = transformIcons(FILEICONS, FOLDERICONS);

    fs.writeFileSync(BASETHEMEFILE, JSON.stringify(combinediconsdata, null, 4));
    fs.writeFileSync(THEMEFILE, JSON.stringify(combinediconsdata, null, 4));
}

main();

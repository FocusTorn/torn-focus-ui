const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const puppeteer = require('puppeteer');

//- getDotPathToWorkspaceRoot ------------------------------------>> 
/** 
 * Gets the relative dot path from the current directory to the workspace root (containing package.json).
 *
 * @returns {string|null} The relative dot path to the workspace root, or null if not found.
 */
function getDotPathToWorkspaceRoot() {
    let currentDir = __dirname;
    let dotPath = '';
    let levelsUp = 0;

    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.resolve(currentDir, '..');
        dotPath = path.join('..', dotPath); // Prepend ".." to the dotPath
        levelsUp++;

        if (levelsUp > 10) {
            console.error('Could not find workspace root (package.json) after 10 levels.');
            return null;
        }
    }

    return dotPath;
} //----------------------------------------------------------------<<


/**
 * Converts an SVG image to a PNG image using sharp.
 *
 * @param {number} pSize - The desired size (width and height) of the output PNG image in pixels.
 * @param {string} svgFilePath - The path to the input SVG file.
 * @param {string} outputPngPath - The path to save the output PNG file.
 * @returns {Promise<void>} A promise that resolves when the conversion is complete.
 */
async function convertSvgToPng(pSize, svgFilePath, outputPngPath) {
    try {
        await sharp(svgFilePath)
            .resize(pSize, pSize)
            .png()
            .toFile(outputPngPath);
    } catch (error) {
        console.error("Error converting SVG to PNG:", error);
    }
}


/**
 * Creates a directory if it doesn't exist.
 *
 * @param {string} directoryPath - The path to the directory to create.
 * @returns {Promise<void>} A promise that resolves when the directory is created or if it already exists.
 */
async function createDirectory(directoryPath) {
    try {
        await fs.promises.mkdir(directoryPath, { recursive: true });
        console.log(`Successfully created: ${path.basename(directoryPath)}`);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(`Directory already exists: ${path.basename(directoryPath)}`);
        } else {
            console.error("Error during directory operations:", err);
        }
    }
}

/**
 * Converts SVG icons in a directory to PNG icons and saves them to a new directory.
 *
 * @param {number} pSize - The desired size (width and height) of the output PNG icons.
 * @param {string} pSvgIconsDir - The path to the directory containing the SVG icons.
 * @param {string} pPngIconsDir - The path to the directory to save the PNG icons.
 * @param {function} [filter=() => true] - An optional filter function to select specific SVG files.
 * @returns {Promise<void>} A promise that resolves when all icons are converted.
 */
async function convertIcons(pSize, pSvgIconsDir, pPngIconsDir, filter = () => true) {
    const iconFiles = fs.readdirSync(pSvgIconsDir).filter(filter);
    await createDirectory(pPngIconsDir);

    const convertPromises = iconFiles.map(async (file) => {
        const svgFilePath = path.join(pSvgIconsDir, file);
        const pngFileName = `${path.parse(file).name}.png`;
        const outputPngPath = path.join(pPngIconsDir, pngFileName);
        await convertSvgToPng(pSize, svgFilePath, outputPngPath);
    });

    await Promise.all(convertPromises);
}

/**
 * Generates an HTML table row with icon cells.
 *
 * @param {string} iconType - The type of icon (e.g., 'File', 'Folder').
 * @param {string} iconsDir - The path to the directory containing the icons.
 * @param {string[]} files - An array of file names in the icons directory.
 * @param {number} startIndex - The starting index for iterating through the files array.
 * @returns {string} The generated HTML table row string.
 */
function generateIconHTMLRow(iconType, iconsDir, files, startIndex) {
    let htmlContent = '<tr>';

    for (let i = startIndex; i < startIndex + 5 && i < files.length; i++) {
        htmlContent += generateIconCell(iconType, iconsDir, files[i]);
    }

    htmlContent += '</tr>';
    return htmlContent;
}


/**
 * Generates an HTML table cell with an icon and its name.
 *
 * @param {string} iconType - The type of icon (e.g., 'File', 'Folder').
 * @param {string} iconsDir - The path to the directory containing the icons.
 * @param {string} file - The name of the icon file.
 * @returns {string} The generated HTML table cell string.
 */
function generateIconCell(iconType, iconsDir, file) {
    let iconName = path.parse(file).name;

    // Remove "-open" or "folder-" from icon names based on type
    iconName = iconName.replace('-open', '');
    if (iconType === 'Folder' || iconType === 'Folder_Open') {
        iconName = iconName.replace('folder-', '');
    }

    return `
      <td>
        <img src="${path.join('./', path.basename(iconsDir), file)}" alt="${iconName}" title="${iconName}">
      </td>
      <td>${iconName}</td>
    `;
}

/**
 * Generates an HTML file with a table of icons and captures a screenshot of the table.
 *
 * @param {string} pIconType - The type of icon (e.g., 'File', 'Folder').
 * @param {string} pIconsDir - The path to the directory containing the icons.
 * @param {string} pOutputDir - The path to the directory to save the HTML file and screenshot.
 * @returns {Promise<void>} A promise that resolves when the HTML file is generated and the screenshot is captured.
 */
async function generateHTML(pIconType, pIconsDir, pOutputDir) {
    try {
        const files = fs.readdirSync(pIconsDir);
        const outputDir = path.join(pOutputDir, `${pIconType}_icons.html`);
        const htmlContent = generateHTMLContent(pIconType, pIconsDir, files);

        fs.writeFileSync(outputDir, htmlContent);
        console.log(`HTML file generated successfully: ${pIconType}_icons.html`);

        await captureScreenshot(outputDir, pIconType);
    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}

/**
 * Generates the HTML content for an icon table.
 *
 * @param {string} iconType - The type of icon (e.g., 'File', 'Folder').
 * @param {string} iconsDir - The path to the directory containing the icons.
 * @param {string[]} files - An array of file names in the icons directory.
 * @returns {string} The generated HTML content string.
 */
function generateHTMLContent(iconType, iconsDir, files) {
    let htmlContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>${iconType.replace('_', ' ')} Icons</title>
            <style>

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

                body{
                    background-color: #090a0c;
                    margin: 20px;
                    padding: 0;
                }

                div{
                    background-color: #090a0c;
                    text-align: center;
                    width: 1000px;
                    padding: 20px;
                }

                h1{
                    background-color: #090a0c;
                    color: #EEEEEE;
                    text-align: center;
                    margin: 0 auto;
                    padding: 0 0 20px 0;
                }

                table {
                    background-color: #090a0c;
                    color: #EEEEEE;
                    margin: 0 auto;
                    padding: 0;
                    border-collapse: collapse;
                }

                th {
                    font-size: 16px;
                    font-family: "Roboto",Arial, Helvetica, sans-serif;
                    padding: 5px;
                }

                td {
                    font-size: 14px;
                    font-family: "Roboto",Arial, Helvetica, sans-serif;
                    padding: 5px;
                }

                /* Icon columns */
                th:nth-child(odd), td:nth-child(odd) {
                    text-align: center;
                    width: 20px;
                }

                /* Name columns */
                th:nth-child(even), td:nth-child(even) {
                    text-align: left;
                    vertical-align: middle;
                    width: 175px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1>${iconType.replace('_', ' ')} Icons</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody> `;

    for (let i = 0; i < files.length; i += 5) {
        htmlContent += generateIconHTMLRow(iconType, iconsDir, files, i);
    }

    htmlContent += `
                    </tbody>
                </table>
            </div>
        </body>
    </html>`;

    return htmlContent;
}

/**
 * Captures a screenshot of an HTML file using Puppeteer.
 *
 * @param {string} outputDir - The path to the HTML file.
 * @param {string} iconType - The type of icon (used for the screenshot file name).
 * @returns {Promise<void>} A promise that resolves when the screenshot is captured.
 */
async function captureScreenshot(outputDir, iconType) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`file://${outputDir}`);
        const tableElement = await page.$('div');
        await tableElement.screenshot({
            path: path.join(__dirname, '..', '..', '..', 'assets', 'images', `${iconType}_icons_preview.png`)
        });
        console.log(`Table screenshot saved successfully: ${iconType}_icons_preview.png`);
        await browser.close();
    } catch (screenshotError) {
        console.error('Error capturing screenshot:', screenshotError);
    }
}

async function main() {
    const projectRoot = path.resolve(__dirname, getDotPathToWorkspaceRoot());

    const vFileIconsDir = path.join(projectRoot, 'assets', 'icons', 'file_icons');
    const vFolderIconsDir = path.join(projectRoot, 'assets', 'icons', 'folder_icons');

    const vPngIconsDir = path.join(projectRoot, 'assets', 'icons', 'png_icons');
    const vFileIconsPngDir = path.join(vPngIconsDir, 'file_icons_png');
    const vFolderIconsPngDir = path.join(vPngIconsDir, 'folder_icons_png');
    const vFolderOpenIconsPngDir = path.join(vPngIconsDir, 'folder_open_icons_png');

    const tempDirs = [vPngIconsDir, vFileIconsPngDir, vFolderIconsPngDir, vFolderOpenIconsPngDir];
    for (const dir of tempDirs) {
        if (fs.existsSync(dir)) {
            await fs.promises.rm(dir, { recursive: true });
            console.log(`Deleted existing directory: ${dir}`);
        }
        await fs.promises.mkdir(dir);
        console.log(`Created directory: ${dir}`);
    }

    await convertIcons(16, vFileIconsDir, vFileIconsPngDir);
    await generateHTML('File', vFileIconsPngDir, vPngIconsDir);

    await convertIcons(16, vFolderIconsDir, vFolderIconsPngDir, file => !file.endsWith('-open.svg'));
    await generateHTML('Folder', vFolderIconsPngDir, vPngIconsDir);

    await convertIcons(16, vFolderIconsDir, vFolderOpenIconsPngDir, file => file.endsWith('-open.svg'));
    await generateHTML('Folder_Open', vFolderOpenIconsPngDir, vPngIconsDir);
    
    await fs.promises.rm(vPngIconsDir, { recursive: true });
    
}

main();

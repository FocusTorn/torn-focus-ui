const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const puppeteer = require('puppeteer');


async function convertSvgToPng(pSize, svgFilePath, outputPngPath) {
    try {
        await sharp(svgFilePath)
            .resize(pSize, pSize)
            .png()
            .toFile(outputPngPath);
    } catch (error) {
        console.error(`Error converting SVG to PNG:`, error);
    }
}


async function createDirectory(directoryPath) {
    try {
        await fs.promises.mkdir(directoryPath, { recursive: true });
        console.log(`Successfully created: ${path.basename(directoryPath)}`);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(`Directory already exists: ${path.basename(directoryPath)}`);
        } else {
            console.error(`Error during directory operations:`, err);
        }
    }
}


async function convertIcons(pSize, pSvgIconsDir, pPngIconsDir, filter = () => true) {
    const iconFiles = fs.readdirSync(pSvgIconsDir).filter(filter);
    await createDirectory(pPngIconsDir);

    const convertPromises = iconFiles.map(async (file) => {
        const svgFilePath = path.join(pSvgIconsDir, file);
        const pngFileName = path.parse(file).name + '.png';
        const outputPngPath = path.join(pPngIconsDir, pngFileName);
        await convertSvgToPng(pSize, svgFilePath, outputPngPath);
    });

    await Promise.all(convertPromises);
}


function generateIconHTMLRow(iconType, iconsDir, files, startIndex) {
    let htmlContent = '<tr>';

    for (let i = startIndex; i < startIndex + 5 && i < files.length; i++) {
        htmlContent += generateIconCell(iconType, iconsDir, files[i]);
    }

    htmlContent += '</tr>';
    return htmlContent;
}


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


async function generateHTML(iconType, iconsDir) {
    try {
        const files = fs.readdirSync(iconsDir);
        const outputDir = path.join(__dirname, '..', 'png_icons', `${iconType}_icons.html`);
        const htmlContent = generateHTMLContent(iconType, iconsDir, files);

        fs.writeFileSync(outputDir, htmlContent);
        console.log(`HTML file generated successfully: ${iconType}_icons.html`);

        await captureScreenshot(outputDir, iconType);
    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}


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
    const projectRoot = path.resolve(__dirname, '..', '..', '..');

    const vIconsDir = path.join(projectRoot, 'assets', 'icons');
    const vFileIconsDir = path.join(vIconsDir, 'file_icons');
    const vFolderIconsDir = path.join(vIconsDir, 'folder_icons');

    const vPngIconsDir = path.join(projectRoot, 'src', 'generator', 'png_icons');
    const vFileIconsPngDir = path.join(vPngIconsDir, 'file_icons_png');
    const vFolderIconsPngDir = path.join(vPngIconsDir, 'folder_icons_png');
    const vFolderOpenIconsPngDir = path.join(vPngIconsDir, 'folder_open_icons_png');

    const tempDirs = [vFileIconsPngDir, vFolderIconsPngDir, vFolderOpenIconsPngDir];
    for (const dir of tempDirs) {
        if (fs.existsSync(dir)) {
            await fs.promises.rm(dir, { recursive: true });
            console.log(`Deleted existing directory: ${dir}`);
        }
        await fs.promises.mkdir(dir);
        console.log(`Created directory: ${dir}`);
    }

    await convertIcons(16, vFileIconsDir, vFileIconsPngDir);
    await generateHTML('File', vFileIconsPngDir);

    await convertIcons(16, vFolderIconsDir, vFolderIconsPngDir, file => !file.endsWith('-open.svg'));
    await generateHTML('Folder', vFolderIconsPngDir);

    await convertIcons(16, vFolderIconsDir, vFolderOpenIconsPngDir, file => file.endsWith('-open.svg'));
    await generateHTML('Folder_Open', vFolderOpenIconsPngDir);

    for (const dir of tempDirs) {
        await fs.promises.rm(dir, { recursive: true });
        console.log(`Deleted temporary directory: ${dir}`);
    }

    for (const file of ['file_icons.html', 'folder_icons.html', 'folder_open_icons.html']) {
        const filePath = path.join(__dirname, '..', 'png_icons', file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted temporary HTML file: ${filePath}`);
        }
    }
}


main();

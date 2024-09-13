

const fs = require("fs");
const path = require("path");
const sharp = require('sharp');


// Function to convert SVG to PNG
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

async function convertIcons(pSize, pSvgIconsDir, pPngIconsDir) {
    const iconFiles = fs.readdirSync(pSvgIconsDir);

    // Use fs.promises for asynchronous file system operations
    if (fs.existsSync(pPngIconsDir)) {
        try {
            await fs.promises.rm(pPngIconsDir, { recursive: true });
            await fs.promises.mkdir(pPngIconsDir);

            console.log(`Successfully recreated: ${path.basename(pPngIconsDir)}`);

        } catch (err) {
            console.error('Error during directory operations:', err);
        }
    }

    // Convert icons concurrently using Promise.all
    await Promise.all(iconFiles.map(async (file) => {
        if (path.extname(file).toLowerCase() === '.svg' && !file.endsWith('-open.svg')) {
            const svgFilePath = path.join(pSvgIconsDir, file);
            const pngFileName = path.parse(file).name + '.png';
            const outputPngPath = path.join(pPngIconsDir, pngFileName);

            await convertSvgToPng(pSize, svgFilePath, outputPngPath);
        }
    }));
}


// Run the conversion process
// Specify the directories


const vFileIconsDir = path.join(__dirname, '..', '..', '..', 'assets', 'icons', 'file_icons');
const vFileIconsPngDir = path.join(__dirname, '..', 'png_icons','file_icons_png');
convertIcons(16, vFileIconsDir, vFileIconsPngDir);

const vFolderIconsDir = path.join(__dirname, '..', '..', '..', 'assets', 'icons', 'folder_icons');
const vFolderIconsPngDir = path.join(__dirname, '..', 'png_icons','folder_icons_png');
convertIcons(16, vFolderIconsDir, vFolderIconsPngDir);








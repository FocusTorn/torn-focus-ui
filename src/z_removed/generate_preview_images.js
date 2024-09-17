


const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const puppeteer = require('puppeteer');

//--- Convert SVG to PNG C:3 --------------------------------------------------------------------->>

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


//---------------------------------------------------------------------------------------------------<<
//--- createDirectory C:4 --------------------------------------------------------------------------->>


async function createDirectory(directoryPath) {
    try {
        await fs.promises.mkdir(directoryPath, { recursive: true }); // Create recursively
        console.log(`Successfully created: ${path.basename(directoryPath)}`);
    } catch (err) {
        if (err.code === 'EEXIST') { // Ignore if directory already exists
            console.log(`Directory already exists: ${path.basename(directoryPath)}`);
        } else {
            console.error(`Error during directory operations:`, err);
        }
    }
}


//---------------------------------------------------------------------------------------------------<<
//--- convertIcons C:3 ------------------------------------------------------------------------------>>


async function convertIcons(pSize, pSvgIconsDir, pPngIconsDir, filter = () => true) {
    const iconFiles = fs.readdirSync(pSvgIconsDir).filter(filter);

    // Create the output directory
    await createDirectory(pPngIconsDir);

    // Convert icons concurrently using Promise.all
    await Promise.all(iconFiles.map(async (file) => {
        const svgFilePath = path.join(pSvgIconsDir, file);
        const pngFileName = path.parse(file).name + '.png';
        const outputPngPath = path.join(pPngIconsDir, pngFileName);

        await convertSvgToPng(pSize, svgFilePath, outputPngPath);
    }));
}


//---------------------------------------------------------------------------------------------------<<







async function generateHTML(iconType, iconsDir) {
    try {
        const files = fs.readdirSync(iconsDir);

        let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${iconType} Icons</title>
        <style>
          table {
            background-color: #090a0c;
            color: #EEEEEE;
            margin: 0;
            padding: 0;
          }

          th {
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            padding: 5px;
          }

          td {
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            padding: 5px;
          }

          /* Icon columns */
          th:nth-child(odd), td:nth-child(odd) {
            text-align: center;
            width: 16px;
          }

          /* Name columns */
          th:nth-child(even), td:nth-child(even) {
            text-align: left;
            width: 150px;
          }
        </style>
      </head>
      <body style="background-color: #090a0c; margin: 20; padding: 0;">
        <div style="text-align: center; width: fit-content; margin: 0 auto; ">
        <h1 style="color: #EEEEEE; text-align: center;">${iconType} Icons</h1>
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
          <tbody>
    `;

        // Calculate the number of rows needed
        const numRows = Math.ceil(files.length / 5); // Adjusted for 10 columns

        let fileIndex = 0;
        for (let row = 0; row < numRows; row++) {
            htmlContent += '<tr>';
            for (let col = 0; col < 10; col += 2) {
                if (fileIndex < files.length) {
                    const file = files[fileIndex];
                    let iconName = path.parse(file).name;

                    // Remove "-open" from Folder_Open icon names
                    if (iconType === 'Folder_Open') {
                        iconName = iconName.replace('-open', '');
                        iconName = iconName.replace('folder-', '');
                    }

                    if (iconType === 'Folder') {
                        iconName = iconName.replace('folder-', '');
                    }


                    htmlContent += `
            <td>
              <img src="${path.join('./', path.basename(iconsDir), file)}" alt="${iconName}" title="${iconName}">
            </td>
            <td>${iconName}</td>
          `;
                    fileIndex++;
                } else {
                    htmlContent += '<td></td><td></td>';
                }
            }
            htmlContent += '</tr>';
        }

        htmlContent += `
          </tbody>
        </table>
        </div>
      </body>
      </html>
    `;

        const outputDir = path.join(__dirname, '..', 'png_icons', `${iconType}_icons.html`);
        fs.writeFileSync(outputDir, htmlContent);

        console.log(`HTML file generated successfully: ${iconType}_icons.html`);

        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            // Load the generated HTML file
            await page.goto(`file://${outputDir}`);

            // Select the div container element
            const tableElement = await page.$('div');

            // Take a screenshot of the table element
            await tableElement.screenshot({
                path: path.join(__dirname, '..', '..', '..', 'assets', 'images', `${iconType}_icons_preview.png`)
            });

            console.log(`Table screenshot saved successfully: ${iconType}_icons_preview.png`);

            await browser.close();
        } catch (screenshotError) {
            console.error('Error capturing screenshot:', screenshotError);
        }
    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}












async function main() {
    const projectRoot = path.resolve(__dirname, '..', '..', '..'); // Absolute path to project root

    const vIconsDir = path.join(projectRoot, 'assets', 'icons');
    const vFileIconsDir = path.join(vIconsDir, 'file_icons');
    const vFolderIconsDir = path.join(vIconsDir, 'folder_icons');

    const vPngIconsDir = path.join(projectRoot, 'src', 'generator', 'png_icons');
    const vFileIconsPngDir = path.join(vPngIconsDir, 'file_icons_png');
    const vFolderIconsPngDir = path.join(vPngIconsDir, 'folder_icons_png');
    const vFolderOpenIconsPngDir = path.join(vPngIconsDir, 'folder_open_icons_png');

    // Check if directories exist, delete and recreate if they do, otherwise create
    for (const dir of [vFileIconsPngDir, vFolderIconsPngDir, vFolderOpenIconsPngDir]) {
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



    // Delete the temporary directories and HTML files
    for (const dir of [vFileIconsPngDir, vFolderIconsPngDir, vFolderOpenIconsPngDir]) {
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







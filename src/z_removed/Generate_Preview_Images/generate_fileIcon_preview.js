const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const puppeteer = require('puppeteer'); // Import Puppeteer

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

            console.log(`Successfully re-created: ${path.basename(pPngIconsDir)}`);

        } catch (err) {
            console.error('Error during directory re-creation operations:', err);
        }
    } else {
        try {
            await fs.promises.mkdir(pPngIconsDir);

            console.log(`Successfully created: ${path.basename(pPngIconsDir)}`);

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

async function generateHTML() {
    try {
        const iconsDir = path.join(__dirname, '..', 'png_icons', 'file_icons_png');
        const files = fs.readdirSync(iconsDir);

        let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>File Icons</title>
        <style>
          table {
            /*width: 100px;*/      /* Adjusted for 10 columns (40px * 5 + 90px * 5) */
            background-color: #090a0c;
            color: #EEEEEE;
            margin: 0;
            padding: 0;

            /* border: 1px solid #dededf;
            border-collapse: collapse;
            border-spacing: 1px; */

          }

          th {
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;

            padding: 5px;

            /* border: 1px solid #333; */
          }

          td {

            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;

            padding: 5px;

            /* border: 1px solid #333; */
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
        <h1 style="color: #EEEEEE; text-align: center;">File Icons</h1>
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
            for (let col = 0; col < 10; col += 2) { // Increment by 2 to handle icon/name pairs
                if (fileIndex < files.length) {
                    const file = files[fileIndex];
                    const iconName = path.parse(file).name;
                    htmlContent += `
            <td>
              <img src="${path.join('./', 'file_icons_png', file)}" alt="${iconName}" title="${iconName}">
            </td>
            <td>${iconName}</td>
          `;
                    fileIndex++;
                } else {
                    // Add empty cells for both icon and name columns
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

        const outputDir = path.join(__dirname, '..', 'png_icons', 'file_icons.html');
        fs.writeFileSync(outputDir, htmlContent);

        console.log('HTML file generated successfully: file_icons.html');

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Load the generated HTML file
            await page.goto(`file://${outputDir}`);

            // Select the table element
            const tableElement = await page.$('div');

            // Take a screenshot of the table element
            await tableElement.screenshot({

                path: path.join(__dirname, '..', '..', '..', 'assets', 'images', 'file_icons_preview.png')


                // path: path.join(__dirname, '..', 'png_icons', 'file_icons_table.png')
            });

            console.log('Table screenshot saved successfully: file_icons_table.png');

            await browser.close();
        } catch (screenshotError) {
            console.error('Error capturing screenshot:', screenshotError);
        }
    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}

async function main() {
    const vFileIconsDir = path.join(__dirname, '..', '..', '..', 'assets', 'icons', 'file_icons');
    const vFileIconsPngDir = path.join(__dirname, '..', 'png_icons', 'file_icons_png');
    await convertIcons(16, vFileIconsDir, vFileIconsPngDir);

    await generateHTML();
}

main();




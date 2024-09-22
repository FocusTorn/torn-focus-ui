const path = require('node:path');
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

function optimizeIconsInDirectory(iconsDirectory) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'torn-focus-ui-'));

    //- not recursive ------------------------------------------------
    // if (
    //     fs.existsSync(iconsDirectory) &&
    //     fs.readdirSync(iconsDirectory).some((file) => file.startsWith('-') && file.endsWith('.svg'))
    // ) {
    //     const files = fs.readdirSync(iconsDirectory).filter((file) => file.startsWith('-') && file.endsWith('.svg'));

    //- recursive ----------------------------------------------------
    if (fs.existsSync(iconsDirectory) && fs.readdirSync(iconsDirectory).some((file) => file.startsWith('-'))) {
        const files = execSync(`sh -c 'find "${iconsDirectory}" -type f -name "\\-*.svg"'`)
            .toString()
            .trim()
            .split('\n');

        files.forEach((file) => {
            const fileName = path.basename(file);
            const tempOutputFile = path.join(tempDir, fileName);

            try {
                execSync(`svgo -i "${file}" -o "${tempOutputFile}"`);

                const originalSize = fs.statSync(file).size;
                const optimizedSize = fs.statSync(tempOutputFile).size;

                const sizeDifference = optimizedSize - originalSize; // Calculate difference
                const sign = sizeDifference < 0 ? '-' : '+'; // Determine sign
                const percentageChange = ((Math.abs(sizeDifference) / originalSize) * 100).toFixed(1); // Calculate percentage

                if (optimizedSize < originalSize) {
                    const newFileName = fileName.startsWith('-') ? fileName.substring(1) : fileName;
                    const newOutputFile = path.join(iconsDirectory, newFileName);

                    fs.copyFileSync(tempOutputFile, newOutputFile);
                    console.log(
                        `${fileName} -> ${sign}${Math.abs(sizeDifference)} bytes (${sign}${percentageChange}%) -> ${newFileName}`
                    );

                    fs.unlinkSync(file);
                    // console.log(`Deleted original file: ${fileName}`);
                } else {
                    console.log(`Skipping (no size reduction): ${fileName}`);
                }
            } catch (error) {
                console.error(`Error optimizing ${fileName}:`, error);
            }
        });

        fs.rmSync(tempDir, { recursive: true, force: true });
    } else {
        console.log(`\nNo SVG files starting with '-' found in ${iconsDirectory}`);
    }
}

const fileIconsDirectory = path.resolve(__dirname, '../../../assets/icons/file_icons');
const folderIconsDirectory = path.resolve(__dirname, '../../../assets/icons/folder_icons');

optimizeIconsInDirectory(fileIconsDirectory);
optimizeIconsInDirectory(folderIconsDirectory);

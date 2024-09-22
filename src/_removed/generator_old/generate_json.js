const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');



const icons = 'resources/icons/';
const fileIconsDirectory = icons + 'file_icons/';
const folderIconsDirectory = icons + 'folder_icons/';

const output_file = icons + 'OG_torn_focus_icons.json';






// const intermediate_json_location = './src/json/icons_file.json';
const intermediate_json_location = 'src/_removed/generator_old/';

const file_json = intermediate_json_location + 'icons_file.json';
const folder_json = intermediate_json_location + 'icons_folder.json';
const assoc_json = intermediate_json_location + 'icons_assoc.json';








// Function to generate metadata from a directory
async function generateMetadata(directoryPath) {
    const iconsData = {};
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();

        if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
            const imagePath = path.join(directoryPath, file);
            let metadata;
            if (ext === '.svg') {
                metadata = await getSvgMetadata(imagePath);
            } else {
                metadata = getImageMetadata(imagePath);
            }
            const parentDirectory = path.dirname(directoryPath);
            const nameWithoutExt = "_" + path.parse(file).name;
            const filenameWithExt = file;
            const iconPath = './' + path.posix.join(path.basename(directoryPath), filenameWithExt);   //`${filenameWithExt}`;

            iconsData[nameWithoutExt] = { iconPath };
            //iconsData[nameWithoutExt] = { iconPath: iconPath };
            // iconsData[nameWithoutExt] = `${iconPath}`;
            //iconsData[nameWithoutExt] =  `` + iconPath + `` ;




        }
    }

    return iconsData;
}

async function getSvgMetadata(svgPath) {
    const data = fs.readFileSync(svgPath, 'utf8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const width = result.svg.$.width;
    const height = result.svg.$.height;
    return { width, height };
}

function getImageMetadata(imagePath) {
    const filename = path.basename(imagePath);
    const nameWithoutExt = path.parse(filename).name;
    return { filename, nameWithoutExt };
}

// Function to save data to a JSON file
function saveToJson(outputFile, data) {
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 4));
}





async function main() {


    // Generate file icons metadata
    const fileIconsData = await generateMetadata(fileIconsDirectory);
    saveToJson(file_json, { iconDefinitions: fileIconsData });

    // Generate folder icons metadata
    const folderIconsData = await generateMetadata(folderIconsDirectory);
    saveToJson(folder_json, { iconDefinitions: folderIconsData });

    // Combine file and folder icon definitions
    try {
        const data1 = JSON.parse(fs.readFileSync(file_json, 'utf-8'));
        const data2 = JSON.parse(fs.readFileSync(folder_json, 'utf-8'));
        const data3 = JSON.parse(fs.readFileSync(assoc_json, 'utf-8'));

        const combinedData = {
            iconDefinitions: {
                ...data1.iconDefinitions,
                ...data2.iconDefinitions,
            },
            ...data3, // Add _locations object directly
        };

        fs.writeFileSync(output_file, JSON.stringify(combinedData, null, 4));
        console.log('Files successfully combined!');
    } catch (err) {
        console.error('Error reading or writing files:', err);
    }
}



main().catch(err => {
    console.error('Error creating metadata JSON:', err);
});

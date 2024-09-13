// const fs = require('fs');
// const path = require('path');
// const xml2js = require('xml2js');

// async function getSvgMetadata(svgPath) {
//     const data = fs.readFileSync(svgPath, 'utf8');
//     const parser = new xml2js.Parser();
//     const result = await parser.parseStringPromise(data);
//     const width = result.svg.$.width;
//     const height = result.svg.$.height;
//     return {
//         width,
//         height
//     };
// }

// function getImageMetadata(imagePath) {
//     const filename = path.basename(imagePath);
//     const nameWithoutExt = path.parse(filename).name;
//     return {
//         filename,
//         nameWithoutExt
//     };
// }

// async function directoryToJson(directoryPath, outputFile) {
//     const iconsData = {};

//     const files = fs.readdirSync(directoryPath);

//     for (const file of files) {
//         const ext = path.extname(file).toLowerCase();
//         if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext)) {
//             const imagePath = path.join(directoryPath, file);
//             let metadata;
//             if (ext === '.svg') {
//                 metadata = await getSvgMetadata(imagePath);
//             } else {
//                 metadata = getImageMetadata(imagePath);
//             }

//             const nameWithoutExt =  "_" + path.parse(file).name;
//             const filenameWithExt = file;
//             const iconPath = `./icons/${filenameWithExt}`;
//             iconsData[nameWithoutExt] = { iconPath };
//         }
//     }

//     const outputData = { iconDefinitions: iconsData };

//     fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 4));
// }


// const directoryPath = './src/file_icons/icons';
// const outputFile = './src/file_icons/file_icons_definitions.json';

// directoryToJson(directoryPath, outputFile).then(() => {
//     console.log('Metadata JSON created successfully!');
// }).catch(err => {
//     console.error('Error creating metadata JSON:', err);
// });









const IconMetadataGenerator = require('./generateMetadata'); // Import the class

async function main() {
  const directoryPath = './src/file_icons/icons/folders';
  const outputFile = './src/file_icons/_icons_folder.json';

  // Create an instance of the class
  const generator = new IconMetadataGenerator();

  // Call the class methods
  await generator.generateMetadata(directoryPath);
  generator.saveToJson(outputFile);

  console.log('Metadata JSON created successfully!');
}

// Execute the main function
main().catch(err => {
  console.error('Error creating metadata JSON:', err);
});
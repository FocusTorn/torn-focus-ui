const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Class definition
class IconMetadataGenerator {
  constructor() {
    this.iconsData = {};
  }

  async getSvgMetadata(svgPath) {
    const data = fs.readFileSync(svgPath, 'utf8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const width = result.svg.$.width;
    const height = result.svg.$.height;
    return { width, height };
  }

  getImageMetadata(imagePath) {
    const filename = path.basename(imagePath);
    const nameWithoutExt = path.parse(filename).name;
    return { filename, nameWithoutExt };
  }

  async generateMetadata(directoryPath) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if ( !file.startsWith('_') && ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'].includes(ext) ) {
        const imagePath = path.join(directoryPath, file);
        let metadata;
        if (ext === '.svg') {
          metadata = await this.getSvgMetadata(imagePath);
        } else {
          metadata = this.getImageMetadata(imagePath);
        }

        const nameWithoutExt = "_" + path.parse(file).name;
        const filenameWithExt = file;
        const iconPath = `./icons/${filenameWithExt}`;
        this.iconsData[nameWithoutExt] = { iconPath };
      }
    }
  }

  saveToJson(outputFile) {
    const outputData = { iconDefinitions: this.iconsData };
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 4));
  }
}






async function main() {
    
  const file_path = './src/file_icons/';

  
  
  
  
  
  // Generate file icons json
  const fileGenerator = new IconMetadataGenerator();
  await fileGenerator.generateMetadata('./src/file_icons/icons');
  fileGenerator.saveToJson(file_path + '_icons_file.json');

  // Generate folder icons json
  const folderGenerator = new IconMetadataGenerator();
  await folderGenerator.generateMetadata('./src/file_icons/icons/folders');
  folderGenerator.saveToJson(file_path + '_icons_folder.json');


  try {
    const data1 = JSON.parse(fs.readFileSync(file_path + '_icons_file.json', 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(file_path + '_icons_folder.json', 'utf-8'));
    const data3 = JSON.parse(fs.readFileSync(file_path + '_icons_aLocations.json', 'utf-8'));

    // Combine data1 and data2 into a single object
    const combinedData = {
        ...data1.iconDefinitions, // Spread FileDefinitions from data1
        ...data2.iconDefinitions, // Spread FolderDefinitions from data2
      };
    
      // Combine combinedData with data3
      const finalData = {
        ...combinedData,
        ...data3,
      };

    fs.writeFileSync(file_path + 'torn_focus_icons.json', JSON.stringify(finalData, null, 4));
    console.log('Files successfully combined!');
  } catch (err) {
    console.error('Error reading or writing files:', err);
  }
}

// Execute the main function
main().catch(err => {
  console.error('Error creating metadata JSON:', err);
});








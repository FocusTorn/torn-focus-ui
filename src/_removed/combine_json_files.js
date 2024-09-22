

const fs = require('fs');



const file_path = './src/file_icons/';

const file1 = file_path + '_icons_file.json';
const file2 = file_path + '_icons_folder.json';
const file3 = file_path + '_icons_aLocations.json';

const outputFile = file_path + 'torn_focus_icons.json';


try {
    const data1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(file2, 'utf-8'));
    const data3 = JSON.parse(fs.readFileSync(file3, 'utf-8'));
  
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
  
    fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 4));
    
    
    console.log('Files successfully combined!');
} catch (err) {
    console.error('Error reading or writing files:', err);
}
 









//WITH ARGS
//----------------------------------------------------------------
// const fs = require('fs');

// const args = process.argv.slice(2);

// if (args.length < 3) {
//     console.error('Usage: node combine_json.js <file1> <file2> <outputFile>');
//     process.exit(1);
// }

// const [file1, file2, outputFile] = args;

// try {
//     const data1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));
//     const data2 = JSON.parse(fs.readFileSync(file2, 'utf-8'));

//     const combinedData = { ...data1, ...data2 };

//     fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 4));
//     console.log('Files successfully combined!');
// } catch (err) {
//     console.error('Error reading or writing files:', err);
// }



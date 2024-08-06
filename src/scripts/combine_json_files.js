const fs = require('fs');




const file1 = './src/file_icons/file_icons_definitions.json';
const file2 = './src/file_icons/file_icons_base.json';
const outputFile = './src/file_icons/file_icons.json';


try {
    const data1 = JSON.parse(fs.readFileSync(file1, 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(file2, 'utf-8'));

    const combinedData = { ...data1, ...data2 };

    fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 4));
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




const IconMetadataGenerator = require('./generateMetadata'); // Import the class

async function main() {
  const directoryPath = './src/file_icons/icons';
  const outputFile = './src/file_icons/_icons_file.json';

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
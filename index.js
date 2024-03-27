const fs = require('fs');
const path = require('path');
const apng2gif = require('apng2gif');;
const readline = require('node:readline');

function unlimitedGifRepetitions(path) {
  const data = fs.readFileSync(path);

  const index = data.indexOf(Buffer.from([0x21, 0xFF, 0x0B]));
  if (index < 0) {
    throw new Error(`Cannot find Gif Application Extension in ${path}`);
  }

  data[index + 16] = 255;
  data[index + 17] = 255;

  return data;
}

function modifyGif(path) {
  try {
    const modifiedData = unlimitedGifRepetitions(path);
    fs.writeFileSync(path, modifiedData);
    console.log(`${path} loop count changed`);

    const originalPath = path.replace('.gif', '.png');
    fs.unlinkSync(originalPath);
    console.log(`Removed original PNG file: ${originalPath}`);
    console.log(); //add new line
  } catch (error) {
    console.error(`Error modifying ${path}:`, error);
  }
}

function pngToGif(path){
  try {
    const outputPath = `${path.replace('.png', '')}.gif`;
    apng2gif(path, outputPath)
      .then(() => {
        console.log(`APNG to GIF conversion successful => ${outputPath}`);
        modifyGif(outputPath);
      })
      .catch((error) => {
        console.error(`Error converting APNG to GIF: ${path}`, error);
      });

  } catch (error) {
    console.error(`Error converting APNG to GIF: ${path}`, error);
  }
}

function batchModifyGifFilesInDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const fileExtension = path.extname(file);

      if (fileExtension==='.png'){
        pngToGif(filePath)
      }

    });
  });
}

// const directoryPath = 'path';
// batchModifyGifFilesInDirectory(directoryPath);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Input directoryPath?`, directoryPath => {
  const modifiedPath = directoryPath.replace(/\\/g, '/');
  console.log(`Inputted path => ${modifiedPath}`);
  batchModifyGifFilesInDirectory(modifiedPath);
  rl.close();
});
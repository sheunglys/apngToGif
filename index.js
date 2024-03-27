const fs = require('fs');
const path = require('path');
const apng2gif = require('apng2gif');;

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
  } catch (error) {
    console.error(`Error modifying ${path}:`, error);
  }
}

function pngToGif(path){
  try {
    const outputPath = `${path.replace('.png', '')}.gif`;
    apng2gif(path, outputPath)
      .then(() => {
        console.log(`APNG to GIF conversion successful: ${path} => ${outputPath}`);
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

const directoryPath = 'C:/Users/ysli/Downloads/pingrayk/55765018';
batchModifyGifFilesInDirectory(directoryPath);

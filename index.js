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

function pngToGif(path){
  try {
    const outputPath = `${path.replace('.png', '')}.gif`;
    apng2gif(path, outputPath)
      .then(() => {
        console.log(`APNG to GIF conversion successful: ${path} => ${outputPath}`);
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

      // if (fileExtension === '.gif') {
      //   try {
      //     const modifiedData = unlimitedGifRepetitions(filePath);
      //     fs.writeFileSync(filePath, modifiedData);
      //     console.log(`Modified ${file} `);
      //   } catch (error) {
      //     console.error(`Error modifying ${file} :`, error);
      //   }
      // }
    });
  });
}

const directoryPath = 'C:/Users/ysli/Downloads/pingrayk/55765018';
batchModifyGifFilesInDirectory(directoryPath);

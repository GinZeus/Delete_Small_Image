const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const directory = 'D:/code/Kotora/videoAI/Filtered_Dataset_IPH_3.11'; // Thay đổi đường dẫn thư mục của bạn
const widthThreshold = 128;
const heightThreshold = 256;

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error retrieving file stats for ${file}:`, err);
        return;
      }

      if (stats.isFile()) {
        Jimp.read(filePath, (err, image) => {
          if (err) {
            console.error(`Error processing image ${file}:`, err);
            return;
          }

          const { width, height } = image.bitmap;
          if (width < widthThreshold || height < heightThreshold) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting image ${file}:`, err);
              } else {
                console.log(`Deleted ${file}`);
              }
            });
          }
        });
      }
    });
  });
});
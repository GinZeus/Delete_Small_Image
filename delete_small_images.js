const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const rootDirectory = 'D:/code/Kotora/videoAI/Data_16-11_Indoor/log_cam4'; // Thay đổi đường dẫn thư mục gốc của bạn
const widthThreshold = 128;
const heightThreshold = 256;

function deleteSmallImages(directory) {
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
        } else if (stats.isDirectory()) {
          deleteSmallImages(filePath); // Đệ quy vào thư mục con
        }
      });
    });
  });
}

deleteSmallImages(rootDirectory);
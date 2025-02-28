const fs = require("fs");
const path = require("path");

const deleteFile = async (filename) => {
  const filePath = "./uploads/" + filename; // Specify the path to the file you want to delete

  // Asynchronously delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
      return;
    }
    console.log(`File ${filePath} deleted successfully.`);
  });
};
module.exports = deleteFile;

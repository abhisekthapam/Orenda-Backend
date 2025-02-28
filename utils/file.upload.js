const multer = require("multer");

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique suffix
    const ext = file.originalname.split(".").pop(); // Get the file extension
    const filename = file.fieldname + "-" + uniqueSuffix + "." + ext; // Construct the filename
    req.name = filename; // Attach filename to request object
    cb(null, filename);
  },
});

// Create multer instance with custom storage configuration
const upload = multer({ storage: storage });

module.exports = upload;

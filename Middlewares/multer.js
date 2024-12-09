const multer = require('multer');
const path = require('path');

// Set up the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique file names
  },
});

// Create the Multer upload instance with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;

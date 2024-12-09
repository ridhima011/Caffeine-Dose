const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // You can save other review data (name, rating, review) to the database here
  const { name, rating, review } = req.body;

  res.json({
    message: 'Review submitted successfully.',
    filePath: `uploads/${req.file.filename}`,
    name,
    rating,
    review,
  });
});

module.exports = router;

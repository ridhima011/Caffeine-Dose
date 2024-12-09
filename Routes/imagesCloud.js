const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Your Cloudinary configuration
const MenuItem = require('../Modals/MenuItem'); // Your Menu schema
const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON
app.use(express.json());

// Modify route to upload multiple images
app.post('/upload-menu-item', upload.array('images', 5), async (req, res) => { // Allow max 5 files (adjust as needed)
  try {
    const { title, description, price } = req.body;

    // Array to store Cloudinary image URLs
    const imageUrls = [];

    // Loop through all the uploaded files
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Upload each image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, { upload_preset: 'YOUR_UPLOAD_PRESET' });

      // Store the Cloudinary URL for each image
      imageUrls.push(result.secure_url);
    }

    // Save menu item with Cloudinary image URLs in MongoDB
    const newMenuItem = new MenuItem({
      title,
      description,
      price,
      images: imageUrls, // Array of Cloudinary image URLs
    });

    // Save to DB
    await newMenuItem.save();

    res.status(200).json({
      message: 'Menu item added successfully',
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error('Error uploading images or saving to DB:', error);
    res.status(500).json({ message: 'Error uploading images or saving to database' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

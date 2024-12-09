const mongoose = require('mongoose');

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const MenuItem = mongoose.model('Menu', menuItemSchema);
module.exports=MenuItem;

// Create API route to fetch menu items
// app.get('/menu', async (req, res) => {
//   try {
//     const menuItems = await MenuItem.find();
//     res.json(menuItems);
//   } catch (err) {
//     res.status(500).send("Error fetching menu items");
//   }
// });

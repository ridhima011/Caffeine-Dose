// signup and login routes
require('dotenv').config();
const bcrypt = require('bcrypt');
const UserModel = require("../Modals/User");
const jwt = require('jsonwebtoken');
const { sendMail } = require('../Helpers/sendMail');
const adminModel=require('../Modals/Admin');
const Admin = require('../Modals/Admin'); 
const register = async (req, res) => {
  try {
    console.log(req.body); 

    const { name, email, password, adminCode } = req.body;
    const secret = process.env.ADMIN_CODE;

    if (adminCode !== secret) {
      return res.status(403).send("Authorization failed");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const model = new adminModel({ name, email, hashPassword });
    await model.save();

    res.status(201).json({
      message: "Admin registered successfully",
      success: true,
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({
      message: "Failed",
      success: false,
      error: err.message,
    });
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({
        message: "User already exists, you can log in.",
        success: false,
      });
    }

    const userModel = new UserModel({ name, email, password, role });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    // Concatenate email content into one message
    const emailContent = `
    Dear ${name}, thank you for registering!

    Welcome to our Coffee Project!
      
    We are thrilled to have you on board as part of our coffee-loving community.
    Whether you're a seasoned coffee enthusiast or just starting to explore the world of coffee, we’re excited to share this journey with you.

    What’s Next?
      
    -Explore our Coffee Catalog: Dive into our carefully curated selection of coffee blends, brewing equipment, and accessories.
    -Join the Coffee Community: Be sure to check out our blog and social media for the latest news, tips, and brewing guides.
    -Exclusive Offers: As a registered member, you'll be the first to know about special discounts, promotions, and limited-time offers.
      
    If you have any questions, feel free to reach out to us. Our team is here to assist you!
    Once again, thank you for registering! We can’t wait to brew up some amazing experiences together. ☕️
    Warm Regards,
    The Coffee Project Team
    `;

    await sendMail(
      email,
      "Welcome to our Coffee Project",
      emailContent
    );

    res.status(201).json({
      message: "Signup successful!",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const email=req.body();
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(403).json({ message: 'Auth failed, email or password is wrong', success: false });
    }
    
    const isPassEqual = await bcrypt.compare(password, user.password);
    
    if (!isPassEqual) {
      return res.status(403).json({ message: 'Auth failed, email or password is wrong', success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: "Login successful!",
      success: true,
      jwtToken,
      email,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
// Ensure correct path

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request Body in loginAdmin:", req.body);
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found", success: false });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.hashPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      success: true,
    });
  } catch (err) {
    console.error("Error in loginAdmin:", err.message); 
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { loginAdmin };



module.exports = {
  signup,
  login,
  register,
  loginAdmin
};

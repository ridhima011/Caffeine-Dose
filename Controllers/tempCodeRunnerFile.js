const bcrypt=require('bcrypt')
const UserModel=require("../Modals/User")
const jwt=require('jsonwebtoken');
const { sendMail } = require('../Helpers/sendMail');
// const { emitKeypressEvents } = require('readline');
// const { use } = require('../Routes/AuthRouters');
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
                success: false,
            });
        }

        // Generate OTP and hash the password
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const otpExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with OTP and hashed password
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiration,
        });
        await newUser.save();

        // Send OTP email
        await sendMail(
            email,
            "OTP Verification",
            `Your OTP is ${otp}. It is valid for 5 minutes.`,
            `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
        );

        // Return response
        res.status(201).json({
            message: "Signup successful. Please verify your OTP.",
            success: true,
        });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        // Generate token
        const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
           
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
            },
            
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const sendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  
    try {
      await OTPModel.create({ email, otp, createdAt: Date.now() });
  
      await sendMail(email, 'Your OTP Code', `Your OTP is ${otp}`);
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  };
  
  const verifyOtp = async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        // Fetch OTP record
        const record = await OTPModel.findOne({ email });

        if (!record || record.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
            });
        }

        // Check OTP expiration
        if (Date.now() - record.createdAt.getTime() > 5 * 60 * 1000) { // 5 minutes
            return res.status(400).json({
                message: "OTP expired",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email",
                success: false,
            });
        }

        // Create the user after OTP verification
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Remove OTP record
        await OTPModel.deleteOne({ email });

        res.status(201).json({
            message: "Signup successful",
            success: true,
        });
    } catch (err) {
        console.error("Verify OTP Error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};



module.exports = {
    signup,
    login,
    sendOtp,
    verifyOtp
};
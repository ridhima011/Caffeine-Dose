const { signup, login,register,loginAdmin} = require('../Controllers/AuthController');
const { signupValidation, loginupValidation,adminValidation } = require('../Middlewares/AuthValidation');
const authorizeAdmin=require('../Middlewares/adminMiddle')
const router=require('express').Router();

console.log("routers")
router.get("/test",(req,res)=>{
    res.send("testing");
})
router.post("/login",loginupValidation,login);

router.post("/signup",signupValidation,signup)
router.post("/register",authorizeAdmin, adminValidation, register);
router.post("/admin/login",authorizeAdmin, adminValidation, loginAdmin);


// router.post("/verify-otp", verifyOtp); // OTP Verification
// router.post("/resend-otp", resendOtp);
module.exports=router;
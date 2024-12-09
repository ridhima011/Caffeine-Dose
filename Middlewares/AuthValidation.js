const Joi = require('joi');


const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'admin').required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
};


const loginupValidation=(req,res,next)=>{
    const schema=Joi.object({
        
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(100).required(),
    });
    const{error}=schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({message:"bad request",error})
    }
    next();
}


const adminValidation = (req, res, next) => {

  const baseSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

 
  const registerSchema = baseSchema.keys({
    name: Joi.string().min(3).required(),
    adminCode: Joi.string().required(),
  });

 
  const schema = req.body.name || req.body.adminCode ? registerSchema : baseSchema;

  console.log("Request Body in adminValidation:", req.body);
  const { error } = schema.validate(req.body);
  if (error) {
    console.error("Validation Error:", error.message); // Log validation error
    return res.status(400).json({ error: error.message, message: "Bad request" });
  }

  next();
};

  
module.exports={
    signupValidation,
    loginupValidation,
    adminValidation
}
const mongoose=require('mongoose');
const {Schema}=mongoose;
const adminSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true, 
      lowercase: true, 
    },
    hashPassword:{
        type:String,
      required: true
    },



},{ timestamps: true });
const adminModel=mongoose.model('Admin',adminSchema);
module.exports=adminModel;
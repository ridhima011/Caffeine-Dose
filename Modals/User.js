const mongoose=require('mongoose') //store kawayege
const { Schema } = mongoose; 

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});
const UserModel=mongoose.model("users",UserSchema)
module.exports=UserModel;







// const moongose=require('mongoose');
// const { type } = require('os');
// //const {Schema}=moongose
// // const Schema=moongose.Schema();
// const UserSchema=new moongose.Schema({
//     name:{
//         type:String,
//         required:true
        
//     },

// })
// const UserModel=moongose.model("user",UserSchema);
// module.exports=UserModel;
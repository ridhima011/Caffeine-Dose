
const moongose=require('mongoose');

const mongo_url=process.env.MONGO_CONN;
console.log("MONGO_CONN:", process.env.MONGO_CONN);

moongose.connect(mongo_url)
.then(()=>{
    console.log("mongodb connectes")
})
.catch((err)=>{
    console.log(" connection failed",err);
})